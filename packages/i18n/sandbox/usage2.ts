import type { ResolvedMessage } from '#/message/type/resolved-message';
import { LocalizedHttpException, resolveMessage } from '../src';
import { DNS_ERRORS } from './domain/dns.errors';
import { DNS_MESSAGES } from './domain/dns.messages';

const notFound: LocalizedHttpException = DNS_ERRORS.invalidRecordType({ type: 'TXT' });
const recordCreated: ResolvedMessage = DNS_MESSAGES.recordUpdated({ domain: 'example.com' });

const resolvedNotFound = resolveMessage(notFound, 'fr');
const resolvedRecordCreated = resolveMessage(recordCreated, 'fr');

console.log(resolvedNotFound);
console.log(resolvedRecordCreated);

try {
	throw DNS_ERRORS.ttlOutOfRange({ min: '60', max: '86400' });
} catch (error) {
	if (error instanceof LocalizedHttpException) console.error(resolveMessage(error, 'es'));
}
