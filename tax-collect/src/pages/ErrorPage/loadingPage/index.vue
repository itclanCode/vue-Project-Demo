<template>
  <div class="error-page">
    <div class="refresh-container">
      <p>
        <i class="el-icon-loading"></i>
        <span>数据正在加载中....</span>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'loading',
    data() {
      return {
      }
    },
    mounted() {
    },
    updated() {
      // this.isfirstload = this.isFirstLoad;
    },
    watch: {
    },
    methods: {
      reloadFn() {
        console.log('刷新');
      }
    }
  }
</script>

<style lang="stylus">
  @import './index.styl';
</style>