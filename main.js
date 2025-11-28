const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

function createWindow() {
  // メインウィンドウを作成
  mainWindow = new BrowserWindow({
    width: 700,
    height: 900,
    minWidth: 500,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, "preload.js"),
    },
    title: "経費申請画像処理ツール",
    backgroundColor: "#667eea",
  });

  // HTMLファイルを読み込む
  mainWindow.loadFile("index.html");

  // 開発者ツールを開く（開発環境のみ）
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  // ウィンドウが閉じられたとき
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ファイル保存のIPCハンドラー
ipcMain.handle("save-file", async (event, { buffer, fileName }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: "画像を保存",
    defaultPath: fileName,
    filters: [
      { name: "JPEG画像", extensions: ["jpg", "jpeg"] },
      { name: "すべてのファイル", extensions: ["*"] },
    ],
  });

  if (canceled) {
    return { success: false, message: "保存がキャンセルされました" };
  }

  try {
    fs.writeFileSync(filePath, Buffer.from(buffer));
    return { success: true, filePath: filePath };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// アプリケーションの準備ができたとき
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // macOSでドックアイコンがクリックされたとき
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// すべてのウィンドウが閉じられたとき（Windows & Linux）
app.on("window-all-closed", () => {
  // macOS以外では、すべてのウィンドウを閉じたときにアプリを終了
  if (process.platform !== "darwin") {
    app.quit();
  }
});

