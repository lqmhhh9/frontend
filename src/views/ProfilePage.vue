<template>
  <main class="profile-page">
    <section class="hero">
      <div>
        <p class="eyebrow">Personal Center</p>
        <h1>个人中心</h1>
        <p class="description">
          这里集中查看当前登录用户的检测记录、图片编号和上传备注，方便后续继续追踪成熟度检测结果。
        </p>
      </div>
      <div class="hero-actions">
        <button class="action-button" type="button" @click="goDetect">继续检测</button>
        <button class="secondary-button" type="button" @click="goHome">返回首页</button>
      </div>
    </section>

    <section class="summary-grid">
      <article class="summary-card">
        <span>当前用户</span>
        <strong>{{ username || '未登录' }}</strong>
      </article>
      <article class="summary-card">
        <span>检测记录数</span>
        <strong>{{ userRecords.length }}</strong>
      </article>
      <article class="summary-card">
        <span>最近上传批次</span>
        <strong>{{ latestBatchNo }}</strong>
      </article>
    </section>

    <section class="records-panel">
      <div class="panel-header">
        <div>
          <h3>检测结果记录</h3>
          <p>当前为前端记录展示，后续可直接替换成后端返回的真实检测结果。</p>
        </div>
      </div>

      <div v-if="userRecords.length" class="table-wrap">
        <table class="record-table">
          <thead>
            <tr>
              <th>图片ID</th>
              <th>批次编号</th>
              <th>备注信息</th>
              <th>上传时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in userRecords" :key="item.imageId">
              <td>{{ item.imageId }}</td>
              <td>{{ item.batchNo }}</td>
              <td>{{ item.remark || '无' }}</td>
              <td>{{ item.createdAt }}</td>
              <td>
                <button class="view-button" type="button" @click="viewRecord(item)">查看</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <strong>还没有检测记录</strong>
        <p>你可以先上传一张柑橘图片，完成检测后再回到这里查看结果。</p>
      </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios'
import { getCurrentUsername } from '@/utils/auth'

export default {
  name: 'ProfilePage',
  data() {
    return {
      userRecords: []
    }
  },
  computed: {
    username() {
      return getCurrentUsername()
    },
    latestBatchNo() {
      return this.userRecords.length ? this.userRecords[0].batchNo : '暂无'
    }
  },
  mounted() {
    this.fetchDetectRecords()
  },
  methods: {
    formatTimestamp(timestamp) {
      const date = new Date(Number(timestamp))

      if (Number.isNaN(date.getTime())) {
        return '暂无'
      }

      return date.toLocaleString()
    },
    normalizeRecord(item) {
      const imageId = item.image_id || item.images_id || item.imageId || ''
      const batchNo = item.batch_id || item.batch_no || item.batchNo || '暂无'
      const remark = item.remark || item.note || ''
      const uploadTime = item.upload_time || item.created_at || item.createdAt || ''
      const imageIdParts = imageId.split('_')
      const timestamp = imageIdParts.length ? imageIdParts[0] : ''

      return {
        imageId,
        batchNo,
        remark,
        createdAt: uploadTime || this.formatTimestamp(timestamp)
      }
    },
    fetchDetectRecords() {
      if (!this.username) {
        this.userRecords = []
        return
      }

      const request = axios.create({
        baseURL: 'http://localhost:5000',
      })

      request({
        method: 'POST',
        url: '/api/history/history',
        data: {
          username: this.username
        }
      }).then((res) => {
        const records = Array.isArray(res.data.data) ? res.data.data : []
        this.userRecords = records
          .filter(item => {
            const imageId = item.image_id || item.imageId || ''
            return imageId ? imageId.endsWith(`_${this.username}`) : true
          })
          .map(item => this.normalizeRecord(item))
      }).catch(() => {
        this.userRecords = []
      })
    },
    viewRecord(item) {
      this.$router.push({
        name: 'profile-result',
        params: {
          imageId: item.imageId
        },
        query: {
          batchNo: item.batchNo,
          remark: item.remark || '',
          createdAt: item.createdAt,
          imageUrl: item.imageUrl || item.image_url || ''
        }
      })
    },
    goDetect() {
      this.$router.push('/detect')
    },
    goHome() {
      this.$router.push('/home')
    }
  }
  
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 32px;
  background:
    radial-gradient(circle at top left, rgba(255, 210, 106, 0.2), transparent 28%),
    radial-gradient(circle at top right, rgba(134, 239, 172, 0.2), transparent 24%),
    linear-gradient(180deg, #fffaf3 0%, #eefbf1 100%);
}

.hero,
.records-panel,
.summary-card {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow: 0 22px 55px rgba(15, 23, 42, 0.08);
}

.hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 30px;
  border-radius: 30px;
}

.eyebrow {
  margin: 0 0 12px;
  color: #0f766e;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero h1 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(30px, 4vw, 42px);
}

.description {
  margin: 16px 0 0;
  max-width: 760px;
  color: #475569;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: 12px;
}

.action-button,
.secondary-button {
  border: none;
  padding: 14px 20px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.action-button {
  background: linear-gradient(135deg, #ea580c 0%, #15803d 100%);
  color: #fff;
}

.secondary-button {
  background: #fff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 24px;
}

.summary-card {
  padding: 22px;
  border-radius: 24px;
}

.summary-card span {
  display: block;
  color: #64748b;
  font-size: 14px;
}

.summary-card strong {
  display: block;
  margin-top: 12px;
  color: #0f172a;
  font-size: 30px;
}

.records-panel {
  margin-top: 24px;
  padding: 26px;
  border-radius: 28px;
}

.panel-header h3 {
  margin: 0;
  color: #0f172a;
  font-size: 24px;
}

.panel-header p {
  margin: 8px 0 0;
  color: #64748b;
}

.table-wrap {
  margin-top: 20px;
  overflow-x: auto;
}

.record-table {
  width: 100%;
  border-collapse: collapse;
}

.record-table th,
.record-table td {
  padding: 16px 10px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

.record-table th {
  color: #64748b;
}

.record-table td {
  color: #1e293b;
}

.view-button {
  border: none;
  padding: 8px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #16a34a 0%, #0f766e 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.empty-state {
  margin-top: 20px;
  padding: 40px 20px;
  border-radius: 22px;
  background: #f8fafc;
  text-align: center;
}

.empty-state strong {
  color: #0f172a;
  font-size: 20px;
}

.empty-state p {
  margin: 12px 0 0;
  color: #64748b;
}

@media (max-width: 900px) {
  .hero {
    flex-direction: column;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .profile-page {
    padding: 20px;
  }

  .hero,
  .records-panel,
  .summary-card {
    padding: 22px;
    border-radius: 22px;
  }

  .hero-actions {
    width: 100%;
    flex-direction: column;
  }
}
</style>
