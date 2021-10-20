/**
 *
 * create by ligx
 *
 * @flow
 */

import { LimitRange } from './type';

export function limitByConfig(val: number, opt: LimitRange): number {
  const { max, min } = opt;
  return Math.min(Math.max(min, val), max);
}

export function fixed(val: number, fixCnt: number): number {
  const fix = Math.pow(10, fixCnt);
  const res = (val * fix) / fix;
  return Number(res.toFixed(fixCnt));
}

export function isInLimit(val: number, range: number[]): boolean {
  return limit(val, range) === val;
}

export function limit(val: number, range: number[]) {
  const { min, max } = getMinAndMax(range);
  return Math.min(max, Math.max(val, min));
}

export function limitToSet(val: number[], range: number[]): number[] {
  const { min, max } = getMinAndMax(range);
  const obj: { [key: string]: number } = {};
  return val.sort(sortable).filter(i => {
    if (!(i in obj)) {
      obj[i] = i;
      return i >= min && i <= max;
    }
  });
}

export function valueInRange(val: number, range: number[]): boolean {
  const { min, max } = getMinAndMax(range);
  return val >= min && val <= max;
}

export function getMinAndMax(range: number[]): { min: number; max: number } {
  let min = range[0];
  let max = range[0];

  function check(val: number, negative: boolean = false) {
    return val !== undefined ? val : negative ? -Infinity : Infinity;
  }

  range &&
    range.forEach(item => {
      min = Math.min(item, min);
      max = Math.max(item, max);
    });

  return { min: check(min, true), max: check(max) };
}

export function sortable(a: number, b: number): number {
  return a - b;
}

export function accAdd(value: number, step: number, precision: number): number {
  return Number((value + step).toFixed(precision));
}

export function checkNumber(value: string): string {
  if (!value) return '';
  return value
    .replace(/[^\d\.-]/g, '')
    .replace(/^-/g, '$%$')
    .replace(/\-/g, '')
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')
    .replace('$%$', '-');
}

export function floorNumber(value: number, count: number): number {
  return Math.floor(value * count) / count;
}

export function isNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value);
}
