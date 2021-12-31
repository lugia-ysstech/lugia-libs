/**
 *
 * create by ligx
 *
 * @flow
 */
import {
  IndexDBIndexOption,
  IndexDBIndexOptionItem,
  IndexDBOption,
  Store,
} from './type';

import Unique, { now } from '@lugia/unique';
import Listener from '@lugia/listener';
import { sortStringAsc } from '@lugia/array-utils';

const Connected = 'connected';

export default class IndexDB extends Listener<any> implements Store {
  db: any;
  tableName2Unique: { [tableName: string]: Unique };
  indexOption: IndexDBIndexOption;
  version: number;
  dataBaseName: string;
  tableExist: { [tableName: string]: boolean };
  tableNames: string[];

  constructor(indexedDB: any, option: IndexDBOption) {
    super();
    this.version = 1;
    this.indexOption = {};
    this.dataBaseName = '';
    this.tableNames = [];
    this.tableExist = {};
    this.tableName2Unique = {};

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

    this.tableNames = [...tableNames];
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
    this.openDataBase(indexedDB, option);
  }

  getDataBaseTag = (): string => {
    const { dataBaseName, version } = this;
    return `[${dataBaseName}@${version}]`;
  };

  openDataBase = (indexedDB: any, option: IndexDBOption) => {
    const { dataBaseName, tableNames, version } = option;
    this.dataBaseName = dataBaseName;
    const request = indexedDB.open(dataBaseName, version);
    const dataBaseTag = this.getDataBaseTag();
    request.onerror = async () => {
      console.error(`打开数据库报错 ${dataBaseTag}`);
    };

    request.onupgradeneeded = (event: any) => {
      this.updateDb(event);

      const existTableNames: string[] = this.getExistTableNames();
      const existTableMap: { [tableName: string]: boolean } = {};
      for (const item of existTableNames) {
        existTableMap[item] = true;
      }

      tableNames.forEach((tableName: string) => {
        this.createTable(tableName);
        delete existTableMap[tableName];
      });

      for (const needDelTableName of Object.keys(existTableMap)) {
        const db = this.getDb();
        db.deleteObjectStore(needDelTableName);
      }
    };
    request.onsuccess = (event: any) => {
      this.updateDb(event);
      const { resetDataAfterConnect = {} } = option;
      const existTables: string[] = this.getExistTableNames();
      existTables.sort(sortStringAsc);
      tableNames.sort(sortStringAsc);
      const separator = '|';
      if (existTables.join(separator) !== tableNames.join(separator)) {
        const { version: oldVersion } = this.getDb();
        console.info(`待创建的表里包含未创建的表 ${this.getDataBaseTag()}`);
        this.getDb().close();
        this.openDataBase(indexedDB, { ...option, version: oldVersion + 1 });
        return;
      }

      tableNames.forEach(async (tableName: string) => {
        const isExist = this.existTable(tableName);
        if (isExist) {
          const { db } = this;
          this.tableExist[tableName] = true;
          if (resetDataAfterConnect[tableName]) {
            await this.truncateTable(tableName);
          }
          this.emit(tableName, { db });
        }
      });
    };
  };

