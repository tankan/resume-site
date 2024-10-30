declare module "vite" {
  import { UserConfig } from "vite";
  export function defineConfig(config: UserConfig): UserConfig;
}

declare module "@vitejs/plugin-vue" {
  import { Plugin } from "vite";
  export default function vue(options?: any): Plugin;
}

declare module "unplugin-auto-import/vite" {
  import { Plugin } from "vite";
  export default function AutoImport(options?: any): Plugin;
}

declare module "unplugin-vue-components/vite" {
  import { Plugin } from "vite";
  export default function Components(options?: any): Plugin;
  export interface ComponentResolver {
    type: string;
    resolve: (name: string) => { importName: string; path: string } | null;
  }
}

declare module "unplugin-vue-components/resolvers" {
  import type { ComponentResolver } from "unplugin-vue-components/vite";
  export function ElementPlusResolver(options?: any): ComponentResolver;
}

declare module "vite-plugin-compression" {
  import { Plugin } from "vite";
  interface ViteCompressionOptions {
    verbose?: boolean;
    disable?: boolean;
    threshold?: number;
    algorithm?: "gzip" | "brotliCompress";
    ext?: string;
    deleteOriginFile?: boolean;
  }
  export default function viteCompression(
    options?: ViteCompressionOptions,
  ): Plugin;
}
