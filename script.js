// フォーム要素の取得
const form = document.getElementById("receiptForm");
const dateInput = document.getElementById("date");
const amountInput = document.getElementById("amount");
const nameInput = document.getElementById("name");
const saveNameToggle = document.getElementById("saveName");
const fileLabel = document.getElementById("fileLabel");
const resetBtn = document.getElementById("resetBtn");
const dropZone = document.getElementById("dropZone");
const fileNamePreview = document.getElementById("fileNamePreview");

// ファイル名プレビューを更新する関数
function updateFileNamePreview() {
  if (!fileNamePreview) return;
  const date = dateInput && dateInput.value ? dateInput.value : "yyyy_mm_dd";
  const amount = amountInput && amountInput.value ? amountInput.value.trim() : "金額";
  const name = nameInput && nameInput.value ? nameInput.value.trim() : "氏名";
  const datePart = date.replace(/-/g, "_");
  const sanitizedName = name.replace(/[\/\\?%*:|"<>]/g, "_");
  fileNamePreview.textContent = `${datePart}_${amount}_${sanitizedName}.jpg`;
}

// 日付フィールドに今日の日付をセット
if (dateInput) {
  const today = new Date();
  dateInput.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

// 各フィールドの変更でファイル名プレビューを更新
[dateInput, amountInput, nameInput].forEach(el => {
  if (el) el.addEventListener("input", updateFileNamePreview);
});
updateFileNamePreview();

// 名前保存の復元
if (saveNameToggle && nameInput) {
  const saved = localStorage.getItem("savedName");
  if (saved !== null) {
    saveNameToggle.checked = true;
    nameInput.value = saved;
  }

  // トグル操作時
  saveNameToggle.addEventListener("change", () => {
    if (saveNameToggle.checked) {
      localStorage.setItem("savedName", nameInput.value);
    } else {
      localStorage.removeItem("savedName");
    }
  });

  // 名前入力時、保存がオンなら即時反映
  nameInput.addEventListener("input", () => {
    if (saveNameToggle.checked) {
      localStorage.setItem("savedName", nameInput.value);
    }
  });
}
const imageInput = document.getElementById("imageInput");
const previewContainer = document.getElementById("previewContainer");
const previewImage = document.getElementById("previewImage");
const fileInfo = document.getElementById("fileInfo");
const processBtn = document.getElementById("processBtn");

// リセットボタン
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    imageInput.value = "";
    previewImage.src = "";
    previewContainer.style.display = "none";
    fileInfo.textContent = "";
    if (fileLabel) fileLabel.textContent = "クリックまたはドラッグ＆ドロップ";
  });
}

// 必須要素の確認（スクリプトが正しく動くため）
if (!processBtn || !imageInput || !amountInput || !nameInput) {
  alert("画面の読み込みに失敗しました。ページを再読み込みしてください。");
  console.error("不足している要素:", { processBtn: !!processBtn, imageInput: !!imageInput, amountInput: !!amountInput, nameInput: !!nameInput });
}

// 画像プレビューの表示
if (imageInput) {
imageInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    if (fileLabel) fileLabel.textContent = file.name;

    console.log("選択されたファイル:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const fileTypeInfo = isHEICFile(file)
      ? "HEIC（JPEGに変換します）"
      : (file.type || file.name.split(".").pop().toUpperCase() + "（画像として処理します）");
    
    fileInfo.textContent = `選択されたファイル: ${file.name} (${(
      file.size / 1024
    ).toFixed(2)} KB) - 形式: ${fileTypeInfo}`;

    // HEICファイルの場合は変換してからプレビュー
    if (isHEICFile(file)) {
      fileInfo.textContent += " (変換中...)";
      convertHEICToBlob(file)
        .then((jpegBlob) => {
          const r = new FileReader();
          r.onload = function(ev) {
            previewImage.src = ev.target.result;
            previewContainer.style.display = "block";
          };
          r.readAsDataURL(jpegBlob);
        })
        .catch((error) => {
          console.error("HEICプレビュー変換エラー:", error);
          fileInfo.textContent = `選択されたファイル: ${file.name} (${(file.size / 1024).toFixed(2)} KB) - 形式: HEIC（プレビュー不可、変換は可能）`;
        });
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
    if (fileLabel) fileLabel.textContent = "クリックまたはドラッグ＆ドロップ";
    previewContainer.style.display = "none";
    fileInfo.textContent = "";
  }
});
}

