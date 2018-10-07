<!-- 已实名涉税专业服务人员基本情况 -->

<template>
  <div class="threePage">
    <el-card>
      <!-- 柱状图 -->
      <h2 id="one">涉税专业服务人员采集情况</h2>
      <div class="chartSingleRowBox">
        <div class="chartSingleRow">
          <ve-histogram :data="chartData_1" :extend="chartExtend_1" :title="title_1" :grid='grid_1' :settings="chartSettings_1" :yAxis='yAxis_1' :legend='legend_1' height='100%' width='100%'></ve-histogram>
        </div>
      </div>
      <!-- 饼图 -->
      <div class="chartRow" id="two">
        <ve-pie :data="chartData_2" :extend="chartExtend_pieCommon" :title='title_2' :legend='legend_2' height='100%' width='100%'></ve-pie>
        <ve-pie :data="chartData_3" :extend="chartExtend_pieCommon" :title='title_3' :legend='legend_3' height='100%' width='100%'></ve-pie>
      </div>
      <div class="chartRow" id="three" style="margin-bottom:0">
        <ve-pie :data="chartData_4" :extend="chartExtend_pieCommon" :title='title_4' :legend='legend_4' height='100%' width='100%'></ve-pie>
        <ve-pie :data="chartData_5" :extend="chartExtend_pieCommon" :title='title_5' :legend='legend_5' height='100%' width='100%'></ve-pie>
      </div>
    </el-card>
  </div>
</template>

<script>
import { TaxAnalysisReport } from '@/services/request'
export default {
  name: 'ThreePage',
  data() {
    // 1.柱状图：已实名涉税专业服务人员采集情况
    this.chartSettings_1 = {
      stack: { 用户: ['rs', 'sy_rs'] }
    }
    this.title_1 = {
      text: '已实名涉税专业服务人员采集情况',
      x: 'center',
      y: '5%',
      textStyle: {
        fontSize: 18
      }
    }
    this.grid_1 = {
      right: '55px',
      bottom: '60px'
    }
    this.yAxis_1 = {
      show: true,
      name: '实名企业总数',
      nameTextStyle: {
        fontSize: 14
      },
      axisLabel: {
        fontSize: 14
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#333'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      }
    }
    this.legend_1 = {
      x: 'center',
      y: '91%',
      textStyle: {
        fontSize: 14
      },
      data: ['人数', '增长比上月增长']
    }
    this.chartExtend_1 = {
      color: ['#1890FF', '#EF4864'],
      series(v) {
        v[0].name = '人数'
        v[1].name = '增长比上月增长'
        v.forEach(i => {
          i.barWidth = 40
        })
        return v
      },
      xAxis(v) {
        v[0].name = '时间'
        v[0].nameLocation = 'end'
        v[0].nameTextStyle = {
          fontSize: 14
        }
        v[0].axisLabel = {
          fontSize: 14
        }
        v[0].axisLine = {
          show: true,
          color: '#333'
        }
        return v
      },
      tooltip(v) {
        v.axisPointer = {
          type: 'shadow'
        }
        return v
      }
    }
    // 2.饼图
    this.title_2 = {
      text: '涉税专业服务人员机构内身份分布情况',
      x: 'center',
      y: '5%',
      textStyle: {
        fontSize: 18
      }
    }
    this.legend_2 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    // 3.饼图
    this.title_3 = {
      text: '涉税专业服务人员三师资格占比情况',
      x: 'center',
      y: '5%',
      textStyle: {
        fontSize: 18
      }
    }
    this.legend_3 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    // 4.饼图
    this.title_4 = {
      text: '涉税专业服务人员政治面貌分布情况',
      x: 'center',
      y: '5%',
      textStyle: {
        fontSize: 18
      }
    }
    this.legend_4 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    // 5.饼图
    this.title_5 = {
      text: '涉税专业服务人员学历分布情况',
      x: 'center',
      y: '5%',
      textStyle: {
        fontSize: 18
      }
    }
    this.legend_5 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    // 饼图的公共属性----------------------------------------------------------------
    this.chartExtend_pieCommon = {
      series: {
        radius: [40, 100],
        itemStyle: {
          normal: {
            label: {
              formatter: '{b}: {d}%',
              textStyle: {
                fontSize: 14
              }
            }
          },
          emphasis: {
            label: {
              // formatter: '{b}: \n{c}'
              formatter: '{b}: {c}'
            }
          }
        }
      },
      tooltip: {
        show: false
      },
      color: [
        '#EF4864',
        '#1890FF',
        '#5B66E2',
        '#9860E5',
        '#435188',
        '#14C2C2',
        '#2FC25B',
        '#FACC15',
        '#eaa674',
        '#eaa674'
      ]
    }
    return {
      chartData_1: {
        columns: ['mc', 'rs', 'sy_rs'],
        rows: []
      },
      chartData_2: {
        columns: ['mc', 'rs'],
        rows: []
      },
      chartData_3: {
        columns: ['mc', 'rs'],
        rows: []
      },
      chartData_4: {
        columns: ['mc', 'hs'],
        rows: []
      },
      chartData_5: {
        columns: ['mc', 'hs'],
        rows: []
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    getData() {
      TaxAnalysisReport.getThreePage(this.params).then(res => {
        // 1.柱状图
        this.chartData_1.rows = res.ssfwcjqk.data

        // 2.饼图
        this.chartData_2.rows = res.ssfwjgfb.data
        this.legend_2.data = res.ssfwjgfb.dataType

        this.chartData_3.rows = res.ssfwsszb.data
        this.legend_3.data = res.ssfwsszb.dataType

        this.chartData_4.rows = res.ssfwczzmm.data
        this.legend_4.data = res.ssfwczzmm.dataType

        this.chartData_5.rows = res.ssfwxlfb.data
        this.legend_5.data = res.ssfwxlfb.dataType
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
.threePage
  margin-top 20px
  .el-card
    background #f2f4f7
    .el-card__body
      padding 0
    h2
      padding-top 20px
      background #fff
      font-size 24px
      font-weight 900
    .chartSingleRowBox
      background #fff
      margin-bottom 20px
      .chartSingleRow
        width 80%
        height 460px
        margin 0 auto
    .chartRow
      background #fff
      margin-bottom 20px
      height 460px
      display flex
      justify-content space-between
</style>
