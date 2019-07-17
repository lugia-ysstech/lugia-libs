/**
 *
 * 逐层取出对应的配置
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import ThemeHoc, { addMouseEvent } from '@lugia/theme-hoc';
import Two from '../twolevelthoc';
import { BlueButton } from '../base/button';
import Single from '../single/index';

const ThreeC = ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      console.info(this.props.getPartOfThemeConfig('C1'));
      return (
        <div {...addMouseEvent(this)} style={{ border: '1px solid' }}>
          three
          <Two {...this.props.getPartOfThemeHocProps('C1')} />
          <Two {...this.props.getPartOfThemeHocProps('C2')} />
        </div>
      );
    }
  },
  'Four-ThreeB',
  { hover: true, active: true },
);
const ThreeB = ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      return (
        <div {...addMouseEvent(this)} style={{ border: '1px solid' }}>
          three
          <ThreeC {...this.props.getPartOfThemeHocProps('C')} />
        </div>
      );
    }
  },
  'Four-ThreeB',
  { hover: true, active: true },
);

const ThreeA = ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      return (
        <div {...addMouseEvent(this)} style={{ border: '1px solid' }}>
          TwoTwoTwo
          <ThreeB {...this.props.getPartOfThemeHocProps('B')} />
        </div>
      );
    }
  },
  'TwoTwoTwo',
  { hover: true, active: true },
);

export default ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      return (
        <div {...addMouseEvent(this)} style={{ border: '1px solid' }}>
          <ThreeA {...this.props.getPartOfThemeHocProps('A')} />
        </div>
      );
    }
  },
  'Four',
  { hover: true, active: true },
);
