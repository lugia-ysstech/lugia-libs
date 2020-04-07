/**
 *
 * create by ligx
 *
 * @flow
 */

function isNotObject(target: any): boolean {
  return typeof target !== 'object';
}

function isNotEmptyString(nameSpace: any): boolean {
  return !nameSpace || typeof nameSpace !== 'string';
}
class Dict {
  namespace2value: { [namseSpaceName: string]: { [path: string]: any } };
  currentNameSpace: string;

  constructor() {
    this.namespace2value = {};
    this.currentNameSpace = '';
  }

  get(name: string): any {
    if (isNotEmptyString(name)) {
      return;
    }
    const namespace = this.namespace2value[this.currentNameSpace];
    if (isNotObject(namespace)) {
      return;
    }
    const path = name.split('.');
    if (path.length > 1) {
      let target = namespace[path[0]];
      for (let i = 1; i < path.length; i++) {
        const attr = path[i];
        target = target[attr];
        if (!target) {
          return;
        }
      }
      return target;
    } else {
      return namespace[name];
    }
  }

  load(nameSpace: string, value: object): any {
    if (isNotEmptyString(nameSpace)) {
      console.warn('namespace can not  empty!');
      return;
    }
    if (isNotObject(value)) {
      console.warn('value necessary  Object!');
      return;
    }
    if (!this.currentNameSpace) {
      this.currentNameSpace = nameSpace;
    }
    this.namespace2value[nameSpace] = value;
  }

  changeNameSpace(nameSpace: string): void {
    if (isNotEmptyString(nameSpace)) {
      return;
    }
    this.currentNameSpace = nameSpace;
  }
}

const name2Dict: { [dictName: string]: Dict } = {};

export function existDict(name: string): boolean {
  return name in name2Dict && !!name2Dict[name];
}

export function createDict(): Dict {
  return new Dict();
}

export function getDict(dictName: string): Dict {
  if (!name2Dict[dictName]) {
    name2Dict[dictName] = new Dict();
  }
  return name2Dict[dictName];
}
