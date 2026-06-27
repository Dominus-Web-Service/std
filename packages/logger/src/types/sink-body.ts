import type { LoggerSink } from './logger-sink';

export type SinkBody<TSink, Key extends keyof TSink> =
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TSink[Key] extends (...args: any[]) => LoggerSink<infer TBody> ? TBody : never;
