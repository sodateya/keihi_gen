# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## コマンド

```bash
# 開発モードで起動（DevToolsが自動で開く）
npm run dev

# 通常起動
npm start

# Mac用ビルド（dmg + zip、x64/arm64）
npm run build:mac

# Windows用ビルド（nsis + portable）
npm run build:win

# 両プラットフォーム向けビルド
npm run build:all
```

ビルド成果物は `dist/` ディレクトリに出力される。テストおよびリントのスクリプトは未設定。

## アーキテクチャ

ElectronアプリでメインプロセスとレンダラープロセスをIPC経由で分離している。

### プロセス構成

- **`main.js`（メインプロセス）**: ウィンドウ生成とファイル保存の `ipcMain.handle('save-file')` を担当。Node.js APIで実際のファイル書き込みと保存ダイアログ（`dialog.showSaveDialog`）を処理する。
- **`preload.js`（プリロード）**: `contextBridge.exposeInMainWorld` で `window.electronAPI.saveFile()` をレンダラーに安全に公開するブリッジ。`nodeIntegration: false` / `contextIsolation: true` で動作。
- **`script.js`（レンダラー）**: UIイベント処理・画像変換・ファイルダウンロードを担当。Electron環境かブラウザ環境かで動作を分岐させている。
- **`index.html` / `style.css`**: UIレイアウトとスタイル。

### 画像変換フロー

1. ユーザーが金額・氏名・画像ファイルを入力
2. `isHEICFile()` でHEIC/HEIFかを拡張子とMIMEタイプで判定
3. HEICの場合は `lib/heic2any.min.js`（ローカルバンドル）で変換
4. それ以外はCanvas APIで `canvas.toBlob('image/jpeg', 0.9)` に変換
5. `generateFileName()` で `yyyy_mm_dd_金額_氏名.jpg` 形式のファイル名を生成
6. Electron環境では `window.electronAPI.saveFile()` → IPCで保存ダイアログ表示。ブラウザ環境ではフォールバックとして `<a download>` リンク経由でダウンロード

### 依存ライブラリ

- `lib/heic2any.min.js`: `node_modules` からではなく `lib/` にローカルバンドルされている。`package.json` の `build.files` に明示的に含める必要がある。
- electron-builder のビルド対象ファイルは `package.json` の `build.files` で明示的に列挙されており、追加ファイルを使う場合はここへの追記が必要。
