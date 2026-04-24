<template>
  <section class="panel result-panel">
    <div class="panel-title">
      <div>
        <h3>检测结果展示</h3>
        <p>下面展示的是前端占位内容，后续可以直接替换成接口返回结果。</p>
      </div>
      <button class="back-button" type="button" @click="$emit('back-home')">返回首页</button>
    </div>

    <div class="summary-grid">
      <article class="summary-card">
        <span>成熟度判断</span>
        <strong>适宜采摘</strong>
        <p>果皮颜色均匀，糖酸比预计处于适宜区间。</p>
      </article>
      <article class="summary-card">
        <span>品质筛选结果</span>
        <strong>优质果</strong>
        <p>外观完整，无明显碰伤、裂果或严重色斑。</p>
      </article>
      <article class="summary-card">
        <span>置信度</span>
        <strong>98.1%</strong>
        <p>这里未来可显示模型评分、类别概率或解释结果。</p>
      </article>
    </div>

    <div class="detail-block">
      <h4>结果说明</h4>
      <ul>
        <li>成熟度参考项：果皮综合色泽、明暗分布、表面纹理。</li>
        <li>品质参考项：表皮完整性、病斑特征、局部损伤情况。</li>
        <li>当前页面仅展示前端模板，不包含真实检测与筛选逻辑。</li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ResultSummary'
}
</script>

<style scoped>
.panel {
  padding: 26px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow: 0 22px 55px rgba(15, 23, 42, 0.08);
}

.panel-title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.panel-title h3 {
  margin: 0;
  color: #0f172a;
  font-size: 22px;
}

.panel-title p {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 14px;
}

.back-button {
  border: none;
  padding: 12px 18px;
  border-radius: 14px;
  background: #0f766e;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.summary-card {
  padding: 18px;
  border-radius: 20px;
  background: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%);
  border: 1px solid #fed7aa;
}

.summary-card span {
  display: block;
  color: #9a3412;
  font-size: 13px;
}

.summary-card strong {
  display: block;
  margin-top: 10px;
  color: #0f172a;
  font-size: 28px;
}

.summary-card p {
  margin: 10px 0 0;
  color: #475569;
  font-size: 14px;
  line-height: 1.7;
}

.detail-block {
  margin-top: 22px;
  padding: 20px;
  border-radius: 20px;
  background: #f8fafc;
}

.detail-block h4 {
  margin: 0 0 14px;
  color: #0f172a;
  font-size: 18px;
}

.detail-block ul {
  margin: 0;
  padding-left: 18px;
  color: #475569;
  line-height: 1.8;
}

@media (max-width: 900px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .panel {
    padding: 20px;
    border-radius: 22px;
  }

  .panel-title {
    flex-direction: column;
  }
}
</style>
