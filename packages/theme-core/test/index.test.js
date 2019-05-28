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

import { getConfig, getKeys, getObject } from '../src';

describe('theme-core-utils', () => {
  it('getKeys', () => {
    expect(getKeys({})).toEqual([]);
    expect(getKeys({ a: '1', b: 'hell' })).toEqual(['a', 'b']);
  });

  it('getObject', () => {
    expect(getObject({}, 'a')).toBeUndefined();
    expect(getObject({ a: 'hello' }, 'a')).toEqual('hello');
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
