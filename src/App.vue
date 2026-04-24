<template>
  <div id="app">
    <LoginPage v-if="currentPage === 'login'" @login-success="goHome" />
    <HomePage v-else />
  </div>
</template>

<script>
import LoginPage from './views/LoginPage.vue'
import HomePage from './views/HomePage.vue'

export default {
  name: 'App',
  components: {
    LoginPage,
    HomePage
  },
  data() {
    return {
      currentPage: 'login'
    }
  },
  methods: {
    goHome() {
      this.currentPage = 'home'
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #eef3f8;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  color: #1f2937;
}
</style>
