# Quasar App (air-con)

**url**
登录：/login
注册：/register

**[现在已经不重要]**
由于本人天才地使用了 ElForm 且没用用 quasar，和其他人合起来以后，quasar 没有 main.js，只有一直刷新的 app.js，搞 boot 没调出来，局部调用很丑，于是只能每次执行`yarn run dev`后手动在`app.js`里加入以下内容：

```js
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

app.use(ElementPlus);
```

## 人话版：如何运行

1. `yarn install`
2. `yarn run dev`

**p.s.** 如果依赖下载缓慢，请换淘宝镜像

air-con

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
