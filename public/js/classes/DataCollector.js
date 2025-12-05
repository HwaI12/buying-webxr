/**
 * DataCollectorクラス
 * VR環境内での行動データ、購買データを収集・管理
 */
export class DataCollector {
  /**
   * @param {Object} options - データ収集オプション
   * @param {string} options.participantId - 参加者ID
   * @param {string} options.sessionId - セッションID
   * @param {Object} options.experimentConditions - 実験条件（パターンID、環境IDなど）
   */
  constructor(options = {}) {
    this.participantId = options.participantId || this.generateId();
    this.sessionId = options.sessionId || this.generateId();
    this.experimentConditions = options.experimentConditions || {};

    // セッション情報
    this.sessionStartTime = Date.now();
    this.sessionEndTime = null;

    // A. 行動データ
    this.trajectoryData = []; // カメラ位置の時系列データ
    this.gazeData = []; // 視線方向と注視商品
    this.areaStayTime = {}; // エリア別滞在時間
    this.productDistances = []; // 商品との距離記録

    // B. 購買データ
    this.productSelections = []; // 商品選択の記録
    this.productViews = []; // 商品閲覧の記録
    this.finalSelection = null; // 最終選択商品

    // C. 主観評価（アンケート）
    this.subjectiveEvaluations = {};

    // 内部状態
    this.isRecording = false;
    this.recordingInterval = null;
    this.samplingRate = 100; // ms（カメラ位置記録の間隔）
    this.currentArea = null; // 現在のエリア
    this.areaEnterTime = null; // エリア入場時刻
  }

  /**
   * ランダムなIDを生成
   * @returns {string}
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * データ収集を開始
   */
  startRecording() {
    if (this.isRecording) {
      console.warn('データ収集は既に開始されています');
      return;
    }

    this.isRecording = true;
    this.sessionStartTime = Date.now();

    console.log(`データ収集開始: セッションID=${this.sessionId}`);
  }

  /**
   * データ収集を停止
   */
  stopRecording() {
    if (!this.isRecording) {
      console.warn('データ収集は開始されていません');
      return;
    }

    this.isRecording = false;
    this.sessionEndTime = Date.now();

    // エリア滞在時間を確定
    if (this.currentArea && this.areaEnterTime) {
      this.recordAreaExit();
    }

    console.log(`データ収集終了: 継続時間=${this.getSessionDuration()}ms`);
  }

  /**
   * セッション継続時間を取得（ミリ秒）
   * @returns {number}
   */
  getSessionDuration() {
    const endTime = this.sessionEndTime || Date.now();
    return endTime - this.sessionStartTime;
  }

  /**
   * カメラ位置を記録（A-1）
   * @param {Object} position - カメラ位置 {x, y, z}
   * @param {Object} rotation - カメラ回転 {x, y, z}
   */
  recordCameraPosition(position, rotation) {
    if (!this.isRecording) return;

    this.trajectoryData.push({
      timestamp: Date.now(),
      position: { ...position },
      rotation: { ...rotation }
    });
  }

  /**
   * 視線方向と注視商品を記録（A-2）
   * @param {Object} gazeDirection - 視線方向ベクトル
   * @param {string|null} targetProductId - 注視している商品ID（nullの場合は商品を見ていない）
   * @param {Object|null} targetPosition - 注視点の座標
   */
  recordGaze(gazeDirection, targetProductId = null, targetPosition = null) {
    if (!this.isRecording) return;

    const gazeRecord = {
      timestamp: Date.now(),
      direction: { ...gazeDirection },
      targetProductId: targetProductId,
      targetPosition: targetPosition ? { ...targetPosition } : null
    };

    this.gazeData.push(gazeRecord);

    // 商品を見ている場合、閲覧記録も追加
    if (targetProductId) {
      this.recordProductView(targetProductId);
    }
  }

  /**
   * 商品閲覧を記録
   * @param {string} productId - 商品ID
   */
  recordProductView(productId) {
    const lastView = this.productViews[this.productViews.length - 1];

    // 同じ商品を連続して見ている場合は記録しない（重複を避ける）
    if (lastView && lastView.productId === productId) {
      return;
    }

    this.productViews.push({
      timestamp: Date.now(),
      productId: productId
    });
  }

