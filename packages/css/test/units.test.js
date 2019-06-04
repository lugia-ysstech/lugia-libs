/**
 *
 * create by ligx
 *
 * @flow
 */
import { style2css, units } from '../src';

const {
  px2rem,
  rem2em,
  px2emcss,
  number2px,
  px2Number,
  point2Style,
  getPointByStyle,
  size2Style,
  getSizeByStyle,
} = units;

describe('units', () => {
  beforeEach(() => {});

  it('px2rem', () => {
    expect(px2rem(5)).toBe(0.5);
    expect(px2rem(1)).toBe(0.1);
  });
  it('rem2em', () => {
    expect(rem2em(5, 1)).toBe(5);
    expect(rem2em(2, 0.5)).toBe(4);
    expect(rem2em(2, 2)).toBe(1);
  });
  it('px2em', () => {
    expect(px2emcss(1)(100)).toBe('10em');
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

  it('px2Number', () => {
    expect(px2Number('2px')).toEqual(2);
    expect(px2Number('21px')).toEqual(21);
  });

  it('number2px', () => {
    expect(number2px(2)).toEqual('2px');
    expect(number2px(21)).toEqual('21px');
  });

  it('getSizeByStyle', () => {
    expect(
      getSizeByStyle({
        width: '50px',
        height: '100px',
      }),
    ).toEqual({ width: 50, height: 100 });
  });

  it('size2Style', () => {
    expect(size2Style({ width: 50, height: 100 })).toEqual({
      width: '50px',
      height: '100px',
    });
  });

  it('getPointByStyle', () => {
    expect(getPointByStyle({ left: '5px', top: '11px' })).toEqual([5, 11]);
  });

  it('point2Style', () => {
    expect(point2Style([4, 3])).toEqual({ left: '4px', top: '3px' });
  });
});
