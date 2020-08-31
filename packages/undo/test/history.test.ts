/**
 *
 * create by ligx
 *
 * @flow
 */
import History from '../src';
import { AnyObject } from '../src/type';

const tableName = 'history';

// @ts-ignore
import { mockObject, VerifyOrder, VerifyOrderConfig } from '@lugia/jverify';
import LocalStore from './LocalStore';
export function getIndexDB(): any {
  return {
    clean() {},
  };
}
describe('History', () => {
  it('init', () => {
    const config = {
      stackCount: 5,
      tableName,
    };
    const db = getIndexDB();
    const history = new History(config, db);
    expect(history.queue.stackCount).toBe(5);
    expect(history.store).toBe(db);
  });

  it('clean', () => {
    const config = {
      stackCount: 5,
      tableName,
    };

    const db = getIndexDB();
    const history = new History(config, db);
    const order = VerifyOrder.create();
    const mockStore = mockObject.create(
      history.store,
      VerifyOrderConfig.create('store', order),
    );
    mockStore.mockFunction('clean');
    history.clean();
    order.verify((param: AnyObject) => {
      const { store } = param;
      store.clean();
    });
  });

  it('add', async () => {
    const config = {
      stackCount: 5,
      tableName,
    };
    const db = getIndexDB();
    const history = new History(config, db);
    const order = VerifyOrder.create();

    const id = 'hello';
    const mockStore = mockObject.create(
      history.store,
      VerifyOrderConfig.create('store', order),
    );
    mockStore.mockFunction('save').returned(id);

    const mockQueue = mockObject.create(
      history.queue,
      VerifyOrderConfig.create('queue', order),
    );
    mockQueue.mockFunction('add');

    const data = { data: 'hello my baby' };
    await history.add(data);

    order.verify((param: AnyObject) => {
      const { store, queue } = param;
      store.save('history', { data });
      queue.add(id);
    });
  });
  it('add queue.add has del', async () => {
    const config = {
      stackCount: 5,
      tableName,
    };
    const db = getIndexDB();
    const history = new History(config, db);
    const order = VerifyOrder.create();

    const id = 'hello';
    const mockStore = mockObject.create(
      history.store,
      VerifyOrderConfig.create('store', order),
    );
    mockStore.mockFunction('save').returned(id);
    mockStore.mockFunction('del').returned(true);

    const mockQueue = mockObject.create(
      history.queue,
      VerifyOrderConfig.create('queue', order),
    );
    const delTargetId = 'helloA';
    mockQueue.mockFunction('add').returned(delTargetId);

    const data = { data: 'hello my baby' };
    await history.add(data);

    order.verify((param: AnyObject) => {
      const { store, queue } = param;
      store.save('history', { data });
      queue.add(id);
      store.del('history', delTargetId);
    });
  });

  it('undo', async () => {
    const config = {
      stackCount: 5,
      tableName,
    };
    const db = getIndexDB();
    const history = new History(config, db);
    const order = VerifyOrder.create();

    const data = { data: 'hello my baby' };
    const id = 'hello';
    const mockStore = mockObject.create(
      history.store,
      VerifyOrderConfig.create('store', order),
    );
    mockStore.mockFunction('get').returned(data);

    const mockQueue = mockObject.create(
      history.queue,
      VerifyOrderConfig.create('queue', order),
    );
    mockQueue.mockFunction('undo').returned(id);

    expect(await history.undo()).toBe('hello my baby');

    order.verify((param: AnyObject) => {
      const { store, queue } = param;
      queue.undo();
      store.get('history', id);
    });
  });
  it('redo', async () => {
    const config = {
      stackCount: 5,
      tableName,
    };
    const db = getIndexDB();
    const history = new History(config, db);
    const order = VerifyOrder.create();

    const data = { data: 'hello my baby' };
    const id = 'hello';
    const mockStore = mockObject.create(
      history.store,
      VerifyOrderConfig.create('store', order),
    );
    mockStore.mockFunction('get').returned(data);

    const mockQueue = mockObject.create(
      history.queue,
      VerifyOrderConfig.create('queue', order),
    );
    mockQueue.mockFunction('redo').returned(id);

    expect(await history.redo()).toBe('hello my baby');

    order.verify((param: AnyObject) => {
      const { store, queue } = param;
      queue.redo();
      store.get('history', id);
    });
  });
  it('get', async () => {
    const config = {
      stackCount: 5,
      tableName,
    };
    const db = getIndexDB();
    const history = new History(config, db);
    const order = VerifyOrder.create();

    const data = { data: 'hello my baby' };
    const id = 'hello';
    const mockStore = mockObject.create(
      history.store,
      VerifyOrderConfig.create('store', order),
    );
    mockStore.mockFunction('get').returned(data);

    expect(await history.get(id)).toBe('hello my baby');

    order.verify((param: AnyObject) => {
      const { store, queue } = param;
      store.get('history', id);
    });
  });

  it('toSleep', async () => {
    const config = {
      stackCount: 15,
      tableName,
    };
    const db: any = new LocalStore({});
    const history = new History(config, db);
    await history.add({ id: 1 });
    await history.doInSleep(
      async () => {
        await history.add({ id: 2 });
        await history.add({ id: 3 });
        await history.add({ id: 4 });
      },
      async () => {
        await history.add({ id: 2 });
      },
    );

    expect(await history.undo()).toEqual({
      id: 1,
    });
  });
  it('toSleep for not doSave', async () => {
    const config = {
      stackCount: 15,
      tableName,
    };
    const db: any = new LocalStore({});
    const history = new History(config, db);
    await history.add({ id: 1 });
    await history.doInSleep(
      async () => {
        await history.add({ id: 2 });
        await history.add({ id: 3 });
        await history.add({ id: 4 });
      },
      async () => {},
    );

    expect(await history.undo()).toBeUndefined();
  });
  it('Not toSleep', async () => {
    const config = {
      stackCount: 15,
      tableName,
    };
    const db: any = new LocalStore({});
    const history = new History(config, db);
    await history.add({ id: 1 });
    await history.add({ id: 2 });
    await history.add({ id: 3 });
    await history.add({ id: 4 });

    expect(await history.undo()).toEqual({
      id: 3,
    });
  });

  it('toSleep has exception', async () => {
    const config = {
      stackCount: 15,
      tableName,
    };
    const db: any = new LocalStore({});
    const history = new History(config, db);
    await history.add({ id: 1 });
    try {
      await history.doInSleep(
        async () => {
          await history.add({ id: 2 });
          await history.add({ id: 3 });
          await history.add({ id: 4 });
          throw new Error('Is a error');
        },
        async () => {
          await history.add({ id: 2 });
        },
      );
    } catch (err) {}

    await history.add({ id: 2 });

    expect(await history.undo()).toEqual({
      id: 1,
    });
  });
});
