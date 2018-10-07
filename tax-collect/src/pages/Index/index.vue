<template>
  <div class="index-container">
    <el-row :gutter="24">
      <el-col :xl="17" :lg="17" :md="17">
        <el-card>
          <div id="myChart" style="width:92%;height:280px"></div>
          <div class="change">
            <el-radio v-model="radio" label="1" @change="chartchange">图表一</el-radio>
            <el-radio v-model="radio" label="2" @change="chartchange">图表二</el-radio>
            <span class="x-name" v-if="radio == 1">税种</span>
            <span class="x-name" v-else>服务项目</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xl="7" :lg="7" :md="7" class="adds">
        <el-card>
          <ul>
            <li>
              <div class="add">
                <i class="el-icon-rep-shenbao"></i>
                <div style="border-right:1px solid #D3D3D3">
                  <div>逾期未申报</div>
                  <div class="orange">12</div>
                </div>
              </div>
            </li>
            <li>
              <div class="add">
                <i class="el-icon-rep-shangjiaokuan"></i>
                <div>逾期未缴款</div>
                <div class="orange">0</div>
              </div>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
    <div class="tablewrap">
      <div class="t-title">申报总览</div>
      <el-form :model="formParms" ref="formParms" :rules="rules" :inline="true" autocomplete="on" class="search" @submit.native.prevent>
        <el-form-item>
            <el-date-picker v-model="date" type="date" placeholder="申报期限">
              </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formParms.taxgod" placeholder="征收项目" @change="">
            <!-- <el-option v-for="(item,idx) in options" :key="idx" :label="item.authoritiesName" :value="item.authoritiesDm">
              </el-option> -->
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="" class="search-box">
          <div class="search-code">
            <el-input placeholder="请输入机构统一社会信用代码或名称" :value="formParms.code" v-model="formParms.code" class="code" @keyup.native=""
              @keydown.enter.native="searchName('formParms')" />
            <i class="el-icon-rep-xiazai5" @click="searchName('formParms')"></i>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button><i class=""></i>导出</el-button>
        </el-form-item>
      </el-form>
      <table class="tablestyle">
        <thead>
          <th class="reportColumn" style="width: 70px;">序号</th>
          <th class="reportColumn">企业名称</th>
          <th class="reportColumn">征收项目</th>
          <th class="reportColumn">税收属期起止</th>
          <th class="reportColumn">申请状态</th>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>深圳科技有限公司</td>
            <td>增值税</td>
            <td>2018.03.21-2018.07.15</td>
            <td><i class="el-icon-rep-righticon01"></i>已申报</td>
          </tr>
          <tr>
            <td>1</td>
            <td>深圳科技有限公司</td>
            <td>增值税</td>
            <td>2018.03.21-2018.07.15</td>
            <td><i class="el-icon-rep-iconfontcuowu"></i>未申报</td>
          </tr>
          <tr>
            <td>1</td>
            <td>深圳科技有限公司</td>
            <td>增值税</td>
            <td>2018.03.21-2018.07.15</td>
            <td>已申报</td>
          </tr>
          <tr>
            <td>1</td>
            <td>深圳科技有限公司</td>
            <td>增值税</td>
            <td>2018.03.21-2018.07.15</td>
            <td>未申报</td>
          </tr>
          <tr>
              <td>1</td>
              <td>深圳科技有限公司</td>
              <td>增值税</td>
              <td>2018.03.21-2018.07.15</td>
              <td><i class="el-icon-rep-righticon01"></i>已申报</td>
            </tr>
            <tr>
              <td>1</td>
              <td>深圳科技有限公司</td>
              <td>增值税</td>
              <td>2018.03.21-2018.07.15</td>
              <td><i class="el-icon-rep-iconfontcuowu"></i>未申报</td>
            </tr>
            <tr>
              <td>1</td>
              <td>深圳科技有限公司</td>
              <td>增值税</td>
              <td>2018.03.21-2018.07.15</td>
              <td>已申报</td>
            </tr>
            <tr>
              <td>1</td>
              <td>深圳科技有限公司</td>
              <td>增值税</td>
              <td>2018.03.21-2018.07.15</td>
              <td>未申报</td>
            </tr>
            <tr>
                <td>1</td>
                <td>深圳科技有限公司</td>
                <td>增值税</td>
                <td>2018.03.21-2018.07.15</td>
                <td><i class="el-icon-rep-righticon01"></i>已申报</td>
              </tr>
              <tr>
                <td>1</td>
                <td>深圳科技有限公司</td>
                <td>增值税</td>
                <td>2018.03.21-2018.07.15</td>
                <td><i class="el-icon-rep-iconfontcuowu"></i>未申报</td>
              </tr>
        </tbody>

      </table>
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    data: function () {
      let validatorName = (rule, value, callback) => {
        let regs = /^[0-9a-zA-Z]||[^\u4E00-\u9FA5]{1,20}$/;
        let regEn = /[`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]/im;
        let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        if (!regs.test(value)) {
          callback(new Error('只限20位长度的字母或者数字，请重新输入...'));
          rule.message = '只限20位长度的字母或者数字，请重新输入...';
        } else if (regEn.test(value) || regCn.test(value)) {
          callback(new Error('搜索名称不能包含特殊字符，请重新输入...'));
          rule.message = '搜索名称不能包含特殊字符，请重新输入....';
        } else {
          callback();
        }
      }
      return {
        date: '',
        radio: '1',
        chartdata: [],
        chartdata1: [26, 45, 49, 22, 32, 28],
        chartdata2: [26, 45, 49, 22, 32, 28, 38, 26],
        labeldata: [],
        labeldata1: ['增值税', '消费税', '企业所得税', '个人所得税', '附加税', '印花税'],
        labeldata2: ['纳税申报代理', '涉税鉴证', '一般税务咨询', '专业税务顾问 ', '税收策划', '纳税情况审查', '其他涉税服务', '其他税务事项代理'],
        formParms: {
          code: ''
        },
        rules: {
          code: [{
            validator: validatorName
          }]
        }
      };
    },
    mounted() {
      this.getdatainfo();
      this.drawLine();
    },
    methods: {
      getdatainfo: function () {
        this.chartdata = this.chartdata1;
        this.labeldata = this.labeldata1;
      },
      chartchange: function () {
        // 图表1
        if (this.radio === '1') {
          this.chartdata = this.chartdata1;
          this.labeldata = this.labeldata1;
        } else {
          // 图表2
          this.chartdata = this.chartdata2;
          this.labeldata = this.labeldata2;
        }
        this.drawLine();
      },
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('myChart'));
        // 绘制图表
        myChart.setOption({
          backgroundColor: '#fff',
          title: {
            text: '',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            name: '',
            axisLabel: {
              interval: 0,
            },
            data: this.labeldata,
            splitLine: {
              show: false
            },
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            name: '户数',
            splitLine: {
              show: false
            },
            splitArea: {
              show: false,
            },
          }],
          series: [{
            name: '户数',
            type: 'bar',
            barWidth: '40%',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            itemStyle: {
              normal: {
                // 定制显示（按顺序）
                color: function (params) {
                  var colorList = ['#4680FF', '#9B7FFF', '#FF7F84', '#FF9C7F', '#486BFF', '#7FCBFF', '#C97FFF', '#7FFFC9', '#16A085', '#4A235A', '#C39BD3 ', '#F9E79F', '#BA4A00', '#ECF0F1', '#616A6B', '#EAF2F8', '#4A235A', '#3498DB'];
                  return colorList[params.dataIndex]
                }
              },
            },
            data: this.chartdata
          }]
        });
      },
      // 查询
      searchName(formName) {
        let reg = /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/g;
        if (this.formParms.code && this.formParms.code.match(reg)) {
          this.params = {
            key: this.formParms.code
          };
          // this.getEnterCard(this.params);
          this.$message({
            type: 'success',
            message: '成功'
          })
        } else if (this.formParms.code.length === 0) {
          this.params = {};
          // this.getEnterCard(this.params);
        } else {
          this.formParms.code = '';
        }
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './style/index.styl';
</style>