/**
 *
 * create by ligx
 *
 * @flow
 */
type MethodObject = {
  [attribute: string]: any;
};
type AnyFunction = (...rest: any[]) => any;
type MethodConfig = {
  [attribute: string]: AnyFunction[];
};
export function tillMethodAttribute(target: MethodObject): MethodConfig {
  const events: MethodObject = {};
  target &&
    Object.keys(target).reduce((pre: MethodObject, current: string) => {
      if (typeof target[current] === 'function') {
        let config: AnyFunction[] = pre[current];
        if (!config) {
          pre[current] = config = [];
        }
        config.push(target[current]);
      }
      return pre;
    }, events);
  return events;
}

export function combineMethodObject(...rest: object[]): MethodConfig {
  const res: MethodObject = {};
  if (!rest) {
    return res;
  }

  const valuesObjects: MethodConfig[] = rest.map(param =>
    tillMethodAttribute(param),
  );

  const keyObj: { [key: string]: boolean } = {};

  valuesObjects.forEach(obj => {
    Object.keys(obj).forEach(key => (keyObj[key] = true));
  });

  Object.keys(keyObj).forEach(key => {
    const values: AnyFunction[] = [];
    valuesObjects.forEach((methodConfig: MethodConfig) => {
      const value = methodConfig[key];
      if (value) {
        Array.prototype.push.apply(values, value);
      }
    });
    res[key] = values;
  });
  return res;
}

export function combineFunction(param: {
  targets: MethodObject[];
  option?: { returned?: { [attribute: string]: AnyFunction } };
}): MethodObject {
  const { targets, option = {} } = param;

  const { returned } = option;
  const combineObj = combineMethodObject(...targets);
  const res: MethodObject = {};
  Object.keys(combineObj).forEach(key => {
    const method = combineObj[key];
    res[key] = (...rest: any[]) => {
      let result;
      method &&
        method.forEach((call: AnyFunction) => {
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
