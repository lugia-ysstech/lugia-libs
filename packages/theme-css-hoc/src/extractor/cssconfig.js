/**
 *
 * create by ligx
 *
 * @flow
 */

import type { CSSConfig, CSSMeta } from '@lugia/theme-css-hoc';
import styled from 'styled-components';

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

export function filterRepeatSelectNames(
  selNames: Array<Array<string>>,
): Array<Array<string>> {
  if (!selNames) {
    return selNames;
  }
  const exist = {};
  return selNames.filter(path => {
    const key = typeof path === 'string' ? path : path.join('.');
    const isExist = !exist[key];
    exist[key] = true;
    return isExist;
  });
}

export function getStyledComponent(cssConfig: CSSConfig): Object {
  const { tag = 'span', extend } = cssConfig;
  const styledElement = extend ? styled(extend) : styled[tag];
  if (!styledElement) {
    throw new Error(`Not support tag: ${tag}`);
  }
  return styledElement;
}
