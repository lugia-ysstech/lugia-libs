/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import Input from './';
import Theme from '@lugia/theme-config';

export default class Demo extends React.Component<any, any> {
  render() {
    const config = {
      My_Input: {
        normal: {
          width: 500,
        },
      },
    };
    return (
      <Theme config={config}>
        <Input />
      </Theme>
    );
  }
}
