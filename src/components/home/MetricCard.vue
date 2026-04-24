<template>
  <article class="metric-card">
    <div class="metric-head">
      <span class="metric-label">{{ label }}</span>
      <span class="metric-trend" :class="trendClass">{{ trend }}</span>
    </div>
    <strong class="metric-value">{{ value }}</strong>
    <p class="metric-note">{{ note }}</p>
  </article>
</template>

<script>
export default {
  name: 'MetricCard',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    note: {
      type: String,
      default: ''
    },
    trend: {
      type: String,
      default: ''
    },
    positive: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    trendClass() {
      return this.positive ? 'positive' : 'neutral'
    }
  }
}
</script>

<style scoped>
.metric-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 22px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  text-align: center;
}

.metric-head {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.metric-label {
  color: #64748b;
  font-size: 14px;
}

.metric-trend {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.metric-trend.positive {
  color: #047857;
  background: #dcfce7;
}

.metric-trend.neutral {
  color: #92400e;
  background: #fef3c7;
}

.metric-value {
  display: block;
  margin-top: 18px;
  color: #0f172a;
  font-size: 34px;
  line-height: 1;
}

.metric-note {
  margin: 12px 0 0;
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
}
</style>
