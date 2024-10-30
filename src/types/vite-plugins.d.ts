declare module "vite-plugin-pwa" {
  import { Plugin } from "vite";
  export interface VitePWAOptions {
    registerType?: "autoUpdate" | "prompt";
    includeAssets?: string[];
    manifest?: Record<string, any>;
    workbox?: {
      cleanupOutdatedCaches?: boolean;
      runtimeCaching?: Array<{
        urlPattern: RegExp;
        handler: string;
        options?: Record<string, any>;
      }>;
    };
  }
  export function VitePWA(options?: VitePWAOptions): Plugin;
}

declare module "unplugin-auto-import/vite" {
  import { Plugin } from "vite";
  export default function AutoImport(options?: any): Plugin;
}

declare module "unplugin-vue-components/vite" {
  import { Plugin } from "vite";
  export default function Components(options?: any): Plugin;
}

declare module "unplugin-vue-components/resolvers" {
  export const ElementPlusResolver: () => any;
}

declare module "vite-plugin-compression" {
  import { Plugin } from "vite";
  export default function viteCompression(options?: any): Plugin;
}
