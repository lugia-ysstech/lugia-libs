/**
 * 组件样式处理增强
 * @flow
 */
import { ProviderComponent, ThemeHocOption } from './type';

import React, {
  Dispatch,
  ForwardRefExoticComponent,
  MutableRefObject,
  Ref,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  CSSComponentContainerDisplayName,
  hasThemeStateEvent,
  injectThemeStateEvent,
  packDisplayName,
  ThemeContext,
  ThemeHandle,
} from '@lugia/theme-core';

export { addFocusBlurEvent, addMouseEvent } from '@lugia/theme-core';

type ThemeHocProps = {
  lugiaHidden?: boolean;
  widgetId?: string;
  viewClass?: string;
  theme?: any;
};

type ThemeHocHandle = {
  themeConfig: any;
  themeState: [object, Dispatch<SetStateAction<object>>];
  handle: ThemeHandle;
  oldInfo: any;
  svTarget: Ref<any>;
};

function useInitHandle(
  props: ThemeHocProps,
  widgetName: string,
  opt: ThemeHocOption,
): ThemeHocHandle {
  const themeConfig: any = useContext(ThemeContext);
  const [themeState, setThemeState] = useState({});
  const svTarget = useRef({});

  const handle: MutableRefObject<ThemeHandle | null> = useRef(null);
  const oldInfo: any = useRef({});

  if (!handle.current) {
    const initHandleObject: ThemeHandle = new ThemeHandle(
      props,
      themeConfig,
      widgetName,
      themeState,
      svTarget,
    );

    if (hasThemeStateEvent(opt)) {
      initHandleObject.hover = false;
      initHandleObject.active = false;
      initHandleObject.focus = false;
    }
    handle.current = initHandleObject;
    const { viewClass, theme } = props;
    const { config, svThemeConfigTree } = themeConfig;
    oldInfo.current = {
      viewClass,
      theme,
      config,
      svThemeConfigTree,
    };
  }
  handle.current.setProps(props);
  handle.current.setContext(themeConfig);

  return {
    oldInfo: oldInfo.current,
    themeConfig,
    themeState: [themeState, setThemeState],
    handle: handle.current,
    svTarget,
  };
}
export function notEqualDeep(objA: any, objB: any): boolean {
  if (!objA || !objB || typeof objA !== 'object' || typeof objB !== 'object') {
    return objA != null && objB != null && objA !== objB;
  }
  return JSON.stringify(objA) !== JSON.stringify(objB);
}

const ThemeProvider = (
  Target: ProviderComponent,
  widgetName: string,
  opt: ThemeHocOption = { hover: false, active: false, focus: false },
): ForwardRefExoticComponent<ThemeHocProps> => {
  if (Target.displayName === CSSComponentContainerDisplayName) {
    console.warn('CSSComponent不推荐直接包括ThemeHoc');
  }

  const ThemeWrapWidgetForward = (
    props: ThemeHocProps,
    ref:
      | ((instance: ThemeHandle | null) => void)
      | MutableRefObject<ThemeHandle | null>
      | null,
  ) => {
    const {
      handle,
      svTarget,
      themeState,
      themeConfig,
      oldInfo,
    } = useInitHandle(props, widgetName, opt);
    if (ref) {
      if (typeof ref === 'object') {
        ref.current = handle;
      }
      if (typeof ref === 'function') {
        ref(handle);
      }
    }
    useEffect(() => {
      const mouseupHandler = () => {
        if (handle.active) {
          handle.toggleActiveState(false);
        }
      };

      document.addEventListener('mouseup', mouseupHandler);
      return () => {
        document.removeEventListener('mouseup', mouseupHandler);
      };
    });
    if (oldInfo) {
      const { viewClass, theme, config, svThemeConfigTree } = oldInfo;
      const { viewClass: newViewClass, theme: newTheme } = props;
      const { config: oldConfig, svThemeConfigTree: oldTree } = themeConfig;
      if (handle) {
        if (
          !handle.cacheTheme ||
          viewClass !== newViewClass ||
          theme !== newTheme ||
          config !== oldConfig ||
          svThemeConfigTree !== oldTree ||
          notEqualDeep(theme, newTheme) ||
          notEqualDeep(config, oldConfig) ||
          notEqualDeep(svThemeConfigTree, oldTree)
        ) {
          handle.updateTheme();
        }
      }
    }

    if ('themeState' in props) {
      const [, setThemeState] = themeState;
      const { themeState: propsThemeState = {} } = props;
      setThemeState(propsThemeState);
    }
    const { lugiaHidden = false } = props;
    const InjectProps = handle.getPartOfThemeConfig('InjectProps', false);
    return lugiaHidden ? null : (
      <Target
        dispatchEvent={handle.dispatchEvent}
        createEventChannel={handle.createEventChannel}
        {...InjectProps}
        {...props}
        {...injectThemeStateEvent(opt, handle)}
        themeProps={handle.getThemeProps()}
        getInternalThemeProps={handle.getInternalThemeProps}
        getPartOfThemeHocProps={handle.getPartOfThemeHocProps}
        getPartOfThemeConfig={(partName: string) => {
          return handle.getPartOfThemeConfig(partName, true);
        }}
        getPartOfThemeProps={handle.getPartOfThemeProps}
        getTheme={handle.getTheme}
        getWidgetThemeName={() => widgetName}
        getThemeByDisplayName={handle.getThemeByDisplayName}
        ref={svTarget}
      />
    );
  };
  const ThemeWrapWidget: ForwardRefExoticComponent<
    ThemeHocProps
  > = React.forwardRef(ThemeWrapWidgetForward);
  // @ts-ignore
  ThemeWrapWidget.__OrginalWidget__ = Target;
  ThemeWrapWidget.displayName = packDisplayName(widgetName);
  return ThemeWrapWidget;
};
export default ThemeProvider;
