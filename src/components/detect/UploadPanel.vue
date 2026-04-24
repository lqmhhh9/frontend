<template>
  <section class="panel upload-panel">
    <div class="panel-title">
      <div>
        <h3>图像上传区</h3>
        <p>支持单张图片预览，当前仅做前端展示，不触发真实检测。</p>
      </div>
      <span class="badge">演示模式</span>
    </div>

    <label class="upload-box">
      <input type="file" accept="image/*" @change="handleChange">
      <div v-if="previewUrl" class="preview">
        <img :src="previewUrl" alt="柑橘样本预览">
      </div>
      <div v-else class="placeholder">
        <strong>点击上传柑橘图片</strong>
        <p>建议使用果实正面、光照均匀的样本图像</p>
      </div>
    </label>

    <div class="meta-list">
      <div class="meta-item">
        <span>样本名称</span>
        <strong>{{ fileName || '尚未选择文件' }}</strong>
      </div>
      <div class="meta-item">
        <span>图像状态</span>
        <strong>{{ fileName ? '已加载预览' : '等待上传' }}</strong>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'UploadPanel',
  data() {
    return {
      previewUrl: '',
      fileName: ''
    }
  },
  methods: {
    handleChange(event) {
      const file = event.target.files && event.target.files[0]
      if (!file) {
        return
      }

      this.fileName = file.name
      this.previewUrl = URL.createObjectURL(file)
    }
  },
  beforeDestroy() {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl)
    }
  }
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

.badge {
  flex-shrink: 0;
  padding: 7px 12px;
  border-radius: 999px;
  background: #fef3c7;
  color: #92400e;
  font-size: 12px;
  font-weight: 700;
}

.upload-box {
  display: block;
  overflow: hidden;
  border: 2px dashed #cbd5e1;
  border-radius: 24px;
  background: linear-gradient(180deg, #fffdf8 0%, #f8fafc 100%);
  cursor: pointer;
}

.upload-box input {
  display: none;
}

.preview {
  height: 360px;
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.placeholder {
  display: flex;
  min-height: 360px;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.placeholder strong {
  color: #0f172a;
  font-size: 22px;
}

.placeholder p {
  margin: 12px 0 0;
  color: #64748b;
  line-height: 1.7;
}

.meta-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.meta-item {
  padding: 16px 18px;
  border-radius: 18px;
  background: #f8fafc;
}

.meta-item span {
  display: block;
  color: #64748b;
  font-size: 13px;
}

.meta-item strong {
  display: block;
  margin-top: 8px;
  color: #0f172a;
  font-size: 15px;
}

@media (max-width: 640px) {
  .panel {
    padding: 20px;
    border-radius: 22px;
  }

  .meta-list {
    grid-template-columns: 1fr;
  }

  .preview,
  .placeholder {
    min-height: 260px;
    height: 260px;
  }
}
</style>
