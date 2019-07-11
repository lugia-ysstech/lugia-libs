/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import CSSComponent from '@lugia/theme-css-hoc';

const Button = CSSComponent({
  tag: 'button',
  normal: {
    defaultTheme: {
      width: 50,
    },
  },
  className: 'my_button',
});

export default class extends React.Component<any, any> {
  render() {
    const { children } = this.props;
    return (
      <Button
        themeProps={this.props.getPartOfThemeProps('Button')}
        onClick={this.props.onClick}
      >
        {children}
      </Button>
    );
  }
}
