<template>
  <main class="home-page">
    <ProfileEntry />
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Citrus Maturity Dashboard</p>
        <h1>柑橘成熟度筛选系统首页</h1>
        <p class="description">
          登录成功后，操作员可以从这里查看检测任务、成熟度分析结果和当前设备状态，
          快速进入每日分选工作。
        </p>
        <div class="hero-actions">
          <button class="primary-button" type="button" @click="goDetect">进入柑橘检测</button>
        </div>
      </div>

      <div class="hero-card">
        <span class="hero-card-label">今日筛选概览</span>
        <strong>1,284</strong>
        <p>已完成果实检测</p>
        <div class="hero-progress">
          <span class="progress-label">成熟果比例</span>
          <span class="progress-value">78%</span>
        </div>
        <div class="progress-bar">
          <i></i>
        </div>
      </div>
    </section>

    <section class="metrics">
      <MetricCard
        label="成熟果数量"
        value="1,002"
        note="当前批次中达到采摘标准的柑橘数量。"
        trend="+12.6%"
      />
      <MetricCard
        label="待复检样本"
        value="96"
        note="颜色与纹理特征不稳定，建议再次扫描。"
        trend="需关注"
        :positive="false"
      />
      <MetricCard
        label="平均识别准确率"
        value="98.4%"
        note="结合颜色、尺寸与表皮纹理后的综合识别结果。"
        trend="+1.8%"
      />
    </section>

    <section class="content-grid">
      <BatchTable :batches="batches" />

      <aside class="side-panel">
        <section class="panel">
          <h3>成熟度分布</h3>
          <ul class="distribution-list">
            <li v-for="item in maturityLevels" :key="item.label">
              <div class="distribution-title">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </div>
              <div class="distribution-bar">
                <i :style="{ width: item.percent, background: item.color }"></i>
              </div>
            </li>
          </ul>
        </section>

        <section class="panel">
          <h3>今日任务提醒</h3>
          <ul class="task-list">
            <li v-for="task in tasks" :key="task">{{ task }}</li>
          </ul>
        </section>
      </aside>
    </section>
  </main>
</template>

<script>
import ProfileEntry from '@/components/common/ProfileEntry.vue'
import MetricCard from '@/components/home/MetricCard.vue'
import BatchTable from '@/components/home/BatchTable.vue'

export default {
  name: 'HomePage',
  components: {
    ProfileEntry,
    MetricCard,
    BatchTable
  },
  methods: {
    goDetect() {
      this.$router.push('/detect')
    }
  },
  data() {
    return {
      batches: [
        { id: 'CJ-20260424-01', region: 'A区 3号果园', count: 360, rate: '82%', status: '已完成', statusClass: 'done' },
        { id: 'CJ-20260424-02', region: 'B区 温室线', count: 420, rate: '76%', status: '检测中', statusClass: 'running' },
        { id: 'CJ-20260424-03', region: 'C区 露天园', count: 288, rate: '71%', status: '待启动', statusClass: 'pending' },
        { id: 'CJ-20260424-04', region: '分选复检区', count: 216, rate: '84%', status: '已完成', statusClass: 'done' }
      ],
      maturityLevels: [
        { label: '未成熟', value: '12%', percent: '12%', color: '#f59e0b' },
        { label: '转色期', value: '10%', percent: '10%', color: '#fb923c' },
        { label: '适宜采摘', value: '58%', percent: '58%', color: '#22c55e' },
        { label: '完全成熟', value: '20%', percent: '20%', color: '#16a34a' }
      ],
      tasks: [
        '09:30 前完成 A 区设备光源校准',
        '中午前复检 96 个低置信度样本',
        '下午导出今日成熟度统计报表',
        '收工前备份分选记录和原始图像'
      ]
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 32px;
  background:
    radial-gradient(circle at top left, rgba(255, 210, 106, 0.22), transparent 28%),
    radial-gradient(circle at top right, rgba(134, 239, 172, 0.22), transparent 24%),
    linear-gradient(180deg, #f8fafc 0%, #eefbf1 100%);
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, 360px);
  gap: 24px;
  margin-bottom: 24px;
}

.hero-copy,
.hero-card,
.panel {
  border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow: 0 22px 55px rgba(15, 23, 42, 0.08);
}

.hero-copy {
  padding: 34px;
  border-radius: 30px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(255, 247, 237, 0.92));
}

.eyebrow {
  margin: 0 0 14px;
  color: #0f766e;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-copy h1 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1.1;
}

.description {
  margin: 18px 0 0;
  max-width: 720px;
  color: #475569;
  font-size: 16px;
  line-height: 1.8;
}

.hero-actions {
  margin-top: 24px;
}

.primary-button {
  border: none;
  padding: 14px 22px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ea580c 0%, #15803d 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 16px 35px rgba(234, 88, 12, 0.2);
}

.hero-card {
  padding: 28px;
  border-radius: 30px;
  background: linear-gradient(180deg, #14532d 0%, #15803d 100%);
  color: #fff;
}

.hero-card-label {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.hero-card strong {
  display: block;
  margin-top: 18px;
  font-size: 48px;
  line-height: 1;
}

.hero-card p {
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.8);
}

.hero-progress {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 30px;
  font-size: 14px;
}

.progress-bar {
  margin-top: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  overflow: hidden;
}

.progress-bar i {
  display: block;
  width: 78%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #fde68a 0%, #facc15 100%);
}

.metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 320px));
  justify-content: center;
  gap: 18px;
  margin-bottom: 24px;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.9fr);
  gap: 24px;
}

.side-panel {
  display: grid;
  gap: 24px;
}

.panel {
  padding: 26px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.92);
}

.panel h3 {
  margin: 0 0 18px;
  color: #0f172a;
  font-size: 22px;
}

.distribution-list,
.task-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.distribution-list li + li,
.task-list li + li {
  margin-top: 16px;
}

.distribution-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  color: #334155;
  font-size: 14px;
}

.distribution-bar {
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.distribution-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.task-list li {
  position: relative;
  padding-left: 18px;
  color: #475569;
  line-height: 1.7;
}

.task-list li::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f59e0b;
}

@media (max-width: 1180px) {
  .metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    justify-content: stretch;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 860px) {
  .home-page {
    padding: 20px;
  }

  .hero {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .metrics {
    grid-template-columns: 1fr;
    justify-content: stretch;
  }

  .hero-copy,
  .hero-card,
  .panel {
    padding: 22px;
    border-radius: 22px;
  }
}
</style>
