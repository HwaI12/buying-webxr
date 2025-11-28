/**
 * ThickWallクラス
 * 厚みのある壁を管理
 */
export class ThickWall {
  /**
   * @param {Object} config - 壁の設定オブジェクト
   * @param {string} config.id - 壁のID
   * @param {Object} config.position - 位置 {x, y, z}
   * @param {Object} config.dimensions - サイズ {width, height, depth}
   * @param {Object} config.rotation - 回転 {x, y, z}
   * @param {string} config.texture - テクスチャ画像のパス
   * @param {Object} config.repeat - テクスチャの繰り返し {x, y}
   * @param {string} config.color - 色
   */
  constructor(config) {
    this.id = config.id;
    this.position = config.position;
    this.dimensions = config.dimensions;
    this.rotation = config.rotation || { x: 0, y: 0, z: 0 };
    this.texture = config.texture;
    this.repeat = config.repeat || { x: 1, y: 1 };
    this.color = config.color || '#ffffff';
    this.entity = null;
  }

  /**
   * 壁エンティティを作成
   * @param {HTMLElement} scene - A-Frameシーン要素
   */
  create(scene) {
    this.entity = document.createElement('a-box');
    this.entity.setAttribute('id', this.id);

    // 位置設定
    this.entity.setAttribute('position',
      `${this.position.x} ${this.position.y} ${this.position.z}`);

    // 回転設定
    this.entity.setAttribute('rotation',
      `${this.rotation.x} ${this.rotation.y} ${this.rotation.z}`);

    // サイズ設定
    this.entity.setAttribute('width', this.dimensions.width);
    this.entity.setAttribute('height', this.dimensions.height);
    this.entity.setAttribute('depth', this.dimensions.depth);

    // マテリアル設定
    if (this.texture) {
      this.entity.setAttribute('src', this.texture);
      this.entity.setAttribute('material',
        `repeat: ${this.repeat.x} ${this.repeat.y}; roughness: 0.8; metalness: 0.1`);
    } else {
      this.entity.setAttribute('color', this.color);
      this.entity.setAttribute('material', 'roughness: 0.8; metalness: 0.1');
    }

    // 影を落とす・受け取る
    this.entity.setAttribute('shadow', 'cast: true; receive: true');

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
