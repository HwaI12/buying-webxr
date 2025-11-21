/**
 * Floorクラス
 * テクスチャ付きの床を管理
 */
export class Floor {
  /**
   * @param {Object} config - 床設定オブジェクト
   * @param {string} config.id - 床ID
   * @param {Object} config.position - 位置 {x, y, z}
   * @param {number} config.width - 床の幅
   * @param {number} config.height - 床の奥行き
   * @param {Object} config.rotation - 回転 {x, y, z}
   * @param {string} config.texture - テクスチャ画像のパス
   * @param {number} config.repeat - テクスチャの繰り返し回数
   * @param {string} config.color - 色（オプション）
   */
  constructor(config) {
    this.id = config.id;
    this.position = config.position;
    this.width = config.width;
    this.height = config.height;
    this.rotation = config.rotation;
    this.texture = config.texture;
    this.repeat = config.repeat || 1;
    this.color = config.color || "#ffffff";
    this.entity = null;
  }

  /**
   * 床エンティティを作成
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

    // 回転設定（水平に配置）
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
        `repeat: ${this.repeat} ${this.repeat}; transparent: false; opacity: 1; side: double`
      );
    } else {
      this.entity.setAttribute("color", this.color);
      this.entity.setAttribute(
        "material",
        "transparent: false; opacity: 1; side: double"
      );
    }

    // 影を受け取る
    this.entity.setAttribute("shadow", "receive: true");

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
   * @param {number} height - 新しい奥行き
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
   * テクスチャの繰り返しを更新
   * @param {number} repeat - 繰り返し回数
   */
  setRepeat(repeat) {
    this.repeat = repeat;
    if (this.entity) {
      this.entity.setAttribute("material", `repeat: ${repeat} ${repeat}`);
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
