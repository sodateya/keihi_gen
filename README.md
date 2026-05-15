# 経費ぽん

iPhoneで撮った領収書などの写真を、経費申請に使いやすいJPEGファイルに変換するデスクトップアプリです。

---

## ダウンロード・インストール

### Mac をお使いの方

**自分のMacがどちらか分からない場合：** 画面左上のリンゴマーク → 「このMacについて」で確認できます。「Apple M1/M2/M3」と表示されていれば Apple Silicon、「Intel」と表示されていれば Intel です。

| お使いのMac | ダウンロード |
|---|---|
| M1 / M2 / M3 (Apple Silicon) | [**KeiHiPon-1.0.0-arm64.dmg** をダウンロード](https://github.com/sodateya/keihi_gen/releases/download/v1.0.0/KeiHiPon-1.0.0-arm64.dmg) |
| Intel Mac | [**KeiHiPon-1.0.0.dmg** をダウンロード](https://github.com/sodateya/keihi_gen/releases/download/v1.0.0/KeiHiPon-1.0.0.dmg) |

**インストール手順（Mac）**

1. 上のリンクから `.dmg` ファイルをダウンロード
2. ダウンロードした `.dmg` ファイルをダブルクリックして開く
3. 表示されたウィンドウで「KeiHiPon」を「Applications」フォルダにドラッグ＆ドロップ
4. LaunchpadまたはApplicationsフォルダから「KeiHiPon」を起動

> **「開発元を確認できません」と表示された場合：**
> Finderでアプリを右クリック（または Control+クリック）→「開く」→「開く」をクリックしてください。
> 2回目以降は通常どおりダブルクリックで起動できます。

---

### Windows をお使いの方

| 種類 | ダウンロード |
|---|---|
| インストーラー（推奨） | [**KeiHiPon Setup 1.0.0.exe** をダウンロード](https://github.com/sodateya/keihi_gen/releases/download/v1.0.0/KeiHiPon%20Setup%201.0.0.exe) |
| ポータブル版（インストール不要） | [**KeiHiPon 1.0.0.exe** をダウンロード](https://github.com/sodateya/keihi_gen/releases/download/v1.0.0/KeiHiPon%201.0.0.exe) |

**インストール手順（Windows）**

1. 上のリンクから `Setup.exe` ファイルをダウンロード
2. ダウンロードした `exe` ファイルをダブルクリック
3. 「WindowsによってPCが保護されました」と表示された場合は「詳細情報」→「実行」をクリック
4. 画面の指示に従ってインストール
5. スタートメニューから「KeiHiPon」を起動

---

## 使い方

1. アプリを起動する
2. **日付**・**金額**・**氏名**を入力する（氏名は「名前を保存する」をオンにすると次回から自動入力）
3. **「ファイルを選択してください」**をクリックして、領収書などの画像を選ぶ（iPhoneの写真のHEICもそのまま使えます）
4. **「ぽんと保存する ✨」**をクリック
5. 保存先を選んでファイルを保存する

保存されるファイル名は自動的に `2025_05_15_1500_山田太郎.jpg` のような形式になります。

---

## 対応画像形式

JPEG、PNG、HEIC（iPhoneの写真）、WebP、BMP、TIFFなど主要な画像形式に対応しています。

---

## 開発者向け情報

```bash
npm install       # 依存パッケージのインストール
npm run dev       # 開発モードで起動（DevTools付き）
npm start         # 通常起動
npm run build:mac # Mac用ビルド
npm run build:win # Windows用ビルド
npm run build:all # 両プラットフォーム向けビルド
```
