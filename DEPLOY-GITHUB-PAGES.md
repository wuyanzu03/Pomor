# 用 GitHub Pages 托管官网 + 阿里云域名

可以。你不用买 ECS，用 **GitHub Pages**（免费）放网站，再用你在 **阿里云买的域名** 指向 GitHub，别人访问你的域名就会打开 GitHub 上的页面。

---

## 整体关系

| 角色 | 作用 |
|------|------|
| **阿里云** | 你只用来**管理域名**（DNS 解析），把「你的域名」指到 GitHub |
| **GitHub Pages** | **免费**放你的静态网站（`web/` 里的文件），并支持用你自己的域名访问 |

别人访问「你的域名.com」→ 阿里云 DNS 解析到 GitHub → 打开的是 GitHub 上的页面，不占用阿里云 ECS。

---

## 第一步：把官网放到 GitHub 并开启 Pages

1. **建一个 GitHub 仓库**  
   登录 [GitHub](https://github.com)，New repository，名字随意（如 `pomor-website`），Public，创建。

2. **把 `web/` 里的文件推上去**  
   - 若仓库里**只放官网**，建议：把 **`web/`** 里的**所有文件**（`index.html`、`style.css`、`app.js`、`assets/` 等）放到仓库**根目录**（不要带一层 `web` 文件夹）。  
   - 或者：整份项目推上去，在仓库 **Settings → Pages** 里把 **Source** 选成「Deploy from a branch」，**Branch** 选 `main`，**Folder** 选 **`/web`**（这样根目录是项目，Pages 只发布 `web/` 目录）。  
   任选一种，保证最后 Pages 打开的首页是 `index.html`。

3. **开启 GitHub Pages**  
   仓库 **Settings → Pages**：  
   - **Source**：Deploy from a branch  
   - **Branch**：`main`（或你用的分支）  
   - **Folder**：若文件在根目录选 **`/ (root)`**；若在 `web/` 选 **`/web`**  
   - 保存。  
   等一两分钟，会得到一个地址：`https://你的用户名.github.io/仓库名/`（若仓库名是 `用户名.github.io` 则是 `https://用户名.github.io/`）。  
   先浏览器打开这个地址，确认官网能正常显示。

---

## 第二步：在 GitHub 里填你的阿里云域名

1. 还是在仓库 **Settings → Pages**。  
2. 在 **Custom domain** 里填你在阿里云买的域名，例如：`www.你的域名.com` 或 `你的域名.com`（不带 www）。  
3. 点 **Save**。  
4. 若提示要验证，按页面说明操作；验证通过后可以勾选 **Enforce HTTPS**（推荐）。

---

## 第三步：在阿里云把域名解析到 GitHub

在阿里云只做「域名解析」，不用开 ECS。

1. 登录 [阿里云控制台](https://home.console.aliyun.com/) → **域名** → 找到你买的域名 → 点击 **解析**（或「DNS 解析」「解析设置」）。  
2. 根据你在 GitHub 填的域名，二选一：

### 情况 A：用 `www.你的域名.com` 访问

- 添加一条 **CNAME** 记录：  
  - **记录类型**：CNAME  
  - **主机记录**：`www`  
  - **记录值**：`你的用户名.github.io`（把「你的用户名」换成你 GitHub 用户名）  
  - 保存。

### 情况 B：用根域名 `你的域名.com` 访问（不带 www）

- 添加 **4 条 A 记录**（GitHub 要求）：  
  - 记录类型：**A**，主机记录：**@**，记录值分别填下面 4 个，各一条：  
    - `185.199.108.153`  
    - `185.199.109.153`  
    - `185.199.110.153`  
    - `185.199.111.153`  
- 保存。

### 若希望「带 www」和「不带 www」都能用

- 既做 **情况 A**（CNAME `www` → `用户名.github.io`），又做 **情况 B**（4 条 A 记录）。  
- 在 GitHub Pages 的 Custom domain 里，一般填 **带 www** 的（如 `www.你的域名.com`）更省事；若你填的是根域名，就主要用根域名访问。

3. 等 **几分钟到几小时** DNS 生效后，用浏览器访问「你的域名」，应能看到和 GitHub 地址一样的官网。

---

## 第四步：下载链接（安装包放哪）

GitHub Pages 只能放**静态文件**，但可以放 exe 供下载：

- **方式 1：放在同一仓库里**  
  在仓库里建一个 **`download`** 文件夹，把 **`Pomor Timer Setup 1.0.0.exe`** 传上去（注意：单文件建议小于 100MB，仓库总大小也有限制）。  
  下载地址就是：`https://你的域名/download/Pomor-Timer-Setup-1.0.0.exe`（若你自定义了域名且解析成功，就用你的域名）。  
  在 **`web/app.js`** 里把 **`DOWNLOAD_URL`** 设成这个地址即可。

- **方式 2：用 GitHub Releases**  
  在仓库 **Releases** 里发一个版本，把 exe 作为附件上传。  
  下载地址会是：`https://github.com/你的用户名/仓库名/releases/download/版本号/Pomor-Timer-Setup-1.0.0.exe`。  
  把 **`DOWNLOAD_URL`** 设成这个地址即可。

- **方式 3：安装包放阿里云 OSS**  
  若 exe 很大或不想占 GitHub 空间，可以只在阿里云买**对象存储 OSS**（很便宜，按量计费），把 exe 上传到 OSS，得到一个直链，把 **`DOWNLOAD_URL`** 设成这个直链。  
  网站仍然在 GitHub Pages，只有「下载」这个动作用到阿里云。

---

## 小结

| 步骤 | 做什么 |
|------|--------|
| 1 | 把 `web/` 里的文件推到 GitHub 仓库，并开启 Pages，确认 `https://用户名.github.io/仓库名/` 能打开官网 |
| 2 | 在仓库 Settings → Pages 的 Custom domain 填「你的阿里云域名」（如 `www.你的域名.com`） |
| 3 | 在阿里云「域名解析」里：用 www 就加 CNAME（www → 用户名.github.io）；用根域名就加 4 条 A 记录指向 GitHub 的 IP |
| 4 | 在 `web/app.js` 里设置 `DOWNLOAD_URL`（安装包可放同一仓库的 download、或 GitHub Releases、或阿里云 OSS） |

这样：**网站用 GitHub 的服务器（免费），域名用你在阿里云买的，两者通过 DNS 连在一起，不需要 ECS。**
