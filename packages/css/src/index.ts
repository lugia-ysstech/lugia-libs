/**
 *
 * create by ligx
 *
 * @flow
 */
import * as units from './units';
import getColor from './utilsColor';
import decamelize from './decamelize';

export { units };
export const color = {
  getColor,
};

export function style2css(style: { [key: string]: any } = {}): string {
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
      return val !== undefined && val !== null
        ? `${decamelize(key, '-')}:${val};`
        : '';
    })
    .join('');
}

export function numberToPx(value: number): string {
  return `${value}px`;
}
