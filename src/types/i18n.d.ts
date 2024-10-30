import type { _DefineLocaleMessage } from 'vue-i18n'

declare module "vue-i18n" {
  export interface DefineLocaleMessage {
    nav: {
      title: string;
      home: string;
      about: string;
      skills: string;
      projects: string;
    };
    actions: {
      download: string;
      contact: string;
      viewMore: string;
      themeConfig: string;
    };
    messages: {
      downloadSuccess: string;
      downloadError: string;
      localeChanged: string;
      themeSaved: string;
    };
    theme: {
      title: string;
      mode: string;
      primaryColor: string;
      textColor: string;
      backgroundColor: string;
      reset: string;
    };
    error: {
      title: string;
      defaultMessage: string;
      retry: string;
      back: string;
      networkError: string;
      serverError: string;
      notFound: string;
    };
    seo: {
      title: string;
      description: string;
      keywords: string;
    };
  }
}
