/**
 *
 * create by ligx
 *
 * @flow
 */

import { Exist, UniqueOption } from './type';

let isTest = false;

export function switchTestMode() {
  isTest = true;
}

export function switchProduction() {
  isTest = false;
}

export function now(date: Date = new Date()) {
  return `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}_${date.getMilliseconds()}`;
}
type Rand = () => string;
export default class Unique {
  lastIndex: number;
  preString: string;
  rand: Rand;
  exist?: Exist;

  constructor(
    lastIndex: number,
    preString: string,
    rand: Rand,
    opt: UniqueOption = {},
  ) {
    this.lastIndex = lastIndex;
    this.preString = preString;
    this.rand = rand;
    const { exist } = opt;
    this.exist = exist;
  }

  getNext(): string {
    const newIndex = this.lastIndex++;

    let res = this.generateId(newIndex);
    let repeatTryCnt = 0;

    if (this.exist) {
      while (isTest !== true && this.exist.isExist(res)) {
        repeatTryCnt++;

        let randCount = 1;
        if (repeatTryCnt >= 33) {
          randCount = 2;
        }
        if (repeatTryCnt >= 66) {
          randCount = 3;
        }
        res = this.generateId(newIndex, { randCount });
        if (repeatTryCnt === 100) {
          throw new Error('unique generate error more than 100 times');
        }
      }
      this.exist.addExist(res);
    }
    return res;
  }

  generateId = (
    newIndex: number,
    opt: { randCount: number } = { randCount: 1 },
  ): string => {
    const { randCount = 1 } = opt;

    const randStr: string[] = [];
    for (let i = 0; i < randCount; i++) {
      randStr.push(this.rand());
    }
    return `${this.preString}${isTest ? '' : randStr.join('')}${newIndex}`;
  };

  getLastIndex() {
    return this.lastIndex;
  }

  equalTo(unique: Unique): boolean {
    if (!unique) {
      return false;
    }

    return (
      unique.rand === this.rand &&
      unique.lastIndex === this.lastIndex &&
      unique.preString === this.preString
    );
  }
}

type GenerateOption = {
  separator?: string;
  seq?: number;
  existStringMap?: ExistMap;
};

type ExistMap = { [name: string]: boolean };

/**
 *  目标字符串如果在已有字符串不存在，则直接返回。存在则自动生成不重复的序列号，拼接后返回
 * @param target 目标字符串
 * @param existStrings 已有字符串
 * @param option
 */
export function incrementString(
  target: string,
  existStrings: string[],
  option: GenerateOption = {},
): string {
  const { separator = '_' } = option;

  let existNamesMap = option.existStringMap;
  if (!existNamesMap) {
    existNamesMap = {};
    for (const name of existStrings) {
      existNamesMap[name] = true;
    }
  }

  if (!existNamesMap[target]) {
    return target;
  }
  const { suffix, preStr } = readSeparatorWithNumber(target, separator);
  const tryVal = `${preStr}${separator}${suffix + 1}`;
  return incrementString(tryVal, existStrings, {
    ...option,
    existStringMap: existNamesMap,
  });
}

export function readSeparatorWithNumber(
  str: string,
  separator: string,
): { suffix: number; preStr: string } {
  const sepLastIdx = str.lastIndexOf(separator);
  if (sepLastIdx === -1) {
    return { suffix: 0, preStr: str };
  }
  const index = Number(str.substr(sepLastIdx + separator.length));
  return {
    suffix: isNaN(index) ? 0 : index,
    preStr: str.substr(0, sepLastIdx),
  };
}
