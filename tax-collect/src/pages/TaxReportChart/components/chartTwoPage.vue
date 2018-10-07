<!-- 涉税专业服务机构基本情况图表页 -->

<template>
  <div class="twoPage">
    <el-card id="one" v-loading="loading">
      <p>机构开业设立年限情况</p>
      <div class="chartBox">
        <ve-pie :title="title1" :legend="legend1" :data="chartData1" :extend="chartExtend_pieCommon" :data-empty="chartData1.rows.length == 0 ? true : false"></ve-pie>
        <ve-pie :title="title2" :legend="legend2" :data="chartData2" :extend="chartExtend_pieCommon" :data-empty="chartData2.rows.length == 0 ? true : false"></ve-pie>
      </div>
    </el-card>
    <el-card id="two" v-loading="loading">
      <p>机构登记注册类型分布情况</p>
      <div class="chartBox">
        <ve-pie :title="title3" :legend="legend3" :data="chartData3" :extend="chartExtend_pieCommon" :data-empty="chartData3.rows.length == 0 ? true : false"></ve-pie>
        <ve-pie :title="title4" :legend="legend4" :data="chartData4" :extend="chartExtend_pieCommon" :data-empty="chartData4.rows.length == 0 ? true : false"></ve-pie>
      </div>
    </el-card>
    <el-card id="three" v-loading="loading">
      <p>机构区域分布情况</p>
      <div class="threeBox">
        <ve-histogram :grid='grid' :title="title5" :legend="legend5" :data="chartData5" :extend="chartExtend1" :settings="chartSettings1" :data-empty="chartData5.rows.length == 0 ? true : false"></ve-histogram>
        <ve-histogram :grid='grid' :title="title6" :legend="legend6" :data="chartData6" :extend="chartExtend2" :data-empty="chartData6.rows.length == 0 ? true : false"></ve-histogram>
      </div>
    </el-card>
    <el-card id="four" v-loading="loading">
      <p>机构企业类型情况</p>
      <div class="chartBox">
        <ve-pie :title="title7" :legend="legend7" :data="chartData7" :extend="chartExtend_pieCommon" :data-empty="chartData7.rows.length == 0 ? true : false"></ve-pie>
        <ve-pie :title="title8" :legend="legend8" :data="chartData8" :extend="chartExtend_pieCommon" :data-empty="chartData8.rows.length == 0 ? true : false"></ve-pie>
      </div>
    </el-card>
    <el-card id="five" v-loading="loading" ref="dom">
      <p>机构纳税人状态情况</p>
      <div class="chartBox">
        <ve-pie :events="chartEvent1" :title="title9" :legend="legend9" :data="chartData9" :extend="chartExtend_pieCommon" :data-empty="chartData9.rows.length == 0 ? true : false"></ve-pie>
        <ve-pie :events="chartEvent2" :title="title10" :legend="legend10" :data="chartData10" :extend="chartExtend_pieCommon" :data-empty="chartData10.rows.length == 0 ? true : false"></ve-pie>
      </div>
      <el-dialog :visible.sync="dialogTableVisible1">
        <el-table :data="gridData1" height="360" style="width: 100%" :cell-style='cellStyle' :header-cell-style='headerCellStyle' :row-style='rowStyle' tooltip-effect="dark" stripe>
          <el-table-column prop="nsrmc" label="涉税专业服务机构名称" align='center'>
          </el-table-column>
          <el-table-column prop="nsrzt" label="纳税人状态" width="120" align='center'>
          </el-table-column>
          <el-table-column prop="smrq" label="实名日期" width="120" align='center'>
          </el-table-column>
          <el-table-column prop="ztbgrq" label="状态变更日期" width="140" align='center'>
          </el-table-column>
          <el-table-column prop="sldjrq" label="设立登记日期" width="140" align='center'>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog :visible.sync="dialogTableVisible2">
        <el-table :data="gridData2" height="360" style="width: 100%" :cell-style='cellStyle' :header-cell-style='headerCellStyle' :row-style='rowStyle' tooltip-effect="dark" stripe>
          <el-table-column prop="nsrmc" label="涉税专业服务机构名称" align='center'>
          </el-table-column>
          <el-table-column prop="nsrzt" label="纳税人状态" width="120" align='center'>
          </el-table-column>
          <el-table-column prop="smrq" label="实名日期" width="120" align='center'>
          </el-table-column>
          <el-table-column prop="ztbgrq" label="状态变更日期" width="140" align='center'>
          </el-table-column>
          <el-table-column prop="sldjrq" label="设立登记日期" width="140" align='center'>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog :visible.sync="dialogTableVisible3">
        <el-table :data="gridData3" height="360" style="width: 100%" :cell-style='cellStyle' :header-cell-style='headerCellStyle' :row-style='rowStyle' tooltip-effect="dark" stripe>
          <el-table-column prop="nsrmc" label="涉税专业服务机构名称" align='center'>
          </el-table-column>
          <el-table-column prop="nsrzt" label="纳税人状态" width="120" align='center'>
          </el-table-column>
          <el-table-column prop="smrq" label="实名日期" width="120" align='center'>
          </el-table-column>
          <el-table-column prop="ztbgrq" label="状态变更日期" width="140" align='center'>
          </el-table-column>
          <el-table-column prop="sldjrq" label="设立登记日期" width="140" align='center'>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog :visible.sync="dialogTableVisible4">
        <el-table :data="gridData4" height="360" style="width: 100%" :cell-style='cellStyle' :header-cell-style='headerCellStyle' :row-style='rowStyle' tooltip-effect="dark" stripe>
          <el-table-column prop="nsrmc" label="涉税专业服务机构名称" align='center'>
          </el-table-column>
          <el-table-column prop="nsrzt" label="纳税人状态" width="120" align='center'>
          </el-table-column>
          <el-table-column prop="smrq" label="实名日期" width="120" align='center'>
          </el-table-column>
          <el-table-column prop="ztbgrq" label="状态变更日期" width="140" align='center'>
          </el-table-column>
          <el-table-column prop="sldjrq" label="设立登记日期" width="140" align='center'>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog :visible.sync="dialogTableVisible5">
        <el-table :data="gridData5" height="360" style="width: 100%" :cell-style='cellStyle' :header-cell-style='headerCellStyle' :row-style='rowStyle' tooltip-effect="dark" stripe>
          <el-table-column prop="nsrmc" label="涉税专业服务机构名称" align='center'>
          </el-table-column>
          <el-table-column prop="nsrzt" label="纳税人状态" width="120" align='center'>
          </el-table-column>
          <el-table-column prop="smrq" label="实名日期" width="120" align='center'>
          </el-table-column>
          <el-table-column prop="ztbgrq" label="状态变更日期" width="140" align='center'>
          </el-table-column>
          <el-table-column prop="sldjrq" label="设立登记日期" width="140" align='center'>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog :visible.sync="dialogTableVisible6">
        <el-table :data="gridData6" height="360" style="width: 100%" :cell-style='cellStyle' :header-cell-style='headerCellStyle' :row-style='rowStyle' tooltip-effect="dark" stripe>
          <el-table-column prop="nsrmc" label="涉税专业服务机构名称" align='center'>
          </el-table-column>
          <el-table-column prop="nsrzt" label="纳税人状态" width="120" align='center'>
          </el-table-column>
          <el-table-column prop="smrq" label="实名日期" width="120" align='center'>
          </el-table-column>
          <el-table-column prop="ztbgrq" label="状态变更日期" width="140" align='center'>
          </el-table-column>
          <el-table-column prop="sldjrq" label="设立登记日期" width="140" align='center'>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
    <el-card id="six" v-loading="loading">
      <p>机构信用等级分布情况</p>
      <div class="chartBox">
        <ve-pie :title="title11" :legend="legend11" :data="chartData11" :extend="chartExtend_pieCommon" :data-empty="chartData11.rows.length == 0 ? true : false"></ve-pie>
        <ve-pie :title="title12" :legend="legend12" :data="chartData12" :extend="chartExtend_pieCommon" :data-empty="chartData12.rows.length == 0 ? true : false"></ve-pie>
      </div>
    </el-card>
    <el-card id="seven" v-loading="loading">
      <p>机构开业设立年限和纳税信用等级对比分析</p>
      <div class="sevenBox">
        <ve-heatmap :grid='grid' :title="title13" :data="chartData13" :extend="chartExtend3" :data-empty="chartData13.rows.length == 0 ? true : false"></ve-heatmap>
        <ve-heatmap :grid='grid' :title="title14" :data="chartData14" :extend="chartExtend4" :data-empty="chartData14.rows.length == 0 ? true : false"></ve-heatmap>
      </div>
    </el-card>
    <el-card id="eight" v-loading="loading">
      <p>机构企业风险情况</p>
      <div class="chartBox">
        <ve-pie :title="title15" :legend="legend15" :data="chartData15" :extend="chartExtend_pieCommon" :data-empty="chartData15.rows.length == 0 ? true : false"></ve-pie>
        <ve-pie :title="title16" :legend="legend16" :data="chartData16" :extend="chartExtend_pieCommon" :data-empty="chartData16.rows.length == 0 ? true : false"></ve-pie>
      </div>
    </el-card>
    <el-card id="nine" v-loading="loading">
      <p>机构的税费种认定情况</p>
      <div class="chartBox">
        <ve-pie :title="title17" :legend="legend17" :data="chartData17" :extend="chartExtend_pieCommon" :data-empty="chartData17.rows.length == 0 ? true : false"></ve-pie>
        <ve-pie :title="title18" :legend="legend18" :data="chartData18" :extend="chartExtend_pieCommon" :data-empty="chartData18.rows.length == 0 ? true : false"></ve-pie>
      </div>
    </el-card>
    <el-card id="ten" v-loading="loading">
      <p>机构票种核定情况</p>
      <div class="chartBox">
        <ve-pie :title="title19" :legend="legend19" :data="chartData19" :extend="chartExtend_pieCommon" :data-empty="chartData19.rows.length == 0 ? true : false"></ve-pie>
        <ve-pie :title="title20" :legend="legend20" :data="chartData20" :extend="chartExtend_pieCommon" :data-empty="chartData20.rows.length == 0 ? true : false"></ve-pie>
      </div>
    </el-card>
    <el-card id="eleven" v-loading="loading">
      <p>机构逾期申报缴款情况</p>
      <div class="chartBox">
        <ve-pie :title="title21" :legend="legend21" :data="chartData21" :extend="chartExtend_pieCommon" :data-empty="chartData21.rows.length == 0 ? true : false"></ve-pie>
        <ve-pie :title="title22" :legend="legend22" :data="chartData22" :extend="chartExtend_pieCommon" :data-empty="chartData22.rows.length == 0 ? true : false"></ve-pie>
      </div>
    </el-card>
    <el-card id="twelve" v-loading="loading">
      <p>机构被处罚情况</p>
      <div class="chartBox">
        <ve-pie :title="title23" :legend="legend23" :data="chartData23" :extend="chartExtend_pieCommon" :data-empty="chartData23.rows.length == 0 ? true : false"></ve-pie>
        <ve-pie :title="title24" :legend="legend24" :data="chartData24" :extend="chartExtend_pieCommon" :data-empty="chartData24.rows.length == 0 ? true : false"></ve-pie>
      </div>
    </el-card>
  </div>
