// electron-builder の afterPack フック
// DMG/ZIP 作成前にアプリを deep ad-hoc 署名する
// → 無署名のまま配布すると macOS Ventura+ で「壊れている」エラーになるため

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

exports.default = async function (context) {
  if (context.electronPlatformName !== "darwin") return;

  const appPath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`);
  if (!fs.existsSync(appPath)) return;

  console.log(`  • deep ad-hoc signing  path=${appPath}`);
  execSync(`codesign --force --deep --sign - "${appPath}"`, { stdio: "inherit" });
};
