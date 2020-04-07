/**
 *
 * create by ligx
 *
 * @flow
 */

import { CSSConfig, CSSMeta } from '../type';
import styled, { ThemedStyledFunction } from 'styled-components';

export function filterRepeatCSSConfigSelectNames(outCSSConfig: CSSConfig) {
  if (!outCSSConfig) {
    return;
  }
  const { normal, hover, disabled, active, focus } = outCSSConfig;
  normal && filterRepeatCSSMetaSelectNames(normal);
  hover && filterRepeatCSSMetaSelectNames(hover);
  disabled && filterRepeatCSSMetaSelectNames(disabled);
  active && filterRepeatCSSMetaSelectNames(active);
  focus && filterRepeatCSSMetaSelectNames(focus);
}

export function filterRepeatCSSMetaSelectNames(outCSSMeta: CSSMeta) {
  if (!outCSSMeta) {
    return;
  }
  const { selectNames } = outCSSMeta;
  if (selectNames && selectNames.length > 0) {
    outCSSMeta.selectNames = filterRepeatSelectNames(selectNames);
  }
}
type Names = string[];
export function filterRepeatSelectNames(selNames: Names[]): Names[] {
  if (!selNames) {
    return selNames;
  }
  const exist: { [key: string]: boolean } = {};
  return selNames.filter(path => {
    const key = typeof path === 'string' ? path : path.join('.');
    const isExist = !exist[key];
    exist[key] = true;
    return isExist;
  });
}

export function getStyledComponent(
  cssConfig: CSSConfig,
): ThemedStyledFunction<any, any> {
  const { tag = 'span', extend } = cssConfig;
  if (extend) {
    return styled(extend);
  }
  const styledElement = styled[tag];
  if (!styledElement) {
    throw new Error(`Not support tag: ${tag}`);
  }
  return styledElement;
}
