/**
 * @Author:cuixiawang
 * @Date:2021/10/22
 */
import React, { useEffect, useRef, useState } from 'react';
import { Container } from './styled';
import { getParentWidth } from './utils';
import ResizeObserver from 'resize-observer-polyfill';
import shortid from 'shortid';
export type HocPropsType = {
  getPartOfThemeProps: (name: string, option?: { [key: string]: any }) => {};
  resizeObserverId?: string;
  needComputeSize?: boolean;
  observerFailureWidth?: number;
};

export default <PropsType extends HocPropsType>(
  Element: (props: PropsType) => React.FunctionComponentElement<PropsType>,
) => {
  return (props: PropsType) => {
    const {
      getPartOfThemeProps,
      resizeObserverId = '',
      needComputeSize = true,
      observerFailureWidth,
    } = props;
    const [parentNodeWidth, setBoxWidth] = useState<number>(0);

    const containerTheme = getPartOfThemeProps('Container', {
      props: { parentWidth: parentNodeWidth },
    });

    if (!needComputeSize) {
      return <Element {...props} />;
    }
    const containerIdRef = useRef('');

    if (!containerIdRef.current) {
      containerIdRef.current = `__tableExtendsWidthHoc_${shortid.generate()}`;
    }
    const { current: containerId } = containerIdRef;

    const parentWidthRef = useRef(0);

    const setStateBoxWidth = (width: number) => {
      if (!parentWidthRef) {
        return;
      }
      parentWidthRef.current = width;
      setBoxWidth(width);
    };

    const updateParentNodeWidth = () => {
      const boxNode: Element | null = document.getElementById(containerId);
      const parentWidth = getParentWidth(boxNode);
      setStateBoxWidth(parentWidth);
    };

    const getResizeObserverNode = () => {
      return document.getElementById(resizeObserverId);
    };

    const updateObserverNodeWidth = (): void => {
      const resizeObserverNode = getResizeObserverNode();
      if (!resizeObserverNode) {
        return;
      }
      const { clientWidth } = resizeObserverNode;
      preObserverNodeWidthRef.current = clientWidth;
    };

    const nodeWidthRuleRef = useRef(1);

    const initRule = (observerNodeWidth?: number) => {
      if (!nodeWidthRuleRef) {
        return;
      }
      const bodyWidth = getBodyWidth();
      const { current: currentWidth } = parentWidthRef;
      const observerWidth = observerNodeWidth || 0;
      nodeWidthRuleRef.current = (currentWidth + observerWidth) / bodyWidth;
    };

    useEffect(() => {
      updateParentNodeWidth();
      const resizeObserverNode = getResizeObserverNode();

      if (!resizeObserverNode) {
        initRule();
      } else {
        updateObserverNodeWidth();
        const { current: observerNodeWidth } = preObserverNodeWidthRef;
        initRule(observerNodeWidth);
      }
    }, []);

    const getBodyWidth = () => {
      const { clientWidth } = document.documentElement;

      if (observerFailureWidth) {
        return clientWidth > observerFailureWidth
          ? clientWidth
          : observerFailureWidth;
      }

      return clientWidth;
    };

    const getCurrentNodeWidth = (observerNodeWidth?: number) => {
      const { current: totalSizeRule } = nodeWidthRuleRef;
      const bodyWidth = getBodyWidth();
      const observerWidth = observerNodeWidth || 0;
      const currentRule = totalSizeRule - observerWidth / bodyWidth;
      return bodyWidth * currentRule;
    };

    const onWindowResize = () => {
      updateParentNodeWidth();
      initRule(preObserverNodeWidthRef.current);
      setStateBoxWidth(getCurrentNodeWidth(preObserverNodeWidthRef.current));
    };

    useEffect(() => {
      const listenerName = 'resize';
      window.addEventListener(listenerName, onWindowResize);

      return () => {
        window.removeEventListener(listenerName, onWindowResize);
      };
    }, []);

    const preObserverNodeWidthRef = useRef(0);

    useEffect(() => {
      const resizeObserverNode = getResizeObserverNode();
      if (!resizeObserverNode) {
        return;
      }

      const resizeObserver = new ResizeObserver(resizeParent => {
        const { contentRect } = resizeParent[0];
        const { width } = contentRect;
        if (!parentWidthRef || !preObserverNodeWidthRef) {
          return;
        }

        const { current: currentParentWidth } = parentWidthRef;
        const { current: preObserverNodeWidth } = preObserverNodeWidthRef;

        if (
          !currentParentWidth ||
          typeof preObserverNodeWidth === 'undefined'
        ) {
          preObserverNodeWidthRef.current = width;
          return;
        }

        preObserverNodeWidthRef.current = width;
        setStateBoxWidth(getCurrentNodeWidth(width));
      });

      resizeObserver.observe(resizeObserverNode);
      return () => {
        resizeObserver.unobserve(resizeObserverNode);
      };
    }, []);

    return parentNodeWidth > 0 ? (
      <Container id={containerId} themeProps={containerTheme}>
        <Element {...props} />
      </Container>
    ) : (
      <div id={containerId} />
    );
  };
};
