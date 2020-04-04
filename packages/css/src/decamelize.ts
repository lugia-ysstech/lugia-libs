/**
 *
 * copy by  decamelize@v4.0.0 module
 * create by ligx
 *
 */
export default function(str: string, sep: string = '_') {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }

  return str
    .replace(/([a-z\d])([A-Z])/g, '$1' + sep + '$2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + sep + '$2')
    .toLowerCase();
}
