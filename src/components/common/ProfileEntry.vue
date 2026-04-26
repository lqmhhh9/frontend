<template>
  <button class="profile-entry" type="button" @click="goProfile">
    {{ buttonText }}
  </button>
</template>

<script>
import { getCurrentUsername } from '@/utils/auth'

export default {
  name: 'ProfileEntry',
  computed: {
    buttonText() {
      return getCurrentUsername() ? '前往个人中心' : '登录后查看个人中心'
    }
  },
  methods: {
    goProfile() {
      if (getCurrentUsername()) {
        this.$router.push('/profile')
        return
      }

      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.profile-entry {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  border: none;
  padding: 12px 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, #16a34a 0%, #0f766e 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 16px 35px rgba(22, 163, 74, 0.22);
  backdrop-filter: blur(10px);
}

@media (max-width: 640px) {
  .profile-entry {
    top: 14px;
    right: 14px;
    padding: 10px 14px;
    font-size: 13px;
  }
}
</style>
