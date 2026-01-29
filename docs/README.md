## Pomor Timer 官网（静态页）

这是一套静态官网页面，整体视觉偏“柔和渐变 + 玻璃拟态卡片 + 轻动效”，用于承载：

- 产品介绍
- 下载按钮（链接到你的安装包）
- FAQ

### 预览方式

用浏览器直接打开 `docs/index.html` 即可预览。（GitHub Pages 选 /docs 后，访问 https://用户名.github.io/Pomor/ 即可。）

### 配置下载链接

打开 `docs/app.js`，把 `DOWNLOAD_URL` 改成你的公网下载地址即可：

```js
const DOWNLOAD_URL = 'https://your-domain.com/download/Pomor-Timer-Setup-1.0.0.exe';
```

