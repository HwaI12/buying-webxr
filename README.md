# 色配置パターン評価実験 - WebXR システム

WebVR 環境で色配置パターンの主観的評価を収集するシステムです。色配置の違いが購買意欲・印象評価に与える影響を科学的に検証できます。

## 📋 目次

- [概要](#概要)
- [実験設計](#実験設計)
- [色配置パターン](#色配置パターン)
- [セットアップ](#セットアップ)
- [使い方](#使い方)
- [データ構造](#データ構造)
- [統計解析](#統計解析)
- [研究目的](#研究目的)

---

## 概要

このプロジェクトは、VR 環境でのショーケース配置パターンが主観的評価に与える影響を調査するための実験システムです。

### 研究の目的

**色配置パターンの違いが、被験者の主観的な購買意欲や印象評価に差を生むことを示し、その差を合理的に説明すること**

### 実験の特徴

- **アンケートベース**: 視線追跡・行動ログなし（簡易評価実験）
- **WebVR活用**: 実店舗では困難な複数配置の比較が容易
- **科学的手法**: 統制された環境での被験者内計画

---

## 実験設計

### 実験デザイン

- **タイプ**: 被験者内計画（Within-subject design）
- **独立変数**: 色配置パターン（10条件）
- **従属変数**: 購買意欲、魅力度、見やすさ（各7件法リッカート尺度）
- **統制変数**: 照明条件、商品形状、商品数、視点位置

### 比較軸（4つの観点）

1. **色の多様性**: 単色 vs 多色
2. **色温度**: 暖色 vs 寒色 vs 混合
3. **対称性**: 対称 vs 非対称
4. **配置規則性**: グラデーション vs 構造的 vs ランダム

### 主要な仮説

1. 単色より多色配置の方が購買意欲が高い
2. 暖色優位配置は寒色優位配置より購買意欲が高い
3. 対称配置は非対称配置より見やすさ評価が高い
4. グラデーション配置はランダム配置より魅力度が高い

### 既存知見との整合性

- **暖色**: 食欲・購買意欲を高める（色彩心理・マーケティング研究）
- **対称配置**: 秩序感・見やすさを向上（視覚認知研究）
- **ランダム配置**: 情報過多により評価が低下する可能性

---

## 色配置パターン

計10個のパターンで評価実験を実施します。詳細は `/public/data/README.md` を参照。

### 基準条件（Baseline）

1. **単色（白）** - 対照条件
2. **単色（赤）** - 暖色効果の検証

### 色調和（Harmony）

3. **補色アクセント** - 補色対比の効果

### 色温度（Temperature）

5. **寒色優位＋暖色アクセント** - 寒色主体
8. **暖色優位** - 暖色主体（食欲喚起仮説）

### グラデーション（Gradient）

4. **暖色類似＋グラデーション** - 対角グラデーション
10. **垂直グラデーション** - 上から下へのグラデーション

### 対称性（Symmetry）

6. **同位置対称（完全一致）** - 左右完全対称
9. **鏡像対称** - 左右鏡像反転
7. **ランダム配置（非対称）** - 非対称配置

### パターン設計の根拠

各パターンは以下の要因で設計されています：

- **色の多様性**: monochrome / multicolor
- **色温度**: neutral / warm / cool / mixed
- **対称性**: copy / mirror / asymmetric
- **配置規則性**: gradient / structured / random

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

### 1. 実験の流れ

1. **同意取得**: 実験参加への同意
2. **基本情報**: 年齢、性別、色覚に関する情報（任意）
3. **練習試行**: 操作に慣れるための練習
4. **本試行**: 10個のパターンを順に提示（ランダム順序）
5. **各試行後のアンケート**:
   - 購買意欲（7件法）
   - 魅力度（7件法）
   - 見やすさ（7件法）
   - 自由記述（任意）
6. **事後質問**: 最も良いパターン、ランキングなど

### 2. 操作方法

- **移動**: WASD キー
- **視点変更**: マウスドラッグ
- **パターン切り替え**: システムが自動的に次のパターンを提示
- **アンケート回答**: 画面上のUI要素を使用

### 3. 参加者 ID の指定

URL パラメータで参加者 ID を指定：

```
http://localhost:5173/?participantId=P001
```

### 4. データエクスポート

実験終了後、以下の形式でデータをエクスポート：

- **CSV形式**: 統計解析用（SPSS、R、Pythonなど）
- **JSON形式**: 詳細データ（必要に応じて）

---

## データ構造

詳細は `/public/data/README.md` と `/public/data/experiment-config.json` を参照。

### 収集データの概要

#### 1. メタデータ

- 参加者ID
- セッションID
- 実験条件（パターン順序など）
- 基本情報（年齢、性別、色覚）

#### 2. 試行データ（各パターンごと）

- パターンID、パターン名
- 試行順序
- 購買意欲評価（1-7）
- 魅力度評価（1-7）
- 見やすさ評価（1-7）
- 自由記述コメント
- 回答時間

#### 3. 事後データ

- 最も良いパターン
- 最も良くないパターン
- パターンのランキング
- 全体的なコメント

### CSV形式の例

```csv
participantId,patternId,patternName,trialOrder,purchaseIntent,attractiveness,clarity
P001,pattern-01-monochrome-white,単色（白）,1,3,2,5
P001,pattern-08-warm-dominant,暖色優位,2,6,6,4
...
```

---

## 統計解析

### 推奨される分析手法

#### 1. 記述統計

各パターンの評価値の平均・標準偏差を算出：

| パターン | 購買意欲(M±SD) | 魅力度(M±SD) | 見やすさ(M±SD) |
| -------- | -------------- | ------------ | -------------- |
| 単色（白） | 2.5±1.2 | 2.3±1.1 | 5.2±0.9 |
| 暖色優位 | 5.8±1.0 | 5.6±1.2 | 4.1±1.3 |
| ... | ... | ... | ... |

#### 2. 推測統計

**対応のある一元配置分散分析（Repeated-measures ANOVA）**

```python
# Pythonでの解析例
import pandas as pd
from scipy import stats
import pingouin as pg

# データ読み込み
df = pd.read_csv('experiment-data.csv')

# 対応のある分散分析
aov = pg.rm_anova(data=df, dv='purchaseIntent',
                  within='patternId', subject='participantId')
print(aov)

# 効果量（偏イータ二乗）を確認
# p < 0.05 かつ η²p > 0.14 なら「大きい効果」
```

#### 3. 多重比較

Bonferroni補正またはHolm法で事後検定：

```python
# 事後検定
posthoc = pg.pairwise_ttests(data=df, dv='purchaseIntent',
                             within='patternId', subject='participantId',
                             padjust='bonf')
print(posthoc)
```

#### 4. 可視化

- **棒グラフ**: パターンごとの平均評価値
- **箱ひげ図**: 分布の確認
- **レーダーチャート**: 3つの評価項目の比較

### 有意差の解釈

- **p < 0.05**: パターン間に統計的に有意な差がある
- **効果量（η²p）**:
  - 0.01～0.06: 小
  - 0.06～0.14: 中
  - 0.14以上: 大

---

## 分析ツールの例

### Python（データ分析・可視化）

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import pingouin as pg

# CSVデータを読み込み
df = pd.read_csv('experiment-data.csv')

# 1. 記述統計
desc = df.groupby('patternName')[['purchaseIntent', 'attractiveness', 'clarity']].agg(['mean', 'std'])
print(desc)

# 2. 棒グラフで可視化
plt.figure(figsize=(12, 6))
df.groupby('patternName')['purchaseIntent'].mean().plot(kind='bar')
plt.ylabel('購買意欲の平均評価値')
plt.title('色配置パターンごとの購買意欲')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.show()

# 3. 分散分析
aov = pg.rm_anova(data=df, dv='purchaseIntent',
                  within='patternId', subject='participantId')
print(aov)

# 4. 事後検定
posthoc = pg.pairwise_ttests(data=df, dv='purchaseIntent',
                             within='patternId', subject='participantId',
                             padjust='bonf')
print(posthoc[posthoc['p-corr'] < 0.05])  # 有意差のあるペアのみ表示
```

### R（統計分析）

```r
library(tidyverse)
library(ez)

# CSVデータを読み込み
df <- read.csv("experiment-data.csv")

# 対応のある分散分析
result <- ezANOVA(
  data = df,
  dv = purchaseIntent,
  wid = participantId,
  within = patternId,
  detailed = TRUE
)
print(result)

# 事後検定（Bonferroni補正）
library(emmeans)
emm <- emmeans(model, ~ patternId)
pairs(emm, adjust = "bonferroni")

# 可視化
ggplot(df, aes(x = patternName, y = purchaseIntent)) +
  geom_boxplot() +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
  labs(title = "色配置パターンごとの購買意欲", y = "購買意欲")
```

---

## 研究目的

### 1. 色配置パターンの効果検証

**目的**: 色配置の違いが購買意欲・印象評価に与える影響を実証的に示す

**達成基準**:
- パターン間で評価値に統計的有意差が出ること（p < 0.05）
- その差が既存知見（色彩心理・マーケティング研究）と整合すること
- 結果を合理的に説明できること

### 2. VR環境での評価実験の有効性検証

**メリット**:
- 実店舗では困難な複数配置の比較が容易
- 環境条件を完全に統制可能
- 低コストで繰り返し実験可能

**検証ポイント**:
- VR環境でも現実と同様の色彩効果が観察されるか
- 被験者がVR環境で適切に評価できるか

### 3. 実務への応用

**小売業への示唆**:
- 購買意欲を高める配色・配置の提案
- 商品の見せ方（ビジュアルマーチャンダイジング）の最適化
- ターゲット顧客に合わせた配置戦略

### 4. 学術的貢献

**卒業論文としての要件**:
- 統計的に有意な結果と効果量の提示
- 既存研究との比較・考察
- 実証研究としての再現可能性

**発展可能性**:
- 学会発表・論文投稿への展開
- より詳細な行動データ収集（視線追跡など）への拡張

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
│   │   │   ├── Scene.js              # シーン管理
│   │   │   ├── Camera.js             # カメラ制御
│   │   │   ├── Showcase.js           # 商品表示
│   │   │   ├── ExperimentController.js  # 実験フロー制御
│   │   │   ├── SurveyUI.js           # アンケートUI
│   │   │   └── DataExporter.js       # データエクスポート
│   │   ├── main.js                   # エントリーポイント
│   │   └── config.js                 # 設定ファイル
│   ├── css/
│   │   └── styles.css                # スタイル
│   ├── data/
│   │   ├── README.md                 # データ構造の説明
│   │   ├── environment-config.json   # 環境設定
│   │   ├── product-catalog.json      # 商品カタログ
│   │   ├── experiment-config.json    # 実験設定
│   │   ├── patterns-index.json       # パターン一覧
│   │   └── patterns/                 # 個別パターンファイル
│   │       ├── pattern-01-monochrome-white.json
│   │       ├── pattern-02-monochrome-red.json
│   │       └── ...（計10ファイル）
│   ├── models/                       # 3Dモデル
│   ├── textures/                     # テクスチャ
│   └── index.html                    # メインHTML
├── dist/                             # ビルド出力
├── server.js                         # 開発サーバー
├── package.json
└── README.md                         # このファイル
```

---

## ライセンス

ISC

---

## 作成者

HwaI12

---

## 参考文献・関連研究

### 色彩心理・マーケティング研究

- Gorn, G. J., et al. (1997). "Effects of Color as an Executional Cue in Advertising"
- Labrecque, L. I., & Milne, G. R. (2012). "Exciting red and competent blue: the importance of color in marketing"
- Singh, S. (2006). "Impact of color on marketing"

### VR環境での購買行動研究

- Kim, J., & Forsythe, S. (2008). "Adoption of Virtual Try-on technology for online apparel shopping"
- Schnack, A., et al. (2021). "How does the shoppers' evaluation of supermarket environments change in virtual reality?"

### 視覚認知・対称性研究

- Palmer, S. E., & Griscom, W. S. (2013). "Accounting for taste: Individual differences in preference for harmony"

### WebXR技術

- A-Frame Documentation: https://aframe.io/docs/
- Three.js Documentation: https://threejs.org/docs/

---

## 更新履歴

### v2.0.0 (2025-12-15)

- 色配置パターン評価実験への方向転換
- アンケートベースの実験設計
- 10個の色配置パターンを定義
- データ構造の整理とファイル分割
- 統計解析手法の明確化

### v1.0.0 (2025-12-05)

- 初期版: データ収集システムの実装
- カメラ位置・視線・距離の自動記録
- 商品選択インタラクション
- JSON/CSV エクスポート機能
