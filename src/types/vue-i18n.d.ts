declare module "vue-i18n" {
  import { Composer } from "vue-i18n";

  export interface I18n {
    global: Composer;
    mode: "legacy" | "composition";
    locale: string;
    fallbackLocale: string;
    messages: Record<string, any>;
  }

  export function createI18n(options: {
    legacy?: boolean;
    locale: string;
    fallbackLocale: string;
    messages: Record<string, any>;
  }): I18n;

  export function useI18n(): {
    t: (key: string, values?: Record<string, any>) => string;
    locale: Ref<string>;
  };
}
