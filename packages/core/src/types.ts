export interface Font {
  name: string;
  author: string;
  source: string;
  license: string;
  copyright: string;
  format?: 'flf' | 'tlf';
}

export interface GenerateOptions {
  font?: string;
  width?: number;
  horizontalLayout?: 'default' | 'full' | 'fitted' | 'controlled smushing';
  verticalLayout?: 'default' | 'fitted' | 'controlled smushing';
}

export interface AsciiError {
  error: string;
  code: string;
}

export type AnimationKind = 'morph' | 'reveal' | 'wave';
