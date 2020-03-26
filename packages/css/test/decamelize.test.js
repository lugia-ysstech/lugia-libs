/**
 *
 * create by ligx
 *
 * @flow
 */
import decamelize from '../src/decamelize';

describe('decamelize.test.js', () => {
  beforeEach(() => {});

  it('decamelize', () => {
    expect(decamelize('')).toBe('');
    expect(decamelize('unicornsAndRainbows')).toBe('unicorns_and_rainbows');
    expect(decamelize('UNICORNS AND RAINBOWS')).toBe('unicorns and rainbows');
    expect(decamelize('unicorns-and-rainbows')).toBe('unicorns-and-rainbows');
    expect(decamelize('thisIsATest')).toBe('this_is_a_test');
    expect(decamelize('thisIsATest', ' ')).toBe('this is a test');
    expect(decamelize('thisIsATest', '')).toBe('thisisatest');
    expect(decamelize('unicornRainbow', '|')).toBe('unicorn|rainbow');
    expect(decamelize('thisHasSpecialCharactersLikeČandŠ', ' ')).toBe(
      'this has special characters like čand š',
    );
  });

  it('handles acronyms', () => {
    expect(decamelize('myURLString')).toBe('my_url_string');
    expect(decamelize('URLString')).toBe('url_string');
    expect(decamelize('StringURL')).toBe('string_url');
    expect(decamelize('testGUILabel')).toBe('test_gui_label');
  });
});
