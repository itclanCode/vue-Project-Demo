<!-- Created by qulx on 2018/06/20. -->
<!-- 涉税专业服务机构奖惩情况录入 -->
<template>
  <div class="taxenter-container">
    <el-form :model="formParms" ref="formParms" :rules="rules" :inline="true" autocomplete="on" class="search" @submit.native.prevent>
      <el-form-item prop="code" style="margin-bottom:0">
        <div class="search-code">
          <el-input placeholder="请输入机构统一社会信用代码或名称" :value="formParms.code" v-model="formParms.code" class="code" @keyup.native="changeVal"
            @keydown.enter.native="searchName('formParms')" />
          <i class="el-icon-rep-xiazai5" @click="searchName('formParms')"></i>
        </div>
      </el-form-item>
    </el-form>
    <div class="taxprofess-container" v-loading="loading" element-loading-text="数据正在加载中...">
      <el-row class="main marginTop20" :gutter="24" v-if="cardData.length == 0">
        <el-col :xl="6" :lg="6" :md="12" class="adds">
          <router-link :to="{path: '/taxEnterInfo/0/0'}">
            <el-card>
              <div class="add">
                <div>
                  <i class="el-icon-circle-plus"></i>
                </div>
                <span>添加</span>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
      <el-row :gutter="24" v-for="(item,index) in cardData" :key="index" class="main"  v-bind:class="{'line':cardData.length>1}" v-else>
        <div class="year-date">
          {{conversionTime(item.createDate)}}({{item.agencyRpDOList.length}})
        </div>
        <el-col :xl="6" :lg="6" :md="12" class="adds" v-if="index == 0">
          <router-link :to="{path: '/taxEnterInfo/0/0'}">
            <el-card>
              <div class="add">
                <div>
                  <i class="el-icon-circle-plus"></i>
                </div>
                <span>添加</span>
              </div>
            </el-card>
          </router-link>
        </el-col>
        <el-col :xl="6" :lg="6" :md="12" v-for="(items,idx) in item.agencyRpDOList" :key="idx">
          <el-card class="box-card">
            <h1 class="card-header">
              <a href="javascript:;" style="cursor:pointer">{{ items.jgmc }}</a>
            </h1>
            <div class="tongyi-xycode">统一社会信用代码 {{ items.tyshxydm }}</div>
            <ul class="card-content active">
              <li>
                <p class="CommissionNumber">
                  <span class="block">行政处罚数量</span>
                  <span>{{ items.xzPunishCount }}</span>
                </p>
                <p class="CommissionNumber">
                  <span class="block">行业协会处罚数量</span>
                  <span>{{ items.xhPunishCount }}</span>
                </p>
                <p class="view">
                  <span @click="views(items.rpId,items.tyshxydm)">
                    <span class="enter">点击进入</span><i class="el-icon-rep-jinru"></i></span>
                </p>
              </li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  // import { enterMock } from '@/mock/mockData';
  import { TaxProfessionEntering } from '@/services/request';
  import { formatDate } from '@/common/js/date';
  export default {
    name: 'formItem',
    data() {
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
        loading: false,
        params: {},
        formParms: {
          code: ''
        },
        cardData: '',
        // cardDatas: '',
        currentPage: 1,
        pageSize: 10,
        rules: {
          code: [{
            validator: validatorName
          }]
        }
      }
    },
    mounted() {
      this.getEnterCard(this.params);
    },
    methods: {
      // 格式化时间
      conversionTime: function (time) {
        return formatDate(new Date(Number(time)), 'yyyy年MM月dd日');
      },
      // 请求卡片数据
      getEnterCard: function (params) {
        this.loading = true;
        TaxProfessionEntering.taxentering(params).then((res) => {
          this.loading = false;
          if (res.code === 0) {
            this.cardData = res.data;
          } else {
            window.Alert(res.msg);
          }
        });
      },
      changeVal(evt) {
        let event = evt.target || evt.srcElement;
        let val = event.value;
        this.formParms.code = val;
      },
      // 查询
      searchName(formName) {
        let reg = /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/g;
        if (this.formParms.code && this.formParms.code.match(reg)) {
          this.params = {
            key: this.formParms.code
          };
          this.getEnterCard(this.params);
          this.$message({
            type: 'success',
            message: '成功'
          })
        } else if (this.formParms.code.length === 0) {
          this.params = {};
          this.getEnterCard(this.params);
        } else {
          this.formParms.code = '';
        }
      },
      // 跳转详情页面
      views(id, code) {
        this.$router.push({ path: `taxEnterInfo/${id}/${code}` });
      }
    }
  }
</script>
<style lang="stylus">
  @import './index.styl';
</style>