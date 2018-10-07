<!--/*
 * @Author: wmc
 * @Date: 2018-06-19 15:07:13
 * @LastEditors: wmc
 * @LastEditTime: 2018-06-19 15:07:13
 * @Description: 涉税专业服务机构管理基本信息
 */
-->
<template>
  <div class="taxProInfo-container">
    <el-row :gutter="10">
      <el-col ::xl="6" :lg="9" :md="12" :sm="24" :xs="24">
        <taxpro-baseinfo :taxproBaseinfo="taxprofessinfo" />
        <server-list :taxproBaseinfo="taxprofessinfo" />
      </el-col>
      <el-col :span="15">
        <wtxy-list :wtxyList="wtxylist" :formParms="formParms" @fetchListData="getwtxyListData" />
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-button type="primary" @click="back">返回</el-button>
    </el-row>
  </div>
</template>
<script>
import { specilMock } from '@/mock/mockData';
import { TaxProfessionMange } from '@/services/request'
import taxproBaseinfo from './components/TaxproBaseInfo';
import serverList from './components/ServerList';
import wtxyList from './components/Wtxylist';
export default {
  name: 'baseInfo',
  components: { taxproBaseinfo, serverList, wtxyList },
  data () {
    return {
      formParms: {},
      wtxylist: [],
      taxprofessinfo: {},
      initPage: { pageIndex: 1, pageSize: 10 },
      errorInfo: '网络状态异常,请求错误',
      testFlag: true
    }
  },
  mounted () {
    this.getBaseInfoList();
    this.getwtxyListData({ ...this.initPage });
  },
  methods: {
    // 返回上一页
    back () {
      this.$router.go(-1)
    },
    // 基础信息
    getBaseInfoList () {
      let parms = {};
      parms.taxOrgId = this.$route.params.taxOrgId;
      if (this.testFlag) {
        TaxProfessionMange.taxcollectorOrgdetail(parms).then(res => {
          if (res.code === 0 && res.data) {
            this.taxprofessinfo = res.data;
          } else {
            this.Message('error', res.msg);
          }
        }).catch(res => {
          this.Message('error');
        });
      } else {
        specilMock.taxcollector('org_detail', parms).then(res => {
          if (res.code === 0 && res.data) {
            this.taxprofessinfo = res.data;
          } else {
            this.Message('error', res.msg);
          }
        });
      }
    },
    // 委托协议列表
    getwtxyListData (parms = {}) {
      let config = {};
      this.wtxylist = [];
      config.socialCreditCode = this.$route.params.socialCreditCode;
      config.pageIndex = parms ? parms.pageIndex : 1;
      parms = { ...config, ...parms };
      if (this.testFlag) {
        TaxProfessionMange.taxcollectorMandatorlist(parms).then(res => {
          let data = res.data;
          if (res.code === 0) {
            if (data.data.length > 0) {
              this.wtxylist = data.data;
              this.formParms.pageIndex = data.pageIndex * 1; // 当前页
              this.formParms.totalPage = data.totalCount * 1; // 分页显示的总页数
            } else {
              this.formParms.pageIndex = 1; // 当前页
              this.formParms.totalPage = 0; // 分页显示的总页数
            }
          } else {
            this.Message('error', res.msg);
          }
        })
      } else {
        specilMock.taxcollector('mandator_list', parms).then(res => {
          let data = res.data;
          if (res.code === 0) {
            this.wtxylist = data.data;
            this.formParms.pageIndex = data.pageIndex * 1; // 当前页
            this.formParms.totalPage = data.totalCount * 1; // 分页显示的总页数
          } else {
            this.Message('error', res.msg);
          }
        })
      }
    },
    // 消息
    Message (type, msg) {
      let msssage = msg !== undefined ? msg : this.errorInfo;
      this.$message({
        message: msssage,
        type: type
      });
    }
  }
}
</script>
  <style lang="stylus">
  @import './index.styl';
</style>
 
