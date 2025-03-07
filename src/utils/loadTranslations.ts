import en from '../locales/en.json';
import es from '../locales/es.json'
import fr from '../locales/fr.json'

type Translations = Record<string, typeof en>;

const translations: Translations = {
  en,
  es,
  fr,
};

export const loadTranslations = (language: string) => {
  const languageCode = language.split('-')[0];
  return translations[languageCode] || translations['en'];
};
