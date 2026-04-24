<template>
  <main class="login-page" :style="pageStyle">
    <LoginForm
      :loading="loading"
      :error-message="errorMessage"
      :success-message="successMessage"
      @login-success="handleLoginSuccess"
      @submit="handleLogin"
    />
  </main>
</template>

<script>
import LoginForm from '@/components/login/LoginForm.vue'
import citrusLoginBg from '@/assets/citrus-login-bg.svg'

export default {
  name: 'LoginPage',
  components: {
    LoginForm
  },
  data() {
    return {
      backgroundImage: citrusLoginBg,
      loading: false,
      errorMessage: '',
      successMessage: ''
    }
  },
  computed: {
    pageStyle() {
      return {
        backgroundImage: `linear-gradient(rgba(250, 245, 230, 0.34), rgba(236, 244, 228, 0.52)), url(${this.backgroundImage})`
      }
    }
  },
  methods: {
    handleLoginSuccess(payload) {
      this.$emit('login-success', payload)
    },
    handleLogin(payload) {
      this.loading = true
      this.errorMessage = ''
      this.successMessage = ''

      window.setTimeout(() => {
        if (payload.username === 'admin' && payload.password === '123456') {
          this.successMessage = '登录成功，后续可以在这里接入跳转或用户信息拉取逻辑。'
        } else {
          this.errorMessage = '账号或密码不正确，请检查后重试。'
        }

        this.loading = false
      }, 900)
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 48px 72px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.login-page :deep(.login-card) {
  width: min(420px, 100%);
  background: rgba(255, 255, 255, 0.92);
  border-color: rgba(255, 255, 255, 0.72);
  box-shadow: 0 28px 60px rgba(120, 87, 14, 0.18);
}

@media (max-width: 960px) {
  .login-page {
    justify-content: center;
    padding: 28px 20px 40px;
    background-position: 35% center;
  }
}
</style>
