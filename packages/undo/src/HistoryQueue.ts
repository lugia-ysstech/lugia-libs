/**
 *
 * create by ligx
 *
 * @flow
 */
import { limitByConfig } from '@lugia/math';
import { LimitRange } from '@lugia/math/lib/type';
import { HistoryConfig } from './type';

export default class HistoryQueue<SaveType> {
  stack: SaveType[];
  stackCount: number;
  currentIndex: number;
  limitByConfig: (val: number, opt: LimitRange) => number;
  constructor(config: HistoryConfig) {
    const { stackCount } = config;
    this.stack = [];
    this.stackCount = stackCount;
    this.currentIndex = 0;
    this.limitByConfig = limitByConfig;
  }

  add(history: SaveType): SaveType | undefined {
    if (this.isUndoing()) {
      this.removeAfterCurrentIndex();
    }

    this.push(history);
    this.changeCurrentIndex(this.size() - 1);

    if (this.isOverRange()) {
      return this.removeFirst();
    }
  }

  removeAfterCurrentIndex() {
    this.splice(this.limitIndex(this.getCurrentIndex() + 1));
  }

  removeFirst(): SaveType {
    const delTarget = this.stack[0];
    this.splice(0, 1);
    this.changeCurrentIndex(this.getCurrentIndex() - 1);
    return delTarget;
  }

  isOverRange() {
    return this.size() > this.getStackCount();
  }

  getStackCount() {
    return this.stackCount;
  }

  size(): number {
    return this.stack.length;
  }

  push(history: SaveType): void {
    this.stack.push(history);
  }

  splice(start: number, delCount: number = Infinity): void {
    this.stack.splice(start, delCount);
  }

  isUndoing(): boolean {
    return this.getCurrentIndex() !== this.getMaxIndex();
  }

  undo(): SaveType | undefined {
    return this.getStackByStep(-1);
  }

  redo(): SaveType | undefined {
    return this.getStackByStep(1);
  }

  getStackByStep(step: number): SaveType | undefined {
    return this.stack[this.moveIndex(step)];
  }

  moveIndex(step: number) {
    const targetIndex = this.getCurrentIndex() + step;
    this.changeCurrentIndex(targetIndex);
    return targetIndex;
  }

  changeCurrentIndex(targetIndex: number) {
    this.currentIndex = this.limitIndex(targetIndex);
  }

  limitIndex(targetIndex: number): number {
    return this.limitByConfig(targetIndex, { min: 0, max: this.getMaxIndex() });
  }

  getMaxIndex(): number {
    return this.limitByConfig(this.size() - 1, { min: 0, max: Infinity });
  }

  getCurrentIndex() {
    return this.currentIndex;
  }
}
