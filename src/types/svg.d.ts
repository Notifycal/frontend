declare module '*.svg?react' {
  import type { FC, SVGProps } from 'react';
  const ReactComponent: FC<SVGProps<SVGSVGElement> & { title?: string }>;
  export default ReactComponent;
}

declare module '*.svg' {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  const src: string;
  export default src;
}
