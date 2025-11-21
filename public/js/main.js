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
function onSceneLoaded() {
  console.log('A-Frameシーンが読み込まれました');

  // シーンを初期化
  const scene = new Scene(CONFIG);
  scene.init();

  // グローバルスコープに公開（デバッグ用）
  window.appScene = scene;

  console.log('アプリケーションの初期化が完了しました');
  console.log('デバッグ: window.appScene でシーンにアクセスできます');
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
