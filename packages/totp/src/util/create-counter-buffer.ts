/**
 * Creates an ArrayBuffer representing the counter value for HOTP/TOTP generation.
 *
 * @param counter The counter value, either as a number or bigint.
 *
 * @returns An ArrayBuffer representing the counter value.
 */
export const createCounterBuffer = (counter: number | bigint): ArrayBuffer => {
	const counterBuffer = new ArrayBuffer(8);
	const counterView = new DataView(counterBuffer);
	const counterBigInt = typeof counter === 'bigint' ? counter : BigInt(Math.floor(counter));
	counterView.setBigUint64(0, counterBigInt, false);
	return counterBuffer;
};
