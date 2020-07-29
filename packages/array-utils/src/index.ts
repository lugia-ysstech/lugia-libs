/**
 * 数组工具方法包
 *
 * create by zenjava@lugia  2020.04.24
 */

interface ArrayOption<T> {
  equal?: (target: T, currentVal: T) => boolean;
}

/**
 * 获取目标元素在其数组列表中左侧的元素
 * @param array 目标数组
 * @param target 目标元素
 * @param option
 */
export function sliceLeft<T>(
  array: T[],
  target: T,
  option: ArrayOption<T> = {},
): T[] {
  const index = findIndex(array, target, option);
  if (index === -1) {
    return [];
  }
  return array.slice(0, index);
}

/**
 * 获取目标元素在其数组列表中右侧的元素
 * @param array 目标数组
 * @param target 目标元素
 * @param option
 */
export function sliceRight<T>(
  array: T[],
  target: T,
  option: ArrayOption<T> = {},
): T[] {
  const index = findIndex(array, target, option);
  if (index === -1) {
    return [];
  }
  return array.slice(index + 1);
}

export function findIndex<T>(
  array: T[],
  target: T,
  option: ArrayOption<T> = {},
): number {
  let index;

  const { equal } = option;
  if (equal) {
    index = array.findIndex((pre: T) => {
      return equal(target, pre);
    });
  } else {
    index = array.indexOf(target);
  }
  return index;
}

type AnyObject = { [key: string]: any };

export function mapValue2ArrayByField(
  target: AnyObject,
  fieldName: string,
): AnyObject {
  if (!target) {
    return target;
  }
  if (fieldName === null || fieldName === undefined) {
    return target;
  }
  const result = { ...target };
  const targetItem = result[fieldName];
  if (targetItem) {
    result[fieldName] = mapValue2Array(targetItem);
  }
  return result;
}

export function mapValue2Array(target: AnyObject): AnyObject {
  if (!target || typeof target !== 'object') {
    return target;
  }
  const result = { ...target };
  Object.keys(target).forEach((key: string) => {
    const value = target[key];
    if (!Array.isArray(value)) {
      result[key] = [value];
    }
  });
  return result;
}

/**
 * 获取目标的数组长度，如果不是数组则返回-1
 * @param target
 * @return -1不是数组  n为数组的长度
 */
export function getArrayLen(target: any): number {
  if (!Array.isArray(target)) {
    return -1;
  }
  return target.length;
}

/**
 * 升序排序方法 s
 * @param dataA
 * @param dataB
 * @return
 *    小于 0 ，那么 a 会被排列到 b 之前；
 *    等于 0 ， a 和 b 的相对位置不变
 *    大于 0 ， b 会被排列到 a 之前。
 */
export function sortNumberArrayAsc(dataA: any, dataB: any): number {
  return sortNumberArray(dataA, dataB, (a, b) => a - b);
}

/**
 * 降序排序方法
 * @param dataA
 * @param dataB
 * @return
 *    小于 0 ，那么 a 会被排列到 b 之前；
 *    等于 0 ， a 和 b 的相对位置不变
 *    大于 0 ， b 会被排列到 a 之前。
 */

export function sortNumberArrayDesc(dataA: any, dataB: any): number {
  return sortNumberArray(dataA, dataB, (a, b) => b - a);
}

function sortNumberArray(
  dataA: any,
  dataB: any,
  cb: (a: number, b: number) => number,
): number {
  const lenA = getArrayLen(dataA);
  const lenB = getArrayLen(dataB);

  if (lenA === -1 || lenB === -1) {
    return 0;
  }
  if (lenA === lenB && lenA === 0) {
    return 0;
  }

  const needCompareLen = Math.min(lenA, lenB);

  for (let i = 0; i < needCompareLen; i++) {
    const valA = dataA[i];
    const valB = dataB[i];
    const sortVal = cb(valA, valB);
    if (sortVal === 0) {
      continue;
    }
    return sortVal;
  }
  return cb(lenA, lenB);
}
