export type Exist = {
  addExist(key: string): void;
  isExist(key: string): boolean;
};

export type UniqueOption = { exist?: Exist };
