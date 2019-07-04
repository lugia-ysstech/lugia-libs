import {
  filterRepeatCSSConfigSelectNames,
  filterRepeatCSSMetaSelectNames,
  filterRepeatSelectNames,
} from '../../src/extractor/cssconfig';

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
});
