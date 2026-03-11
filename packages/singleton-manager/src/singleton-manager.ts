import { InternalError } from '@dws/error';

import { SINGLETON_MANAGER_ERROR_KEYS } from './enums/singleton-manager-error-keys';

/**
 * Centralized registry for singleton instances.
 *
 * Register instances by name and retrieve them anywhere with type safety.
 */
export class SingletonManager {
	private static readonly _registry = new Map<string, unknown>();

	/**
	 * Registers an instance under the given name.
	 *
	 * @template TClass - The type of the class instance.
	 *
	 * @param name - The name of the class.
	 * @param instance - The instance of the class to register as singleton.
	 *
	 * @throws ({@link InternalError}) – If `name` is already registered.
	 */
	public static register<TClass extends object>(name: string, instance: TClass): void {
		if (this._registry.has(name))
			throw new InternalError(
				SINGLETON_MANAGER_ERROR_KEYS.CLASS_INSTANCE_ALREADY_REGISTERED,
				{ name }
			);
		this._registry.set(name, instance);
	}

	/**
	 * Removes a registered instance by name.
	 *
	 * @param name - The name of the class to unregister.
	 *
	 * @throws ({@link InternalError}) – If `name` is not registered.
	 */
	public static unregister(name: string): void {
		if (!this._registry.delete(name))
			throw new InternalError(SINGLETON_MANAGER_ERROR_KEYS.CLASS_INSTANCE_NOT_REGISTERED, {
				name
			});
	}

	/**
	 * Returns the instance registered under `name`.
	 *
	 * @template TClass - The type of the class instance.
	 *
	 * @param name - The name of the class to retrieve.
	 *
	 * @throws ({@link InternalError}) – If `name` is not registered.
	 */
	public static get<TClass>(name: string): TClass {
		const instance = this._registry.get(name);
		if (!instance)
			throw new InternalError(SINGLETON_MANAGER_ERROR_KEYS.CLASS_INSTANCE_NOT_REGISTERED, {
				name
			});
		return instance as TClass;
	}

	/**
	 * Returns `true` if `name` is registered.
	 *
	 * @param name - The name of the class to check.
	 */
	public static has(name: string): boolean {
		return this._registry.has(name);
	}

	/** Removes all registered instances. */
	public static clear(): void {
		this._registry.clear();
	}
}
