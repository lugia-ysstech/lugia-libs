/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import CSSComponent from '@lugia/theme-css-provider';
import ThemeHoc from '@lugia/theme-hoc';

import Button from '../button';

const Input = CSSComponent({
  tag: 'input',
  className: 'main_input',
});

const Block = CSSComponent({
  tag: 'div',
  className: 'main_block',
});

const ThemeBlock = ThemeHoc(Block, 'My_Block', { hover: true, actived: true });

export default class extends React.Component<any, any> {
  render() {
    const { themeProps } = this.props;
    const childWidgetName = 'ResetButton';
    const { viewClass, theme } = this.props.getChildTheme(childWidgetName);
    const { themeState } = themeProps;
    return [
      <Button viewClass={viewClass} theme={theme}>
        reset
      </Button>,
      <Block themeProps={this.props.mergeChildThemeProps('CSSBlock')}>
        CSSComponent
      </Block>,
      <ThemeBlock
        {...this.props.getChildTheme('ThemeBlock')}
        themeState={themeState}
      >
        ThemeComponent
      </ThemeBlock>,
      <Input themeProps={themeProps} />,
    ];
  }
}
