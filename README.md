# 経費ぽん

iPhoneで撮った領収書などの写真を、経費申請に使いやすいJPEGファイルに変換するデスクトップアプリです。

---

## ダウンロード・インストール

### Mac をお使いの方

**自分のMacがどちらか分からない場合：** 画面左上のリンゴマーク → 「このMacについて」で確認できます。「Apple M1/M2/M3」と表示されていれば Apple Silicon、「Intel」と表示されていれば Intel です。

| お使いのMac | ダウンロード |
|---|---|
| M1 / M2 / M3 (Apple Silicon) | [**KeiHiPon-1.0.1-arm64.dmg** をダウンロード](https://github.com/sodateya/keihi_gen/releases/download/v1.0.1/KeiHiPon-1.0.1-arm64.dmg) |
| Intel Mac | [**KeiHiPon-1.0.1.dmg** をダウンロード](https://github.com/sodateya/keihi_gen/releases/download/v1.0.1/KeiHiPon-1.0.1.dmg) |

**インストール手順（Mac）**

1. 上のリンクから `.dmg` ファイルをダウンロード
2. ダウンロードした `.dmg` ファイルをダブルクリックして開く
3. 表示されたウィンドウで「KeiHiPon」を「Applications」フォルダにドラッグ＆ドロップ
4. 下の「初回起動の手順」を参考にアプリを起動する

> **⚠️ 初回起動の手順（必ずこの手順で開いてください）**
>
> このアプリは Apple の有料開発者登録を行っていないため、そのままダブルクリックすると macOS のセキュリティ機能（Gatekeeper）がブロックします。以下の手順で一度だけ許可してください。
>
> **方法①：システム設定から許可する（推奨）**
> 1. アプリをダブルクリック → 警告が出て開けない
> 2. Mac の「システム設定」→「プライバシーとセキュリティ」を開く
> 3. 画面を下にスクロールすると「"KeiHiPon"はブロックされました」と表示されている
> 4. 右側の **「このまま開く」** をクリック → パスワードを入力
> 5. 次の確認ダイアログで **「開く」** をクリック
> 6. 以降はダブルクリックで普通に起動できます
>
> **方法②：ターミナルで隔離フラグを解除する**
> 1. Mac の「ターミナル」アプリを開く
> 2. 以下をコピーして貼り付け、Enter を押す
>    ```
>    xattr -dr com.apple.quarantine /Applications/KeiHiPon.app
>    ```
> 3. その後はダブルクリックで起動できます
>
> **Launchpad（アプリ一覧）に表示されない場合**
> 上のいずれかの方法でアプリを一度起動すると Launchpad にも表示されます。
> 起動後も表示されない場合はターミナルで以下を実行してください。
> ```
> killall Dock
> ```

---

### Windows をお使いの方

| 種類 | ダウンロード |
|---|---|
| インストーラー（推奨） | [**KeiHiPon Setup 1.0.1.exe** をダウンロード](https://github.com/sodateya/keihi_gen/releases/download/v1.0.1/KeiHiPon%20Setup%201.0.1.exe) |
| ポータブル版（インストール不要） | [**KeiHiPon 1.0.1.exe** をダウンロード](https://github.com/sodateya/keihi_gen/releases/download/v1.0.1/KeiHiPon%201.0.1.exe) |

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
