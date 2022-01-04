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
  db?: IDBDatabase;
  tableName2Unique: { [tableName: string]: Unique };
  indexOption: IndexDBIndexOption;
  version: number;
  dataBaseName: string;
  tableExist: { [tableName: string]: boolean };
  tableNames: string[];

  private option: IndexDBOption;
  private readonly dynamicDb: boolean;
  private indexedDB: any;

  constructor(indexedDB: any, option: IndexDBOption) {
    super();
    this.version = 1;
    this.indexOption = {};
    this.tableNames = [];
    this.tableExist = {};
    this.tableName2Unique = {};
    this.option = option;
    const { dynamicDb = false, dataBaseName } = option;
    this.dynamicDb = dynamicDb;
    this.dataBaseName = dataBaseName;

    if (!indexedDB) {
      console.error('indexDB不能为空！', this.dataBaseName);
      return;
    }
    if (!option) {
      console.error('option不能为空！', this.dataBaseName);
      return;
    }
    const { tableNames = [] } = option;
    if (!dataBaseName) {
      console.error('数据库实例名称不能为空！');
      return;
    }

    this.tableNames = [...tableNames];
    const { indexOption = {} } = option;
    this.indexOption = indexOption;

    this.openDataBase(indexedDB, option);
  }

  private createTableIdUnique(tableName: string) {
    const { generateId = now } = this.option;
    this.tableName2Unique[tableName] = new Unique(0, tableName, generateId);
  }

  getDataBaseTag = (): string => {
    const { dataBaseName, version } = this;
    return `[${dataBaseName}@${version}]`;
  };

  async createTable(newTableName: string): Promise<boolean> {
    const message = `新建表 ${newTableName} @ ${this.dataBaseName}-v${
      this.version
    }`;
    console.info(message);
    if (!this.option) {
      console.error(`数据库未就绪: ${message}`);
      return false;
    }
    if (!this.dynamicDb) {
      console.error(`未开启动态化库表结构功能: ${message}`);
      return false;
    }
    if (this.existTable(newTableName)) {
      console.error(`该表已存在: ${message}`);
      return false;
    }
    if (this.db) {
      this.db.close();
    }

    const { tableNames = [] } = this.option;
    return this.openDataBase(this.indexedDB, {
      ...this.option,
      version: this.version + 1,
      tableNames: [...tableNames, newTableName],
    });
  }

  async deleteTable(delTableName: string): Promise<boolean> {
    const message = `删除表 ${delTableName} @ ${this.dataBaseName}-v${
      this.version
    }`;
    console.info(message);
    if (!this.option) {
      console.error(`数据库未就绪: ${message}`);
      return false;
    }
    if (!this.dynamicDb) {
      console.error(`未开启动态化库表结构功能: ${message}`);
      return false;
    }
    if (!this.existTable(delTableName)) {
      console.error(`该表未存在存在: ${message}`);
      return false;
    }

    if (this.db) {
      this.db.close();
    }

    return this.openDataBase(this.indexedDB, {
      ...this.option,
      version: this.version + 1,
      deleteTableNames: [delTableName],
    });
  }

  async openDataBase(indexedDB: any, option: IndexDBOption): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const { dataBaseName, tableNames, version } = option;
      this.option = option;
      this.dataBaseName = dataBaseName;
      this.indexedDB = indexedDB;
      const request: IDBOpenDBRequest = indexedDB.open(dataBaseName, version);
      console.info(
        `打开数据库: dataBaseName = ${dataBaseName}, version = ${version}`,
      );
      const dataBaseTag = this.getDataBaseTag();
      request.onblocked = () => {
        console.log(
          `存在未完成的数据库操作，无法进行更新处理: ${dataBaseName}`,
        );
      };
      request.onerror = async () => {
        console.error(`打开数据库报错 ${dataBaseTag}`);
        reject(`打开数据库报错 ${dataBaseTag}`);
      };

      const delTables = (targetTables: string[]) => {
        for (const delTable of targetTables) {
          const db = this.getDb();
          if (db) {
            db.deleteObjectStore(delTable);
          }
          delete this.tableExist[delTable];
          delete this.tableName2Unique[delTable];
        }
      };
      request.onupgradeneeded = (event: any) => {
        console.info(`onupgradeneeded ${dataBaseTag}`);
        this.updateDb(event);

        const existTableNames: string[] = this.getExistTableNames();
        const existTableMap: { [tableName: string]: boolean } = {};
        for (const item of existTableNames) {
          existTableMap[item] = true;
        }

        tableNames.forEach((tableName: string) => {
          this.createTableInner(tableName);
          delete existTableMap[tableName];
        });

        if (!this.dynamicDb) {
          console.info('同步数据删除表', Object.keys(existTableMap));
          delTables(Object.keys(existTableMap));
        }
        const { deleteTableNames = [] } = this.option;
        console.info('待删除表', deleteTableNames);
        delTables(deleteTableNames);
        this.option.deleteTableNames = [];
        resolve(true);
      };

      request.onsuccess = async (event: any) => {
        console.info(`onsuccess ${dataBaseTag}`);
        this.updateDb(event);
        const { resetDataAfterConnect = {} } = option;
        const existTables: string[] = this.getExistTableNames();
        existTables.sort(sortStringAsc);
        tableNames.sort(sortStringAsc);
        const separator = '|';

        if (
          !this.dynamicDb &&
          existTables.join(separator) !== tableNames.join(separator)
        ) {
          const db = this.getDb();
          if (!db) {
            console.error('IDBDatabase实例为空');
            return;
          }
          const { version: oldVersion } = db;
          console.info(`待创建的表里包含未创建的表 ${this.getDataBaseTag()}`);
          db.close();
          resolve(
            await this.openDataBase(indexedDB, {
              ...option,
              version: oldVersion + 1,
            }),
          );
          return;
        }

        for (const tableName of existTables) {
          const isExist = this.existTable(tableName);
          if (isExist) {
            this.createTableIdUnique(tableName);
            this.tableExist[tableName] = true;
            if (resetDataAfterConnect[tableName]) {
              await this.truncateTable(tableName);
            }
            const { db } = this;
            this.emit(tableName, { db });
          }
        }

        resolve(true);
      };
    });
  }

  getExistTableNames = (): string[] => {
    const db = this.getDb();
    if (!db) {
      console.error(
        `getExistTableNames执行错误获取不到db对象 ${this.getDataBaseTag()}`,
      );
      return [];
    }
    const existTables: string[] = [];
    const { objectStoreNames } = db;
    for (let i = 0; i < objectStoreNames.length; i++) {
      const tableName = objectStoreNames.item(i);
      if (tableName) {
        existTables.push(tableName);
      }
    }
    return existTables;
  };

  private createTableInner(tableName: string) {
    console.info('准备创建建表', tableName);
    if (!this.existTable(tableName)) {
      this.createObjectStore(tableName);
      console.info('准备创建建表', tableName);
    }
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

  existTable(tableName: string) {
    const db = this.getDb();
    if (!db) {
      console.error('db实例为空');
      return;
    }
    return db.objectStoreNames.contains(tableName);
  }

  createObjectStore(tableName: string) {
    const db = this.getDb();
    if (!db) {
      console.error('db实例为空');
      return;
    }
    const req = db.createObjectStore(tableName, {
      keyPath: 'id',
    });

    console.log(`创建表${tableName}成功`);
    const createIndexOption = this.indexOption[tableName];

    const indexOptions: IndexDBIndexOptionItem[] = [];
    if (createIndexOption && Array.isArray(createIndexOption)) {
      indexOptions.push(...indexOptions);
    } else {
      const { getIndexDBIndexOption } = this.option;
      if (getIndexDBIndexOption) {
        const options = getIndexDBIndexOption(tableName);
        if (options && Array.isArray(options)) {
          indexOptions.push(...options);
        }
      }
    }

    indexOptions.forEach((item: IndexDBIndexOptionItem) => {
      const { field, option = {} } = item;
      if (!field) {
        return;
      }
      const indexName = this.getIndexName(tableName, field);
      req.createIndex(indexName, field, option);
      console.log(`创建表索引${indexName}成功`);
    });
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
    if (!this.db) {
      console.error('db实例为空');
      return;
    }
    const { version } = this.db;
    this.version = version;
    console.log(`打开数据库成功 [${this.dataBaseName}@${this.version}]`);
    this.emit(Connected, { db: this.db });
  }

  getDb(): IDBDatabase | undefined {
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
    const newRecord = { id, ...target };
    const request = store.add(newRecord);
    const { id: lastId } = newRecord;
    return this.requestPromise(request, {
      success: `${tableName} ${lastId} ${JSON.stringify(target)} 新增记录`,
      error: `${tableName} ${lastId} 新增记录`,
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
  ): Promise<IDBObjectStore> {
    const existTable = await this.existTable(tableName);
    if (!existTable) {
      if (!(await this.createTable(tableName))) {
        throw new Error('写入数据的表不存在，动态创建失败');
      }
    }
    const db = await this.getDbWaitTable(tableName);
    const transaction: IDBTransaction = db.transaction([tableName], mode);
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
      const handler = this.once(eventName, (data: any) => {
        res(data);
        handler.removeListener();
      });
    });
  }

  async getAll<T = any>(tableName: string): Promise<T[]> {
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

  async get<T = any>(tableName: string, id: string): Promise<T | undefined> {
    if (!this.getUnique(tableName)) {
      return;
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
      getSuccess?: (event: { target: any }) => any;
    } = {},
  ): Promise<any> {
    return new Promise((res, reject) => {
      const { error } = msg;
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
    return new Promise((resolve, reject) => {
      this.requestPromise(
        request,
        {
          success: `${tableName} ${id} 数据删除`,
          error: `${tableName} ${id} 数据删除`,
        },
        {
          getSuccess(event) {
            const { target } = event;
            const { error } = target;
            if (error) {
              reject(error);
            } else {
              resolve(true);
            }
          },
        },
      );
    });
  }

  getUnique(tableName: string): Unique | undefined {
    const has = this.tableName2Unique[tableName];
    if (!has) {
      console.error(`不存在的表名:${tableName}@${this.dataBaseName}`);
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
