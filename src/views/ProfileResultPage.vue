<template>
  <main class="result-page">
    <section class="hero">
      <div>
        <p class="eyebrow">Batch Result</p>
        <h1>批次检测结果</h1>
        <p class="description">
          这里展示当前批次的检测详情。页面已经接上记录跳转，后续可以直接把后端返回的成熟度、品质判定和统计结果填进来。
        </p>
      </div>
      <div class="hero-actions">
        <button class="action-button" type="button" @click="goProfile">返回记录页</button>
        <button class="secondary-button" type="button" @click="goDetect">继续检测</button>
      </div>
    </section>

    <section class="info-grid">
      <article class="info-card">
        <span>图片ID</span>
        <strong>{{ imageId || '暂无' }}</strong>
      </article>
      <article class="info-card">
        <span>批次编号</span>
        <strong>{{ batchNo || '暂无' }}</strong>
      </article>
      <article class="info-card">
        <span>上传时间</span>
        <strong>{{ createdAt || '暂无' }}</strong>
      </article>
    </section>

    <section class="detail-panel">
      <div class="panel-head">
        <h3>结果摘要</h3>
        <span class="status-chip">{{ statusText }}</span>
      </div>

      <p v-if="message" class="result-message" :class="messageType">{{ message }}</p>

      <div class="result-layout">
        <section class="image-panel">
          <div class="image-head">
            <h4>检测图片</h4>
            <span>{{ imagePreview ? '已加载' : '暂无图片' }}</span>
          </div>
          <div class="image-frame">
            <img v-if="imagePreview" :src="imagePreview" alt="检测结果图片">
            <div v-else class="image-placeholder">
              <strong>暂无图片可展示</strong>
              <p>当前可以从后端返回图片地址，或者在记录列表跳转时把图片地址一起带过来。</p>
            </div>
          </div>
        </section>

        <div class="result-grid">
          <article class="result-block">
            <span>检测图片ID</span>
            <strong>{{ displayImageId }}</strong>
            <p>后端返回的本次检测图片唯一标识。</p>
          </article>
          <article class="result-block">
            <span>识别果实总数</span>
            <strong>{{ yoloSummary.orangeNum }}</strong>
            <p>当前图片中被识别到的柑橘总数量。</p>
          </article>
          <article class="result-block">
            <span>优质果数量</span>
            <strong>{{ yoloSummary.good }}</strong>
            <p>YOLO 结果中判定为优质果的数量。</p>
          </article>
          <article class="result-block">
            <span>坏果数量</span>
            <strong>{{ yoloSummary.bad }}</strong>
            <p>YOLO 结果中判定为坏果的数量。</p>
          </article>
          <article class="result-block">
            <span>最高置信度</span>
            <strong>{{ yoloSummary.conf }}</strong>
            <p>当前检测结果返回的目标识别置信度。</p>
          </article>
          <article class="result-block">
            <span>备注信息</span>
            <strong>{{ remark || '无' }}</strong>
            <p>上传记录携带的备注会在这里同步展示。</p>
          </article>
          <article class="result-block result-block-wide">
            <span>结果说明</span>
            <strong>{{ resultConclusion }}</strong>
            <p>根据后端返回的优果、坏果数量和置信度生成当前批次的摘要说明。</p>
          </article>
          <article class="result-block result-block-wide">
            <span>原始 YOLO 结果</span>
            <strong>{{ rawYoloText }}</strong>
            <p>这里保留后端返回的核心检测字段，方便继续联调。</p>
          </article>
        </div>
      </div>

      <div class="raw-panel" v-if="rawResultText">
        <h4>后端返回详情</h4>
        <pre>{{ rawResultText }}</pre>
      </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios'
import { getCurrentUsername } from '@/utils/auth'

