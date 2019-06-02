/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import CSSComponent, { css, keyframes } from '@lugia/theme-css-hoc';
import ThemeHoc from '@lugia/theme-hoc';

const showUp = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;
const Input = CSSComponent({
  tag: 'input',
  className: 'main_input',
});

const Block = CSSComponent({
  tag: 'div',
  className: 'main_block',
  hover: {
    getCSS() {
      return css`
        animation: ${showUp} 0.3s linear forwards;
      `;
    },
  },
  disabled: {
    getStyle() {
      return { backgroundColor: 'black' }; // return {  background: 'black' };  内部目前不支持这种写法
    },
  },
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
        backgroundColor: 'green',
      },
      border: {
        borderStyle: 'solid',
        borderColor: 'pink',
        borderWidth: 55,
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

  block: Object;

  render() {
    const { themeProps } = this.props;
    const childWidgetName = 'ResetButton';
    const { viewClass, theme } = this.props.getChildThemeHocProps(
      childWidgetName,
    );
    const { themeState } = themeProps;
    return [
      <Block
        ref={cmp => {
          this.block = cmp;
        }}
        themeProps={this.props.mergeThemeStateAndChildThemeProps('CSSBlock')}
      >
        CSSComponent
      </Block>,
      <Clock
        themeProps={this.props.mergeThemePropsAndPropsConfig({
          count: this.state.count,
        })}
      >
        Clock
      </Clock>,
      <BClock
        themeProps={this.props.mergeThemePropsAndPropsConfig({
          count: this.state.total,
        })}
      >
        BClock
      </BClock>,
      <ThemeBlock
        {...this.props.getChildThemeHocProps('ThemeBlock')}
        themeState={themeState}
      >
        ThemeComponent
      </ThemeBlock>,
      <Input themeProps={themeProps} />,
    ];
  }

  onClick = () => {
    console.info('block ref', this.block);
    this.setState({
      count: this.state.count + 20,
      total: this.state.total + 100,
    });
  };
}
