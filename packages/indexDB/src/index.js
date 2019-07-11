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
  version: number;
  dataBaseName: string;

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
    this.dataBaseName = dataBaseName;

    this.version = version;
    request.onerror = () => {
      console.error(`打开数据库报错 [${dataBaseName}@${version}]`);
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
        console.log(`清空${tableName}表成功`);
      };
      req.onerror = () => {
        console.error(`清空${tableName}表失败`);
      };
    }
  }

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
        const idxReq = req.createIndex(`${tableName}.${field}`, field, option);

        idxReq.onsuccess = () => {
          console.log(`创建表索引${tableName}.${field}成功`);
          this.emit(tableName, { db });
        };

        idxReq.onerror = () => {
          console.error(`创建表${tableName}.${field}失败`);
        };
      });
    }

    req.onsuccess = () => {
      console.log(`创建表${tableName}成功`);
      this.emit(tableName, { db });
    };

    req.onerror = () => {
      console.error(`创建表${tableName}失败`);
    };
  }

  async getIndex(tableName: string, field: string): Promise<Object> {
    const store = await this.getDBObjectStore(tableName, 'readonly');
    const idbIndex = store.index(field);
    if (!idbIndex) {
      return null;
    }
    return {
      async get(key: string) {
        return new Promise((res, reject) => {
          const req = idbIndex.get(key);
          req.onsuccess = function(e) {
            const result = e.target.result;
            if (result) {
              return res(result);
            }
          };
          req.onerror = () => {
            reject();
          };
        });
      },
    };
  }

  updateDb(event: Object) {
    console.log(`打开数据库成功 [${this.dataBaseName}@${this.version}]`);
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
    const store = await this.getDBObjectStore(tableName, 'readwrite');
    const req = store.add({ id, ...target });

    return new Promise(res => {
      req.onsuccess = event => {
        res(id);
        console.log(
          `${tableName} ${target} 新增记录成功，id = ${event.target.result}`,
        );
      };

      req.onerror = function() {
        console.error(`${tableName} ${target} 新增记录失败`);
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
    const store = await this.getDBObjectStore(tableName, 'readwrite');
    const req = store.put({ id, ...target });

    return new Promise(res => {
      req.onsuccess = event => {
        res(id);
        console.log(
          `${tableName} ${target} 更新记录成功，id = ${event.target.result}`,
        );
      };
      req.onerror = function() {
        console.error(`${tableName} ${target} 更新记录失败`);
        res('');
      };
    });
  }

  async getDBObjectStore(
    tableName: string,
    mode: 'readonly' | 'readwrite' | 'versionchange',
  ): Promise<IDBObjectStore> {
    const db = await this.getDbWaitTable(tableName);
    return Promise.resolve(
      db.transaction([tableName], mode).objectStore(tableName),
    );
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
    const store = await this.getDBObjectStore(tableName, 'readonly');
    const request = store.get(id);

    return new Promise(res => {
      request.onsuccess = event => {
        console.log(`${tableName} ${id} 数据获取成功`);
        res(event.target.result);
      };

      request.onerror = function() {
        console.error(`${tableName} ${id} 数据获取失败`);
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
    const store = await this.getDBObjectStore(tableName, 'readwrite');
    const req = store.delete(id);

    return new Promise(res => {
      req.onsuccess = () => {
        console.log(`${tableName} ${id} 数据删除成功`);
        res(true);
      };

      req.onerror = function() {
        console.error(`${tableName} ${id} 数据删除失败`);
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
