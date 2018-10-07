<!-- Created by qintengbo on 2018/05/30. -->
<!-- 增值税(小规模纳税人)批量报送 -->
 
<template>
  <div class="vta-container">
    <MenuTab :menu="menuItem" :defaultIndex="activeIndex" @handleTab="handleTab">
      <span slot='menu-rt' class="shenbao-date">申报期限: {{formParms.sbqx}}</span>
    </MenuTab>
    <el-form :model="formParms" :rules="rules" ref="formParms" size="small" :inline="true" class="form-wrap">
      <div class='select-part' v-if="activeIndex!=='1'">
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <span class="plsb">
          <i class="el-icon-rep-shengchanshuliang"></i>
          批量申报
        </span>
      </div>
      <el-form-item prop="xycode" class="xycode" style="position:absolute;right:0;top:9px">
        <div class="search-code">
          <el-input placeholder="纳税人名称或统一社会信用代码" :value="formParms.xycode" v-model="formParms.xycode" class="xycode" @keydown.enter.native.prevent="searchName('formParms')" />
          <i class="el-icon-rep-xiazai5" @click="searchName('formParms')"></i>
        </div>
      </el-form-item>
    </el-form>
    <VtaDeclare :loading="loading" :tableData="tableData" :checkObj="checkObj" :defaultActive="activeIndex" @CheckedIdChange="CheckedIdChange" @showModel="showModel" />
    <FailModel :isVisible="isVisibleModel" @showModel="showModel" :failDec="failDec" />
    <PagePatiation :pagiation="initPage" @fetchListData="getVtaMockCompanyList" />
  </div>
</template>

