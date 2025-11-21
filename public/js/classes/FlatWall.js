/**
 * FlatWallクラス
 * 平らな壁を管理
 */
export class FlatWall {
  /**
   * @param {Object} config - 壁設定オブジェクト
   * @param {string} config.id - 壁ID
   * @param {Object} config.position - 位置 {x, y, z}
   * @param {number} config.width - 壁の幅
   * @param {number} config.height - 壁の高さ
   * @param {Object} config.rotation - 回転 {x, y, z}
   * @param {string} config.color - 色
   * @param {string} config.texture - テクスチャ画像のパス（オプション）
   * @param {number} config.repeat - テクスチャの繰り返し回数
   */
  constructor(config) {
    this.id = config.id;
    this.position = config.position;
    this.width = config.width;
    this.height = config.height;
    this.rotation = config.rotation || { x: 0, y: 0, z: 0 };
    this.color = config.color || "#ffffff";
    this.texture = config.texture;
    this.repeat = config.repeat || { x: 1, y: 1 };
    this.entity = null;
  }

  /**
   * 壁エンティティを作成
   * @param {HTMLElement} scene - A-Frameシーン要素
   */
  create(scene) {
    // a-planeエンティティを作成
    this.entity = document.createElement("a-plane");
    this.entity.setAttribute("id", this.id);

    // 位置設定
    this.entity.setAttribute(
      "position",
      `${this.position.x} ${this.position.y} ${this.position.z}`
    );

    // 回転設定
    this.entity.setAttribute(
      "rotation",
      `${this.rotation.x} ${this.rotation.y} ${this.rotation.z}`
    );

    // サイズ設定
    this.entity.setAttribute("width", this.width);
    this.entity.setAttribute("height", this.height);

    // マテリアル設定
    if (this.texture) {
      this.entity.setAttribute("src", this.texture);
      this.entity.setAttribute(
        "material",
        `repeat: ${this.repeat.x} ${this.repeat.y}; transparent: false; opacity: 1; side: double`
      );
    } else {
      this.entity.setAttribute("color", this.color);
      this.entity.setAttribute(
        "material",
        "transparent: false; opacity: 1; side: double"
      );
    }

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
      this.entity.setAttribute(
        "position",
        `${this.position.x} ${this.position.y} ${this.position.z}`
      );
    }
  }

  /**
   * サイズを更新
   * @param {number} width - 新しい幅
   * @param {number} height - 新しい高さ
   */
  setSize(width, height) {
    this.width = width;
    this.height = height;
    if (this.entity) {
      this.entity.setAttribute("width", width);
      this.entity.setAttribute("height", height);
    }
  }

  /**
   * テクスチャを更新
   * @param {string} texture - 新しいテクスチャのパス
   */
  setTexture(texture) {
    this.texture = texture;
    if (this.entity) {
      this.entity.setAttribute("src", texture);
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
