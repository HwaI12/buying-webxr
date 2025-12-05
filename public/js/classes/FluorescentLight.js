/**
 * FluorescentLightクラス
 * 蛍光灯（発光する箱と照明）を管理
 */
export class FluorescentLight {
  /**
   * @param {Object} config - 蛍光灯設定オブジェクト
   */
  constructor(config) {
    this.config = config;
    this.id = config.id || `fluorescent-${Date.now()}`;
    this.boxElement = null;
    this.lightElements = []; // 複数のライトを管理
  }

  /**
   * 蛍光灯を作成（発光する箱 + 光源）
   * @param {HTMLElement} sceneElement - A-Frameシーン要素
   */
  create(sceneElement) {
    // 発光する箱（蛍光灯本体）を作成
    this.boxElement = document.createElement("a-box");
    this.boxElement.setAttribute("id", this.id);

    // 位置
    this.boxElement.setAttribute("position", {
      x: this.config.position.x,
      y: this.config.position.y,
      z: this.config.position.z,
    });

    // 回転
    if (this.config.rotation) {
      this.boxElement.setAttribute("rotation", {
        x: this.config.rotation.x,
        y: this.config.rotation.y,
        z: this.config.rotation.z,
      });
    }

    // サイズ
    this.boxElement.setAttribute("width", this.config.dimensions.width);
    this.boxElement.setAttribute("height", this.config.dimensions.height);
    this.boxElement.setAttribute("depth", this.config.dimensions.depth);

    // マテリアル（発光）
    this.boxElement.setAttribute("material", {
      color: this.config.emissiveColor || "#ffffff",
      emissive: this.config.emissiveColor || "#ffffff",
      emissiveIntensity: this.config.emissiveIntensity || 1.0,
      shader: "standard",
    });

    sceneElement.appendChild(this.boxElement);

    // デバッグ: 蛍光灯の位置を出力
    console.log(`[${this.id}] 蛍光灯本体の位置:`, this.config.position);

    // 複数のポイントライトを蛍光灯の長さに沿って配置
    const numberOfLights = this.config.numberOfLights || 1;
    const width = this.config.dimensions.width;
    const rotationY = this.config.rotation?.y || 0;

    // 蛍光灯の長さに沿った方向を決定
    // rotation.y が 90 または -90 の場合、z軸方向に配置
    // rotation.y が 0 または 180 の場合、x軸方向に配置
    const isRotated = (rotationY === 90 || rotationY === -90);

    for (let i = 0; i < numberOfLights; i++) {
      const lightElement = document.createElement("a-light");
      lightElement.setAttribute("id", `${this.id}-light-${i}`);
      lightElement.setAttribute("type", "point");
      lightElement.setAttribute("color", "#ffffff");
      lightElement.setAttribute("intensity", this.config.lightIntensity || 1.0);
      lightElement.setAttribute("distance", this.config.lightDistance || 10);
      lightElement.setAttribute("decay", 2);

      // ライトの位置を計算（蛍光灯の長さに沿って均等に配置）
      let offset = 0;
      if (numberOfLights > 1) {
        offset = (i - (numberOfLights - 1) / 2) * (width / (numberOfLights - 1));
      }

      const lightPosition = {
        x: this.config.position.x,
        y: this.config.position.y,
        z: this.config.position.z,
      };

      // 回転に応じてオフセットを適用
      if (isRotated) {
        lightPosition.z += offset;
      } else {
        lightPosition.x += offset;
      }

      lightElement.setAttribute("position", lightPosition);
      sceneElement.appendChild(lightElement);
      this.lightElements.push(lightElement);

      // デバッグ: 各ライトの位置を出力
      console.log(`  Light ${i}:`, lightPosition);
    }

    console.log(`蛍光灯を作成: ${this.id} (${numberOfLights}個のライト)`);
  }

  /**
   * 蛍光灯を削除
   */
  remove() {
    if (this.boxElement && this.boxElement.parentNode) {
      this.boxElement.parentNode.removeChild(this.boxElement);
    }
    // 全てのライト要素を削除
    this.lightElements.forEach((lightElement) => {
      if (lightElement && lightElement.parentNode) {
        lightElement.parentNode.removeChild(lightElement);
      }
    });
    this.boxElement = null;
    this.lightElements = [];
  }

  /**
   * 照明強度を設定
   * @param {number} intensity - 照明強度
   */
  setIntensity(intensity) {
    this.lightElements.forEach((lightElement) => {
      if (lightElement) {
        lightElement.setAttribute("intensity", intensity);
      }
    });
  }

  /**
   * 発光強度を設定
   * @param {number} intensity - 発光強度
   */
  setEmissiveIntensity(intensity) {
    if (this.boxElement) {
      this.boxElement.setAttribute("material", "emissiveIntensity", intensity);
    }
  }
}
