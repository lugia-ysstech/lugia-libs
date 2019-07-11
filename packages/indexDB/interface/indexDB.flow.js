declare module '@lugia/indexDB' {
  declare export interface QueryInstance {
    get(tableName: string, id: string): Promise<Object>;

    count(tableName: string): Promise<number>;

    getAllKeys(tableName: string): Promise<string[]>;

    filter(tableName: string, cb: (item: any) => boolean): Promise<Object[]>;

    filterKeys(tableName: string, cb: (key: any) => boolean): Promise<string[]>;

    getAll(tableName: string): Promise<Object[]>;
  }

  declare export interface Store extends QueryInstance {
    save(tableName: string, target: Object): Promise<string>;

    getAndDel(tableName: string, id: string): Promise<Object>;

    del(tableName: string, id: string): Promise<boolean>;

    clean(): void;

    isSameDB(target: Object): boolean;

    update(tableName: string, id: string, target: Object): Promise<string>;

    getIndex(tableName: string, field: string): Promise<QueryInstance>;
  }

  declare export type IndexOption = {
    unique?: boolean,
  };

  declare export type IndexDBIndexOptionItem = {
    field: string,
    option?: IndexOption,
  };

  declare export type IndexDBIndexOption = {
    [tableName: string]: IndexDBIndexOptionItem[],
  };

  declare export type IndexDBOption = {
    dataBaseName: string, // 连接的目标数据库名称
    tableNames: string[], // 要操作的表名集合
    version?: number, // 操作的数据库版本 默认版本为1
    resetDataAfterConnect?: boolean, // 是否在每次连接后清空所有表的数据
    indexOption?: IndexDBIndexOption,
    generateId?: Function,
  };

  declare export default class IndexDB implements Store {
    constructor(indexedDB: Object, option: IndexDBOption): IndexDB;

    save(tableName: string, target: Object): Promise<string>;

    get(tableName: string, id: string): Promise<Object>;

    count(tableName: string): Promise<number>;

    getAllKeys(tableName: string): Promise<string[]>;

    getAll(tableName: string): Promise<Object[]>;

    getAndDel(tableName: string, id: string): Promise<Object>;

    del(tableName: string, id: string): Promise<boolean>;

    getIndex(tableName: string, field: string): Promise<QueryInstance>;
    update(tableName: string, id: string, target: Object): Promise<string>;

    clean(): void;
    isSameDB(target: Object): boolean;

    filter(tableName: string, cb: (item: any) => boolean): Promise<Object[]>;

    filterKeys(tableName: string, cb: (key: any) => boolean): Promise<string[]>;
  }
}
