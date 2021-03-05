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
