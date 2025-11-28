/**
 * メインエントリーポイント
 * アプリケーションの初期化とシーン管理
 */
import { Scene } from './classes/Scene.js';
import { CONFIG } from './config.js';

/**
 * アプリケーション初期化
 */
function initApp() {
  // A-Frameシーンが読み込まれるのを待つ
  const sceneEl = document.querySelector('a-scene');

  if (sceneEl.hasLoaded) {
    // すでに読み込まれている場合
    onSceneLoaded();
  } else {
    // 読み込み完了を待つ
    sceneEl.addEventListener('loaded', onSceneLoaded);
  }
}

/**
 * シーン読み込み完了時の処理
 */
async function onSceneLoaded() {
  console.log('A-Frameシーンが読み込まれました');

  // シーンを初期化
  const scene = new Scene(CONFIG);
  await scene.init();

  // グローバルスコープに公開（デバッグ用）
  window.appScene = scene;

  // パターン切り替えボタンの設定
  setupPatternControls(scene);

  console.log('アプリケーションの初期化が完了しました');
  console.log('デバッグ: window.appScene でシーンにアクセスできます');
}

/**
 * パターン切り替えコントロールを設定
 * @param {Scene} scene - シーンインスタンス
 */
function setupPatternControls(scene) {
  const patternNameElement = document.getElementById('current-pattern-name');
  const nextPatternBtn = document.getElementById('next-pattern-btn');

  // 現在のパターン名を表示
  function updatePatternDisplay() {
    const patternInfo = scene.getCurrentPatternInfo();
    if (patternInfo) {
      patternNameElement.textContent = `${patternInfo.name} (${patternInfo.index + 1}/${patternInfo.total})`;
    } else {
      patternNameElement.textContent = '読み込みエラー';
    }
  }

  // 初期表示
  updatePatternDisplay();

  // ボタンクリックイベント
  nextPatternBtn.addEventListener('click', () => {
    // ボタンを一時的に無効化
    nextPatternBtn.disabled = true;

    // パターン切り替え
    const success = scene.switchToNextPattern();

    if (success) {
      // 表示を更新
      updatePatternDisplay();
    }

    // ボタンを再度有効化（少し遅延を入れて連続クリックを防ぐ）
    setTimeout(() => {
      nextPatternBtn.disabled = false;
    }, 500);
  });

  console.log('パターン切り替えコントロールを設定しました');
}

/**
 * DOM読み込み完了時にアプリケーションを初期化
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// エクスポート（他のモジュールから使用する場合）
export { initApp };
