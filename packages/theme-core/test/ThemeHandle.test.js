/**
 *
 * create by wcx
 *
 * @flow
 */
import React from 'react';
import 'jest-styled-components';
import { packDisplayName, unPackDisplayName } from '../src/ThemeHandle';

describe('ThemeHandle.test.js', () => {
  it('packDisplayName', () => {
    const widgetName = 'lgx';
    expect(packDisplayName(widgetName)).toBe('lugia_t_hoc_lgx');
    expect(unPackDisplayName(packDisplayName(widgetName))).toBe(widgetName);
  });
});
