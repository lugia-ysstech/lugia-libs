/**
 *
 * create by ligx
 *
 * @flow
 */

import Unique, { now, switchProduction } from '../src';
// @ts-ignore
import { mockObject, VerifyOrder, VerifyOrderConfig } from '@lugia/jverify';

class Exist {
  exist: { [key: string]: boolean };

  constructor() {
    this.exist = {};
  }

  addExist(key: string) {
    this.exist[key] = true;
  }

  isExist(key: string): boolean {
    return !!this.exist[key];
  }
}

const exist = new Exist();

describe('Unique', () => {
  beforeAll(() => {
    switchProduction();
  });
  it('init', () => {
    const unique = new Unique(0, 'hello', () => '', { exist });
    expect(unique.exist).toBe(exist);
  });

  it('existCheck is open', () => {
    const unique = new Unique(0, 'hello', () => 'a', { exist });

    const mock = mockObject.create(unique);
    const mockUnque = mockObject.create(exist);
    mockUnque.mockFunction('isExist').forever(true);

    const params: any[] = [];
    let i = 0;
    mock.mockFunction('generateId').mock((...paramVal: any[]) => {
      params.push(paramVal);
      i++;
    });

    expect(() => unique.getNext()).toThrow(
      'unique generate error more than 100 times',
    );

    expect(i).toBe(101);
    expect(params[0]).toEqual([0]);
    expect(params[1]).toEqual([0, { randCount: 1 }]);
    expect(params[33]).toEqual([0, { randCount: 2 }]);
    expect(params[66]).toEqual([0, { randCount: 3 }]);
    expect(params[100]).toEqual([0, { randCount: 3 }]);
    mock.resetAll();
  });

  it('existCheck default is close', () => {
    const unique = new Unique(0, 'hello', () => 'a');

    const mock = mockObject.create(unique);
    const mockUnque = mockObject.create(exist);
    mockUnque.mockFunction('isExist').forever(true);

    const params: any[] = [];
    let i = 0;
    mock.mockFunction('generateId').mock((...paramVal: any[]) => {
      params.push(paramVal);
      i++;
    });
    unique.getNext();

    expect(params.length).toBe(1);
    mock.resetAll();
  });

  it('getNext normal', () => {
    const rand = () => '';
    const unique = new Unique(0, 'hello', rand);
    const mock = mockObject.create(exist);
    mock.mockFunction('isExist').forever(false);
    expect(unique.equalTo(new Unique(0, 'hello', () => ''))).toBeFalsy();
    expect(unique.equalTo(new Unique(0, 'hello', rand))).toBeTruthy();
    expect(unique.equalTo(new Unique(0, 'a', rand))).toBeFalsy();
    expect(unique.equalTo(new Unique(1, 'hello', rand))).toBeFalsy();
    mock.resetAll();
  });

  it('getNext existCheck  default  is close', () => {
    const unique = new Unique(0, 'hello', () => '');
    const order = VerifyOrder.create();
    const mock = mockObject.create(
      exist,
      VerifyOrderConfig.create('exist', order),
    );
    mock.mockFunction('isExist').forever(false);
    mock.mockFunction('addExist').forever(true);
    expect(unique.getNext()).toBe('hello0');
    expect(unique.getNext()).toBe('hello1');
    expect(unique.getNext()).toBe('hello2');
    expect(unique.getLastIndex()).toBe(3);
    order.verify(() => {});
    mock.resetAll();
  });
  it('getNext existCheck is Open', () => {
    const unique = new Unique(0, 'hello', () => '', { exist });
    const order = VerifyOrder.create();
    const mock = mockObject.create(
      exist,
      VerifyOrderConfig.create('exist', order),
    );
    mock.mockFunction('isExist').forever(false);
    mock.mockFunction('addExist').forever(true);
    expect(unique.getNext()).toBe('hello0');
    expect(unique.getNext()).toBe('hello1');
    expect(unique.getNext()).toBe('hello2');
    expect(unique.getLastIndex()).toBe(3);
    order.verify((paramVal: any) => {
      const { exist: existVal } = paramVal;
      existVal.isExist('hello0');
      existVal.addExist('hello0');

      existVal.isExist('hello1');
      existVal.addExist('hello1');

      existVal.isExist('hello2');
      existVal.addExist('hello2');
    });
    mock.resetAll();
  });

  it('getLastIndex', () => {
    const unique = new Unique(10, 'age', () => 'xx');
    const mock = mockObject.create(exist);
    mock.mockFunction('isExist').forever(false);

    expect(unique.getNext()).toBe('agexx10');
    expect(unique.getNext()).toBe('agexx11');
    expect(unique.getNext()).toBe('agexx12');
    expect(unique.getNext()).toBe('agexx13');
    expect(unique.getLastIndex()).toBe(14);

    mock.resetAll();
  });

  it('getNgenerateIdext', () => {
    const unique = new Unique(10, 'age', () => 'xx');
    expect(unique.generateId(100)).toBe('agexx100');
  });

  it('getNgenerateIdext randCount', () => {
    const unique = new Unique(10, 'age', () => 'xx');
    expect(unique.generateId(100, { randCount: 2 })).toBe('agexxxx100');
    expect(unique.generateId(100, { randCount: 3 })).toBe('agexxxxxx100');
    expect(unique.generateId(100, { randCount: 4 })).toBe('agexxxxxxxx100');
  });

  it('now', () => {
    const year = 2017;
    const month = 11;
    const date = 22;
    const hour = 12;
    const minute = 32;
    const second = 31;
    const millSeconde = 555;
    const val = new Date();
    val.setFullYear(year, month, date);
    val.setHours(hour);
    val.setMinutes(minute);
    val.setSeconds(second);
    val.setMilliseconds(millSeconde);
    expect(now(val)).toBe('20171122123231_555');
  });
});
