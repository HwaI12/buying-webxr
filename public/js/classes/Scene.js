/**
 * Sceneクラス
 * A-Frameシーン全体を管理するメインクラス
 */
import { Environment } from "./Environment.js";
import { Showcase } from "./Showcase.js";
import { Floor } from "./Floor.js";
import { FlatWall } from "./FlatWall.js";
import { ThickWall } from "./ThickWall.js";
import { DisplayPlatform } from "./DisplayPlatform.js";
import { Light } from "./Light.js";
import { FluorescentLight } from "./FluorescentLight.js";
import { Camera } from "./Camera.js";
import { DataCollector } from "./DataCollector.js";
import { Product } from "./Product.js";

export class Scene {
  /**
   * @param {Object} config - シーン設定オブジェクト
   */
  constructor(config) {
    this.config = config;
    this.sceneElement = null;
    this.assetsElement = null;
    this.environment = null;
    this.currentEnvironmentIndex = 0; // 現在の環境インデックス
    this.showcases = [];
    this.objects = [];
    this.showcaseItems = []; // ショーケース内の物体
    this.floor = null;
    this.walls = [];
    this.thickWalls = [];
    this.platforms = [];
    this.lights = [];
    this.fluorescentLights = []; // 環境固有の蛍光灯
    this.camera = null;
    this.layoutPatterns = null; // 読み込んだレイアウトパターン
    this.selectedPattern = null; // 選択されたパターン
    this.currentPatternIndex = 0; // 現在のパターンインデックス

    // 商品配置
    this.productPlacementsData = null; // 読み込んだ商品配置データ（新フォーマット）
    this.productPlacements = null; // 読み込んだ商品配置パターン
    this.selectedProductPattern = null; // 選択された商品配置パターン
    this.currentProductPatternIndex = 0; // 現在の商品配置パターンインデックス
    this.products = []; // 配置された商品
    this.isProductPlacementStarted = false; // 商品配置が開始されたかどうか

    // データ収集
    this.dataCollector = null;
    this.trackingInterval = null; // カメラ位置追跡用のインターバル
    this.samplingRate = 100; // ms（データサンプリング間隔）
  }

  /**
   * シーンを初期化
   */
  async init() {
    // A-Frameシーン要素を取得
    this.sceneElement = document.querySelector("a-scene");

    if (!this.sceneElement) {
      console.error("A-Frameシーンが見つかりません");
      return;
    }

    // アセット要素を取得または作成
    this.assetsElement = this.sceneElement.querySelector("a-assets");
    if (!this.assetsElement) {
      this.assetsElement = document.createElement("a-assets");
      this.sceneElement.appendChild(this.assetsElement);
    }

    // レイアウトパターンを読み込み
    await this.loadLayoutPatterns();

    // 商品配置パターンを読み込み
    await this.loadProductPlacements();

    // 各要素を作成
    this.createEnvironment();
    this.createFloor();
    this.createWalls();
    this.createThickWalls();
    this.createPlatforms();
    this.createLights();
    this.createShowcases();
    this.createObjects();
    this.createShowcaseItems(); // ショーケース内の物体を配置
    // this.createProductsOnPlates(); // お皿の上に商品を配置 - 開始ボタンで手動開始
    this.createCamera();
  }

  /**
   * データ収集を初期化
   */
  initDataCollection() {
    // 実験条件を収集
    const experimentConditions = {
      layoutPatternId: this.selectedPattern ? this.selectedPattern.id : null,
      layoutPatternName: this.selectedPattern
        ? this.selectedPattern.name
        : null,
      environmentId: this.config.environments
        ? this.config.environments[this.currentEnvironmentIndex].id
        : null,
      environmentName: this.config.environments
        ? this.config.environments[this.currentEnvironmentIndex].name
        : null,
      cameraPositionId:
        this.camera && this.camera.entity
          ? this.camera.entity.getAttribute("data-position-id")
          : null,
    };

    // DataCollectorインスタンスを作成
    this.dataCollector = new DataCollector({
      participantId: this.getParticipantId(),
      experimentConditions: experimentConditions,
    });

    console.log("データ収集を初期化しました");
  }

