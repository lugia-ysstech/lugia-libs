/**
 *
 * 包含两层的配置嵌套
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import ThemeHoc, { addMouseEvent } from '@lugia/theme-hoc';
import Button from '../base/button';
import Simple from '../simple';
import CSSComponent from '@lugia/theme-css-hoc';
import { getBorder } from '@lugia/theme-utils';

const TwoWrap = CSSComponent({
  tag: 'div',
  normal: {
    defaultTheme: {
      border: getBorder({
        color: 'red',
        width: 1,
        style: 'solid',
      }),
    },
  },
  className: 'TwoWrap',
});
export default ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      return (
        <TwoWrap
          {...addMouseEvent(this)}
          style={{ border: '1px solid' }}
          themeProps={this.props.getPartOfThemeProps('TwoWrap')}
        >
          two
          <Simple />
          <Button themeProps={this.props.getPartOfThemeProps('PartA')} />
          <Simple {...this.props.getPartOfThemeHocProps('ButtonA')} />
          <Simple {...this.props.getPartOfThemeHocProps('ButtonB')} />
        </TwoWrap>
      );
    }
  },
  'Two',
  { hover: true, active: true },
);
