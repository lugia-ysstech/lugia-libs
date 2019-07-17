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
  it('fixPathByDispatchPath', () => {
    const two = {
      partName: 'FTwo',
      path: {
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
      },
      dispatchPaths: ['Two.TwoTwo.TwoTwoTwo', 'Two'],
    };
    const handle = new ThemeDesignHandle('111');
    expect(
      handle.fixPathByDispatchPath(
        'Two.TwoTwo.TwoTwoTwo.ButtonA',
        two.dispatchPaths,
      ),
    ).toEqual('ButtonA');
    expect(
      handle.fixPathByDispatchPath('Two.ButtonA', two.dispatchPaths),
    ).toEqual('ButtonA');

    expect(
      handle.fixPathByDispatchPath('Two.TwoTwo.TwoTwoTwo', two.dispatchPaths),
    ).toEqual('');

    expect(handle.fixPathByDispatchPath('a.b.c', two.dispatchPaths)).toEqual(
      'a.b.c',
    );
  });
  it('packNotInPartObject for css hoc', () => {
    const handle = new ThemeDesignHandle('111');
  });

  it('packNotInPartObject for hoc ab abc', () => {
    const handle = new ThemeDesignHandle('111');
  });
  it('packNotInPartObject for hoc ab abc abd', () => {
    const handle = new ThemeDesignHandle('111');
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
});
