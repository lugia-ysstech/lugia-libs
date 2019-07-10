/**
 *
 * create by ligx
 *
 * @flow
 */

import type { Exist, UniqueOption } from '@lugia/unique';

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

export default class Unique {
  lastIndex: number;
  preString: string;
  rand: Function;
  exist: ?Exist;

  constructor(
    lastIndex: number,
    preString: string,
    rand: Function,
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
    opt?: { randCount: number } = { randCount: 1 },
  ) => {
    const { randCount = 1 } = opt;

    const randStr = [];
    for (let i = 0; i < randCount; i++) {
      randStr.push(this.rand());
    }
    return `${this.preString}${isTest ? '' : randStr.join('')}${newIndex}`;
  };

  getLastIndex() {
    return this.lastIndex;
  }

  equalTo(unique: Object): boolean {
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
