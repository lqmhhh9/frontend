<template>
  <section class="login-card">
    <header class="card-header">
      <h2>账号登录</h2>
      <p>请输入用户名和密码进入系统。</p>
    </header>

    <form class="login-form" @submit.prevent="submitForm">
      <label class="field">
        <span>用户名</span>
        <input
          v-model.trim="form.username"
          type="text"
          name="username"
          autocomplete="username"
          placeholder="请输入用户名"
        >
      </label>

      <label class="field">
        <span>密码</span>
        <input
          v-model="form.password"
          type="password"
          name="password"
          autocomplete="current-password"
          placeholder="请输入密码"
        >
      </label>

      <div class="options">
        <label class="remember-me">
          <input v-model="form.rememberMe" type="checkbox">
          <span>记住我</span>
        </label>
        <a href="/" @click.prevent>忘记密码？</a>
      </div>

      <p v-if="localError" class="feedback error">{{ localError }}</p>
      <p v-else-if="errorMessage" class="feedback error">{{ errorMessage }}</p>
      <p v-else-if="successMessage" class="feedback success">{{ successMessage }}</p>

      <button class="submit-button" type="submit" :disabled="loading">
        {{ loading ? '登录中...' : '立即登录' }}
      </button>
    </form>

    <footer class="tips">
      <span>演示账号：admin</span>
      <span>演示密码：123456</span>
    </footer>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  name: 'LoginForm',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    },
    successMessage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localError: '',
      form: {
        username: '',
        password: '',
        rememberMe: false
      }
    }
  },
  watch: {
    errorMessage() {
      this.localError = ''
    },
    successMessage() {
      this.localError = ''
    }
  },
  methods: {
    async submitForm() {
      if (!this.form.username || !this.form.password) {
        this.localError = '用户名和密码不能为空。'
        return
      }
      const request= axios.create({
        baseURL:"http://localhost:5000",
      })
      request({
        method:"POST",
        url:"/api/login/login",
        data:{"username":this.form.username,"password":this.form.password},
      }).then(res=>{
        console.log(res)
        const code=res.data.code
        console.log(code)
      })


      this.localError = ''
      this.$emit('submit', { ...this.form })
    }
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  padding: 32px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(14px);
}

.card-header h2 {
  margin: 0;
  color: #0f172a;
  font-size: 30px;
}

.card-header p {
  margin: 10px 0 0;
  color: #64748b;
  line-height: 1.6;
}

.login-form {
  margin-top: 28px;
}

.field {
  display: block;
  margin-bottom: 18px;
}

.field span {
  display: block;
  margin-bottom: 10px;
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

.field input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  outline: none;
  font-size: 15px;
  color: #0f172a;
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  color: #475569;
  font-size: 14px;
}

.remember-me {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.options a {
  color: #0f766e;
  text-decoration: none;
  font-weight: 600;
}

.feedback {
  margin: 0 0 18px;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
}

.feedback.error {
  background: #fef2f2;
  color: #b91c1c;
}

.feedback.success {
  background: #ecfdf5;
  color: #047857;
}

.submit-button {
  width: 100%;
  border: none;
  border-radius: 14px;
  padding: 15px 18px;
  background: linear-gradient(135deg, #2563eb 0%, #0f766e 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  box-shadow: 0 20px 35px rgba(37, 99, 235, 0.22);
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.submit-button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.tips {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 18px;
  color: #64748b;
  font-size: 13px;
}

@media (max-width: 520px) {
  .login-card {
    padding: 24px 18px;
    border-radius: 22px;
  }

  .tips,
  .options {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
