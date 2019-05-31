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

const Clock = CSSComponent({
  tag: 'div',
  className: 'main_block',
  normal: {
    defaultTheme: {
      width: 20,
      background: {
        backgroundColor: 'pink',
      },
    },
  },
  actived: {
    getStyle(themeMeta, themeProps) {
      const {
        propsConfig: { count = 0 },
      } = themeProps;
      return {
        width: `${count}px`,
      };
    },
  },
});

const BClock = CSSComponent({
  extend: Clock,
  className: 'main_bloClockck',
  hover: {
    defaultTheme: {
      background: {
        backgroundColor: 'blue',
      },
      border: {
        top: {
          borderStyle: 'soild',
          borderColor: 'pink',
          borderSize: 5,
        },
      },
    },
  },
});

const ThemeBlock = ThemeHoc(Block, 'My_Block', { hover: true, actived: true });

export default class extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { count: 20, total: 50 };
  }

  render() {
    const { themeProps } = this.props;
    const childWidgetName = 'ResetButton';
    const { viewClass, theme } = this.props.getChildTheme(childWidgetName);
    const { themeState } = themeProps;
    return [
      <Button viewClass={viewClass} theme={theme} onClick={this.onClick}>
        reset
      </Button>,
      <Block themeProps={this.props.mergeChildThemeProps('CSSBlock')}>
        CSSComponent
      </Block>,
      <Clock
        themeProps={this.props.mergeThemePropsConfig({
          count: this.state.count,
        })}
      >
        Clock
      </Clock>,
      <BClock
        themeProps={this.props.mergeThemePropsConfig({
          count: this.state.total,
        })}
      >
        BClock
      </BClock>,
      <ThemeBlock
        {...this.props.getChildTheme('ThemeBlock')}
        themeState={themeState}
      >
        ThemeComponent
      </ThemeBlock>,
      <Input themeProps={themeProps} />,
    ];
  }

  onClick = () => {
    this.setState({
      count: this.state.count + 20,
      total: this.state.total + 100,
    });
  };
}
