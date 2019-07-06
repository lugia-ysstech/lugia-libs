/**
 *
 * create by wcx
 *
 * @flow
 */
import 'jest-styled-components';
import ThemeHandle, {
  packDisplayName,
  unPackDisplayName,
} from '../src/ThemeHandle';
import { getConfig } from '../src';
import { getAttributeFromObject } from '@lugia/object-utils';
import { deepMerge } from '@lugia/object-utils/src';

const {
  mockObject,
  VerifyOrder,
  VerifyOrderConfig,
} = require('@lugia/jverify');
describe('ThemeHandle.test.js', () => {
  it('packDisplayName', () => {
    const widgetName = 'lgx';
    expect(packDisplayName(widgetName)).toBe('lugia_t_hoc_lgx');
    expect(unPackDisplayName(packDisplayName(widgetName))).toBe(widgetName);
  });

  it('getThemeTarget is undefined', () => {
    const svtarget = {};
    const handle = new ThemeHandle({}, {}, 'Widget', {}, svtarget);
    expect(handle.getThemeTarget()).toBeUndefined();
  });
  it('getThemeTarget', () => {
    const button = {
      type: 'button',
    };
    const svtarget = {
      current: button,
    };
    const handle = new ThemeHandle({}, {}, 'Widget', {}, svtarget);
    expect(handle.getThemeTarget()).toBe(button);
  });
  it('getThemeTarget three level', () => {
    const button = {
      type: 'button',
    };
    const svtarget = {
      svtarget: {
        current: {
          svtarget: {
            current: {
              current: button,
            },
          },
        },
      },
    };
    const handle = new ThemeHandle({}, {}, 'Widget', {}, svtarget);
    expect(handle.getThemeTarget()).toBe(button);
  });
  it('getDisplayName', () => {
    const widgetName = 'Widget';
    const handle = new ThemeHandle({}, {}, widgetName, {}, {});
    expect(handle.getDisplayName()).toBe(packDisplayName(widgetName));
  });
  it('getInternalThemeProps', () => {
    const widgetName = 'Widget';
    const handle = new ThemeHandle({}, {}, widgetName, {}, {});
    expect(handle.getInternalThemeProps()).toEqual({
      onLugia: handle.on,
    });
  });
  it('getConfig', () => {
    const widgetName = 'Widget';
    const handle = new ThemeHandle({}, {}, widgetName, {}, {});
    expect(handle.getConfig).toBe(getConfig);
  });
  it('getAttributeFromObject', () => {
    const widgetName = 'Widget';
    const handle = new ThemeHandle({}, {}, widgetName, {}, {});
    expect(handle.getAttributeFromObject).toBe(getAttributeFromObject);
  });
  it('getThemeByDisplayName', () => {
    const widgetName = 'Widget';
    const target = new ThemeHandle({}, {}, widgetName, {}, {});
    const name = 'hello yss';

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );
    const getTheme = mock.mockFunction('getTheme');
    const theme = {
      theme: 1,
    };
    getTheme.returned(theme);

    const getAttributeFromObject = mock.mockFunction('getAttributeFromObject');
    const svThree = {
      a: 1,
    };
    getAttributeFromObject.returned(svThree);
    getAttributeFromObject.returned(name);

    const displayName = 'displayName11';
    expect(target.getThemeByDisplayName(displayName)).toBe(name);

    order.verify(param => {
      const { handle } = param;
      handle.getTheme();
      handle.getAttributeFromObject(theme, 'svThemeConfigTree', {});
      handle.getAttributeFromObject(svThree, displayName, {});
    });
  });

  it('getTheme', () => {
    const widgetName = 'Widget';
    const svThemeConfigTree = {
      a: 1,
      b: 2,
    };
    const config = {
      c: 3,
      d: 4,
    };
    const context = {
      config,
      svThemeConfigTree,
    };
    const propsTheme = {
      f: 5,
      g: 6,
    };
    const viewClass = 'viewClass_a';
    const props = {
      viewClass,
      theme: propsTheme,
    };
    const target = new ThemeHandle(props, context, widgetName, {}, {});
    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const getConfig = mock.mockFunction('getConfig');
    const getConfigResult = {
      [viewClass]: {
        a: 11,
        d: 3,
      },

      [target.widgetName]: {
        a: 1,
        c: 2,
      },
    };
    getConfig.returned(getConfigResult);

    expect(target.getTheme()).toEqual({
      a: 11,
      c: 2,
      d: 3,
      svThemeConfigTree,
    });

    order.verify(param => {
      const { handle } = param;
      handle.getConfig(svThemeConfigTree, config, propsTheme);
    });
  });

  it('getThemeProps', () => {
    const widgetName = 'Widget';

    const themeState = {};
    const propsConfig = {
      propsConfig: 1,
    };
    const props = {
      propsConfig,
    };
    const target = new ThemeHandle(props, {}, widgetName, themeState, {});
    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const getThemeState = mock.mockFunction('getThemeState');
    const themeStateVal = {
      hover: true,
      focus: true,
    };
    getThemeState.returned(themeStateVal);
    const getTheme = mock.mockFunction('getTheme');
    const theme = {
      theme: 1,
    };
    getTheme.returned(theme);

    const getInternalThemeProps = mock.mockFunction('getInternalThemeProps');
    const internalThemeProps = {
      internalThemeProps: 1,
    };
    getInternalThemeProps.returned(internalThemeProps);

    expect(target.getThemeProps()).toEqual({
      themeState: themeStateVal,
      propsConfig,
      themeConfig: theme,
      ...internalThemeProps,
    });
    order.verify(param => {
      const { handle } = param;
      handle.getThemeState();
      handle.getTheme();
      handle.getInternalThemeProps();
    });
  });
  it('getPartOfThemeConfig', () => {
    const widgetName = 'Widget';

    const themeState = {};
    const propsConfig = {
      propsConfig: 1,
    };
    const props = {
      propsConfig,
    };
    const target = new ThemeHandle(props, {}, widgetName, themeState, {});
    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );
    const getTheme = mock.mockFunction('getTheme');
    const lgx = {
      normal: {
        bg: 'red',
      },
      hover: {
        bg: 'blue',
      },
    };
    const theme = {
      lgx,
    };
    getTheme.returned(theme);
    getTheme.returned(undefined);

    expect(target.getPartOfThemeConfig('lgx')).toEqual(lgx);
    expect(lgx.__partName).toBe('lgx');
    expect(target.getPartOfThemeConfig('lgx')).toEqual({});
    order.verify(param => {
      const { handle } = param;
      handle.getTheme();
      handle.getTheme();
    });
  });

  it('getPartOfThemeHocProps', () => {
    const widgetName = 'Widget';

    const themeState = {};
    const propsConfig = {
      propsConfig: 1,
    };
    const props = {
      propsConfig,
    };
    const target = new ThemeHandle(props, {}, widgetName, themeState, {});
    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );
    const getPartOfThemeConfig = mock.mockFunction('getPartOfThemeConfig');
    const targetTheme = { targetTheme: 1 };
    getPartOfThemeConfig.returned(targetTheme);

    const result = { type: 'createThemeHocPropsResult' };
    const createThemeHocProps = mock.mockFunction('createThemeHocProps');
    createThemeHocProps.returned(result);
    const displayName = packDisplayName(widgetName);

    const partName = 'lgx';
    expect(target.getPartOfThemeHocProps(partName)).toEqual(result);
    expect(result.__partName).toBe(partName);

    order.verify(param => {
      const { handle } = param;
      handle.getPartOfThemeConfig(partName);
      handle.createThemeHocProps(displayName + '_' + partName, targetTheme);
    });
  });
  it('createThemeHocProps', () => {
    const widgetName = 'Widget';

    const themeState = {};
    const propsConfig = {
      propsConfig: 1,
    };
    const props = {
      propsConfig,
    };
    const target = new ThemeHandle(props, {}, widgetName, themeState, {});
    const theme = {
      normal: {
        bg: 'red',
      },
      hover: {
        br: 'green',
      },
    };
    expect(target.createThemeHocProps('lgx', theme)).toEqual({
      viewClass: 'lgx',
      theme: {
        lgx: theme,
      },
    });
  });

  it('getPartOfThemeProps', () => {
    const widgetName = 'Widget';

    const propsConfig = {
      propsConfig: 1,
    };
    const props = {
      propsConfig,
    };
    const target = new ThemeHandle(props, {}, widgetName, {}, {});
    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const getThemeState = mock.mockFunction('getThemeState');
    const themeState = { themeState: 1231 };
    getThemeState.returned(themeState);

    const getPartOfThemeConfig = mock.mockFunction('getPartOfThemeConfig');
    const themeConfig = { normal: 'a', hover: 'b' };
    getPartOfThemeConfig.returned(themeConfig);

    const getInternalThemeProps = mock.mockFunction('getInternalThemeProps');
    const intervalProps = { intervalProps: 'a' };
    getInternalThemeProps.returned(intervalProps);

    const selectThemePart = mock.mockFunction('selectThemePart');
    const selectThemePartRes = { selectThemePart: 'a' };
    selectThemePart.mock((config, idx, count) => {
      expect(idx).toBe(5);
      expect(count).toBe(20);
      return selectThemePartRes;
    });

    mock.mockFunction('deepMerge');

    const partName = 'lgx';
    expect(target.getPartOfThemeProps(partName)).toEqual({
      themeConfig,
      themeState,
      propsConfig,
      ...intervalProps,
    });

    order.verify(param => {
      const { handle } = param;
      handle.getPartOfThemeConfig(partName);
      handle.getThemeState();
      handle.getInternalThemeProps();
    });
  });
  it('getPartOfThemeProps has option', () => {
    const widgetName = 'Widget';

    const propsConfig = {
      propsConfig: 1,
    };
    const propsThemeState = {
      propsThemeState: 1,
    };
    const props = {
      propsConfig,
      themeState: propsThemeState,
    };
    const target = new ThemeHandle(props, {}, widgetName, {}, {});
    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const getThemeState = mock.mockFunction('getThemeState');
    const themeState = { themeState: 1231, abc: 5 };
    getThemeState.forever(themeState);

    const getPartOfThemeConfig = mock.mockFunction('getPartOfThemeConfig');
    const themeConfig = { normal: 'a', hover: 'b' };
    getPartOfThemeConfig.forever(themeConfig);

    const getInternalThemeProps = mock.mockFunction('getInternalThemeProps');
    const intervalProps = { intervalProps: 'a' };
    getInternalThemeProps.forever(intervalProps);

    const mergeConfig = {
      merge: '1',
    };
    const selectThemePart = mock.mockFunction('selectThemePart');
    const selectThemePartRes = { selectThemePart: 'a' };
    selectThemePart.mock((config, idx, count) => {
      expect(config).toEqual(deepMerge(themeConfig, mergeConfig));
      expect(idx).toBe(5);
      expect(count).toBe(20);
      return selectThemePartRes;
    });

    mock.mockFunction('deepMerge');

    const partName = 'lgx';

    expect(
      target.getPartOfThemeProps(partName, {
        themeConfig: mergeConfig,
      }),
    ).toEqual({
      themeConfig: deepMerge(themeConfig, mergeConfig),
      themeState,
      propsConfig,
      ...intervalProps,
    });

    expect(
      target.getPartOfThemeProps(partName, {
        themeConfig: mergeConfig,
        props: { propsConfig: 2, a: 3 },
      }),
    ).toEqual({
      themeConfig: deepMerge(themeConfig, mergeConfig),
      themeState,
      propsConfig: { ...propsConfig, a: 3 },
      ...intervalProps,
    });

    expect(
      target.getPartOfThemeProps(partName, {
        themeConfig: mergeConfig,
        props: { propsConfig: 2, a: 3 },
        state: { abc: 1 },
      }),
    ).toEqual({
      themeConfig: deepMerge(themeConfig, mergeConfig),
      themeState: { ...themeState, abc: 1, ...propsThemeState },
      propsConfig: { ...propsConfig, a: 3 },
      ...intervalProps,
    });

    expect(
      target.getPartOfThemeProps(partName, {
        themeConfig: mergeConfig,
        props: { propsConfig: 2, a: 3 },
        state: { abc: 1 },
        selector: { index: 5, count: 20 },
      }),
    ).toEqual({
      themeConfig: selectThemePartRes,
      themeState: { ...themeState, abc: 1, ...propsThemeState },
      propsConfig: { ...propsConfig, a: 3 },
      ...intervalProps,
    });
  });
});
