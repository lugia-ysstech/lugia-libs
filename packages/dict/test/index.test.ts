/**
 *
 * create by ligx
 *
 */
import { createDict, getDict, existDict } from '../src';

describe('Dict', () => {
  let dict;
  beforeEach(() => {
    dict = createDict();
    dict.load('production', { bgColor: 'red', borderColor: 'yellow' });
    dict.load('dev', { bgColor: 'yellow', borderColor: 'red' });
  });

  it('dict.get for path', () => {
    const target = createDict();
    target.load('lgx', {
      bgColor: 'yellow',
      borderColor: 'red',
      lgx: { name: 1, score: { math: 100 } },
    });
    expect(target.get('lgx')).toEqual({ name: 1, score: { math: 100 } });
    expect(target.get('lgx.name')).toEqual(1);
    expect(target.get('lgx.score.math')).toEqual(100);
    expect(target.get('lgx.a.a')).toBeUndefined();
  });

  it('dict.load namespace empty string', () => {
    const target = createDict();
    target.load('', { bgColor: 'yellow', borderColor: 'red' });
    expect(target.get('bgColor')).toBeUndefined();
    expect(target.get('borderColor')).toBeUndefined();
  });

  it('dict.load namespace type is not string', () => {
    const target = createDict();
    target.load(getAny(1), { bgColor: 'yellow', borderColor: 'red' });
    target.load(getAny(null), { bgColor: 'yellow', borderColor: 'red' });
    target.load(getAny([]), { bgColor: 'yellow', borderColor: 'red' });
    target.load(getAny({}), { bgColor: 'yellow', borderColor: 'red' });
    expect(target.get('bgColor')).toBeUndefined();
    expect(target.get('borderColor')).toBeUndefined();
  });

  function getAny(any: any): any {
    return any;
  }
  it('dict.load value  not object', () => {
    const target = createDict();
    target.load('hello', null);
    target.load('hello', undefined);
    target.load('hello', getAny(1));
    target.load('hello', getAny(true));
    target.load('hello', []);
    target.load('hello', new Date());
    expect(target.get('bgColor')).toBeUndefined();
    expect(target.get('borderColor')).toBeUndefined();
  });

  it('dict.load is first namespace', () => {
    const target = createDict();
    target.load('dev', { bgColor: 'yellow', borderColor: 'red' });
    target.load('production', { bgColor: 'red', borderColor: 'yellow' });
    expect(target.get('bgColor')).toBe('yellow');
    expect(target.get('borderColor')).toBe('red');
  });

  it('get', () => {
    expect(dict.get('bgColor')).toBe('red');
    expect(dict.get('borderColor')).toBe('yellow');
  });

  it('get not string', () => {
    const target = createDict();
    target.load('dev', { bgColor: 'yellow', borderColor: 'red', 1: 'hello' });

    expect(target.get(getAny(1))).toBeUndefined();
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
    const target = getDict(name);
    expect(existDict(name)).toBeTruthy();

    target.load('production', { bgColor: 'red', borderColor: 'yellow' });
    target.load('dev', { bgColor: 'yellow', borderColor: 'red' });
    expect(target.get('bgColor')).toBe('red');
    expect(target.get('borderColor')).toBe('yellow');
    expect(getDict(name)).toBe(target);
    expect(target.get('bgColor')).toBe('red');
    expect(target.get('borderColor')).toBe('yellow');
  });
});
