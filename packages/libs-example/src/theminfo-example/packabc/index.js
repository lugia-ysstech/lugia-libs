/**
 *
 * 打一次包然后再逐层取出对应的配置
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import ThemeHoc, { addMouseEvent } from '@lugia/theme-hoc';
import Abc from '../abc';

export default ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      const theme = {
        Theme: {
          A: this.props.getPartOfThemeConfig('A'),
        },
      };
      return (
        <div {...addMouseEvent(this)} style={{ border: '1px solid' }}>
          <Abc viewClass={'Theme'} theme={theme} />
        </div>
      );
    }
  },
  'Four',
  { hover: true, active: true },
);