<script>
import util from '@/common/js/util';
import { VtaDeclareMock } from '@/mock/mockData';
import { VtaDeclareRequest } from '@/services/request';
import MenuTab from '@/components/MenuTab';
import PagePatiation from './components/PagePagiation';
import VtaDeclare from './components/VtaDeclare';
import FailModel from './components/FailModel';
export default {
  components: { MenuTab, PagePatiation, VtaDeclare, FailModel },
  data () {
    return {
      loading: true,
      isVisibleModel: false,
      tableData: [],
      initPage: {},
      activeIndex: '0',
      initPageParms: {
        pageNum: 1,
        pageSize: 10
      },
      formParms: {
        xycode: '',
        pageNum: 1,
        pageSize: 10,
        sbqx: ''  // 申报期限
      },
      ajaxing: {},
      checkAll: false,
      checkAllS: [],
      checkObj: {},
      checkedId: [],
      failDec: {},
      rules: {
        xycode: [
          { validator: this.validatorName }
        ]
      },
      menuItem: [
        { idx: '0', name: '未申报', count: 0 },
        { idx: '2', name: '申报失败', count: 0 },
        { idx: '1', name: '已申报', count: 0 }
      ],
      errorInfo: '网络状态异常,请求错误',
      testFlag: true
    }
  },
  watch: {
    activeIndex: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.checkAll = false;
      }
      if (newVal === this.activeIndex) {
        this.ajaxing = {};
      }
    }
  },
  mounted () {
    if (this.testFlag) {
      this.getVatSbjtList({...this.initPageParms})
    } else {
      this.getVtaMockCompanyList({ ...this.initPageParms });
    }
  },
  methods: {
    // 弹框
    showModel (parms) {
      this.isVisibleModel = parms.bool;
    },
    handleTab (idx) {
      let parms = {};
      this.activeIndex = idx;
      parms.state = this.activeIndex * 1;
      // 防止重复点击tab重复请求接口数据
      if (this.ajaxing[this.activeIndex]) {
        return;
      }
      if (this.testFlag) {
        this.getVatSbjtList({...this.initPageParms})
      } else {
        this.getVtaMockCompanyList({ ...this.initPageParms, ...parms });
      }
    },
    // 批量申报
    postVatsmallscaleBatchdeclare(parms = {}) {
      VtaDeclareRequest.postVatsmallscaleBatchdeclare({...parms}).then(res => {
        if (res.code === 0) {
          this.getVatSbjtList({...this.initPageParms});
          this.getVatsmallscaleVatSbtjCount({...this.formParms});
        }
      })
    },
    // 统计
    getVatsmallscaleVatSbtjCount(parms = {}) {
      VtaDeclareRequest.getVatsmallscaleVatSbtjCount({...parms}).then(res => {
        if (res.code === 0) {
          if (res.data.stateFail === '') {
            res.data.stateFail = 0;
          }
          if (res.data.stateSuccess === '') {
            res.data.stateSuccess = 0;
          }
          if (res.data.stateUn === '') {
            res.data.stateUn = 0;
          }
          let {sbqx, stateFail, stateSuccess, stateUn} = res.data;
          this.formParms.sbqx = util.formateDate(sbqx * 1, '年-月-日');
          this.menuItem.map(item => {
            switch (item.idx) {
              case '0': item.count = stateUn; break;
              case '1': item.count = stateSuccess; break;
              case '2': item.count = stateFail; break;
              default: break;
            }
          })
        }
      })
    },
    getMockVatsmallscaleVatSbtjCount(parms) {
      VtaDeclareMock.getVatsmallscaleVatSbtjCount({...parms}).then(res => {
        if (res.code === 0) {
          let {sbqx, stateFail, stateSuccess, stateUn} = res.data;
          this.formParms.sbqx = sbqx;
          this.menuItem.map(item => {
            switch (item.idx) {
              case '0': item.count = stateUn; break;
              case '1': item.count = stateSuccess; break;
              case '2': item.count = stateFail; break;
              default: break;
            }
          })
        }
      })
    },
    // 获取企业列表
    getVtaMockCompanyList (parms = {}) {
      this.loading = true;
      // this.tableData = [];
      let arg = {};
      let state = this.activeIndex;
      arg.key = this.formParms.xycode;
      arg.state = state;
      let config = { ...parms, ...arg };
      this.getMockVatsmallscaleVatSbtjCount(config);
      VtaDeclareMock.getVatSbjtList(config).then((res) => {
        let { total, pageNum, pageSize, list } = res.data;
        if (res.code === 0) {
          this.loading = false;
          this.tableData = list;
          if (list.length > 0) {
            this.initPage = {
              totalCount: total,
              pageNum: pageNum,
              pageSize: pageSize
            }
            list.map(item => {
              this.checkedId.push(item.sbtjId)
            })
            this.ajaxing[status] = true; // 防止重复点击请求接口
          } else {
            this.initPage = {
              totalCount: 0,
              pageNum: 1,
              pageSize: 10
            }
          }
        } else {
          this.getMessage('error', res.msg)
        }
      })
    },
    // 企业列表
    getVatSbjtList (parms = {}) {
      this.loading = true;
      // this.tableData = [];
      let arg = {};
      let state = this.activeIndex;
      arg.key = this.formParms.xycode;
      arg.state = state;
      let config = { ...parms, ...arg };
      this.getVatsmallscaleVatSbtjCount(config);
      VtaDeclareRequest.getVatSbjtList(config).then((res) => {
        let { total, pageNum, pageSize, list } = res.data;
        if (res.code === 0) {
          this.loading = false;
          this.tableData = list;
          if (list.length > 0) {
            this.initPage = {
              totalCount: total,
              pageNum: pageNum,
              pageSize: pageSize
            }
            list.map(item => {
              this.checkedId.push(item.id)
            })
            this.ajaxing[status] = true; // 防止重复点击请求接口
          } else {
            this.initPage = {
              totalCount: 0,
              pageNum: 1,
              pageSize: 10
            }
          }
        } else {
          this.getMessage('error', res.msg)
        }
      })
    },
    // 全选
    handleCheckAllChange (val) {
      let obj = {};
      let tableData = [...this.tableData];
      this.checkAllS = [];
      tableData.map(item => {
        obj[item.id] = this.checkAll;
      });
      this.checkAllS.push(obj);
      this.checkObj = this.checkAllS[0];
    },
    // 单选
    CheckedIdChange (parms) {
      this.checkAll = parms.checks;
    },
    searchName (formName) {
      let xycode = this.formParms.xycode;
      let parms = {};
      // 搜索重复接口拦截
      if (this.ajaxing.name === this.formParms.xycode) {
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          parms.key = xycode;
          parms.pageNum = this.formParms.pageNum;
          parms.pageSize = this.formParms.pageSize;
          this.getVtaCompanyList({ ...parms })
        } else {
          return false;
        }
      });
    },
    // 规则校验
    validatorName (rule, value, callback) {
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
    },
    // 消息
    getMessage (type, msg) {
      let messg = msg !== undefined ? msg : this.errorInfo
      this.$message({
        message: messg,
        type: type
      })
    },
  }
}
</script>
<style lang="stylus">
@import './stylus/index.styl';
</style>


