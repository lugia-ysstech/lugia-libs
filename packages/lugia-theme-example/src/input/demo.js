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
        },
        children: {
          ResetButton: {
            normal: {
              width: 555,
            },
          },
        },
      },
    };
    return <Input theme={config} />;
  }
}
