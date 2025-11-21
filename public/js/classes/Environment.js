/**
 * Environmentクラス
 * A-Frame環境（aframe-environment-component）を管理
 */
export class Environment {
  /**
   * @param {Object} config - 環境設定オブジェクト
   */
  constructor(config) {
    this.config = config;
    this.entity = null;
  }

  /**
   * 環境エンティティを作成
   * @param {HTMLElement} scene - A-Frameシーン要素
   */
  create(scene) {
    this.entity = document.createElement('a-entity');

    // 環境設定を文字列に変換
    const envString = Object.entries(this.config)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');

    this.entity.setAttribute('environment', envString);
    scene.appendChild(this.entity);

    return this.entity;
  }

  /**
   * 環境設定を更新
   * @param {string} key - 設定キー
   * @param {any} value - 設定値
   */
  updateConfig(key, value) {
    this.config[key] = value;
    if (this.entity) {
      this.entity.setAttribute('environment', key, value);
    }
  }

  /**
   * 環境エンティティを削除
   */
  remove() {
    if (this.entity && this.entity.parentNode) {
      this.entity.parentNode.removeChild(this.entity);
      this.entity = null;
    }
  }

  /**
   * 環境エンティティを取得
   * @returns {HTMLElement|null}
   */
  getEntity() {
    return this.entity;
  }
}
