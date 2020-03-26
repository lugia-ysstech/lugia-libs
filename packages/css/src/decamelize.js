/**
 *
 * copy by  decamelize@v4.0.0 module
 * create by ligx
 *
 * @flow
 */
import xRegExp from 'xregexp';
export default (text, separator = '_') => {
  if (!(typeof text === 'string' && typeof separator === 'string')) {
    throw new TypeError(
      'The `text` and `separator` arguments should be of type `string`',
    );
  }
  const regex1 = xRegExp('([\\p{Ll}\\d])(\\p{Lu})', 'g');
  const regex2 = xRegExp('(\\p{Lu}+)(\\p{Lu}[\\p{Ll}\\d]+)', 'g');
  return text
    .replace(regex1, `$1${separator}$2`)
    .replace(regex2, `$1${separator}$2`)
    .toLowerCase();
};
