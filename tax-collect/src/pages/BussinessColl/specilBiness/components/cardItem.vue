<template>
  <div class="card-container">
      <template v-if="yearReportCardVOS && yearReportCardVOS.length>0">
      <el-row :gutter="24" class="line">
        <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24" v-for="(data,idxs) in yearReportCardVOS" :key="idxs" style="position:relative;margin: 7px 0">
           <el-card class="box-card" :class="data.ndbgbh?'year-look':'year-send'">
            <div class="head-year-top">
                <h1 class="head-year" v-if="data.ndbgbh" style="cursor:pointer" @click="openYearModel(data.nd, data.ndbgbh)">{{data.nd}}年度总体情况</h1>
                <h1 class="head-year" v-else>{{data.nd}}年度总体情况</h1>
            </div>
            <ul class="card-content">
              <li>
                <h2 class="CommissionNumber">涉税服务人员总数</h2>
                <span class="CommissionId">{{data.csssfwry}}</span>
              </li>
              <li>
                <h2 class="CommissionNumber">服务项目总户数</h2>
                <span>{{data.zhs}}</span>
              </li>
              <li>
                <h2 class="CommissionNumber">业务收入总金额</h2>
                <span>{{data.zywsr}}元</span>
              </li>
            </ul>
            <div class="card-footer">
                <div v-if="data.ndbgbh" class="hassend"  @click="openYearModel(data.nd, data.ndbgbh)">
                    <i class="el-icon-rep-chakan1"></i> 查看
                </div>
                <div v-else class="caiji" @click="openYearModel(data.nd, data.ndbgbh)"><i class='el-icon-rep-zhifeiji'></i><span>采集</span></div>
            </div>
        </el-card>
        </el-col>
      </el-row>
      </template>
      <!--非年度-->
      <template v-else>
          <el-row :gutter="24" class="no-year"  v-for="(data,idx) in cardDateTemplate" :key="idx">
              <div class="year-date">
                  {{data.lrrq}}({{data.cardList.length}})
              </div>
              <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24" v-for="(item, idx) in data.cardList" :key="idx" style="position:relative;margin: 7px 0">
                <el-card class="box-card" :class="item.sszywfbgbh?'active':'hasactive'">
                  <h1 class="card-header">
                    <a href="javascript:;" :title="item.wtrmc" v-if="item.sszywfbgbh"  @click="openModel(item.sszywfbgbh, item.sszyfwwtxmdlDm,'query',false)" style="cursor:pointer">{{item.wtrmc?item.wtrmc: '无'}}</a>
                    <a href="javascript:;" :title="item.wtrmc" v-else>{{item.wtrmc?item.wtrmc: '无'}}</a>
                  </h1>
                  <div class="dec">{{_constant.PROTOCOL_TYPE[item.sszyfwwtxmdlDm]}}</div>
                  <ul class="card-content">
                    <li>
                      <p class="CommissionNumber">委托协议信息采集编号</p>
                      <a class="CommissionId" href="javascript:;" :title="item.wtxyxxcjbh">{{item.wtxyxxcjbh}}</a>
                    </li>
                    <li>
                      <p class="CommissionNumber">委托人统一社会信用代码</p>
                      <a class="CommissionId" href="javascript:;" :title="item.wtrtyshxydm">{{item.wtrtyshxydm}}</a>
                    </li>
                    <li>
                      <p class="CommissionNumber">涉税专项业务报告编号</p>
                      <a href="javascript:;" :title="item.sszywfbgbh">{{item.sszywfbgbh?item.sszywfbgbh:'暂无'}}</a>
                    </li>
                  </ul>
                  <div class="card-footer">
                    <div class="caiji" v-if="item.sszywfbgbh === ''"
                        @click="openModel(item.wtxyxxcjbh, item.sszyfwwtxmdlDm,'collection',true)">
                      <i class="el-icon-rep-zhifeiji"></i>
                      <span>采集</span>
                    </div>
                    <div v-else class="hassend" @click="openModel(item.sszywfbgbh, item.sszyfwwtxmdlDm,'query',false)">
                      <i class="el-icon-rep-chakan1"></i>
                      <span>查看</span>
                    </div>
                  </div>
                  <div class="left-line"></div>
                </el-card>
              </el-col> 
          </el-row>
      </template>
      <!--加载条-->
      <slot name="load"/>
  </div>
  
</template>
<script>
import util from '@/common/js/util'
export default {
  name: 'cardItem',
  props: ['dataList'],
  data () {
    return {
      protocolType: {},
      data: ''
    }
  },
  watch: {
    dataList: function (n) {
      this.data = n
    }
  },
  created () {
  },
  updated () {
  },
  mounted () {
  },
  computed: {
    // 年度卡片
    yearReportCardVOS: function () {
      let yearReportCardVOSData = this.dataList;
      if (yearReportCardVOSData instanceof Array && yearReportCardVOSData) {
        yearReportCardVOSData = yearReportCardVOSData.map((item, idx) => {
          item.lrrq = util.formateDate(item.lrrq, '年-月-日');
          return item;
        })
      }
      return yearReportCardVOSData
    },
    // 非年度卡片
    cardDateTemplate: function () {
      let cardDateTemplateData = this.dataList.data;
      if (cardDateTemplateData instanceof Array && cardDateTemplateData) {
        cardDateTemplateData = cardDateTemplateData.map(item => {
          item.lrrq = util.formateDate(item.lrrq, '年-月-日');
          return item
        })
      }
      return cardDateTemplateData
    }
  },
  methods: {
    // 查看以及报送
    openModel (number, sszyfwwtxmdlDm, isSend, isEdit) {
      let propsParms = {
        sxNumber: number, // 涉税专业服务编号 当这个编号为空时，则报送，当不为空时，则查看
        sszyfwwtxmdlDm: sszyfwwtxmdlDm, // sszyfwwtxmdlDm=050000时，显示业务内容
        bool: true, // true打开弹框
        isSend: isSend, // query查看，collection报送,
        isEdit: isEdit, // true可编辑，false不可编辑
        isYear: 0 // 0 代表非年度 1 代表年度
      }
      this.$emit('showModel', propsParms)
    },
    // 年度
    openYearModel (nd, ndbgbh) {
      let propsParms = {
        ndbgbh: ndbgbh, // 年度报告编号 为空时，报送， 有值时查看
        nd: nd, // 年度参数
        bool: true, // true打开弹框
        isYear: 1
      }
      this.$emit('showModel', propsParms);
    },
    // 时间格式化
    formateDate (strTime) {
      let date = strTime || new Date().getTime();
      let ntoDate = new Date(strTime * 1).toLocaleDateString();
      // 兼容ie的toLocaleDateString
      if (ntoDate.includes('年')) {
        ntoDate = ntoDate.replace('年', '/').replace('月', '/').replace('日', '/');
        ntoDate = ntoDate.substring(0, ntoDate.length - 1);
      }
      date = ntoDate.split('/');
      date = date.map((item, idx) => {
        switch (idx) {
          case 0: item = item + '年'; break;
          case 1: item = item + '月'; break;
          case 2: item = item + '日'; break;
          default: ; break;
        }
        return item;
      })
      return date.join('')
    }
  }
}
</script>

