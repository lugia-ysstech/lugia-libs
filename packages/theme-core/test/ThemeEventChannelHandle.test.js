/**
 *
 * create by wcx
 *
 * @flow
 */
import 'jest-styled-components';
import ThemeEventChannelHandle from '../src/ThemeEventChannelHandle';

const {
  mockObject,
  VerifyOrder,
  VerifyOrderConfig,
} = require('@lugia/jverify');

const { delay } = require('@lugia/react-test-utils');
const emptyObj: Object = null;
describe('ThemeEventChannelHandle.test.js', () => {
  it('dispatchEvent empty eventNames', () => {
    const themeState = {
      a: 11,
    };
    const target = new ThemeEventChannelHandle(
      { disabled: true },
      'Widget',
      themeState,
    );
    const anyStr: any = 'aaaa';
    expect(target.dispatchEvent(['a', 'cc'], anyStr)).toEqual({});
    expect(target.dispatchEvent([], 'f2c')).toEqual({});
    expect(target.dispatchEvent([], 'c2f')).toEqual({});
    expect(target.dispatchEvent(emptyObj, 'f2c')).toEqual({});
    expect(target.dispatchEvent(emptyObj, 'c2f')).toEqual({});
  });
  it('dispatchEvent c2f', () => {
    const themeState = {
      a: 11,
    };
    const target = new ThemeEventChannelHandle(
      { disabled: true },
      'Widget',
      themeState,
    );

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );
    mock.mockFunction('getExistEvent').returned({
      hover: true,
      active: true,
    });

    const emit = mock.mockFunction('emit');
    emit.returned(true);
    const eventNames = ['hover', 'active'];
    const res = target.dispatchEvent(eventNames, 'c2f');
    const data = { type: 'hover', val: 11 };
    expect(res.fatherEmit('hover', data)).toBeTruthy();
    expect(res.fatherEmit('aaa', data)).toBeFalsy();

    order.verify(param => {
      const { handle } = param;
      handle.getExistEvent(eventNames);
      handle.emit('hover', data);
    });
  });
  it('dispatchEvent f2c', () => {
    const themeState = {
      a: 11,
    };
    const target = new ThemeEventChannelHandle(
      { disabled: true },
      'Widget',
      themeState,
    );

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );
    mock.mockFunction('getExistEvent').returned({
      hover: true,
      active: true,
    });

    const on = mock.mockFunction('on');
    const unOn = () => 1;
    on.returned(unOn);
    const eventNames = ['hover', 'active'];
    const res = target.dispatchEvent(eventNames, 'f2c');
    const cb = () => 111;
    expect(res.fatherOn('hover', cb)).toBe(unOn);
    expect(res.fatherOn('aaa', cb)).toBeUndefined();

    order.verify(param => {
      const { handle } = param;
      handle.getExistEvent(eventNames);
      handle.on('hover', cb);
    });
  });

  it('getExistEvent', () => {
    const themeState = {
      a: 11,
    };
    const target = new ThemeEventChannelHandle(
      { disabled: true },
      'Widget',
      themeState,
    );
    expect(target.getExistEvent(['a', 'b', 'c'])).toEqual({
      a: true,
      b: true,
      c: true,
    });
    expect(target.getExistEvent([])).toEqual({});
  });

  it('createParseEventName', () => {
    const themeState = {
      a: 11,
    };
    const target = new ThemeEventChannelHandle(
      { disabled: true },
      'Widget',
      themeState,
    );
    expect(target.createParseEventName()('lgx')).toBe('p0:lgx');
    expect(target.createParseEventName()('lgx')).toBe('p1:lgx');
  });
  it('createEventChannel empty eventNames', () => {
    const themeState = {
      a: 11,
    };
    const target = new ThemeEventChannelHandle(
      { disabled: true },
      'Widget',
      themeState,
    );
    expect(target.createEventChannel([])).toEqual({});
    expect(target.createEventChannel(emptyObj)).toEqual({});
  });
  it('createEventChannel', () => {
    const themeState = {
      a: 11,
    };
    const target = new ThemeEventChannelHandle(
      { disabled: true },
      'Widget',
      themeState,
    );

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );
    mock.mockFunction('getExistEvent').returned({
      hover: true,
      active: true,
    });

    const emit = mock.mockFunction('emit');
    emit.returned(true);

    const on = mock.mockFunction('on');
    on.returned(true);

    const createParseEventName = mock.mockFunction('createParseEventName');
    createParseEventName.forever(name => {
      return 'abc' + name;
    });

    const eventNames = ['hover', 'active'];
    const { provider, consumer } = target.createEventChannel(eventNames);
    const data = { type: 'hover', val: 11 };
    expect(provider.lugiaProvider('hover', data)).toBeTruthy();
    expect(provider.lugiaProvider('sdfsafsa', data)).toBeFalsy();

    const cb = () => 'hello';
    expect(consumer.__consumer('hover', cb)).toBeTruthy();
    expect(consumer.__consumer('sdfsafsa', cb)).toBeFalsy();

    order.verify(param => {
      const { handle } = param;
      handle.getExistEvent(eventNames);
      handle.createParseEventName();
      handle.emit('abchover', data);
      handle.on('abchover', VerifyOrder.Function);
    });
  });
  it('createEventChannel for real', () => {
    const themeState = {
      a: 11,
    };
    const target = new ThemeEventChannelHandle(
      { disabled: true },
      'Widget',
      themeState,
    );

    const eventNames = ['hover', 'active'];
    const { provider, consumer } = target.createEventChannel(eventNames);
    const data = { type: 'hover', val: 11 };
    const params = [];
    consumer.__consumer('hover', param => {
      params.push(param);
    });
    consumer.__consumer('hover', param => {
      params.push(param);
    });
    provider.lugiaProvider('hover', data);
    expect(params).toEqual([data, data]);
  });
});
