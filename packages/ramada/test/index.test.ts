/**
 *
 * create by ligx
 *
 * @flow
 */
import { always, alwaysEmptyString } from '../src';

describe('ramada', () => {
  it('always', () => {
    expect(always(5)()).toBe(5);
    const val = [1, 2, 3];
    expect(always(val)()).toBe(val);
  });
  it('alwaysEmptyString', () => {
    expect(alwaysEmptyString()).toBe('');
  });
});
