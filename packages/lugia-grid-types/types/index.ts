export type GridType = 'row' | 'col';

export type NumOrStr = number | string;

export type Padding = {
  left?: NumOrStr;
  top?: NumOrStr;
  right?: NumOrStr;
  bottom?: NumOrStr;
};

export type GridFixedType =
  | 'leftTop'
  | 'centerTop'
  | 'rightTop'
  | 'leftCenter'
  | 'center'
  | 'centerCenter'
  | 'rightCenter'
  | 'leftBottom'
  | 'centerBottom'
  | 'rightBottom';

export type GridInfo = {
  id: string;
  size: number;
  text?: string;
  type?: GridType;
  reactive?: boolean;
  autoHeight?: boolean;
  minWidth?: number;
  minHeight?: NumOrStr;
  padding?: Padding;
  fixedType?: GridFixedType;
  overflowX?: string;
  overflowY?: string;
  fatherId?: string;
  fatherSize?: number;
  fatherAutoHeight?: boolean;
  nextSiblingId?: string;
  nextSiblingReactive?: boolean;
  nextSiblingSize?: number;
  background?: string;
  opacity?: number;
  contentWidth?: NumOrStr;
  contentHeight?: NumOrStr;
  children?: GridInfo[];
};
