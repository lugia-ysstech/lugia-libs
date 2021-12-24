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
  resizeObserverIds?: string[];
  needComputeSize?: boolean;
  observerFailureWidth?: number;
};

type ObserverNodeType = { id: string; dom: HTMLElement };
export default <PropsType extends HocPropsType>(
  Element: (props: PropsType) => React.FunctionComponentElement<PropsType>,
) => {
  return (props: PropsType) => {
    const {
      getPartOfThemeProps,
      resizeObserverId = '',
      resizeObserverIds: ids,
      needComputeSize = true,
      observerFailureWidth,
    } = props;
    const [parentNodeWidth, setBoxWidth] = useState<number>(0);

    const containerTheme = getPartOfThemeProps('Container', {
      props: { parentWidth: parentNodeWidth },
    });
    const resizeObserverIds = ids ? ids : [resizeObserverId];

    if (!needComputeSize) {
      return <Element {...props} />;
    }
    const containerIdRef = useRef('');

    const observerNodesWidthRef = useRef<{ [key: string]: number }>({});
    const observerNodesTotalWidthRef = useRef(0);

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

    const getResizeObserverNodes = (): ObserverNodeType[] => {
      const observerNodes: ObserverNodeType[] = [];
      resizeObserverIds.forEach((id: string) => {
        if (id) {
          const dom = document.getElementById(id);
          dom && observerNodes.push({ id, dom });
        }
      });
      return observerNodes;
    };

    const initUpdateObserverNodeWidth = (): void => {
      const observerNodes = getResizeObserverNodes();
      if (!observerNodes) {
        return;
      }
      observerNodes.forEach(({ dom, id }) => {
        const { clientWidth } = dom;
        if (clientWidth && observerNodesWidthRef.current) {
          observerNodesWidthRef.current[id] = clientWidth;
        }
      });
    };

    const updateObserverNodesTotalWidth = () => {
      const { current: observerNodesWidthInfo } = observerNodesWidthRef;
      let observerNodesTotalWidth = 0;

      Object.values(observerNodesWidthInfo).forEach(width => {
        observerNodesTotalWidth += width || 0;
      });
      observerNodesTotalWidthRef.current = observerNodesTotalWidth;
    };

    const nodeWidthRuleRef = useRef(1);

    const initRule = (observerNodesTotalWidth?: number) => {
      if (!nodeWidthRuleRef) {
        return;
      }
      const bodyWidth = getBodyWidth();
      const { current: currentWidth } = parentWidthRef;
      const observerWidth = observerNodesTotalWidth || 0;
      nodeWidthRuleRef.current = (currentWidth + observerWidth) / bodyWidth;
    };

    useEffect(() => {
      updateParentNodeWidth();

      initUpdateObserverNodeWidth();
      updateObserverNodesTotalWidth();
      const { current: observerNodesTotalWidth } = observerNodesTotalWidthRef;
      initRule(observerNodesTotalWidth);
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

    const getCurrentNodeWidth = (observerNodesTotalWidth?: number) => {
      const { current: totalSizeRule } = nodeWidthRuleRef;
      const bodyWidth = getBodyWidth();
      const observerWidth = observerNodesTotalWidth || 0;
      const currentRule = totalSizeRule - observerWidth / bodyWidth;
      return bodyWidth * currentRule;
    };

    const onWindowResize = () => {
      updateParentNodeWidth();
      const { current: observerNodesTotalWidth } = observerNodesTotalWidthRef;
      initRule(observerNodesTotalWidth);
      setStateBoxWidth(getCurrentNodeWidth(observerNodesTotalWidth));
    };

    useEffect(() => {
      const listenerName = 'resize';
      window.addEventListener(listenerName, onWindowResize);

      return () => {
        window.removeEventListener(listenerName, onWindowResize);
      };
    }, []);

    useEffect(() => {
      const observerNodes = getResizeObserverNodes();

      const resizeObserver = new ResizeObserver(resizeParent => {
        const { contentRect, target } = resizeParent[0];
        const { width } = contentRect;
        const { id: targetId } = target;
        if (!targetId || !parentWidthRef) {
          return;
        }

        observerNodesWidthRef.current[targetId] = width;
        updateObserverNodesTotalWidth();
        const { current: observerNodesTotalWidth } = observerNodesTotalWidthRef;
        setStateBoxWidth(getCurrentNodeWidth(observerNodesTotalWidth));
      });
      observerNodes.forEach(({ dom: observerNode }) => {
        observerNode && resizeObserver.observe(observerNode);
      });
      return () => {
        resizeObserver.disconnect();
      };
    }, [getResizeObserverNodes()]);

    return parentNodeWidth > 0 ? (
      <Container id={containerId} themeProps={containerTheme}>
        <Element {...props} />
      </Container>
    ) : (
      <div id={containerId} />
    );
  };
};
