<template>
  <!-- 此处为入口 公共部分可以放到这里 -->
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
import error from '@/services/error'

export default {
  data() {
    return {
      isRouterAlive: true
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  name: 'app',
  mounted() {
    // 全局错误初始化
    error.init.call(this)
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => (this.isRouterAlive = true))
    }
  }
}
</script>

<style>
@import './style/all.styl';
@import 'https://at.alicdn.com/t/font_665944_c0mspjbgx2u.css';
/* @import './assets/font/iconfont.css'; */

#app {
  font-family: MicrosoftYaHei, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 0;
  margin: 0;
  height:100%;
  overflow-y: hidden;
  overflow-x: hidden;
  width: 100%;
  min-width: 1340px;
  overflow: auto;
}
</style>
