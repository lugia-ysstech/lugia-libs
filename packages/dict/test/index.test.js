/**
 *
 * create by ligx
 *
 */
import { createDict, getDict, existDict } from '../src';

describe('Dict', () => {
  let dict;
  beforeEach(() => {
    dict = createDict('@lugia/lugia-web');
    dict.load('production', { bgColor: 'red', borderColor: 'yellow' });
    dict.load('dev', { bgColor: 'yellow', borderColor: 'red' });
  });

  it('dict.get for path', () => {
    const dict = createDict('@lugia/lugia-web');
    dict.load('lgx', {
      bgColor: 'yellow',
      borderColor: 'red',
      lgx: { name: 1, score: { math: 100 } },
    });
    expect(dict.get('lgx')).toEqual({ name: 1, score: { math: 100 } });
    expect(dict.get('lgx.name')).toEqual(1);
    expect(dict.get('lgx.score.math')).toEqual(100);
    expect(dict.get('lgx.a.a')).toBeUndefined();
  });

  it('dict.load namespace empty string', () => {
    const dict = createDict('@lugia/lugia-web');
    dict.load('', { bgColor: 'yellow', borderColor: 'red' });
    expect(dict.get('bgColor')).toBeUndefined();
    expect(dict.get('borderColor')).toBeUndefined();
  });

  it('dict.load namespace type is not string', () => {
    const dict = createDict('@lugia/lugia-web');
    dict.load(1, { bgColor: 'yellow', borderColor: 'red' });
    dict.load(null, { bgColor: 'yellow', borderColor: 'red' });
    dict.load([], { bgColor: 'yellow', borderColor: 'red' });
    dict.load({}, { bgColor: 'yellow', borderColor: 'red' });
    expect(dict.get('bgColor')).toBeUndefined();
    expect(dict.get('borderColor')).toBeUndefined();
  });

  it('dict.load value  not object', () => {
    const dict = createDict('@lugia/lugia-web');
    dict.load('hello', null);
    dict.load('hello', undefined);
    dict.load('hello', 1);
    dict.load('hello', true);
    dict.load('hello', []);
    dict.load('hello', new Date());
    expect(dict.get('bgColor')).toBeUndefined();
    expect(dict.get('borderColor')).toBeUndefined();
  });

  it('dict.load is first namespace', () => {
    const dict = createDict('@lugia/lugia-web');
    dict.load('dev', { bgColor: 'yellow', borderColor: 'red' });
    dict.load('production', { bgColor: 'red', borderColor: 'yellow' });
    expect(dict.get('bgColor')).toBe('yellow');
    expect(dict.get('borderColor')).toBe('red');
  });

  it('get', () => {
    expect(dict.get('bgColor')).toBe('red');
    expect(dict.get('borderColor')).toBe('yellow');
  });

  it('get not string', () => {
    const dict = createDict('@lugia/lugia-web');
    dict.load('dev', { bgColor: 'yellow', borderColor: 'red', 1: 'hello' });

    expect(dict.get(1)).toBeUndefined();
  });

  it('changeNameSpace empty', () => {
    dict.changeNameSpace('');
    expect(dict.get('bgColor')).toBe('red');
    expect(dict.get('borderColor')).toBe('yellow');

    dict.changeNameSpace(null);
    expect(dict.get('bgColor')).toBe('red');
    expect(dict.get('borderColor')).toBe('yellow');

    dict.changeNameSpace(undefined);
    expect(dict.get('bgColor')).toBe('red');
    expect(dict.get('borderColor')).toBe('yellow');
  });

  it('changeNameSpace not string', () => {
    dict.changeNameSpace(1);
    expect(dict.get('bgColor')).toBe('red');
    expect(dict.get('borderColor')).toBe('yellow');

    dict.changeNameSpace([]);
    expect(dict.get('bgColor')).toBe('red');
    expect(dict.get('borderColor')).toBe('yellow');

    dict.changeNameSpace(true);
    expect(dict.get('bgColor')).toBe('red');
    expect(dict.get('borderColor')).toBe('yellow');
  });

  it('changeNameSpace', () => {
    expect(dict.get('bgColor')).toBe('red');
    expect(dict.get('borderColor')).toBe('yellow');

    dict.changeNameSpace('dev');

    expect(dict.get('bgColor')).toBe('yellow');
    expect(dict.get('borderColor')).toBe('red');
  });

  it('getDict', () => {
    const name = '@lugia/lugia-web';
    expect(existDict(name)).toBeFalsy();
    const dict = getDict(name);
    expect(existDict(name)).toBeTruthy();

    dict.load('production', { bgColor: 'red', borderColor: 'yellow' });
    dict.load('dev', { bgColor: 'yellow', borderColor: 'red' });
    expect(dict.get('bgColor')).toBe('red');
    expect(dict.get('borderColor')).toBe('yellow');
    expect(getDict(name)).toBe(dict);
    expect(dict.get('bgColor')).toBe('red');
    expect(dict.get('borderColor')).toBe('yellow');
  });
});
