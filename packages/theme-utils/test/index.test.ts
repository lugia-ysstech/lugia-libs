// @flow

import {
  getDictValue,
  getBorder,
  getBorderRadius,
  getBoxShadow,
  getBoxShadowCSS,
} from '../src';
import { getDict } from '@lugia/dict';

describe('theme-utils', () => {
  const globalConfig = {
    bgColor: 'red',
    fontSize: 15,
    secondFontSize: '50%',
    threeFontSize: '25',
    borderRadius: '20px',
  };

  beforeAll(() => {
    const dict = getDict('lugia-web');
    dict.load('default', globalConfig);
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

  it('getDictValue is normal', () => {
    expect(getDictValue(1)).toBe(1);
    expect(getDictValue('hello')).toBe('hello');
    expect(getDictValue(false)).toBe(false);
    expect(getDictValue(true)).toBe(true);
    expect(getDictValue(null)).toBe(null);
    expect(getDictValue(undefined)).toBe(undefined);
  });

  it('getDictValue is dict config', () => {
    expect(getDictValue('$lugia-dict.aaa.bgColor')).toEqual(undefined);
    expect(getDictValue('$lugia-dict.lugia-web.bgColor')).toBe('red');
    expect(getDictValue('$lugia-dict.lugia-web.fontSize')).toBe(15);
    expect(getDictValue('$lugia-dict.lugia-web.borderRadius')).toBe('20px');

    const dict = getDict('agg');
    dict.load('default', {
      bgColor: 'ligx',
    });
    expect(getDictValue('$lugia-dict.agg.bgColor')).toBe('ligx');
    expect(getDictValue('$lugia-dict.agg.a.color')).toBe(undefined);
  });

  it('getDictValue cycle value', () => {
    const dict = getDict('agg');
    dict.load('default', {
      bgColor: 'ligx',
      borderColor: {
        width: 5,
        color: 'red',
        fontSize: {
          size: '1',
        },
      },
    });
    expect(getDictValue('$lugia-dict.agg.borderColor')).toEqual({
      width: 5,
      color: 'red',
      fontSize: {
        size: '1',
      },
    });
    expect(getDictValue('$lugia-dict.agg.borderColor.aaa.aaa')).toBeUndefined();
    expect(getDictValue('$lugia-dict.agg.borderColor.width')).toBe(5);
    expect(getDictValue('$lugia-dict.agg.borderColor.fontSize')).toEqual({
      size: '1',
    });
    expect(getDictValue('$lugia-dict.agg.borderColor.fontSize.size')).toBe('1');
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
