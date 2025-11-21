/**
 * アプリケーション設定ファイル
 * 環境、オブジェクトの位置、スケールなどの定数を管理
 */

export const CONFIG = {
  // 環境設定
  environment: {
    preset: "japan",
    ground: "none",
    skyType: "gradient",
    skyColor: "#87ceeb",
    horizonColor: "#e6e9f0",
    dressing: "none",
    fog: 0.3,
    lighting: "none", // カスタム照明を使用するため環境照明をオフ
    shadow: false,
  },

  // ショーケース設定
  showcases: [
    {
      id: "showcase-1",
      modelSrc: "./models/Showcase 3D Model by LitoStudio/scene.gltf",
      position: { x: -2.4, y: 0, z: -10 },
      rotation: { x: 0, y: 270, z: 0 },
      scale: { x: 1.4, y: 1.4, z: 1.4 },
    },
    {
      id: "showcase-2",
      modelSrc: "./models/Showcase 3D Model by LitoStudio/scene.gltf",
      position: { x: 1, y: 0, z: -10 },
      rotation: { x: 0, y: 270, z: 0 },
      scale: { x: 1.4, y: 1.4, z: 1.4 },
    },
  ],

  // 照明設定
  lights: [
    {
      type: "ambient", // 環境光（全体的な明るさ）
      color: "#ffffff",
      intensity: 0.7, // 0.5で控えめな明るさ
    },
    {
      type: "directional", // 方向光（太陽光のような照明）
      color: "#ffffff",
      intensity: 0.4, // 0.3で柔らかい光
      position: { x: 5, y: 10, z: 5 },
    },
  ],

  // 壁設定（4方向）
  walls: [
    {
      id: "back-wall",
      position: { x: 0, y: 2.5, z: -25 }, // 奥の壁
      width: 50,
      height: 15,
      rotation: { x: 0, y: 0, z: 0 },
      texture: "./textures/wall.jpg",
      repeat: { x: 5, y: 1 },
    },
    {
      id: "front-wall",
      position: { x: 0, y: 2.5, z: 25 }, // 手前の壁
      width: 50,
      height: 15,
      rotation: { x: 0, y: 180, z: 0 },
      texture: "./textures/wall.jpg",
      repeat: { x: 5, y: 1 },
    },
    {
      id: "left-wall",
      position: { x: -25, y: 2.5, z: 0 }, // 左の壁
      width: 50,
      height: 15,
      rotation: { x: 0, y: 90, z: 0 },
      texture: "./textures/wall.jpg",
      repeat: { x: 5, y: 1 },
    },
    {
      id: "right-wall",
      position: { x: 25, y: 2.5, z: 0 }, // 右の壁
      width: 50,
      height: 15,
      rotation: { x: 0, y: -90, z: 0 },
      texture: "./textures/wall.jpg",
      repeat: { x: 5, y: 1 },
    },
  ],

  // 床設定
  floor: {
    id: "custom-floor",
    position: { x: 0, y: 0, z: 0 }, // ショーケースと同じ高さ
    width: 100,
    height: 100,
    rotation: { x: -90, y: 0, z: 0 },
    texture: "./textures/floor.jpg", // テクスチャ画像のパス
    repeat: 10, // テクスチャの繰り返し回数（タイルの数）
  },

  // カメラ設定
  camera: {
    position: { x: 0, y: 1.6, z: 5 },
    wasdControlsEnabled: true,
    lookControls: {
      pointerLockEnabled: true,
    },
    cursor: {
      color: "#ffffff",
      opacity: 0.8,
      raycasterObjects: ".clickable",
    },
  },
};
