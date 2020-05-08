/**
 *
 * create by ligx
 *
 * @flow
 */
import { color } from '../src';
import { colorHex, colorRgb, hsb2rgb, rgb2hsb } from '../src/utilsColor';

const { getColor } = color;
describe('utilsColor', () => {
  beforeEach(() => {});

  it('主色', () => {
    expect(getColor('#684fff').color).toBe('#684fff');
    expect(getColor('#56c22d').color).toBe('#56c22d');
    expect(getColor('#f8ac30').color).toBe('#f8ac30');
    expect(getColor('#f22735').color).toBe('#f22735');
  });
  it('S值下调20%', () => {
    expect(getColor('#684fff', 20).color).toBe('#9482ff');
    expect(getColor('#56c22d', 20).color).toBe('#72c254');
    expect(getColor('#f8ac30', 20).color).toBe('#f8bf62');
    expect(getColor('#f22735', 20).color).toBe('#f25762');
  });
  it('B值下调20%', () => {
    expect(getColor('#684fff', 0, 20).color).toBe('#533fcc');
    expect(getColor('#56c22d', 0, 20).color).toBe('#3f8f21');
    expect(getColor('#f8ac30', 0, 20).color).toBe('#c58926');
    expect(getColor('#f22735', 0, 20).color).toBe('#bf1f2a');
  });
  it('S值下调45%', () => {
    expect(getColor('#684fff', 45).color).toBe('#cac2ff');
    expect(getColor('#56c22d', 45).color).toBe('#95c284');
    expect(getColor('#f8ac30', 45).color).toBe('#f8d6a0');
    expect(getColor('#f22735', 45).color).toBe('#f2949a');
  });
  it('幽灵：正常色透明5%', () => {
    expect(getColor('#684fff', 0, 0, 5).rgba).toBe('rgba(104,79,255,0.05)');
    expect(getColor('#56c22d', 0, 0, 5).rgba).toBe('rgba(86,194,45,0.05)');
    expect(getColor('#f8ac30', 0, 0, 5).rgba).toBe('rgba(248,172,48,0.05)');
    expect(getColor('#f22735', 0, 0, 5).rgba).toBe('rgba(242,39,53,0.05)');
  });
  it('正常幽灵透明30%（0.05*30）', () => {
    expect(getColor('#684fff', 0, 0, 1.5).rgba).toBe('rgba(104,79,255,0.015)');
    expect(getColor('#56c22d', 0, 0, 1.5).rgba).toBe('rgba(86,194,45,0.015)');
    expect(getColor('#f8ac30', 0, 0, 1.5).rgba).toBe('rgba(248,172,48,0.015)');
    expect(getColor('#f22735', 0, 0, 1.5).rgba).toBe('rgba(242,39,53,0.015)');
  });
  it('无色相色值的rgba', () => {
    expect(getColor('#fff', 0, 0, 50).rgba).toBe('rgba(255,255,255,0.5)');
    expect(getColor('#000', 0, 0, 50).rgba).toBe('rgba(0,0,0,0.5)');
    expect(getColor('#eee', 0, 0, 50).rgba).toBe('rgba(238,238,238,0.5)');
  });
  it('单词颜色对应hex', () => {
    expect(getColor('red').color).toBe('#ff0000');
    expect(getColor('Red').color).toBe('#ff0000');
    expect(getColor('pink').color).toBe('#ffc0cb');
    expect(getColor('PINK').color).toBe('#ffc0cb');
  });
  it('rgb2hsb', () => {
    expect(rgb2hsb(...colorRgb('#fff'))).toEqual([0, 0, 1]);
    expect(rgb2hsb(...colorRgb('#000'))).toEqual([0, 0, 0]);
    expect(rgb2hsb(...colorRgb('#eee'))).toEqual([0, 0, 0.9333333333333333]);
    expect(rgb2hsb(...colorRgb('#ddd'))).toEqual([0, 0, 0.8666666666666667]);
    expect(rgb2hsb(...colorRgb('red'))).toEqual([0, 1, 1]);
    expect(rgb2hsb(...colorRgb('#FF0000'))).toEqual([0, 1, 1]);
  });
  it('hsb2rgb', () => {
    expect(hsb2rgb(349, 0.23, 1)).toEqual({ newR: 255, newG: 196, newB: 207 });
    expect(hsb2rgb(...rgb2hsb(...colorRgb('#fff')))).toEqual({
      newR: 255,
      newG: 255,
      newB: 255,
    });
    expect(hsb2rgb(...rgb2hsb(...colorRgb('#000')))).toEqual({
      newR: 0,
      newG: 0,
      newB: 0,
    });
    expect(hsb2rgb(...rgb2hsb(...colorRgb('#eee')))).toEqual({
      newR: 238,
      newG: 238,
      newB: 238,
    });
  });
  it('colorHex', () => {
    expect(colorHex('#ff0000')).toBe('#ff0000');
    expect(colorHex('#fff')).toBe('#ffffff');
    expect(colorHex('rgb(255,255,255)')).toBe('#ffffff');
    expect(colorHex('5151')).toBe('5151');
  });

  it('colorRgb', () => {
    expect(colorRgb('#ffffff')).toEqual([255, 255, 255]);
    expect(colorRgb('#fff')).toEqual([255, 255, 255]);
    expect(colorRgb('red')).toEqual([255, 0, 0]);
  });
});
