/**
 *
 * create by likunru on 2021/3/5
 *
 * @flow
 */

export function enDash2UpperCaseLetter(str: string) {
  const camelCaseStr = str.replace(/-(\w)/g, (_, letter) => {
    return letter.toUpperCase();
  });
  return camelCaseStr.charAt(0).toUpperCase() + camelCaseStr.slice(1);
}

export function upperCaseLetter2EnDash(str: string) {
  return str.replace(/([A-Z])/g, (_, letter, index) => {
    const lowerCase = letter.toLowerCase();
    return index === 0 ? lowerCase : `-${lowerCase}`;
  });
}

export function replaceString2Number(str: string) {
  return str.replace(/[^0-9.]/g, '');
}

const LowerCaseLetterRegExp = new RegExp('[a-z]');

export function isLowerCaseLetter(letter: string): boolean {
  return oneLetterTest(letter, LowerCaseLetterRegExp);
}

const UpCaseLetterRegExp = new RegExp('[A-Z]');
export function isUpCaseLetter(letter: string): boolean {
  return oneLetterTest(letter, UpCaseLetterRegExp);
}

function oneLetterTest(letter: string, regExp: RegExp) {
  if (letter.length !== 1) {
    return false;
  }
  return regExp.test(letter);
}
