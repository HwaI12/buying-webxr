/**
 * アプリケーション設定ファイル
 * 環境、オブジェクトの位置、スケールなどの定数を管理
 */

export const CONFIG = {
  // 環境設定（複数の時間帯）
  environments: [
    {
      id: "morning",
      name: "朝",
      preset: "japan",
      ground: "none",
      skyType: "gradient",
      skyColor: "#87ceeb", // 明るい青空
      horizonColor: "#e6e9f0", // 明るい地平線
      dressing: "none",
      fog: 0.3,
      lighting: "none",
      shadow: false,
      // 照明強度設定
      lightingIntensity: {
        ambient: 0.7, // 環境光
        directional: 0.4, // 方向光
      },
      // 朝も蛍光灯を表示
      fluorescentLights: [
        {
          id: "fluorescent-back",
          position: { x: 0, y: 6.5, z: -12.8 }, // back-shopping-wall上部
          rotation: { x: 0, y: 0, z: 0 },
          dimensions: { width: 14, height: 0.1, depth: 0.3 },
          emissiveColor: "#ffffff",
          emissiveIntensity: 1.5,
          lightIntensity: 1.5,
          lightDistance: 12,
          numberOfLights: 3, // ポイントライトの数
        },
      ],
    },
    {
      id: "night",
      name: "夜",
      preset: "starry",
      ground: "none",
      skyType: "gradient",
      skyColor: "#000033", // 深い夜空
      horizonColor: "#1a1a2e", // 暗い地平線
      dressing: "none",
      fog: 0.5,
      lighting: "none",
      shadow: false,
      // 照明強度設定（暗くする）
      lightingIntensity: {
        ambient: 0.3, // 環境光: 大幅に減少
        directional: 0.2, // 方向光: 大幅に減少
      },
      // 夜専用の蛍光灯（ショッピングエリアの壁を照らす）
      fluorescentLights: [
        {
          id: "fluorescent-back",
          position: { x: 0, y: 6.5, z: -12.8 }, // back-shopping-wall上部
          rotation: { x: 0, y: 0, z: 0 },
          dimensions: { width: 14, height: 0.1, depth: 0.3 },
          emissiveColor: "#ffffff",
          emissiveIntensity: 1.5,
          lightIntensity: 1.5,
          lightDistance: 12,
          numberOfLights: 3, // ポイントライトの数
        },
      ],
    },
  ],

  // ショーケース設定
  showcases: [
    {
      id: "showcase-1",
      modelSrc: "./models/Showcase 3D Model by LitoStudio/scene.gltf",
      position: { x: -4.9, y: 0, z: -10 },
      rotation: { x: 0, y: 270, z: 0 },
      scale: { x: 1.8, y: 1.4, z: 2 },
    },
    {
      id: "showcase-2",
      modelSrc: "./models/Showcase 3D Model by LitoStudio/scene.gltf",
      position: { x: 0, y: 0, z: -10 },
      rotation: { x: 0, y: 270, z: 0 },
      scale: { x: 1.8, y: 1.4, z: 2 },
    },
  ],

  // 3Dオブジェクト設定
  objects: [
    {
      id: "register-1",
      modelSrc: "./models/Canarian Cafe Cash Register/scene.gltf",
      position: { x: 7, y: 2.3, z: -8 },
      rotation: { x: 0, y: 180, z: 0 },
      scale: { x: 0.4, y: 0.4, z: 0.4 },
    },
    {
      id: "money-1",
      modelSrc: "./models/russians_money/scene.gltf",
      position: { x: 5, y: 2.3, z: -8 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.0015, y: 0.0015, z: 0.0015 },
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
      position: { x: 0, y: 5, z: -40 }, // 奥の壁
      width: 80,
      height: 10,
      rotation: { x: 0, y: 0, z: 0 },
      texture: "./textures/wall.jpg",
      repeat: { x: 5, y: 1 },
    },
    {
      id: "front-wall",
      position: { x: 0, y: 5, z: 40 }, // 手前の壁
      width: 80,
      height: 10,
      rotation: { x: 0, y: 180, z: 0 },
      texture: "./textures/wall.jpg",
      repeat: { x: 5, y: 1 },
    },
    {
      id: "left-wall",
      position: { x: -40, y: 5, z: 0 }, // 左の壁
      width: 80,
      height: 10,
      rotation: { x: 0, y: 90, z: 0 },
      texture: "./textures/wall.jpg",
      repeat: { x: 5, y: 1 },
    },
    {
      id: "right-wall",
      position: { x: 40, y: 5, z: 0 }, // 右の壁
      width: 80,
      height: 10,
      rotation: { x: 0, y: -90, z: 0 },
      texture: "./textures/wall.jpg",
      repeat: { x: 5, y: 1 },
    },
  ],

  // 厚みのある壁設定
  thickWalls: [
    {
      id: "back-shopping-wall",
      position: { x: 0, y: 2.5, z: -13 },
      dimensions: { width: 18, height: 10, depth: 0.3 },
      rotation: { x: 0, y: 0, z: 0 },
      texture: "./textures/plaster.jpg",
      repeat: { x: 3, y: 1 },
    },
    {
      id: "back-shopping-wall-2",
      position: { x: 0, y: 2.5, z: -20 },
      dimensions: { width: 18, height: 10, depth: 0.3 },
      rotation: { x: 0, y: 0, z: 0 },
      texture: "./textures/plaster.jpg",
      repeat: { x: 3, y: 1 },
    },
    {
      id: "left-shopping-wall",
      position: { x: -9, y: 2.5, z: -13 },
      dimensions: { width: 14, height: 10, depth: 0.3 },
      rotation: { x: 0, y: 90, z: 0 },
      texture: "./textures/plaster.jpg",
      repeat: { x: 3, y: 1 },
    },
    {
      id: "right-shopping-wall",
      position: { x: 9, y: 2.5, z: -13 },
      dimensions: { width: 14, height: 10, depth: 0.3 },
      rotation: { x: 0, y: -90, z: 0 },
      texture: "./textures/plaster.jpg",
      repeat: { x: 3, y: 1 },
    },
  ],

  // 展示台設定
  platforms: [
    {
      id: "platform-1",
      position: { x: 6, y: 0.3, z: -8.7 }, // ショーケース1の左
      dimensions: { width: 5, height: 3.8, depth: 3 },
      color: "#ffffff",
    },
  ],

  // 床設定
  floor: {
    id: "custom-floor",
    position: { x: 0, y: 0, z: 0 }, // ショーケースと同じ高さ
    width: 80,
    height: 80,
    rotation: { x: -90, y: 0, z: 0 },
    texture: "./textures/floor.jpg", // テクスチャ画像のパス
    repeat: 10, // テクスチャの繰り返し回数（タイルの数）
  },

  // カメラ設定（複数のカメラ位置からランダムに選択）
  cameraPositions: [
    {
      id: "position-1",
      description: "正面中央",
      position: { x: 0, y: 1.6, z: 30 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      id: "position-2",
      description: "右側",
      position: { x: 25, y: 1.6, z: -2 },
      rotation: { x: 0, y: 90, z: 0 },
    },
    {
      id: "position-3",
      description: "左側",
      position: { x: -30, y: 1.6, z: -2 },
      rotation: { x: 0, y: -90, z: 0 },
    },
  ],
  // カメラ共通設定
  camera: {
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
