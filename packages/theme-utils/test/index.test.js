// @flow

import {
  getBorder,
  getBorderRadius,
  getBoxShadow,
  getBoxShadowCSS,
} from '../src/index';

describe('theme-utils', () => {
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
