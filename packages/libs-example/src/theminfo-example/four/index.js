/**
 *
 * 单个简单的组件
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import ThemeHoc, { addMouseEvent } from '@lugia/theme-hoc';
import Two from '../twolevelthoc';
import { deepMerge } from '../../../../object-utils/src';

const Three = ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      const TwoC = {
        TwoC: {
          ButtonA: this.props.getPartOfThemeConfig('BButtonA'),
          ButtonB: {
            PartA: this.props.getPartOfThemeConfig('BButtonBPartA'),
            PartB: this.props.getPartOfThemeConfig('BButtonBPartB'),
          },
        },
      };

      console.info(TwoC);
      return (
        <div {...addMouseEvent(this)} style={{ border: '1px solid' }}>
          three
          <Two viewClass={'TwoC'} theme={TwoC} />
        </div>
      );
    }
  },
  'Four-Three',
  { hover: true, active: true },
);

export default ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      const ThreeC = {
        ThreeC: {
          BButtonBPartA: this.props.getPartOfThemeConfig('BButtonBPartA_0'),
          BButtonBPartB: this.props.getPartOfThemeConfig('BButtonBPartB_0'),
        },
      };

      return (
        <div {...addMouseEvent(this)} style={{ border: '1px solid' }}>
          <Three viewClass={'ThreeC'} theme={ThreeC} />
        </div>
      );
    }
  },
  'Four',
  { hover: true, active: true },
);
