/**
 *
 * create by ligx
 *
 * @flow
 */

export function tillMethodAttribute(
  paramA: Object,
): { [key: string]: Object[] } {
  const events = {};
  paramA &&
    Object.keys(paramA).reduce((pre, current) => {
      if (typeof paramA[current] === 'function') {
        let config = pre[current];
        if (!config) {
          pre[current] = config = [];
        }
        config.push(paramA[current]);
      }
      return pre;
    }, events);
  return events;
}

export function combineMethodObject(...rest: Object[]): Object {
  const res = {};
  if (!rest) {
    return res;
  }

  const valuesObjects = rest.map(param => tillMethodAttribute(param));

  const keyObj = {};

  valuesObjects.forEach(obj => {
    Object.keys(obj).forEach(key => (keyObj[key] = true));
  });

  Object.keys(keyObj).forEach(key => {
    const values = [];
    valuesObjects.forEach(obj => {
      const value = obj[key];
      if (value) {
        Array.prototype.push.apply(values, value);
      }
    });
    res[key] = values;
  });
  return res;
}

export function combineFunction(param: {
  targets: Object[],
  option?: { returned: ?Object },
}): Object {
  const { targets, option = {} } = param;

  const { returned } = option;
  const combineObj = combineMethodObject(...targets);
  const res = {};
  Object.keys(combineObj).forEach(key => {
    const method = combineObj[key];
    res[key] = (...rest) => {
      let result;
      method &&
        method.forEach(call => {
          const callResult = call(...rest);
          if (returned && returned[key] === call) {
            result = callResult;
          }
        });

      return result;
    };
  });
  return res;
}
