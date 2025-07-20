// パスワード設定（実際の使用時は変更してください）
const CORRECT_PASSWORD = '2142';
const TARGET_URL = 'https://note.com/preview/n4281509cae94?prev_access_key=980226065ccc78ba978166fcffc64627';

// DOM要素の取得
const passwordScreen = document.getElementById('passwordScreen');
const noteContent = document.getElementById('noteContent');
const passwordForm = document.getElementById('passwordForm');
const passwordInput = document.getElementById('passwordInput');
const submitBtn = document.getElementById('submitBtn');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');

// 全角数字を半角に変換する関数
function normalizePassword(password) {
    return password.replace(/[０-９]/g, function(match) {
        return String.fromCharCode(match.charCodeAt(0) - 0xFEE0);
    });
}

// パスワードフォームの送信処理
passwordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const enteredPassword = passwordInput.value.trim();
    
    if (!enteredPassword) {
        showError('パスワードを入力してください');
        return;
    }
    
    // ローディング状態を表示
    setLoadingState(true);
    
    // パスワードを正規化（全角→半角変換）
    const normalizedPassword = normalizePassword(enteredPassword);
    
    // パスワード検証をシミュレート（実際の使用時はサーバーサイドで検証）
    setTimeout(() => {
        if (normalizedPassword === CORRECT_PASSWORD) {
            redirectToNote();
        } else {
            showError('パスワードが正しくありません');
            setLoadingState(false);
        }
    }, 1000);
});

// パスワード入力フィールドのEnterキー処理
passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        passwordForm.dispatchEvent(new Event('submit'));
    }
});

// エラーメッセージを表示
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    errorMessage.style.color = '#e74c3c';
    
    // 3秒後にエラーメッセージを非表示
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 3000);
}

// 成功メッセージを表示
function showSuccessMessage(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    errorMessage.style.color = '#27ae60';
    
    // 3秒後にメッセージを非表示
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 3000);
}

// ローディング状態の設定
function setLoadingState(isLoading) {
    const submitBtn = document.querySelector('.submit-btn');
    
    if (isLoading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Noteページにリダイレクト
function redirectToNote() {
    // ローディング状態を解除
    setLoadingState(false);
    
    // 成功メッセージを表示
    console.log('パスワードが正しく入力されました。noteページにリダイレクトします...');
    
    // リダイレクトメッセージを表示
    showSuccessMessage('認証成功！noteページに移動します...');
    
    // 1秒後にnoteページにリダイレクト
    setTimeout(() => {
        window.location.href = TARGET_URL;
    }, 1000);
}

// Noteのロック解除（デモ用）
function unlockNote() {
    // パスワード画面を非表示
    passwordScreen.style.display = 'none';
    
    // Noteコンテンツを表示
    noteContent.style.display = 'block';
    
    // パスワード入力をクリア
    passwordInput.value = '';
    
    // ローディング状態を解除
    setLoadingState(false);
    
    // 成功メッセージを表示（オプション）
    console.log('Noteが正常にロック解除されました');
    
    // URLにハッシュを追加して状態を保存（オプション）
    window.location.hash = 'unlocked';
}

// Noteを再ロック
function lockNote() {
    // Noteコンテンツを非表示
    noteContent.style.display = 'none';
    
    // パスワード画面を表示
    passwordScreen.style.display = 'block';
    
    // パスワード入力をクリア
    passwordInput.value = '';
    
    // エラーメッセージをクリア
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
    
    // パスワード入力フィールドにフォーカス
    passwordInput.focus();
    
    // URLのハッシュをクリア
    window.location.hash = '';
}

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
    // パスワード入力フィールドにフォーカス
    passwordInput.focus();
    
    // URLハッシュから状態を復元（オプション）
    if (window.location.hash === '#unlocked') {
        unlockNote();
    }
    
    // パスワード入力フィールドの自動フォーカス
    passwordInput.addEventListener('blur', function() {
        if (passwordScreen.style.display !== 'none') {
            setTimeout(() => {
                passwordInput.focus();
            }, 100);
        }
    });
});

// セキュリティ機能：右クリック無効化（オプション）
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// セキュリティ機能：開発者ツール無効化（オプション）
document.addEventListener('keydown', function(e) {
    // F12キーを無効化
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+I (開発者ツール) を無効化
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+U (ソース表示) を無効化
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
    }
});

// パスワード強度チェック機能（オプション）
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
}

// パスワード入力時のリアルタイム検証（オプション）
passwordInput.addEventListener('input', function() {
    const password = this.value;
    const strength = checkPasswordStrength(password);
    
    // パスワード強度に応じてボーダーカラーを変更
    this.style.borderColor = strength >= 3 ? '#27ae60' : '#e0e0e0';
});

// セッション管理（オプション）
function setSession() {
    const sessionData = {
        unlocked: true,
        timestamp: Date.now()
    };
    sessionStorage.setItem('noteSession', JSON.stringify(sessionData));
}

function checkSession() {
    const sessionData = sessionStorage.getItem('noteSession');
    if (sessionData) {
        const session = JSON.parse(sessionData);
        const now = Date.now();
        const sessionTimeout = 30 * 60 * 1000; // 30分
        
        if (session.unlocked && (now - session.timestamp) < sessionTimeout) {
            return true;
        }
    }
    return false;
}

// セッションチェックを有効にする場合は、unlockNote関数に以下を追加：
// setSession();

// セッション復元を有効にする場合は、DOMContentLoadedに以下を追加：
// if (checkSession()) {
//     unlockNote();
// } 