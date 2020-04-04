/**
 *
 * create by wcx
 *
 * @flow
 */
// import 'react-dom';
import * as React from 'react';
import styled from 'styled-components';
import Theme from '@lugia/theme-config';
import { configure, mount } from 'enzyme';
import ThemeProvider, { addMouseEvent } from '../src';
// @ts-ignore
import Adapter from 'enzyme-adapter-react-16';
import { deepMerge } from '@lugia/object-utils';

configure({ adapter: new Adapter() });

const Input = styled.div``;
Input.displayName = 'input';

describe('ThemeProvider', () => {
  const HelloMyButton = 'HelloMyButton';
  const HelloMyButtonTheme = 'HelloMyButtonTheme';
  const Button = ThemeProvider(
    class ButtonA extends React.Component<any, any, any> {
      static displayName = HelloMyButton;

      render() {
        return <div />;
      }
    },
    HelloMyButtonTheme,
  );
  const ThemeInput = ThemeProvider(
    class extends React.Component<any, any> {
      static displayName = 'themeInput';

      render() {
        return (
          <div>
            <Input />
          </div>
        );
      }
    },
    HelloMyButtonTheme,
  );
  const svThemeConfigTree = 'svThemeConfigTree';

  const getTheme = function(target: any, widgetDisplayName: string) {
    return target
      .find(widgetDisplayName)
      .at(0)
      .props()
      .getTheme();
  };
  const getWidgetThemeName = function(target: any, widgetDisplayName: string) {
    return target
      .find(widgetDisplayName)
      .at(0)
      .props()
      .getWidgetThemeName();
  };
  const getThemeByDisplayName = function(
    target: any,
    widgetDisplayName: string,
    OtherWidgetDisplayName: string,
  ) {
    return target
      .find(widgetDisplayName)
      .instance()
      .props.getThemeByDisplayName(OtherWidgetDisplayName);
  };
  it('config: {}', () => {
    const config = {};
    const target = mount(
      <Theme config={config}>
        <Button />
      </Theme>,
    );

    expect(getWidgetThemeName(target, HelloMyButton)).toEqual(
      HelloMyButtonTheme,
    );
    expect(getTheme(target, HelloMyButton)).toEqual({
      [svThemeConfigTree]: {},
    });
  });

  it('config: {lgx: {}}', () => {
    const lgx = {};
    const config = { lgx };

    const target = mount(
      <Theme config={config}>
        <Button />
      </Theme>,
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      [svThemeConfigTree]: {
        lgx,
      },
    });
  });

  it('mutline theme, config: { HelloMyButton : {}}', () => {
    const btnConfigA = { normal: { width: 50 } };
    const btnConfigB = { normal: { height: 100 } };
    const configA = { [HelloMyButtonTheme]: { Container: btnConfigA } };
    const configB = { [HelloMyButtonTheme]: { Container: btnConfigB } };

    const target = mount(
      <Theme config={configA}>
        <Theme config={configB}>
          <Button />
        </Theme>
      </Theme>,
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      Container: deepMerge(btnConfigA, btnConfigB),
      [svThemeConfigTree]: {
        [HelloMyButtonTheme]: {
          Container: deepMerge(btnConfigA, btnConfigB),
        },
      },
    });
  });

  type TestCaseType = 'viewClass' | 'widgetName' | 'all';

  function testTheme(level: number, type: TestCaseType) {
    const viewClass = 'viewClass';

    function getConfig(i: number, type: TestCaseType) {
      const viewClassName = `${viewClass}_${i}`;
      const btnCfgClassName = `${HelloMyButtonTheme}_${i}`;

      const viewCfg = { hello: { viewClassName } };
      const btnCfg = { world: { btnCfgClassName } };

      const viewConfigVal = {
        [viewClass]: viewCfg,
      };

      const themeConfigVal = {
        [HelloMyButtonTheme]: btnCfg,
      };
      switch (type) {
        case 'viewClass':
          return viewConfigVal;
        case 'widgetName':
          return themeConfigVal;
        case 'all':
          return {
            ...viewConfigVal,
            ...themeConfigVal,
          };
        default:
      }
      return {};
    }

    it(`${type} level is ${level}`, () => {
      let element = <Button viewClass={viewClass} />;
      for (let i = 0; i < level; i++) {
        const config = getConfig(i, type);
        element = <Theme config={config}>{element}</Theme>;
      }

      const target = mount(element);

      function getRealyConfig(target: Object, type: TestCaseType) {
        switch (type) {
          case 'viewClass':
            return target[viewClass];
          case 'widgetName':
            return target[HelloMyButtonTheme];
          case 'all':
            return { ...target[viewClass], ...target[HelloMyButtonTheme] };
          default:
        }
      }

      function getExpectConfig(level: number, type: TestCaseType) {
        const target = getConfig(0, type);
        const realyConfig = getRealyConfig(target, type);
        return {
          ...realyConfig,
          [svThemeConfigTree]: target,
        };
      }

      expect(getTheme(target, HelloMyButton)).toEqual(
        getExpectConfig(level, type),
      );
    });
  }

  for (let i = 1; i < 10; i++) {
    testTheme(i, 'widgetName');
    testTheme(i, 'viewClass');
    testTheme(i, 'all');
  }
  it('mutline theme,  config: { viewClass : {}}', () => {
    const btnConfigA = { normal: { color: 'a' } };
    const btnConfigB = { normal: { opacity: 5.5 } };
    const viewClass = 'helloLIgx';
    const configA = { [viewClass]: { Container: btnConfigA } };
    const configB = { [viewClass]: { Container: btnConfigB } };

    const target = mount(
      <Theme config={configA}>
        <Theme config={configB}>
          <Button viewClass={viewClass} />
        </Theme>
      </Theme>,
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      Container: deepMerge(btnConfigA, btnConfigB),
      [svThemeConfigTree]: {
        [viewClass]: {
          Container: deepMerge(btnConfigA, btnConfigB),
        },
      },
    });
  });

  it('mutline theme,  config: { HelloMyButton: {}, viewClass : {}}', () => {
    const btnConfigA = { normal: { color: 'a' } };
    const btnConfigB = { normal: { opacity: 1 } };
    const helloMyButtonA = { HelloMyButtonA: { normal: { color: 'blue' } } };
    const helloMyButtonB = { HelloMyButtonB: { normal: { color: 'yellow' } } };

    const viewClass = 'helloLIgx';
    const configA = {
      [viewClass]: { Container: btnConfigA },
      [HelloMyButtonTheme]: helloMyButtonA,
    };
    const configB = {
      [viewClass]: { Container: btnConfigB },
      [HelloMyButtonTheme]: helloMyButtonB,
    };

    const target = mount(
      <Theme config={configA}>
        <Theme config={configB}>
          <Button viewClass={viewClass} />
        </Theme>
      </Theme>,
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      Container: deepMerge(btnConfigA, btnConfigB),
      ...helloMyButtonA,
      ...helloMyButtonB,
      [svThemeConfigTree]: {
        [HelloMyButtonTheme]: {
          ...helloMyButtonA,
          ...helloMyButtonB,
        },
        [viewClass]: {
          Container: deepMerge(btnConfigA, btnConfigB),
        },
      },
    });
  });

  it('config: { HelloMyButton : {}}', () => {
    const btnConfig = { Container: { normal: { color: 'blue' } } };
    const config = { [HelloMyButtonTheme]: btnConfig };

    const target = mount(
      <Theme config={config}>
        <Button />
      </Theme>,
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      ...btnConfig,
      [svThemeConfigTree]: {
        [HelloMyButtonTheme]: btnConfig,
      },
    });
  });

  it('config: { HelloMyButton : {}} viewClass: "viewClass"', () => {
    const btnConfig = { Container: { normal: { color: 'blue' } } };
    const config = { [HelloMyButtonTheme]: btnConfig };

    const target = mount(
      <Theme config={config}>
        <Button viewClass="viewClass" />
      </Theme>,
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      ...btnConfig,
      [svThemeConfigTree]: {
        [HelloMyButtonTheme]: btnConfig,
      },
    });
  });

  it('config: { viewClass : {}}', () => {
    const viewClass = 'ligx';
    const btnConfig = { Container: { normal: { color: 'blue' } } };
    const config = { [viewClass]: btnConfig };

    const target = mount(
      <Theme config={config}>
        <Button viewClass={viewClass} />
      </Theme>,
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      ...btnConfig,
      [svThemeConfigTree]: {
        [viewClass]: btnConfig,
      },
    });
  });

  it('config: { HelloMyButton : {}, viewClass : {}} is same', () => {
    const viewClass = 'ligx';

    const viewClassConfig = { Container: { normal: { color: 'green' } } };
    const btnConfig = { Container: { normal: { color: 'yellow' } } };

    const config = {
      [viewClass]: viewClassConfig,
      [HelloMyButtonTheme]: btnConfig,
    };

    const target = mount(
      <Theme config={config}>
        <Button viewClass={viewClass} />
      </Theme>,
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      ...viewClassConfig,
      [svThemeConfigTree]: {
        [viewClass]: viewClassConfig,
        [HelloMyButtonTheme]: btnConfig,
      },
    });
  });
  it('config: { HelloMyButton : {}, viewClass : {}} is different', () => {
    const viewClass = 'ligx';

    const viewClassConfig = { Container: { normal: { color: 'viewClass' } } };
    const btnConfig = { Container: { normal: { opacity: 1 } } };

    const config = {
      [viewClass]: viewClassConfig,
      [HelloMyButtonTheme]: btnConfig,
    };

    const target = mount(
      <Theme config={config}>
        <Button viewClass={viewClass} />
      </Theme>,
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      ...viewClassConfig,
      [svThemeConfigTree]: {
        [HelloMyButtonTheme]: btnConfig,
        [viewClass]: viewClassConfig,
      },
    });
  });

  it('config:  3 level ', () => {
    const viewClass = 'ligx';

    const levelA = { Container: { normal: { color: '#5514123' } } };
    const levelB = { Container: { normal: { color: 'red' } } };
    const levelC = { Container: { normal: { color: '#4532431' } } };

    const configA = { [viewClass]: levelA };
    const configB = { [viewClass]: levelB };
    const configC = { [viewClass]: levelC };

    const target = mount(
      <Theme config={configA}>
        <Theme config={configB}>
          <Theme config={configC}>
            <Button viewClass={viewClass} />
          </Theme>
        </Theme>
      </Theme>,
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      ...levelC,
      [svThemeConfigTree]: {
        [viewClass]: levelC,
      },
    });
  });

  it('config:  3 level mixed', () => {
    const viewClass = 'ligx';
    const widthConfig = {
      width: 500,
    };
    const bgConfig = {
      background: {
        color: 'red',
      },
    };
    const levelA = { Container: { normal: { color: '#abcdef', ...bgConfig } } };
    const levelB = { Container: { normal: { color: 'red', ...widthConfig } } };
    const levelC = { Container: { normal: { color: '#bcdefg' } } };

    const configA = { [viewClass]: levelA };
    const configB = { [viewClass]: levelB };
    const configC = { [viewClass]: levelC };

    const target = mount(
      <Theme config={configA}>
        <Theme config={configB}>
          <Theme config={configC}>
            <Button viewClass={viewClass} />
          </Theme>
        </Theme>
      </Theme>,
    );

    expect(getTheme(target, HelloMyButton)).toEqual({
      Container: deepMerge(
        levelC.Container,
        { normal: { ...widthConfig } },
        { normal: { ...bgConfig } },
      ),
      [svThemeConfigTree]: {
        [viewClass]: {
          Container: deepMerge(
            levelC.Container,
            { normal: { ...widthConfig } },
            { normal: { ...bgConfig } },
          ),
        },
      },
    });
  });
  it('config:  inner level theme', () => {
    const viewClassA = 'ligx';
    const viewClassB = 'input';
    const levelA = { Container: { normal: { width: 400 } } };
    const levelB = { normal: { width: 500 } };

    const configA = { [viewClassA]: levelA, [viewClassB]: { levelB } };

    const target = mount(
      <Theme config={configA}>
        <ThemeInput />
      </Theme>,
    );

    expect(getThemeByDisplayName(target, 'themeInput', 'input')).toEqual({
      levelB,
    });
  });
  it('config:  inner level theme null', () => {
    const viewClassA = 'ligx';
    const viewClassB = 'input';
    const levelA = { Container: { normal: { width: 400 } } };
    const levelB = {};

    const configA = { [viewClassA]: levelA, [viewClassB]: { levelB } };

    const target = mount(
      <Theme config={configA}>
        <ThemeInput />
      </Theme>,
    );

    expect(getThemeByDisplayName(target, 'themeInput', 'input')).toEqual({
      levelB,
    });
  });
  it('config:   multiple level theme', () => {
    const viewClassB = 'input';
    const levelA = { Container: { normal: { width: 400 } } };
    const levelB = { Container: { normal: { width: 500 } } };
    const levelC = { Container: { normal: { width: 600 } } };

    const configA = { [viewClassB]: levelA };
    const configB = { [viewClassB]: levelB };
    const configC = { [viewClassB]: levelC };

    const target = mount(
      <Theme config={configA}>
        <Theme config={configB}>
          <Theme config={configC}>
            <ThemeInput viewClass={viewClassB} />
          </Theme>
        </Theme>
      </Theme>,
    );

    expect(getThemeByDisplayName(target, 'themeInput', 'input')).toEqual(
      levelC,
    );
  });
  it('config:   multiple level theme', () => {
    const viewClassB = 'input';
    const levelA = { Container: { normal: { width: 400 } } };
    const levelB = { Container: { normal: { width: 500 } } };
    const levelC = { Container: { normal: { width: 600 } } };

    const configA = { [viewClassB]: levelA };
    const configB = { [viewClassB]: levelB };
    const configC = { [viewClassB]: levelC };

    const target = mount(
      <Theme config={configA}>
        <Theme config={configB}>
          <Theme config={configC}>
            <ThemeInput viewClass={viewClassB} />
          </Theme>
        </Theme>
      </Theme>,
    );

    expect(getThemeByDisplayName(target, 'themeInput', 'input')).toEqual(
      levelC,
    );
  });
  it('config:   multiple level theme', () => {
    const viewClassB = 'input';
    const levelA = { Container: { normal: { width: 400 } } };
    const levelB = { Container: { normal: { width: 500 } } };
    const levelC = { Container: { normal: { width: 600 } } };

    const configA = { [viewClassB]: levelA };
    const configB = { [viewClassB]: levelB };
    const configC = { [viewClassB]: levelC };

    const target = mount(
      <Theme config={configA}>
        <Theme config={configB}>
          <Theme config={configC}>
            <ThemeInput viewClass={viewClassB} />
          </Theme>
        </Theme>
      </Theme>,
    );

    expect(getThemeByDisplayName(target, 'themeInput', 'input')).toEqual(
      levelC,
    );
  });
  it('config:   multiple level multiple attr theme', () => {
    const viewClassB = 'input';
    const viewClassA = 'button';
    const levelA = { Container: { normal: { width: 400, color: 'red' } } };
    const levelB = { Container: { normal: { width: 500 } } };
    const levelC = { Container: { normal: { width: 600 } } };

    const configA = { [viewClassA]: levelA, [viewClassB]: levelA };
    const configB = { [viewClassA]: levelB, [viewClassB]: levelB };
    const configC = { [viewClassB]: levelC };

    const target = mount(
      <Theme config={configA}>
        <Theme config={configB}>
          <Theme config={configC}>
            <ThemeInput viewClass={viewClassB} />
          </Theme>
        </Theme>
      </Theme>,
    );

    expect(getThemeByDisplayName(target, 'themeInput', viewClassB)).toEqual(
      deepMerge(levelA, levelC),
    );
    expect(getThemeByDisplayName(target, 'themeInput', viewClassA)).toEqual(
      deepMerge(levelA, levelB),
    );
  });

  it('theme props', () => {
    // todo: willtest
  });

  it('themeState', () => {
    // todo: willtest
  });

  it('addMouseEvent for mouseEnter', () => {
    const call = [];
    const self = {
      props: {
        onMouseEnter(param) {
          call.push(param);
        },
      },
    };
    const result = addMouseEvent(self);
    result.onMouseEnter('a');

    expect(call).toEqual(['a']);
    expect(result.onMouseUp).toBeUndefined();
    expect(result.onMouseLeave).toBeUndefined();
    expect(result.onMouseDown).toBeUndefined();
  });

  it('addMouseEvent for only opt enter', () => {
    const call = [];
    const self = {
      props: {},
    };
    const result = addMouseEvent(self, {
      enter(param) {
        call.push(param);
      },
    });
    result.onMouseEnter('a');

    expect(call).toEqual(['a']);
    expect(result.onMouseUp).toBeUndefined();
    expect(result.onMouseLeave).toBeUndefined();
    expect(result.onMouseDown).toBeUndefined();
  });

  it('addMouseEvent for all ', () => {
    const call = [];
    const self = {
      props: {
        onMouseEnter(param) {
          call.push(param);
        },
        onMouseUp(param) {
          call.push(param);
        },
        onMouseLeave(param) {
          call.push(param);
        },
        onMouseDown(param) {
          call.push(param);
        },
      },
    };
    const result = addMouseEvent(self);
    result.onMouseEnter('a');

    expect(call).toEqual(['a']);
    result.onMouseUp('b');

    expect(call).toEqual(['a', 'b']);
    result.onMouseLeave('c');

    expect(call).toEqual(['a', 'b', 'c']);
    result.onMouseDown('d');

    expect(call).toEqual(['a', 'b', 'c', 'd']);
  });
  it('addMouseEvent for all opt ', () => {
    const call = [];
    const self = {
      props: {},
    };
    const result = addMouseEvent(self, {
      enter(param) {
        call.push(param);
      },
      up(param) {
        call.push(param);
      },
      leave(param) {
        call.push(param);
      },
      down(param) {
        call.push(param);
      },
    });
    result.onMouseEnter('a');

    expect(call).toEqual(['a']);
    result.onMouseUp('b');

    expect(call).toEqual(['a', 'b']);
    result.onMouseLeave('c');

    expect(call).toEqual(['a', 'b', 'c']);
    result.onMouseDown('d');

    expect(call).toEqual(['a', 'b', 'c', 'd']);
  });

  it('addMouseEvent for  all opt and props ', () => {
    const call = [];
    const self = {
      props: {
        onMouseEnter(param) {
          call.push('p_' + param);
        },
        onMouseUp(param) {
          call.push('p_' + param);
        },
        onMouseLeave(param) {
          call.push('p_' + param);
        },
        onMouseDown(param) {
          call.push('p_' + param);
        },
      },
    };
    const result = addMouseEvent(self, {
      enter(param) {
        call.push(param);
      },
      up(param) {
        call.push(param);
      },
      leave(param) {
        call.push(param);
      },
      down(param) {
        call.push(param);
      },
    });
    result.onMouseEnter('a');

    expect(call).toEqual(['a', 'p_a']);
    result.onMouseUp('b');

    expect(call).toEqual(['a', 'p_a', 'b', 'p_b']);
    result.onMouseLeave('c');

    expect(call).toEqual(['a', 'p_a', 'b', 'p_b', 'c', 'p_c']);
    result.onMouseDown('d');

    expect(call).toEqual(['a', 'p_a', 'b', 'p_b', 'c', 'p_c', 'd', 'p_d']);
  });

  it('addMouseEvent for  all opt and props  is after', () => {
    const call = [];
    const self = {
      props: {
        onMouseEnter(param) {
          call.push('p_' + param);
        },
        onMouseUp(param) {
          call.push('p_' + param);
        },
        onMouseLeave(param) {
          call.push('p_' + param);
        },
        onMouseDown(param) {
          call.push('p_' + param);
        },
      },
    };
    const result = addMouseEvent(
      self,
      {
        enter(param) {
          call.push(param);
        },
        up(param) {
          call.push(param);
        },
        leave(param) {
          call.push(param);
        },
        down(param) {
          call.push(param);
        },
      },
      {
        after: {
          down: true,
          leave: true,
        },
      },
    );
    result.onMouseEnter('a');

    expect(call).toEqual(['a', 'p_a']);
    result.onMouseUp('b');

    expect(call).toEqual(['a', 'p_a', 'b', 'p_b']);
    result.onMouseLeave('c');

    expect(call).toEqual(['a', 'p_a', 'b', 'p_b', 'p_c', 'c']);
    result.onMouseDown('d');

    expect(call).toEqual(['a', 'p_a', 'b', 'p_b', 'p_c', 'c', 'p_d', 'd']);
  });
});
