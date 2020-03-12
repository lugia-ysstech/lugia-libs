declare module '@lugia/dict' {
  declare class Dict {
    get(name: string): any;
    load(nameSpace: string, value: Object): any;
    changeNameSpace(nameSpace: string): void;
  }
  declare export function createDict(): Dict;
  declare export function getDict(dictName: string): Dict;
}
