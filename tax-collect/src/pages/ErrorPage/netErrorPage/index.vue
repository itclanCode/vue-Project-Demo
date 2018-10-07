<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-icon">
        <p>
          <i class="el-icon-rep-jinggao"></i>
        </p>
        <p>暂无数据或数据异常</p>
      </div>
      <div class="refresh">
        <el-button type="primary" class="re-link" @click="reloadFn">刷新</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'errorPage',
    props: ['defalutData', 'loaderDataError', 'reload', 'isFirstLoad'],
    data() {
      return {
        isShow: true
      }
    },
    mounted() {
      console.log('isFirstLoad' + this.isFirstLoad)
    },
    updated() {
      // this.isfirstload = this.isFirstLoad;
    },
    watch: {
      defalutData: function (n) {
        if (n.length > 0) {
          this.isShow = false;
        }
      }
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