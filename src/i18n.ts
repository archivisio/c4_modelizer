import enTranslation from '@locales/en/translation.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { 
      escapeValue: false,
      format: (value, format) => {
        if (format === 'capitalize') {
          return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
      }
    },
  });

export default i18n;
