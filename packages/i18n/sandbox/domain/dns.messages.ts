import { defineMessageCatalog, entry } from '../../src';

export const DNS_MESSAGES = defineMessageCatalog({
	defaultLocale: 'fr',
	definitions: {
		recordCreated: entry({
			translations: {
				de: 'DNS-Eintrag erfolgreich erstellt',
				en: 'DNS record created successfully',
				es: 'Registro DNS creado con éxito',
				fr: 'Enregistrement DNS créé avec succès',
				it: 'Record DNS creato con successo'
			}
		}),

		recordUpdated: entry<{ domain: string }>({
			translations: {
				de: 'Eintrag für "{{domain}}" aktualisiert',
				en: 'Record for "{{domain}}" updated',
				es: 'Registro de "{{domain}}" actualizado',
				fr: 'Enregistrement pour "{{domain}}" mis à jour',
				it: 'Record per "{{domain}}" aggiornato'
			}
		}),

		propagationPending: entry<{ zone: string; minutes: string }>({
			translations: {
				de: 'DNS-Propagierung für "{{zone}}" dauert ca. {{minutes}} Minuten',
				en: 'DNS propagation for "{{zone}}" will take approximately {{minutes}} minutes',
				es: 'La propagación DNS de "{{zone}}" tardará aproximadamente {{minutes}} minutos',
				fr: 'La propagation DNS pour "{{zone}}" prendra environ {{minutes}} minutes',
				it: 'La propagazione DNS per "{{zone}}" richiederà circa {{minutes}} minuti'
			}
		})
	}
});