  /**
   * エリア入場を記録（A-3）
   * @param {string} areaId - エリアID
   */
  recordAreaEnter(areaId) {
    // 前のエリアの滞在時間を記録
    if (this.currentArea && this.areaEnterTime) {
      this.recordAreaExit();
    }

    this.currentArea = areaId;
    this.areaEnterTime = Date.now();
  }

  /**
   * エリア退出を記録（A-3）
   */
  recordAreaExit() {
    if (!this.currentArea || !this.areaEnterTime) return;

    const stayDuration = Date.now() - this.areaEnterTime;

    if (!this.areaStayTime[this.currentArea]) {
      this.areaStayTime[this.currentArea] = 0;
    }

    this.areaStayTime[this.currentArea] += stayDuration;

    this.currentArea = null;
    this.areaEnterTime = null;
  }

  /**
   * 商品との距離を記録（A-4）
   * @param {string} productId - 商品ID
   * @param {number} distance - 距離（メートル）
   * @param {boolean} isApproaching - 接近中かどうか
   */
  recordProductDistance(productId, distance, isApproaching = false) {
    if (!this.isRecording) return;

    this.productDistances.push({
      timestamp: Date.now(),
      productId: productId,
      distance: distance,
      isApproaching: isApproaching
    });
  }

  /**
   * 商品選択を記録（B）
   * @param {string} productId - 商品ID
   * @param {string} selectionMethod - 選択方法（'click', 'gaze', など）
   */
  recordProductSelection(productId, selectionMethod = 'click') {
    const selectionTime = Date.now();
    const timeFromStart = selectionTime - this.sessionStartTime;

    const selectionRecord = {
      timestamp: selectionTime,
      timeFromStart: timeFromStart,
      productId: productId,
      selectionMethod: selectionMethod
    };

    this.productSelections.push(selectionRecord);

    console.log(`商品選択: ${productId} (${selectionMethod}), 経過時間: ${timeFromStart}ms`);
  }

  /**
   * 最終選択商品を設定（B）
   * @param {string} productId - 最終選択商品ID
   */
  setFinalSelection(productId) {
    this.finalSelection = {
      productId: productId,
      timestamp: Date.now(),
      totalSelections: this.productSelections.length,
      comparedProducts: this.getUniqueProductsViewed()
    };

    console.log(`最終選択: ${productId}, 比較検討商品数: ${this.finalSelection.comparedProducts.length}`);
  }

  /**
   * 閲覧した商品のユニークなリストを取得
   * @returns {Array<string>}
   */
  getUniqueProductsViewed() {
    const uniqueProducts = new Set();
    this.productViews.forEach(view => uniqueProducts.add(view.productId));
    return Array.from(uniqueProducts);
  }

  /**
   * 主観評価を記録（C）
   * @param {string} category - 評価カテゴリ（'purchaseIntention', 'visibility', 'immersion', など）
   * @param {number|string} value - 評価値
   * @param {string} comment - コメント（オプション）
   */
  recordSubjectiveEvaluation(category, value, comment = '') {
    this.subjectiveEvaluations[category] = {
      value: value,
      comment: comment,
      timestamp: Date.now()
    };
  }

  /**
   * 実験条件を更新
   * @param {Object} conditions - 実験条件オブジェクト
   */
  updateExperimentConditions(conditions) {
    this.experimentConditions = {
      ...this.experimentConditions,
      ...conditions
    };
  }

  /**
   * 収集したデータをJSON形式で取得
   * @returns {Object}
   */
  getDataAsJSON() {
    return {
      // メタデータ
      metadata: {
        participantId: this.participantId,
        sessionId: this.sessionId,
        sessionStartTime: this.sessionStartTime,
        sessionEndTime: this.sessionEndTime,
        sessionDuration: this.getSessionDuration(),
        experimentConditions: this.experimentConditions
      },

      // A. 行動データ
      behaviorData: {
        trajectory: this.trajectoryData,
        gaze: this.gazeData,
        areaStayTime: this.areaStayTime,
        productDistances: this.productDistances
      },

      // B. 購買データ
      purchaseData: {
        productSelections: this.productSelections,
        productViews: this.productViews,
        finalSelection: this.finalSelection,
        uniqueProductsViewed: this.getUniqueProductsViewed().length,
        totalSelections: this.productSelections.length
      },

      // C. 主観評価
      subjectiveEvaluations: this.subjectiveEvaluations
    };
  }

