<template>
  <main class="register-page">
    <ProfileEntry />
    <section class="register-card">
      <header class="card-header">
        <p class="eyebrow">Create Account</p>
        <h1>注册柑橘检测系统账号</h1>

      </header>

      <form class="register-form" @submit.prevent>
        <label class="field">
          <span>用户名</span>
          <input v-model.trim="form.username" type="text" placeholder="请输入用户名">
        </label>

        <label class="field">
          <span>密码</span>
          <input v-model="form.password" type="password" placeholder="请输入密码">
        </label>

        <label class="field">
          <span>确认密码</span>
          <input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码">
        </label>

        <p v-if="errorMessage" class="feedback error">{{ errorMessage }}</p>
        <p v-else-if="successMessage" class="feedback success">{{ successMessage }}</p>

        <button class="primary-button" type="button" :disabled="loading" @click="registerUser">
          {{ loading ? '注册中...' : '注册账号' }}
        </button>
        <button class="secondary-button" type="button" @click="goLogin">返回登录</button>
      </form>
    </section>
  </main>
</template>

<script>
import axios from 'axios'
import ProfileEntry from '@/components/common/ProfileEntry.vue'
import { setCurrentUser } from '@/utils/auth'
export default {
  name: 'RegisterPage',
  components: {
    ProfileEntry
  },
  data(){
    return {
      form:{
        username:'',
        password:'',
        confirmPassword: ''
      }
      ,
      errorMessage: '',
      successMessage: '',
      loading: false
    }
  },
  methods: {
    goLogin() {
      this.$router.push('/login')
    },
    registerUser(){
      if (!this.form.username || !this.form.password || !this.form.confirmPassword) {
        this.errorMessage = '用户名和密码不能为空。'
        this.successMessage = ''
        return
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.errorMessage = '两次输入的密码不一致。'
        this.successMessage = ''
        return
      }

      this.loading = true
      this.errorMessage = ''
      this.successMessage = ''

      const request= axios.create({
        baseURL:"http://localhost:5000",
      })
      request({
        method:"POST",
        url:"/api/registerUser/registerUser",
        data:{"username":this.form.username,"password":this.form.password},
      }).then((res)=>{
        console.log(res)
        const code=res.data.code

        if (code === 1) {
          setCurrentUser(this.form.username)
          this.successMessage = '注册成功，正在跳转到首页。'
          window.setTimeout(() => {
            this.$router.push('/home')
          }, 800)
          return
        }

        if (code === -1) {
          this.errorMessage = '该用户名已存在，请更换后重试。'
          return
        }

        this.errorMessage = '注册失败，请稍后重试。'
      }).catch(() => {
        this.errorMessage = '注册请求失败，请检查后端服务是否正常。'
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.register-page {
  background-image:
    linear-gradient(rgba(250, 245, 230, 0.34), rgba(236, 244, 228, 0.52)),
    url('~@/assets/citrus-login-bg.svg');
}

.register-card {
  width: min(520px, 100%);
  padding: 34px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.76);
  box-shadow: 0 28px 60px rgba(120, 87, 14, 0.18);
}

.eyebrow {
  margin: 0 0 12px;
  color: #0f766e;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.card-header h1 {
  margin: 0;
  color: #0f172a;
  font-size: 34px;
  line-height: 1.15;
}

.description {
  margin: 14px 0 0;
  color: #64748b;
  line-height: 1.8;
}

.register-form {
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
}

.primary-button,
.secondary-button {
  width: 100%;
  border-radius: 14px;
  padding: 15px 18px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
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

.primary-button {
  margin-top: 6px;
  border: none;
  background: linear-gradient(135deg, #2563eb 0%, #0f766e 100%);
  color: #fff;
}

.primary-button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.secondary-button {
  margin-top: 12px;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #0f172a;
}

@media (max-width: 640px) {
  .register-card {
    padding: 24px 18px;
    border-radius: 22px;
  }

  .card-header h1 {
    font-size: 28px;
  }
}
</style>
