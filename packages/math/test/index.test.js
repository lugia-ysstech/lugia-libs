/**
 *
 * create by ligx
 *
 * @flow
 */
import {
  accAdd,
  checkNumber,
  fixed,
  getMinAndMax,
  isInLimit,
  limit,
  limitByConfig,
  limitToSet,
  valueInRange,
} from '../src/index';

describe('Math', () => {
  it('limitByConfig', () => {
    expect(limitByConfig(1, { min: 2, max: 5 })).toBe(2);
    expect(limitByConfig(1, { min: 1, max: 5 })).toBe(1);
    expect(limitByConfig(6, { min: 1, max: 5 })).toBe(5);
    expect(limitByConfig(0, { min: -5, max: -1 })).toBe(-1);
    expect(limitByConfig(0, { min: -6, max: -4 })).toBe(-4);
  });
  it('getMinAndMax', () => {
    expect(getMinAndMax([-Infinity, 2, 3, 4, Infinity])).toEqual({
      min: -Infinity,
      max: Infinity,
    });
    expect(getMinAndMax([1, 2, 3, 4, 5])).toEqual({ min: 1, max: 5 });
    expect(getMinAndMax([5, 4, 3, 2, 1])).toEqual({ min: 1, max: 5 });
    expect(getMinAndMax([3, 5, 2, 1, 4])).toEqual({ min: 1, max: 5 });
    expect(getMinAndMax([0, 5, 2, 1, 4])).toEqual({ min: 0, max: 5 });
  });

  it('getMinAndMax expect', () => {
    expect(getMinAndMax([])).toEqual({ min: -Infinity, max: Infinity });
  });

  it('limit', () => {
    expect(limit(5, [1, 3])).toEqual(3);
    expect(limit(5, [5, 5])).toEqual(5);
    expect(limit(-1, [1, 5])).toEqual(1);
  });

  it('limitToSet', () => {
    expect(limitToSet([1, 2, 3, 4, 5], [1, 3])).toEqual([1, 2, 3]);
  });

  it('limitToSet repeat', () => {
    expect(limitToSet([1, 1, 2, 3, 4, 5], [1, 5])).toEqual([1, 2, 3, 4, 5]);
  });
  it('limitToSet index<0', () => {
    expect(limitToSet([1, 1, 2, 3, 4, 5], [1, 6])).toEqual([1, 2, 3, 4, 5]);
  });

  it('fixed', () => {
    expect(fixed(100.123456789, 1)).toBe(100.1);
    expect(fixed(2.3, 2)).toBe(2.3);
    expect(fixed(100.123456789, 2)).toBe(100.12);
    expect(fixed(100.123456789, 3)).toBe(100.123);
    expect(fixed(100.123456789, 4)).toBe(100.1235);
    expect(fixed(100.123456789, 5)).toBe(100.12346);
    expect(fixed(100.123456789, 6)).toBe(100.123457);
    expect(fixed(100.123456789, 7)).toBe(100.1234568);
    expect(fixed(100.123456789, 8)).toBe(100.12345679);
    expect(fixed(100.123456789, 9)).toBe(100.123456789);
    expect(fixed(1.2999999999999998, 2)).toBe(1.3);
  });

  it('isInLimit', () => {
    expect(isInLimit(0, [0, 7])).toBe(true);
    expect(isInLimit(1, [0, 7])).toBe(true);
    expect(isInLimit(8, [0, 7])).toBe(false);
    expect(isInLimit(-8, [0, 7])).toBe(false);
  });

  it('valueInRange in', () => {
    expect(valueInRange(3, [1, 5])).toBe(true);
  });
  it('valueInRange out', () => {
    expect(valueInRange(6, [1, 5])).toBe(false);
  });
  it('valueInRange equal', () => {
    expect(valueInRange(1, [1, 5])).toBe(true);
  });
  it('valueInRange', () => {
    expect(valueInRange(1, [5, 1])).toBe(true);
  });

  function testAccAdd(
    value: number,
    step: number,
    precision: number,
    expectValue: number,
  ) {
    it(` accAdd value+step ${value + step} precision ${precision} `, () => {
      expect(accAdd(value, step, precision)).toBe(expectValue);
    });
  }

  testAccAdd(5, 5, 0, 10);
  testAccAdd(0.5, 0.5, 1, 1.0);
  testAccAdd(5, 0.05, 2, 5.05);
  testAccAdd(0.95, -0.001, 5, 0.949);
  testAccAdd(0.949, -0.001, 5, 0.948);
  testAccAdd(0.948, -0.001, 5, 0.947);

  function testCheckNumber(value: string, expectValue: string) {
    it(`checkNumber value ${value} `, () => {
      expect(checkNumber(value)).toBe(expectValue);
    });
  }

  testCheckNumber('-.5', '-.5');
  testCheckNumber('-1', '-1');
  testCheckNumber('0', '0');
  testCheckNumber('5', '5');
  testCheckNumber('.5', '.5');
  testCheckNumber('1.5', '1.5');
  testCheckNumber('123456.111', '123456.111');
  testCheckNumber('qwqeqwe', '');
  testCheckNumber(',.`1234!@$`', '.1234');
  testCheckNumber('12345.qwer!@#$', '12345.');
});