  getExistTableNames = (): string[] => {
    const db = this.getDb();
    if (!db) {
      console.error(
        `getExistTableNames执行错误获取不到db对象 ${this.getDataBaseTag()}`,
      );
      return [];
    }
    const existTables: string[] = [];
    for (const existTable of db.objectStoreNames) {
      existTables.push(existTable);
    }
    return existTables;
  };

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
    if (!this.getUnique(tableName)) {
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

  async getIndex(tableName: string, field: string): Promise<any> {
    if (!this.getUnique(tableName)) {
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

      filter: async (
        name: string,
        cb: (item: any) => boolean,
      ): Promise<string[]> => {
        const idbIndex = await this.getDBIndex(name, field);
        if (!idbIndex) {
          return [];
        }
        return this.filterByStore(idbIndex, name, cb, {
          valueField: 'value',
          funcName: 'openCursor',
        });
      },

      filterKeys: async (
        name: string,
        cb: (item: any) => boolean,
      ): Promise<string[]> => {
        const idbIndex = await this.getDBIndex(name, field);
        if (!idbIndex) {
          return [];
        }
        return this.filterByStore(idbIndex, name, cb, {
          valueField: 'key',
          funcName: 'openKeyCursor',
        });
      },
    };
  }

  async getDBIndex(tableName: string, field: string): Promise<any> {
    const store = await this.getDBObjectStore(tableName, 'readonly');
    return store.index(this.getIndexName(tableName, field));
  }

  updateDb(event: any) {
    this.db = event.target.result;
    const { version } = this.db;
    this.version = version;
    console.log(`打开数据库成功 [${this.dataBaseName}@${this.version}]`);
    this.emit(Connected, { db: this.db });
  }

  getDb() {
    return this.db;
  }

  async save(tableName: string, target: object): Promise<string> {
    const store = await this.getDBObjectStore(tableName, 'readwrite');
    return this.saveByStore(tableName, target, store);
  }

  async saveByStore(
    tableName: string,
    target: object,
    store: any,
  ): Promise<string> {
    const unique = this.getUnique(tableName);
    if (!unique) {
      return '';
    }
    const id = unique.getNext();
    const request = store.add({ id, ...target });
    return this.requestPromise(request, {
      success: `${tableName} ${id} ${JSON.stringify(target)} 新增记录`,
      error: `${tableName} ${target} 新增记录`,
    });
  }

  async update(tableName: string, id: string, target: object): Promise<string> {
    const store = await this.getDBObjectStore(tableName, 'readwrite');
    return this.updateByStore(tableName, id, target, store);
  }

  async updateByStore(
    tableName: string,
    id: string,
    target: object,
    store: any,
  ): Promise<string> {
    if (!this.getUnique(tableName)) {
      return '';
    }
    const request = store.put({ id, ...target });
    const msg = `${tableName} ${target} 更新记录 id =${id}`;
    return this.requestPromise(request, {
      success: msg,
      error: msg,
    });
  }

  async saveOrUpdate(tableName: string, target: any): Promise<any> {
    const store = await this.getDBObjectStore(tableName, 'readwrite');
    const { id } = target;
    if (id) {
      if (await this.getByStore(tableName, id, store)) {
        return this.updateByStore(tableName, id, target, store);
      }
    }
    return this.saveByStore(tableName, target, store);
  }

  async getDBObjectStore(
    tableName: string,
    mode: 'readonly' | 'readwrite' | 'versionchange',
  ): Promise<any> {
    const db = await this.getDbWaitTable(tableName);
    const transaction = db.transaction([tableName], mode);
    return transaction.objectStore(tableName);
  }

  async getDbWaitTable(tableName: string): Promise<any> {
    const db = this.getDb();
    if (db && this.tableExist[tableName]) {
      return Promise.resolve(db);
    }
    const data = await this.waitEvent(tableName);
    const { db: resDB } = data;
    this.tableExist[tableName] = true;
    return resDB;
  }

  async waitEvent(eventName: string): Promise<any> {
    const WaitTimeOut = 5000;
    return new Promise((res, reject) => {
      setTimeout(() => {
        reject(`indexDb 获取连接失败: ${eventName}`);
      }, WaitTimeOut);
      const handler = this.once(eventName, data => {
        res(data);
        handler.removeListener();
      });
    });
  }

  async getAll(tableName: string): Promise<object[]> {
    if (!this.getUnique(tableName)) {
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
    if (!this.getUnique(tableName)) {
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
    if (!this.getUnique(tableName)) {
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

  async get(tableName: string, id: string): Promise<any> {
    if (!this.getUnique(tableName)) {
      return '';
    }
    const store = await this.getDBObjectStore(tableName, 'readonly');
    return this.getByStore(tableName, id, store);
  }
  async getByStore(tableName: string, id: string, store: any): Promise<any> {
    const request = store.get(id);
    const msg = `${tableName} ${id} 数据获取`;
    return this.requestPromise(request, {
      success: msg,
      error: msg,
    });
  }

  requestPromise(
    request: IDBRequest,
    msg: { success: string; error: string },
    option: {
      getSuccess?: (event: object) => any;
    } = {},
  ): Promise<any> {
    return new Promise((res, reject) => {
      const { success, error } = msg;
      request.onsuccess = (event: any) => {
        const { getSuccess } = option;
        if (getSuccess) {
          res(getSuccess(event));
        } else {
          res(event.target.result);
        }
      };

      request.onerror = function(...rest) {
        console.error('失败:', error, ...rest);
        reject(error);
      };
    });
  }

  async getAndDel(tableName: string, id: string): Promise<any> {
    const res = await this.get(tableName, id);
    await this.del(tableName, id);
    return res;
  }

  async del(tableName: string, id: string): Promise<any> {
    if (!this.getUnique(tableName)) {
      return '';
    }
    const store = await this.getDBObjectStore(tableName, 'readwrite');
    const request = store.delete(id);
    return this.requestPromise(request, {
      success: `${tableName} ${id} 数据删除`,
      error: `${tableName} ${id} 数据删除`,
    });
  }

  getUnique(tableName: string): Unique | undefined {
    const has = this.tableName2Unique[tableName];
    if (!has) {
      console.error(`不存在的表名:${tableName}`);
    }
    return has;
  }

  clean(): void {
    this.tableNames.forEach(async (tableName: string) => {
      const isExist = this.existTable(tableName);
      if (isExist) {
        await this.truncateTable(tableName);
      }
    });
  }

  async filter(
    tableName: string,
    cb: (item: any) => boolean,
  ): Promise<string[]> {
    const store = await this.getDBObjectStore(tableName, 'readonly');
    return this.filterByStore(store, tableName, cb, {
      valueField: 'value',
      funcName: 'openCursor',
    });
  }

  async filterKeys(
    tableName: string,
    cb: (item: any) => boolean,
  ): Promise<string[]> {
    const store = await this.getDBObjectStore(tableName, 'readonly');
    return this.filterByStore(store, tableName, cb, {
      valueField: 'key',
      funcName: 'openKeyCursor',
    });
  }

  async filterByStore(
    store: any,
    tableName: string,
    cb: (item: any) => boolean,
    option: { valueField: string; funcName: string },
  ): Promise<string[]> {
    if (!this.getUnique(tableName)) {
      return [];
    }
    const { valueField, funcName } = option;
    const request = store[funcName]();
    const result: any[] = [];
    return new Promise(res => {
      request.onsuccess = (event: any) => {
        const cursor = event.target.result;
        if (cursor) {
          const { [valueField]: value } = cursor;
          if (cb(value)) {
            result.push(value);
          }
          cursor.continue();
        } else {
          res(result);
        }
      };
    });
  }

  isSameDB(target: object): boolean {
    return target === this.db;
  }
}
