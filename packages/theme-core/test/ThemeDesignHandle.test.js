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
        {
          father: 'A.B.C.C1',
          key: 'A.B.C.C1.PartA',
        },
        {
          father: 'A.B.C.C1.ButtonA',
          key: 'A.B.C.C1.ButtonA.PartA',
        },
        {
          father: 'A.B.C.C1.ButtonA.ButtonAB',
          key: 'A.B.C.C1.ButtonA.ButtonAB.PartA',
        },
        {
          father: 'A.B.C.C1.ButtonA',
          key: 'A.B.C.C1.ButtonA.PartB',
        },
        {
          father: 'A.B.C.C1.ButtonA',
          key: 'A.B.C.C1.ButtonA.PartC',
        },
        {
          father: 'A.B.C.C1.ButtonB',
          key: 'A.B.C.C1.ButtonB.PartA',
        },
        {
          father: 'A.B.C.C1.ButtonB',
          key: 'A.B.C.C1.ButtonB.PartB',
        },
        {
          father: 'A.B.C.C1.ButtonB',
          key: 'A.B.C.C1.ButtonB.PartC',
        },
      ],
      'A.B.C.C2': [
        {
          father: 'A.B.C.C2',
          key: 'A.B.C.C2.PartA',
        },
        {
          father: 'A.B.C.C2.ButtonA',
          key: 'A.B.C.C2.ButtonA.PartA',
        },
        {
          father: 'A.B.C.C2.ButtonA',
          key: 'A.B.C.C2.ButtonA.PartB',
        },
        {
          father: 'A.B.C.C2.ButtonA',
          key: 'A.B.C.C2.ButtonA.PartC',
        },
        {
          father: 'A.B.C.C2.ButtonB',
          key: 'A.B.C.C2.ButtonB.PartA',
        },
        {
          father: 'A.B.C.C2.ButtonB',
          key: 'A.B.C.C2.ButtonB.PartB',
        },
        {
          father: 'A.B.C.C2.ButtonB',
          key: 'A.B.C.C2.ButtonB.PartC',
        },
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
        {
          father: 'a.b',
          key: 'a.b.partA',
        },
        {
          father: 'a.b',
          key: 'a.b.partB',
        },
        {
          father: 'a.b.c',
          key: 'a.b.c.partA',
        },
        {
          father: 'a.b.c',
          key: 'a.b.c.partB',
        },
        {
          father: 'a.b.c',
          key: 'a.b.c.partC',
        },
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
      'a.1.2.3.b': [
        {
          father: 'a.1.2.3.b',
          key: 'a.1.2.3.b.k1',
        },
        {
          father: 'a.1.2.3.b',
          key: 'a.1.2.3.b.k4',
        },
      ],
      'a.3.5.6.f': [
        {
          father: 'a.3.5.6.f',
          key: 'a.3.5.6.f.k3',
        },
        {
          father: 'a.3.5.6.f',
          key: 'a.3.5.6.f.k4',
        },
      ],
      'a.b': [
        {
          father: 'a.b',
          key: 'a.b.k1',
        },
        {
          father: 'a.b',
          key: 'a.b.k2',
        },
      ],
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
      'a.1.2.3.b': [
        {
          father: 'a.1.2.3.b',
          key: 'a.1.2.3.b.k1',
        },
        {
          father: 'a.1.2.3.b',
          key: 'a.1.2.3.b.k4',
        },
      ],
      'a.b': [
        {
          father: 'a.b',
          key: 'a.b.k1',
        },
        {
          father: 'a.b',
          key: 'a.b.k2',
        },
      ],
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

  it('getPathIfInBranchObjectLeft2Right', () => {
    const handle = new ThemeDesignHandle('11');
    expect(handle.getPathIfInBranchObjectLeft2Right({}, ['a', 'b'])).toEqual(
      undefined,
    );
    expect(
      handle.getPathIfInBranchObjectLeft2Right(
        {
          a: true,
          g: true,
        },
        ['a', 'b'],
      ),
    ).toEqual('a');

    expect(
      handle.getPathIfInBranchObjectLeft2Right(
        {
          a: true,
          g: true,
        },
        ['a', 'e', 'f', 'g', 'h'],
      ),
    ).toEqual('a');

    expect(
      handle.getPathIfInBranchObjectLeft2Right(
        {
          'a.e.f': true,
          g: true,
        },
        ['a', 'e', 'f', 'g', 'h'],
      ),
    ).toEqual('a.e.f');
    expect(
      handle.getPathIfInBranchObjectLeft2Right(
        {
          'a.e.f.g.h': true,
          g: true,
        },
        ['a', 'e', 'f', 'g', 'h'],
      ),
    ).toEqual('a.e.f.g.h');
  });

  it('getPathIfInBranchObjectRight2Left', () => {
    const handle = new ThemeDesignHandle('11');
    expect(handle.getPathIfInBranchObjectRight2Left({}, ['a', 'b'])).toEqual(
      undefined,
    );
    expect(
      handle.getPathIfInBranchObjectRight2Left(
        {
          a: true,
          'a.b': true,
          g: true,
        },
        ['a', 'b'],
      ),
    ).toEqual('a.b');
    expect(
      handle.getPathIfInBranchObjectRight2Left(
        {
          a: true,
          g: true,
          'a.b': true,
        },
        ['a', 'b'],
      ),
    ).toEqual('a.b');
  });

  it('getHocTarget', () => {
    const handle = new ThemeDesignHandle('11');
    const path = {
      'Two.TwoTwo.TwoTwoTwo': {},
      'Two.TwoTwo.TwoTwoTwo.PartA': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.TwoTwo.TwoTwoTwo.ButtonA': {},
      'Two.TwoTwo.TwoTwoTwo.ButtonA.PartA': {
        current: { background: { color: 'orange' }, color: 'green' },
        normal: { background: { color: 'orange' }, color: 'green' },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.TwoTwo.TwoTwoTwo.ButtonA.PartB': {
        current: { background: { color: 'black' } },
        normal: { background: { color: 'black' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.TwoTwo.TwoTwoTwo.ButtonA.PartC': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.TwoTwo.TwoTwoTwo.ButtonB': {},
      'Two.TwoTwo.TwoTwoTwo.ButtonB.PartA': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.TwoTwo.TwoTwoTwo.ButtonB.PartB': {
        current: { background: { color: 'black' } },
        normal: { background: { color: 'black' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.TwoTwo.TwoTwoTwo.ButtonB.PartC': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      Two: {},
      'Two.PartA': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.ButtonA': {},
      'Two.ButtonA.PartA': {
        current: { background: { color: 'orange' }, color: 'green' },
        normal: { background: { color: 'orange' }, color: 'green' },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.ButtonA.PartB': {
        current: { background: { color: 'black' } },
        normal: { background: { color: 'black' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.ButtonA.PartC': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.ButtonB': {},
      'Two.ButtonB.PartA': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.ButtonB.PartB': {
        current: { background: { color: 'black' } },
        normal: { background: { color: 'black' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.ButtonB.PartC': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
    };
    expect(handle.getHocTarget(path)).toEqual({
      Two: [
        { key: 'Two.TwoTwo.TwoTwoTwo.PartA', father: 'Two.TwoTwo.TwoTwoTwo' },
        {
          key: 'Two.TwoTwo.TwoTwoTwo.ButtonA.PartA',
          father: 'Two.TwoTwo.TwoTwoTwo.ButtonA',
        },
        {
          key: 'Two.TwoTwo.TwoTwoTwo.ButtonA.PartB',
          father: 'Two.TwoTwo.TwoTwoTwo.ButtonA',
        },
        {
          key: 'Two.TwoTwo.TwoTwoTwo.ButtonA.PartC',
          father: 'Two.TwoTwo.TwoTwoTwo.ButtonA',
        },
        {
          key: 'Two.TwoTwo.TwoTwoTwo.ButtonB.PartA',
          father: 'Two.TwoTwo.TwoTwoTwo.ButtonB',
        },
        {
          key: 'Two.TwoTwo.TwoTwoTwo.ButtonB.PartB',
          father: 'Two.TwoTwo.TwoTwoTwo.ButtonB',
        },
        {
          key: 'Two.TwoTwo.TwoTwoTwo.ButtonB.PartC',
          father: 'Two.TwoTwo.TwoTwoTwo.ButtonB',
        },
        { key: 'Two.PartA', father: 'Two' },
        { key: 'Two.ButtonA.PartA', father: 'Two.ButtonA' },
        { key: 'Two.ButtonA.PartB', father: 'Two.ButtonA' },
        { key: 'Two.ButtonA.PartC', father: 'Two.ButtonA' },
        { key: 'Two.ButtonB.PartA', father: 'Two.ButtonB' },
        { key: 'Two.ButtonB.PartB', father: 'Two.ButtonB' },
        { key: 'Two.ButtonB.PartC', father: 'Two.ButtonB' },
      ],
    });
  });
  it('getHocTarget B', () => {
    const handle = new ThemeDesignHandle('11');
    const path = {
      'BButtonA_0.BBBButtonA.ButtonA.ButtonA': {},
      'BButtonA_0.BBBButtonA.ButtonA.ButtonA.PartA': {
        current: { background: { color: 'black' } },
        normal: { background: { color: 'black' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'BButtonA_0.BBBButtonA.ButtonA.ButtonA.PartB': {
        current: { background: { color: 'black' } },
        normal: { background: { color: 'black' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'BButtonA_0.BBBButtonA.ButtonA.ButtonA.PartC': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
    };
    expect(handle.getHocTarget(path)).toEqual({
      'BButtonA_0.BBBButtonA.ButtonA.ButtonA': [
        {
          father: 'BButtonA_0.BBBButtonA.ButtonA.ButtonA',
          key: 'BButtonA_0.BBBButtonA.ButtonA.ButtonA.PartA',
        },
        {
          father: 'BButtonA_0.BBBButtonA.ButtonA.ButtonA',
          key: 'BButtonA_0.BBBButtonA.ButtonA.ButtonA.PartB',
        },
        {
          father: 'BButtonA_0.BBBButtonA.ButtonA.ButtonA',
          key: 'BButtonA_0.BBBButtonA.ButtonA.ButtonA.PartC',
        },
      ],
    });
  });
  it('pullHocPathData', () => {
    const handle = new ThemeDesignHandle('11');
    const paths = [
      { key: 'Two.TwoTwo.TwoTwoTwo.PartA', father: 'Two.TwoTwo.TwoTwoTwo' },
      {
        key: 'Two.TwoTwo.TwoTwoTwo.ButtonA.PartA',
        father: 'Two.TwoTwo.TwoTwoTwo.ButtonA',
      },
      {
        key: 'Two.TwoTwo.TwoTwoTwo.ButtonA.PartB',
        father: 'Two.TwoTwo.TwoTwoTwo.ButtonA',
      },
      {
        key: 'Two.TwoTwo.TwoTwoTwo.ButtonA.PartC',
        father: 'Two.TwoTwo.TwoTwoTwo.ButtonA',
      },
      {
        key: 'Two.TwoTwo.TwoTwoTwo.ButtonB.PartA',
        father: 'Two.TwoTwo.TwoTwoTwo.ButtonB',
      },
      {
        key: 'Two.TwoTwo.TwoTwoTwo.ButtonB.PartB',
        father: 'Two.TwoTwo.TwoTwoTwo.ButtonB',
      },
      {
        key: 'Two.TwoTwo.TwoTwoTwo.ButtonB.PartC',
        father: 'Two.TwoTwo.TwoTwoTwo.ButtonB',
      },
      { key: 'Two.PartA', father: 'Two' },
      { key: 'Two.ButtonA.PartA', father: 'Two.ButtonA' },
      { key: 'Two.ButtonA.PartB', father: 'Two.ButtonA' },
      { key: 'Two.ButtonA.PartC', father: 'Two.ButtonA' },
      { key: 'Two.ButtonB.PartA', father: 'Two.ButtonB' },
      { key: 'Two.ButtonB.PartB', father: 'Two.ButtonB' },
      { key: 'Two.ButtonB.PartC', father: 'Two.ButtonB' },
    ];

    const target = {
      'Two.TwoTwo.TwoTwoTwo': {},
      'Two.TwoTwo.TwoTwoTwo.PartA': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.TwoTwo.TwoTwoTwo.ButtonA': {},
      'Two.TwoTwo.TwoTwoTwo.ButtonA.PartA': {
        current: { background: { color: 'orange' }, color: 'green' },
        normal: { background: { color: 'orange' }, color: 'green' },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.TwoTwo.TwoTwoTwo.ButtonA.PartB': {
        current: { background: { color: 'black' } },
        normal: { background: { color: 'black' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.TwoTwo.TwoTwoTwo.ButtonA.PartC': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.TwoTwo.TwoTwoTwo.ButtonB': {},
      'Two.TwoTwo.TwoTwoTwo.ButtonB.PartA': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.TwoTwo.TwoTwoTwo.ButtonB.PartB': {
        current: { background: { color: 'black' } },
        normal: { background: { color: 'black' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.TwoTwo.TwoTwoTwo.ButtonB.PartC': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      Two: {},
      'Two.PartA': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.ButtonA': {},
      'Two.ButtonA.PartA': {
        current: { background: { color: 'orange' }, color: 'green' },
        normal: { background: { color: 'orange' }, color: 'green' },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.ButtonA.PartB': {
        current: { background: { color: 'black' } },
        normal: { background: { color: 'black' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.ButtonA.PartC': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.ButtonB': {},
      'Two.ButtonB.PartA': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.ButtonB.PartB': {
        current: { background: { color: 'black' } },
        normal: { background: { color: 'black' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
      'Two.ButtonB.PartC': {
        current: { background: { color: 'orange' } },
        normal: { background: { color: 'orange' } },
        hover: { background: { color: 'blue' } },
        active: { background: { color: 'purple' } },
        disabled: { background: { color: 'black' } },
      },
    };
    expect(handle.pullHocPathData(paths, target)).toEqual({
      PartA: {
        active: {
          background: {
            color: 'purple',
          },
        },
        current: {
          background: {
            color: 'orange',
          },
          color: 'green',
        },
        disabled: {
          background: {
            color: 'black',
          },
        },
        hover: {
          background: {
            color: 'blue',
          },
        },
        normal: {
          background: {
            color: 'orange',
          },
          color: 'green',
        },
      },
      PartB: {
        active: {
          background: {
            color: 'purple',
          },
        },
        current: {
          background: {
            color: 'black',
          },
        },
        disabled: {
          background: {
            color: 'black',
          },
        },
        hover: {
          background: {
            color: 'blue',
          },
        },
        normal: {
          background: {
            color: 'black',
          },
        },
      },
      PartC: {
        active: {
          background: {
            color: 'purple',
          },
        },
        current: {
          background: {
            color: 'orange',
          },
        },
        disabled: {
          background: {
            color: 'black',
          },
        },
        hover: {
          background: {
            color: 'blue',
          },
        },
        normal: {
          background: {
            color: 'orange',
          },
        },
      },
    });
  });
});
