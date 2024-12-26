// HTML要素を取得
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const croppedImage = document.getElementById('croppedImage');

// エラーメッセージ表示エリア
const errorMessage = document.createElement('p');
errorMessage.style.color = 'red';
errorMessage.style.marginTop = '10px';
errorMessage.style.fontSize = '14px';
uploadZone.appendChild(errorMessage);

// 画像ファイルの読み込みとサイズチェック
function handleImageUpload(file) {
    if (!file.type.match('image/(jpeg|png)')) {
        showError('形式が違います（jpgまたはpngのみ対応）');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            if (img.width === 800 && img.height === 2000) {
                cropImage(img);
                clearError();
            } else {
                showError('サイズが違います（800×2000pxのみ対応）');
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 画像を切り取る処理
function cropImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 切り取る範囲を指定
    canvas.width = 800;
    canvas.height = 1190; // 2000px - 360px (上) - 450px (下)
    ctx.drawImage(img, 0, -360, 800, 2000);

    // 切り取った画像をプレビューに表示
    croppedImage.src = canvas.toDataURL();
}

// エラーメッセージを表示
function showError(message) {
    errorMessage.textContent = message;
}

// エラーメッセージをクリア
function clearError() {
    errorMessage.textContent = '';
}

// ドラッグアンドドロップのイベント
uploadZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadZone.style.borderColor = "#28a745";
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.style.borderColor = "#007bff";
});

uploadZone.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadZone.style.borderColor = "#007bff";
    const file = event.dataTransfer.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

// ファイル選択のイベント
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});