</template>

<script>
import { TaxAnalysisReport } from '@/services/request'
export default {
  name: 'TwoPage',
  data() {
    var _this = this
    // title-----------------------------------------------------------
    this.title1 = {
      text: '已实名机构开业设立年限情况',
      x: 'center',
      y: '5%'
    }
    this.title2 = {
      text: '疑似机构开业设立年限情况',
      x: 'center',
      y: '5%'
    }
    this.title3 = {
      text: '已实名机构登记注册类型分布',
      x: 'center',
      y: '5%'
    }
    this.title4 = {
      text: '疑似机构登记注册类型分布',
      x: 'center',
      y: '5%'
    }
    this.title5 = {
      text: '已实名机构区域分布情况',
      x: 'center',
      y: '5%'
    }
    this.title6 = {
      text: '疑似机构区域分布情况',
      x: 'center',
      y: '5%'
    }
    this.title7 = {
      text: '已实名机构企业类型情况',
      x: 'center',
      y: '5%'
    }
    this.title8 = {
      text: '疑似机构企业类型情况',
      x: 'center',
      y: '5%'
    }
    this.title9 = {
      text: '已实名机构纳税人状态',
      x: 'center',
      y: '5%'
    }
    this.title10 = {
      text: '疑似机构纳税人状态',
      x: 'center',
      y: '5%'
    }
    this.title11 = {
      text: '已实名机构信用等级分布',
      x: 'center',
      y: '5%'
    }
    this.title12 = {
      text: '疑似机构信用等级分布',
      x: 'center',
      y: '5%'
    }
    this.title13 = {
      text: '已实名机构开业设立年限和纳税人信用等级对比分析',
      x: 'center',
      y: '5%'
    }
    this.title14 = {
      text: '疑似机构开业设立年限和纳税人信用等级对比分析',
      x: 'center',
      y: '5%'
    }
    this.title15 = {
      text: '已实名机构企业风险情况',
      x: 'center',
      y: '5%'
    }
    this.title16 = {
      text: '疑似机构企业风险情况',
      x: 'center',
      y: '5%'
    }
    this.title17 = {
      text: '已实名机构的税费种认定情况',
      x: 'center',
      y: '5%'
    }
    this.title18 = {
      text: '疑似机构的税费种认定情况',
      x: 'center',
      y: '5%'
    }
    this.title19 = {
      text: '已实名机构票种核定信息情况',
      x: 'center',
      y: '5%'
    }
    this.title20 = {
      text: '疑似机构票种核定信息情况',
      x: 'center',
      y: '5%'
    }
    this.title21 = {
      text: '已实名机构逾期申报缴款',
      x: 'center',
      y: '5%'
    }
    this.title22 = {
      text: '疑似机构逾期申报缴款',
      x: 'center',
      y: '5%'
    }
    this.title23 = {
      text: '已实名逾期处罚情况',
      x: 'center',
      y: '5%'
    }
    this.title24 = {
      text: '疑似逾期处罚情况',
      x: 'center',
      y: '5%'
    }
    // 柱状图公共grid----------------------------------------------------
    this.grid = {
      right: '40px'
    }
    // 图例------------------------------------------------------------
    this.legend1 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    this.legend2 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    this.legend3 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    this.legend4 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    this.legend5 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: ['实名企业总数', '比上月增长']
    }
    this.legend6 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: ['疑似企业总数']
    }
    this.legend7 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    this.legend8 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    this.legend9 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: [],
      selected: {
        正常: false
      }
    }
    this.legend10 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: [],
      selected: {
        正常: false
      }
    }
    this.legend11 = {
      x: 'center',
      y: '85%',
      data: []
    }
    this.legend12 = {
      x: 'center',
      y: '85%',
      data: []
    }
    this.legend15 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    this.legend16 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    this.legend17 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    this.legend18 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    this.legend19 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    this.legend20 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    this.legend21 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    this.legend22 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: []
    }
    this.legend23 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: [],
      selected: {
        '0次': false,
        '1次': false
      }
    }
    this.legend24 = {
      x: 'center',
      y: '85%',
      textStyle: {
        fontSize: 14
      },
      data: [],
      selected: {
        '0次': false,
        '1次': false
      }
    }
    // setting-------------------------------------------------------
    this.chartSettings1 = {
      stack: { 用户: ['sy_hs', 'by_zj'] }
    }
    // series--------------------------------------------------------
    this.chartExtend1 = {
      color: ['#1890FF', '#EF4864'],
      series(v) {
        v[0].name = '实名企业总数'
        v[1].name = '比上月增长'
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
      yAxis(v) {
        v[0].name = '实名企业总数'
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
          return `${params[0].seriesName}<br/>数量：${params[0].value ||
            0}个<br/>${params[1].seriesName}<br/>数量：${params[1].value ||
            0}个`
        }
        v.axisPointer = {
          type: 'shadow'
        }
        return v
      }
    }
    this.chartExtend2 = {
      color: ['#1890FF', '#EF4864'],
      series(v) {
        v[0].name = '疑似企业总数'
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
      yAxis(v) {
        v[0].name = '疑似企业总数'
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
    this.chartExtend3 = {
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
        v.nameLocation = 'end'
        v.axisLine = {
          show: true,
          color: '#333'
        }
        return v
      },
      yAxis(v) {
        v.name = '信用等级'
        v.nameLocation = 'end'
        v.axisLine = {
          show: true,
          color: '#333'
        }
        return v
      },
      tooltip(v) {
        v.show = false
        return v
      }
    }
    this.chartExtend4 = {
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
        v.nameLocation = 'end'
        v.axisLine = {
          show: true,
          color: '#333'
        }
        return v
      },
      yAxis(v) {
        v.name = '信用等级'
        v.nameLocation = 'end'
        v.axisLine = {
          show: true,
          color: '#333'
        }
        return v
      },
      tooltip(v) {
        v.show = false
        return v
      }
    }
    // 饼图的公共属性----------------------------------------------------------------
    this.chartExtend_pieCommon = {
      grid: {
        bottom: '100'
      },
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
    this.chartEvent1 = {
      click: function(e) {
        switch (e.name) {
          case '非正常':
            _this.dialogTableVisible1 = true
            break
          case '清算':
            _this.dialogTableVisible2 = true
            break
          case '注销':
            _this.dialogTableVisible3 = true
            break
          default:
            break
        }
      }
    }
    this.chartEvent2 = {
      click: function(e) {
        switch (e.name) {
          case '非正常':
            _this.dialogTableVisible4 = true
            break
          case '清算':
            _this.dialogTableVisible5 = true
            break
          case '注销':
            _this.dialogTableVisible6 = true
            break
          default:
            break
        }
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
        height: '30px'
      },
      chartData1: {
        columns: ['slnx', 'hs'],
        rows: []
      },
      chartData2: {
        columns: ['slnx', 'hs'],
        rows: []
      },
      chartData3: {
        columns: ['djzclx_mc', 'hs'],
        rows: []
      },
      chartData4: {
        columns: ['djzclx_mc', 'hs'],
        rows: []
      },
      chartData5: {
        columns: ['swjg', 'sy_hs', 'by_zj'],
        rows: []
      },
      chartData6: {
        columns: ['swjg', 'hs'],
        rows: []
      },
      chartData7: {
        columns: ['nsr_lx', 'hs'],
        rows: []
      },
      chartData8: {
        columns: ['nsr_lx', 'hs'],
        rows: []
      },
      chartData9: {
        columns: ['nsrzt', 'hs'],
        rows: []
      },
      chartData10: {
        columns: ['nsrzt', 'hs'],
        rows: []
      },
      chartData11: {
        columns: ['xyjb', 'hs'],
        rows: []
      },
      chartData12: {
        columns: ['xyjb', 'hs'],
        rows: []
      },
      chartData13: {
        columns: ['slnx', 'xy_jb', 'hs'],
        rows: []
      },
      chartData14: {
        columns: ['slnx', 'xy_jb', 'hs'],
        rows: []
      },
      chartData15: {
        columns: ['nsr_fx', 'hs'],
        rows: []
      },
      chartData16: {
        columns: ['nsr_fx', 'hs'],
        rows: []
      },
      chartData17: {
        columns: ['zsxm', 'hs'],
        rows: []
      },
      chartData18: {
        columns: ['zsxm', 'hs'],
        rows: []
      },
      chartData19: {
        columns: ['pzhd', 'hs'],
        rows: []
      },
      chartData20: {
        columns: ['pzhd', 'hs'],
        rows: []
      },
      chartData21: {
        columns: ['yq', 'hs'],
        rows: []
      },
      chartData22: {
        columns: ['yq', 'hs'],
        rows: []
      },
      chartData23: {
        columns: ['wzcs', 'hs'],
        rows: []
      },
      chartData24: {
        columns: ['wzcs', 'hs'],
        rows: []
      },
      loading: true,
      dialogTableVisible1: false,
      dialogTableVisible2: false,
      dialogTableVisible3: false,
      dialogTableVisible4: false,
      dialogTableVisible5: false,
      dialogTableVisible6: false,
      gridData1: [],
      gridData2: [],
      gridData3: [],
      gridData4: [],
      gridData5: [],
      gridData6: []
    }
  },
  created() {
    this.getPersonData()
    this.getData()
  },
  methods: {
    getPersonData() {
      this.params.sfysm = 1
      // 非正常
      this.params.nsrzt_dm = '05'
      TaxAnalysisReport.getUnNormalPerson(this.params)
        .then(info => {
          this.gridData1 = info.data
        })
        .then(() => {
          this.params.sfysm = 1
          // 清算
          this.params.nsrzt_dm = '06'
          TaxAnalysisReport.getUnNormalPerson(this.params)
            .then(info => {
              this.gridData2 = info.data
            })
            .then(() => {
              this.params.sfysm = 1
              // 注销
              this.params.nsrzt_dm = '07'
              TaxAnalysisReport.getUnNormalPerson(this.params)
                .then(info => {
                  this.gridData3 = info.data
                })
                .then(() => {
                  this.params.sfysm = 0
                  // 非正常
                  this.params.nsrzt_dm = '05'
                  TaxAnalysisReport.getUnNormalPerson(this.params)
                    .then(info => {
                      this.gridData4 = info.data
                    })
                    .then(() => {
                      this.params.sfysm = 0
                      // 清算
                      this.params.nsrzt_dm = '06'
                      TaxAnalysisReport.getUnNormalPerson(this.params)
                        .then(info => {
                          this.gridData5 = info.data
                        })
                        .then(() => {
                          this.params.sfysm = 0
                          // 注销
                          this.params.nsrzt_dm = '07'
                          TaxAnalysisReport.getUnNormalPerson(this.params).then(
                            info => {
                              this.gridData6 = info.data
                            }
                          )
                        })
                    })
                })
            })
        })
    },
    getData() {
      this.loading = true
      const params = this.params
      TaxAnalysisReport.getTwoPage(params)
        .then(info => {
          // 1
          this.chartData1.rows = info.ysmjgkyslnxqk.data
          this.legend1.data = info.ysmjgkyslnxqk.dataType
          this.chartData2.rows = info.ysjgkyslnxqk.data
          this.legend2.data = info.ysjgkyslnxqk.dataType
          // 2
          this.chartData3.rows = info.ysmjgdjzclxfb.data
          this.legend3.data = info.ysmjgdjzclxfb.dataType
          this.chartData4.rows = info.ysmjgdjzclxfb.data
          this.legend4.data = info.ysmjgdjzclxfb.dataType
          // 3
          this.chartData5.rows = info.ysmjgqyfbqk.data
          this.chartData6.rows = info.ysjgqyfbqk.data
          // 4
          this.chartData7.rows = info.ysmjgqylxqk.data
          this.legend7.data = info.ysmjgqylxqk.dataType
          this.chartData8.rows = info.ysjgqylxqk.data
          this.legend8.data = info.ysjgqylxqk.dataType
          // 5
          this.chartData9.rows = info.ysmjgnsrztfb.data
          this.legend9.data = info.ysmjgnsrztfb.dataType
          this.chartData10.rows = info.ysjgnsrztfb.data
          this.legend10.data = info.ysjgnsrztfb.dataType
          // 6
          this.chartData11.rows = info.ysmjgxydjfb.data
          this.legend11.data = info.ysmjgxydjfb.dataType
          this.chartData12.rows = info.ysjgxydjfb.data
          this.legend12.data = info.ysjgxydjfb.dataType
          // 7
          this.chartData13.rows = info.ysmjgkyslnxhnsxydjdbfx.data
          this.chartData14.rows = info.ysjgkyslnxhnsxydjdbfx.data
          // 8
          this.chartData15.rows = info.ysmjgqyfxqk.data
          this.legend15.data = info.ysmjgqyfxqk.dataType
          this.chartData16.rows = info.ysjgqyfxqk.data
          this.legend16.data = info.ysjgqyfxqk.dataType
          // 9
          this.chartData17.rows = info.ysmjgdsfzrdqk.data
          this.legend17.data = info.ysmjgdsfzrdqk.dataType
          this.chartData18.rows = info.ysjgdsfzrdqk.data
          this.legend18.data = info.ysjgdsfzrdqk.dataType
          // 9
          this.chartData19.rows = info.ysmjgpzhdqk.data
          this.legend19.data = info.ysmjgpzhdqk.dataType
          this.chartData20.rows = info.ysjgpzhdqk.data
          this.legend20.data = info.ysjgpzhdqk.dataType
          // 10
          this.chartData21.rows = info.ysmjgyqsbjkqk.data
          this.legend21.data = info.ysmjgyqsbjkqk.dataType
          this.chartData22.rows = info.ysjgyqsbjkqk.data
          this.legend22.data = info.ysjgyqsbjkqk.dataType
          // 11
          this.chartData23.rows = info.ysmjgbcfqk.data
          this.legend23.data = info.ysmjgbcfqk.dataType
          this.chartData24.rows = info.ysjgbcfqk.data
          this.legend24.data = info.ysjgbcfqk.dataType
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
.twoPage
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
        text-align center
        font-size 24px
        padding-top 20px
        font-weight 700
        font-family '微软雅黑'
      .chartBox
        height 88%
        width 100%
        margin 0 auto
        display flex
        justify-content space-between
        .ve-pie
          flex 1
          height 100px
          .v-charts-data-empty
            color #999
            position absolute
            top 50%
            left 50%
            transform translate(-50%, -50%)
  #three, #seven
    width 100%
    height 845px
    margin-bottom 20px
    background rgba(255, 255, 255, 1)
    box-shadow 0px 2px 8px 0px rgba(181, 181, 181, 0.5)
    .el-card__body
      height 100%
      width 100%
      padding 0
      p
        width 100%
        text-align center
        font-size 24px
        padding-top 20px
        font-weight 700
        font-family '微软雅黑'
      .threeBox, .sevenBox
        // height 92%
        width 80%
        margin 0 auto
        .ve-histogram, .ve-heatmap
          width 100%
          // height 60% !important
          .v-charts-data-empty
            color #999
            position absolute
            top 50%
            left 50%
            transform translate(-50%, -50%)
</style>