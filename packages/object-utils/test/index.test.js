// @flow
import {
  deepMerge,
  deepMergeAnB,
  getAttributeFromObject,
  getIndexfromKey,
  getKeyfromIndex,
  getAttributeValue,
  packObject,
  isEmptyObject,
  moveToTargetIfKeyIsInSource,
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

    expect(deepMergeAnB(null, null, {})).toEqual({});
  });
  it('isEmptyObject', () => {
    expect(isEmptyObject(null)).toBeTruthy();
    expect(isEmptyObject(undefined)).toBeTruthy();
    expect(isEmptyObject({})).toBeTruthy();
    expect(isEmptyObject({ a: 1 })).toBeFalsy();
    expect(isEmptyObject(0)).toBeTruthy();
    expect(isEmptyObject([])).toBeTruthy();
  });
});
