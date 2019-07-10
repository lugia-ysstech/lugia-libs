declare module '@lugia/unique' {
  declare export type Exist = {
    addExist(key: string): void,
    isExist(key: string): boolean,
  };

  declare export type UniqueOption = { exist?: Exist };

  declare export function switchTestMode(): void;

  declare export function switchProduction(): void;

  declare export function now(date: ?Date): string;

  declare export default class Unique {
    constructor(
      lastIndex: number,
      preString: string,
      rand: Function,
      opt: ?UniqueOption,
    ): Unique;
    getNext(): string;
    equalTo(unique: Object): boolean;
  }
}
