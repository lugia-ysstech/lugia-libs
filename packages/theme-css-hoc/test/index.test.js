// @flow

import * as React from 'react';
import {
  filterRepeatCSSConfigSelectNames,
  filterRepeatCSSMetaSelctNames,
  filterRepeatSelectNames,
  getSelectNameThemeMeta,
  getSizeFromTheme,
  getSpaceFromTheme,
} from '../src/index';

describe('theme-css-hoc', () => {
  it('getThemeByConfig', () => {});

  it('getSelectNameThemeMeta selectNames =[]', () => {
    expect(
      getSelectNameThemeMeta(
        {
          a: 1,
          b: 2,
        },
        [],
      ),
    ).toEqual({});
  });
  it('getSelectNameThemeMeta selectNames 不填', () => {
    expect(
      getSelectNameThemeMeta({
        a: 1,
        b: 2,
      }),
    ).toEqual({ a: 1, b: 2 });
  });

  it('filterRepeatSelectNames', () => {
    expect(filterRepeatSelectNames([['a'], ['b'], ['a']])).toEqual([
      ['a'],
      ['b'],
    ]);
    expect(
      filterRepeatSelectNames([
        ['a'],
        ['a', 'b'],
        ['a', 'c'],
        ['a', 'b'],
        ['d'],
      ]),
    ).toEqual([['a'], ['a', 'b'], ['a', 'c'], ['d']]);
  });

  it('filterRepeatCSSMetaSelctNames has selNames', () => {
    const meta = {
      selectNames: [['a'], ['a', 'b'], ['a', 'c'], ['a', 'b'], ['d']],
    };
    filterRepeatCSSMetaSelctNames(meta);
    expect(meta).toBe(meta);
    expect(meta).toEqual({
      selectNames: [['a'], ['a', 'b'], ['a', 'c'], ['d']],
    });
  });
  it('filterRepeatCSSMetaSelctNames not has selNames', () => {
    const meta = {};
    filterRepeatCSSMetaSelctNames(meta);
    expect(meta).toBe(meta);
    expect(meta).toEqual({});
  });
  it('filterRepeatCSSConfigSelctNames not has selNames', () => {
    const config = {
      normal: {},
      hover: {},
      className: 'aa',
    };
    filterRepeatCSSConfigSelectNames(config);
    expect(config).toBe(config);
    expect(config).toEqual({
      normal: {},
      hover: {},
      className: 'aa',
    });
  });

  it('filterRepeatCSSConfigSelectNames  has selNames', () => {
    const config = {
      normal: {
        selectNames: [
          ['a'],
          ['a', 'b', 'c'],
          ['bc'],
          ['a', 'b', 'c'],
          ['bc'],
          ['a'],
          ['g'],
        ],
      },
      hover: {},
      className: 'aa',
    };
    filterRepeatCSSConfigSelectNames(config);
    expect(config).toBe(config);
    expect(config).toEqual({
      normal: {
        selectNames: [['a'], ['a', 'b', 'c'], ['bc'], ['g']],
      },
      className: 'aa',
      hover: {},
    });
  });

  it('getSpaceFromTheme margin', () => {
    expect(getSpaceFromTheme('margin', 5)).toEqual({
      marginLeft: '0.5rem',
      marginTop: '0.5rem',
      marginRight: '0.5rem',
      marginBottom: '0.5rem',
    });
    expect(getSpaceFromTheme('margin', {})).toEqual({
      marginLeft: '0rem',
      marginTop: '0rem',
      marginRight: '0rem',
      marginBottom: '0rem',
    });
    const space: Object = undefined;
    expect(getSpaceFromTheme('margin', space)).toEqual({});
    expect(
      getSpaceFromTheme('margin', {
        left: 5,
      }),
    ).toEqual({
      marginLeft: '0.5rem',
      marginTop: '0rem',
      marginRight: '0rem',
      marginBottom: '0rem',
    });

    expect(
      getSpaceFromTheme('margin', {
        left: 5,
        top: 'a',
      }),
    ).toEqual({
      marginLeft: '0.5rem',
      marginTop: 'a',
      marginRight: '0rem',
      marginBottom: '0rem',
    });
    expect(
      getSpaceFromTheme('margin', {
        left: 5,
        top: 'a',
        right: 15,
      }),
    ).toEqual({
      marginLeft: '0.5rem',
      marginTop: 'a',
      marginRight: '1.5rem',
      marginBottom: '0rem',
    });
  });
  it('getSpaceFromTheme padding', () => {
    expect(getSpaceFromTheme('padding', 5)).toEqual({
      paddingLeft: '0.5rem',
      paddingTop: '0.5rem',
      paddingRight: '0.5rem',
      paddingBottom: '0.5rem',
    });
    expect(getSpaceFromTheme('padding', {})).toEqual({
      paddingLeft: '0rem',
      paddingTop: '0rem',
      paddingRight: '0rem',
      paddingBottom: '0rem',
    });
    const space: Object = undefined;
    expect(getSpaceFromTheme('padding', space)).toEqual({});
    expect(
      getSpaceFromTheme('padding', {
        left: 5,
      }),
    ).toEqual({
      paddingLeft: '0.5rem',
      paddingTop: '0rem',
      paddingRight: '0rem',
      paddingBottom: '0rem',
    });

    expect(
      getSpaceFromTheme('padding', {
        left: 5,
        top: 'a',
      }),
    ).toEqual({
      paddingLeft: '0.5rem',
      paddingTop: 'a',
      paddingRight: '0rem',
      paddingBottom: '0rem',
    });
    expect(
      getSpaceFromTheme('padding', {
        left: 5,
        top: 'a',
        right: 15,
      }),
    ).toEqual({
      paddingLeft: '0.5rem',
      paddingTop: 'a',
      paddingRight: '1.5rem',
      paddingBottom: '0rem',
    });
  });
  it('getSizeFromTheme', () => {
    expect(getSizeFromTheme(5)).toBe('0.5rem');
    expect(getSizeFromTheme(15)).toBe('1.5rem');
    expect(getSizeFromTheme('15')).toBe('1.5rem');
    expect(getSizeFromTheme('50%')).toBe('50%');
  });
});
