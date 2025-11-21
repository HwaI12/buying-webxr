/**
 * Wallクラス
 * テクスチャ付きの円筒状の壁を管理
 */
export class Wall {
  /**
   * @param {Object} config - 壁設定オブジェクト
   * @param {string} config.id - 壁ID
   * @param {Object} config.center - 中心位置 {x, y, z}
   * @param {number} config.radius - 半径
   * @param {number} config.height - 壁の高さ
   * @param {number} config.thetaStart - 開始角度（度）
   * @param {number} config.thetaLength - 角度の長さ（度）
   * @param {string} config.color - 色
   * @param {boolean} config.openEnded - 上下を開くか（デフォルト: true）
   * @param {string} config.side - 表示する面 ('front', 'back', 'double')
   * @param {string} config.texture - テクスチャ画像のパス（オプション）
   */
  constructor(config) {
    this.id = config.id;
    this.center = config.center;
    this.radius = config.radius;
    this.height = config.height;
    this.thetaStart = config.thetaStart || 0;
    this.thetaLength = config.thetaLength || 360;
    this.color = config.color;
    this.openEnded = config.openEnded !== undefined ? config.openEnded : true;
    this.side = config.side || "double";
    this.texture = config.texture;
    this.entity = null;
  }

  /**
   * 壁エンティティを作成
   * @param {HTMLElement} scene - A-Frameシーン要素
   */
  create(scene) {
    // a-cylinderエンティティを作成
    this.entity = document.createElement("a-cylinder");
    this.entity.setAttribute("id", this.id);

    // 位置設定
    const y = this.center.y + this.height / 2;
    this.entity.setAttribute(
      "position",
      `${this.center.x} ${y} ${this.center.z}`
    );

    // 円筒のプロパティ設定
    this.entity.setAttribute("radius", this.radius);
    this.entity.setAttribute("height", this.height);
    this.entity.setAttribute("theta-start", this.thetaStart);
    this.entity.setAttribute("theta-length", this.thetaLength);
    this.entity.setAttribute("open-ended", this.openEnded);
    this.entity.setAttribute("side", this.side);

    // マテリアル設定
    if (this.texture) {
      this.entity.setAttribute("src", this.texture);
      this.entity.setAttribute(
        "material",
        "transparent: false; opacity: 1; side: double"
      );
    } else {
      this.entity.setAttribute("color", this.color);
    }

    // セグメント数を設定（滑らかさのため）
    this.entity.setAttribute("segments-radial", 64);
    this.entity.setAttribute("segments-height", 1);

    scene.appendChild(this.entity);

    return this.entity;
  }

  /**
   * 色を更新
   * @param {string} color - 新しい色
   */
  setColor(color) {
    this.color = color;
    if (this.entity) {
      this.entity.setAttribute("color", color);
    }
  }

  /**
   * 壁の高さを更新
   * @param {number} height - 新しい高さ
   */
  setHeight(height) {
    this.height = height;
    if (this.entity) {
      const y = this.center.y + height / 2;
      this.entity.setAttribute(
        "position",
        `${this.center.x} ${y} ${this.center.z}`
      );
      this.entity.setAttribute("height", height);
    }
  }

  /**
   * 半径を更新
   * @param {number} radius - 新しい半径
   */
  setRadius(radius) {
    this.radius = radius;
    if (this.entity) {
      this.entity.setAttribute("radius", radius);
    }
  }

  /**
   * 角度範囲を更新
   * @param {number} thetaStart - 開始角度（度）
   * @param {number} thetaLength - 角度の長さ（度）
   */
  setTheta(thetaStart, thetaLength) {
    this.thetaStart = thetaStart;
    this.thetaLength = thetaLength;
    if (this.entity) {
      this.entity.setAttribute("theta-start", thetaStart);
      this.entity.setAttribute("theta-length", thetaLength);
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