  /**
   * 参加者IDを取得（URLパラメータまたは生成）
   * @returns {string}
   */
  getParticipantId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("participantId") || `participant-${Date.now()}`;
  }

  /**
   * データ収集を開始
   */
  startDataCollection() {
    if (!this.dataCollector) {
      console.error("DataCollectorが初期化されていません");
      return;
    }

    // データ収集開始
    this.dataCollector.startRecording();

    // カメラ位置の定期的な記録を開始
    this.startCameraTracking();

    console.log("データ収集を開始しました");
  }

  /**
   * データ収集を停止
   */
  stopDataCollection() {
    if (!this.dataCollector) {
      console.error("DataCollectorが初期化されていません");
      return;
    }

    // データ収集停止
    this.dataCollector.stopRecording();

    // カメラ位置の追跡を停止
    this.stopCameraTracking();

    // 統計情報をログ出力
    this.dataCollector.logStatistics();

    console.log("データ収集を停止しました");
  }

  /**
   * カメラ位置の追跡を開始
   */
  startCameraTracking() {
    if (this.trackingInterval) {
      console.warn("カメラ追跡は既に開始されています");
      return;
    }

    this.trackingInterval = setInterval(() => {
      if (this.camera && this.dataCollector) {
        const position = this.camera.getCurrentPosition();
        const rotation = this.camera.getCurrentRotation();
        this.dataCollector.recordCameraPosition(position, rotation);

        // 視線方向と注視商品を記録
        const gazeDirection = this.camera.getGazeDirection();
        const gazedProduct = this.detectGazedProduct();

        const targetProductId = gazedProduct ? gazedProduct.productId : null;
        const targetPosition = gazedProduct ? gazedProduct.position : null;

        this.dataCollector.recordGaze(
          gazeDirection,
          targetProductId,
          targetPosition
        );

        // 商品との距離を記録
        this.recordProductDistances();
      }
    }, this.samplingRate);

    console.log(`カメラ追跡開始（サンプリングレート: ${this.samplingRate}ms）`);
  }

  /**
   * 視線で注視している商品を検出
   * @returns {Object|null} {productId, position, distance} または null
   */
  detectGazedProduct() {
    if (!this.camera || !this.camera.getCameraElement()) {
      return null;
    }

    const cameraEl = this.camera.getCameraElement();
    const cameraWorldPos = new THREE.Vector3();
    cameraEl.object3D.getWorldPosition(cameraWorldPos);

    // 視線方向ベクトル
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(cameraEl.object3D.quaternion);

    // Raycasterを作成
    const raycaster = new THREE.Raycaster(cameraWorldPos, direction);
    raycaster.far = 50; // 検出距離の最大値（メートル）

    // ショーケース内のアイテムに対してレイキャスト
    let closestIntersection = null;
    let closestDistance = Infinity;

    // お皿をチェック
    this.showcaseItems.forEach((item) => {
      if (item.entity && item.entity.object3D) {
        const intersects = raycaster.intersectObject(
          item.entity.object3D,
          true
        );

        if (intersects.length > 0) {
          const intersection = intersects[0];
          if (intersection.distance < closestDistance) {
            closestDistance = intersection.distance;
            closestIntersection = {
              productId: item.id,
              position: {
                x: intersection.point.x,
                y: intersection.point.y,
                z: intersection.point.z,
              },
              distance: intersection.distance,
            };
          }
        }
      }
    });

    // 商品をチェック（より優先的に）
    this.products.forEach((product) => {
      if (product.entity && product.entity.object3D) {
        const intersects = raycaster.intersectObject(
          product.entity.object3D,
          true
        );

        if (intersects.length > 0) {
          const intersection = intersects[0];
          if (intersection.distance < closestDistance) {
            closestDistance = intersection.distance;
            closestIntersection = {
              productId: product.id,
              position: {
                x: intersection.point.x,
                y: intersection.point.y,
                z: intersection.point.z,
              },
              distance: intersection.distance,
            };
          }
        }
      }
    });

    return closestIntersection;
  }

  /**
   * すべての商品との距離を記録
   */
  recordProductDistances() {
    if (!this.camera || !this.dataCollector) {
      return;
    }

    const cameraPos = this.camera.getWorldPosition();
    const cameraPosVec = new THREE.Vector3(
      cameraPos.x,
      cameraPos.y,
      cameraPos.z
    );

    // お皿との距離を記録
    this.showcaseItems.forEach((item) => {
      if (item.entity && item.entity.object3D) {
        const itemPos = new THREE.Vector3();
        item.entity.object3D.getWorldPosition(itemPos);

        const distance = cameraPosVec.distanceTo(itemPos);

        // 前回の距離と比較して接近中かどうかを判定
        const previousRecord = this.dataCollector.productDistances
          .filter((record) => record.productId === item.id)
          .pop();

        const isApproaching = previousRecord
          ? distance < previousRecord.distance
          : false;

        // 距離が一定範囲内の場合のみ記録（パフォーマンス最適化）
        if (distance < 10) {
          this.dataCollector.recordProductDistance(
            item.id,
            distance,
            isApproaching
          );
        }
      }
    });

    // 商品との距離を記録
    this.products.forEach((product) => {
      if (product.entity && product.entity.object3D) {
        const productPos = new THREE.Vector3();
        product.entity.object3D.getWorldPosition(productPos);

        const distance = cameraPosVec.distanceTo(productPos);

        // 前回の距離と比較して接近中かどうかを判定
        const previousRecord = this.dataCollector.productDistances
          .filter((record) => record.productId === product.id)
          .pop();

        const isApproaching = previousRecord
          ? distance < previousRecord.distance
          : false;

        // 距離が一定範囲内の場合のみ記録（パフォーマンス最適化）
        if (distance < 10) {
          this.dataCollector.recordProductDistance(
            product.id,
            distance,
            isApproaching
          );
        }
      }
    });
  }

  /**
   * カメラ位置の追跡を停止
   */
  stopCameraTracking() {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
      console.log("カメラ追跡を停止しました");
    }
  }

  /**
   * DataCollectorを取得
   * @returns {DataCollector|null}
   */
  getDataCollector() {
    return this.dataCollector;
  }

  /**
   * 環境を作成
   */
  createEnvironment() {
    // 環境設定を取得（配列または単一オブジェクト）
    const envConfig = this.config.environments
      ? this.config.environments[this.currentEnvironmentIndex]
      : this.config.environment;

    this.environment = new Environment(envConfig);
    this.environment.create(this.sceneElement);

    if (envConfig && envConfig.name) {
      console.log(`環境: ${envConfig.name} (${envConfig.id})`);
    }

    // 初期化時に照明強度を設定
    if (envConfig && envConfig.lightingIntensity) {
      // 照明が作成された後に強度を更新
      setTimeout(() => this.updateLightingIntensity(), 100);
    }

    // 環境固有の蛍光灯を作成
    this.createFluorescentLights(envConfig);
  }

  /**
   * ショーケースを作成
   */
  createShowcases() {
    this.config.showcases.forEach((showcaseConfig) => {
      const showcase = new Showcase(showcaseConfig);
      showcase.createAsset(this.assetsElement);
      showcase.create(this.sceneElement);
      this.showcases.push(showcase);
    });
  }

  /**
   * 3Dオブジェクトを作成
   */
  createObjects() {
    if (this.config.objects) {
      this.config.objects.forEach((objectConfig) => {
        const object = new Showcase(objectConfig);
        object.createAsset(this.assetsElement);
        object.create(this.sceneElement);
        this.objects.push(object);
      });
    }
  }

  /**
   * 床を作成
   */
  createFloor() {
    if (this.config.floor) {
      this.floor = new Floor(this.config.floor);
      this.floor.create(this.sceneElement);
    }
  }

  /**
   * 壁を作成
   */
  createWalls() {
    if (this.config.walls) {
      this.config.walls.forEach((wallConfig) => {
        const wall = new FlatWall(wallConfig);
        wall.create(this.sceneElement);
        this.walls.push(wall);
      });
    }
  }

  /**
   * 厚みのある壁を作成
   */
  createThickWalls() {
    if (this.config.thickWalls) {
      this.config.thickWalls.forEach((wallConfig) => {
        const wall = new ThickWall(wallConfig);
        wall.create(this.sceneElement);
        this.thickWalls.push(wall);
      });
    }
  }

  /**
   * 四角柱を作成
   */
  createPlatforms() {
    if (this.config.platforms) {
      this.config.platforms.forEach((platformConfig) => {
        const platform = new DisplayPlatform(platformConfig);
        platform.create(this.sceneElement);
        this.platforms.push(platform);
      });
    }
  }

  /**
   * 照明を作成
   */
  createLights() {
    if (this.config.lights) {
      this.config.lights.forEach((lightConfig) => {
        const light = new Light(lightConfig);
        light.create(this.sceneElement);
        this.lights.push(light);
      });
    }
  }

  /**
   * 環境固有の蛍光灯を作成
   * @param {Object} envConfig - 環境設定オブジェクト
   */
  createFluorescentLights(envConfig) {
    if (!envConfig || !envConfig.fluorescentLights) {
      return;
    }

    envConfig.fluorescentLights.forEach((lightConfig) => {
      const fluorescentLight = new FluorescentLight(lightConfig);
      fluorescentLight.create(this.sceneElement);
      this.fluorescentLights.push(fluorescentLight);
    });

    console.log(`${this.fluorescentLights.length}個の蛍光灯を追加しました`);
  }

  /**
   * 環境固有の蛍光灯を削除
   */
  removeFluorescentLights() {
    this.fluorescentLights.forEach((light) => light.remove());
    this.fluorescentLights = [];
  }

  /**
   * カメラを作成
   */
  createCamera() {
    // カメラ位置をランダムに選択
    const cameraConfig = this.getRandomCameraConfig();
    this.camera = new Camera(cameraConfig);
    this.camera.create(this.sceneElement);

    // 選択されたカメラ位置をログ出力
    console.log(
      `カメラ位置: ${cameraConfig.selectedPosition.description} (${cameraConfig.selectedPosition.id})`
    );
  }

  /**
   * ランダムにカメラ設定を取得
   * @returns {Object} カメラ設定オブジェクト
   */
  getRandomCameraConfig() {
    const positions = this.config.cameraPositions;
    const randomIndex = Math.floor(Math.random() * positions.length);
    const selectedPosition = positions[randomIndex];

    return {
      ...this.config.camera,
      position: selectedPosition.position,
      rotation: selectedPosition.rotation || { x: 0, y: 0, z: 0 },
      selectedPosition: selectedPosition,
    };
  }

  /**
   * レイアウトパターンを読み込み
   */
  async loadLayoutPatterns() {
    try {
      const response = await fetch("./data/showcase-layouts.json");
      if (!response.ok) {
        throw new Error(`JSONファイルの読み込みに失敗: ${response.status}`);
      }
      this.layoutPatterns = await response.json();

      // ランダムにパターンを選択
      const patterns = this.layoutPatterns.patterns;
      this.currentPatternIndex = Math.floor(Math.random() * patterns.length);
      this.selectedPattern = patterns[this.currentPatternIndex];

      console.log(
        `選択されたレイアウトパターン: ${this.selectedPattern.name} (${this.selectedPattern.id})`
      );
      console.log(`説明: ${this.selectedPattern.description}`);
    } catch (error) {
      console.error("レイアウトパターンの読み込みエラー:", error);
      this.selectedPattern = null;
    }
  }

  /**
   * 商品配置パターンを読み込み
   */
  async loadProductPlacements() {
    try {
      const response = await fetch("./data/product-placements.json");
      if (!response.ok) {
        throw new Error(`JSONファイルの読み込みに失敗: ${response.status}`);
      }
      const data = await response.json();

      // 新しいフォーマットのデータを保存
      this.productPlacementsData = data;
      this.productPlacements = { patterns: data.patterns };

      // 単色配置パターンを選択（1番目のパターン）
      const patterns = this.productPlacements.patterns;
      this.currentProductPatternIndex = 0;
      this.selectedProductPattern = patterns[this.currentProductPatternIndex];

      console.log(
        `選択された商品配置パターン: ${this.selectedProductPattern.name} (${this.selectedProductPattern.id})`
      );
      console.log(`説明: ${this.selectedProductPattern.description}`);
    } catch (error) {
      console.error("商品配置パターンの読み込みエラー:", error);
      this.selectedProductPattern = null;
    }
  }

  /**
   * お皿の上に商品を配置
   */
  createProductsOnPlates() {
    if (!this.selectedProductPattern) {
      console.warn("商品配置パターンが選択されていません");
      return;
    }

    if (!this.productPlacementsData) {
      console.warn("商品配置データが読み込まれていません");
      return;
    }

    // お皿の位置情報を取得するためのマップを作成
    const platePositions = new Map();

    // showcaseItemsから全てのお皿の位置を取得
    this.showcaseItems.forEach((item) => {
      if (item.entity && item.id.startsWith("plate-")) {
        // object3D.positionを使用して正確な位置を取得
        const pos3D = item.entity.object3D.position;
        const position = { x: pos3D.x, y: pos3D.y, z: pos3D.z };
        console.log(`お皿の位置取得: ${item.id}`, position);
        platePositions.set(item.id, position);
      }
    });

    console.log(`取得したお皿の数: ${platePositions.size}`);

    // catalogとdefaultsを取得
    const catalog = this.productPlacementsData.catalog.cakes;
    const defaults = this.productPlacementsData.defaults.product;

    // 商品を配置
    this.selectedProductPattern.placements.forEach((placement) => {
      const platePosition = platePositions.get(placement.plateId);

      if (!platePosition) {
        console.warn(`お皿が見つかりません: ${placement.plateId}`);
        console.log("利用可能なお皿ID:", Array.from(platePositions.keys()));
        return;
      }

      console.log(
        `商品配置: ${placement.plateId} - ケーキ: ${placement.cake}`,
        platePosition
      );

      // カタログからケーキ情報を取得
      const cakeInfo = catalog[placement.cake];
      if (!cakeInfo) {
        console.warn(`ケーキ情報が見つかりません: ${placement.cake}`);
        return;
      }

      // 完全なproductConfigを構築
      const productConfig = {
        id: `cake-${placement.plateId}`,
        plateId: placement.plateId,
        name: cakeInfo.name,
        type: defaults.type,
        geometry: { ...defaults.geometry },
        material: {
          ...defaults.material,
          ...cakeInfo.material,
        },
        positionOffset: { ...defaults.transform.positionOffset },
        rotation: { ...defaults.transform.rotation },
        scale: { ...defaults.transform.scale },
      };

      // Productインスタンスを作成
      const product = new Product(productConfig, platePosition);

      // アセットを作成（モデルの場合）
      if (productConfig.type === "model") {
        product.createAsset(this.assetsElement);
      }

      // エンティティを作成
      product.create(this.sceneElement);

      // 商品リストに追加
      this.products.push(product);

      // 商品選択イベントを設定
      this.setupProductInteraction(product);
    });

    console.log(`${this.products.length}個の商品をお皿の上に配置しました`);
  }

  /**
   * 次のパターンに切り替え
   */
  switchToNextPattern() {
    if (!this.layoutPatterns || !this.layoutPatterns.patterns) {
      console.error("レイアウトパターンが読み込まれていません");
      return false;
    }

    // 現在の商品を削除
    this.products.forEach((product) => product.remove());
    this.products = [];

    // 現在のショーケースアイテムを削除
    this.showcaseItems.forEach((item) => item.remove());
    this.showcaseItems = [];

    // 次のパターンに進む（最後に達したら最初に戻る）
    this.currentPatternIndex =
      (this.currentPatternIndex + 1) % this.layoutPatterns.patterns.length;
    this.selectedPattern =
      this.layoutPatterns.patterns[this.currentPatternIndex];

    console.log(
      `パターン切り替え: ${this.selectedPattern.name} (${this.selectedPattern.id})`
    );
    console.log(`説明: ${this.selectedPattern.description}`);

    // 新しいパターンでアイテムを作成
    this.createShowcaseItems();

    // 新しいパターンで商品を配置
    this.createProductsOnPlates();

    return true;
  }

  /**
   * 次の商品配置パターンに切り替え
   */
  switchToNextProductPattern() {
    if (!this.productPlacements || !this.productPlacements.patterns) {
      console.error("商品配置パターンが読み込まれていません");
      return false;
    }

    // 現在の商品を削除
    this.products.forEach((product) => product.remove());
    this.products = [];

    // 次のパターンに進む（最後に達したら最初に戻る）
    this.currentProductPatternIndex =
      (this.currentProductPatternIndex + 1) %
      this.productPlacements.patterns.length;
    this.selectedProductPattern =
      this.productPlacements.patterns[this.currentProductPatternIndex];

    console.log(
      `商品配置パターン切り替え: ${this.selectedProductPattern.name} (${this.selectedProductPattern.id})`
    );
    console.log(`説明: ${this.selectedProductPattern.description}`);

    // 新しいパターンで商品を配置
    this.createProductsOnPlates();

    return true;
  }

  /**
   * 現在のパターン情報を取得
   * @returns {Object|null}
   */
  getCurrentPatternInfo() {
    if (!this.selectedPattern) {
      return null;
    }
    return {
      id: this.selectedPattern.id,
      name: this.selectedPattern.name,
      description: this.selectedPattern.description,
      index: this.currentPatternIndex,
      total: this.layoutPatterns ? this.layoutPatterns.patterns.length : 0,
    };
  }

  /**
   * 現在の商品配置パターン情報を取得
   * @returns {Object|null}
   */
  getCurrentProductPatternInfo() {
    if (!this.selectedProductPattern) {
      return null;
    }
    return {
      id: this.selectedProductPattern.id,
      name: this.selectedProductPattern.name,
      description: this.selectedProductPattern.description,
      index: this.currentProductPatternIndex,
      total: this.productPlacements
        ? this.productPlacements.patterns.length
        : 0,
    };
  }

  /**
   * 商品配置を開始
   */
  startProductPlacement() {
    if (this.isProductPlacementStarted) {
      console.warn("商品配置は既に開始されています");
      return false;
    }

    // 商品を配置
    this.createProductsOnPlates();
    this.isProductPlacementStarted = true;

    console.log("商品配置を開始しました");
    return true;
  }

  /**
   * 商品配置が開始されているかどうかを取得
   * @returns {boolean}
   */
  isProductPlacementActive() {
    return this.isProductPlacementStarted;
  }

  /**
   * ショーケース内の物体を配置
   */
  createShowcaseItems() {
    if (!this.selectedPattern) {
      console.warn("レイアウトパターンが選択されていません");
      return;
    }

    this.selectedPattern.showcases.forEach((showcaseData) => {
      showcaseData.objects.forEach((objectConfig) => {
        const item = new Showcase(objectConfig);
        item.createAsset(this.assetsElement);
        item.create(this.sceneElement);
        this.showcaseItems.push(item);

        // 商品選択イベントを設定
        this.setupProductInteraction(item);
      });
    });

    console.log(
      `${this.showcaseItems.length}個のアイテムをショーケースに配置しました`
    );
  }

  /**
   * 商品のインタラクションイベントを設定
   * @param {Showcase} item - ショーケースアイテム
   */
  setupProductInteraction(item) {
    // クリックイベント
    item.onClick((productId, event) => {
      if (this.dataCollector) {
        this.dataCollector.recordProductSelection(productId, "click");
        console.log(`商品選択: ${productId} (クリック)`);
      }

      // カスタムイベントを発火（UI更新などに使用）
      const customEvent = new CustomEvent("product-selected", {
        detail: { productId: productId, method: "click" },
      });
      document.dispatchEvent(customEvent);
    });

    // ホバー開始イベント
    item.onCursorEnter((productId, event) => {
      // ホバー開始時の処理（必要に応じて）
      // console.log(`商品にカーソルが乗りました: ${productId}`);
    });

    // ホバー終了イベント
    item.onCursorLeave((productId, event) => {
      // ホバー終了時の処理（必要に応じて）
      // console.log(`商品からカーソルが離れました: ${productId}`);
    });
  }

  /**
   * ショーケースを取得
   * @param {string} id - ショーケースID
   * @returns {Showcase|undefined}
   */
  getShowcase(id) {
    return this.showcases.find((showcase) => showcase.id === id);
  }

  /**
   * 床を取得
   * @returns {Floor|null}
   */
  getFloor() {
    return this.floor;
  }

  /**
   * カメラを取得
   * @returns {Camera|null}
   */
  getCamera() {
    return this.camera;
  }

  /**
   * 環境を取得
   * @returns {Environment|null}
   */
  getEnvironment() {
    return this.environment;
  }

  /**
   * 環境を切り替え
   */
  switchEnvironment() {
    if (!this.config.environments || this.config.environments.length === 0) {
      console.warn("環境設定が見つかりません");
      return false;
    }

    // 現在の環境を削除
    if (this.environment) {
      this.environment.remove();
      this.environment = null;
    }

    // 環境固有の蛍光灯を削除
    this.removeFluorescentLights();

    // 次の環境に切り替え
    this.currentEnvironmentIndex =
      (this.currentEnvironmentIndex + 1) % this.config.environments.length;

    // 新しい環境を作成
    this.createEnvironment();

    // 照明強度を更新
    this.updateLightingIntensity();

    return true;
  }

  /**
   * 現在の環境情報を取得
   * @returns {Object|null}
   */
  getCurrentEnvironmentInfo() {
    if (!this.config.environments) {
      return null;
    }
    const env = this.config.environments[this.currentEnvironmentIndex];
    return {
      id: env.id,
      name: env.name,
      index: this.currentEnvironmentIndex,
      total: this.config.environments.length,
    };
  }

  /**
   * 照明強度を現在の環境に合わせて更新
   */
  updateLightingIntensity() {
    if (!this.config.environments) {
      return;
    }

    const currentEnv = this.config.environments[this.currentEnvironmentIndex];

    if (!currentEnv.lightingIntensity) {
      return;
    }

    // 各照明の強度を更新
    this.lights.forEach((light) => {
      const lightType = light.type;

      if (
        lightType === "ambient" &&
        currentEnv.lightingIntensity.ambient !== undefined
      ) {
        light.setIntensity(currentEnv.lightingIntensity.ambient);
        console.log(`環境光の強度: ${currentEnv.lightingIntensity.ambient}`);
      } else if (
        lightType === "directional" &&
        currentEnv.lightingIntensity.directional !== undefined
      ) {
        light.setIntensity(currentEnv.lightingIntensity.directional);
        console.log(
          `方向光の強度: ${currentEnv.lightingIntensity.directional}`
        );
      }
    });
  }

  /**
   * シーンをクリア
   */
  clear() {
    // 環境を削除
    if (this.environment) {
      this.environment.remove();
      this.environment = null;
    }

    // ショーケースを削除
    this.showcases.forEach((showcase) => showcase.remove());
    this.showcases = [];

    // 3Dオブジェクトを削除
    this.objects.forEach((object) => object.remove());
    this.objects = [];

    // ショーケース内の物体を削除
    this.showcaseItems.forEach((item) => item.remove());
    this.showcaseItems = [];

    // 商品を削除
    this.products.forEach((product) => product.remove());
    this.products = [];

    // 床を削除
    if (this.floor) {
      this.floor.remove();
      this.floor = null;
    }

    // 壁を削除
    this.walls.forEach((wall) => wall.remove());
    this.walls = [];

    // 厚みのある壁を削除
    this.thickWalls.forEach((wall) => wall.remove());
    this.thickWalls = [];

    // 四角柱を削除
    this.platforms.forEach((platform) => platform.remove());
    this.platforms = [];

    // 照明を削除
    this.lights.forEach((light) => light.remove());
    this.lights = [];

    // 環境固有の蛍光灯を削除
    this.removeFluorescentLights();

    // カメラを削除
    if (this.camera) {
      this.camera.remove();
      this.camera = null;
    }

    // レイアウトパターンをリセット
    this.selectedPattern = null;
    this.selectedProductPattern = null;
  }

  /**
   * シーンをリセットして再初期化
   */
  async reset() {
    this.clear();
    await this.init();
  }
}
