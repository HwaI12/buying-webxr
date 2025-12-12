/**
 * Productクラス
 * お皿の上に配置する商品（ケーキ）を管理
 */
export class Product {
  /**
   * @param {Object} config - 商品設定オブジェクト
   * @param {string} config.id - 商品ID
   * @param {string} config.plateId - お皿のID
   * @param {string} config.name - 商品名
   * @param {string} config.type - 'primitive' または 'model'
   * @param {Object} config.geometry - ジオメトリ設定（primitiveの場合）
   * @param {Object} config.material - マテリアル設定（primitiveの場合）
   * @param {string} config.modelSrc - モデルのパス（modelの場合）
   * @param {Object} config.positionOffset - お皿からの位置オフセット {x, y, z}
   * @param {Object} config.rotation - 回転 {x, y, z}
   * @param {Object} config.scale - スケール {x, y, z}
   * @param {Object} platePosition - お皿の位置 {x, y, z}
   */
  constructor(config, platePosition) {
    this.id = config.id;
    this.plateId = config.plateId;
    this.name = config.name;
    this.type = config.type || 'primitive';
    this.geometry = config.geometry;
    this.material = config.material;
    this.modelSrc = config.modelSrc;
    this.positionOffset = config.positionOffset;
    this.rotation = config.rotation;
    this.scale = config.scale;
    this.platePosition = platePosition;
    this.entity = null;
    this.assetItem = null;

    // 最終的な位置を計算（お皿の位置 + オフセット）
    this.position = {
      x: platePosition.x + this.positionOffset.x,
      y: platePosition.y + this.positionOffset.y,
      z: platePosition.z + this.positionOffset.z
    };
  }

  /**
   * アセットアイテムを作成（モデルの場合）
   * @param {HTMLElement} assets - A-Frameのa-assets要素
   */
  createAsset(assets) {
    if (this.type === 'model' && this.modelSrc) {
      this.assetItem = document.createElement('a-asset-item');
      this.assetItem.setAttribute('id', `${this.id}-gltf`);
      this.assetItem.setAttribute('src', this.modelSrc);
      assets.appendChild(this.assetItem);
      return this.assetItem;
    }
    return null;
  }

  /**
   * 商品エンティティを作成
   * @param {HTMLElement} scene - A-Frameシーン要素
   */
  create(scene) {
    this.entity = document.createElement('a-entity');

    if (this.type === 'primitive') {
      // プリミティブの場合
      this.createPrimitive();
    } else if (this.type === 'model') {
      // 3Dモデルの場合
      this.entity.setAttribute('gltf-model', `#${this.id}-gltf`);
    }

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
    this.entity.setAttribute('data-product-name', this.name);

    scene.appendChild(this.entity);

    return this.entity;
  }

  /**
   * プリミティブ形状を作成
   */
  createPrimitive() {
    if (!this.geometry || !this.geometry.primitive) {
      console.error('ジオメトリ設定が不正です:', this.geometry);
      return;
    }

    // ジオメトリの設定
    const geometryStr = this.formatGeometry();
    this.entity.setAttribute('geometry', geometryStr);

    // マテリアルの設定
    if (this.material) {
      const materialStr = this.formatMaterial();
      this.entity.setAttribute('material', materialStr);
    }
  }

  /**
   * ジオメトリ文字列をフォーマット
   * @returns {string}
   */
  formatGeometry() {
    const geo = this.geometry;
    let parts = [`primitive: ${geo.primitive}`];

    // プリミティブタイプに応じてパラメータを追加
    switch (geo.primitive) {
      case 'cylinder':
        if (geo.radius !== undefined) parts.push(`radius: ${geo.radius}`);
        if (geo.height !== undefined) parts.push(`height: ${geo.height}`);
        if (geo.segmentsRadial !== undefined) parts.push(`segmentsRadial: ${geo.segmentsRadial}`);
        if (geo.segmentsHeight !== undefined) parts.push(`segmentsHeight: ${geo.segmentsHeight}`);
        break;
      case 'box':
        if (geo.width !== undefined) parts.push(`width: ${geo.width}`);
        if (geo.height !== undefined) parts.push(`height: ${geo.height}`);
        if (geo.depth !== undefined) parts.push(`depth: ${geo.depth}`);
        break;
      case 'sphere':
        if (geo.radius !== undefined) parts.push(`radius: ${geo.radius}`);
        if (geo.segmentsWidth !== undefined) parts.push(`segmentsWidth: ${geo.segmentsWidth}`);
        if (geo.segmentsHeight !== undefined) parts.push(`segmentsHeight: ${geo.segmentsHeight}`);
        break;
      default:
        // その他のプリミティブタイプ
        Object.keys(geo).forEach(key => {
          if (key !== 'primitive') {
            parts.push(`${key}: ${geo[key]}`);
          }
        });
    }

    return parts.join('; ');
  }

  /**
   * マテリアル文字列をフォーマット
   * @returns {string}
   */
  formatMaterial() {
    const mat = this.material;
    let parts = [];

    if (mat.color !== undefined) parts.push(`color: ${mat.color}`);
    if (mat.roughness !== undefined) parts.push(`roughness: ${mat.roughness}`);
    if (mat.metalness !== undefined) parts.push(`metalness: ${mat.metalness}`);
    if (mat.opacity !== undefined) parts.push(`opacity: ${mat.opacity}`);
    if (mat.transparent !== undefined) parts.push(`transparent: ${mat.transparent}`);
    if (mat.shader !== undefined) parts.push(`shader: ${mat.shader}`);
    if (mat.src !== undefined) parts.push(`src: ${mat.src}`);

    return parts.join('; ');
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
