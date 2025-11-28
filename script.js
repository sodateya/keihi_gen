// フォーム要素の取得
const form = document.getElementById("receiptForm");
const amountInput = document.getElementById("amount");
const nameInput = document.getElementById("name");
const imageInput = document.getElementById("imageInput");
const previewContainer = document.getElementById("previewContainer");
const previewImage = document.getElementById("previewImage");
const fileInfo = document.getElementById("fileInfo");
const processBtn = document.getElementById("processBtn");

// 画像プレビューの表示
imageInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    console.log("選択されたファイル:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // ファイルタイプの確認（空の場合は画像として扱う）
    if (file.type && !file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください");
      imageInput.value = "";
      return;
    }

    const fileTypeInfo = isHEICFile(file) 
      ? "HEIC（JPEGに変換します）" 
      : (file.type || "不明（画像として処理します）");
    
    fileInfo.textContent = `選択されたファイル: ${file.name} (${(
      file.size / 1024
    ).toFixed(2)} KB) - 形式: ${fileTypeInfo}`;

    // HEICファイルの場合は変換してからプレビュー
    if (isHEICFile(file)) {
      fileInfo.textContent += " (HEIC変換中...)";
      
      if (typeof heic2any !== "undefined") {
        heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        })
          .then((convertedBlobs) => {
            const jpegBlob = Array.isArray(convertedBlobs) ? convertedBlobs[0] : convertedBlobs;
            const url = URL.createObjectURL(jpegBlob);
            previewImage.src = url;
            previewContainer.style.display = "block";
            console.log("HEICプレビュー変換成功");
          })
          .catch((error) => {
            console.error("HEICプレビュー変換エラー:", error);
            fileInfo.textContent = `選択されたファイル: ${file.name} (${(
              file.size / 1024
            ).toFixed(2)} KB) - 形式: HEIC（プレビュー不可、変換は可能）`;
          });
      } else {
        fileInfo.textContent = `選択されたファイル: ${file.name} (${(
          file.size / 1024
        ).toFixed(2)} KB) - 形式: HEIC（プレビュー不可、変換は可能）`;
      }
    } else {
      // 通常の画像ファイルのプレビュー
      const reader = new FileReader();
      
      reader.onload = function (e) {
        console.log("ファイル読み込み成功");
        previewImage.src = e.target.result;
        previewContainer.style.display = "block";
      };
      
      reader.onerror = function (error) {
        console.error("ファイル読み込みエラー:", error);
        alert("画像のプレビューを読み込めませんでした");
        previewContainer.style.display = "none";
      };
      
      reader.onprogress = function (e) {
        if (e.lengthComputable) {
          const percentLoaded = Math.round((e.loaded / e.total) * 100);
          console.log(`読み込み中: ${percentLoaded}%`);
        }
      };
      
      try {
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("readAsDataURLエラー:", error);
        alert("ファイルの読み込みに失敗しました: " + error.message);
      }
    }
  } else {
    previewContainer.style.display = "none";
    fileInfo.textContent = "";
  }
});

// フォーム送信処理
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const amount = amountInput.value.trim();
  const name = nameInput.value.trim();
  const file = imageInput.files[0];

  if (!file) {
    alert("画像を選択してください");
    return;
  }

  if (!amount || !name) {
    alert("金額と氏名を入力してください");
    return;
  }

  // ボタンを無効化
  processBtn.disabled = true;
  processBtn.textContent = "処理中...";

  try {
    // 画像をJPEG形式に変換
    const jpegBlob = await convertToJPEG(file);

    // ファイル名を生成
    const fileName = generateFileName(amount, name);

    // ダウンロード
    downloadFile(jpegBlob, fileName);

    // 成功メッセージ
    alert("画像の処理が完了しました！ダウンロードを開始します。");
  } catch (error) {
    console.error("エラー:", error);
    alert("エラーが発生しました: " + error.message);
  } finally {
    // ボタンを再有効化
    processBtn.disabled = false;
    processBtn.textContent = "画像を処理してダウンロード";
  }
});

// HEICファイルかどうかを判定する関数
function isHEICFile(file) {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  
  return (
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif") ||
    fileType === "image/heic" ||
    fileType === "image/heif" ||
    (!file.type && (fileName.endsWith(".heic") || fileName.endsWith(".heif")))
  );
}

