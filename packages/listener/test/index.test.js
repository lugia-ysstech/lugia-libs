/**
 *
 * create by ligx
 *
 * @flow
 */

import Listener from '../src/index';

describe('Listener', () => {
  it('removeListener click', async () => {
    let call = false;
    const cb = () => {
      call = true;
    };
    const mouseEventObj = {
      buttons: 1,
    };
    const listener = new Listener();
    const eventName = 'click';
    const res = listener.on(eventName, cb);
    res.removeListener();
    listener.emit(eventName, mouseEventObj);
    expect(call).toBeFalsy();
  });

  it('removeListener hello', async () => {
    let call = false;
    const cb = () => {
      call = true;
    };
    const mouseEventObj = {
      buttons: 1,
    };
    const listener = new Listener();
    const eventName = 'hello';
    const res = listener.on(eventName, cb);
    res.removeListener();
    listener.emit(eventName, mouseEventObj);
    expect(call).toBeFalsy();
  });

  it('on hello', async () => {
    let cb = () => {};

    const callPromise = new Promise(res => {
      cb = data => {
        res(data);
      };
    });
    const mouseEventObj = {
      buttons: 1,
    };
    const listener = new Listener();
    const eventName = 'hello';
    listener.on(eventName, cb);
    listener.emit(eventName, mouseEventObj);
    expect(await callPromise).toBe(mouseEventObj);
  });

  it('on click', async () => {
    let cb = () => {};

    const callPromise = new Promise(res => {
      cb = data => {
        res(data);
      };
    });
    const mouseEventObj = {
      buttons: 1,
    };
    const listener = new Listener();
    const eventName = 'click';
    listener.on(eventName, cb);
    listener.emit(eventName, mouseEventObj);
    expect(await callPromise).toBe(mouseEventObj);
  });

  it('delegate', async () => {
    let cb = () => {};

    const callPromise = new Promise(res => {
      cb = data => {
        res(data);
      };
    });
    const mouseEventObj = {
      buttons: 1,
    };
    const listener = new Listener();
    const delegate = new Listener();
    const eventName = 'click';
    delegate.on(eventName, cb);
    const res = delegate.delegate(eventName, listener);
    expect(res.removeListener).not.toBeNull();
    expect(res.removeListener).not.toBeUndefined();
    listener.emit(eventName, mouseEventObj);
    expect(await callPromise).toBe(mouseEventObj);
  });

  it('takeEventData', async () => {
    const listener = new Listener();
    const mouseEventObj = {
      buttons: 1,
      clientX: 1,
      clientY: 2,
    };
    const interval = setInterval(() => {
      listener.emit('moving', {
        clientX: mouseEventObj.clientX,
        clientY: mouseEventObj.clientY,
      });
    }, 200);
    const data = await listener.takeEventData('moving', 1050);
    clearInterval(interval);
    expect(data).toEqual([
      {
        clientX: 1,
        clientY: 2,
      },
      {
        clientX: 1,
        clientY: 2,
      },
      {
        clientX: 1,
        clientY: 2,
      },
      {
        clientX: 1,
        clientY: 2,
      },
      {
        clientX: 1,
        clientY: 2,
      },
    ]);
  });
});
