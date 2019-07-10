declare module '@lugia/indexDB' {
  declare export interface Store {
    save(tableName: string, target: Object): Promise<string>;

    get(tableName: string, id: string): Promise<Object>;

    getAndDel(tableName: string, id: string): Promise<Object>;

    del(tableName: string, id: string): Promise<boolean>;

    clean(): void;

    isSameDB(target: Object): boolean;
  }

  declare export type IndexDBOption = {
    dataBaseName: string, // 连接的目标数据库名称
    tableNames: string[], // 要操作的表名集合
    version?: number, // 操作的数据库版本 默认版本为1
    resetDataAfterConnect?: boolean, // 是否在每次连接后清空所有表的数据
  };

  declare export default class IndexDB implements Store {
    constructor(indexedDB: Object, option: IndexDBOption): IndexDB;

    save(tableName: string, target: Object): Promise<string>;

    get(tableName: string, id: string): Promise<Object>;

    getAndDel(tableName: string, id: string): Promise<Object>;

    del(tableName: string, id: string): Promise<boolean>;

    clean(): void;

    isSameDB(target: Object): boolean;
  }
}
