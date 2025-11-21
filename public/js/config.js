/**
 * アプリケーション設定ファイル
 * 環境、オブジェクトの位置、スケールなどの定数を管理
 */

export const CONFIG = {
  // 環境設定
  environment: {
    preset: 'japan',
    ground: 'flat',
    groundColor: '#888',
    groundColor2: '#666',
    skyType: 'gradient',
    skyColor: '#87ceeb',
    horizonColor: '#e6e9f0',
    dressing: 'none',
    fog: 0.3,
    lighting: 'distant',
    shadow: true
  },

  // ショーケース設定
  showcases: [
    {
      id: 'showcase-1',
      modelSrc: './models/Showcase 3D Model by LitoStudio/scene.gltf',
      position: { x: -2.4, y: 0, z: -7 },
      rotation: { x: 0, y: 270, z: 0 },
      scale: { x: 1.4, y: 1.4, z: 1.4 }
    },
    {
      id: 'showcase-2',
      modelSrc: './models/Showcase 3D Model by LitoStudio/scene.gltf',
      position: { x: 1, y: 0, z: -7 },
      rotation: { x: 0, y: 270, z: 0 },
      scale: { x: 1.4, y: 1.4, z: 1.4 }
    }
  ],

  // 建物設定
  buildings: [
    {
      id: 'building-1',
      position: { x: -10, y: 2, z: -15 },
      dimensions: { width: 4, height: 8, depth: 3 },
      color: '#cccccc'
    },
    {
      id: 'building-2',
      position: { x: 10, y: 2, z: -15 },
      dimensions: { width: 4, height: 8, depth: 3 },
      color: '#bbbbbb'
    },
    {
      id: 'building-3',
      position: { x: -15, y: 3, z: -5 },
      dimensions: { width: 3, height: 12, depth: 3 },
      color: '#aaaaaa'
    },
    {
      id: 'building-4',
      position: { x: 15, y: 3, z: -5 },
      dimensions: { width: 3, height: 12, depth: 3 },
      color: '#999999'
    }
  ],

  // カメラ設定
  camera: {
    position: { x: 0, y: 1.6, z: 0 },
    wasdControlsEnabled: true,
    lookControls: {
      pointerLockEnabled: true
    },
    cursor: {
      color: '#ffffff',
      opacity: 0.8,
      raycasterObjects: '.clickable'
    }
  }
};
