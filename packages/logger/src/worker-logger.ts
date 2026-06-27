import type { BunMessageEvent } from 'bun';

import type { LogLevels } from './types/log-levels';
import type { LoggerSink } from './types/logger-sink';

interface LogEntry {
	readonly sinkNames: string[];
	readonly level: LogLevels;
	readonly timestamp: number;
	readonly object: unknown;
}

type WorkerMessage =
	| {
			type: 'REGISTER_SINK';
			sinkName: string;
			sinkFactoryString: string;
			sinkArgs: unknown[];
	  }
	| {
			type: 'LOG_BATCH';
			logs: LogEntry[];
	  }
	| { type: 'FLUSH' }
	| { type: 'CLOSE' };

export const workerFunction = (): void => {
	const sinks: Record<string, LoggerSink> = {};
	const self: Worker = globalThis as unknown as Worker;

	/**
	 * Process a single log entry across all target sinks.
	 *
	 * @returns A promise resolving once every async sink has settled, or `undefined`
	 * when all targeted sinks are synchronous (so the caller can skip awaiting).
	 */
	const processLogEntry = (log: LogEntry): Promise<void> | undefined => {
		const { sinkNames, level, timestamp, object } = log;
		const len = sinkNames.length;
		let promises: Promise<void>[] | undefined;
		for (let i = 0; i < len; ++i) {
			const sinkName = sinkNames[i];
			if (sinkName === undefined) continue;
			const sink = sinks[sinkName];
			if (!sink) continue;

			try {
				const result = sink.log(level, timestamp, object);
				// Handle async sinks - track them so flush() can await completion.
				if (result instanceof Promise) {
					const guarded = result.catch((error: unknown) => {
						self.postMessage({
							type: 'SINK_LOG_ERROR',
							sinkName,
							error,
							object
						});
					});
					(promises ??= []).push(guarded);
				}
			} catch (error) {
				// Handle sync errors
				self.postMessage({
					type: 'SINK_LOG_ERROR',
					sinkName,
					error,
					object
				});
			}
		}
		return promises === undefined ? undefined : Promise.all(promises).then(() => undefined);
	};

	self.addEventListener('message', (event: BunMessageEvent<WorkerMessage>) => {
		switch (event.data.type) {
			case 'REGISTER_SINK': {
				const { sinkName, sinkFactoryString, sinkArgs } = event.data;

				try {
					// Re-evaluate the serialized factory and invoke it with the forwarded args.
					const create = new Function(
						'sinkArgs',
						`return (${sinkFactoryString})(...sinkArgs);`
					) as (args: unknown[]) => LoggerSink;

					sinks[sinkName] = create(sinkArgs);
				} catch (error) {
					self.postMessage({
						type: 'REGISTER_SINK_ERROR',
						sinkName,
						error
					});
				}
				break;
			}
			case 'LOG_BATCH': {
				const { logs } = event.data;
				const len = logs.length;
				let pending: Promise<void>[] | undefined;
				for (let i = 0; i < len; ++i) {
					const result = processLogEntry(logs[i] as LogEntry);
					if (result !== undefined) (pending ??= []).push(result);
				}

				// Acknowledge only once every async sink in the batch has settled, so
				// the main thread's flush() reflects real completion.
				if (pending === undefined) self.postMessage({ type: 'BATCH_COMPLETE' });
				else
					void Promise.all(pending).then(() =>
						self.postMessage({ type: 'BATCH_COMPLETE' })
					);
				break;
			}
			case 'FLUSH': {
				let pending: Promise<void>[] | undefined;
				for (const [sinkName, sink] of Object.entries(sinks))
					try {
						const result = sink.flush?.();
						if (result instanceof Promise) {
							const guarded = result.catch((error: unknown) => {
								self.postMessage({
									type: 'SINK_LOG_ERROR',
									sinkName,
									error,
									object: undefined
								});
							});
							(pending ??= []).push(guarded);
						}
					} catch (error) {
						self.postMessage({
							type: 'SINK_LOG_ERROR',
							sinkName,
							error,
							object: undefined
						});
					}

				if (pending === undefined) self.postMessage({ type: 'FLUSH_COMPLETE' });
				else
					void Promise.all(pending).then(() =>
						self.postMessage({ type: 'FLUSH_COMPLETE' })
					);
				break;
			}
			case 'CLOSE': {
				const entries = Object.entries(sinks);
				for (const [name, sink] of entries)
					try {
						void sink.close?.();
					} catch (error) {
						self.postMessage({
							type: 'SINK_CLOSE_ERROR',
							sinkName: name,
							error
						});
					}

				self.postMessage({ type: 'CLOSE_COMPLETE' });
				break;
			}
			default:
				break;
		}
	});
};
