import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import english from '../locales/en_US.json';
import french from '../locales/fr_FR.json';
import * as RNLocalize from 'react-native-localize';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: callback => {
    return callback(RNLocalize.getLocales()[0].languageCode);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallBackLgn: 'en',
    resources: {
      en: english,
      fr: french,
    },
    interpolation: {escapeValue: true},
  });

export default i18n;
