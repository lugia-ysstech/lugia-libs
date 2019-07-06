import {
  filterRepeatCSSConfigSelectNames,
  filterRepeatCSSMetaSelectNames,
  filterRepeatSelectNames,
  getStyledComponent,
} from '../../src/extractor/cssconfig';
import styled from 'styled-components';

describe('theme-css-hoc/extractor/cssconfig', () => {
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
    filterRepeatCSSMetaSelectNames(meta);
    expect(meta).toBe(meta);
    expect(meta).toEqual({
      selectNames: [['a'], ['a', 'b'], ['a', 'c'], ['d']],
    });
  });
  it('filterRepeatCSSMetaSelctNames not has selNames', () => {
    const meta = {};
    filterRepeatCSSMetaSelectNames(meta);
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

  it('getStyledComponent', () => {
    expect(
      getStyledComponent({
        tag: 'span',
        className: 'hello',
      }),
    ).toBe(styled.span);
    expect(
      getStyledComponent({
        tag: 'div',
        className: 'hello',
      }),
    ).toBe(styled.div);

    expect(() => {
      getStyledComponent({
        tag: 'lgx',
        className: 'hello',
      });
    }).toThrowError('Not support tag: lgx');
  });
});
