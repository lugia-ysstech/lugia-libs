/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import CSSComponent from '@lugia/theme-css-provider';

const Input = CSSComponent({
  tag: 'input',
  className: 'main_input',
});

export default class extends React.Component<any, any> {
  render() {
    return <Input themeProps={this.props.themeProps} />;
  }
}
