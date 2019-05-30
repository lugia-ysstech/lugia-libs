/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import Input from './';

export default class Demo extends React.Component<any, any> {
  render() {
    const config = {
      My_Input: {
        normal: {
          width: 800,
          background: { backgroundColor: 'red' },
        },
        hover: {
          background: { backgroundColor: 'blue' },
        },
        children: {
          ResetButton: {
            normal: {
              width: 555,
            },
          },
          CSSBlock: {
            normal: {
              background: { backgroundColor: 'yellow' },
            },
            hover: {
              background: { backgroundColor: 'white' },
            },
          },
          ThemeBlock: {
            normal: {
              background: { backgroundColor: 'yellow' },
            },
            hover: {
              background: { backgroundColor: 'black' },
            },
          },
        },
      },
    };
    return <Input theme={config} />;
  }
}
