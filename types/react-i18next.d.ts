import i18n, { resources } from '@/plugins/i18n';

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof i18n;
    returnNull: false;
    returnEmptyString: true;
    resources: (typeof resources)['ja'];
  }
}
