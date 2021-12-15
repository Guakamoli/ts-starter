# ts-starter

一个 typescript 的样板房

> 默认允许编写 js 代码，具体可自行修改 [tsconfig.json](./tsconfig.json)

## 特性

- 更快更安全的包管理器 **[pnpm](https://github.com/pnpm/pnpm)**
- 打包 **[tsup](https://github.com/egoist/tsup)**
- 测试 **[uvu](https://github.com/lukeed/uvu)**
- 集成 **[mongodb](https://github.com/mongodb/node-mongodb-native)** ([document](https://mongodb.github.io/node-mongodb-native/4.2/))
- 支持构建镜像(优化过大小)

## 环境变量

```bash
PORT=8080
HTTP_ENABLE=true
MONGO_ENABLE=true
MONGO_URL=mongodb://localhost:27017/example
```
