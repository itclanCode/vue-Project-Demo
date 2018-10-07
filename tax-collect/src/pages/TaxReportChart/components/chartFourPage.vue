<!-- 关联企业基本情况图表页 -->

<template>
  <div class="fourPage">
    <el-card>
      <!-- 柱状图 -->
      <h2 id="one">委托代理关系采集情况</h2>
      <div class="chartSingleRowBox">
        <div class="chartSingleRow">
          <ve-histogram :data="chartData_1" :extend="chartExtend_1" :title="title_1" :grid='grid_1' :settings="chartSettings_1" :yAxis='yAxis_1' :legend='legend_1' height='100%' width='100%'></ve-histogram>
        </div>
      </div>

      <!-- 饼图 -->
      <h2 id="two">关联企业开业设立年限情况</h2>
      <div class="chartRow">
        <ve-pie :data="chartData_2" :extend="chartExtend_pieCommon" :title='title_2' :legend='legend_2' height='100%' width='100%'></ve-pie>
        <ve-pie :data="chartData_3" :extend="chartExtend_pieCommon" :title='title_3' :legend='legend_3' height='100%' width='100%'></ve-pie>
      </div>

      <!-- 柱状图 -->
      <h2 id="three">关联企业区域分布情况</h2>
      <div class="chartSingleRowBox">
        <div class="chartSingleRow" style="height:300px">
          <ve-histogram :data="chartData_4" :extend="chartExtend_4" :title="title_4" :grid='grid_4' :yAxis='yAxis_4' :legend='legend_4' height='100%' width='100%'></ve-histogram>
        </div>
        <div class="chartSingleRow" style="height:300px">
          <ve-histogram :data="chartData_5" :extend="chartExtend_5" :title="title_5" :grid='grid_5' :yAxis='yAxis_5' :legend='legend_4' height='100%' width='100%'></ve-histogram>
        </div>
      </div>

      <!-- 饼图 -->
      <h2 id="four">关联企业纳税人类型情况</h2>
      <div class="chartRow">
        <ve-pie :data="chartData_6" :extend="chartExtend_pieCommon" :title='title_6' :legend='legend_6' height='100%' width='100%'></ve-pie>
        <ve-pie :data="chartData_7" :extend="chartExtend_pieCommon" :title='title_7' :legend='legend_7' height='100%' width='100%'></ve-pie>
      </div>

      <!-- 1.表格 ==== 异常状态关联企业所在机构分布情况 -->
      <h2 style="padding-bottom:20px;" id="five">异常状态关联企业所在机构分布情况</h2>
      <div class="chartSingleRowBox" style="height:360px">
        <div class="chartSingleRow">
          <el-table :data="tableData_1" height="350" :cell-style='cellStyle' :header-cell-style='headerCellStyle' :row-style='rowStyle' tooltip-effect="dark" style="width: 100%">
            <el-table-column align='center' prop="mc" label="机构名称">
            </el-table-column>
            <el-table-column align='center' prop="ychs" label="异常户数" width="100">
            </el-table-column>
            <el-table-column align='center' prop="zhs" label="总户数" width="100">
            </el-table-column>
            <el-table-column align='center' prop="yczb" label="异常占比" width="100">
            </el-table-column>
            <el-table-column align='center' prop="swjg" label="税务机关" width="100">
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 2.表格 ==== 风险或重点监控关联企业所在机构分布情况 -->
      <h2 style="padding-bottom:20px;" id="six">风险或重点监控关联企业所在机构分布情况</h2>
      <div class="chartSingleRowBox" style="height:360px">
        <div class="chartSingleRow">
          <el-table :data="tableData_2" height="350" :cell-style='cellStyle' :header-cell-style='headerCellStyle' :row-style='rowStyle' tooltip-effect="dark" style="width: 100%">
            <el-table-column align='center' prop="mc" label="机构名称">
            </el-table-column>
            <el-table-column align='center' prop="fxhs" label="风险户数" width="100">
            </el-table-column>
            <el-table-column align='center' prop="zhs" label="总户数" width="100">
            </el-table-column>
            <el-table-column align='center' prop="fxzb" label="风险占比" width="100">
            </el-table-column>
            <el-table-column align='center' prop="swjg" label="税务机关">
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 3.表格 ==== 被处罚关联企业所在机构分布情况 -->
      <h2 style="padding-bottom:20px;" id="seven">被处罚关联企业所在机构分布情况</h2>
      <div class="chartSingleRowBox" style="height:360px">
        <div class="chartSingleRow">
          <el-table :data="tableData_3" height="350" :cell-style='cellStyle' :header-cell-style='headerCellStyle' :row-style='rowStyle' tooltip-effect="dark" style="width: 100%">
            <el-table-column align='center' prop="mc" label="机构名称">
            </el-table-column>
            <el-table-column align='center' prop="wzhs" label="被处罚户数" width="140">
            </el-table-column>
            <el-table-column align='center' prop="zhs" label="总户数" width="100">
            </el-table-column>
            <el-table-column align='center' prop="wzzb" label="处罚占比" width="100">
            </el-table-column>
            <el-table-column align='center' prop="swjg" label="税务机关">
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 1.热力图 -->
      <h2 id="eight">已实名机构关联企业设立年限和纳税人信用等级对比分析</h2>
      <div class="chartSingleRowBox">
        <div class="chartSingleRow" style="height:auto">
          <h3 class="title_3">已实名机构关联企业设立年限和纳税人信用等级对比分析</h3>
          <ve-heatmap :extend='chartExtend_heatMap_1' :data="heatMapData_1" height='300px'></ve-heatmap>
          <h3 class="title_3">疑似机构关联企业设立年限和纳税人信用等级对比分析</h3>
          <ve-heatmap :extend='chartExtend_heatMap_1' :data="heatMapData_2" height='300px'></ve-heatmap>
        </div>
      </div>
      <!-- 底部6个饼图 -->
      <h2 id="nine">关联企业票种核定情况</h2>
      <div class="chartRow">
        <ve-pie :data="chartData_8" :extend="chartExtend_pieCommon" :title='title_8' :legend='legend_8' height='100%' width='100%'></ve-pie>
        <ve-pie :data="chartData_9" :extend="chartExtend_pieCommon" :title='title_9' :legend='legend_9' height='100%' width='100%'></ve-pie>
      </div>

      <!-- 饼图====联动-1 -->
      <h2 id="ten">四类人员证件号码关联企业情况</h2>
      <div class="chartRow">
        <ve-pie :data="chartData_10" :extend="chartExtend_pieCommon" :title='title_10' :legend='legend_10' height='100%' width='100%' :events="pieEvents_1"></ve-pie>
        <ve-pie :data="chartData_11" :extend="chartExtend_pieCommon" :title='title_11' :legend='legend_11' height='100%' width='100%'></ve-pie>
      </div>

      <!-- 饼图====联动-2 -->
      <h2>四类人员电话号码关联企业情况</h2>
      <div class="chartRow" style="margin-bottom:0">
        <ve-pie :data="chartData_12" :extend="chartExtend_pieCommon" :title='title_12' :legend='legend_12' height='100%' width='100%' :events="pieEvents_2"></ve-pie>
        <ve-pie :data="chartData_13" :extend="chartExtend_pieCommon" :title='title_13' :legend='legend_13' height='100%' width='100%'></ve-pie>
      </div>
    </el-card>
  </div>
