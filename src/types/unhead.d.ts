declare module "@unhead/vue" {
  import { Plugin } from "vue";

  export interface Head {
    title?: string | (() => string);
    meta?: Array<{
      name?: string;
      property?: string;
      content: string | (() => string);
    }>;
  }

  export function createHead(): Plugin;
  export function useHead(head: Head): void;
}
