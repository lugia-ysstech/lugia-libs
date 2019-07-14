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
import Button from '../base/button';
import Simple from '../simple';
import { deepMerge } from '../../../../object-utils/src';

export default ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      const {
        themeProps: { themeState },
      } = this.props;

      const PartB = deepMerge(
        {
          themeState,
        },
        {
          themeConfig: this.props.getPartOfThemeConfig('PartB'),
        },
      );
      const { viewClass, theme } = this.props.getPartOfThemeHocProps('ButtonB');
      const ButtonB = deepMerge(
        {
          [viewClass]: {},
        },
        theme,
      );

      const ButtonC = {
        SimpleC: {
          ButtonA: this.props.getPartOfThemeProps('BButtonA'),
          ButtonB: {
            PartA: this.props.getPartOfThemeProps('BButtonBPartA'),
          },
        },
      };

      console.info(ButtonC);
      return (
        <div {...addMouseEvent(this)} style={{ border: '1px solid' }}>
          three
          <Two />
          <Button themeProps={this.props.getPartOfThemeProps('PartA')}>
            BPartA
          </Button>
          <Button themeProps={PartB}>BPartB</Button>
          <Simple {...this.props.getPartOfThemeHocProps('ButtonA')} />
          <Simple viewClass={viewClass} theme={ButtonB} />
          <Simple viewClass={'SimpleC'} theme={ButtonC} />
          <Two {...this.props.getPartOfThemeHocProps('BigA')} />
          <Two {...this.props.getPartOfThemeHocProps('BigB')} />
        </div>
      );
    }
  },
  'Selector',
  { hover: true, active: true },
);
