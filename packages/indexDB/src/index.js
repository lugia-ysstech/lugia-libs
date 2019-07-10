/**
 *
 * create by ligx
 *
 * @flow
 */
import type {
  IndexDBIndexOption,
  IndexDBIndexOptionItem,
  IndexDBOption,
  Store,
} from '@lugia/indexDB';

import Unique, { now } from '@lugia/unique';
import Listener from '@lugia/listener';

type Field2Index = { [field: string]: IDBIndex };
export default class IndexDB extends Listener<any> implements Store {
  db: Object;
  tableName2Unique: { [tableName: string]: Unique };
  indexOption: IndexDBIndexOption;

  constructor(indexedDB: Object, option: IndexDBOption) {
    super();
    if (!indexedDB) {
      console.error('indexDB不能为空！');
      return;
    }
    if (!option) {
      console.error('option不能为空！');
      return;
    }

    const { tableNames = [], dataBaseName } = option;
    if (!dataBaseName) {
      console.error('数据库实例名称不能为空！');
      return;
    }

    this.tableName2Unique = {};
    const { indexOption = {} } = option;
    this.indexOption = indexOption;
    if (!Array.isArray(tableNames) || tableNames.length === 0) {
      console.warn('为存在要操作的表!');
      return;
    }

    const { generateId = now } = option;
    tableNames.forEach((tableName: string) => {
      this.tableName2Unique[tableName] = new Unique(0, tableName, generateId);
    });

    const { version = 1 } = option;
    const request = indexedDB.open(dataBaseName, version);

    request.onerror = () => {
      console.log('打开数据库报错');
    };

    request.onsuccess = event => {
      this.updateDb(event);
      const { resetDataAfterConnect = false } = option;

      tableNames.forEach((tableName: string) => {
        if (resetDataAfterConnect) {
          if (this.existTable(tableName)) {
            this.truncateTable(tableName);
          }
        }
        const { db } = this;
        this.emit(tableName, { db });
      });
    };

    request.onupgradeneeded = event => {
      this.updateDb(event);
      tableNames.forEach((tableName: string) => {
        this.createTable(tableName);
      });
    };
  }

  createTable(tableName: string) {
    if (!this.existTable(tableName)) {
      this.createObjectStore(tableName);
    }
  }

  existTable(tableName: string) {
    const db = this.getDb();
    return db.objectStoreNames.contains(tableName);
  }

  truncateTable(tableName: string) {
    const db = this.getDb();
    if (db.objectStoreNames.contains(tableName)) {
      const transaction = db.transaction([tableName], 'readwrite');
      const req = transaction.objectStore(tableName).clear();

      req.onsuccess = () => {
        console.info(`清空${tableName}表成功`);
      };
      req.onerror = () => {
        console.info(`清空${tableName}表失败`);
      };
    }
  }

  tableName2Field2Index: { [tableName: string]: Field2Index };

  createObjectStore(tableName: string) {
    const db = this.getDb();
    const req = db.createObjectStore(tableName, {
      keyPath: 'id',
    });
    const createIndexOption = this.indexOption[tableName];

    if (createIndexOption && Array.isArray(createIndexOption)) {
      createIndexOption.forEach((item: IndexDBIndexOptionItem) => {
        const { field, option = {} } = item;
        if (!field) {
          return;
        }
        let field2Index = this.getTableName2Field2Index(tableName);
        field2Index[field] = req.createIndex(tableName, field, option);
      });
    }

    req.onsuccess = () => {
      console.info(`创建表${tableName}成功`);
      this.emit(tableName, { db });
    };

    req.onerror = () => {
      console.info(`创建表${tableName}失败`);
    };
  }

  getTableName2Field2Index(tableName: string): Field2Index {
    let field2Index = this.tableName2Field2Index[tableName];
    if (!field2Index) {
      field2Index = this.tableName2Field2Index[tableName] = {};
    }
    return field2Index;
  }

  getIndex(tableName: string, field: string): ?IDBIndex {
    const field2Index = this.getTableName2Field2Index(tableName);
    return field2Index[field];
  }

  updateDb(event: Object) {
    console.info('打开数据库成功');
    this.db = event.target.result;
    this.emit('connected', { db: this.db });
  }

  getDb() {
    return this.db;
  }

  async save(tableName: string, target: Object): Promise<string> {
    const unique = this.getUnique(tableName);
    if (!unique) {
      console.error(`不存在的表名:${tableName}`);
      return '';
    }
    const id = unique.getNext();
    const db = await this.getDbWaitTable(tableName);
    const request = db
      .transaction([tableName], 'readwrite')
      .objectStore(tableName)
      .add({ id, ...target });

    return new Promise(res => {
      request.onsuccess = event => {
        res(id);
        console.log('新增记录成功，id = ', event.target.result);
      };

      request.onerror = function() {
        console.log('新增记录失败');
        res('');
      };
    });
  }

  async update(tableName: string, target: Object): Promise<string> {
    const unique = this.getUnique(tableName);
    if (!unique) {
      console.error(`不存在的表名:${tableName}`);
      return '';
    }
    const id = unique.getNext();
    const db = await this.getDbWaitTable(tableName);
    const request = db
      .transaction([tableName], 'readwrite')
      .objectStore(tableName)
      .put({ id, ...target });

    return new Promise(res => {
      request.onsuccess = event => {
        res(id);
        console.log('更新记录成功，id = ', event.target.result);
      };
      request.onerror = function() {
        console.log('更新记录失败');
        res('');
      };
    });
  }

  async getDbWaitTable(tableName: string): Promise<Object> {
    const db = this.getDb();
    if (db) {
      return Promise.resolve(db);
    }
    return new Promise(res => {
      const handler = this.once(tableName, data => {
        const { db } = data;
        res(db);
        handler.removeListener();
      });
    });
  }

  async get(tableName: string, id: string): Object {
    const db = await this.getDbWaitTable(tableName);
    const transaction = db.transaction([tableName]);
    const objectStore = transaction.objectStore(tableName);
    const request = objectStore.get(id);

    return new Promise(res => {
      request.onsuccess = event => {
        console.log('数据获取成功');
        res(event.target.result);
      };

      request.onerror = function() {
        console.log('数据获取失败');
        res(undefined);
      };
    });
  }

  async getAndDel(tableName: string, id: string): Promise<Object> {
    const res = await this.get(tableName, id);
    await this.del(tableName, id);
    return res;
  }

  async del(tableName: string, id: string): Promise<boolean> {
    const db = await this.getDbWaitTable(tableName);
    const request = db
      .transaction([tableName], 'readwrite')
      .objectStore(tableName)
      .delete(id);

    return new Promise(res => {
      request.onsuccess = () => {
        console.log('数据删除成功');
        res(true);
      };

      request.onerror = function() {
        console.log('数据删除失败');
        res(false);
      };
    });
  }

  getUnique(tableName: string): ?Unique {
    return this.tableName2Unique[tableName];
  }

  clean(): void {}

  isSameDB(target: Object): boolean {
    return target === this.db;
  }
}
