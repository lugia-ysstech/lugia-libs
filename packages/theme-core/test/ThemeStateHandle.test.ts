/**
 *
 * create by wcx
 *
 * @flow
 */
import ThemeStateHandle from '../src/ThemeStateHandle';

import { mockObject, VerifyOrder, VerifyOrderConfig } from '@lugia/jverify';

async function delay(time: number) {
  return new Promise(res => {
    setTimeout(() => {
      res(true);
    }, time);
  });
}
describe('ThemeStateHandle.test.js', () => {
  it('getEventId', () => {
    const themeState = {};
    const props = {};
    const themeStateHandle = new ThemeStateHandle(props, 'Widget', themeState);
    expect(themeStateHandle.getEventId()).toBe(0);
    expect(themeStateHandle.getEventId()).toBe(1);
  });

  it('on & emit', async () => {
    const themeState = {};
    const props = {};
    const themeStateHandle = new ThemeStateHandle(props, 'Widget', themeState);

    const helloPromise = new Promise(res => {
      themeStateHandle.on('hello', param => {
        res(param);
      });
    });

    const param = { type: 'abc', i: 155 };
    themeStateHandle.emit('hello', param);
    expect(await helloPromise).toBe(param);
  });
  it('on & emit lugiaConsumers', async () => {
    const themeState = {};
    const consumers = [];
    const props = {
      lugiaConsumers: [
        {
          __consumer(name, cb) {
            consumers.push(name);
            consumers.push(cb);
          },
        },
        {
          __consumer(name, cb) {
            consumers.push(name);
            consumers.push(cb);
          },
        },
      ],
    };
    const themeStateHandle = new ThemeStateHandle(props, 'Widget', themeState);

    let cb;
    const helloPromise = new Promise(res => {
      cb = param => {
        res(param);
      };
      themeStateHandle.on('hello', cb);
    });

    const param = { type: 'abc', i: 155 };
    themeStateHandle.emit('hello', param);
    expect(await helloPromise).toBe(param);
    expect(consumers).toEqual(['hello', cb, 'hello', cb]);
  });
  it('on & emit lugiaConsumers is object', async () => {
    const themeState = {};
    const consumers = [];
    const props = {
      lugiaConsumers: {
        __consumer(name, cb) {
          consumers.push(name);
          consumers.push(cb);
        },
      },
    };
    const themeStateHandle = new ThemeStateHandle(props, 'Widget', themeState);

    let cb;
    const helloPromise = new Promise(res => {
      cb = param => {
        res(param);
      };
      themeStateHandle.on('hello', cb);
    });

    const param = { type: 'abc', i: 155 };
    themeStateHandle.emit('hello', param);
    expect(await helloPromise).toBe(param);
    expect(consumers).toEqual(['hello', cb]);
  });

  it('on & emit twice', async () => {
    const themeState = {};
    const props = {};
    const themeStateHandle = new ThemeStateHandle(props, 'Widget', themeState);

    const helloPromise = new Promise(res => {
      themeStateHandle.on('hello', param => {
        res(param.type + 'a');
      });
    });
    const helloBPromise = new Promise(res => {
      themeStateHandle.on('hello', param => {
        res(param.i + 'b');
      });
    });

    const param = { type: 'abc', i: 155 };
    themeStateHandle.emit('hello', param);
    expect(await Promise.all([helloPromise, helloBPromise])).toEqual([
      'abca',
      '155b',
    ]);
  });

  it('on & emit fatherOn is not exist', async () => {
    const themeState = {};
    const props = {
      fatherOn() {
        return false;
      },
    };
    const themeStateHandle = new ThemeStateHandle(props, 'Widget', themeState);

    const helloPromise = new Promise(res => {
      themeStateHandle.on('hello', param => {
        res(param);
      });
    });

    const param = { type: 'abc', i: 155 };
    themeStateHandle.emit('hello', param);
    expect(await helloPromise).toBe(param);
  });

  it('on & emit fatherOn is  exist', async () => {
    const themeState = {};
    const props = {
      fatherOn() {
        return true;
      },
    };
    const themeStateHandle = new ThemeStateHandle(props, 'Widget', themeState);

    themeStateHandle.on('hello', param => {
      throw new Error('不能触发事件');
    });

    const param = { type: 'abc', i: 155 };
    themeStateHandle.emit('hello', param);
  });

  it('on & emit unOn', async () => {
    const themeState = {};
    const props = {};
    const themeStateHandle = new ThemeStateHandle(props, 'Widget', themeState);

    const event = themeStateHandle.on('hello', param => {
      throw new Error('不能触发事件');
    });
    event();
    const param = { type: 'abc', i: 155 };
    themeStateHandle.emit('hello', param);
  });
  it('getThemeState', async () => {
    const themeState = {
      active: true,
    };
    const themeStateHandle = new ThemeStateHandle({}, 'Widget', themeState);

    expect(themeStateHandle.getThemeState()).toEqual({
      active: true,
      disabled: false,
    });
    expect(
      new ThemeStateHandle(
        { themeState: { active: false, hover: true } },
        'Widget',
        {
          active: true,
          hover: false,
        },
      ).getThemeState(),
    ).toEqual({ active: false, hover: true, disabled: false });
  });

  it('onMouseDown', () => {
    const themeState = {
      active: true,
    };
    const target = new ThemeStateHandle({}, 'Widget', themeState);

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const toggleActiveState = mock.mockFunction('toggleActiveState');
    toggleActiveState.returned(true);
    const rest = ['a', 111, 'b'];
    target.onMouseDown(...rest);
    order.verify(param => {
      const { handle } = param;
      handle.toggleActiveState(true);
    });
  });

  it('onMouseDown props.onMouseDown', () => {
    const themeState = {
      active: true,
    };
    const props = {};
    const target = new ThemeStateHandle(props, 'Widget', themeState);

    const order = VerifyOrder.create();

    const mockProps = mockObject.create(
      props,
      VerifyOrderConfig.create('props', order),
    );

    const onMouseDown = mockProps.mockFunction('onMouseDown');
    onMouseDown.returned(true);

    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const toggleActiveState = mock.mockFunction('toggleActiveState');
    toggleActiveState.returned(true);
    const rest = ['a', 111, 'b'];
    target.onMouseDown(...rest);
    order.verify(param => {
      const { handle, props } = param;
      handle.toggleActiveState(true);
      props.onMouseDown(...rest);
    });
  });

  it('onMouseUp', () => {
    const themeState = {
      active: true,
    };
    const target = new ThemeStateHandle({}, 'Widget', themeState);

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const toggleActiveState = mock.mockFunction('toggleActiveState');
    toggleActiveState.returned(true);
    const rest = ['a', 111, 'b'];
    target.onMouseUp(...rest);
    order.verify(param => {
      const { handle } = param;
      handle.toggleActiveState(false);
    });
  });

  it('onMouseUp props.onMouseUp', () => {
    const themeState = {
      active: true,
    };
    const props = {};
    const target = new ThemeStateHandle(props, 'Widget', themeState);

    const order = VerifyOrder.create();

    const mockProps = mockObject.create(
      props,
      VerifyOrderConfig.create('props', order),
    );

    const onMouseUp = mockProps.mockFunction('onMouseUp');
    onMouseUp.returned(true);

    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const toggleActiveState = mock.mockFunction('toggleActiveState');
    toggleActiveState.returned(true);
    const rest = ['a', 111, 'b'];
    target.onMouseUp(...rest);
    order.verify(param => {
      const { handle, props } = param;
      handle.toggleActiveState(false);
      props.onMouseUp(...rest);
    });
  });

  it('onMouseEnter', () => {
    const themeState = {
      active: true,
    };
    const target = new ThemeStateHandle({}, 'Widget', themeState);

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const toggleHoverState = mock.mockFunction('toggleHoverState');
    toggleHoverState.returned(true);
    const rest = ['a', 111, 'b'];
    target.onMouseEnter(...rest);
    order.verify(param => {
      const { handle } = param;
      handle.toggleHoverState(true);
    });
  });

  it('onMouseEnter props.onMouseEnter', () => {
    const themeState = {
      active: true,
    };
    const props = {};
    const target = new ThemeStateHandle(props, 'Widget', themeState);

    const order = VerifyOrder.create();

    const mockProps = mockObject.create(
      props,
      VerifyOrderConfig.create('props', order),
    );

    const onMouseEnter = mockProps.mockFunction('onMouseEnter');
    onMouseEnter.returned(true);

    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const toggleHoverState = mock.mockFunction('toggleHoverState');
    toggleHoverState.returned(true);
    const rest = ['a', 111, 'b'];
    target.onMouseEnter(...rest);
    order.verify(param => {
      const { handle, props } = param;
      handle.toggleHoverState(true);
      props.onMouseEnter(...rest);
    });
  });

  it('onMouseLeave', () => {
    const themeState = {
      active: true,
    };
    const target = new ThemeStateHandle({}, 'Widget', themeState);

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const toggleHoverState = mock.mockFunction('toggleHoverState');
    toggleHoverState.returned(true);
    const rest = ['a', 111, 'b'];
    target.onMouseLeave(...rest);
    order.verify(param => {
      const { handle } = param;
      handle.toggleHoverState(false);
    });
  });

  it('onMouseLeave props.onMouseLeave', () => {
    const themeState = {
      active: true,
    };
    const props = {};
    const target = new ThemeStateHandle(props, 'Widget', themeState);

    const order = VerifyOrder.create();

    const mockProps = mockObject.create(
      props,
      VerifyOrderConfig.create('props', order),
    );

    const onMouseLeave = mockProps.mockFunction('onMouseLeave');
    onMouseLeave.returned(true);

    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const toggleHoverState = mock.mockFunction('toggleHoverState');
    toggleHoverState.returned(true);
    const rest = ['a', 111, 'b'];
    target.onMouseLeave(...rest);
    order.verify(param => {
      const { handle, props } = param;
      handle.toggleHoverState(false);
      props.onMouseLeave(...rest);
    });
  });

  it('onFocus', async () => {
    const themeState = {
      active: true,
    };
    const target = new ThemeStateHandle({}, 'Widget', themeState);

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const toggleFocusState = mock.mockFunction('toggleFocusState');
    toggleFocusState.returned(true);
    const rest = ['a', 111, 'b'];
    target.onFocus(...rest);
    await delay(1);
    order.verify(param => {
      const { handle } = param;
      handle.toggleFocusState(true);
    });
  });

  it('onFocus props.onFocus', async () => {
    const themeState = {
      active: true,
    };
    const props = {};
    const target = new ThemeStateHandle(props, 'Widget', themeState);

    const order = VerifyOrder.create();

    const mockProps = mockObject.create(
      props,
      VerifyOrderConfig.create('props', order),
    );

    const onFocus = mockProps.mockFunction('onFocus');
    onFocus.returned(true);
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const toggleFocusState = mock.mockFunction('toggleFocusState');
    toggleFocusState.returned(true);
    const rest = ['a', 111, 'b'];
    target.onFocus(...rest);
    await delay(1);
    order.verify(param => {
      const { handle, props } = param;
      props.onFocus(...rest);
      handle.toggleFocusState(true);
    });
  });

  it('onBlur', async () => {
    const themeState = {
      active: true,
    };
    const target = new ThemeStateHandle({}, 'Widget', themeState);

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const toggleFocusState = mock.mockFunction('toggleFocusState');
    toggleFocusState.returned(true);
    const rest = ['a', 111, 'b'];
    target.onBlur(...rest);
    await delay(1);
    order.verify(param => {
      const { handle } = param;
      handle.toggleFocusState(false);
    });
  });

  it('onBlur props.onBlur', async () => {
    const themeState = {
      active: true,
    };
    const props = {};
    const target = new ThemeStateHandle(props, 'Widget', themeState);

    const order = VerifyOrder.create();

    const mockProps = mockObject.create(
      props,
      VerifyOrderConfig.create('props', order),
    );

    const onBlur = mockProps.mockFunction('onBlur');
    onBlur.returned(true);
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const toggleFocusState = mock.mockFunction('toggleFocusState');
    toggleFocusState.returned(true);
    const rest = ['a', 111, 'b'];
    target.onBlur(...rest);
    await delay(1);
    order.verify(param => {
      const { handle, props } = param;
      handle.toggleFocusState(false);
      props.onBlur(...rest);
    });
  });

  it('toggleFocusState', () => {
    const themeState = {
      active: true,
    };
    const target = new ThemeStateHandle({}, 'Widget', themeState);

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    mock.mockFunction('emit');
    expect(target.focus).toBeFalsy();
    target.toggleFocusState(true);
    expect(target.focus).toBeTruthy();
    target.toggleFocusState(false);
    expect(target.focus).toBeFalsy();
    order.verify(param => {
      const { handle } = param;
      handle.emit('focus', { focus: true });
      handle.emit('focus', { focus: false });
    });
  });

  it('toggleFocusState oldValue is false', () => {
    const themeState = {
      active: true,
    };
    const target = new ThemeStateHandle({}, 'Widget', themeState);

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const emit = mock.mockFunction('emit');
    emit.returned(true);
    target.focus = true;
    target.toggleFocusState(true);
    target.focus = false;
    target.toggleFocusState(false);
    order.verify(param => {});
  });

  it('toggleFocusState disabled is true', () => {
    const themeState = {
      active: true,
    };
    const target = new ThemeStateHandle(
      { disabled: true },
      'Widget',
      themeState,
    );

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const emit = mock.mockFunction('emit');
    emit.returned(true);
    target.toggleFocusState(true);
    target.toggleFocusState(false);
    target.toggleFocusState(false);
    target.toggleFocusState(false);
    order.verify(param => {});
  });

  it('toggleActiveState', () => {
    const themeState = {
      active: true,
    };
    const target = new ThemeStateHandle({}, 'Widget', themeState);

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    mock.mockFunction('emit');
    expect(target.active).toBeFalsy();
    target.toggleActiveState(true);
    expect(target.active).toBeTruthy();
    target.toggleActiveState(false);
    expect(target.active).toBeFalsy();
    order.verify(param => {
      const { handle } = param;
      handle.emit('active', { active: true });
      handle.emit('active', { active: false });
    });
  });

  it('toggleActiveState oldValue is false', () => {
    const themeState = {
      active: true,
    };
    const target = new ThemeStateHandle({}, 'Widget', themeState);

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const emit = mock.mockFunction('emit');
    emit.returned(true);
    target.active = true;
    target.toggleActiveState(true);
    target.active = false;
    target.toggleActiveState(false);
    order.verify(param => {});
  });

  it('toggleActiveState disabled is true', () => {
    const themeState = {
      active: true,
    };
    const target = new ThemeStateHandle(
      { disabled: true },
      'Widget',
      themeState,
    );

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const emit = mock.mockFunction('emit');
    emit.returned(true);
    target.toggleActiveState(true);
    target.toggleActiveState(false);
    target.toggleActiveState(false);
    target.toggleActiveState(false);
    order.verify(param => {});
  });

  it('toggleHoverState', () => {
    const themeState = {
      active: true,
    };
    const target = new ThemeStateHandle({}, 'Widget', themeState);

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    mock.mockFunction('emit');
    expect(target.hover).toBeFalsy();
    target.toggleHoverState(true);
    expect(target.hover).toBeTruthy();
    target.toggleHoverState(false);
    expect(target.hover).toBeFalsy();
    order.verify(param => {
      const { handle } = param;
      handle.emit('hover', { hover: true });
      handle.emit('hover', { hover: false });
    });
  });

  it('toggleHoverState oldValue is false', () => {
    const themeState = {
      active: true,
    };
    const target = new ThemeStateHandle({}, 'Widget', themeState);

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const emit = mock.mockFunction('emit');
    emit.returned(true);
    target.hover = true;
    target.toggleHoverState(true);
    target.hover = false;
    target.toggleHoverState(false);
    order.verify(param => {});
  });

  it('toggleHoverState disabled is true', () => {
    const themeState = {
      active: true,
    };
    const target = new ThemeStateHandle(
      { disabled: true },
      'Widget',
      themeState,
    );

    const order = VerifyOrder.create();
    const mock = mockObject.create(
      target,
      VerifyOrderConfig.create('handle', order),
    );

    const emit = mock.mockFunction('emit');
    emit.returned(true);
    target.toggleHoverState(true);
    target.toggleHoverState(false);
    target.toggleHoverState(false);
    target.toggleHoverState(false);
    order.verify(param => {});
  });
});
