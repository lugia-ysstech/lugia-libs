/**
 *
 * create by ligx
 *
 * @flow
 */
import { always, alwaysEmptyString } from '../src/index';

describe('ramada', () => {
  it('always', () => {
    expect(always(5)()).toBe(5);
    let val = [1, 2, 3];
    expect(always(val)()).toBe(val);
  });
  it('alwaysEmptyString', () => {
    expect(alwaysEmptyString()).toBe('');
  });
});
