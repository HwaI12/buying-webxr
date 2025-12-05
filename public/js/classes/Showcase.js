/**
 * Showcaseクラス
 * ショーケースの3Dモデルを管理
 */
export class Showcase {
  /**
   * @param {Object} config - ショーケース設定オブジェクト
   * @param {string} config.id - ショーケースID
   * @param {string} config.modelSrc - GLTFモデルのソースパス
   * @param {Object} config.position - 位置 {x, y, z}
   * @param {Object} config.rotation - 回転 {x, y, z}
   * @param {Object} config.scale - スケール {x, y, z}
   */
  constructor(config) {
    this.id = config.id;
    this.modelSrc = config.modelSrc;
    this.position = config.position;
    this.rotation = config.rotation;
    this.scale = config.scale;
    this.entity = null;
    this.assetItem = null;
  }

  /**
   * アセットアイテムを作成
   * @param {HTMLElement} assets - A-Frameのa-assets要素
   */
  createAsset(assets) {
    this.assetItem = document.createElement('a-asset-item');
    this.assetItem.setAttribute('id', `${this.id}-gltf`);
    this.assetItem.setAttribute('src', this.modelSrc);
    assets.appendChild(this.assetItem);

    return this.assetItem;
  }

  /**
   * ショーケースエンティティを作成
   * @param {HTMLElement} scene - A-Frameシーン要素
   */
  create(scene) {
    this.entity = document.createElement('a-entity');
    this.entity.setAttribute('gltf-model', `#${this.id}-gltf`);

    // 位置設定
    this.entity.setAttribute('position',
      `${this.position.x} ${this.position.y} ${this.position.z}`);

    // 回転設定
    this.entity.setAttribute('rotation',
      `${this.rotation.x} ${this.rotation.y} ${this.rotation.z}`);

    // スケール設定
    this.entity.setAttribute('scale',
      `${this.scale.x} ${this.scale.y} ${this.scale.z}`);

    // クリック可能にする（カーソルで選択可能）
    this.entity.setAttribute('class', 'clickable');
    this.entity.setAttribute('data-product-id', this.id);

    scene.appendChild(this.entity);

    return this.entity;
  }

  /**
   * クリックイベントリスナーを追加
   * @param {Function} callback - クリック時のコールバック関数
   */
  onClick(callback) {
    if (this.entity) {
      this.entity.addEventListener('click', (event) => {
        callback(this.id, event);
      });
    }
  }

  /**
   * カーソル進入イベントリスナーを追加（ホバー開始）
   * @param {Function} callback - コールバック関数
   */
  onCursorEnter(callback) {
    if (this.entity) {
      this.entity.addEventListener('mouseenter', (event) => {
        callback(this.id, event);
      });
    }
  }

  /**
   * カーソル退出イベントリスナーを追加（ホバー終了）
   * @param {Function} callback - コールバック関数
   */
  onCursorLeave(callback) {
    if (this.entity) {
      this.entity.addEventListener('mouseleave', (event) => {
        callback(this.id, event);
      });
    }
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
   * 回転を更新
   * @param {Object} rotation - 新しい回転 {x, y, z}
   */
  setRotation(rotation) {
    this.rotation = { ...this.rotation, ...rotation };
    if (this.entity) {
      this.entity.setAttribute('rotation',
        `${this.rotation.x} ${this.rotation.y} ${this.rotation.z}`);
    }
  }

  /**
   * スケールを更新
   * @param {Object} scale - 新しいスケール {x, y, z}
   */
  setScale(scale) {
    this.scale = { ...this.scale, ...scale };
    if (this.entity) {
      this.entity.setAttribute('scale',
        `${this.scale.x} ${this.scale.y} ${this.scale.z}`);
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
    if (this.assetItem && this.assetItem.parentNode) {
      this.assetItem.parentNode.removeChild(this.assetItem);
      this.assetItem = null;
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
