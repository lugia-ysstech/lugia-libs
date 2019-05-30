/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import CSSComponent from '@lugia/theme-css-provider';

import Button from '../button';

const Input = CSSComponent({
  tag: 'input',
  className: 'main_input',
});

export default class extends React.Component<any, any> {
  render() {
    const { themeProps } = this.props;
    const childWidgetName = 'ResetButton';

    const { viewClass, theme } = this.props.getChildTheme(childWidgetName);
    return [
      <Button viewClass={viewClass} theme={theme}>
        reset
      </Button>,
      <Input themeProps={themeProps} />,
    ];
  }
}
