<template>
  <main class="detect-page">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Citrus Inspection Workspace</p>
        <h1>柑橘检测与品质筛选页面</h1>
        <p class="description">
          这个页面用于承接柑橘成熟度检测和好坏筛选功能。当前先完成前端展示结构，
          包含样本上传、检测参数、结果摘要和说明区域，方便后续直接接入模型推理接口。
        </p>
      </div>

      <section class="config-card">
        <h3>检测参数</h3>
        <div class="config-grid">
          <label class="field">
            <span>检测任务</span>
            <select>
              <option>成熟度检测</option>
              <option>品质筛选</option>
              <option>综合分析</option>
            </select>
          </label>
          <label class="field">
            <span>样本来源</span>
            <select>
              <option>分选线相机</option>
              <option>人工采样图片</option>
              <option>移动端上传</option>
            </select>
          </label>
          <label class="field">
            <span>批次编号</span>
            <input v-model.trim="form.batchNo" type="text" placeholder="例如 CJ-20260424-05">
          </label>
          <label class="field">
            <span>备注信息</span>
            <input v-model.trim="form.remark" type="text" placeholder="记录果园、采摘时间等信息">
          </label>
        </div>
        <p v-if="actionMessage" class="action-message" :class="actionState">{{ actionMessage }}</p>
        <button class="action-button" type="button" :disabled="loading" @click="startDetect">
          {{ loading ? '上传中...' : '开始检测（前端演示）' }}
        </button>
      </section>
    </section>

    <section class="workspace">
      <UploadPanel @upload-change="handleUploadChange" />
      <ResultSummary @back-home="goHome" />
    </section>
  </main>
</template>

<script>
import axios from 'axios'
import UploadPanel from '@/components/detect/UploadPanel.vue'
import ResultSummary from '@/components/detect/ResultSummary.vue'
import { getCurrentUsername } from '@/utils/auth'

export default {
  name: 'DetectPage',
  components: {
    UploadPanel,
    ResultSummary
  },
  data() {
    return {
      hasUploadedImage: false,
      selectedImage: null,
      form: {
        batchNo: '',
        remark: ''
      },
      actionMessage: '',
      actionState: 'warning',
      loading: false
    }
  },
  methods: {
    handleUploadChange(payload) {
      this.hasUploadedImage = payload.uploaded
      this.selectedImage = payload.file
      this.actionMessage = ''
    },
    startDetect() {
      if (!this.hasUploadedImage) {
        this.actionState = 'warning'
        this.actionMessage = '请先上传图片后再开始检测。'
        window.alert('请先上传图片后再开始检测。')
        return
      }

      if (!this.form.batchNo) {
        this.actionState = 'warning'
        this.actionMessage = '请先填写图片批次编号。'
        window.alert('请先填写图片批次编号。')
        return
      }

      const username = getCurrentUsername()

      if (!username) {
        this.actionState = 'warning'
        this.actionMessage = '当前未获取到登录用户，请重新登录后再上传图片。'
        window.alert('当前未获取到登录用户，请重新登录后再上传图片。')
        this.$router.push('/login')
        return
      }

      const timestamp = Date.now()
      const imageId = `${timestamp}_${username}`

      const formData = new FormData()
      formData.append('file', this.selectedImage)
      formData.append('batchNo', this.form.batchNo)
      formData.append('imageId', imageId)
      formData.append('remark', this.form.remark)
      formData.append('username', username)

      this.loading = true
      this.actionMessage = ''

      const request = axios.create({
        baseURL: 'http://localhost:5000',
      })

      request({
        method: 'POST',
        url: '/api/upload/upload',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        console.log(res)
        this.actionState = 'success'
        this.actionMessage = `图片上传成功，已发送到后端。图片ID：${imageId}`
      }).catch(() => {
        this.actionState = 'warning'
        this.actionMessage = '图片上传失败，请检查后端接口是否正常。'
      }).finally(() => {
        this.loading = false
      })
    },
    goHome() {
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
.detect-page {
  min-height: 100vh;
  padding: 32px;
  background:
    radial-gradient(circle at top left, rgba(254, 215, 170, 0.26), transparent 28%),
    radial-gradient(circle at top right, rgba(134, 239, 172, 0.22), transparent 24%),
    linear-gradient(180deg, #fffaf3 0%, #eefbf1 100%);
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.9fr);
  gap: 24px;
  margin-bottom: 24px;
}

.hero-copy,
.config-card {
  padding: 30px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow: 0 22px 55px rgba(15, 23, 42, 0.08);
}

.eyebrow {
  margin: 0 0 14px;
  color: #c2410c;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-copy h1,
.config-card h3 {
  margin: 0;
  color: #0f172a;
}

.hero-copy h1 {
  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.1;
}

.description {
  margin: 18px 0 0;
  color: #475569;
  font-size: 16px;
  line-height: 1.8;
}

.config-grid {
  display: grid;
  gap: 16px;
  margin-top: 20px;
}

.field span {
  display: block;
  margin-bottom: 10px;
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

.field input,
.field select {
  width: 100%;
  padding: 13px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  background: #fff;
  color: #0f172a;
  font-size: 14px;
  outline: none;
}

.action-button {
  width: 100%;
  margin-top: 18px;
  border: none;
  padding: 15px 18px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ea580c 0%, #15803d 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.action-button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.action-message {
  margin: 18px 0 0;
  padding: 12px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.6;
}

.action-message.warning {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
}

.action-message.success {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #047857;
}

.workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
}

@media (max-width: 1100px) {
  .hero,
  .workspace {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .detect-page {
    padding: 20px;
  }

  .hero-copy,
  .config-card {
    padding: 22px;
    border-radius: 22px;
  }
}
</style>
