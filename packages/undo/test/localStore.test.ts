/**
 *
 * create by ligx
 *
 * @flow
 */
import { now } from '@lugia/unique';
import LocalStore from './LocalStore';
import { AnyObject } from '../src/type';

describe('LocalStore', () => {
  const tableName = 'ligx';
  it('init', () => {
    const obj = {};
    const store = new LocalStore(obj);
    expect(store.db).toBe(obj);
    expect(store.isSameDB({})).toBeFalsy();
    expect(store.isSameDB(obj)).toBeTruthy();
  });

  it('unique', async () => {
    const obj = {};
    const store: AnyObject = new LocalStore(obj);
    expect(store.unique.rand).toBe(now);
  });

  it('save get del', async () => {
    const obj: AnyObject = {};
    const store = new LocalStore(obj);
    const data = { a: 'hello', b: 'world' };
    const id: string = await store.save(tableName, data);
    expect(obj[id]).toBe(JSON.stringify(data));
    expect(await store.get(tableName, id)).toEqual(data);
    expect(store.existId[id]).toBeTruthy();
    expect(await store.del(tableName, id)).toBeTruthy();
    expect(store.existId[id]).toBeUndefined();
    expect(await store.get(tableName, id)).toBeUndefined();
  });
  it('save getAnddel', async () => {
    const obj: AnyObject = {};
    const store = new LocalStore(obj);
    const data = { a: 'hello', b: 'world' };
    const id = await store.save(tableName, data);
    expect(obj[id]).toBe(JSON.stringify(data));
    expect(await store.getAndDel(tableName, id)).toEqual(data);
    expect(await store.get(tableName, id)).toBeUndefined();
  });

  it('clean', async () => {
    const obj: AnyObject = {};
    const store = new LocalStore(obj);
    const a = { a: 'hello', b: 'world' };
    const b = { a: 'hello', b: 'world' };
    const c = { a: 'hello', b: 'world' };
    const idA = await store.save(tableName, a);
    const idB = await store.save(tableName, b);
    const idC = await store.save(tableName, c);

    expect(obj).toEqual({
      [idA]: JSON.stringify(a),
      [idB]: JSON.stringify(b),
      [idC]: JSON.stringify(c),
    });
    expect(store.existId[idA]).toBeTruthy();
    expect(store.existId[idB]).toBeTruthy();
    expect(store.existId[idC]).toBeTruthy();

    expect(obj).toBe(store.db);
    await store.clean();
    expect(obj).toBe(store.db);
    expect(obj).toEqual({});
  });
});
