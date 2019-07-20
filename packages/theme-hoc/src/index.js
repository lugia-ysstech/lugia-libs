/**
 * 组件样式处理增强
 * @flow
 */
import type { ProviderComponent, ThemeHocOption } from '@lugia/theme-hoc';

import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  CSSComponentContainerDisplayName,
  injectThemeStateEvent,
  packDisplayName,
  ThemeContext,
  ThemeDesignHandle,
  ThemeHandle,
  hasThemeStateEvent,
} from '@lugia/theme-core';

export { addFocusBlurEvent, addMouseEvent } from '@lugia/theme-core';
let cnt = 0;

function uuid() {
  return `hoc_${cnt++}`;
}

function useInitHandle(props: Object, widgetName: string, opt: ThemeHocOption) {
  const themeConfig = useContext(ThemeContext);
  const [id] = useState(uuid());
  const [themeState, setThemeState] = useState({});
  const svTarget = useRef({});

  let handle: Object = useRef(null);

  if (!handle.current) {
    const initHandleObject: Object = new ThemeHandle(
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

  let designHandle = useRef(null);
  const { innerRefForDesign } = props;
  if (innerRefForDesign && !designHandle.current) {
    designHandle.current = new ThemeDesignHandle(id);
    innerRefForDesign.current = designHandle.current;
  }
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
  opt?: ThemeHocOption = { hover: false, active: false, focus: false },
): Function => {
  if (Target.displayName === CSSComponentContainerDisplayName) {
    console.warn('CSSComponent不推荐直接包括ThemeHoc');
  }

  const ThemeWrapWidgetForward = (props: Object, ref: Object) => {
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
      const { innerRefForDesign } = props;

      if (innerRefForDesign) {
        const designHandle = innerRefForDesign.current;
        const { widgetId } = props;

        widgetId && designHandle.updateDesignHandle(widgetId, designHandle);
      }

      document.addEventListener('mouseup', mouseupHandler);
      return () => {
        document.removeEventListener('mouseup', mouseupHandler);
        const { innerRefForDesign, widgetId } = props;

        if (innerRefForDesign) {
          const designHandle = innerRefForDesign.current;
          const { widgetId } = props;
          widgetId && designHandle.deleteDesignHandle(widgetId);
        }
      };
    });

    if ('themeState' in props) {
      const [, setThemeState] = themeState;
      const { themeState: propsThemeState = {} } = props;
      setThemeState(propsThemeState);
    }

    return (
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
  const ThemeWrapWidget: Object = React.forwardRef(ThemeWrapWidgetForward);
  ThemeWrapWidget.__OrginalWidget__ = Target;
  ThemeWrapWidget.displayName = packDisplayName(widgetName);
  return ThemeWrapWidget;
};
export default ThemeProvider;