// 画像をJPEG形式に変換する関数
async function convertToJPEG(file) {
  console.log("convertToJPEG開始:", {
    name: file.name,
    type: file.type,
    size: file.size,
  });

  // ファイルタイプの確認（空の場合は画像として扱う）
  if (file.type && !file.type.startsWith("image/") && !isHEICFile(file)) {
    throw new Error("画像ファイルを選択してください");
  }

  // HEICファイルの場合はheic2anyを使用
  if (isHEICFile(file)) {
    console.log("HEICファイルを検出、heic2anyで変換します");
    
    try {
      // heic2anyが利用可能か確認
      if (typeof heic2any === "undefined") {
        throw new Error("HEIC変換ライブラリが読み込まれていません。ページを再読み込みしてください。");
      }

      // HEICをJPEGに変換
      const convertedBlobs = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });

      // heic2anyは配列を返す可能性があるので、最初の要素を取得
      const jpegBlob = Array.isArray(convertedBlobs) ? convertedBlobs[0] : convertedBlobs;
      
      console.log("HEIC変換成功, サイズ:", jpegBlob.size);
      return jpegBlob;
    } catch (error) {
      console.error("HEIC変換エラー:", error);
      throw new Error("HEICファイルの変換に失敗しました: " + error.message);
    }
  }

  // 通常の画像ファイルの処理
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      console.log("FileReader読み込み完了, DataURL長さ:", e.target.result.length);
      const img = new Image();
      let timeoutId;

      // タイムアウトを設定（30秒）
      timeoutId = setTimeout(() => {
        console.error("画像読み込みタイムアウト");
        reject(new Error("画像の読み込みがタイムアウトしました"));
      }, 30000);

      img.onload = function () {
        clearTimeout(timeoutId);
        console.log("画像読み込み成功:", {
          width: img.width,
          height: img.height,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        });
        
        try {
          // Canvasを作成してJPEGに変換
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          
          // 画像を描画
          ctx.drawImage(img, 0, 0);
          
          console.log("Canvas描画完了, toBlob開始");

          // JPEG形式でBlobに変換（品質90%）
          canvas.toBlob(
            function (blob) {
              if (blob) {
                console.log("Blob変換成功, サイズ:", blob.size);
                resolve(blob);
              } else {
                console.error("Blob変換失敗");
                reject(new Error("画像の変換に失敗しました"));
              }
            },
            "image/jpeg",
            0.9
          );
        } catch (error) {
          clearTimeout(timeoutId);
          console.error("Canvas処理エラー:", error);
          reject(new Error("画像の処理中にエラーが発生しました: " + error.message));
        }
      };

      img.onerror = function (error) {
        clearTimeout(timeoutId);
        console.error("画像読み込みエラー詳細:", {
          error: error,
          src: img.src ? img.src.substring(0, 50) + "..." : "なし",
        });
        reject(new Error("画像の読み込みに失敗しました。ファイル形式を確認してください。"));
      };

      // 画像の読み込みを開始
      try {
        console.log("画像読み込み開始");
        img.src = e.target.result;
      } catch (error) {
        clearTimeout(timeoutId);
        console.error("画像読み込み開始エラー:", error);
        reject(new Error("画像の読み込みを開始できませんでした: " + error.message));
      }
    };

    reader.onerror = function (error) {
      console.error("FileReaderエラー詳細:", error);
      reject(new Error("ファイルの読み込みに失敗しました"));
    };

    reader.onabort = function () {
      console.error("FileReader中断");
      reject(new Error("ファイルの読み込みが中断されました"));
    };

    // ファイルをDataURLとして読み込む
    try {
      console.log("readAsDataURL開始");
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("readAsDataURL例外:", error);
      reject(new Error("ファイルを読み込めませんでした: " + error.message));
    }
  });
}

// ファイル名を生成する関数
function generateFileName(amount, name) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  // ファイル名に使用できない文字を置換
  const sanitizedName = name.replace(/[\/\\?%*:|"<>]/g, "_");

  return `${year}_${month}_${day}_${amount}_${sanitizedName}.jpg`;
}

// ファイルをダウンロードする関数
async function downloadFile(blob, fileName) {
  // Electron APIが利用可能な場合は、保存ダイアログを使用
  if (window.electronAPI) {
    try {
      // BlobをArrayBufferに変換
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Array.from(new Uint8Array(arrayBuffer));

      // Electronの保存ダイアログを表示
      const result = await window.electronAPI.saveFile(buffer, fileName);

      if (result.success) {
        alert(`画像を保存しました:\n${result.filePath}`);
        return;
      } else {
        if (result.message !== "保存がキャンセルされました") {
          throw new Error(result.message);
        }
        return; // キャンセルされた場合は何もしない
      }
    } catch (error) {
      console.error("Electron保存エラー:", error);
      // フォールバック: 通常のダウンロード方法を使用
    }
  }

  // フォールバック: ブラウザのデフォルトダウンロード方法
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  // ダウンロードフォルダの場所を表示（ブラウザの場合）
  if (!window.electronAPI) {
    alert(`画像をダウンロードしました。\nブラウザのデフォルトのダウンロードフォルダを確認してください。`);
  }
}
