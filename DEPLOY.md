# 把 Pomor Timer 放到自己官网上供别人下载

按下面步骤做即可：先在本机打出安装包，再把安装包和官网页面部署到你的服务器。

---

## 公网地址和网页如何连在一起

- **公网地址**：别人在浏览器里输入的网址，例如 `https://你的域名.com` 或 `http://你的服务器IP`。
- **你写的网页**：就是项目里 **`web/`** 目录下的那些文件（`index.html`、`style.css`、`app.js` 等）。

**怎么“连在一起”：**

1. 你的公网地址背后有一台**服务器**（你自己的机器、云主机、或托管平台）。
2. 在这台服务器上，有一个**网站根目录**（例如 `/var/www/html` 或 Nginx 里配置的 `root` 路径）。
3. 把你 **`web/`** 里的所有文件**上传并放到这个根目录**（或某个子目录，如 `/pomor/`）。
4. 服务器软件（Nginx、Apache、或静态托管）配置成：**访问这个公网地址时，就从这个目录里找文件并返回**；访问根路径时通常返回 `index.html`。

这样：别人打开「公网地址」→ 服务器从「网站根目录」里找到你放的 `index.html` 等 → 浏览器就显示出你写的网页。

| 你做的 | 结果 |
|--------|------|
| 把 `web/` 里的文件上传到服务器上“网站根目录” | 公网地址打开后，看到的就是你写的官网 |
| 把 `Pomor Timer Setup x.x.x.exe` 上传到同一服务器的某个路径（如 `/download/`） | 官网上的下载按钮指向的链接就能下载到安装包 |

如果你用的是**静态托管**（如 GitHub Pages、Vercel、Netlify 等），一般是：把 `web/` 里的文件上传/部署到该平台，平台会给你一个公网地址，那个地址就是你的官网；安装包需要单独放到能直链下载的地方（同一平台允许放文件的话，也可以放在同一域名下，例如 `/download/xxx.exe`）。

---

## 1. 打出 Windows 安装包

在项目根目录执行：

```bash
npm run dist
```

- 打好的文件在 **`release/`** 目录里。
- 会生成 **NSIS 安装程序**，文件名类似：**`Pomor Timer Setup 1.0.0.exe`**（版本号来自 `package.json` 的 `version`）。
- 发给别人时请用这个 **Setup.exe**（或把整个 `release/` 里该次构建生成的文件一起打包），不要只发 `win-unpacked` 里的单个 exe，否则可能缺 dll 报错。

---

## 2. 把安装包放到你能访问的地址

把 **`Pomor Timer Setup x.x.x.exe`** 上传到你官网所在服务器的某个路径，例如：

- `https://你的域名/download/Pomor-Timer-Setup-1.0.0.exe`
- 或 `https://你的域名/static/pomor/Pomor-Timer-Setup-1.0.0.exe`

只要最终能通过一个 **公网 URL** 直接下载到这个 exe 即可（用浏览器打开该 URL 会触发下载）。

---

## 3. 在官网上配置下载链接

你现在的官网页面在 **`web/`** 目录（静态 HTML/CSS/JS）。

1. 打开 **`web/app.js`**。
2. 找到 **`DOWNLOAD_URL`**（约第 89 行），把空字符串改成你的安装包地址，例如：

```js
const DOWNLOAD_URL = 'https://你的域名/download/Pomor-Timer-Setup-1.0.0.exe';
```

保存后，官网上的「下载 Windows 安装包」按钮就会指向这个链接；复制下载链接也会复制这个地址。

---

## 4. 把官网页面部署到你的网站

- 把 **`web/`** 里的所有文件（如 `index.html`、`style.css`、`app.js`、`assets/` 等）上传到你官网的服务器。
- 若你的官网是单独一个站点，通常把 `web/` 的内容放到网站根目录或某个子路径（如 `/pomor/`）即可，保证访问时能打开 `index.html`。
- 若使用 Nginx/Apache，只要把该目录配成静态文件目录即可，无需后端。

---

## 5. 之后每次发新版本

1. 在 **`package.json`** 里改 **`version`**（如 `1.0.1`）。
2. 再执行 **`npm run dist`**，会得到新的 **`Pomor Timer Setup 1.0.1.exe`**。
3. 把新 exe 上传到服务器（可覆盖原路径或新路径，如带版本号）。
4. 若下载地址变了，在 **`web/app.js`** 里把 **`DOWNLOAD_URL`** 改成新地址并重新部署官网。

---

## 小结

| 步骤 | 做什么 |
|------|--------|
| 1 | 在项目里执行 `npm run dist`，在 `release/` 得到 `Pomor Timer Setup x.x.x.exe` |
| 2 | 把该 exe 上传到你的服务器，得到一个公网下载 URL |
| 3 | 在 `web/app.js` 里设置 `DOWNLOAD_URL` 为这个 URL |
| 4 | 把 `web/` 下的官网页面部署到你的网站 |

这样别人访问你的官网就能看到下载按钮并下载到安装包。
