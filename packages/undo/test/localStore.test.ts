/**
 *
 * create by ligx
 *
 * @flow
 */
import { now } from '@lugia/unique';
import LocalStore from '../src/LocalStore';
import { AnyObject } from '../src/type';

describe('LocalStore', () => {
  it('init', () => {
    const obj = {};
    const store = new LocalStore(obj);
    expect(store.db).toBe(obj);
    expect(store.isSameDB({})).toBeFalsy();
    expect(store.isSameDB(obj)).toBeTruthy();
  });

  it('unique', () => {
    const obj = {};
    const store: AnyObject = new LocalStore(obj);
    expect(store.unique.rand).toBe(now);
  });

  it('save get del', () => {
    const obj: AnyObject = {};
    const store = new LocalStore(obj);
    const data = { a: 'hello', b: 'world' };
    const id: string = store.save(data);
    expect(obj[id]).toBe(JSON.stringify(data));
    expect(store.get(id)).toEqual(data);
    expect(store.existId[id]).toBeTruthy();
    expect(store.del(id)).toBeTruthy();
    expect(store.existId[id]).toBeUndefined();
    expect(store.get(id)).toBeUndefined();
  });
  it('save getAnddel', () => {
    const obj: AnyObject = {};
    const store = new LocalStore(obj);
    const data = { a: 'hello', b: 'world' };
    const id = store.save(data);
    expect(obj[id]).toBe(JSON.stringify(data));
    expect(store.getAndDel(id)).toEqual(data);
    expect(store.get(id)).toBeUndefined();
  });

  it('clean', () => {
    const obj: AnyObject = {};
    const store = new LocalStore(obj);
    const a = { a: 'hello', b: 'world' };
    const b = { a: 'hello', b: 'world' };
    const c = { a: 'hello', b: 'world' };
    const idA = store.save(a);
    const idB = store.save(b);
    const idC = store.save(c);

    expect(obj).toEqual({
      [idA]: JSON.stringify(a),
      [idB]: JSON.stringify(b),
      [idC]: JSON.stringify(c),
    });
    expect(store.existId[idA]).toBeTruthy();
    expect(store.existId[idB]).toBeTruthy();
    expect(store.existId[idC]).toBeTruthy();

    expect(obj).toBe(store.db);
    store.clean();
    expect(obj).toBe(store.db);
    expect(obj).toEqual({});
  });
});
