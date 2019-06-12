/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import CSSComponent, { keyframes } from '@lugia/theme-css-hoc';
import ThemeHoc from '@lugia/theme-hoc';
import { getBorder } from '@lugia/theme-css-hoc/src';

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

const Father = CSSComponent({
  tag: 'div',
  className: 'father',
  normal: {
    defaultTheme: {
      width: 555,
    },
  },
  disabled: {
    defaultTheme: {
      border: getBorder({ color: 'blue', style: 'solid', width: 5 }),
    },
    getCSS() {
      return 'background: red;';
    },
  },
  actived: {
    defaultTheme: {
      background: {
        backgroundColor: 'blue',
      },
    },
  },
});

const Children = CSSComponent({
  extend: Father,
  className: 'children',
  normal: {
    defaultTheme: {
      background: {
        backgroundColor: 'pink',
      },
    },
  },
  hover: {
    getCSS() {
      return 'background: purple;';
    },
    defaultTheme: {
      border: getBorder({ color: 'yellow', style: 'solid', width: 1 }),
    },
  },
});

const GrantSon = CSSComponent({
  extend: Children,
  className: 'GrantSon',
  normal: {
    defaultTheme: {
      background: {
        backgroundColor: 'pink',
      },
    },
  },
  hover: {
    getCSS() {
      return 'background: purple;';
    },
    defaultTheme: {
      border: getBorder({ color: 'red', width: 15 }),
    },
  },
});

const ThemeBlock = ThemeHoc(GrantSon, 'My_Block', {
  hover: true,
  actived: true,
});

export default class extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { count: 20, total: 50 };
  }

  block: Object;

  render() {
    const {
      themeProps: { themeState },
    } = this.props;
    const childWidgetName = 'ResetButton';
    const { viewClass, theme } = this.props.getPartOfThemeHocProps(
      childWidgetName,
    );
    return [
      <Father
        onClick={this.onClick}
        innerRef={cmp => {
          this.block = cmp;
        }}
        themeProps={this.props.getPartOfThemeProps('CSSBlock')}
      >
        CSSComponent
      </Father>,
      <Children
        themeProps={this.props.getPartOfThemeProps('Children', {
          props: {
            count: this.state.count,
          },
        })}
      >
        Clock
      </Children>,
      <GrantSon
        themeProps={this.props.getPartOfThemeProps('GrantSon', {
          props: { count: this.state.total },
        })}
      >
        BClock
      </GrantSon>,
      <ThemeBlock
        {...this.props.getPartOfThemeHocProps('ThemeBlock')}
        themeState={themeState}
      >
        ThemeComponent
      </ThemeBlock>,
      <Input themeProps={this.props.getPartOfThemeProps('My_Input')} />,
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
