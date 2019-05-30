/**
 *
 * create by ligx
 *
 * @flow
 */
import * as units from './units';
import getColor from './utilsColor';
import decamelize from 'decamelize';

export { units };
export const color = {
  getColor,
};

export function style2css(style: Object): string {
  if (!style) {
    return '';
  }
  const keys = Object.keys(style);
  if (keys.length === 0) {
    return '';
  }
  return keys
    .map((key: string) => {
      const val = style[key];
      return val ? `${decamelize(key, '-')}:${val};` : '';
    })
    .join('');
}
