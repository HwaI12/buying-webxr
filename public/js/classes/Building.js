/**
 * Buildingクラス
 * 建物オブジェクト（ボックス）を管理
 */
export class Building {
  /**
   * @param {Object} config - 建物設定オブジェクト
   * @param {string} config.id - 建物ID
   * @param {Object} config.position - 位置 {x, y, z}
   * @param {Object} config.dimensions - サイズ {width, height, depth}
   * @param {string} config.color - 色
   */
  constructor(config) {
    this.id = config.id;
    this.position = config.position;
    this.dimensions = config.dimensions;
    this.color = config.color;
    this.entity = null;
  }

  /**
   * 建物エンティティを作成
   * @param {HTMLElement} scene - A-Frameシーン要素
   */
  create(scene) {
    this.entity = document.createElement('a-box');

    // 位置設定
    this.entity.setAttribute('position',
      `${this.position.x} ${this.position.y} ${this.position.z}`);

    // サイズ設定
    this.entity.setAttribute('width', this.dimensions.width);
    this.entity.setAttribute('height', this.dimensions.height);
    this.entity.setAttribute('depth', this.dimensions.depth);

    // 色設定
    this.entity.setAttribute('color', this.color);

    scene.appendChild(this.entity);

    return this.entity;
  }

  /**
   * 位置を更新
   * @param {Object} position - 新しい位置 {x, y, z}
   */
  setPosition(position) {
    this.position = { ...this.position, ...position };
    if (this.entity) {
      this.entity.setAttribute('position',
        `${this.position.x} ${this.position.y} ${this.position.z}`);
    }
  }

  /**
   * サイズを更新
   * @param {Object} dimensions - 新しいサイズ {width, height, depth}
   */
  setDimensions(dimensions) {
    this.dimensions = { ...this.dimensions, ...dimensions };
    if (this.entity) {
      if (dimensions.width) {
        this.entity.setAttribute('width', dimensions.width);
      }
      if (dimensions.height) {
        this.entity.setAttribute('height', dimensions.height);
      }
      if (dimensions.depth) {
        this.entity.setAttribute('depth', dimensions.depth);
      }
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
