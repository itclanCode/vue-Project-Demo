<template>
  <el-container class="authenWrap">
    <el-main>
      <div class="authen">
        <div class="point1"><img src="../../assets/img/authen/mark.png" width="15"><span>您的账户存在风险,请使用手机验证码登录</span></div>
        <el-form ref="firstForm" :rules="rules" :model="firstForm" class="form" label-width="30%">
          <el-form-item label="短信验证码发送手机号码：" prop="pho" >
            <span>{{pho}}</span>
          </el-form-item>
          <el-form-item label="请填写手机短信校验码：" prop="phocode">
            <el-input  v-model="firstForm.phocode" class="letters1"></el-input>
            <input type="button"  class="" @click="getCode($event)" :disabled='isDisabled' value="获取校验码" >
          </el-form-item>
        </el-form>
        <div class="btns">
            <el-button type="primary" @click="submitForm('firstForm')" class="">确定</el-button>
            <el-button type="primary" @click="back()" class="">取消</el-button>
          </div>
        <div class="point2">
          <p>温馨提示 :</p>
          <p>1.为了您的账户安全,本次登录时需要短信验证码</p>
          <p>2.若超时未收到短信,可尝试重新获取,或联系运营商确认手机通信状态</p>
          <p>3.若手机号码已更换未能成功登录账户,请联系平台客服</p>
        </div>
    </div>
    </el-main>
  </el-container>
</template>
<script>
import { authenRequest } from '@/services/request';
export default {
  data() {
    var validatePhoCode = (rule, value, callback) => {
      var value2 = parseInt(value);
      if (value === '') {
        callback(new Error('请输入校验码!'));
      } else if (!Number.isInteger(value2)) {
        callback(new Error('请输入数值!'));
      } else if (value.length !== 6) {
        callback(new Error('验证码的长度为六位!'));
      } else {
        callback();
      }
    };
    return {
      isDisabled: false,
      phocode: '',
      pho: '',
      phoNum: '15710687160',
      firstForm: {
        phocode: ''
      },
      rules: {
        phocode: [{required: true, validator: validatePhoCode, trigger: 'blur'}]
      }
    }
  },
  created() {
    this.getIden();
  },
  methods: {
    // 获取短信校验码
    getPhoCode: function() {
      var param = {mobilePhone: this.phoNum};
      authenRequest.getPhoCode(param).then((data) => {
        if (data.result === 'ok') {
        } else {
          this.$message('发送验证码失败！');
        }
      });
    },
    // 获取认证手机号码
    getIden: function() {
      this.pho = this.phoNum.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    },
    back: function() {
      this.$router.push('/login');
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var params = { securityCode: this.firstForm.phocode };
          authenRequest.getUnusual(params).then((data) => {
            if (data.result === 'ok') {
              this.$router.push('/realNameCollect');
              window.localStorage.token = data.token;
            } else {
              this.$message(data.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    getCode: function (e) {
      var that = this;
      var num = 59;
      this.getPhoCode();
      e.target.value = 59 + ' ' + '秒';
      e.target.style.backgroundColor = '#666666';
      e.target.style.border = '#666666';
      let timer = setInterval(function() {
        num--;
        e.target.value = num + ' ' + '秒';
        e.target.style.backgroundColor = '#666666';
        that.isDisabled = 'disabled';
        if (num === 0) {
          that.isDisabled = false;
          e.target.style.backgroundColor = '#409eff';
          e.target.style.border = '#409eff';
          e.target.value = '获取验证码';
          clearInterval(timer)
        }
      }, 1000)
    }
  }
}
</script>
  <style lang="stylus" rel="stylesheet/stylus">
    @import './style/index.styl'
  </style>

