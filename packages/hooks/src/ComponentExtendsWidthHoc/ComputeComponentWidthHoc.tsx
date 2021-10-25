/**
 * @Author:cuixiawang
 * @Date:2021/10/22
 */
import React, { useEffect, useRef, useState } from 'react';
import { Container } from './styled';
import { getParentWidth } from './utils';
import ResizeObserver from 'resize-observer-polyfill';
export type HocPropsType = {
  getPartOfThemeProps: (name: string, option?: { [key: string]: any }) => {};
  resizeObserverId?: string;
  needComputeSize?: boolean;
};

export default <PropsType extends HocPropsType>(
  Element: (props: PropsType) => React.FunctionComponentElement<PropsType>,
) => {
  return (props: PropsType) => {
    const {
      getPartOfThemeProps,
      resizeObserverId = '',
      needComputeSize = true,
    } = props;
    const [parentNodeWidth, setBoxWidth] = useState<number>(0);

    const ContainerTheme = getPartOfThemeProps('Container', {
      props: { parentWidth: parentNodeWidth },
    });

    if (!needComputeSize) {
      return <Element {...props} />;
    }

    const parentWidthRef = useRef(0);

    const setStateBoxWidth = (width: number) => {
      parentWidthRef.current = width;
      setBoxWidth(width);
    };

    const updateParentNodeWidth = () => {
      const boxNode: Element | null = document.getElementById(
        '__tableExtendsWidthHoc',
      );
      const parentWidth = getParentWidth(boxNode);
      setStateBoxWidth(parentWidth);
    };

    const getResizeObserverNode = () => {
      return document.getElementById(resizeObserverId);
    };

    const updateObserverNodeWidth = () => {
      const resizeObserverNode = getResizeObserverNode();
      if (!resizeObserverNode) {
        return resizeObserverNode;
      }
      const { clientWidth } = resizeObserverNode;
      preObserverNodeRef.current = clientWidth;

      return resizeObserverNode;
    };

    const sizeRuleRef = useRef(1);

    const initRule = (observerNodeWidth?: number) => {
      const bodyWidth = getBodyWidth();
      const { current: currentWidth } = parentWidthRef;
      const observerWidth = observerNodeWidth || 0;
      sizeRuleRef.current = (currentWidth + observerWidth) / bodyWidth;
    };

    useEffect(() => {
      updateParentNodeWidth();
      const resizeObserverNode = getResizeObserverNode();

      if (!resizeObserverNode) {
        initRule();
      } else {
        updateObserverNodeWidth();
        const { current: observerNodeWidth } = preObserverNodeRef;
        initRule(observerNodeWidth);
      }
    }, []);

    const getBodyWidth = () => {
      const { clientWidth } = document.documentElement;
      return clientWidth;
    };

    const getCurrentNodeWidth = (observerNodeWidth?: number) => {
      const { current: totalSizeRule } = sizeRuleRef;
      const bodyWidth = getBodyWidth();
      const observerWidth = observerNodeWidth || 0;
      const currentRule = totalSizeRule - observerWidth / bodyWidth;
      return bodyWidth * currentRule;
    };

    const windowResize = () => {
      setStateBoxWidth(getCurrentNodeWidth());
    };

    useEffect(() => {
      window.addEventListener('resize', windowResize);

      return () => {
        window.removeEventListener('resize', windowResize);
      };
    }, []);

    const preObserverNodeRef = useRef(0);

    useEffect(() => {
      const resizeObserverNode = getResizeObserverNode();
      if (!resizeObserverNode) {
        return;
      }

      const ro = new ResizeObserver((resizeParent, c) => {
        const { contentRect } = resizeParent[0];
        const { width } = contentRect;
        const { current: currentParentWidth } = parentWidthRef;
        const { current: preObserverNodeWidth } = preObserverNodeRef;

        if (!currentParentWidth || !preObserverNodeWidth) {
          preObserverNodeRef.current = width;
          return;
        }

        preObserverNodeRef.current = width;
        setStateBoxWidth(getCurrentNodeWidth(width));
      });

      ro.observe(resizeObserverNode);
      return () => {
        ro.unobserve(resizeObserverNode);
      };
    }, []);

    return parentNodeWidth > 0 ? (
      <Container id="__tableExtendsWidthHoc" themeProps={ContainerTheme}>
        <Element {...props} />
      </Container>
    ) : (
      <div id="__tableExtendsWidthHoc" />
    );
  };
};
