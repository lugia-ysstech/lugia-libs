// @flow
import {
  deepMerge,
  deepMergeAnB,
  diffABWhenAttrIfExist,
  getAttributeFromObject,
  getAttributeValue,
  getIndexfromKey,
  getKeyfromIndex,
  isEmptyObject,
  moveToTargetIfKeyIsInSource,
  object2pathObject,
  packObject,
  packPathObject,
  setAttributeValue,
} from '../src/index';

const Object = {
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
describe('Object', () => {
  it('getAttributeValue', () => {
    expect(getAttributeValue({ a: 0 }, ['a'])).toBe(0);
    expect(getAttributeValue(null, [])).toBeUndefined();
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
    const obj: Object = null;
    expect(packObject(obj, 1)).toEqual({});
  });
  it('getAttributeFromObject has', () => {
    expect(getAttributeFromObject(Object, 'top', 0)).toEqual(1);
    expect(getAttributeFromObject(Object, 'left', 0)).toEqual(2);
    expect(getAttributeFromObject(Object, 'right', 0)).toEqual(3);
  });
  it('getAttributeFromObject error attr', () => {
    expect(getAttributeFromObject(Object, 'topleft', 0)).toEqual(0);
  });
  it('getAttributeFromObject any attr', () => {
    expect(getAttributeFromObject(Object, 'any', '123')).toEqual('123');
  });
  it('getAttributeFromObject  Object.attr  0', () => {
    expect(getAttributeFromObject(Object, 'bottom', '5')).toEqual(0);
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
  it('deepMerge', () => {
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

  it('deepMerge three obj', () => {
    expect(deepMerge({})).toEqual({});
    expect(deepMerge()).toEqual({});

    const a = { text: 'world' };
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

    expect(deepMergeAnB(null, null, { beforeNames: [] })).toEqual({});
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
      diffABWhenAttrIfExist({
        a: 'hello',
      }),
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
    const obj = {};
    setAttributeValue(obj, ['hello', 'name'], 'ligx');
    expect(obj).toEqual({
      hello: {
        name: 'ligx',
      },
    });

    setAttributeValue(obj, ['hello', 'age'], 15);

    expect(obj).toEqual({
      hello: {
        name: 'ligx',
        age: 15,
      },
    });

    setAttributeValue(obj, ['hello', 'name'], { title: 'xiaoming' });
    expect(obj).toEqual({
      hello: {
        name: { title: 'xiaoming' },
        age: 15,
      },
    });

    setAttributeValue(obj, ['hello', 'name', 'age'], 155);
    expect(obj).toEqual({
      hello: {
        name: { title: 'xiaoming', age: 155 },
        age: 15,
      },
    });

    setAttributeValue(obj, ['hello', 'name'], 155);
    expect(obj).toEqual({
      hello: {
        name: 155,
        age: 15,
      },
    });

    setAttributeValue(obj, ['hello', 'name', 'age'], 155);
    expect(obj).toEqual({
      hello: {
        name: {
          age: 155,
        },
        age: 15,
      },
    });

    setAttributeValue(obj, ['hello'], 155);
    expect(obj).toEqual({
      hello: 155,
    });
    setAttributeValue(obj, ['hello', 'age'], 155);
    expect(obj).toEqual({
      hello: {
        age: 155,
      },
    });
    setAttributeValue(obj, ['hello', 'age'], 155);
    expect(obj).toEqual({
      hello: {
        age: 155,
      },
    });
    setAttributeValue(obj, ['hello', 'age', 'add', 'info'], {
      ip: '1987',
    });
    expect(obj).toEqual({
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
});
