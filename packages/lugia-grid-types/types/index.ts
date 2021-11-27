export type GridType = 'row' | 'col';

export type Padding = {
  left?: number | string;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
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
  minHeight?: number | string;
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
  children?: GridInfo[];
};
