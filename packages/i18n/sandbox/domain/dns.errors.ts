import { defineExceptionCatalog, entry } from '../../src';
export const DNS_ERRORS = defineExceptionCatalog({
	namespace: 'dns',
	defaultLocale: 'en',
	definitions: {
		recordNotFound: entry({
			status: 'NOT_FOUND',
			translations: {
				de: 'DNS-Eintrag nicht gefunden',
				en: 'DNS record not found',
				es: 'Registro DNS no encontrado',
				fr: 'Enregistrement DNS introuvable',
				it: 'Record DNS non trovato'
			}
		}),

		invalidRecordType: entry<{ type: string }>({
			status: 'BAD_REQUEST',
			translations: {
				de: 'Ungültiger Eintragstyp: {{type}}',
				en: 'Invalid record type: {{type}}',
				es: 'Tipo de registro inválido: {{type}}',
				fr: "Type d'enregistrement invalide : {{type}}",
				it: 'Tipo di record non valido: {{type}}'
			}
		}),

		zoneAlreadyExists: entry<{ zone: string }>({
			status: 'CONFLICT',
			translations: {
				de: 'Zone "{{zone}}" existiert bereits',
				en: 'Zone "{{zone}}" already exists',
				es: 'La zona "{{zone}}" ya existe',
				fr: 'La zone "{{zone}}" existe déjà',
				it: 'La zona "{{zone}}" esiste già'
			}
		}),

		ttlOutOfRange: entry<{ min: string; max: string }>({
			status: 'BAD_REQUEST',
			translations: {
				de: 'TTL muss zwischen {{min}} und {{max}} liegen',
				en: 'TTL must be between {{min}} and {{max}}',
				es: 'El TTL debe estar entre {{min}} y {{max}}',
				fr: 'Le TTL doit être compris entre {{min}} et {{max}}',
				it: 'Il TTL deve essere compreso tra {{min}} e {{max}}'
			}
		})
	}
});
