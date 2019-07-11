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

export default class IndexDB extends Listener<any> implements Store {
  db: Object;
  tableName2Unique: { [tableName: string]: Unique };
  indexOption: IndexDBIndexOption;
  version: number;
  dataBaseName: string;
  tableExist: Object;
  tableNames: string[];

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
    this.tableExist = {};
    const { tableNames = [], dataBaseName } = option;
    if (!dataBaseName) {
      console.error('数据库实例名称不能为空！');
      return;
    }

    this.tableNames = [...tableNames];
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
        const isExist = this.existTable(tableName);
        if (isExist) {
          const { db } = this;
          this.tableExist[tableName] = true;
          this.emit(tableName, { db });
          if (resetDataAfterConnect) {
            this.truncateTable(tableName);
          }
        }
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

  async truncateTable(tableName: string) {
    const unique = this.getUnique(tableName);
    if (!unique) {
      console.error(`不存在的表名:${tableName}`);
      return '';
    }
    const store = await this.getDBObjectStore(tableName, 'readwrite');
    const request = store.clear();
    return this.requestPromise(request, {
      success: `清空${tableName}表成功`,
      error: `清空${tableName}表失败`,
    });
  }

  createObjectStore(tableName: string) {
    const db = this.getDb();
    const req = db.createObjectStore(tableName, {
      keyPath: 'id',
    });

    console.log(`创建表${tableName}成功`);
    const createIndexOption = this.indexOption[tableName];
    if (createIndexOption && Array.isArray(createIndexOption)) {
      createIndexOption.forEach((item: IndexDBIndexOptionItem) => {
        const { field, option = {} } = item;
        if (!field) {
          return;
        }
        const indexName = this.getIndexName(tableName, field);
        req.createIndex(indexName, field, option);
        console.log(`创建表索引${indexName}成功`);
      });
    }
  }

  getIndexName(tableName: string, field: string): string {
    return `${tableName}.${field}`;
  }

  async getIndex(tableName: string, field: string): Promise<Object> {
    const unique = this.getUnique(tableName);
    if (!unique) {
      console.error(`不存在的表名:${tableName}`);
      return {};
    }
    return {
      get: async (key: string) => {
        const idbIndex = await this.getDBIndex(tableName, field);
        if (!idbIndex) {
          return null;
        }
        const request = idbIndex.get(key);
        const msg = `${tableName}.${field} 查找 ${key}`;
        return this.requestPromise(request, {
          success: msg,
          error: msg,
        });
      },
      getAll: async () => {
        const idbIndex = await this.getDBIndex(tableName, field);
        if (!idbIndex) {
          return null;
        }
        const request = idbIndex.getAll();
        const msg = `${tableName}.${field} 查找全部`;
        return this.requestPromise(request, {
          success: msg,
          error: msg,
        });
      },
      getAllKeys: async () => {
        const idbIndex = await this.getDBIndex(tableName, field);
        if (!idbIndex) {
          return null;
        }
        const request = idbIndex.getAllKeys();
        const msg = `${tableName}.${field} 查找全部主键`;
        return this.requestPromise(request, {
          success: msg,
          error: msg,
        });
      },
      count: async () => {
        const idbIndex = await this.getDBIndex(tableName, field);
        if (!idbIndex) {
          return null;
        }
        const request = idbIndex.count();
        const msg = `${tableName}.${field} 统计`;
        return this.requestPromise(request, {
          success: msg,
          error: msg,
        });
      },
    };
  }

  async getDBIndex(tableName: string, field: string): Promise<Object> {
    const store = await this.getDBObjectStore(tableName, 'readonly');
    return store.index(this.getIndexName(tableName, field));
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

    const request = store.add({ id, ...target });
    return this.requestPromise(request, {
      success: `${tableName} ${id} ${JSON.stringify(target)} 新增记录`,
      error: `${tableName} ${target} 新增记录`,
    });
  }

  async update(tableName: string, id: string, target: Object): Promise<string> {
    const unique = this.getUnique(tableName);
    if (!unique) {
      console.error(`不存在的表名:${tableName}`);
      return '';
    }
    const store = await this.getDBObjectStore(tableName, 'readwrite');
    const request = store.put({ id, ...target });
    const msg = `${tableName} ${target} 更新记录 id =${id}`;
    return this.requestPromise(request, {
      success: msg,
      error: msg,
    });
  }

