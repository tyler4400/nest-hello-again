# NestJS CLI 命令速查表

## 目录

1. [基础命令](#1-基础命令)
2. [生成命令](#2-生成命令)
3. [资源生成](#3-资源生成)
4. [组件生成](#4-组件生成)
5. [高级生成](#5-高级生成)
6. [常用选项](#6-常用选项)
7. [项目管理](#7-项目管理)
8. [实用示例](#8-实用示例)
9. [故障排查](#9-故障排查)

---

## 1. 基础命令

### 1.1 查看帮助和版本

| 命令             | 简写      | 作用         | 示例             |
| ---------------- | --------- | ------------ | ---------------- |
| `nest --help`    | `nest -h` | 显示帮助信息 | `nest --help`    |
| `nest --version` | `nest -v` | 显示CLI版本  | `nest --version` |
| `nest info`      | `nest i`  | 显示项目信息 | `nest info`      |

### 1.2 项目操作

| 命令                      | 作用       | 示例                       |
| ------------------------- | ---------- | -------------------------- |
| `nest new <project-name>` | 创建新项目 | `nest new my-app`          |
| `nest build`              | 构建项目   | `nest build`               |
| `nest start`              | 启动项目   | `nest start --watch`       |
| `nest add <library>`      | 添加库支持 | `nest add @nestjs/swagger` |

---

## 2. 生成命令

### 2.1 基础语法

```bash
nest generate <schematic> <name> [path] [options]
# 或简写
nest g <schematic> <name> [path] [options]
```

### 2.2 命令结构说明

- **schematic**: 要生成的组件类型（如 controller、service 等）
- **name**: 组件名称
- **path**: 可选的路径（默认在 src 目录下）
- **options**: 可选参数（如 --no-spec、--flat 等）

---

## 3. 资源生成

### 3.1 完整资源生成

| 命令                     | 简写                | 作用         | 生成文件             |
| ------------------------ | ------------------- | ------------ | -------------------- |
| `nest g resource <name>` | `nest g res <name>` | 生成完整资源 | 包含所有CRUD相关文件 |

#### 示例

```bash
nest g resource user
```

#### 交互选项

```bash
? What transport layer do you use?
❯ REST API                    # RESTful API
  GraphQL (code first)        # GraphQL代码优先
  GraphQL (schema first)      # GraphQL模式优先
  Microservice (non-HTTP)     # 微服务
  WebSockets                  # WebSocket

? Would you like to generate CRUD entry points? (Y/n)
```

#### 生成的文件结构

```
src/user/
├── dto/
│   ├── create-user.dto.ts    # 创建用户DTO
│   └── update-user.dto.ts    # 更新用户DTO
├── entities/
│   └── user.entity.ts        # 用户实体
├── user.controller.spec.ts   # 控制器测试
├── user.controller.ts        # 控制器
├── user.module.ts           # 模块
├── user.service.spec.ts     # 服务测试
└── user.service.ts          # 服务
```

---

## 4. 组件生成

### 4.1 核心组件

| 命令                       | 简写               | 作用       | 生成文件          | 示例              |
| -------------------------- | ------------------ | ---------- | ----------------- | ----------------- |
| `nest g module <name>`     | `nest g mo <name>` | 生成模块   | `*.module.ts`     | `nest g mo user`  |
| `nest g controller <name>` | `nest g co <name>` | 生成控制器 | `*.controller.ts` | `nest g co user`  |
| `nest g service <name>`    | `nest g s <name>`  | 生成服务   | `*.service.ts`    | `nest g s user`   |
| `nest g provider <name>`   | `nest g pr <name>` | 生成提供者 | `*.provider.ts`   | `nest g pr cache` |

#### 示例：逐步创建用户模块

```bash
# 1. 创建模块
nest g module user

# 2. 创建服务
nest g service user

# 3. 创建控制器
nest g controller user
```

### 4.2 请求处理组件

| 命令                        | 简写               | 作用       | 生成文件           | 示例                      |
| --------------------------- | ------------------ | ---------- | ------------------ | ------------------------- |
| `nest g guard <name>`       | `nest g gu <name>` | 生成守卫   | `*.guard.ts`       | `nest g gu auth`          |
| `nest g interceptor <name>` | `nest g i <name>`  | 生成拦截器 | `*.interceptor.ts` | `nest g i logging`        |
| `nest g filter <name>`      | `nest g f <name>`  | 生成过滤器 | `*.filter.ts`      | `nest g f http-exception` |
| `nest g pipe <name>`        | `nest g pi <name>` | 生成管道   | `*.pipe.ts`        | `nest g pi validation`    |
| `nest g middleware <name>`  | `nest g mi <name>` | 生成中间件 | `*.middleware.ts`  | `nest g mi logger`        |

#### 示例：创建认证相关组件

```bash
# 创建认证守卫
nest g guard auth

# 创建JWT拦截器
nest g interceptor jwt

# 创建异常过滤器
nest g filter all-exceptions
```

### 4.3 数据传输对象

| 命令                      | 简写               | 作用     | 生成文件         | 示例                        |
| ------------------------- | ------------------ | -------- | ---------------- | --------------------------- |
| `nest g class <name>`     | `nest g cl <name>` | 生成类   | `*.class.ts`     | `nest g cl dto/create-user` |
| `nest g interface <name>` | `nest g if <name>` | 生成接口 | `*.interface.ts` | `nest g if user`            |
| `nest g enum <name>`      | `nest g e <name>`  | 生成枚举 | `*.enum.ts`      | `nest g e user-status`      |

#### 示例：创建DTO

```bash
# 创建用户DTO
nest g class dto/create-user --no-spec

# 创建用户接口
nest g interface interfaces/user

# 创建用户状态枚举
nest g enum enums/user-status
```

---

## 5. 高级生成

### 5.1 GraphQL 相关

| 命令                     | 简写              | 作用       | 生成文件        | 示例            |
| ------------------------ | ----------------- | ---------- | --------------- | --------------- |
| `nest g resolver <name>` | `nest g r <name>` | 生成解析器 | `*.resolver.ts` | `nest g r user` |

### 5.2 微服务相关

| 命令                    | 简写               | 作用     | 生成文件       | 示例             |
| ----------------------- | ------------------ | -------- | -------------- | ---------------- |
| `nest g gateway <name>` | `nest g ga <name>` | 生成网关 | `*.gateway.ts` | `nest g ga chat` |

### 5.3 库相关

| 命令                    | 简写                | 作用       | 生成文件   | 示例                |
| ----------------------- | ------------------- | ---------- | ---------- | ------------------- |
| `nest g library <name>` | `nest g lib <name>` | 生成库     | 库文件夹   | `nest g lib shared` |
| `nest g sub-app <name>` | `nest g app <name>` | 生成子应用 | 应用文件夹 | `nest g app admin`  |

---

## 6. 常用选项

### 6.1 基础选项

| 选项        | 简写 | 作用                     | 示例                            |
| ----------- | ---- | ------------------------ | ------------------------------- |
| `--dry-run` | `-d` | 预览生成结果，不实际创建 | `nest g service user --dry-run` |
| `--no-spec` |      | 跳过测试文件生成         | `nest g service user --no-spec` |
| `--flat`    |      | 不创建文件夹，平铺生成   | `nest g service user --flat`    |
| `--no-flat` |      | 创建文件夹（默认行为）   | `nest g service user --no-flat` |

### 6.2 路径选项

| 选项                          | 作用             | 示例                                          |
| ----------------------------- | ---------------- | --------------------------------------------- |
| `--project <name>`            | 指定项目名称     | `nest g service user --project=api`           |
| `--source-root <path>`        | 指定源码根目录   | `nest g service user --source-root=src`       |
| `--spec-file-suffix <suffix>` | 指定测试文件后缀 | `nest g service user --spec-file-suffix=test` |

### 6.3 实用示例

```bash
# 预览生成结果
nest g resource user --dry-run

# 生成无测试文件的服务
nest g service user --no-spec

# 在特定目录生成模块
nest g module modules/user

# 生成扁平结构的控制器
nest g controller user --flat

# 生成完整资源但跳过测试
nest g resource user --no-spec
```

---

## 7. 项目管理

### 7.1 项目构建

| 命令                   | 作用            | 示例                   |
| ---------------------- | --------------- | ---------------------- |
| `nest build`           | 构建项目        | `nest build`           |
| `nest build --watch`   | 监听模式构建    | `nest build --watch`   |
| `nest build --webpack` | 使用webpack构建 | `nest build --webpack` |

### 7.2 项目运行

| 命令                 | 作用         | 示例                 |
| -------------------- | ------------ | -------------------- |
| `nest start`         | 启动项目     | `nest start`         |
| `nest start --watch` | 监听模式启动 | `nest start --watch` |
| `nest start --debug` | 调试模式启动 | `nest start --debug` |
| `nest start --prod`  | 生产模式启动 | `nest start --prod`  |

### 7.3 添加依赖

| 命令                       | 作用            | 示例                       |
| -------------------------- | --------------- | -------------------------- |
| `nest add @nestjs/swagger` | 添加Swagger支持 | `nest add @nestjs/swagger` |
| `nest add @nestjs/typeorm` | 添加TypeORM支持 | `nest add @nestjs/typeorm` |
| `nest add @nestjs/graphql` | 添加GraphQL支持 | `nest add @nestjs/graphql` |
| `nest add @nestjs/config`  | 添加配置支持    | `nest add @nestjs/config`  |

---

## 8. 实用示例

### 8.1 快速搭建RESTful API

```bash
# 1. 创建完整的用户资源
nest g resource user
# 选择: REST API, 生成CRUD: Y

# 2. 创建认证模块
nest g module auth
nest g service auth
nest g controller auth

# 3. 创建JWT守卫
nest g guard guards/jwt

# 4. 创建验证管道
nest g pipe pipes/validation

# 5. 创建日志拦截器
nest g interceptor interceptors/logging
```

### 8.2 创建模块化结构

```bash
# 创建核心模块
nest g module core
nest g module shared
nest g module common

# 创建功能模块
nest g module features/user
nest g module features/product
nest g module features/order

# 在功能模块中创建服务
nest g service features/user/user
nest g service features/product/product
nest g service features/order/order
```

### 8.3 创建微服务结构

```bash
# 创建微服务网关
nest g gateway gateways/chat

# 创建微服务控制器
nest g controller microservices/user
nest g controller microservices/notification

# 创建微服务模块
nest g module microservices/user
nest g module microservices/notification
```

### 8.4 GraphQL 项目搭建

```bash
# 创建GraphQL资源
nest g resource user
# 选择: GraphQL (code first), 生成CRUD: Y

# 创建解析器
nest g resolver user
nest g resolver product

# 创建GraphQL模型
nest g class models/user --no-spec
nest g class models/product --no-spec
```

---

## 9. 故障排查

### 9.1 常见问题

#### 问题1：命令无响应

```bash
# 解决方案1：使用npx
npx @nestjs/cli g resource user

# 解决方案2：重新安装CLI
npm uninstall -g @nestjs/cli
npm install -g @nestjs/cli@latest

# 解决方案3：检查项目结构
ls -la  # 确保在正确的NestJS项目目录中
```

#### 问题2：权限问题

```bash
# macOS/Linux: 使用sudo
sudo npm install -g @nestjs/cli

# 或者使用nvm管理Node版本
nvm use 18
npm install -g @nestjs/cli
```

#### 问题3：模块未自动导入

```bash
# 手动添加到app.module.ts
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule], // 手动添加
})
export class AppModule {}
```

### 9.2 调试技巧

#### 使用 --dry-run 预览

```bash
# 预览将要生成的文件
nest g resource user --dry-run

# 输出示例:
# CREATE src/user/dto/create-user.dto.ts
# CREATE src/user/dto/update-user.dto.ts
# CREATE src/user/entities/user.entity.ts
# CREATE src/user/user.controller.spec.ts
# CREATE src/user/user.controller.ts
# CREATE src/user/user.service.spec.ts
# CREATE src/user/user.service.ts
# CREATE src/user/user.module.ts
# UPDATE src/app.module.ts
```

#### 检查CLI版本兼容性

```bash
# 检查CLI版本
nest --version

# 检查项目依赖版本
npm list @nestjs/core
npm list @nestjs/common

# 确保版本兼容
npm install @nestjs/core@latest
npm install @nestjs/common@latest
```

---

## 10. 配置文件

### 10.1 nest-cli.json 配置

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "builder": "webpack",
    "typeCheck": true
  },
  "generateOptions": {
    "spec": false, // 默认不生成测试文件
    "flat": true // 默认平铺生成
  }
}
```

### 10.2 常用配置选项

```json
{
  "generateOptions": {
    "spec": false, // 跳过测试文件
    "flat": true, // 平铺生成
    "specFileSuffix": "spec", // 测试文件后缀
    "styleext": "scss" // 样式文件扩展名
  }
}
```

---

## 11. 最佳实践

### 11.1 命名约定

- 使用 kebab-case: `nest g service user-profile`
- 使用单数名词: `nest g resource user` (不是 users)
- 模块名与功能对应: `nest g module user-management`

### 11.2 目录结构建议

```
src/
├── common/                 # 通用组件
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── filters/
├── modules/               # 业务模块
│   ├── user/
│   ├── auth/
│   └── product/
├── shared/               # 共享模块
│   ├── services/
│   └── constants/
└── config/               # 配置文件
```

### 11.3 生成顺序建议

1. 先生成模块: `nest g module user`
2. 再生成服务: `nest g service user`
3. 最后生成控制器: `nest g controller user`
4. 根据需要添加其他组件

---

## 参考资料

- [NestJS 官方文档](https://docs.nestjs.com/)
- [NestJS CLI 官方文档](https://docs.nestjs.com/cli/overview)
- [NestJS Schematics](https://docs.nestjs.com/recipes/nest-commander)

---

_文档创建时间：2024年_  
_适用版本：NestJS CLI 9.x - 11.x_
