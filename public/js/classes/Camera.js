/**
 * Cameraクラス
 * カメラ、コントロール、カーソルを管理
 */
export class Camera {
  /**
   * @param {Object} config - カメラ設定オブジェクト
   * @param {Object} config.position - 位置 {x, y, z}
   * @param {Object} config.rotation - 回転 {x, y, z} (オプション)
   * @param {boolean} config.wasdControlsEnabled - WASDコントロールの有効化
   * @param {Object} config.lookControls - ルックコントロール設定
   * @param {Object} config.cursor - カーソル設定
   */
  constructor(config) {
    this.position = config.position;
    this.rotation = config.rotation || { x: 0, y: 0, z: 0 };
    this.wasdControlsEnabled = config.wasdControlsEnabled;
    this.lookControls = config.lookControls;
    this.cursorConfig = config.cursor;
    this.entity = null;
    this.cameraElement = null;
    this.cursorElement = null;
  }

  /**
   * カメラエンティティを作成
   * @param {HTMLElement} scene - A-Frameシーン要素
   */
  create(scene) {
    // カメラを包むエンティティを作成
    this.entity = document.createElement('a-entity');
    this.entity.setAttribute('position',
      `${this.position.x} ${this.position.y} ${this.position.z}`);
    this.entity.setAttribute('rotation',
      `${this.rotation.x} ${this.rotation.y} ${this.rotation.z}`);

    // カメラ要素を作成
    this.cameraElement = document.createElement('a-camera');
    this.cameraElement.setAttribute('wasd-controls-enabled', this.wasdControlsEnabled);

    // ルックコントロール設定
    const lookControlsString = Object.entries(this.lookControls)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
    this.cameraElement.setAttribute('look-controls', lookControlsString);

    // カーソルを作成
    this.cursorElement = document.createElement('a-cursor');
    this.cursorElement.setAttribute('color', this.cursorConfig.color);
    this.cursorElement.setAttribute('opacity', this.cursorConfig.opacity);
    this.cursorElement.setAttribute('raycaster',
      `objects: ${this.cursorConfig.raycasterObjects}`);

    // カーソルをカメラに追加
    this.cameraElement.appendChild(this.cursorElement);

    // カメラをエンティティに追加
    this.entity.appendChild(this.cameraElement);

    // エンティティをシーンに追加
    scene.appendChild(this.entity);

    return this.entity;
  }

  /**
   * カメラ位置を更新
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
   * WASDコントロールの有効/無効を切り替え
   * @param {boolean} enabled - 有効化フラグ
   */
  setWasdControls(enabled) {
    this.wasdControlsEnabled = enabled;
    if (this.cameraElement) {
      this.cameraElement.setAttribute('wasd-controls-enabled', enabled);
    }
  }

  /**
   * カーソルの色を変更
   * @param {string} color - 新しい色
   */
  setCursorColor(color) {
    this.cursorConfig.color = color;
    if (this.cursorElement) {
      this.cursorElement.setAttribute('color', color);
    }
  }

  /**
   * エンティティを削除
   */
  remove() {
    if (this.entity && this.entity.parentNode) {
      this.entity.parentNode.removeChild(this.entity);
      this.entity = null;
      this.cameraElement = null;
      this.cursorElement = null;
    }
  }

  /**
   * カメラエンティティを取得
   * @returns {HTMLElement|null}
   */
  getEntity() {
    return this.entity;
  }

  /**
   * カメラ要素を取得
   * @returns {HTMLElement|null}
   */
  getCameraElement() {
    return this.cameraElement;
  }
}
