declare module '@lugia/math' {
  declare export type LimitRange = {
    max: number,
    min: number,
  };

  declare export function limitByConfig(val: number, opt: LimitRange): number;

  declare export function fixed(val: number, fixCnt: number): number;

  declare export function isInLimit(val: number, range: number[]): boolean;

  declare export function limit(val: number, range: number[]): number;

  declare export function limitToSet(val: number[], range: number[]): number[];

  declare export function valueInRange(val: number, range: number[]): boolean;

  declare export function getMinAndMax(range: number[]): LimitRange;

  declare export function sortable(a: number, b: number): number;

  declare export function accAdd(
    value: number,
    step: number,
    precision: number,
  ): number;

  declare export function checkNumber(value: string): string;
}
