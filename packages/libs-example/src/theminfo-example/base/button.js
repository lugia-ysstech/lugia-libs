/**
 *
 * 单个简单的组件
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import CSSComponent from '@lugia/theme-css-hoc';

export default CSSComponent({
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
