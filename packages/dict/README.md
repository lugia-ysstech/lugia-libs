# 说明
字典表工具包
# 使用方法
```$xslt
declare module '@lugia/dict' {
  declare class Dict {
    get(name: string): any; // 根据索引名从当前的空间中，获取对应的值。 name必须是字符串，否则无法获取对应的值。
    load(nameSpace: string, value: Object): any; // 加载对应空间的值。 强类型检查
    changeNameSpace(nameSpace: string): void; // 变更当前的命名空间。
  }
  declare export function createDict(): Dict; // 创建一个字典对象
  declare export function getDict(dictName: string): Dict; // 查找字典集中有没有该字典，有直接返回，无则创建一份并保存在闭包中。
}

```
