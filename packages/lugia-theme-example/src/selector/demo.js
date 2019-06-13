/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import Selector from './';

export default class Demo extends React.Component<any, any> {
  render() {
    const config = {
      Selector: {
        Block: {
          normal: {
            background: {
              color: 'green',
            },
            last: {
              background: {
                color: 'red',
              },
            },
            first: {
              background: {
                color: 'blue',
              },
            },
            nth8: {
              background: {
                color: 'yellow',
              },
            },
          },
        },
      },
    };
    return <Selector theme={config} />;
  }
}
