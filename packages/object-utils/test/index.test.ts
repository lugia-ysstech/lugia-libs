// @flow
import {
  checkObjectNotEqual,
  cloneTarget,
  deepMerge,
  deepMergeAnB,
  deepMergeForArrayMerge,
  deepMergeOption,
  diffABWhenAttrIfExist,
  getArrayAttributeRef,
  getAttributeFromObject,
  getAttributeValue,
  getIndexfromKey,
  getKeyfromIndex,
  getObjectAttributeRef,
  isEmptyObject,
  isObject,
  moveToTargetIfKeyIsInSource,
  object2pathObject,
  packObject,
  packPathObject,
  setAttributeValue,
  flatObject,
} from '../src';
import { isNumber } from '../../math/src';

const obj = {
  top: 1,
  left: 2,
  right: 3,
  bottom: 0,
};
const data = [
  { key: '1111', index: 0 },
  { index: 1 },
  { key: '3333', index: 2 },
  { key: undefined, index: 3 },
];
describe('object-utils', () => {
  it('getAttributeValue', () => {
    expect(getAttributeValue({ a: 0 }, ['a'])).toBe(0);
    expect(getAttributeValue(getAny(null), [])).toBeUndefined();
    expect(getAttributeValue({}, [])).toBeUndefined();
    expect(getAttributeValue({ a: { b: 1 } }, ['a'])).toEqual({ b: 1 });
    expect(getAttributeValue({ a: { b: 1 } }, ['d'])).toBeUndefined();
    expect(getAttributeValue({ a: { b: 1 } }, ['a', 'b'])).toEqual(1);
  });

  it('packObject', () => {
    expect(packObject(['a', 'b', 'c'], 1)).toEqual({
      a: {
        b: {
          c: 1,
        },
      },
    });
    expect(packObject([], 1)).toEqual({});
    expect(packObject(getAny(null), 1)).toEqual({});
  });
  function getAny(any: any): any {
    return any;
  }
  it('getAttributeFromObject has', () => {
    expect(getAttributeFromObject(obj, 'top', 0)).toEqual(1);
    expect(getAttributeFromObject(obj, 'left', 0)).toEqual(2);
    expect(getAttributeFromObject(obj, 'right', 0)).toEqual(3);
  });
  it('getAttributeFromObject error attr', () => {
    expect(getAttributeFromObject(obj, 'topleft', 0)).toEqual(0);
  });
  it('getAttributeFromObject any attr', () => {
    expect(getAttributeFromObject(obj, 'any', '123')).toEqual('123');
  });
  it('getAttributeFromObject  obj.attr  0', () => {
    expect(getAttributeFromObject(obj, 'bottom', '5')).toEqual(0);
  });

  it('getKeyfromIndex key 2 ', () => {
    expect(getKeyfromIndex(data, 0, 'key')).toEqual('1111');
  });
  it('getKeyfromIndex key 0 ', () => {
    expect(getKeyfromIndex(data, 2, 'key')).toEqual('3333');
  });
  it('getKeyfromIndex key is null ', () => {
    expect(getKeyfromIndex(data, 1, 'key')).toEqual('_key_1');
  });

  it('getIndexfromKey key 3333 ', () => {
    expect(getIndexfromKey(data, 'key', '3333')).toEqual(2);
  });
  it('getIndexfromKey key 1111 ', () => {
    expect(getIndexfromKey(data, 'key', '1111')).toEqual(0);
  });
  it('deepMergeForArrayMerge', () => {
    expect(deepMergeForArrayMerge({ a: [1, 2] }, { a: [3, 4] })).toEqual({
      a: [1, 2, 3, 4],
    });
  });
  it('deepMerge', () => {
    expect(deepMerge({ a: [1, 2] }, { a: [3, 4] })).toEqual({ a: [3, 4] });
    expect(deepMerge(null, {})).toEqual({});
    expect(deepMerge({}, null)).toEqual({});
    expect(deepMerge({ title: 'hello' }, null)).toEqual({ title: 'hello' });
    expect(deepMerge({ title: 'hello' }, { title: 'world' })).toEqual({
      title: 'world',
    });
    const objA = { title: 'hello' };
    expect(objA).toEqual({ title: 'hello' });
    expect(deepMerge(objA, { title: 'world' })).toEqual({ title: 'world' });
    expect(objA).toEqual({ title: 'hello' });
    expect(
      deepMerge(
        { title: 'hello', card: { sex: 'man', score: { yw: 15, sx: 13 } } },
        {
          title: 'world',
          card: { id: 181, score: { hx: 100 } },
        },
      ),
    ).toEqual({
      title: 'world',
      card: { sex: 'man', score: { yw: 15, sx: 13, hx: 100 }, id: 181 },
    });
  });
  it('deepMergeOption', () => {
    expect(
      deepMergeOption([{ a: [1, 2] }, { a: [3, 4], name: 'hello' }]),
    ).toEqual({
      a: [3, 4],
      name: 'hello',
    });
    expect(
      deepMergeOption([{ a: [1, 2] }, { a: [3, 4], name: 'hello' }], {
        arrayMerge: (source: any[], dest: any[]): any[] => {
          return [...source, ...dest];
        },
      }),
    ).toEqual({
      a: [1, 2, 3, 4],
      name: 'hello',
    });

    expect(
      deepMergeOption(
        [{ data: { a: [1, 2] } }, { data: { a: [3, 4] }, name: 'hello' }],
        {
          arrayMerge: (source: any[], dest: any[]): any[] => {
            return [...source, ...dest];
          },
        },
      ),
    ).toEqual({
      data: { a: [1, 2, 3, 4] },
      name: 'hello',
    });
  });

  it('deepMerge three obj', () => {
    expect(deepMerge({})).toEqual({});
    expect(deepMerge()).toEqual({});

    const a: object = { text: 'world' };
    expect(deepMerge(a, { title: 'hello' })).toEqual({
      title: 'hello',
      text: 'world',
    });
    expect(a).toEqual(a);

    expect(deepMerge(a, { title: 'hello' }, { age: 15 })).toEqual({
      title: 'hello',
      text: 'world',
      age: 15,
    });
  });

  it('moveToTargetIfKeyIsInSource', () => {
    const target = {};
    const source = { world: 'chinese', age: 15, name: 'ligx' };
    moveToTargetIfKeyIsInSource('hello', source, target);
    expect(source).toEqual({ world: 'chinese', age: 15, name: 'ligx' });
    expect(target).toEqual({});

    moveToTargetIfKeyIsInSource('world', source, target);
    expect(source).toEqual({ age: 15, name: 'ligx' });
    expect(target).toEqual({ world: 'chinese' });
  });

  it('deepMerge deepMergeAnB', () => {
    expect(
      JSON.stringify(
        deepMergeAnB(
          { background: 'red' },
          { backgroundColor: 'black' },
          { beforeNames: ['backgroundColor'] },
        ),
      ),
    ).toEqual('{"backgroundColor":"black","background":"red"}');

    const result = {
      c: '1',
      b: '2',
      a: '3',
    };

    expect(
      JSON.stringify(
        deepMergeAnB(
          { a: 2, c: '1' },

          { a: '3', b: '2' },

          { beforeNames: ['c', 'b', 'a'] },
        ),
      ),
    ).toEqual(JSON.stringify(result));

    expect(deepMergeAnB(null as any, null as any, { beforeNames: [] })).toEqual(
      {},
    );
  });
  it('isEmptyObject', () => {
    expect(isEmptyObject(null)).toBeTruthy();
    expect(isEmptyObject(undefined)).toBeTruthy();
    expect(isEmptyObject({})).toBeTruthy();
    expect(isEmptyObject({ a: 1 })).toBeFalsy();
    expect(isEmptyObject(0)).toBeTruthy();
    expect(isEmptyObject([])).toBeTruthy();
  });

  it('object2pathObject', () => {
    expect(
      object2pathObject({
        a: {
          b: 1,
          c: 2,
          f: {
            h: 'fhello',
            age: 155,
          },
          g: {
            h: 'hello',
            age: 15,
          },

          k: {
            f: {
              h: '11',
              age: 55,
            },
            g: {
              h: '22',
              age: 2315,
            },
          },
        },
        d: 3,
      }),
    ).toEqual({
      'a.b': 1,
      'a.c': 2,
      'a.g.h': 'hello',
      'a.g.age': 15,
      'a.f.h': 'fhello',
      'a.f.age': 155,
      'a.k.f.h': '11',
      'a.k.f.age': 55,
      'a.k.g.h': '22',
      'a.k.g.age': 2315,
      d: 3,
    });
  });

  it('diffWhenAttrExistAandB d,f,g', () => {
    expect(
      diffABWhenAttrIfExist(
        {
          a: 'hello',
          d: {
            f: {
              g: 100,
            },
          },
        },
        {
          a: 'hello',
          d: {
            f: {
              g: 101,
              ab: 1,
            },
          },
        },
      ),
    ).toEqual(['d.f.g']);
  });

  it('diffWhenAttrExistAandB adfg a', () => {
    expect(
      diffABWhenAttrIfExist(
        {
          a: {
            d: {
              f: {
                g: 100,
              },
            },
          },
          d: {
            f: {
              g: 100,
            },
          },
        },
        {
          a: 'hello',
          d: {
            f: {
              g: 101,
              ab: 1,
            },
          },
        },
      ),
    ).toEqual(['a', 'd.f.g']);
    expect(
      diffABWhenAttrIfExist(
        {
          a: 'hello',
          d: {
            f: {
              g: 101,
              ab: 1,
            },
          },
        },
        {
          a: {
            d: {
              f: {
                g: 100,
              },
            },
          },
          d: {
            f: {
              g: 100,
            },
          },
        },
      ),
    ).toEqual(['a', 'd.f.g']);
  });
  it('diffWhenAttrExistAandB dfg dfg', () => {
    expect(
      diffABWhenAttrIfExist(
        {
          a: 'hello',
          d: {
            f: {
              g: 101,
              ab: 1,
              a: 'hello',
            },
          },
        },
        {
          a: {
            d: {
              f: {
                g: 100,
              },
            },
          },
          d: {
            f: {
              g: 100,
              a: {
                d: {
                  f: {
                    g: 100,
                  },
                },
              },
            },
          },
        },
      ),
    ).toEqual(['a', 'd.f.g', 'd.f.a']);
  });
  it('diffWhenAttrExistAandB', () => {
    expect(diffABWhenAttrIfExist({}, {})).toEqual([]);

    expect(
      diffABWhenAttrIfExist(
        {
          a: 'hello',
        },
        {},
      ),
    ).toEqual([]);

    expect(
      diffABWhenAttrIfExist(
        {
          a: 'hello',
        },
        {},
      ),
    ).toEqual([]);

    expect(
      diffABWhenAttrIfExist(
        {
          a: 'hello',
        },
        {
          a: 'world',
        },
      ),
    ).toEqual(['a']);

    expect(
      diffABWhenAttrIfExist(
        {
          a: 'hello',
        },
        {
          a: 'hello',
        },
      ),
    ).toEqual([]);
  });

  it('setAttributeValue', () => {
    const target = {};
    setAttributeValue(target, ['hello', 'name'], 'ligx');
    expect(target).toEqual({
      hello: {
        name: 'ligx',
      },
    });

    setAttributeValue(target, ['hello', 'age'], 15);

    expect(target).toEqual({
      hello: {
        name: 'ligx',
        age: 15,
      },
    });

    setAttributeValue(target, ['hello', 'name'], { title: 'xiaoming' });
    expect(target).toEqual({
      hello: {
        name: { title: 'xiaoming' },
        age: 15,
      },
    });

    setAttributeValue(target, ['hello', 'name', 'age'], 155);
    expect(target).toEqual({
      hello: {
        name: { title: 'xiaoming', age: 155 },
        age: 15,
      },
    });

    setAttributeValue(target, ['hello', 'name'], 155);
    expect(target).toEqual({
      hello: {
        name: 155,
        age: 15,
      },
    });

    setAttributeValue(target, ['hello', 'name', 'age'], 155);
    expect(target).toEqual({
      hello: {
        name: {
          age: 155,
        },
        age: 15,
      },
    });

    setAttributeValue(target, ['hello'], 155);
    expect(target).toEqual({
      hello: 155,
    });
    setAttributeValue(target, ['hello', 'age'], 155);
    expect(target).toEqual({
      hello: {
        age: 155,
      },
    });
    setAttributeValue(target, ['hello', 'age'], 155);
    expect(target).toEqual({
      hello: {
        age: 155,
      },
    });
    setAttributeValue(target, ['hello', 'age', 'add', 'info'], {
      ip: '1987',
    });
    expect(target).toEqual({
      hello: {
        age: {
          add: {
            info: {
              ip: '1987',
            },
          },
        },
      },
    });
  });

  it('packPathObject', () => {
    const res = packPathObject({
      a: { val: 'hello' },
      'a.b.c': { val: 'world' },
      'b.d.e': {
        val: 'bde',
      },
    });
    expect(res).toEqual({
      a: {
        val: 'hello',
        b: {
          c: { val: 'world' },
        },
      },
      b: {
        d: {
          e: { val: 'bde' },
        },
      },
    });
  });

  it('deepMerge', () => {
    const a = {
      Container: {
        normal: {
          background: {
            color: '#f70a0a',
          },
          border: {
            top: {
              width: 2,
              color: '$lugia-dict.@lugia/lugia-web.themeFocusColor',
              style: 'solid',
            },
            right: {
              width: 2,
              color: '$lugia-dict.@lugia/lugia-web.themeFocusColor',
              style: 'solid',
            },
            bottom: {
              width: 2,
              color: '$lugia-dict.@lugia/lugia-web.themeFocusColor',
              style: 'solid',
            },
            left: {
              width: 2,
              color: '$lugia-dict.@lugia/lugia-web.themeFocusColor',
              style: 'solid',
            },
            all: {
              width: 2,
              style: 'solid',
              color: '$lugia-dict.@lugia/lugia-web.themeFocusColor',
            },
          },
          borderRadius: {
            topLeft: 7.43,
            topRight: 7.43,
            bottomRight: 7.43,
            bottomLeft: 7.43,
          },
        },
      },
    };
    const b = {
      Container: {
        normal: {
          background: {
            color: 'yellow',
          },
          border: {
            top: {
              width: 2,
              color: '$lugia-dict.@lugia/lugia-web.themeFocusColor',
              style: 'solid',
            },
            right: {
              width: 2,
              color: '$lugia-dict.@lugia/lugia-web.themeFocusColor',
              style: 'solid',
            },
            bottom: {
              width: 2,
              color: '$lugia-dict.@lugia/lugia-web.themeFocusColor',
              style: 'solid',
            },
            left: {
              width: 2,
              color: '$lugia-dict.@lugia/lugia-web.themeFocusColor',
              style: 'solid',
            },
            all: {
              width: 2,
              style: 'solid',
              color: '$lugia-dict.@lugia/lugia-web.themeFocusColor',
            },
          },
          borderRadius: {
            topLeft: 7.43,
            topRight: 7.43,
            bottomRight: 7.43,
            bottomLeft: 7.43,
          },
        },
      },
    };
    for (let i = 0; i < 5 * 1000; i++) {
      deepMerge(a, b);
      // Object.assign({}, a, b)
    }
    console.timeEnd('hello');
    console.info(JSON.stringify(deepMerge(a, b)));
  });

  it('getArrayAttributeRef if exist', () => {
    const target = { data: [1, 2], name: 'hello' };
    expect(getArrayAttributeRef(target, 'data')).toBe(target.data);
    expect(getArrayAttributeRef(target, 'name')).toBe('hello');
  });

  it('getArrayAttributeRef if not exist', () => {
    const target: any = { data: [1, 2] };
    expect(getArrayAttributeRef(target, 'name')).toEqual([]);
    expect(getArrayAttributeRef(target, 'name')).toBe(target.name);
  });
  it('getObjectAttributeRef if exist', () => {
    const target = { data: {} };
    expect(getObjectAttributeRef(target, 'data')).toBe(target.data);
  });

  it('getObjectAttributeRef if not exist', () => {
    const target: any = { data: [1, 2] };
    expect(getObjectAttributeRef(target, 'name')).toEqual({});
    expect(getObjectAttributeRef(target, 'name')).toBe(target.name);
  });

  function testIsObject(value: any, target: boolean) {
    it(`testIsObject ${value} isObject: ${target}`, () => {
      expect(isObject(value)).toBe(target);
    });
  }

  testIsObject({}, true);
  testIsObject([], false);
  testIsObject(null, false);
  testIsObject(undefined, false);
  testIsObject(() => {}, false);
  testIsObject(100, false);
  testIsObject(0, false);
  testIsObject(NaN, false);
  testIsObject('string', false);

  function testCloneTarget(target: object, result: object) {
    it(`testCloneTarget ${target} cloneTarget: ${result}`, () => {
      expect(cloneTarget(target)).toEqual(result);
    });
  }

  testCloneTarget(['1', '2'], ['1', '2']);
  testCloneTarget([{ id: '1' }, { id: '2' }], [{ id: '1' }, { id: '2' }]);
  testCloneTarget({}, {});
  testCloneTarget({ id: '1' }, { id: '1' });

  function testCheckObjectNotEqual(
    preObj: object,
    nextObj: object,
    result: boolean,
  ) {
    it(`testCheckObjectNotEqual ${preObj} ${nextObj} checkObjectNotEqual: ${result}`, () => {
      expect(checkObjectNotEqual(preObj, nextObj)).toEqual(result);
    });
  }

  testCheckObjectNotEqual([], [], false);
  testCheckObjectNotEqual({}, {}, false);
  testCheckObjectNotEqual({ id: '1' }, { id: '2' }, true);
  testCheckObjectNotEqual({ id: '1' }, { id: '1' }, false);
  testCheckObjectNotEqual(['1'], ['2'], true);
  testCheckObjectNotEqual(['1'], [1], true);

  it('flatObject', () => {
    const target: any = {
      A: {
        id: 1,
        data: [1, 2],
        children: { C: { id: 2, data: [3, 4] } },
      },
      B: {
        name: 'itemB',
      },
    };
    expect(flatObject(target, 'children')).toEqual({
      A: { id: 1, data: [1, 2], children: { C: { id: 2, data: [3, 4] } } },
      C: { id: 2, data: [3, 4] },
      B: { name: 'itemB' },
    });

    const target1: any = {
      id: 1,
      data: [1, 2],
      children: { id: 2, data: [3, 4] },
    };
    expect(flatObject(target1, 'children')).toEqual({
      id: 1,
      data: [1, 2],
      children: { id: 2, data: [3, 4] },
    });

    const target2: any = {
      id: 1,
      data: [1, 2],
      children: { theme: { a: { theme: { c: 'ddd' } } } },
    };
    expect(flatObject(target2, 'theme')).toEqual({
      id: 1,
      data: [1, 2],
      children: { theme: { a: { theme: { c: 'ddd' } } } },
      a: { theme: { c: 'ddd' } },
      c: 'ddd',
    });
  });
});
