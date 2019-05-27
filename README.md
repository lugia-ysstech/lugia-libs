# @lugia/scaffolding-lerna

> A scaffolding of Lerna.

## Development, Contribute

> 安装 [yarn](https://yarnpkg.com)

```bash
# 安装依赖并运行 yarn bootstrap
$ yarn
```

> 使用 [lerna](https://github.com/lerna/lerna) 管理 packages

```bash
# 引导安装所有 packages 的依赖
$ yarn bootstrap
```

### 新建 package

```bash
$ yarn new <package-name>

# 例子
$ yarn new loader
```

### 开发

使用 babel 转义并监听所有的改动文件

```bash
$ yarn start
```

### 测试

```bash
$ yarn test
```

### 生产构建

使用 babel 转义到 ./lib 目录

```bash
$ yarn build
```

### 运行单个 package 的测试

```bash
$ yarn run lerna exec --scope <package-name> -- yarn run test

# 例子
$ yarn run lerna exec --scope mega-webpack -- yarn run test
```

### 发布 package 到 npm 或 私服

```bash
$ yarn run publish

# 忽略
$ yarn run publish -- --ignore <package-name>

# 例子
$ yarn run publish -- --ignore mega-webpack
```

## 看 packages/\*/README.md