  async getDBObjectStore(
    tableName: string,
    mode: 'readonly' | 'readwrite' | 'versionchange',
  ): Promise<Object> {
    const db = await this.getDbWaitTable(tableName);
    const transaction = db.transaction([tableName], mode);
    return transaction.objectStore(tableName);
  }

  async getDbWaitTable(tableName: string): Promise<Object> {
    const db = this.getDb();
    if (db && this.tableExist[tableName]) {
      return Promise.resolve(db);
    }
    return new Promise(res => {
      const handler = this.once(tableName, data => {
        const { db } = data;
        this.tableExist[tableName] = true;
        res(db);
        handler.removeListener();
      });
    });
  }

  async getAll(tableName: string): Promise<Object[]> {
    const unique = this.getUnique(tableName);
    if (!unique) {
      console.error(`不存在的表名:${tableName}`);
      return [];
    }
    const store = await this.getDBObjectStore(tableName, 'readonly');
    const req = store.getAll();
    const msg = `获取[${tableName}]全部数据`;
    return this.requestPromise(req, {
      success: msg,
      error: msg,
    });
  }

  async getAllKeys(tableName: string): Promise<string[]> {
    const unique = this.getUnique(tableName);
    if (!unique) {
      console.error(`不存在的表名:${tableName}`);
      return [];
    }
    const store = await this.getDBObjectStore(tableName, 'readonly');
    const req = store.getAllKeys();
    const msg = `获取[${tableName}]全部主键`;
    return this.requestPromise(req, {
      success: msg,
      error: msg,
    });
  }

  async count(tableName: string): Promise<number> {
    const unique = this.getUnique(tableName);
    if (!unique) {
      console.error(`不存在的表名:${tableName}`);
      return 0;
    }
    const store = await this.getDBObjectStore(tableName, 'readonly');
    const req = store.count();
    const msg = `统计[${tableName}]数量`;
    return this.requestPromise(req, {
      success: msg,
      error: msg,
    });
  }

  async get(tableName: string, id: string): Promise<Object> {
    const unique = this.getUnique(tableName);
    if (!unique) {
      console.error(`不存在的表名:${tableName}`);
      return '';
    }
    const store = await this.getDBObjectStore(tableName, 'readonly');
    const request = store.get(id);

    const msg = `${tableName} ${id} 数据获取`;
    return this.requestPromise(request, {
      success: msg,
      error: msg,
    });
  }

  requestPromise(
    request: IDBRequest,
    msg: { success: string, error: string },
    option: {
      getSuccess?: (event: Object) => any,
    } = {},
  ): Promise<any> {
    return new Promise((res, reject) => {
      const { success, error } = msg;
      request.onsuccess = event => {
        const { getSuccess } = option;
        console.log('成功:', success);
        if (getSuccess) {
          res(getSuccess(event));
        } else {
          res(event.target.result);
        }
      };

      request.onerror = function(...rest) {
        console.error('成功:', error, ...rest);
        reject(error);
      };
    });
  }

  async getAndDel(tableName: string, id: string): Promise<Object> {
    const res = await this.get(tableName, id);
    await this.del(tableName, id);
    return res;
  }

  async del(tableName: string, id: string): Promise<Object> {
    const unique = this.getUnique(tableName);
    if (!unique) {
      console.error(`不存在的表名:${tableName}`);
      return '';
    }
    const store = await this.getDBObjectStore(tableName, 'readwrite');
    const request = store.delete(id);
    return this.requestPromise(request, {
      success: `${tableName} ${id} 数据删除`,
      error: `${tableName} ${id} 数据删除`,
    });
  }

  getUnique(tableName: string): ?Unique {
    return this.tableName2Unique[tableName];
  }

  clean(): void {
    this.tableNames.forEach(async (tableName: string) => {
      const isExist = this.existTable(tableName);
      if (isExist) {
        await this.truncateTable(tableName);
      }
    });
  }

  isSameDB(target: Object): boolean {
    return target === this.db;
  }
}
