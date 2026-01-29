# 把 Pomor 项目上传到 GitHub

按下面顺序做即可。前提：本机已安装 [Git](https://git-scm.com/downloads)。

---

## 第一步：在 GitHub 上新建仓库

1. 登录 [GitHub](https://github.com)。
2. 右上角 **+** → **New repository**。
3. **Repository name** 填一个名字，例如 `Pomor` 或 `pomor-timer`。
4. 选 **Public**。
5. **不要**勾选 "Add a README file"（你本地已有项目，直接推上去即可）。
6. 点 **Create repository**。
7. 创建好后，页面上会有一个地址，例如：`https://github.com/你的用户名/Pomor.git`，先记下。

---

## 第二步：在本地用 Git 初始化并推送

在**项目根目录**（有 `package.json` 和 `electron-main.js` 的那一层）打开终端（PowerShell 或 CMD），依次执行：

```bash
# 1. 初始化 Git 仓库（若还没初始化过）
git init

# 2. 添加所有文件（.gitignore 会排除 node_modules、release 等）
git add .

# 3. 第一次提交
git commit -m "Initial commit: Pomor 番茄计时器"

# 4. 把本地的 main 分支和远程仓库连起来（把下面的地址换成你在第一步记下的）
git remote add origin https://github.com/你的用户名/仓库名.git

# 5. 推送到 GitHub（第一次推送并设置上游分支）
git branch -M main
git push -u origin main
```

- 若 GitHub 提示要登录，按页面说明用**浏览器**或 **Personal Access Token** 登录。
- 若你的默认分支是 `master`，可把 `git branch -M main` 改成 `git branch -M master`，并把 `git push -u origin main` 里的 `main` 改成 `master`。

执行完后，在 GitHub 上刷新仓库页面，应能看到所有代码（不含 `node_modules` 和 `release/`，因为已在 `.gitignore` 里忽略）。

---

## 之后每次改完代码怎么更新到 GitHub

在项目根目录执行：

```bash
git add .
git commit -m "简短说明你改了什么"
git push
```

---

## 小结

| 步骤 | 做什么 |
|------|--------|
| 1 | GitHub 上 New repository，记下仓库地址 |
| 2 | 本地项目根目录：`git init` → `git add .` → `git commit -m "..."` → `git remote add origin <地址>` → `git branch -M main` → `git push -u origin main` |

项目里已添加 **`.gitignore`**，会自动排除 `node_modules/` 和 `release/`，不会把这些大文件夹推上去。
