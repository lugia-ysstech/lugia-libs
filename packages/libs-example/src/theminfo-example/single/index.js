/**
 *
 * 传入就是theme没有再划分PartA PartB
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import { PinkButton } from '../base/button';
import ThemeHoc, { addMouseEvent } from '@lugia/theme-hoc';

export default ThemeHoc(
  class extends React.Component<any, any> {
    render() {
      return (
        <div {...addMouseEvent(this)}>
          <PinkButton themeProps={this.props.themeProps}> Single </PinkButton>
        </div>
      );
    }
  },
  'One',
  { hover: true, active: true },
);
