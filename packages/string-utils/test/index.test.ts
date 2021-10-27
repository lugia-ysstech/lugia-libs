// @flow
import {
  enDash2UpperCaseLetter,
  replaceString2Number,
  upperCaseLetter2EnDash,
} from '../src';

describe('string-utils', () => {
  it('enDash2UpperCaseLetter', () => {
    expect(enDash2UpperCaseLetter('a-b')).toEqual('AB');
    expect(enDash2UpperCaseLetter('a')).toEqual('A');
    expect(enDash2UpperCaseLetter('a-b-c')).toEqual('ABC');
    expect(enDash2UpperCaseLetter('a-bc')).toEqual('ABc');
    expect(enDash2UpperCaseLetter('amount-input')).toEqual('AmountInput');
    expect(enDash2UpperCaseLetter('button')).toEqual('Button');
    expect(enDash2UpperCaseLetter('tree-select')).toEqual('TreeSelect');
  });

  it('upperCaseLetter2EnDash', () => {
    expect(upperCaseLetter2EnDash('A')).toEqual('a');
    expect(upperCaseLetter2EnDash('a')).toEqual('a');
    expect(upperCaseLetter2EnDash('aB')).toEqual('a-b');
    expect(upperCaseLetter2EnDash('AB')).toEqual('a-b');
    expect(upperCaseLetter2EnDash('aB2')).toEqual('a-b2');
    expect(upperCaseLetter2EnDash('aB2C')).toEqual('a-b2-c');
    expect(upperCaseLetter2EnDash('AmountInput')).toEqual('amount-input');
    expect(upperCaseLetter2EnDash('Button')).toEqual('button');
    expect(upperCaseLetter2EnDash('TreeSelect')).toEqual('tree-select');
  });

  it('replaceString2Number', () => {
    expect(replaceString2Number('a')).toEqual('');
    expect(replaceString2Number('123')).toEqual('123');
    expect(replaceString2Number('0')).toEqual('0');
    expect(replaceString2Number('01')).toEqual('01');
    expect(replaceString2Number('a1a')).toEqual('1');
  });
});
