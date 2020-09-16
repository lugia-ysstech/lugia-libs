import { ThemeConfig } from '@lugia/theme-core/lib/type';
import { ReactNode } from 'react';

export interface ThemeConfigProps {
  config: { [key: string]: ThemeConfig };
  globalConfig: { [key: string]: ThemeConfig };
  className?: string;
  children?: ReactNode;
}
