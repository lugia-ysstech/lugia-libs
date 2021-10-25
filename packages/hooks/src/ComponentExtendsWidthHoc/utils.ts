/**
 * @Author:cuixiawang
 * @Date:2021/10/22
 */

export const getParentWidth = (boxNode: Element | null): number => {
  if (boxNode) {
    const { parentElement } = boxNode;
    if (parentElement) {
      const { clientWidth } = parentElement;
      if (!clientWidth) {
        return getParentWidth(parentElement);
      }
      return clientWidth;
    }
  }
  return 0;
};
