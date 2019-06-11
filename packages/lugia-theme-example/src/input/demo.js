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
    const config = {};
    return (
      <div style={{ fontSize: '2rem' }}>
        <Input theme={config} />
      </div>
    );
  }
}
