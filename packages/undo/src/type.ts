export type HistoryConfig = {
  stackCount: number;
  tableName: string;
};
export type AnyObject = {
  [key: string]: any;
};

export interface Store {
  save(tableName: string, target: AnyObject): Promise<string>;

  get(tableName: string, id: string): Promise<AnyObject | undefined>;

  getAndDel(tableName: string, id: string): Promise<AnyObject | undefined>;

  del(tableName: string, id: string): Promise<boolean>;

  clean(): void;

  isSameDB(target: AnyObject): boolean;
}
