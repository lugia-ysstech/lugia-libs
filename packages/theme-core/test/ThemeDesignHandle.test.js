/**
 *
 * create by wcx
 *
 * @flow
 */
import 'jest-styled-components';
import ThemeDesignHandle from '../src/ThemeDesignHandle';

const {
  mockObject,
  VerifyOrder,
  VerifyOrderConfig,
} = require('@lugia/jverify');
describe('ThemeHandle.test.js', () => {
  it('packNotInPartObject for css hoc', () => {
    const handle = new ThemeDesignHandle('111');
    const res = handle.packNotInPartObject({
      a: {
        normal: {
          color: 'red',
        },
      },
      b: {
        normal: {
          color: 'blue',
        },
      },
      'a.b.d.e': {
        normal: {
          background: {
            color: 'red',
          },
        },
      },
      'a.b.d.g': {
        normal: {
          background: {
            size: 'large',
          },
        },
      },
    });
    expect(res).toEqual({
      normal: {
        background: {
          color: 'red',
          size: 'large',
        },
      },
    });
  });

  it('getHocTarget for css hoc', () => {
    const handle = new ThemeDesignHandle('111');
    const target = {
      a: {
        normal: {
          color: 'red',
        },
      },
      b: {
        normal: {
          color: 'blue',
        },
      },
      'a.b.d.e': {
        normal: {
          background: {
            color: 'red',
          },
        },
      },
      'a.b.d.g': {
        normal: {
          background: {
            size: 'large',
          },
        },
      },
    };
    const res = handle.getHocTarget(target);
    expect(res).toEqual({});
  });
  it('getHocTarget for packabc', () => {
    const handle = new ThemeDesignHandle('111');
    const target = {
      A: {},
      'A.B': {},
      'A.B.C': {},
      'A.B.C.C1': {},
      'A.B.C.C1.PartA': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'A.B.C.C1.ButtonA': {},
      'A.B.C.C1.ButtonA.PartA': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'A.B.C.C1.ButtonA.ButtonAB': {},
      'A.B.C.C1.ButtonA.ButtonAB.PartA': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'A.B.C.C1.ButtonA.PartB': {
        current: { background: { color: 'black' } },
        normal: { background: { color: 'black' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'A.B.C.C1.ButtonA.PartC': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'A.B.C.C1.ButtonB': {},
      'A.B.C.C1.ButtonB.PartA': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'A.B.C.C1.ButtonB.PartB': {
        current: { background: { color: 'black' } },
        normal: { background: { color: 'black' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'A.B.C.C1.ButtonB.PartC': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'A.B.C.C2': {},
      'A.B.C.C2.PartA': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'A.B.C.C2.ButtonA': {},
      'A.B.C.C2.ButtonA.PartA': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'A.B.C.C2.ButtonA.PartB': {
        current: { background: { color: 'black' } },
        normal: { background: { color: 'black' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'A.B.C.C2.ButtonA.PartC': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'A.B.C.C2.ButtonB': {},
      'A.B.C.C2.ButtonB.PartA': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'A.B.C.C2.ButtonB.PartB': {
        current: { background: { color: 'black' } },
        normal: { background: { color: 'black' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'A.B.C.C2.ButtonB.PartC': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
    };
    const res = handle.getHocTarget(target);
    expect(res).toEqual({
      'A.B.C.C1': [
        'A.B.C.C1.PartA',
        'A.B.C.C1.ButtonA.PartA',
        'A.B.C.C1.ButtonA.ButtonAB.PartA',
        'A.B.C.C1.ButtonA.PartB',
        'A.B.C.C1.ButtonA.PartC',
        'A.B.C.C1.ButtonB.PartA',
        'A.B.C.C1.ButtonB.PartB',
        'A.B.C.C1.ButtonB.PartC',
      ],
      'A.B.C.C2': [
        'A.B.C.C2.PartA',
        'A.B.C.C2.ButtonA.PartA',
        'A.B.C.C2.ButtonA.PartB',
        'A.B.C.C2.ButtonA.PartC',
        'A.B.C.C2.ButtonB.PartA',
        'A.B.C.C2.ButtonB.PartB',
        'A.B.C.C2.ButtonB.PartC',
      ],
    });
  });

  it('getHocTarget for hoc ab abc {b,c}', () => {
    const handle = new ThemeDesignHandle('111');
    const res = handle.getHocTarget({
      a: {},
      'a.b': {},
      'a.b.partA': {
        normal: {},
      },
      'a.b.partB': {
        normal: {},
      },

      'a.b.c': {},
      'a.b.c.partA': {
        normal: {},
      },
      'a.b.c.partB': {
        normal: {},
      },
      'a.b.c.partC': {
        normal: {},
      },
    });
    expect(res).toEqual({
      'a.b': [
        'a.b.partA',
        'a.b.partB',
        'a.b.c.partA',
        'a.b.c.partB',
        'a.b.c.partC',
      ],
    });
  });

  it('getHocTarget for hoc {b, f}', () => {
    const handle = new ThemeDesignHandle('111');
    const res = handle.getHocTarget({
      a: {},
      'a.b': {},
      'a.b.k1': {
        normal: {},
      },
      'a.b.k2': {
        normal: {},
      },
      'a.1': {},
      'a.1.2': {},
      'a.1.2.3': {},
      'a.1.2.3.b': {},
      'a.1.2.3.b.k1': {
        normal: {},
      },
      'a.1.2.3.b.k4': {
        normal: {},
      },
      'a.3.5.6': {},
      'a.3.5.6.f': {},
      'a.3.5.6.f.k3': { normal: {} },
      'a.3.5.6.f.k4': { normal: {} },
    });
    expect(res).toEqual({
      'a.1.2.3.b': ['a.1.2.3.b.k1', 'a.1.2.3.b.k4'],
      'a.3.5.6.f': ['a.3.5.6.f.k3', 'a.3.5.6.f.k4'],
      'a.b': ['a.b.k1', 'a.b.k2'],
    });
  });

  it('getHocTarget for hoc a.3.5.6.f is not exist', () => {
    const handle = new ThemeDesignHandle('111');
    const res = handle.getHocTarget({
      a: {},
      'a.b': {},
      'a.b.k1': {
        normal: {},
      },
      'a.b.k2': {
        normal: {},
      },
      'a.1': {},
      'a.1.2': {},
      'a.1.2.3': {},
      'a.1.2.3.b': {},
      'a.1.2.3.b.k1': {
        normal: {},
      },
      'a.1.2.3.b.k4': {
        normal: {},
      },
      'a.3.5.6': {},
      'a.3.5.6.f.k3': { normal: {} },
      'a.3.5.6.f.k4': { normal: {} },
    });
    expect(res).toEqual({
      'a.1.2.3.b': ['a.1.2.3.b.k1', 'a.1.2.3.b.k4'],
      'a.b': ['a.b.k1', 'a.b.k2'],
    });
  });

  it('packNotInPartObject for hoc ab abc', () => {
    const handle = new ThemeDesignHandle('111');
    const res = handle.packNotInPartObject({
      'a.b': {},
      'a.b.partA': {
        normal: {
          background: {
            color: 'red',
          },
          color: 'blue',
        },
      },
      'a.b.partB': {
        normal: {
          background: {
            size: 'large',
          },
          color: 'red',
        },
      },

      'a.b.c': {},
      'a.b.c.partA': {
        normal: {
          background: {
            color: 'red',
          },
          color: 'blue',
        },
      },
      'a.b.c.partB': {
        normal: {
          background: {
            image: 'bg1',
          },
          color: 'black',
        },
      },
      'a.b.c.partC': {
        normal: {
          background: {
            size: 'small',
          },
          color: 'purple',
        },
      },
    });
    expect(res).toEqual({
      partA: {
        normal: {
          background: {
            color: 'red',
          },
          color: 'blue',
        },
      },
      partB: {
        normal: {
          background: {
            size: 'large',
            image: 'bg1',
          },
        },
      },
      partC: {
        normal: {
          background: {
            size: 'small',
          },
          color: 'purple',
        },
      },
    });
  });
  it('packNotInPartObject for hoc ab abc abd', () => {
    const handle = new ThemeDesignHandle('111');
    const res = handle.packNotInPartObject({
      'a.b': {},
      'a.b.d': {},
      'a.b.d.partA': {
        normal: {
          background: {
            color: 'red',
          },
          color: 'blue',
        },
      },
      'a.b.d.partB': {
        normal: {
          background: {
            size: 'large',
          },
          color: 'red',
        },
      },

      'a.b.c': {},
      'a.b.c.partA': {
        normal: {
          background: {
            color: 'red',
          },
          color: 'blue',
        },
      },
      'a.b.c.partB': {
        normal: {
          background: {
            image: 'bg1',
          },
          color: 'black',
        },
      },
      'a.b.c.partC': {
        normal: {
          background: {
            size: 'small',
          },
          color: 'purple',
        },
      },
    });
    expect(res).toEqual({
      d: {
        partA: {
          normal: {
            background: {
              color: 'red',
            },
            color: 'blue',
          },
        },
        partB: {
          normal: {
            background: {
              size: 'large',
            },
            color: 'red',
          },
        },
      },
      c: {
        partA: {
          normal: {
            background: {
              color: 'red',
            },
            color: 'blue',
          },
        },
        partB: {
          normal: {
            background: {
              image: 'bg1',
            },
            color: 'black',
          },
        },
        partC: {
          normal: {
            background: {
              size: 'small',
            },
            color: 'purple',
          },
        },
      },
    });
  });
  it('foundBranchNode', () => {
    const handle = new ThemeDesignHandle('11');
    expect(
      handle.foundBranchNode({
        a: {},
        b: {},
        e: { a: 1 },
        h: { b: 1 },
        c: {},
      }),
    ).toEqual({
      branchNodeMap: { a: true, b: true, c: true },
      otherKeys: ['e', 'h'],
    });
  });

  it('sortBranchNodeMapAcsByLevelCount', () => {
    const handle = new ThemeDesignHandle('11');
    expect(
      handle.sortBranchNodeMapAcsByLevelCount({
        a: true,
        b: true,
        'a.e.f': true,
        'a.b.c': true,
        'a.b': true,
        'a.c.d.e': true,
        'a.e': true,
        'a.1234567': true,
        'a.1.5': true,
        'a.c.d': true,
        'a.c.d.e.f': true,
      }),
    ).toEqual([
      ['a'],
      ['b'],
      ['a', 'b'],
      ['a', 'e'],
      ['a', '1234567'],
      ['a', 'e', 'f'],
      ['a', 'b', 'c'],
      ['a', '1', '5'],
      ['a', 'c', 'd'],
      ['a', 'c', 'd', 'e'],
      ['a', 'c', 'd', 'e', 'f'],
    ]);
  });

  it('fetchTargetBranch simple path', () => {
    const handle = new ThemeDesignHandle('11');
    expect(handle.fetchTargetBranch([['a'], ['b']])).toEqual({
      a: true,
      b: true,
    });
  });

  it('fetchTargetBranch more path', () => {
    const handle = new ThemeDesignHandle('11');
    expect(
      handle.fetchTargetBranch([
        ['a'],
        ['b'],
        ['a', 'b'],
        ['a', 'e'],
        ['a', '1234567'],
        ['a', 'e', 'f'],
        ['a', 'b', 'c'],
        ['a', '1', '5'],
        ['a', 'c', 'd'],
        ['a', 'c', 'd', 'e'],
        ['a', 'c', 'd', 'e', 'f'],
      ]),
    ).toEqual({
      a: true,
      b: true,
    });
  });

  it('isInTargetBranch', () => {
    const handle = new ThemeDesignHandle('11');
    expect(handle.isInBranchObject({}, ['a', 'b'])).toEqual(false);
    expect(
      handle.isInBranchObject(
        {
          a: true,
          g: true,
        },
        ['a', 'b'],
      ),
    ).toEqual(true);

    expect(
      handle.isInBranchObject(
        {
          a: true,
          g: true,
        },
        ['a', 'e', 'f', 'g', 'h'],
      ),
    ).toEqual(true);

    expect(
      handle.isInBranchObject(
        {
          'a.e.f': true,
          g: true,
        },
        ['a', 'e', 'f', 'g', 'h'],
      ),
    ).toEqual(true);
    expect(
      handle.isInBranchObject(
        {
          'a.e.f.g.h': true,
          g: true,
        },
        ['a', 'e', 'f', 'g', 'h'],
      ),
    ).toEqual(true);
  });

  it('getKeyIfInTargetBranch', () => {
    const handle = new ThemeDesignHandle('11');
    expect(handle.getPathIfInBranchObject({}, ['a', 'b'])).toEqual(undefined);
    expect(
      handle.getPathIfInBranchObject(
        {
          a: true,
          g: true,
        },
        ['a', 'b'],
      ),
    ).toEqual('a');

    expect(
      handle.getPathIfInBranchObject(
        {
          a: true,
          g: true,
        },
        ['a', 'e', 'f', 'g', 'h'],
      ),
    ).toEqual('a');

    expect(
      handle.getPathIfInBranchObject(
        {
          'a.e.f': true,
          g: true,
        },
        ['a', 'e', 'f', 'g', 'h'],
      ),
    ).toEqual('a.e.f');
    expect(
      handle.getPathIfInBranchObject(
        {
          'a.e.f.g.h': true,
          g: true,
        },
        ['a', 'e', 'f', 'g', 'h'],
      ),
    ).toEqual('a.e.f.g.h');
  });

  it('merge', () => {
    const handle = new ThemeDesignHandle('11');
    const paths = [
      'Two.TwoTwo.TwoTwoTwo.PartA',
      'Two.TwoTwo.TwoTwoTwo.ButtonA.PartA',
      'Two.TwoTwo.TwoTwoTwo.ButtonA.PartB',
      'Two.TwoTwo.TwoTwoTwo.ButtonA.PartC',
      'Two.TwoTwo.TwoTwoTwo.ButtonB.PartA',
      'Two.TwoTwo.TwoTwoTwo.ButtonB.PartB',
      'Two.TwoTwo.TwoTwoTwo.ButtonB.PartC',
      'Two.PartA',
      'Two.ButtonA.PartA',
      'Two.ButtonA.PartB',
      'Two.ButtonA.PartC',
      'Two.ButtonB.PartA',
      'Two.ButtonB.PartB',
      'Two.ButtonB.PartC',
    ];

    const target = {
      'Two.TwoTwo.TwoTwoTwo.PartA': { a: 1, b: 2 },

      'Two.TwoTwo.TwoTwoTwo.ButtonA.PartA': { a: 1, b: 2 },
      'Two.TwoTwo.TwoTwoTwo.ButtonA.PartB': { a: 1, b: 2 },
      'Two.TwoTwo.TwoTwoTwo.ButtonA.PartC': { a: 1, b: 2 },

      'Two.TwoTwo.TwoTwoTwo.ButtonB.PartA': { a: 1, b: 2 },
      'Two.TwoTwo.TwoTwoTwo.ButtonB.PartB': { a: 1, b: 2 },
      'Two.TwoTwo.TwoTwoTwo.ButtonB.PartC': { a: 1, b: 2 },

      'Two.PartA': { a: 1, b: 2 },

      'Two.ButtonA.PartA': { a: 1, b: 2 },
      'Two.ButtonA.PartB': { a: 1, b: 2 },
      'Two.ButtonA.PartC': { a: 1, b: 2 },

      'Two.ButtonB.PartA': { a: 1, b: 2 },
      'Two.ButtonB.PartB': { a: 1, b: 2 },
      'Two.ButtonB.PartC': { a: 1, b: 2 },
    };
    expect(handle.pullHocPathData('Two', paths, target)).toEqual({
      PartA: { a: 1, b: 2 },
      ButtonA: {
        PartA: { a: 1, b: 2 },
        PartB: { a: 1, b: 2 },
        PartC: { a: 1, b: 2 },
      },
      ButtonB: {
        PartA: { a: 1, b: 2 },
        PartB: { a: 1, b: 2 },
        PartC: { a: 1, b: 2 },
      },
    });
  });
});
