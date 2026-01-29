# 解决 GitHub 推送时「超过 100 MB」报错

报错原因：**以前的提交**里曾经包含 `node_modules/` 和 `release/`，GitHub 不接受单文件超过 100 MB，所以整次推送被拒。

解决办法：**删掉本地 .git，重新初始化**，只做一条「不包含大文件夹」的提交，再强制推送到 GitHub。这样历史里绝不会再有大文件。

---

## 方法：彻底重来（推荐）

在项目根目录 **`D:\Pomor`** 打开 **PowerShell**，**一条一条**执行（不要一次粘贴整段）：

```powershell
cd D:\Pomor
```

```powershell
Remove-Item -Recurse -Force .git
```

```powershell
git init
```

```powershell
git add .
```

```powershell
git status
```
（看一眼列表里**不要**出现 `node_modules`、`release`；若有，说明 .gitignore 没生效，先别继续，检查 .gitignore）

```powershell
git commit -m "Initial commit: Pomor 番茄计时器"
```

```powershell
git branch -M main
```

```powershell
git remote add origin https://github.com/wuyanzu03/Pomor.git
```

```powershell
git push -f origin main
```

执行完后，GitHub 上会只剩这一条干净提交，之后正常改代码、`git add`、`git commit`、`git push` 即可。

---

## 若第 2 步报错「找不到 .git」

说明当前目录不对，先 `cd D:\Pomor` 再执行 `Remove-Item -Recurse -Force .git`。

---

## 若 GitHub 上已有别人的提交要保留

不要用上面的「彻底重来」，改用：新建一个**空仓库**，把上面从 `git init` 到 `git commit` 做完，最后 `git remote add origin https://github.com/你的用户名/新仓库名.git`，再 `git push -u origin main`。
