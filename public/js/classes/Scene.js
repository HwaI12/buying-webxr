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
import { Camera } from "./Camera.js";

export class Scene {
  /**
   * @param {Object} config - シーン設定オブジェクト
   */
  constructor(config) {
    this.config = config;
    this.sceneElement = null;
    this.assetsElement = null;
    this.environment = null;
    this.showcases = [];
    this.objects = [];
    this.floor = null;
    this.walls = [];
    this.thickWalls = [];
    this.platforms = [];
    this.lights = [];
    this.camera = null;
  }

  /**
   * シーンを初期化
   */
  init() {
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

    // 各要素を作成
    this.createEnvironment();
    this.createFloor();
    this.createWalls();
    this.createThickWalls();
    this.createPlatforms();
    this.createLights();
    this.createShowcases();
    this.createObjects();
    this.createCamera();
  }

  /**
   * 環境を作成
   */
  createEnvironment() {
    this.environment = new Environment(this.config.environment);
    this.environment.create(this.sceneElement);
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
   * カメラを作成
   */
  createCamera() {
    this.camera = new Camera(this.config.camera);
    this.camera.create(this.sceneElement);
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

    // カメラを削除
    if (this.camera) {
      this.camera.remove();
      this.camera = null;
    }
  }

  /**
   * シーンをリセットして再初期化
   */
  reset() {
    this.clear();
    this.init();
  }
}
