## Pomor 番茄计时器

一个使用 **Electron + Vue3 + 本地 JSON（electron-store）+ electron-builder** 的简易番茄计时器桌面应用。

### 功能

- **基础计时**：开始 / 暂停 / 重置
- **时间格式化**：显示为 `MM:SS`
- **自定义时长**：预设 25 / 15 / 5 分钟一键切换
- **统计数据**：按日期分组统计当天完成的番茄轮数和总时长
- **本地持久化**：利用 `electron-store` 保存在用户本地配置目录

### 本地开发

1. 安装依赖（需已安装 Node.js）

   ```bash
   cd d:\Pomor
   npm install
   ```

2. 运行

   ```bash
   npm start
   ```

3. 打包（使用 electron-builder）

   ```bash
   # 仅生成打包目录
   npm run pack

   # 生成安装包
   npm run dist
   ```

### 说明

- UI 使用 Vue3（通过 CDN 引入）+ 原生 CSS，实现简单现代的卡片式界面。
- 数据存储采用 `electron-store`，底层使用本地 JSON 文件，按日期为 key 分组保存统计。

