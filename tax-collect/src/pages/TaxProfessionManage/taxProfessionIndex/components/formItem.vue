<template>
  <div class="form-wrap">
    <el-form :model="formParms" ref="formParms" :rules="rules" :inline="true" autocomplete="on">
      <el-form-item class="date" v-if="isTip===2">
        <el-date-picker 
          v-model="formParms.date" 
          type="daterange"
          unlink-panels 
          range-separator="至" 
          start-placeholder="实名认证时间起" 
          end-placeholder="实名认证时间止"
          format="yyyy-MM-dd" 
          @change="selectDate">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="taxgod" class="taxgod">
        <el-select v-model="formParms.taxgod" placeholder="机构主管税务机关" @change="selectTax">
          <el-option v-for="(item,idx) in options" :key="idx" :label="item.authoritiesName" :value="item.authoritiesDm">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <div class="resource">
          <span>是否实名认证</span>
          <el-radio-group v-model="formParms.resource" @change="changeRescorce">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </div>
      </el-form-item> -->
      <el-form-item prop="xycode" class="xycode" style="position:absolute;right:0">
        <div class="search-code">
          <el-input 
            placeholder="请输入机构统一社会信用代码或名称" 
            :value="formParms.xycode"
             v-model="formParms.xycode" 
             class="xycode" @keyup.native="changeVal"
              @keydown.enter.native="searchName('formParms')"/>
          <i class="el-icon-rep-xiazai5" @click="searchName('formParms')"></i>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import util from '@/common/js/util'
export default {
  name: 'formItem',
  props: ['taxList', 'isTip'],
  data () {
    return {
      formParms: {
        date: '',
        taxgod: '', // 税务机关
        xycode: ''
      },
      parms: {},
      ajaxing: {},
      timer: null,
      rules: {
        xycode: [{
          validator: this.validatorName
        }]
      }
    }
  },
  watch: {
    'formParms.xycode': function (curentVal, oldValue) {
      if (curentVal !== oldValue) {
        this.ajaxing = {}
      }
    }
  },
  computed: {
    options: function () {
      let taxData = this.taxList;
      taxData.unshift({ authoritiesName: '请选择税务机关', authoritiesDm: '' })
      return taxData
    },
    xycodeTemplate: function () {
      let xycode = this.formParms.xycode;
      if (xycode.length > 20) {
        xycode = xycode.substring(0, 20)
      }
      return xycode
    }
  },
  methods: {
    // 选择日期
    selectDate (value) {
      let dateArr = value;
      if (dateArr instanceof Array) {
        dateArr.map((item, idx) => {
          if (idx === 0) {
            this.parms.startTime = this.ieToLocalDateArr(item);
          } else {
            this.parms.endTime = this.ieToLocalDateArr(item);
          }
        });
      }
      this.$emit('fetchCardList', this.parms)
    },
     // 兼容ie的 toLocaleDateString方法
    ieToLocalDateArr (str) {
      let ntoDate = new Date(str * 1).toLocaleDateString();
      let retArr = [];
      if (ntoDate.includes('年')) {
        ntoDate = ntoDate.replace('年', '/').replace('月', '/').replace('日', '/');
        ntoDate = ntoDate.substring(0, ntoDate.length - 1);
      }
      retArr = ntoDate.split('/');
      return retArr
    },
    // 选择税务机关
    selectTax (value) {
      let parms = {};
      parms.authorities = value;
      parms.keyword = this.formParms.xycode;
      this.formParms.authorities = value;
      util.storage('argsCacheTaxManage', parms);
      this.$emit('fetchCardList', parms);
    },
    // 搜索机构
    searchName (formName) {
      let parms = {};
      // 搜索重复接口拦截
      if (this.ajaxing.name === this.formParms.xycode) {
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          parms.keyword = this.formParms.xycode;
          parms.authorities = this.formParms.authorities;
          this.ajaxing.name = this.formParms.xycode;
          util.storage('argsCacheTaxManage', parms);
          this.$emit('fetchCardList', parms);
          this.$message({
            type: 'success',
            message: '成功'
          })
        } else {
          return false;
        }
      });
    },
    changeVal (evt) {
      let event = evt.target || evt.srcElement;
      let val = event.value;
      this.formParms.xycode = val;
    },
    // 重置
    resetForm () {
      this.formParms = {};
      this.$refs['formParms'].resetFields();
    },
    // 日期
    validatorName(rule, value, callback) {
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
  }
}
</script>