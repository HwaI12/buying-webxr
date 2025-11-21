/**
 * Lightクラス
 * シーンの照明を管理
 */
export class Light {
  /**
   * @param {Object} config - 照明設定オブジェクト
   * @param {string} config.type - 照明タイプ (ambient, directional, point, spot, hemisphere)
   * @param {string} config.color - 照明の色
   * @param {number} config.intensity - 照明の強度 (0-1)
   * @param {Object} config.position - 位置 {x, y, z} (directional, point, spot用)
   */
  constructor(config) {
    this.type = config.type || 'ambient';
    this.color = config.color || '#ffffff';
    this.intensity = config.intensity !== undefined ? config.intensity : 1;
    this.position = config.position || { x: 0, y: 5, z: 0 };
    this.entity = null;
  }

  /**
   * 照明エンティティを作成
   * @param {HTMLElement} scene - A-Frameシーン要素
   */
  create(scene) {
    this.entity = document.createElement('a-light');

    // 照明タイプ設定
    this.entity.setAttribute('type', this.type);

    // 色設定
    this.entity.setAttribute('color', this.color);

    // 強度設定
    this.entity.setAttribute('intensity', this.intensity);

    // 位置設定（ambient以外）
    if (this.type !== 'ambient' && this.type !== 'hemisphere') {
      this.entity.setAttribute('position',
        `${this.position.x} ${this.position.y} ${this.position.z}`);
    }

    scene.appendChild(this.entity);

    return this.entity;
  }

  /**
   * 強度を更新
   * @param {number} intensity - 新しい強度 (0-1)
   */
  setIntensity(intensity) {
    this.intensity = intensity;
    if (this.entity) {
      this.entity.setAttribute('intensity', intensity);
    }
  }

  /**
   * 色を更新
   * @param {string} color - 新しい色
   */
  setColor(color) {
    this.color = color;
    if (this.entity) {
      this.entity.setAttribute('color', color);
    }
  }

  /**
   * 位置を更新
   * @param {Object} position - 新しい位置 {x, y, z}
   */
  setPosition(position) {
    this.position = { ...this.position, ...position };
    if (this.entity && this.type !== 'ambient' && this.type !== 'hemisphere') {
      this.entity.setAttribute('position',
        `${this.position.x} ${this.position.y} ${this.position.z}`);
    }
  }

  /**
   * エンティティを削除
   */
  remove() {
    if (this.entity && this.entity.parentNode) {
      this.entity.parentNode.removeChild(this.entity);
      this.entity = null;
    }
  }

  /**
   * エンティティを取得
   * @returns {HTMLElement|null}
   */
  getEntity() {
    return this.entity;
  }
}
