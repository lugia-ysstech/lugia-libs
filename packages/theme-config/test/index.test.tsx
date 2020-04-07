// @flow

import * as React from 'react';
import Theme from '../src';
import renderer from 'react-test-renderer';
import { ThemeContext } from '@lugia/theme-core';
import { useContext } from 'react';

describe('ThemeConfig', () => {
  it('Theme', () => {
    const Test = (props: any) => {
      const context = useContext(ThemeContext);
      return (
        <div>
          {JSON.stringify(context)}
          {props.children}
        </div>
      );
    };
    const config = {
      hello: {
        test: {},
      },
    };
    const cmp = renderer.create(
      <Theme config={config}>
        <Test>hello everyone</Test>
      </Theme>,
    );
    expect(cmp).toMatchSnapshot();
  });
});
