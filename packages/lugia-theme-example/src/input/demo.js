/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import Input from './';
import { getBorder } from '@lugia/theme-css-hoc/src';

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
              border: getBorder(
                { color: 'red', width: 5, style: 'solid' },
                { radius: '50%' },
              ),
              width: 25,
              fontSize: '1rem',
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
    return (
      <div style={{ fontSize: '2rem' }}>
        <Input theme={config} />
      </div>
    );
  }
}