export default {
  name: 'ProfileResultPage',
  data() {
    return {
      loading: false,
      message: '',
      messageType: 'warning',
      resultData: null
    }
  },
  computed: {
    imageId() {
      return this.$route.params.imageId || ''
    },
    userId() {
      return getCurrentUsername()
    },
    batchNo() {
      return this.$route.query.batchNo || ''
    },
    remark() {
      return this.$route.query.remark || ''
    },
    createdAt() {
      return this.$route.query.createdAt || ''
    },
    routeImageUrl() {
      return this.$route.query.imageUrl || ''
    },
    statusText() {
      if (this.loading) {
        return '结果加载中'
      }

      return this.resultData ? '结果已返回' : '等待后端结果'
    },
    displayImageId() {
      const data = this.resultData || {}
      return data.image_id || data.imageId || this.imageId || '暂无'
    },
    yoloSummary() {
      const data = this.resultData || {}
      const yoloResult = data.yolo_result || data.yoloResult || {}

      return {
        orangeNum: yoloResult.orange_num ?? yoloResult.orangeNum ?? 0,
        good: yoloResult.good ?? 0,
        bad: yoloResult.bad ?? 0,
        conf: typeof (yoloResult.conf ?? 0) === 'number'
          ? (yoloResult.conf ?? 0).toFixed(4)
          : (yoloResult.conf || '0.0000')
      }
    },
    resultConclusion() {
      if (!this.resultData) {
        return '等待后端返回检测结论'
      }

      if (this.yoloSummary.bad > 0) {
        return '当前图片中检测到坏果，建议优先复查该批次。'
      }

      if (this.yoloSummary.good > 0) {
        return '当前图片检测结果以优质果为主，整体状态较好。'
      }

      return '当前批次暂无明确结论，请结合原始图像继续确认。'
    },
    rawYoloText() {
      if (!this.resultData) {
        return '等待返回'
      }

      try {
        return JSON.stringify(this.resultData.yolo_result || this.resultData.yoloResult || {}, null, 2)
      } catch (error) {
        return '等待返回'
      }
    },
    imagePreview() {
      const data = this.resultData || {}
      return data.image_url || data.imageUrl || data.url || this.routeImageUrl || ''
    },
    rawResultText() {
      if (!this.resultData) {
        return ''
      }

      try {
        return JSON.stringify(this.resultData, null, 2)
      } catch (error) {
        return ''
      }
    }
  },
  mounted() {
    this.fetchBatchResult()
  },
  methods: {
    fetchBatchResult() {
      if (!this.imageId || !this.userId) {
        this.messageType = 'warning'
        this.message = '缺少图片ID或用户ID，暂时无法查询结果。'
        return
      }

      this.loading = true
      this.message = ''

      const request = axios.create({
        baseURL: 'http://localhost:5000',
      })

      request({
        method: 'POST',
        url: '/api/result/result',
        data: {
          image_id: this.imageId,
          user_id: this.userId
        }
      }).then((res) => {
        const payload = res.data.data
        console.log(payload)
        this.resultData = Array.isArray(payload) ? (payload[0] || null) : payload
        console.log(this.resultData)
        this.messageType = 'success'
        this.message = this.resultData ? '检测结果已成功加载。' : '后端已响应，但当前没有结果数据。'
      }).catch(() => {
        this.resultData = null
        this.messageType = 'warning'
        this.message = '结果请求失败，请检查后端接口是否正常。'
      }).finally(() => {
        this.loading = false
      })
    },
    goProfile() {
      this.$router.push('/profile')
    },
    goDetect() {
      this.$router.push('/detect')
    }
  }
}
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  padding: 32px;
  background:
    radial-gradient(circle at top left, rgba(255, 210, 106, 0.16), transparent 30%),
    radial-gradient(circle at top right, rgba(134, 239, 172, 0.16), transparent 26%),
    linear-gradient(180deg, #f8fafc 0%, #eefbf1 100%);
}

.hero,
.info-card,
.detail-panel {
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.8);
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
  background: linear-gradient(135deg, #16a34a 0%, #0f766e 100%);
  color: #fff;
}

.secondary-button {
  background: #fff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 24px;
}

.info-card {
  padding: 22px;
  border-radius: 24px;
}

.info-card span {
  display: block;
  color: #64748b;
  font-size: 14px;
}

.info-card strong {
  display: block;
  margin-top: 12px;
  color: #0f172a;
  font-size: 24px;
  line-height: 1.4;
  word-break: break-word;
}

.detail-panel {
  margin-top: 24px;
  padding: 26px;
  border-radius: 28px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.panel-head h3 {
  margin: 0;
  color: #0f172a;
  font-size: 24px;
}

.status-chip {
  padding: 8px 12px;
  border-radius: 999px;
  background: #fef3c7;
  color: #92400e;
  font-size: 12px;
  font-weight: 700;
}

.result-message {
  margin: 18px 0 0;
  padding: 12px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.6;
}

.result-message.success {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #047857;
}

.result-message.warning {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
}

.result-grid {
  display: grid;
  gap: 18px;
}

.result-layout {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(0, 1.1fr);
  gap: 18px;
  margin-top: 20px;
}

.image-panel {
  padding: 20px;
  border-radius: 20px;
  background: #f8fafc;
}

.image-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.image-head h4 {
  margin: 0;
  color: #0f172a;
  font-size: 18px;
}

.image-head span {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.image-frame {
  overflow: hidden;
  border-radius: 16px;
  background: #e2e8f0;
  min-height: 360px;
}

.image-frame img {
  width: 100%;
  height: 100%;
  min-height: 360px;
  object-fit: cover;
  display: block;
}

.image-placeholder {
  min-height: 360px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.image-placeholder strong {
  color: #0f172a;
  font-size: 20px;
}

.image-placeholder p {
  margin: 12px 0 0;
  color: #475569;
  line-height: 1.7;
}

.result-block {
  padding: 20px;
  border-radius: 20px;
  background: #f8fafc;
}

.result-block-wide {
  grid-column: span 2;
}

.result-block span {
  display: block;
  color: #64748b;
  font-size: 14px;
}

.result-block strong {
  display: block;
  margin-top: 10px;
  color: #0f172a;
  font-size: 24px;
  line-height: 1.4;
  word-break: break-word;
}

.result-block p {
  margin: 10px 0 0;
  color: #475569;
  line-height: 1.7;
}

.raw-panel {
  margin-top: 20px;
  padding: 20px;
  border-radius: 20px;
  background: #f8fafc;
}

.raw-panel h4 {
  margin: 0 0 12px;
  color: #0f172a;
  font-size: 18px;
}

.raw-panel pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: #334155;
  font-size: 13px;
  line-height: 1.7;
}

@media (max-width: 900px) {
  .hero {
    flex-direction: column;
  }

  .info-grid,
  .result-layout,
  .result-grid {
    grid-template-columns: 1fr;
  }

  .result-block-wide {
    grid-column: span 1;
  }
}

@media (max-width: 640px) {
  .result-page {
    padding: 20px;
  }

  .hero,
  .info-card,
  .detail-panel {
    padding: 22px;
    border-radius: 22px;
  }

  .hero-actions {
    width: 100%;
    flex-direction: column;
  }
}
</style>
