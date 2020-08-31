/**
 *
 * create by ligx
 *
 * @flow
 */

import HistoryQueue from '../src/HistoryQueue';
import { limitByConfig } from '@lugia/math';

// @ts-ignore
import { mockObject, VerifyOrder, VerifyOrderConfig } from '@lugia/jverify';
import { AnyObject } from '../src/type';

const tableName = 'history';
describe('History', () => {
  it('init', () => {
    const history = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    expect(history.stack).toEqual([]);
    expect(history.stackCount).toEqual(10);
    expect(history.limitByConfig).toBe(limitByConfig);
  });

  it('add stackCount: 1', () => {
    const history = new HistoryQueue({
      stackCount: 1,
      tableName,
    });
    const recordMove = getHistoryRecord('Move');
    history.add(recordMove);
    expect(history.stack).toEqual([recordMove]);

    const recordDel = getHistoryRecord('Del');
    history.add(recordDel);
    expect(history.stack).toEqual([recordDel]);

    const recordChangeSize = getHistoryRecord('ChangeSize');
    history.add(recordChangeSize);
    expect(history.stack).toEqual([recordChangeSize]);
  });

  it('removeAfterCurrentIndex', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    const order = VerifyOrder.create();
    const mockHistory = mockObject.create(
      target,
      VerifyOrderConfig.create('history', order),
    );
    mockHistory.mockFunction('isUndoing').returned(true);
    const currentIdx = 12321;
    mockHistory.mockFunction('getCurrentIndex').returned(currentIdx);
    const resultIndex = 14234124312;
    mockHistory.mockFunction('limitIndex').returned(resultIndex);
    mockHistory.mockFunction('splice');
    mockHistory.mockFunction('push');
    mockHistory.mockFunction('isOverRange').returned(false);
    mockHistory.mockFunction('removeFirst');
    expect(target.removeAfterCurrentIndex()).toBeUndefined();

    order.verify((param: AnyObject) => {
      const { history } = param;
      history.getCurrentIndex();
      history.limitIndex(currentIdx + 1);
      history.splice(resultIndex);
    });
  });

  it('add mock isUndoing true isOverRange false', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    const order = VerifyOrder.create();
    const mockHistory = mockObject.create(
      target,
      VerifyOrderConfig.create('history', order),
    );
    mockHistory.mockFunction('isUndoing').returned(true);
    mockHistory.mockFunction('removeAfterCurrentIndex');
    mockHistory.mockFunction('push');
    mockHistory.mockFunction('isOverRange').returned(false);
    mockHistory.mockFunction('removeFirst');
    expect(target.add(55)).toBeUndefined();

    order.verify((param: AnyObject) => {
      const { history } = param;
      history.isUndoing();
      history.removeAfterCurrentIndex();
      history.push(55);
      history.isOverRange();
    });
  });
  it('add mock isUndoing true isOverRange true', () => {
    const taget = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    const order = VerifyOrder.create();
    const mockHistory = mockObject.create(
      taget,
      VerifyOrderConfig.create('history', order),
    );
    mockHistory.mockFunction('isUndoing').returned(true);
    mockHistory.mockFunction('removeAfterCurrentIndex');
    mockHistory.mockFunction('push');
    mockHistory.mockFunction('isOverRange').returned(true);
    const first = '4321421';
    mockHistory.mockFunction('removeFirst').returned(first);
    expect(taget.add(55)).toBe(first);

    order.verify((param: AnyObject) => {
      const { history } = param;
      history.isUndoing();
      history.removeAfterCurrentIndex();

      history.push(55);
      history.isOverRange();
      history.removeFirst();
    });
  });

  it('add stackCount: 2', () => {
    const history = new HistoryQueue({
      stackCount: 2,
      tableName,
    });
    const recordMove = getHistoryRecord('Move');
    history.add(recordMove);
    const recordDel = getHistoryRecord('Del');
    history.add(recordDel);

    const recordChangeSize = getHistoryRecord('ChangeSize');
    history.add(recordChangeSize);
    expect(history.stack).toEqual([recordDel, recordChangeSize]);
  });
  it('add stackCount: 3', () => {
    const history = new HistoryQueue({
      stackCount: 3,
      tableName,
    });
    const recordMove = getHistoryRecord('Move');
    history.add(recordMove);
    const recordDel = getHistoryRecord('Del');
    history.add(recordDel);
    const recordChangeSize = getHistoryRecord('ChangeSize');
    history.add(recordChangeSize);

    expect(history.stack).toEqual([recordMove, recordDel, recordChangeSize]);
  });

  it('undo a ab abc', () => {
    const history = new HistoryQueue({
      stackCount: 10,
      tableName,
    });

    history.add('a'); // a
    history.add('b'); // ab
    history.add('c'); // abc

    expect(history.undo()).toEqual('b');
    expect(history.undo()).toEqual('a');
    expect(history.undo()).toBeUndefined();

    expect(history.redo()).toEqual('b');
    expect(history.redo()).toEqual('c');
    expect(history.redo()).toBeUndefined();
  });

  it('undo', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    const order = VerifyOrder.create();
    const mockHistory = mockObject.create(
      target,
      VerifyOrderConfig.create('history', order),
    );
    const targetValue = 'helrelq;wrjqw;';
    mockHistory.mockFunction('getStackByStep').returned(targetValue);
    expect(target.undo()).toBe(targetValue);

    order.verify((param: AnyObject) => {
      const { history } = param;
      history.getStackByStep(-1);
    });
  });

  it('redo', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    const order = VerifyOrder.create();
    const mockHistory = mockObject.create(
      target,
      VerifyOrderConfig.create('history', order),
    );
    const targetValue = 'helrelq;wrjqw;';
    mockHistory.mockFunction('getStackByStep').returned(targetValue);
    expect(target.redo()).toBe(targetValue);

    order.verify((param: AnyObject) => {
      const { history } = param;
      history.getStackByStep(1);
    });
  });

  it('getStackByStep', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    const order = VerifyOrder.create();
    const mockHistory = mockObject.create(
      target,
      VerifyOrderConfig.create('history', order),
    );
    const targetIndex = 100000;

    mockHistory.mockFunction('moveIndex').returned(targetIndex);
    const targetValue = 'helrelq;wrjqw;';
    target.stack[targetIndex] = targetValue;
    const step = 1000;
    expect(target.getStackByStep(step)).toBe(targetValue);

    order.verify((param: AnyObject) => {
      const { history } = param;
      history.moveIndex(step);
    });
  });

  it('moveIndex', () => {
    const history = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    expect(history.getCurrentIndex()).toBe(0);
    expect(history.moveIndex(100)).toBe(100);
    expect(history.getCurrentIndex()).toBe(0);
    expect(history.moveIndex(100)).toBe(100);
    expect(history.getCurrentIndex()).toBe(0);
  });

  it('isUndoing mock', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    const order = VerifyOrder.create();
    const mockHistory = mockObject.create(
      target,
      VerifyOrderConfig.create('history', order),
    );
    mockHistory.mockFunction('getMaxIndex').returned(100);
    mockHistory.mockFunction('getCurrentIndex').returned(5100);
    expect(target.isUndoing()).toBeTruthy();

    order.verify((param: AnyObject) => {
      const { history } = param;
      history.getCurrentIndex();
      history.getMaxIndex();
    });
  });

  it('getMaxIndex', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    const order = VerifyOrder.create();
    const mockHistory = mockObject.create(
      target,
      VerifyOrderConfig.create('history', order),
    );
    const result = 34124;
    mockHistory.mockFunction('limitByConfig').returned(result);
    const size = 177;
    mockHistory.mockFunction('size').returned(size);
    expect(target.getMaxIndex()).toBe(result);

    order.verify((param: AnyObject) => {
      const { history } = param;
      history.size();
      history.limitByConfig(size - 1, { min: 0, max: Infinity });
    });
  });

  it('isOverRange false', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });

    const order = VerifyOrder.create();
    const mockHistory = mockObject.create(
      target,
      VerifyOrderConfig.create('history', order),
    );
    mockHistory.mockFunction('size');
    mockHistory.mockFunction('getStackCount');
    expect(target.isOverRange()).toBeFalsy();
    order.verify((param: AnyObject) => {
      const { history } = param;
      history.size();
      history.getStackCount();
    });
  });
  it('isOverRange true', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });

    const order = VerifyOrder.create();
    const mockHistory = mockObject.create(
      target,
      VerifyOrderConfig.create('history', order),
    );
    mockHistory.mockFunction('size').returned(100);
    mockHistory.mockFunction('getStackCount').returned(10);
    expect(target.isOverRange()).toBeTruthy();
    order.verify((param: AnyObject) => {
      const { history } = param;
      history.size();
      history.getStackCount();
    });
  });

  it('removeFirst stack is []', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    target.stack = [];
    expect(target.removeFirst()).toBeUndefined();
    expect(target.stack).toEqual([]);
  });

  it('removeFirst stack is [1,2,4]', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    const order = VerifyOrder.create();
    const mockHistory = mockObject.create(
      target,
      VerifyOrderConfig.create('history', order),
    );
    const currentIndex = 100;
    mockHistory.mockFunction('getCurrentIndex').returned(currentIndex);
    mockHistory.mockFunction('changeCurrentIndex').returned(true);
    target.stack = [1, 2, 4];
    expect(target.removeFirst()).toBe(1);
    expect(target.stack).toEqual([2, 4]);
    order.verify((param: AnyObject) => {
      const { history } = param;
      history.getCurrentIndex();
      history.changeCurrentIndex(currentIndex - 1);
    });

    expect(target.removeFirst()).toBe(2);
    expect(target.stack).toEqual([4]);

    expect(target.removeFirst()).toBe(4);
    expect(target.stack).toEqual([]);
  });

  it('splice', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    target.stack = [1, 2, 3];
    const oldStack = target.stack;

    target.splice(0, 1);
    expect(target.stack).toEqual([2, 3]);
    expect(target.stack).toBe(oldStack);

    target.splice(1, 1);
    expect(target.stack).toBe(oldStack);
    expect(target.stack).toEqual([2]);

    target.splice(0);
    expect(target.stack).toBe(oldStack);
    expect(target.stack).toEqual([]);
  });

  it('add changeCurrentIndex', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    target.add(1);
    expect(target.getCurrentIndex()).toBe(0);

    target.add(2);
    expect(target.getCurrentIndex()).toBe(1);

    target.add(3);
    expect(target.getCurrentIndex()).toBe(2);
  });

  it('splice', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    target.stack = [1, 2, 3];
    const oldStack = target.stack;
    target.push(4);
    expect(target.stack).toEqual([1, 2, 3, 4]);
    expect(target.stack).toBe(oldStack);
  });
  it('size', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    expect(target.size()).toBe(0);

    target.stack = [1, 2, 3];
    expect(target.size()).toBe(3);
  });

  it('changeCurrentIndex', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    target.changeCurrentIndex(15500);
    expect(target.getCurrentIndex()).toBe(0);

    mockObject
      .create(target)
      .mockFunction('size')
      .returned(100);
    target.changeCurrentIndex(15500);
    expect(target.getCurrentIndex()).toBe(99);
  });

  it('getStackCount', () => {
    const history = new HistoryQueue({
      stackCount: 34214321,
      tableName,
    });
    expect(history.getStackCount()).toBe(34214321);
  });

  it('undo [a ab abc] [a ab e]', () => {
    const history = new HistoryQueue({
      stackCount: 10,
      tableName,
    });

    history.add('a'); // a
    history.add('b'); // ab
    history.add('c'); // abc

    expect(history.undo()).toEqual('b');

    history.add('e'); // abe  撤销过程中 又放入新的修改
    expect(history.undo()).toEqual('b');
    expect(history.redo()).toEqual('e');
    expect(history.redo()).toBeUndefined();
  });
  type OperationType = 'Add' | 'Del' | 'Move' | 'ChangeSize' | 'ChangeInfo';

  // redo 是否应该也有数量限制。
  function getHistoryRecord(type: OperationType) {
    return {
      type,
      point: {
        new: [0, 0],
        old: [1, 2],
      },
      widgetInfo: {
        new: {
          factory: () => 1,
          props: { value: 'hello' },
          widgetName: 'button',
          module: '@lugia/lugia-web',
          version: '1.0.0',
        },
        old: {
          factory: () => 2,
          props: { value: 'world' },
          widgetName: 'button',
          module: '@lugia/lugia-web',
          version: '1.0.0',
        },
      },
      size: {
        new: { width: 50, height: 100 },
        old: { width: 30, height: 33 },
      },
    };
  }

  it('changeCurrentIndex mock', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    const order = VerifyOrder.create();
    const mockHistory = mockObject.create(
      target,
      VerifyOrderConfig.create('history', order),
    );

    const result = 34124;
    mockHistory.mockFunction('limitIndex').returned(result);

    const targetIndex = 1000;
    target.changeCurrentIndex(targetIndex);
    expect(target.getCurrentIndex()).toBe(result);
    order.verify((param: AnyObject) => {
      const { history } = param;
      history.limitIndex(targetIndex);
    });
  });

  it('limitIndex mock', () => {
    const target = new HistoryQueue({
      stackCount: 10,
      tableName,
    });
    const order = VerifyOrder.create();
    const mockHistory = mockObject.create(
      target,
      VerifyOrderConfig.create('history', order),
    );

    const result = 34124;
    const maxIndex = 3421421421;
    mockHistory.mockFunction('getMaxIndex').returned(maxIndex);
    mockHistory.mockFunction('limitByConfig').returned(result);

    const targetIndex = 1000;
    expect(target.limitIndex(targetIndex)).toBe(result);
    order.verify((param: AnyObject) => {
      const { history } = param;
      history.getMaxIndex();
      history.limitByConfig(targetIndex, { min: 0, max: maxIndex });
    });
  });

  it('undo [a ab abc] [a ab e]', () => {
    const history = new HistoryQueue({
      stackCount: 10,
      tableName,
    });

    history.add('a'); // a
    history.add('b'); // ab
    history.add('c'); // abc
    history.removeLast();

    expect(history.undo()).toEqual('a');
    expect(history.redo()).toEqual('b');
    expect(history.undo()).toEqual('a');
    expect(history.redo()).toEqual('b');
  });
});
