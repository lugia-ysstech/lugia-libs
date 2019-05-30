/**
 *
 * create by ligx
 *
 * @flow
 */
import { style2css, units } from '../src';

const { px2rem, rem2em, px2emcss } = units;

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
});
