/**
 *
 * 单个简单的组件
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import BaseButton from '../base/button';
import ThemeHoc, { addMouseEvent } from '@lugia/theme-hoc';

export default ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      return (
        <div {...addMouseEvent(this)}>
          <BaseButton themeProps={this.props.getPartOfThemeProps('PartA')}>
            {' '}
            PartA{' '}
          </BaseButton>
          <BaseButton themeProps={this.props.getPartOfThemeProps('PartB')}>
            {' '}
            PartB{' '}
          </BaseButton>
          <BaseButton themeProps={this.props.getPartOfThemeProps('PartC')}>
            {' '}
            PartC{' '}
          </BaseButton>
        </div>
      );
    }
  },
  'One',
  { hover: true, active: true },
);
