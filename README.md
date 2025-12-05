# 購買行動実験 - WebXR データ収集システム

WebVR 環境での購買行動を記録・分析するためのデータ収集システムです。商品配置パターンと照明条件が購買行動に与える影響を科学的に検証できます。

## 📋 目次

- [概要](#概要)
- [主な機能](#主な機能)
- [データ収集項目](#データ収集項目)
- [セットアップ](#セットアップ)
- [使い方](#使い方)
- [データ構造](#データ構造)
- [分析手法](#分析手法)
- [研究目的](#研究目的)

---

## 概要

このプロジェクトは、VR 環境でのショーケース配置パターンと購買行動の関係を調査するための実験システムです。

### 実験変数

#### 独立変数（操作する条件）

- **商品配置パターン**: 縦配置、横配置、円形配置など
- **環境条件（照明）**: 朝、昼、夜
- **カメラ位置**: ランダムな初期位置

#### 従属変数（測定するデータ）

- カメラ移動経路（軌跡）
- 視線方向と注視商品
- 商品との距離
- 商品選択行動
- 意思決定時間

---

## 主な機能

### ✅ 実装済み機能

#### A. 行動データ（自動記録）

- ✅ **カメラ位置の時系列データ**（移動経路）
  - 100ms ごとに位置(x,y,z)と回転(x,y,z)を自動記録
- ✅ **視線方向の記録**（どの商品を見たか）
  - Raycasting で注視商品を検出
  - 視線方向ベクトルと注視点を記録
- ✅ **商品との距離**（接近行動）
  - 全商品との距離を計算
  - 接近中/離れ中を判定

#### B. 購買データ（インタラクション）

- ✅ **商品選択**（クリック選択）
  - カーソルでのクリック選択
  - 選択時刻と経過時間を記録
  - 比較検討した商品数をカウント

#### C. データエクスポート

- ✅ **JSON 形式**でダウンロード（詳細データ）
- ✅ **CSV 形式**でダウンロード（サマリー統計）
- ✅ UI コントロールパネル（開始/停止/エクスポート）

### ⏳ 未実装項目

- **各エリアでの滞在時間**: エリア機能が未実装（DataCollector には実装済み）
- **主観評価（アンケート）**: 別途 UI が必要（DataCollector には記録メソッド実装済み）

---

## データ収集項目

### 1. メタデータ

```json
{
  "participantId": "参加者ID（URLパラメータまたは自動生成）",
  "sessionId": "セッションID（ユニーク）",
  "sessionStartTime": 1764918338785,
  "sessionEndTime": 1764918350752,
  "sessionDuration": 11967,
  "experimentConditions": {
    "layoutPatternId": "plates-vertical-row",
    "layoutPatternName": "お皿縦配置",
    "environmentId": "morning",
    "environmentName": "朝",
    "cameraPositionId": null
  }
}
```

### 2. 行動データ

#### 2-1. 軌跡データ（trajectory）

100ms ごとのカメラ位置と回転

```json
{
  "timestamp": 1764918338887,
  "position": { "x": 25, "y": 1.6, "z": -2 },
  "rotation": { "x": 0, "y": 0, "z": 0 }
}
```

#### 2-2. 視線データ（gaze）

```json
{
  "timestamp": 1764918339087,
  "direction": { "x": 0, "y": 0, "z": -1 },
  "targetProductId": "plate-blue",
  "targetPosition": { "x": 24, "y": 1.2, "z": -5 }
}
```

#### 2-3. 商品距離データ（productDistances）

```json
{
  "timestamp": 1764918339187,
  "productId": "plate-blue",
  "distance": 3.5,
  "isApproaching": true
}
```

### 3. 購買データ

#### 3-1. 商品選択（productSelections）

```json
{
  "timestamp": 1764918345000,
  "timeFromStart": 6215,
  "productId": "plate-blue",
  "selectionMethod": "click"
}
```

#### 3-2. 商品閲覧履歴（productViews）

```json
{
  "timestamp": 1764918340000,
  "productId": "plate-blue"
}
```

#### 3-3. 最終選択（finalSelection）

```json
{
  "productId": "plate-blue",
  "timestamp": 1764918350000,
  "totalSelections": 3,
  "comparedProducts": ["plate-blue", "plate-red", "plate-green"]
}
```

---

## セットアップ

### 必要環境

- Node.js 16 以上
- モダンブラウザ（Chrome, Firefox, Edge 推奨）

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/HwaI12/buying-webxr.git
cd buying-webxr

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:5173` にアクセス

### ビルド

```bash
# 本番用ビルド
npm run build

# ビルドしたファイルは dist/ に出力されます
```

---

## 使い方

### 1. 実験の開始

1. ブラウザで開発サーバーにアクセス
2. 右上の「データ収集」パネルで **「開始」** ボタンをクリック
3. VR 環境内を移動して商品を閲覧・選択

### 2. 操作方法

- **移動**: WASD キー
- **視点変更**: マウスドラッグ
- **商品選択**: カーソルを商品に合わせてクリック
- **配置パターン切り替え**: 左下の「次へ」ボタン
- **環境切り替え**: 左下の「切替」ボタン

### 3. データ収集の停止とエクスポート

1. **「停止」** ボタンをクリック
   - 統計情報がコンソールに表示されます
2. **「JSON」** ボタン - 詳細な全データをダウンロード
3. **「CSV」** ボタン - サマリー統計をダウンロード

### 4. 参加者 ID の指定（オプション）

URL パラメータで参加者 ID を指定できます：

```
http://localhost:5173/?participantId=P001
```

指定しない場合は自動生成されます。

### 5. デバッグ

ブラウザのコンソールで以下のコマンドが使えます：

```javascript
// シーンにアクセス
window.appScene;

// データコレクターにアクセス
window.appScene.getDataCollector();

// 統計情報を表示
window.appScene.getDataCollector().logStatistics();

// データを取得
window.appScene.getDataCollector().getDataAsJSON();
```

---

## データ構造

### JSON ファイルの全体構造

```json
{
  "metadata": {
    "participantId": "...",
    "sessionId": "...",
    "experimentConditions": { ... }
  },
  "behaviorData": {
    "trajectory": [ ... ],
    "gaze": [ ... ],
    "areaStayTime": { ... },
    "productDistances": [ ... ]
  },
  "purchaseData": {
    "productSelections": [ ... ],
    "productViews": [ ... ],
    "finalSelection": { ... },
    "uniqueProductsViewed": 5,
    "totalSelections": 3
  },
  "subjectiveEvaluations": { }
}
```

### CSV ファイルの内容

サマリー統計のみ：

```csv
Category,Metric,Value
Metadata,ParticipantID,participant-1764918335650
Metadata,SessionDuration,11967
Behavior,TrajectoryPoints,120
Behavior,GazeRecords,120
Purchase,UniqueProductsViewed,5
Purchase,TotalSelections,3
Purchase,FinalSelection,plate-blue
```

---

## 分析手法

### A. 探索行動の分析

#### 1. 移動パターンの可視化

- **ヒートマップ**: 滞在時間が長い位置を可視化
- **移動経路**: 3D アニメーションで軌跡を再生
- **移動速度**: 探索の丁寧さを測定

**分かること**:

- どの配置だと商品に近づきやすいか
- 無駄な移動が少ないレイアウトはどれか

#### 2. 視線ヒートマップ

- **注視分布**: よく見られる位置を可視化
- **見落とし検出**: 視線が向かない商品を特定

**分かること**:

- 縦配置と横配置、どちらが全体を見やすいか
- 最も目を引く商品の配置位置はどこか

---

### B. 購買意思決定プロセスの分析

#### 3. 意思決定時間の分析

```
探索開始 → 最初のクリック → 最終選択
```

**分かること**:

- このレイアウトは選びやすいか
- 迷わせる配置 vs すぐ決まる配置

#### 4. 比較行動の分析

- 何個の商品を比較したか
- 何度も見返した商品（迷った商品）
- 最終選択までの選択回数

**分かること**:

- 配置パターンごとの比較行動の違い
- 照明条件が意思決定に与える影響

---

### C. 商品への接近行動の分析

#### 5. 接近距離と購買の関係

- 購入した商品にどれくらい近づいたか
- 近づかずに選んだ商品の特徴
- 接近回数と購買の相関

**分かること**:

- 近づいて見たくなる配置はどれか
- 遠くからでも選ばれる商品の特徴

---

### D. レイアウト比較分析

#### 6. 配置パターンの効果測定

複数セッションのデータを比較：

| 指標         | お皿縦配置 | お皿横配置 | 円形配置 |
| ------------ | ---------- | ---------- | -------- |
| 平均探索時間 | 15 秒      | 20 秒      | 18 秒    |
| 全商品閲覧率 | 85%        | 70%        | 90%      |
| 決定時間     | 10 秒      | 15 秒      | 12 秒    |
| 移動距離     | 5m         | 8m         | 6m       |

**統計検定**:

```python
# ANOVA（分散分析）
from scipy import stats
F, p = stats.f_oneway(縦配置データ, 横配置データ, 円形配置データ)
# p < 0.05 なら「配置による差がある」と証明
```

---

### E. 環境条件（照明）の影響分析

#### 7. 時間帯による行動変化

```
朝 vs 昼 vs 夜 の比較
```

**分かること**:

- 照明が購買行動に与える影響
- 時間帯による商品の見え方の差

---

## 分析ツールの例

### Python（データ分析）

```python
import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# JSONデータを読み込み
with open('experiment-data.json', 'r') as f:
    data = json.load(f)

# 軌跡データをDataFrameに変換
trajectory = pd.DataFrame(data['behaviorData']['trajectory'])

# ヒートマップの作成
plt.figure(figsize=(10, 8))
plt.hexbin(trajectory['position'].apply(lambda x: x['x']),
           trajectory['position'].apply(lambda x: x['z']),
           gridsize=20, cmap='YlOrRd')
plt.colorbar(label='滞在頻度')
plt.title('移動ヒートマップ')
plt.xlabel('X座標')
plt.ylabel('Z座標')
plt.show()
```

### R（統計分析）

```r
library(jsonlite)
library(ggplot2)

# JSONデータを読み込み
data <- fromJSON("experiment-data.json")

# 配置パターンごとの選択時間を比較
# ANOVA
aov_result <- aov(選択時間 ~ 配置パターン, data = df)
summary(aov_result)

# 事後検定（Tukey HSD）
TukeyHSD(aov_result)
```

---

## 研究目的

### 1. レイアウト最適化

- 最も効率的な商品配置をデータで証明
- 死角になる位置を特定して改善
- 動線設計のエビデンスを取得

### 2. 購買体験の改善

- ストレスの少ない配置を発見
- 選びやすい UI 設計のヒント
- 商品の見せ方の最適化

### 3. VR 購買の有効性検証

- 実店舗 vs VR の行動比較
- VR 特有の課題の発見
- 没入感と購買意欲の関係

### 4. 研究・論文化

- 客観的なデータに基づく実証研究
- 統計分析（t 検定、分散分析など）
- 学術論文として発表可能

---

## 技術スタック

- **WebXR**: A-Frame 1.5.0
- **3D 描画**: Three.js
- **フロントエンド**: Vanilla JavaScript (ES6 Modules)
- **ビルド**: Vite
- **サーバー**: Express

---

## ファイル構成

```
buying-webxr/
├── public/
│   ├── js/
│   │   ├── classes/
│   │   │   ├── DataCollector.js      # データ収集の中核
│   │   │   ├── Scene.js              # シーン管理
│   │   │   ├── Camera.js             # カメラ制御
│   │   │   ├── Showcase.js           # 商品表示
│   │   │   └── ...
│   │   ├── main.js                   # エントリーポイント
│   │   └── config.js                 # 設定ファイル
│   ├── css/
│   │   └── styles.css                # スタイル
│   ├── data/
│   │   └── showcase-layouts.json    # レイアウトパターン定義
│   ├── models/                       # 3Dモデル
│   ├── textures/                     # テクスチャ
│   └── index.html                    # メインHTML
├── dist/                             # ビルド出力
├── server.js                         # 開発サーバー
├── package.json
└── README.md
```

---

## ライセンス

ISC

---

## 作成者

HwaI12

---

## 参考文献・関連研究

### VR 購買行動研究

- Kim, J., & Forsythe, S. (2008). Adoption of Virtual Try-on technology for online apparel shopping.
- Wedel, M., & Pieters, R. (2008). Eye tracking for visual marketing.

### データ収集手法

- Raycasting in WebXR: https://aframe.io/docs/1.5.0/introduction/interactions-and-controllers.html
- Three.js Raycaster: https://threejs.org/docs/#api/en/core/Raycaster

---

## 更新履歴

### v1.0.0 (2025-12-05)

- データ収集システムの実装
- カメラ位置・視線・距離の自動記録
- 商品選択インタラクション
- JSON/CSV エクスポート機能
