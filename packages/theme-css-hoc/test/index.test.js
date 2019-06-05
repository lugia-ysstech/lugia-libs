// @flow

import * as React from 'react';
import {
  getAttributeValue,
  getBorder,
  getBorderRadius,
  getSelectNameThemeMeta,
  packObject,
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

  it('getBorder only color', () => {
    expect(getBorder({ color: 'red' })).toEqual({
      top: {
        borderColor: 'red',
      },
      left: {
        borderColor: 'red',
      },
      bottom: {
        borderColor: 'red',
      },
      right: {
        borderColor: 'red',
      },
    });
  });

  it('getBorder all', () => {
    const config = {
      borderColor: 'red',
      borderWidth: 5,
      borderStyle: 'solid',
    };
    expect(getBorder({ color: 'red', style: 'solid', width: 5 })).toEqual({
      top: config,
      left: config,
      bottom: config,
      right: config,
    });
  });

  it('getBorderRadius all', () => {
    expect(getBorderRadius('', [])).toEqual({});
    expect(getBorderRadius(10)).toEqual({
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    });

    expect(getBorderRadius('20%', ['tr', 'br'])).toEqual({
      borderTopRightRadius: '20%',
      borderBottomRightRadius: '20%',
    });
  });

  it('get Border top left ', () => {
    const config = {
      borderColor: 'red',
      borderWidth: 5,
      borderStyle: 'solid',
    };
    expect(
      getBorder(
        { color: 'red', style: 'solid', width: 5 },
        { directions: ['l', 't'] },
      ),
    ).toEqual({
      top: config,
      left: config,
    });

    expect(
      getBorder({ color: 'red', style: 'solid', width: 5 }, { directions: [] }),
    ).toEqual({});

    expect(
      getBorder(
        {
          color: 'red',
          style: 'solid',
          width: 5,
        },
        { directions: ['l', 't', 'l', 't'] },
      ),
    ).toEqual({
      top: config,
      left: config,
    });
  });

  it('get Border top left radius ', () => {
    const config = {
      borderColor: 'red',
      borderWidth: 5,
      borderStyle: 'solid',
    };
    expect(
      getBorder(
        { color: 'red', style: 'solid', width: 5 },
        { directions: ['l', 't'], radius: 10 },
      ),
    ).toEqual({
      top: config,
      left: config,
      borderRadius: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      },
    });
  });
});
