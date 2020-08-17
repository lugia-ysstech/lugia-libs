/**
 *
 * create by ligx
 *
 * @flow
 */
import Unique, { now } from '@lugia/unique';
import { AnyObject } from './type';

export default class LocalStore {
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

  save(target: AnyObject): string {
    const id = this.unique.getNext();
    this.db[id] = JSON.stringify(target);
    this.existId[id] = true;
    return id;
  }

  get(id: string): AnyObject | undefined {
    const val = this.db[id];
    if (val === undefined) {
      return undefined;
    }
    return JSON.parse(val);
  }

  getAndDel(id: string): AnyObject | undefined {
    const res = this.get(id);
    this.del(id);
    return res;
  }

  del(id: string): boolean {
    delete this.existId[id];
    return delete this.db[id];
  }

  clean(): void {
    const ids = Object.keys(this.existId);
    const doDel = (id: string) => this.del(id);
    ids.forEach(doDel);
    Object.keys(this.db)
      .filter((id: string) => id && id.startsWith(this.tableName))
      .forEach(doDel);
  }

  isSameDB(target: AnyObject): boolean {
    return target === this.db;
  }
}
