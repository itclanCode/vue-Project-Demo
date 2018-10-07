<template>
  <div class="mc-loading" :class="{'mc-top':!isFirst,'mc-default': loadstatus}">
    <div class="error-page" v-if="errorStatus && loadstatus">
      <div class="error-container">
        <div class="error-icon">
          <p>{{_constant.STATUS_DATA[status]}}</p>
          <div :class="'error-icon'+status"></div>
        </div>
        <div class="refresh">
          <el-button type="primary" @click="RefreshData">刷新</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'error',
  props: ['isFirst', 'loadstatus', 'status'],
  data () {
    return {
      errorStatus: false,
      defaultImgUrl: '/static/img/loadstatus/0.png'
    }
  },
  updated() {
  },
  watch: {
    isFirst: function (n) {
      this.errorStatus = !n;
    }
  },
  methods: {
    // 刷新,请求数据
    RefreshData () {
      this.$emit('refresh');
    }
  }
}
</script>

<style lang="stylus" scoped>
.mc-loading {
  position: absolute !important;
  top: 0px;
  left: 0;
  width: 100%;
  min-height: 100%;
  .error-page {
    text-align: center;

    .error-container, .refresh-container {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: tranlate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);

      .error-icon {
        >div{
          margin: 19px 0px 46px;
        }
        p {
          color: #ADADAD;

          &:last-child {
            padding: 22px 0px 48px;
          }
        }
      }
    }
  }
}

.mc-top {
  top: -10000px;
  left: -10000px;
}

.mc-default {
  top: 0;
  left: 0;
}
.error-icon0{
  width:116px;
  height:130px;
  background: url('../assets/img/loadstatus/0.png') no-repeat center;
}
.error-icon1{
  width:116px;
  height:130px;
  background: url('../assets/img/loadstatus/1.png') no-repeat center;
}
.error-icon2{
  width:116px;
  height:130px;
  background: url('../assets/img/loadstatus/2.png') no-repeat center;
}
.error-icon3{
  width:116px;
  height:130px;
  background: url('../assets/img/loadstatus/3.png') no-repeat center;
}
</style>