  /**
   * データをJSON文字列として取得
   * @param {boolean} pretty - フォーマットするかどうか
   * @returns {string}
   */
  exportJSON(pretty = true) {
    const data = this.getDataAsJSON();
    return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  }

  /**
   * データをCSV形式で取得（基本的な統計情報）
   * @returns {string}
   */
  exportSummaryCSV() {
    const data = this.getDataAsJSON();
    const lines = [];

    // ヘッダー
    lines.push('Category,Metric,Value');

    // メタデータ
    lines.push(`Metadata,ParticipantID,${data.metadata.participantId}`);
    lines.push(`Metadata,SessionID,${data.metadata.sessionId}`);
    lines.push(`Metadata,SessionDuration,${data.metadata.sessionDuration}`);

    // 行動データ
    lines.push(`Behavior,TrajectoryPoints,${data.behaviorData.trajectory.length}`);
    lines.push(`Behavior,GazeRecords,${data.behaviorData.gaze.length}`);

    Object.entries(data.behaviorData.areaStayTime).forEach(([area, time]) => {
      lines.push(`Behavior,Area_${area}_StayTime,${time}`);
    });

    // 購買データ
    lines.push(`Purchase,UniqueProductsViewed,${data.purchaseData.uniqueProductsViewed}`);
    lines.push(`Purchase,TotalSelections,${data.purchaseData.totalSelections}`);
    if (data.purchaseData.finalSelection) {
      lines.push(`Purchase,FinalSelection,${data.purchaseData.finalSelection.productId}`);
    }

    // 主観評価
    Object.entries(data.subjectiveEvaluations).forEach(([category, evaluation]) => {
      lines.push(`Subjective,${category},${evaluation.value}`);
    });

    return lines.join('\n');
  }

  /**
   * データをダウンロード
   * @param {string} format - 'json' または 'csv'
   * @param {string} filename - ファイル名（拡張子なし）
   */
  downloadData(format = 'json', filename = null) {
    const defaultFilename = `experiment-data-${this.sessionId}`;
    const actualFilename = filename || defaultFilename;

    let content, mimeType, extension;

    if (format === 'json') {
      content = this.exportJSON(true);
      mimeType = 'application/json';
      extension = 'json';
    } else if (format === 'csv') {
      content = this.exportSummaryCSV();
      mimeType = 'text/csv';
      extension = 'csv';
    } else {
      console.error('サポートされていないフォーマット:', format);
      return;
    }

    // Blobを作成してダウンロード
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${actualFilename}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`データをダウンロードしました: ${actualFilename}.${extension}`);
  }

  /**
   * データをリセット
   */
  reset() {
    this.trajectoryData = [];
    this.gazeData = [];
    this.areaStayTime = {};
    this.productDistances = [];
    this.productSelections = [];
    this.productViews = [];
    this.finalSelection = null;
    this.subjectiveEvaluations = {};
    this.sessionStartTime = Date.now();
    this.sessionEndTime = null;
    this.currentArea = null;
    this.areaEnterTime = null;

    console.log('データ収集をリセットしました');
  }

  /**
   * 統計情報を取得
   * @returns {Object}
   */
  getStatistics() {
    return {
      sessionDuration: this.getSessionDuration(),
      trajectoryPoints: this.trajectoryData.length,
      gazeRecords: this.gazeData.length,
      uniqueProductsViewed: this.getUniqueProductsViewed().length,
      totalProductSelections: this.productSelections.length,
      totalProductViews: this.productViews.length,
      areasVisited: Object.keys(this.areaStayTime).length
    };
  }

  /**
   * ログ出力
   */
  logStatistics() {
    const stats = this.getStatistics();
    console.log('=== データ収集統計 ===');
    console.log(`セッション継続時間: ${stats.sessionDuration}ms`);
    console.log(`軌跡記録点数: ${stats.trajectoryPoints}`);
    console.log(`視線記録数: ${stats.gazeRecords}`);
    console.log(`閲覧商品数（ユニーク）: ${stats.uniqueProductsViewed}`);
    console.log(`商品選択回数: ${stats.totalProductSelections}`);
    console.log(`訪問エリア数: ${stats.areasVisited}`);
    console.log('==================');
  }
}
