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
  RefCallback,
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
};

type ThemeHocHandle = {
  themeConfig: object;
  themeState: [object, Dispatch<SetStateAction<object>>];
  handle: ThemeHandle;
  svTarget: Ref<any>;
};

function useInitHandle(
  props: ThemeHocProps,
  widgetName: string,
  opt: ThemeHocOption,
): ThemeHocHandle {
  const themeConfig: object = useContext(ThemeContext);
  const [themeState, setThemeState] = useState({});
  const svTarget = useRef({});

  const handle: MutableRefObject<ThemeHandle> = useRef(null);

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
  }
  handle.current.setProps(props);
  handle.current.setContext(themeConfig);

  return {
    themeConfig,
    themeState: [themeState, setThemeState],
    handle: handle.current,
    svTarget,
  };
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
    ref: MutableRefObject<ThemeHandle> | RefCallback<ThemeHandle>,
  ) => {
    const { handle, svTarget, themeState } = useInitHandle(
      props,
      widgetName,
      opt,
    );
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

    if ('themeState' in props) {
      const [, setThemeState] = themeState;
      const { themeState: propsThemeState = {} } = props;
      setThemeState(propsThemeState);
    }
    const { lugiaHidden = false } = props;

    return lugiaHidden ? null : (
      <Target
        dispatchEvent={handle.dispatchEvent}
        createEventChannel={handle.createEventChannel}
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