</template>

<script>
import { TaxAnalysisReport } from '@/services/request'
export default {
  name: 'FourPage',
  data() {
    var _this = this
    // 1.柱状图
    this.chartSettings_1 = {
      stack: { 用户: ['sy_hs', 'hs'] }
    }
    this.title_1 = {
      text: '已实名委托代理关系采集情况',
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
      data: ['访问用户', '下单用户']
    }
    this.chartExtend_1 = {
      color: ['#1890FF', '#EF4864'],
      series(v) {
        v[0].name = '企业数量'
        v[1].name = '比上月增长'
        v.forEach(i => {
          i.barWidth = 40
        })
        return v
      },
      xAxis(v) {
        v[0].name = '年度'
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
      text: '已实名关联企业开业设立年限情况',
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
      text: '疑似关联企业开业设立年限情况',
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
    // 4.柱图
    this.title_4 = {
      text: '已实名机构关联企业区域分布情况',
      x: 'center',
      y: '5%',
      textStyle: {
        fontSize: 18
      }
    }
    this.grid_4 = {
      right: '55px',
      bottom: '20px'
    }
    this.yAxis_4 = {
      show: true,
      name: '户数',
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
    this.legend_4 = {
      x: 'center',
      y: '91%',
      textStyle: {
        fontSize: 14
      },
      data: ['访问用户', '下单用户']
    }
    this.chartExtend_4 = {
      color: ['#1890ff', '#4ecb73'],
      series(v) {
        v[0].name = '户数'
        v.forEach(i => {
          i.barWidth = 40
        })
        return v
      },
      xAxis(v) {
        v[0].name = '区局'
        v[0].nameTextStyle = {
          fontSize: 14
        }
        v[0].axisLabel = {
          fontSize: 14,
          interval: 0,
          rotate: 30
        }
        v[0].nameLocation = 'end'
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
    // 5.柱图
    this.title_5 = {
      text: '疑似机构关联企业区域分布情况',
      x: 'center',
      y: '5%',
      textStyle: {
        fontSize: 18
      }
    }
    this.grid_5 = {
      right: '55px',
      bottom: '20px'
    }
    this.yAxis_5 = {
      show: true,
      name: '户数',
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
    this.legend_5 = {
      x: 'center',
      y: '91%',
      textStyle: {
        fontSize: 14
      },
      data: ['访问用户', '下单用户']
    }
    this.chartExtend_5 = {
      color: ['#1890ff', '#4ecb73'],
      series(v) {
        v[0].name = '户数'
        v.forEach(i => {
          i.barWidth = 40
        })
        return v
      },
      xAxis(v) {
        v[0].name = '区局'
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
      tooltip(v) {
        v.axisPointer = {
          type: 'shadow'
        }
        return v
      }
    }
    // 6.饼图
    this.title_6 = {
      text: '已实名关联企业纳税人类型情况',
      x: 'center',
      y: '5%',
      textStyle: {
        fontSize: 18
      }
    }
    this.legend_6 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    // 7.饼图
    this.title_7 = {
      text: '疑似关联企业纳税人类型情况',
      x: 'center',
      y: '5%',
      textStyle: {
        fontSize: 18
      }
    }
    this.legend_7 = {
      x: 'center',
      y: '85%',
      data: []
    }
    // 8.饼图
    this.title_8 = {
      text: '已实名企业票种核定信息情况',
      x: 'center',
      y: '5%',
      textStyle: {
        fontSize: 18
      }
    }
    this.legend_8 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    // 9.饼图
    this.title_9 = {
      text: '疑似关联企业核定信息情况',
      x: 'center',
      y: '5%',
      textStyle: {
        fontSize: 18
      }
    }
    this.legend_9 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    // 10.饼图--联动
    this.title_10 = {
      text: '关联企业身份占比',
      x: 'center',
      y: '5%',
      textStyle: {
        fontSize: 18
      }
    }
    this.legend_10 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    // 11.饼图
    this.title_11 = {
      text: '法人-关联企业状态',
      x: 'center',
      y: '5%',
      textStyle: {
        fontSize: 18
      }
    }
    this.legend_11 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    // 12.饼图--联动
    this.title_12 = {
      text: '关联企业身份占比',
      x: 'center',
      y: '5%',
      textStyle: {
        fontSize: 18
      }
    }
    this.legend_12 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    // 13.饼图
    this.title_13 = {
      text: '法人-关联企业状态',
      x: 'center',
      y: '5%',
      textStyle: {
        fontSize: 18
      }
    }
    this.legend_13 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    // 热力图
    this.chartExtend_heatMap_1 = {
      series(v) {
        v[0].label = {
          normal: {
            show: true,
            position: 'inside',
            // formatter: '{c}',
            color: '#000',
            fontSize: 14
          }
        }
        return v
      },
      xAxis(v) {
        v.name = '年度'
        v.nameTextStyle = {
          fontSize: 14
        }
        v.axisLabel = {
          fontSize: 14
        }
        v.nameLocation = 'end'
        v.axisLine = {
          show: true,
          color: '#333'
        }
        return v
      },
      yAxis(v) {
        v.name = '信用等级'
        v.nameTextStyle = { fontSize: 14 }
        v.axisLabel = { fontSize: 14 }
        v.nameLocation = 'end'
        v.axisLine = {
          show: true,
          color: '#333'
        }
        return v
      },
      grid: {
        top: '10x',
        right: '50px'
      },
      tooltip: {
        show: false
      }
    }
    // 底部四个饼图----联动
    // var self = this
    this.pieEvents_1 = {
      click: function(e) {
        // self.name = e.name
        _this.changePieData(e.name)
      }
    }
    this.pieEvents_2 = {
      click: function(e) {
        // self.name = e.name
        _this.changePieData_2(e.name)
      }
    }
    // 空心-饼图的公共属性----------------------------------------------------------------
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
      // flag
      flag: true,
      /** 表格数据 */
      tableData_1: [],
      tableData_2: [],
      tableData_3: [],
      /** 热力图数据 */
      heatMapData_1: {
        columns: ['slnx', 'mc', 'hs'],
        rows: []
      },
      heatMapData_2: {
        columns: ['slnx', 'mc', 'hs'],
        rows: []
      },
      // 其它图数据
      chartData_1: {
        columns: ['mc', 'sy_hs', 'hs'],
        rows: []
      },
      chartData_2: {
        columns: ['mc', 'hs'],
        rows: []
      },
      chartData_3: {
        columns: ['mc', 'hs'],
        rows: []
      },
      chartData_4: {
        columns: ['mc', 'hs'],
        rows: []
      },
      chartData_5: {
        columns: ['mc', 'hs'],
        rows: []
      },
      chartData_6: {
        columns: ['mc', 'hs'],
        rows: []
      },
      chartData_7: {
        columns: ['mc', 'hs'],
        rows: []
      },
      chartData_8: {
        columns: ['mc', 'hs'],
        rows: []
      },
      chartData_9: {
        columns: ['mc', 'hs'],
        rows: []
      },
      chartData_10: {
        columns: ['mc', 'sl'],
        rows: []
      },
      chartData_11: {
        // 联动饼图-1
        columns: ['mc', 'gx_sl'],
        rows: []
      },
      chartData_12: {
        columns: ['mc', 'sl'],
        rows: []
      },
      chartData_13: {
        // 联动饼图-2
        columns: ['mc', 'gx_sl'],
        rows: []
      },
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
        height: '50px'
      }
    }
  },
  mounted() {},
  created() {
    this.getData()
    // 联动饼图----获取数据
    this.changePieData()
  },
  methods: {
    // 获取联动饼图数据
    changePieData(name) {
      name = name || '法人'
      this.params.name = name
      this.params.type = '1'
      this.title_11.text = name + '-关联企业状态'
      TaxAnalysisReport.getFourPagePie(this.params)
        .then(res => {
          this.chartData_11.rows = res.ysmslztxx.data
          this.legend_11.data = res.ysmslztxx.dataType
        })
        .then(() => {
          this.params.type = '2'
          if (this.flag) {
            this.changePieData_2()
          }
        })
    },
    // 获取联动饼图数据-2
    changePieData_2(name) {
      this.params.name = name || '法人'
      this.title_13.text = this.params.name + '-关联企业状态'
      TaxAnalysisReport.getFourPagePie(this.params)
        .then(res => {
          this.chartData_13.rows = res.ysmdhhmxx.data
          this.legend_13.data = res.ysmdhhmxx.dataType
        })
        .then(() => {
          this.flag = false
        })
    },
    getData() {
      TaxAnalysisReport.getFourPage(this.params).then(res => {
        // 1.柱状图----委托代理关系情况
        this.chartData_1.rows = res.wtdlcjqk.data
        // this.legend_1 = res.wtdlcjqk.dataType

        // 2、3饼图
        this.chartData_2.rows = res.ysmnxqk.data
        this.legend_2.data = res.ysmnxqk.dataType

        this.chartData_3.rows = res.ysnxqk.data
        this.legend_3.data = res.ysnxqk.dataType

        // 4、5柱状图
        this.chartData_4.rows = res.ysmqyfbqk.data
        this.legend_4.data = res.ysmqyfbqk.dataType

        this.chartData_5.rows = res.ysqyfbqk.data
        this.legend_5.data = res.ysqyfbqk.dataType

        // 6、7饼图
        this.chartData_6.rows = res.ysmnsrlxqk.data
        this.legend_6.data = res.ysmnsrlxqk.dataType

        this.chartData_7.rows = res.ysnsrlxqk.data
        this.legend_7.data = res.ysnsrlxqk.dataType

        // 8、9、10表格
        this.tableData_1 = res.ycqyfbqk.data
        this.tableData_2 = res.fxqyfbqk.data
        this.tableData_3 = res.cfqyfbqk.data

        // 11、12热力图
        this.heatMapData_1.rows = res.ysmnsrxydj.data
        this.heatMapData_2.rows = res.ysnsrxydj.data

        // 13、14饼图
        this.chartData_8.rows = res.ysmqypz.data
        this.legend_8.data = res.ysmqypz.dataType

        this.chartData_9.rows = res.ysqypz.data
        this.legend_9.data = res.ysqypz.dataType

        // 15、16饼图----联动
        this.chartData_10.rows = res.ysmslryzj.data
        this.legend_10.data = res.ysmslryzj.dataType

        // this.chartData_11.rows = res.ysslryzj.data
        // this.legend_11.data = res.ysslryzj.dataType

        // 17、18饼图----联动
        this.chartData_12.rows = res.ysslryzj.data
        this.legend_12.data = res.ysslryzj.dataType

        // this.chartData_13.rows = res.yssldhhm.data
        // this.legend_13.data = res.yssldhhm.dataType
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
.fourPage
  margin-top 20px !important
  .el-card
    background #f2f4f7
    .el-card__body
      padding 0
      h2
        padding 20px 0 0 10px
        background #fff
        font-size 24px
        font-weight 900
      .title_3
        font-size 20px
        padding-top 20px
        font-weight 900
        background #fff
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


