#!/usr/bin/env bash
set -euo pipefail

BUMP=${1:-patch}   # patch | minor | major

# -------------------------------------------------------
# 0. 事前チェック
# -------------------------------------------------------
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "❌ 未コミットの変更があります。先にコミットしてください。"
  exit 1
fi

# -------------------------------------------------------
# 1. バージョンアップ（package.json のみ。gitタグは後で打つ）
# -------------------------------------------------------
echo "🔖 バージョンを更新中 ($BUMP)..."
npm version "$BUMP" --no-git-tag-version
VERSION=$(node -p "require('./package.json').version")
TAG="v$VERSION"
echo "  → $TAG"

# -------------------------------------------------------
# 2. インストーラーのビルド
# -------------------------------------------------------
echo ""
echo "📦 インストーラーをビルド中（数分かかります）..."
npm run build:all

# -------------------------------------------------------
# 3. README のダウンロードリンクを新バージョンに書き換え
# -------------------------------------------------------
echo ""
echo "📝 README を更新中..."
sed -i '' -E \
  -e "s|/releases/download/v[0-9]+\.[0-9]+\.[0-9]+/|/releases/download/$TAG/|g" \
  -e "s|KeiHiPon-[0-9]+\.[0-9]+\.[0-9]+|KeiHiPon-$VERSION|g" \
  -e "s|KeiHiPon%20Setup%20[0-9]+\.[0-9]+\.[0-9]+|KeiHiPon%20Setup%20$VERSION|g" \
  -e "s|KeiHiPon%20[0-9]+\.[0-9]+\.[0-9]+\.exe|KeiHiPon%20$VERSION.exe|g" \
  -e "s|KeiHiPon Setup [0-9]+\.[0-9]+\.[0-9]+|KeiHiPon Setup $VERSION|g" \
  -e "s|KeiHiPon [0-9]+\.[0-9]+\.[0-9]+\.exe|KeiHiPon $VERSION.exe|g" \
  README.md

# -------------------------------------------------------
# 4. コミット → タグ → プッシュ
# -------------------------------------------------------
echo ""
echo "💾 コミット & プッシュ..."
git add package.json package-lock.json README.md
git commit -m "release: $TAG"
git tag "$TAG"
git push origin main
git push origin "$TAG"

# -------------------------------------------------------
# 5. GitHub Release 作成 & インストーラーアップロード
# -------------------------------------------------------
echo ""
echo "🚀 GitHub Release を作成中..."

NOTES_FILE=$(mktemp)
cat > "$NOTES_FILE" << NOTES
## ダウンロード

| OS | ファイル | 説明 |
|---|---|---|
| Mac (Apple Silicon) | KeiHiPon-${VERSION}-arm64.dmg | M1/M2/M3 Mac用 |
| Mac (Intel) | KeiHiPon-${VERSION}.dmg | Intel Mac用 |
| Windows | KeiHiPon Setup ${VERSION}.exe | Windowsインストーラー |
| Windows（ポータブル） | KeiHiPon ${VERSION}.exe | インストール不要 |
NOTES

gh release create "$TAG" \
  "dist/KeiHiPon-$VERSION.dmg#Mac用インストーラー（Intel）" \
  "dist/KeiHiPon-$VERSION-arm64.dmg#Mac用インストーラー（Apple Silicon）" \
  "dist/KeiHiPon Setup $VERSION.exe#Windowsインストーラー" \
  "dist/KeiHiPon $VERSION.exe#Windowsポータブル版" \
  --title "経費ぽん $TAG" \
  --notes-file "$NOTES_FILE"

rm -f "$NOTES_FILE"

# -------------------------------------------------------
# 完了
# -------------------------------------------------------
echo ""
echo "✅ リリース完了: $TAG"
echo "🔗 https://github.com/sodateya/keihi_gen/releases/tag/$TAG"
