/**
 *
 * 单个简单的组件
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import CSSComponent from '@lugia/theme-css-hoc';

const Button = CSSComponent({
  tag: 'button',
  className: 'button',
  normal: {
    defaultTheme: {
      background: {
        color: 'orange',
      },
    },
  },
  hover: {
    defaultTheme: {
      background: {
        color: 'blue',
      },
    },
  },
  focus: {
    defaultTheme: {
      background: {
        color: 'red',
      },
    },
  },
  active: {
    defaultTheme: {
      background: {
        color: 'purple',
      },
    },
  },
  disabled: {
    defaultTheme: {
      background: {
        color: 'black',
      },
    },
  },
});

export const BlackButton = CSSComponent({
  extend: Button,
  className: 'BlackButton',
  normal: {
    defaultTheme: {
      background: {
        color: 'black',
      },
    },
  },
});
export const BlueButton = CSSComponent({
  extend: Button,
  className: 'BlueButton',
  normal: {
    defaultTheme: {
      background: {
        color: 'blue',
      },
      color: 'blue',
    },
  },
});

export const PinkButton = CSSComponent({
  extend: Button,
  className: 'BlueButton',
  normal: {
    defaultTheme: {
      background: {
        color: 'pink',
      },
      color: 'blue',
    },
  },
});

export default Button;
