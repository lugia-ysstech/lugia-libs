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
} from '@lugia/theme-core';

let cnt = 0;

function uuid() {
  return `hoc_${cnt++}`;
}

const OptNames = {
  onMouseDown: 'down',
  onMouseUp: 'up',
  onMouseEnter: 'enter',
  onMouseLeave: 'leave',
};

export const addMouseEvent = createaddEventObject(OptNames);
export const addFocusBlurEvent = createaddEventObject({
  onFocus: 'focus',
  onBlur: 'blur',
});

export function createaddEventObject(optionNames: Object) {
  return function(self: Object, opt?: Object = { after: {} }): Object {
    const result = {};

    if (!self) {
      return result;
    }

    const { props } = self;
    if (!props) {
      return result;
    }

    const { after = {} } = opt;

    Object.keys(optionNames).forEach((name: string) => {
      const { [name]: cb } = props;
      const optName = optionNames[name];
      const { [optName]: optCb } = opt;

      if (cb || optCb) {
        const cbs = [];
        if (cb) {
          cbs.push(cb);
        }
        if (optCb) {
          const { [optName]: isAfter } = after;
          if (isAfter) {
            cbs.push(optCb);
          } else {
            cbs.unshift(optCb);
          }
        }
        result[name] = (...rest: any[]) => {
          cbs.forEach(cb => cb(...rest));
        };
      }
    });

    return result;
  };
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

    const themeStateEventConfig = {};
    if (active) {
      themeStateEventConfig.onMouseDown = handle.onMouseDown;
      themeStateEventConfig.onMouseUp = handle.onMouseUp;
    }
    if (hover) {
      themeStateEventConfig.onMouseEnter = handle.onMouseEnter;
      themeStateEventConfig.onMouseLeave = handle.onMouseLeave;
    }
    if (focus) {
      themeStateEventConfig.onFocus = handle.onFocus;
      themeStateEventConfig.onBlur = handle.onBlur;
    }
    return (
      <Target
        dispatchEvent={handle.dispatchEvent}
        createEventChannel={handle.createEventChannel}
        {...props}
        {...themeStateEventConfig}
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
