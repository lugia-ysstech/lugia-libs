/**
 * @Author:cuixiawang
 * @Date:2021/10/22
 */
import CSSComponent, { css } from '@lugia/theme-css-hoc';
import { CSSThemeProps, ThemeMeta } from '@lugia/theme-core/lib/type';

export const Container = CSSComponent({
  tag: 'div',
  className: 'Container',
  normal: {
    selectNames: [['height']],
    getCSS(themeMeta: ThemeMeta, themeProps: CSSThemeProps) {
      const { width = '' } = themeMeta;
      const { propsConfig } = themeProps;
      const { parentWidth }: { parentWidth?: number } = propsConfig || {
        parentWidth: 0,
      };
      if (width && typeof width === 'string') {
        if (width.endsWith('%')) {
          const widthNumber = Number(width.split('%')[0]) / 100 || 1;
          return `width:calc(${parentWidth}px * ${widthNumber} )`;
        }
        return `width:${width}`;
      }

      if (typeof width === 'number') {
        return `width:${width}px`;
      }

      return `width:${parentWidth}px`;
    },
  },
  css: css`
    height: 100%;
  `,
});
