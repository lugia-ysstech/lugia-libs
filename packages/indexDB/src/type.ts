export interface QueryInstance {
  get(tableName: string, id: string): Promise<object>;

  count(tableName: string): Promise<number>;

  getAllKeys(tableName: string): Promise<string[]>;

  filter(tableName: string, cb: (item: any) => boolean): Promise<string[]>;

  filterKeys(tableName: string, cb: (key: any) => boolean): Promise<string[]>;

  getAll(tableName: string): Promise<object[]>;
}

export interface Store extends QueryInstance {
  save(tableName: string, target: object): Promise<string>;

  getAndDel(tableName: string, id: string): Promise<object>;

  del(tableName: string, id: string): Promise<boolean>;

  clean(): void;

  isSameDB(target: object): boolean;

  update(tableName: string, id: string, target: object): Promise<string>;

  getIndex(tableName: string, field: string): Promise<QueryInstance>;
}

export type IndexOption = {
  unique?: boolean;
};

export type IndexDBIndexOptionItem = {
  field: string;
  option?: IndexOption;
};

export type IndexDBIndexOption = {
  [tableName: string]: IndexDBIndexOptionItem[];
};

export type IndexDBOption = {
  dataBaseName: string; // 连接的目标数据库名称
  tableNames: string[]; // 要操作的表名集合
  version?: number; // 操作的数据库版本 默认版本为1
  resetDataAfterConnect?: { [tableName: string]: boolean }; // 是否在每次连接后清空所有表的数据
  indexOption?: IndexDBIndexOption;
  generateId?: () => string;
};