// ドラッグ＆ドロップでファイルをセットするヘルパー
function handleDroppedFile(file) {
  if (!file) return;
  const dt = new DataTransfer();
  dt.items.add(file);
  imageInput.files = dt.files;
  imageInput.dispatchEvent(new Event("change"));
}

// ドロップゾーン（ファイル選択ラベル）へのドラッグ＆ドロップ
if (dropZone) {
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });
  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    handleDroppedFile(e.dataTransfer.files[0]);
  });
}

// プレビュー表示中にドロップすると画像を置き換え
if (previewContainer) {
  previewContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    previewContainer.classList.add("dragover");
  });
  previewContainer.addEventListener("dragleave", () => {
    previewContainer.classList.remove("dragover");
  });
  previewContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    previewContainer.classList.remove("dragover");
    handleDroppedFile(e.dataTransfer.files[0]);
  });
}

// ボタンクリックで処理（type="button"にしているのでフォーム送信・リセットされない）
if (processBtn) {
processBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  e.stopPropagation();

  // すぐにボタンを「処理中」にしてフィードバックを表示
  processBtn.disabled = true;
  processBtn.textContent = "処理中...";

  const date = (dateInput && dateInput.value) ? dateInput.value : "";
  const amount = (amountInput && amountInput.value) ? amountInput.value.trim() : "";
  const name = (nameInput && nameInput.value) ? nameInput.value.trim() : "";
  const file = imageInput && imageInput.files && imageInput.files[0];

  if (!file) {
    alert("画像を選択してください");
    processBtn.disabled = false;
    processBtn.textContent = "ぽんと保存する ✨";
    return;
  }

  if (!date || !amount || !name) {
    alert("日付・金額・氏名を入力してください");
    processBtn.disabled = false;
    processBtn.textContent = "ぽんと保存する ✨";
    return;
  }

  try {
    // 画像をJPEG形式に変換
    const jpegBlob = await convertToJPEG(file);

    // ファイル名を生成
    const fileName = generateFileName(date, amount, name);

    // ダウンロード（保存ダイアログは downloadFile 内で表示）
    await downloadFile(jpegBlob, fileName);

    // 成功メッセージ（downloadFile内で既に表示する場合はスキップ）
    if (!window.electronAPI) {
      alert("画像の処理が完了しました！ダウンロードを開始します。");
    }
  } catch (error) {
    console.error("エラー:", error);
    alert("エラーが発生しました: " + error.message);
  } finally {
    // ボタンを再有効化
    processBtn.disabled = false;
    processBtn.textContent = "ぽんと保存する ✨";
  }
});
}

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

// HEICをJPEGのBlobに変換するヘルパー（sips優先、heic2anyフォールバック）
async function convertHEICToBlob(file) {
  // Electron環境ではmacOSネイティブのsipsを使用
  if (window.electronAPI && window.electronAPI.convertHeic) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await window.electronAPI.convertHeic(Array.from(new Uint8Array(arrayBuffer)));
    if (result.success) {
      return new Blob([new Uint8Array(result.buffer)], { type: "image/jpeg" });
    }
    throw new Error(result.message);
  }
  // フォールバック: heic2any（ブラウザ環境）
  if (typeof heic2any === "undefined") {
    throw new Error("HEIC変換ライブラリが読み込まれていません。ページを再読み込みしてください。");
  }
  const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
  return Array.isArray(converted) ? converted[0] : converted;
}

// 画像をJPEG形式に変換する関数
async function convertToJPEG(file) {
  console.log("convertToJPEG開始:", {
    name: file.name,
    type: file.type,
    size: file.size,
  });

  // HEICファイルの場合
  if (isHEICFile(file)) {
    console.log("HEICファイルを検出、変換します");
    try {
      const jpegBlob = await convertHEICToBlob(file);
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
function generateFileName(date, amount, name) {
  // "YYYY-MM-DD" → "YYYY_MM_DD"
  const datePart = date.replace(/-/g, "_");
  const sanitizedName = name.replace(/[\/\\?%*:|"<>]/g, "_");
  return `${datePart}_${amount}_${sanitizedName}.jpg`;
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
