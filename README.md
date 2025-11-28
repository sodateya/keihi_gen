# 経費申請画像処理ツール

iPhone で撮った写真を JPEG 形式に変換し、指定形式のファイル名で保存するデスクトップアプリケーションです。

## 機能

- 金額と氏名を入力
- 画像をアップロード（iPhone の写真を含む）
- 自動 JPEG 変換（HEIC/PNG なども JPEG に変換）
- ファイル名の自動生成（`yyyy_mm_dd_receipt_金額_氏名.jpg`形式）
- プレビュー表示
- ワンクリックでダウンロード

## セットアップ

### 必要な環境

- Node.js (v16 以上)
- npm または yarn

### インストール

```bash
npm install
```

## 開発モードで実行

```bash
npm start
```

## ビルド

### Mac 用にビルド

```bash
npm run build:mac
```

### Windows 用にビルド

```bash
npm run build:win
```

### 両方のプラットフォーム用にビルド

```bash
npm run build:all
```

ビルドされたファイルは `dist/` ディレクトリに出力されます。

## 使い方

1. アプリを起動
2. 金額と氏名を入力
3. 画像を選択（iPhone の写真でも可）
4. 「画像を処理してダウンロード」をクリック
5. 処理された JPEG ファイルが自動でダウンロードされます

ファイル名は自動で `2024_12_15_receipt_1500_山田太郎.jpg` のような形式になります。

## 技術スタック

- Electron
- HTML/CSS/JavaScript
