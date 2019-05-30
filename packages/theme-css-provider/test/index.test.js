// @flow

import * as React from 'react';
import {
  getAttributeValue,
  getSelectNameThemeMeta,
  packObject,
  style2css,
} from '../src/index';

describe('CSSComponent', () => {
  it('getAttributeValue', () => {
    expect(getAttributeValue(null, [])).toBeUndefined();
    expect(getAttributeValue({}, [])).toBeUndefined();
    expect(getAttributeValue({ a: { b: 1 } }, ['a'])).toEqual({ b: 1 });
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

    const objA = { a: { b: { c: 1 } } };
    const objB = { a: { b: { d: 100 } } };
  });

  it('style2css', () => {
    expect(style2css()).toEqual('');
    expect(style2css({})).toEqual('');
    expect(
      style2css({
        background: 'hello',
        red: undefined,
        fontSize: 1,
        color: 'rgb(121,11,11,5)',
      }),
    ).toEqual('background:hello;font-size:1;color:rgb(121,11,11,5);');
  });

  it('style2css backgroundColor', () => {
    expect(
      style2css({
        backgroundColor: 'red',
        borderSize: '1px',
      }),
    ).toEqual('background-color:red;border-size:1px;');
  });

  it('getThemeByConfig', () => {});

  it('getSelectNameThemeMeta selectNames =[]', () => {
    expect(
      getSelectNameThemeMeta(
        {
          a: 1,
          b: 2,
        },
        [],
      ),
    ).toEqual({});
  });
  it('getSelectNameThemeMeta selectNames 不填', () => {
    expect(
      getSelectNameThemeMeta({
        a: 1,
        b: 2,
      }),
    ).toEqual({ a: 1, b: 2 });
  });
});
