/**
 *
 * create by ligx
 *
 * @flow
 */
import Unique, { now } from '@lugia/unique';
import { AnyObject, Store } from '../src/type';

export default class LocalStore implements Store {
  db: AnyObject;
  unique: Unique;
  existId: { [id: string]: boolean };
  tableName: string;

  constructor(db: AnyObject, tableName: string = '__lugia_undo_history') {
    this.db = db;
    this.tableName = tableName;
    this.unique = new Unique(0, tableName, now);
    this.existId = {};
  }

  async save(tableName: string, target: AnyObject): Promise<string> {
    const id = this.unique.getNext();
    this.db[id] = JSON.stringify(target);
    this.existId[id] = true;
    return id;
  }

  async get(tableName: string, id: string): Promise<AnyObject | undefined> {
    const val = this.db[id];
    if (val === undefined) {
      return undefined;
    }
    return JSON.parse(val);
  }

  async getAndDel(
    tableName: string,
    id: string,
  ): Promise<AnyObject | undefined> {
    const res = this.get(tableName, id);
    await this.del(tableName, id);
    return res;
  }

  async del(tableName: string, id: string): Promise<boolean> {
    delete this.existId[id];
    return delete this.db[id];
  }

  clean(): void {
    const ids = Object.keys(this.existId);
    const doDel = (id: string) => this.del(this.tableName, id);
    ids.forEach(doDel);
    Object.keys(this.db)
      .filter((id: string) => id && id.startsWith(this.tableName))
      .forEach(doDel);
  }

  isSameDB(target: AnyObject): boolean {
    return target === this.db;
  }
}
