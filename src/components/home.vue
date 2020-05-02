<template>
    <dev class="home">
      <el-button type="info" @click="logout">退出</el-button>
    </dev>
</template>

<script>
export default {
  name: 'home',
  methods: {
    // 退出功能
    logout () {
      // 清除session
      window.sessionStorage.clear()
      // 返回，push
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
  .home{

  }
</style>
