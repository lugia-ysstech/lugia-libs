/**
 *
 * create by ligx
 *
 * @flow
 */
import { style2css, units } from '../src';
import {
  getEmMultipleForRem,
  getFontSize,
  number2rem,
  px2remcss,
  rem2Number,
} from '../src/units';

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

  it('getFontSize', () => {
    const domNode: Object = null;
    expect(getFontSize(domNode, 0)).toBe(0);
    expect(getFontSize(domNode, 11)).toBe(11);
  });
  it('px2rem', () => {
    expect(px2rem(5)).toBe(0.5);
    expect(px2rem(1)).toBe(0.1);
  });
  it('px2remcss', () => {
    expect(px2remcss(5)).toBe('0.5rem');
    expect(px2remcss(1)).toBe('0.1rem');
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
    expect(px2Number('2000')).toEqual(2000);
    expect(px2Number('a')).toEqual(NaN);
    expect(px2Number('21px')).toEqual(21);
  });

  it('rem2Number', () => {
    expect(rem2Number('252rem')).toEqual(252);
    expect(rem2Number('21rem')).toEqual(21);
  });

  it('number2rem', () => {
    expect(number2rem(2)).toEqual('2rem');
    expect(number2rem(21)).toEqual('21rem');
  });

  it('number2px', () => {
    expect(number2px(2)).toEqual('2px');
    expect(number2px(21)).toEqual('21px');
  });

  it('getSizeByStyle', () => {
    const obj: Object = null;
    expect(getSizeByStyle(obj)).toEqual({ width: 0, height: 0 });
    expect(
      getSizeByStyle({
        width: '50px',
        height: '100px',
      }),
    ).toEqual({ width: 50, height: 100 });
  });

  it('size2Style', () => {
    const obj: Object = null;
    expect(size2Style(obj)).toEqual({});
    expect(size2Style({ width: 50, height: 100 })).toEqual({
      width: '50px',
      height: '100px',
    });
  });

  it('getPointByStyle', () => {
    expect(getPointByStyle({ left: '5px', top: '11px' })).toEqual([5, 11]);
    const obj: Object = null;
    expect(getPointByStyle(obj)).toEqual([0, 0]);
  });

  it('getEmMultipleForRem', () => {
    expect(getEmMultipleForRem(undefined)).toEqual(1);
    expect(getEmMultipleForRem(null)).toEqual(1);
    expect(getEmMultipleForRem(3)).toEqual(0.3);
    expect(getEmMultipleForRem('aaaa')).toEqual(1);
    expect(getEmMultipleForRem(25)).toEqual(2.5);

    expect(getEmMultipleForRem('100')).toEqual(10);
    expect(getEmMultipleForRem('15')).toEqual(1.5);

    expect(getEmMultipleForRem('10px')).toEqual(1);
    expect(getEmMultipleForRem('20px')).toEqual(2);

    expect(getEmMultipleForRem('1rem')).toEqual(1);
    expect(getEmMultipleForRem('2rem')).toEqual(2);
  });

  it('point2Style', () => {
    const obj: Object = null;
    expect(point2Style(obj)).toEqual({});
    expect(point2Style([4, 3])).toEqual({ left: '4px', top: '3px' });
  });

  it('px2rem', () => {
    expect(px2rem(50)).toBe(5);
  });
  it('px2remcss', () => {
    expect(px2remcss(440)).toBe('44rem');
  });
});
