.PHONY: patch minor major build help

help:
	@echo "使い方:"
	@echo "  make patch   パッチバージョンアップしてリリース  例: 1.0.1 → 1.0.2"
	@echo "  make minor   マイナーバージョンアップしてリリース 例: 1.0.1 → 1.1.0"
	@echo "  make major   メジャーバージョンアップしてリリース 例: 1.0.1 → 2.0.0"
	@echo "  make build   インストーラーのビルドのみ（リリースなし）"

# パッチバージョンアップ + ビルド + GitHub Release 作成 + README 更新
patch:
	@bash scripts/release.sh patch

# マイナーバージョンアップ + ビルド + GitHub Release 作成 + README 更新
minor:
	@bash scripts/release.sh minor

# メジャーバージョンアップ + ビルド + GitHub Release 作成 + README 更新
major:
	@bash scripts/release.sh major

# インストーラーのビルドのみ
build:
	@npm run build:all
