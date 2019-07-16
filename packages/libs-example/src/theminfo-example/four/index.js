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
import { BlueButton } from '../base/button';
import Single from '../single/index';

const ThreeB = ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      const TwoC = {
        TwoC: {
          ButtonA: this.props.getPartOfThemeConfig('ButtonA'),
          ButtonB: {
            PartA: this.props.getPartOfThemeConfig('PartA'),
            PartB: this.props.getPartOfThemeConfig('PartA'),
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
  'Four-ThreeB',
  { hover: true, active: true },
);

const Three = ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      const TwoC = {
        TwoC: {
          ButtonA: this.props.getPartOfThemeConfig('BBBButtonA'),
          PartA: this.props.getPartOfThemeConfig('BButtonBPartA'),
        },
      };

      console.info(TwoC);
      return (
        <div {...addMouseEvent(this)} style={{ border: '1px solid' }}>
          three
          <ThreeB viewClass={'TwoC'} theme={TwoC} />
          <Two {...this.props.getPartOfThemeHocProps('TwoTwo')} />
          <Single {...this.props.getPartOfThemeHocProps('BButtonBPartA')} />
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
          TwoTwo: this.props.getPartOfThemeConfig('Two'),
          BButtonBPartA: this.props.getPartOfThemeConfig('BButtonBPartA_0'),
          BBBButtonA: this.props.getPartOfThemeConfig('BButtonA_0'),
        },
      };

      console.info('two', this.props.getPartOfThemeConfig('Two').ButtonA.PartA); // TODO: 111
      const TwoC = {
        TwoC: {
          ButtonB: this.props.getPartOfThemeConfig('BButtonA_0'),
          ButtonA: {
            PartB: this.props.getPartOfThemeConfig('BButtonBPartA_0'),
          },
        },
      };
      console.info('abc', this.props.getPartOfThemeProps('BButtonBPartA_0'));
      return (
        <div {...addMouseEvent(this)} style={{ border: '1px solid' }}>
          <Three viewClass={'ThreeC'} theme={ThreeC} />
          <BlueButton
            themeProps={this.props.getPartOfThemeProps('BButtonBPartA_0')}
          >
            btn1
          </BlueButton>
          <Two {...this.props.getPartOfThemeHocProps('Two')} />
          <Two viewClass={'TwoC'} theme={TwoC} />
        </div>
      );
    }
  },
  'Four',
  { hover: true, active: true },
);
