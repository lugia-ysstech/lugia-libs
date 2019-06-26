// @flow

import * as React from 'react';
import {
  filterRepeatCSSConfigSelectNames,
  filterRepeatCSSMetaSelctNames,
  filterRepeatSelectNames,
  getAttributeValue,
  getBorder,
  getBorderRadius,
  getBoxShadow,
  getBoxShadowCSS,
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
        color: 'red',
      },
      left: {
        color: 'red',
      },
      bottom: {
        color: 'red',
      },
      right: {
        color: 'red',
      },
    });
  });

  it('getBorder all', () => {
    const config = {
      color: 'red',
      width: 5,
      style: 'solid',
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
      topLeft: 10,
      topRight: 10,
      bottomLeft: 10,
      bottomRight: 10,
    });

    expect(getBorderRadius('20%', ['tr', 'br'])).toEqual({
      topRight: '20%',
      bottomRight: '20%',
    });
  });

  it('get Border top left ', () => {
    const config = {
      color: 'red',
      width: 5,
      style: 'solid',
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
      color: 'red',
      width: 5,
      style: 'solid',
    };
    expect(
      getBorder(
        { color: 'red', style: 'solid', width: 5 },
        { directions: ['l', 't'], radius: 10 },
      ),
    ).toEqual({
      top: config,
      left: config,
      radius: {
        topLeft: 10,
        topRight: 10,
        bottomLeft: 10,
        bottomRight: 10,
      },
    });
  });
  it('filterRepeatSelectNames', () => {
    expect(filterRepeatSelectNames([['a'], ['b'], ['a']])).toEqual([
      ['a'],
      ['b'],
    ]);
    expect(
      filterRepeatSelectNames([
        ['a'],
        ['a', 'b'],
        ['a', 'c'],
        ['a', 'b'],
        ['d'],
      ]),
    ).toEqual([['a'], ['a', 'b'], ['a', 'c'], ['d']]);
  });

  it('filterRepeatCSSMetaSelctNames has selNames', () => {
    const meta = {
      selectNames: [['a'], ['a', 'b'], ['a', 'c'], ['a', 'b'], ['d']],
    };
    filterRepeatCSSMetaSelctNames(meta);
    expect(meta).toBe(meta);
    expect(meta).toEqual({
      selectNames: [['a'], ['a', 'b'], ['a', 'c'], ['d']],
    });
  });
  it('filterRepeatCSSMetaSelctNames not has selNames', () => {
    const meta = {};
    filterRepeatCSSMetaSelctNames(meta);
    expect(meta).toBe(meta);
    expect(meta).toEqual({});
  });
  it('filterRepeatCSSConfigSelctNames not has selNames', () => {
    const config = {
      normal: {},
      hover: {},
      className: 'aa',
    };
    filterRepeatCSSConfigSelectNames(config);
    expect(config).toBe(config);
    expect(config).toEqual({
      normal: {},
      hover: {},
      className: 'aa',
    });
  });

  it('filterRepeatCSSConfigSelectNames  has selNames', () => {
    const config = {
      normal: {
        selectNames: [
          ['a'],
          ['a', 'b', 'c'],
          ['bc'],
          ['a', 'b', 'c'],
          ['bc'],
          ['a'],
          ['g'],
        ],
      },
      hover: {},
      className: 'aa',
    };
    filterRepeatCSSConfigSelectNames(config);
    expect(config).toBe(config);
    expect(config).toEqual({
      normal: {
        selectNames: [['a'], ['a', 'b', 'c'], ['bc'], ['g']],
      },
      className: 'aa',
      hover: {},
    });
  });

  it('getBoxShadow', () => {
    expect(getBoxShadow('8px   -12px   8px rgba(0, 0, 0, .6)')).toEqual({
      x: 8,
      y: -12,
      blur: 8,
      spread: 0,
      type: 'outset',
      color: 'rgba(0, 0, 0, .6)',
    });

    expect(
      getBoxShadow('inset 8px   -12px   8px   6px rgba(0, 0, 0, .6)'),
    ).toEqual({
      x: 8,
      y: -12,
      blur: 8,
      spread: 6,
      type: 'inset',
      color: 'rgba(0, 0, 0, .6)',
    });

    expect(getBoxShadow('inset 8px   -12px')).toEqual({
      x: 8,
      y: -12,
      blur: 0,
      spread: 0,
      type: 'inset',
      color: '',
    });

    expect(getBoxShadow('8px   -12px rgba(0, 0, 0, .6)')).toEqual({
      x: 8,
      y: -12,
      blur: 0,
      spread: 0,
      type: 'outset',
      color: 'rgba(0, 0, 0, .6)',
    });

    expect(getBoxShadow('inset 8px   -12px rgba(0, 0, 0, .6)')).toEqual({
      x: 8,
      y: -12,
      blur: 0,
      spread: 0,
      type: 'inset',
      color: 'rgba(0, 0, 0, .6)',
    });

    expect(getBoxShadow('8px   -12px red')).toEqual({
      x: 8,
      y: -12,
      blur: 0,
      spread: 0,
      type: 'outset',
      color: 'red',
    });

    expect(getBoxShadow('inset 8px   -12px red')).toEqual({
      x: 8,
      y: -12,
      blur: 0,
      spread: 0,
      type: 'inset',
      color: 'red',
    });
  });
  it('getBoxShadowCSS', () => {
    expect(
      getBoxShadowCSS({
        x: 8,
        y: -12,
        blur: 8,
        spread: 0,
        type: 'outset',
        color: 'rgba(0, 0, 0, .6)',
      }),
    ).toEqual('8px -12px 8px 0px rgba(0, 0, 0, .6)');

    expect(
      getBoxShadowCSS({
        x: 8,
        y: -12,
        blur: 5,
        spread: 5,
        type: 'outset',
        color: 'red',
      }),
    ).toEqual('8px -12px 5px 5px red');

    expect(
      getBoxShadowCSS({
        x: 8,
        y: -12,
        blur: 5,
        spread: 5,
        type: 'inset',
        color: 'red',
      }),
    ).toEqual('inset 8px -12px 5px 5px red');
  });
});
