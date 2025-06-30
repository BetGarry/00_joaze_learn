/// <reference types="vite/client" />

declare module '*.vjson' {
  const value: any;
  export default value;
}
declare module '*.vjson?raw' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_SHAPEDIVER_TICKET: string
  readonly VITE_SHAPEDIVER_URL?: string
  readonly VITE_APP_TITLE?: string
  readonly VITE_APP_VERSION?: string
  readonly VITE_ENABLE_DEBUG_UI?: string
  readonly VITE_ENABLE_PERFORMANCE_MONITORING?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 