/**
 *
 * create by ligx
 *
 * @flow
 */
import {
  CSSComponentDisplayName,
  getMatchSelector,
  selectThemeMeta,
  getConfig,
  getKeys,
  getObject,
  selectThemePart,
  filterSelector,
  ThemeComponentPrefix,
} from './utils';
import ThemeHandle, { packDisplayName } from './ThemeHandle';
import ThemeDesignHandle from './ThemeDesignHandle';
import * as React from 'react';

export const ThemeContext: any = React.createContext({});
export {
  packDisplayName,
  ThemeHandle,
  filterSelector,
  ThemeDesignHandle,
  getKeys,
  getObject,
  getConfig,
  getMatchSelector,
  selectThemePart,
  selectThemeMeta,
  CSSComponentDisplayName,
  ThemeComponentPrefix,
};
