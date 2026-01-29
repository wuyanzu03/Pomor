const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
// electron-store v9+ 是 ESM-only，这里用动态 import 兼容 CommonJS 主进程
let store = null;

async function getStore() {
  if (store) return store;

  const mod = await import('electron-store');
  const Store = mod.default;

  store = new Store({
    name: 'pomor-data',
    defaults: {
      stats: {}
    }
  });

  return store;
}

// 以日期分组的简单统计结构
// {
//   "2026-01-29": {
//     totalSeconds: 1500,
//     sessions: 3,
//     items: [
//       { name: "写周报", seconds: 1500, endedAt: 1700000000000 }
//     ]
//   },
//   ...
// }

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 600,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setMenuBarVisibility(false);

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  if (!app.isPackaged) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(async () => {
  // 先初始化 store，避免主进程启动就崩
  await getStore();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 获取统计数据
ipcMain.handle('stats:get', async () => {
  const s = await getStore();
  return s.get('stats') || {};
});

// 新增一条完成的番茄记录（秒数 + 日期）
ipcMain.handle('stats:addSession', async (event, payload) => {
  const { date, seconds, name } = payload;
  const s = await getStore();
  if (!date || typeof seconds !== 'number' || seconds <= 0) {
    return s.get('stats') || {};
  }

  const stats = s.get('stats') || {};
  const current = stats[date] || { totalSeconds: 0, sessions: 0, items: [] };
  const updated = {
    totalSeconds: current.totalSeconds + seconds,
    sessions: current.sessions + 1,
    items: Array.isArray(current.items) ? current.items : []
  };

  updated.items.push({
    name: typeof name === 'string' && name.trim() ? name.trim() : '未命名',
    seconds,
    endedAt: Date.now()
  });
  // 避免无限增长：每个日期最多保留 200 条
  if (updated.items.length > 200) {
    updated.items = updated.items.slice(updated.items.length - 200);
  }

  stats[date] = updated;
  s.set('stats', stats);

  return stats;
});

// 删除某日某条记录（date + items 下标）
ipcMain.handle('stats:deleteSession', async (event, payload) => {
  const { date, index } = payload;
  const s = await getStore();
  if (!date || typeof index !== 'number' || index < 0) {
    return s.get('stats') || {};
  }

  const stats = s.get('stats') || {};
  const current = stats[date];
  if (!current || !Array.isArray(current.items) || index >= current.items.length) {
    return stats;
  }

  const item = current.items[index];
  const updated = {
    totalSeconds: Math.max(0, current.totalSeconds - (item?.seconds || 0)),
    sessions: Math.max(0, (current.sessions || 1) - 1),
    items: current.items.filter((_, i) => i !== index)
  };

  if (updated.items.length === 0) {
    delete stats[date];
  } else {
    stats[date] = updated;
  }
  s.set('stats', stats);

  return stats;
});

