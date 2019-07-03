import type { BorderRadiusType, BorderType } from '@lugia/theme-core';

declare module '@lugia/theme-utils' {
  declare export type BorderConfig = {
    color?: string,
    width?: number,
    style?: string,
  };

  declare export type BorderDirection = 'l' | 'r' | 'b' | 't';
  declare export type BorderRadiusDirection = 'tl' | 'tr' | 'bl' | 'br';
  declare export type GetBorderOption = {
    radius?: number | string,
    directions?: BorderDirection[],
  };

  declare export function getBorder(
    border: BorderConfig,
    option?: GetBorderOption,
  ): BorderType;

  declare export function getBorderRadius(
    radius: string | number,
    directions?: BorderRadiusDirection[],
  ): BorderRadiusType;

  declare export function getBoxShadow(boxShadow: string): Object;
}
