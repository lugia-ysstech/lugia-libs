/**
 *
 * create by ligx
 *
 * @flow
 */

export function always(val: any): () => any {
  return () => val;
}

export const alwaysEmptyString = always('');
