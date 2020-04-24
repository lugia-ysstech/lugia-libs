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
