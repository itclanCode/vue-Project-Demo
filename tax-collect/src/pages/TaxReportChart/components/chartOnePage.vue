<!-- 报告总体情况图表页 -->

<template>
  <div class="onePage">
    <el-card id="one" v-loading="loading">
      <p>涉税信息总体情况</p>
      <div class="tableBox">
        <el-table :data="tableData" height="360" style="width: 100%" :cell-style='cellStyle' :header-cell-style='headerCellStyle' :row-style='rowStyle' tooltip-effect="dark" stripe>
          <el-table-column prop="fxdx" label="分析对象" align='center'>
          </el-table-column>
          <el-table-column prop="hs" label="总数" width="200" align='center'>
          </el-table-column>
          <el-table-column prop="zzhs" label="增长数" width="200" align='center'>
          </el-table-column>
          <el-table-column prop="zzl" label="比上月增长率" width="200" align='center'>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card id="two" v-loading="loading">
      <p>已实名涉税专业服务机构类别分布</p>
      <div class="chartBox">
        <ve-histogram :grid='grid' :legend='legend' :data="chartData" :extend="chartExtend" :data-empty="chartData.rows.length == 0 ? true : false"></ve-histogram>
      </div>
    </el-card>
  </div>
</template>

<script>
import { TaxAnalysisReport } from '@/services/request'
export default {
  name: 'OnePage',
  data() {
    // grid----------------------------------------------------
    this.grid = {
      top: '40px',
      right: '55px',
      bottom: '30px'
    }
    // 图例-----------------------------------------------------
    this.legend = {
      x: 'center',
      y: '90%',
      data: ['访问用户']
    }
    // yAxis---------------------------------------------------
    // this.yAxis = {
    //   show: true,
    //   name: '数量(个)',
    //   nameTextStyle: {
    //     fontSize: 14
    //   },
    //   axisLabel: {
    //     fontSize: 14
    //   },
    //   axisLine: {
    //     show: true,
    //     color: '#333'
    //   },
    //   splitLine: {
    //     lineStyle: {
    //       type: 'dashed'
    //     }
    //   }
    // }
    // series--------------------------------------------------
    this.chartExtend = {
      color: ['#1890FF', '#EF4864'],
      series(v) {
        v.forEach(i => {
          i.barWidth = 40
          i.itemStyle = {
            normal: {
              // barBorderRadius: [5, 5, 0, 0]
            }
          }
        })
        return v
      },
      xAxis(v) {
        v[0].name = '机构'
        v[0].nameTextStyle = {
          fontSize: 14
        }
        v[0].axisLabel = {
          interval: 0,
          rotate: 30,
          fontSize: 14
        }
        v[0].nameLocation = 'end'
        v[0].axisLine = {
          show: true,
          color: '#333'
        }
        return v
      },
      yAxis(v) {
        v[0].name = '数量'
        v[0].nameTextStyle = {
          fontSize: 14
        }
        v[0].axisLabel = {
          fontSize: 14
        }
        v[0].nameLocation = 'end'
        v[0].axisLine = {
          show: true,
          color: '#333'
        }
        v[0].splitLine = {
          lineStyle: {
            type: 'dashed'
          }
        }
        return v
      },
      tooltip(v) {
        v.formatter = function(params) {
          return `${params[0].name}<br/>数量：${params[0].value || 0}个`
        }
        v.axisPointer = {
          type: 'shadow'
        }
        return v
      }
    }
    return {
      // 表格样式
      cellStyle: {
        textAlign: 'left',
        fontSize: '14px'
      },
      headerCellStyle: {
        height: '40px',
        fontSize: '18px',
        color: '#000',
        textAlign: 'left'
      },
      rowStyle: {
        height: '50px',
        borderLeft: 'none'
      },
      // 表格数据
      tableData: [],
      // 图表数据
      chartData: {
        columns: ['jglb', 'hs'],
        rows: []
      },
      loading: true
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      const params = this.params
      TaxAnalysisReport.getOnePage(params)
        .then(info => {
          this.chartData.rows = info.ysmsszyfwjglbfb.data
          this.tableData = info.ssxxztqk.data
        })
        .then(() => {
          this.loading = false
        })
    }
  },
  props: {
    params: {
      type: Object,
      requir: true
    }
  },
  watch: {
    params: {
      handler(oldValue, newValue) {
        this.getData()
      },
      deep: true
    }
  }
}
</script>

<style lang="stylus">
.onePage
  margin-top 20px
  .el-card
    width 100%
    height 460px
    margin-bottom 20px
    background rgba(255, 255, 255, 1)
    box-shadow 0px 2px 8px 0px rgba(181, 181, 181, 0.5)
    .el-card__body
      height 100%
      width 100%
      padding 0
      p
        width 100%
        padding-top 20px
        text-align center
        font-size 24px
        font-weight 700
        font-family '微软雅黑'
      .tableBox
        height 88%
        width 80%
        margin 0 auto
      .chartBox
        width 80%
        margin 0 auto
        .v-charts-data-empty
          color #999
          position absolute
          top 50%
          left 50%
          transform translate(-50%, -50%)
</style>