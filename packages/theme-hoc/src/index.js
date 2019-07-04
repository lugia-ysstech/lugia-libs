/**
 * 组件样式处理增强
 * @flow
 */
import type { ProviderComponent, ThemeHocOption } from '@lugia/theme-hoc';

import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  packDisplayName,
  ThemeContext,
  ThemeDesignHandle,
  ThemeHandle,
  CSSComponentContainerDisplayName,
  injectThemeStateEvent,
} from '@lugia/theme-core';

export { addFocusBlurEvent, addMouseEvent } from '@lugia/theme-core';
let cnt = 0;

function uuid() {
  return `hoc_${cnt++}`;
}

function useInitHandle(props: Object, widgetName: string, opt: ThemeHocOption) {
  const themeConfig = useContext(ThemeContext);
  const [id] = useState(uuid());
  const [version, setVersion] = useState(0);
  const [themeState, setThemeState] = useState({});
  const svTarget = useRef({});

  const initHandleObject: Object = new ThemeHandle(
    props,
    themeConfig,
    widgetName,
    themeState,
    svTarget,
  );
  const { hover = false, active = false, focus = false } = opt;
  const needProcessThemeState =
    hover === true || active === true || focus === true;
  if (needProcessThemeState) {
    if (hover) {
      initHandleObject.hover = false;
    }
    if (active) {
      initHandleObject.active = false;
    }
    if (focus) {
      initHandleObject.focus = false;
    }
  }
  const { innerRef } = props;

  let handle = useRef({});
  handle.current = initHandleObject;
  if (innerRef) {
    innerRef.current = handle.current;
  }

  let designHandle = useRef({});
  const { innerRefForDesign } = props;
  if (innerRefForDesign) {
    designHandle.current = new ThemeDesignHandle(id);
    innerRefForDesign.current = designHandle.current;
  }
  return {
    updateVersion() {
      setVersion(version);
    },
    version,
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
  const { hover = false, active = false, focus = false } = opt;

  const ThemeWrapWidget = (props: Object) => {
    const {
      handle,
      svTarget,
      updateVersion,
      themeState,
      version,
      themeConfig,
    } = useInitHandle(props, widgetName, opt);
    const { current: oldThemeConfig } = useRef({});
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
    if (
      oldThemeConfig.config !== themeConfig.config ||
      oldThemeConfig.svThemeConfigTree !== themeConfig.svThemeConfigTree
    ) {
      oldThemeConfig.config = themeConfig.config;
      oldThemeConfig.svThemeConfigTree = themeConfig.svThemeConfigTree;
      updateVersion();
    }

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
        getPartOfThemeConfig={handle.getPartOfThemeConfig}
        getPartOfThemeProps={handle.getPartOfThemeProps}
        createThemeHocProps={handle.createThemeHocProps}
        getTheme={handle.getTheme}
        getWidgetThemeName={() => widgetName}
        getThemeByDisplayName={handle.getThemeByDisplayName}
        svThemVersion={version}
        ref={svTarget}
      />
    );
  };
  ThemeWrapWidget.__OrginalWidget__ = Target;
  ThemeWrapWidget.displayName = packDisplayName(widgetName);
  return ThemeWrapWidget;
};
export default ThemeProvider;
