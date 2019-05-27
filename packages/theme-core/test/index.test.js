/**
 * Created Date: Friday, September 28th 2018, 3:43:11 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Thursday, May 23rd 2019, 6:38:45 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import { deepMerge, getConfig, getKeys, getObject } from '../src';

describe('theme-core-utils', () => {
  it('getKeys', () => {
    expect(getKeys({})).toEqual([]);
    expect(getKeys({ a: '1', b: 'hell' })).toEqual(['a', 'b']);
  });

  it('getObject', () => {
    expect(getObject({}, 'a')).toBeUndefined();
    expect(getObject({ a: 'hello' }, 'a')).toEqual('hello');
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

  it('getConfig', () => {
    const result = {
      a: {
        normal: {
          border: {
            bottom: {
              borderBottomColor: 'red',
            },
            top: {
              borderBottomColor: 'red',
            },
          },
        },
      },
      b: {
        hover: {
          background: {
            backgroundColor: 'yellow',
          },
          border: {
            bottom: {
              borderBottomWidth: 5,
            },
          },
        },
      },
      c: {
        disabled: {
          background: 'ylll',
        },
      },
    };

    expect(
      getConfig(
        {
          a: {
            normal: {
              border: {
                top: { borderBottomColor: 'red' },
              },
            },
          },
        },
        {
          a: {
            normal: {
              border: {
                bottom: { borderBottomColor: 'red' },
              },
            },
          },
          b: {
            hover: {
              border: {
                bottom: { borderBottomWidth: 5 },
              },
            },
          },
        },
        {
          b: {
            hover: {
              background: {
                backgroundColor: 'yellow',
              },
            },
          },
          c: {
            disabled: {
              background: 'ylll',
            },
          },
        },
      ),
    ).toEqual(result);
  });
});
