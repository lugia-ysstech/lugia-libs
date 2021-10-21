/**
 * 数组工具方法包
 *
 * create by zenjava@lugia  2020.04.24
 */

import {
  findIndex,
  getArrayLen,
  mapValue2Array,
  mapValue2ArrayByField,
  sliceLeft,
  sliceRight,
  sortNumberArrayAsc,
  sortNumberArrayDesc,
  row2colMatrix,
  sortStringDesc,
  sortStringAsc,
  ensureDataIsArray,
  isNotEmptyArray,
  equalNumbers,
} from '../src';

type AnyObject = { [key: string]: any };

const deepObjectEqualOption = {
  equal(target: AnyObject, current: AnyObject) {
    return JSON.stringify(target) === JSON.stringify(current);
  },
};
describe('array-utils', () => {
  it('sliceLeft', () => {
    const nums: number[] = [1, 2, 3, 4, 5, 6, 7];
    expect(sliceLeft(nums, 1)).toEqual([]);
    expect(sliceLeft(nums, 100)).toEqual([]);
    expect(sliceLeft(nums, 3)).toEqual([1, 2]);
    expect(sliceLeft(nums, 4)).toEqual([1, 2, 3]);
    expect(sliceLeft(nums, 7)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(sliceLeft([1, 2, 3, 3, 3, 3, 3], 3)).toEqual([1, 2]);

    const objects = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(sliceLeft(objects, { id: 2 })).toEqual([]);
    expect(sliceLeft(objects, objects[1])).toEqual([objects[0]]);
    expect(sliceLeft(objects, objects[1])[0]).toBe(objects[0]);
  });

  it('sliceLeft option.equal', () => {
    const objects = [{ id: 1 }, { id: 2 }, { id: 3 }];

    expect(sliceLeft(objects, { id: 2 }, deepObjectEqualOption)).toEqual([
      objects[0],
    ]);
  });

  it('sliceRight option.equal', () => {
    const objects = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

    expect(sliceRight(objects, { id: 2 }, deepObjectEqualOption)).toEqual([
      objects[2],
      objects[3],
    ]);
  });

  it('findIndex', () => {
    expect(findIndex([1, 2, 3, 4], 5)).toBe(-1);
    expect(findIndex([1, 2, 3, 4], 2)).toBe(1);
    expect(findIndex([1, 2, 3, 4], 4)).toBe(3);
    const objects = [{ id: 1 }, { id: 2 }, { id: 3 }];
    for (let i = 0; i < objects.length; i++) {
      expect(findIndex(objects, objects[i])).toBe(i);
    }

    for (let i = 0; i < objects.length; i++) {
      expect(findIndex(objects, { ...objects[i] }, deepObjectEqualOption)).toBe(
        i,
      );
    }
  });

  it('sliceRight', () => {
    const nums: number[] = [1, 2, 3, 4, 5, 6, 7];
    expect(sliceRight(nums, 1)).toEqual([2, 3, 4, 5, 6, 7]);
    expect(sliceRight(nums, 3)).toEqual([4, 5, 6, 7]);
    expect(sliceRight(nums, 4)).toEqual([5, 6, 7]);
    expect(sliceRight(nums, 7)).toEqual([]);
    expect(sliceRight([1, 2, 3, 3, 3, 3, 3], 3)).toEqual([3, 3, 3, 3]);

    const objects = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(sliceRight(objects, { id: 2 })).toEqual([]);
    expect(sliceRight(objects, objects[1])).toEqual([objects[2]]);
    expect(sliceRight(objects, objects[1])[0]).toBe(objects[2]);
  });

  it('mapValue2Array', () => {
    expect(mapValue2Array({ name: 'hello', age: 15 })).toEqual({
      name: ['hello'],
      age: [15],
    });
    const obj = {
      name: ['hello'],
      age: [15],
    };
    expect(mapValue2Array(obj)).toEqual(obj);

    expect(
      mapValue2Array({ name: 'hello', age: 15, id: null, bo: true }),
    ).toEqual({
      name: ['hello'],
      id: [null],
      age: [15],
      bo: [true],
    });

    expect(mapValue2Array(null as any)).toEqual(null);
  });

  it('mapValue2ArrayByField', () => {
    expect(mapValue2ArrayByField(null as any, '')).toEqual(null);

    const data = {
      name: ['hello'],
      age: [15],
    };
    const param = { obj: 'hello', data };
    expect(mapValue2ArrayByField(param, null as any)).toBe(param);
    expect(mapValue2ArrayByField({ obj: 'hello', data }, '')).toEqual({
      obj: 'hello',
      data,
    });

    expect(
      mapValue2ArrayByField(
        { obj: 'hello', data: { name: 'hello', age: 15 } },
        'data',
      ),
    ).toEqual({
      obj: 'hello',
      data: {
        name: ['hello'],
        age: [15],
      },
    });

    expect(
      mapValue2ArrayByField(
        { obj: 'hello', data: { name: 'hello', age: 15 } },
        'obj',
      ),
    ).toEqual({
      obj: 'hello',
      data: {
        name: 'hello',
        age: 15,
      },
    });
  });

  it('getArrayLen', () => {
    expect(getArrayLen(undefined)).toBe(-1);
    expect(getArrayLen(null)).toBe(-1);
    expect(getArrayLen(1)).toBe(-1);
    expect(getArrayLen({ length: 100 })).toBe(-1);
    expect(getArrayLen([])).toBe(0);
    expect(getArrayLen([1])).toBe(1);
    expect(getArrayLen([1, 2])).toBe(2);
  });

  it('sortNumberArrayAsc', () => {
    expect(sortNumberArrayAsc(null, undefined)).toEqual(0);
    expect(sortNumberArrayAsc([1, 2, 3], 0)).toEqual(0);
    expect(sortNumberArrayAsc([], [])).toEqual(0);

    expect([[1, 2, 3], [4], [3]].sort(sortNumberArrayAsc)).toEqual([
      [1, 2, 3],
      [3],
      [4],
    ]);

    expect([[3], [1, 2, 3], [4]].sort(sortNumberArrayAsc)).toEqual([
      [1, 2, 3],
      [3],
      [4],
    ]);

    expect(
      [[3], [1, 2, 3], [4, 2], [4], [4, 1]].sort(sortNumberArrayAsc),
    ).toEqual([[1, 2, 3], [3], [4], [4, 1], [4, 2]]);

    expect([[1, 2, 3], [1, 2, 3]].sort(sortNumberArrayAsc)).toEqual([
      [1, 2, 3],
      [1, 2, 3],
    ]);
  });
  it('sortNumberArrayDesc', () => {
    expect(sortNumberArrayDesc(null, undefined)).toEqual(0);
    expect(sortNumberArrayDesc([1, 2, 3], 0)).toEqual(0);
    expect(sortNumberArrayDesc([], [])).toEqual(0);

    expect([[1, 2, 3], [4], [3]].sort(sortNumberArrayDesc)).toEqual([
      [4],
      [3],
      [1, 2, 3],
    ]);

    expect([[3], [1, 2, 3], [4]].sort(sortNumberArrayDesc)).toEqual([
      [4],
      [3],
      [1, 2, 3],
    ]);

    expect(
      [[3], [1, 2, 3], [4, 2], [4], [4, 1]].sort(sortNumberArrayDesc),
    ).toEqual([[4, 2], [4, 1], [4], [3], [1, 2, 3]]);

    expect([[1, 2, 3], [1, 2, 3]].sort(sortNumberArrayDesc)).toEqual([
      [1, 2, 3],
      [1, 2, 3],
    ]);
  });

  it('tillCols', () => {
    expect(row2colMatrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toEqual([
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ]);
    expect(row2colMatrix([[1, 2, 3], [4, 5, 6]])).toEqual([
      [1, 4],
      [2, 5],
      [3, 6],
    ]);
    expect(row2colMatrix([[1, 2], [4, 5, 6]])).toEqual([
      [1, 4],
      [2, 5],
      [undefined, 6],
    ]);
    expect(row2colMatrix([])).toEqual([]);
    expect(row2colMatrix(undefined as any)).toEqual([]);
    expect(row2colMatrix([[], [], []])).toEqual([]);
    expect(row2colMatrix([[], [], [3]])).toEqual([[undefined, undefined, 3]]);
    expect(row2colMatrix([[1], [], [3]])).toEqual([[1, undefined, 3]]);
  });

  it('sortStringDesc', () => {
    expect(['a', 'b', 'c'].sort(sortStringDesc)).toEqual(['c', 'b', 'a']);
    expect(['a', 'b', 'c'].sort(sortStringDesc)).toEqual(['c', 'b', 'a']);
  });
  it('sortStringAsc', () => {
    expect(['a', 'b', 'c'].sort(sortStringAsc)).toEqual(['a', 'b', 'c']);
    expect(['c', 'b', 'a'].sort(sortStringAsc)).toEqual(['a', 'b', 'c']);
  });

  it('isNotEmptyArray', () => {
    expect(isNotEmptyArray([1, 2, 3])).toEqual(true);
    expect(isNotEmptyArray(['1', '2', '3'])).toEqual(true);
    expect(isNotEmptyArray([{ a: 1 }])).toEqual(true);
    expect(isNotEmptyArray(undefined)).toEqual(false);
    expect(isNotEmptyArray(null)).toEqual(false);
    expect(isNotEmptyArray(1)).toEqual(false);
    expect(isNotEmptyArray('1')).toEqual(false);
    expect(isNotEmptyArray({ a: 1 })).toEqual(false);
  });
  it('ensureDataIsArray', () => {
    expect(ensureDataIsArray(null)).toEqual([]);
    expect(ensureDataIsArray(undefined)).toEqual([]);
    expect(ensureDataIsArray(NaN)).toEqual([]);
    expect(ensureDataIsArray(1)).toEqual([]);
    expect(ensureDataIsArray('1')).toEqual([]);
    expect(ensureDataIsArray({ a: 1 })).toEqual([]);
    expect(ensureDataIsArray([{ a: 1 }])).toEqual([{ a: 1 }]);
    expect(ensureDataIsArray([1])).toEqual([1]);
  });

  it('equalNumbers', () => {
    expect(equalNumbers(null as any, [] as any)).toBeFalsy();
    expect(equalNumbers([1, 3], [4])).toBeFalsy();
    expect(equalNumbers([1, 3], [1, 4])).toBeFalsy();
    expect(equalNumbers([1, 3], [1, 34])).toBeFalsy();
    expect(equalNumbers([1, 3, 5], [1, 3, 5])).toBeTruthy();
  });
});
