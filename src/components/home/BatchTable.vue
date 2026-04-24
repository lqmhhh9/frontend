<template>
  <section class="panel">
    <div class="panel-header">
      <div>
        <h3>最近检测批次</h3>
        <p>查看当前柑橘成熟度筛选任务的运行情况。</p>
      </div>
      <span class="panel-tag">实时监控</span>
    </div>

    <div class="table-wrap">
      <table class="batch-table">
        <thead>
          <tr>
            <th>批次编号</th>
            <th>果园区域</th>
            <th>样本数量</th>
            <th>成熟度占比</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in batches" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.region }}</td>
            <td>{{ item.count }}</td>
            <td>{{ item.rate }}</td>
            <td>
              <span class="status" :class="item.statusClass">{{ item.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
export default {
  name: 'BatchTable',
  props: {
    batches: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>
.panel {
  padding: 26px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.76);
  box-shadow: 0 22px 50px rgba(15, 23, 42, 0.08);
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.panel-header h3 {
  margin: 0;
  color: #0f172a;
  font-size: 22px;
}

.panel-header p {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 14px;
}

.panel-tag {
  flex-shrink: 0;
  padding: 8px 12px;
  border-radius: 999px;
  background: #ecfccb;
  color: #3f6212;
  font-size: 12px;
  font-weight: 700;
}

.table-wrap {
  overflow-x: auto;
}

.batch-table {
  width: 100%;
  border-collapse: collapse;
}

.batch-table th,
.batch-table td {
  padding: 16px 10px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

.batch-table th {
  color: #64748b;
  font-weight: 600;
}

.batch-table td {
  color: #1e293b;
}

.status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 84px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.status.done {
  color: #166534;
  background: #dcfce7;
}

.status.running {
  color: #1d4ed8;
  background: #dbeafe;
}

.status.pending {
  color: #92400e;
  background: #fef3c7;
}
</style>
