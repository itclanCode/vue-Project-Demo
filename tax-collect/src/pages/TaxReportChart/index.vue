<!-- Created by qintengbo on 2018/08/02. -->
<!-- 涉税分析报告 -->

<template>
  <!-- <div class="taxReportChart" ref="paddingBox" style="padding-top:148px">
    <el-card ref="topBox" style="position:fixed;top:93px;width:1179.2px;z-index:9999"> -->
  <div class="taxReportChart">
    <el-card>
      <!-- 时间轴 -->
      <div class="timeLine">
        <el-radio-group class="radioGroup" v-model="params.tjsj">
          <el-radio v-for="(item, index) in timeData" :key="index" :label="item">
            <span class="radioText">{{item}}</span>
          </el-radio>
        </el-radio-group>
        <el-dropdown class="dropdown" @command="command" placement='bottom-start'>
          <el-button type="primary">
            {{ area }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, index) in areaArr" :command="index" :key="index">
              {{ item.swjgmc }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 模块链接 -->
      <div class="operationCon">
        <div class="headerBtnCon">
          <span v-for="(item,key) in chartMenu" :key="key" :class="{ 'active1': active == item.key}" @click="selectBtn(item.key)">
            {{ item.name }}
          </span>
        </div>
        <el-row class="radioCon">
          <el-col class="radioCol" :span="6" v-for="item in chartMenu[pageNum - 1].children" :key="item.key">
            <a :href="item.id" @click="chartActive = item.key">
              <span class="radio-order" :class="{ 'active3': chartActive == item.key }"></span>
              {{ item.name }}
            </a>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <div class="chartContainer">
      <OnePage v-if="pageNum == '1'" :params="params"></OnePage>
      <TwoPage v-if="pageNum == '2'" :params="params"></TwoPage>
      <ThreePage v-if="pageNum == '3'" :params="params"></ThreePage>
      <FourPage v-if="pageNum == '4'" :params="params"></FourPage>
    </div>
  </div>
</template>

<script>
import pagMenu from '@/common/js/chartMenu'
import OnePage from './components/chartOnePage'
import TwoPage from './components/chartTwoPage'
import ThreePage from './components/chartThreePage'
import FourPage from './components/chartFourPage'
import { TaxAnalysisReport } from '@/services/request'
export default {
  components: {
    OnePage,
    TwoPage,
    ThreePage,
    FourPage
  },
  data() {
    return {
      params: {
        tjsj: 201807,
        tj_swjg: '14403000000'
      },
      timeData: [],
      active: 1,
      chartActive: '1-1', // 图表序号
      chartMenu: pagMenu, // 导航栏按钮
      pageNum: 1, // 页面序号
      area: '深圳市',
      areaArr: []
    }
  },
  created() {
    this.getSWJG_DM()
    this.getTime()
  },
  methods: {
    // 区域选择
    command: function(command) {
      this.area = this.areaArr[command].swjgmc
      this.params.tj_swjg = this.areaArr[command].swjg_dm
    },
    // 页面选择
    selectBtn: function(key) {
      // this.$router.history.router.history.current.hash = ''
      // console.log(
      //   this.$router.history.router.history.current.hash,
      //   111111111111
      // )
      this.active = key
      this.pageNum = key
      this.chartActive = `${key}-1`
      // 延时一秒，动态获取头部壳子高度
      // var _this = this
      // setTimeout(function() {
      //   let heightStyle = _this.$refs.topBox.$el.offsetHeight
      //   _this.$refs.paddingBox.style.paddingTop = heightStyle - 30 + 'px'
      // }, 100)
    },
    // 获取数据时间
    getTime: function() {
      TaxAnalysisReport.getTime().then(res => {
        this.timeData = res
        this.params.tjsj = res[1]
      })
    },
    // 获取税务机关代码
    getSWJG_DM: function() {
      TaxAnalysisReport.getSWJG_DM().then(info => {
        this.areaArr = info.data[0].data
      })
    }
  }
}
</script>

<style lang="stylus">
.taxReportChart
  .timeLine
    width 100%
    position relative
    height 80px
    margin 0 auto
  .radioGroup
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    .radioText
      position absolute
      left -12px
      bottom 25px
    &:before
      content ''
      width 140%
      height 2px
      background-color #D8D8D8
      position absolute
      z-index -1
      left 50%
      bottom 50%
      transform translate(-50%, -50%)
  .dropdown
    position absolute
    top 50%
    left 10px
    transform translateY(-50%)
  .el-radio+.el-radio
    margin-left 89px
  .headerBtnCon
    text-align center
  .headerBtnCon span
    display inline-block
    margin-left 20px
    padding 5px 12px
    border 1px solid #409EFF
    border-radius 16px
    cursor pointer
    &:first-child
      margin-left 0
  .active1
    color #fff
    background #409EFF
  .active3
    background #409EFF
  .operationCon
    width 100%
    display inline-block
    text-align left
  .radioCon
    margin-top 10px
    .radio-order
      display inline-block
      margin-right 10px
      width 10px
      height 10px
      border-radius 50%
      border 1px solid #409EFF
      vertical-align middle
    a
      color #303133
      margin-left 20px
      font-size 16px
      &:first-child
        margin-left 0
  .radioCol
    margin-top 10px
    width 33%
  .el-button
    padding 8px 10px
</style>


