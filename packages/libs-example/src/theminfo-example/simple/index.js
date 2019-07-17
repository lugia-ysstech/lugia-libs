/**
 *
 * 直接使用配置的项(normal,hover)作为 themeProps
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import BaseButton, { BlackButton } from '../base/button';
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
          <BlackButton themeProps={this.props.getPartOfThemeProps('PartB')}>
            {' '}
            PartB{' '}
          </BlackButton>
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
