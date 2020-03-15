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
  namespace2value: Object;
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
    return namespace[name];
  }

  load(nameSpace: string, value: Object): any {
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

const name2Dict = {};

export function existDict(name: string): boolean {
  return name in name2Dict && name2Dict[name];
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
