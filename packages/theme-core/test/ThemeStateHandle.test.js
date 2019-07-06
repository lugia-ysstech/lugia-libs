/**
 *
 * create by wcx
 *
 * @flow
 */
import 'jest-styled-components';
import ThemeStateHandle from '../src/ThemeStateHandle';

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
});
