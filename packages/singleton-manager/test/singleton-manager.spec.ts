import { afterEach, describe, expect, test } from 'bun:test';

import { SingletonManager } from '#/singleton-manager';
import { SINGLETON_MANAGER_ERROR_KEYS } from '#/enums/singleton-manager-error-keys';

class FakeService {
	public readonly value: string;

	public constructor(value: string) {
		this.value = value;
	}
}

afterEach(() => {
	SingletonManager.clear();
});

describe.concurrent('SingletonManager', () => {
	describe.concurrent('register / get', () => {
		test('should store and return the exact same instance', () => {
			const service = new FakeService('original');
			SingletonManager.register('Service', service);

			const retrieved = SingletonManager.get<FakeService>('Service');
			expect(retrieved).toBe(service);
			expect(retrieved.value).toBe('original');
		});

		test('should throw on duplicate registration', () => {
			SingletonManager.register('Service', new FakeService('first'));

			expect(() => SingletonManager.register('Service', new FakeService('second'))).toThrow(
				SINGLETON_MANAGER_ERROR_KEYS.CLASS_INSTANCE_ALREADY_REGISTERED
			);
		});

		test('should throw when getting an unregistered name', () => {
			expect(() => SingletonManager.get('Unknown')).toThrow(
				SINGLETON_MANAGER_ERROR_KEYS.CLASS_INSTANCE_NOT_REGISTERED
			);
		});

		test('should support multiple independent registrations', () => {
			const a = new FakeService('a');
			const b = new FakeService('b');

			SingletonManager.register('A', a);
			SingletonManager.register('B', b);

			expect(SingletonManager.get<FakeService>('A')).toBe(a);
			expect(SingletonManager.get<FakeService>('B')).toBe(b);
		});
	});

	describe.concurrent('unregister', () => {
		test('should remove a registered instance', () => {
			SingletonManager.register('Service', new FakeService('x'));
			SingletonManager.unregister('Service');

			expect(SingletonManager.has('Service')).toBe(false);
		});

		test('should throw when unregistering an unknown name', () => {
			expect(() => SingletonManager.unregister('Ghost')).toThrow(
				SINGLETON_MANAGER_ERROR_KEYS.CLASS_INSTANCE_NOT_REGISTERED
			);
		});

		test('should allow re-registration after unregistering', () => {
			const first = new FakeService('v1');
			const second = new FakeService('v2');

			SingletonManager.register('Service', first);
			SingletonManager.unregister('Service');
			SingletonManager.register('Service', second);

			expect(SingletonManager.get<FakeService>('Service')).toBe(second);
		});
	});

	describe.concurrent('has', () => {
		test('should return true for registered and false for unregistered names', () => {
			expect(SingletonManager.has('Service')).toBe(false);

			SingletonManager.register('Service', new FakeService('x'));
			expect(SingletonManager.has('Service')).toBe(true);
		});
	});

	describe.concurrent('clear', () => {
		test('should remove all registered instances', () => {
			SingletonManager.register('A', new FakeService('a'));
			SingletonManager.register('B', new FakeService('b'));

			SingletonManager.clear();

			expect(SingletonManager.has('A')).toBe(false);
			expect(SingletonManager.has('B')).toBe(false);
		});
	});
});
