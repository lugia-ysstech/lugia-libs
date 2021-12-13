/**
 * @Author:cuixiawang
 * @Date:2021/10/22
 */

export const getParentWidth = (boxNode: Element | null): number => {
  if (boxNode) {
    const { parentElement } = boxNode;
    if (parentElement) {
      const { clientWidth, style } = parentElement;
      const { paddingLeft, paddingRight } = style || {};

      const chosePaddingLeft = paddingLeft || '0';
      const chosePaddingRight = paddingRight || '0';

      if (!clientWidth) {
        return getParentWidth(parentElement);
      }
      return (
        clientWidth - parseInt(chosePaddingLeft) - parseInt(chosePaddingRight)
      );
    }
  }
  return 0;
};
