
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import ptBRTranslations from './locales/pt-BR.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      'pt-BR': { translation: ptBRTranslations }
    },
    lng: 'pt-BR',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
