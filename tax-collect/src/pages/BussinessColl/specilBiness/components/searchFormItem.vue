<template>
  <el-form :model="formParms" :rules="rules" ref="formParms" size="small" :inline="true" class="form-wrap">
        <el-form-item prop="sszyfwwtxmdlDm">
          <el-select v-model="formParms.sszyfwwtxmdlDm" placeholder="委托项目" @change="selectProject($event)">
            <el-option v-for="item in PROTOCOL_OPTION" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      <!-- <el-col :xs="12" :sm="10" :md="9" :lg="4" :xl="4">
        <el-form-item prop="nd">
          <el-select v-model="formParms.nd" placeholder="报送年份" @change="selectYear($event)">
            <el-option v-for="(item,idx) in yearTemplate" :key="idx" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
      <el-form-item prop="wtxycode" class="wtxycode">
          <div class="search-code">
            <el-input placeholder="请输入纳税人名称或统一社会信用代码" :value="formParms.wtxycode" v-model="formParms.wtxycode" class="wtxycode" auto-complete="on" @keyup.native="changeVal" @keydown.enter.native="searchName('formParms')" />
            <i class="el-icon-rep-xiazai5" @click="searchName('formParms')"></i>
          </div>
      </el-form-item>
  </el-form>
</template>

<script>
// import util from '@/common/js/util'
export default {
  props: ['statusType'],
  data () {
    return {
      formParms: {
        sszyfwwtxmdlDm: '',
        key: '',
        statusType: 0,
        nd: '',
        wtxycode: ''
      },
      // 默认分页参数
      defaultPage: {
        pageIndex: 1,
        pageSize: 10
      },
      ajaxing: {},
      rules: {
        wtxycode: [
          { validator: this.validatorName }
        ]
      }
    }
  },
  watch: {
    'formParms.wtxycode': function (curentVal, oldValue) {
      if (curentVal !== oldValue) {
        this.ajaxing = {}
      }
    }
  },
  computed: {
    // 协议服务项目下拉框
    PROTOCOL_OPTION: function () {
      return [
        {
          value: '000000',
          label: '全部'
        },
        {
          value: '030000',
          label: '专业税务顾问'
        },
        {
          value: '040000',
          label: '税收策划'
        },
        {
          value: '050000',
          label: '涉税鉴证'
        },
        {
          value: '060000',
          label: '纳税情况审查'
        }
      ]
    },
    // 年度
    yearTemplate: function () {
      let startYear = 2017;
      let endYear = new Date().getFullYear;
      let yearArr = [];
      let t = endYear - startYear;
      for (let i = 0; i <= t; i++) {
        yearArr.push(startYear + i)
      };
      yearArr.unshift('全部');
      return yearArr
    }
  },
  methods: {
    // 搜索
    searchName (formName) {
      let parms = {};
      // 防止重复点击搜索请求接口
      if (this.ajaxing.name === this.formParms.wtxycode) {
        return;
      }
      parms.statusType = this.getType();
      parms.sszyfwwtxmdlDm = this.formParms.sszyfwwtxmdlDm;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formParms.key = this.formParms.wtxycode;
          if (this.formParms.key) {
            parms.key = this.formParms.key;
          }
          // util.storage('specillargs', parms);
          this.ajaxing.name = this.formParms.wtxycode;
          this.$emit('featchCardList', {...parms, ...this.defaultPage});
        } else {
          return false
        }
      })
    },
    changeVal (evt) {
      let event = evt.target || evt.srcElement;
      let val = event.value;
      this.formParms.wtxycode = val;
    },
    getType () {
      let statusType = this.statusType;
      this.formParms.statusType = statusType
      return this.formParms.statusType
    },
    clearForm (formName) {
      this.$refs[formName].resetFields();
    },
    // 选择委托项目
    selectProject (event) {
      let parms = {};
      if (this.formParms.wtxycode) {
        parms.key = this.formParms.wtxycode;
      }
      parms.statusType = this.getType();
      parms.sszyfwwtxmdlDm = this.formParms.sszyfwwtxmdlDm;
      // parms.nd = this.formParms.nd;
      // util.storage('specillargs', parms);
      this.$emit('featchCardList', {...parms, ...this.defaultPage});
    },
    // 选择年份
    selectYear: function (value) {
      // console.log(value)
      this.formParms.nd = value === '全部' ? '' : value;
      let parms = {
        nd: this.formParms.nd
      }
      parms.sszyfwwtxmdlDm = this.formParms.sszyfwwtxmdlDm;
      this.$emit('featchCardList', parms)
    },
    // 重置搜索框
    resetForm () {
      this.$refs['formParms'].resetFields();
    },
    // 规则校验
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