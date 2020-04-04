export type BorderConfig = {
  color?: string;
  width?: number;
  style?: string;
};
export type BorderInnerType = {
  color?: string;
  width?: number;
  style?: string;
};
export type BorderRadiusType = {
  topLeft?: number;
  topRight?: number;
  bottomLeft?: number;
  bottomRight?: number;
};

export type BorderType = {
  top?: BorderInnerType;
  right?: BorderInnerType;
  bottom?: BorderInnerType;
  left?: BorderInnerType;
};
export type BorderDirection = 'l' | 'r' | 'b' | 't';
export type BorderRadiusDirection = 'tl' | 'tr' | 'bl' | 'br';
export type GetBorderOption = {
  radius?: number | string;
  directions?: BorderDirection[];
};
export type BoxShadowType = {
  x: number;
  y: number;
  color?: string;
  type?: 'outset' | 'inset' | '';
  blur?: number;
  spread?: number;
};
