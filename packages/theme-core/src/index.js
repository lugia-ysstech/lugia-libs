/**
 *
 * create by ligx
 *
 * @flow
 */
import {
  addFocusBlurEvent,
  addMouseEvent,
  CSSComponentContainerDisplayName,
  CSSComponentDisplayName,
  filterSelector,
  getConfig,
  getKeys,
  getMatchSelector,
  getObject,
  injectThemeStateEvent,
  hasThemeStateEvent,
  selectThemeMeta,
  selectThemePart,
  ThemeComponentPrefix,
} from './utils';
import ThemeHandle, { packDisplayName } from './ThemeHandle';
import ThemeDesignHandle from './ThemeDesignHandle';
import ThemeStateHandle from './ThemeStateHandle';
import * as React from 'react';

export const ThemeContext: any = React.createContext({});
export {
  packDisplayName,
  ThemeHandle,
  ThemeStateHandle,
  filterSelector,
  ThemeDesignHandle,
  getKeys,
  getObject,
  getConfig,
  getMatchSelector,
  selectThemePart,
  selectThemeMeta,
  CSSComponentDisplayName,
  CSSComponentContainerDisplayName,
  ThemeComponentPrefix,
  addFocusBlurEvent,
  addMouseEvent,
  injectThemeStateEvent,
  hasThemeStateEvent,
};
