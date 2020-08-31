/**
 *
 * create by ligx
 *
 * @flow
 */

import HistoryQueue from './HistoryQueue';
import IndexDB from '@lugia/indexdb';

import Debug from 'debug';
import { AnyObject, HistoryConfig, Store } from './type';

const debug = Debug('lugiax:history ');

export default class History {
  store: Store;
  queue: HistoryQueue<string>;

  throttle: number;
  tableName: string;
  sleep: boolean;

  constructor(config: HistoryConfig, store: IndexDB) {
    this.store = store;
    this.queue = new HistoryQueue(config);
    this.sleep = false;
    this.tableName = config.tableName;
    this.throttle = 0;
  }

  addThrottle(data: AnyObject, time: number = 100) {
    if (this.sleep) {
      return;
    }
    if (this.throttle) {
      clearTimeout(this.throttle);
      this.throttle = 0;
    }

    this.throttle = setTimeout(
      () => {
        this.add(data);
      },
      time ? time : 100,
    );
  }
  private toSleep() {
    this.sleep = true;
  }

  private toRaise() {
    this.sleep = false;
  }

  async doInSleep(
    doBusiness: () => Promise<any>,
    success?: () => Promise<any>,
  ) {
    try {
      this.toSleep();
      if (doBusiness) {
        await doBusiness();
      }
      this.toRaise();
      if (success) {
        await success();
      }
    } finally {
      this.toRaise();
    }
  }

  equalTo(history: History) {
    if (!history) {
      return false;
    }
    return history.queue.stackCount === this.queue.stackCount;
  }

  async add(data: AnyObject) {
    if (this.sleep) {
      return;
    }

    const id = await this.store.save(this.tableName, { data });
    const delTarget = this.queue.add(id);
    if (delTarget) {
      await this.store.del(this.tableName, delTarget);
    }
    debug('id: %s, delTarget: %s, file = %o ', id, delTarget, data);
  }

  async undo() {
    const id = this.queue.undo();
    debug('undo for id:  %s', id);
    return this.get(id);
  }

  async redo() {
    const id = this.queue.redo();
    debug('redo for id:  %s', id);
    return this.get(id);
  }

  async get(id: string | undefined) {
    if (!id) {
      return;
    }
    const res = await this.store.get(this.tableName, id);
    if (!res) {
      return;
    }
    const { data } = res;
    debug('reload id: %s, file = %o', id, data);
    return data;
  }

  clean() {
    this.store.clean();
  }
}
