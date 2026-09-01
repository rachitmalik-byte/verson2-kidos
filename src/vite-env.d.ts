/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import React from 'react';
  const src: string;
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default src;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
