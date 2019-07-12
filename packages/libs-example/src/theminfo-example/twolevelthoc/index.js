/**
 *
 * 单个简单的组件
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import ThemeHoc, { addMouseEvent } from '@lugia/theme-hoc';
import Button from '../base/button';
import Simple from '../simple';

export default ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      return (
        <div {...addMouseEvent(this)} style={{ border: '1px solid' }}>
          two
          <Simple />
          <Button themeProps={this.props.getPartOfThemeProps('PartA')} />
          <Simple {...this.props.getPartOfThemeHocProps('ButtonA')} />
          <Simple {...this.props.getPartOfThemeHocProps('ButtonB')} />
        </div>
      );
    }
  },
  'Selector',
  { hover: true, active: true },
);
