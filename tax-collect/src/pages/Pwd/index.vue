<template>
  <el-container class="pwdWrap">
    <el-main>
      <div class="pwd">
          <div class="content">
            <!--步骤-->
            <el-steps :active="active" align-center>
              <el-step title="填写账户名" icon="el-icon-edit"><i class="regstep01" slot="icon"></i></el-step>
              <el-step title="验证身份" icon="el-icon-upload"><i :class="active=='2'||active=='3'||active=='4'?'regstep022':'regstep02'" slot="icon"></i></el-step>
              <el-step title="设置密码" icon="el-icon-picture"><i :class="active=='3'||active=='4'?'regstep033':'regstep03'" slot="icon"></i></el-step>
              <el-step title="完成" icon="el-icon-picture"><i :class="active=='4'?'regstep044':'regstep04'" slot="icon"></i></el-step>
            </el-steps>
            <div class="edit_content">
              <!--填写账户名-->
              <div class="first_edit marauto ac" v-if="active==1">
                <el-form ref="firstForm" :rules="rules" :model="firstForm" class="firstForm" label-width="153px">
                  <el-form-item label="用户名：" prop="name" class="marginTop50">
                    <el-input v-model="firstForm.name" placeholder="用户名/已验证的手机号"></el-input>
                  </el-form-item>
                  <el-form-item label="验证码：" prop="yanzheng" class="marginTop50">
                    <el-input v-model="firstForm.yanzheng"></el-input>
                    <img :src="'data:image/png;base64,'+codeImg" @click='createCode()' class="cursor">
                    <!--<span class="code cursor selectNo" >{{code}}</span>-->
                  </el-form-item>
                </el-form>
                <div class="btn"><el-button type="primary" @click="submitFormFir('firstForm')">确定</el-button></div>
              </div>
              <!--验证身份-->
              <div class="second_edit marauto ac" v-else-if="active == 2">
                <el-form ref="secondForm" :rules="rulesSecond" :model="secondForm" class="secondForm" label-width="212px">
                  <el-form-item label="验证身份方式：" prop="ide" >
                    <span>已验证手机</span>
                  </el-form-item>
                  <el-form-item label="用户名：" prop="username" class="">
                    <span>{{username}}</span>
                  </el-form-item>
                  <el-form-item label="已验证手机：" prop="pho" class="letters2" >
                    <span>{{pho}}</span>
                    <span class="colorRed">(若该手机无法使用请联系客服)</span>
                  </el-form-item>
                  <el-form-item label="请填写手机短信校验码：" prop="phocode" class="">
                    <el-input  v-model="secondForm.phocode"></el-input>
                    <input type="button" class="getcode cursor" @click="getCode($event)" :disabled='isDisabled' value="获取校验码">
                  </el-form-item>  
                </el-form>
                <div class="btn"><el-button type="primary" @click="submitFormSec('secondForm')">提交</el-button></div>
              </div>
              <!--设置新密码-->
              <div class="thir_edit marauto ac" v-else-if="active == 3">
                <el-form ref="thirForm" :rules="rulesThir" :model="thirForm" class="thirForm" label-width="140px">
                  <span class="fontSize16 colorGray">您已通过身份认证 , 请重新设置密码</span>
                  <el-form-item label="新密码" prop="password" class="marginTop60">
                    <el-input v-model="thirForm.password" type="password"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="corrpassword" class="marginTop34">
                    <el-input v-model="thirForm.corrpassword" type="password"></el-input>
                  </el-form-item>
                </el-form>
                <div class="btn"><el-button type="primary" @click="submitFormThir('thirForm')">确定</el-button></div>
              </div>
              <!--完成-->
              <div class="four_edit marauto ac" v-else-if="active == 4">
                <el-form>
                  <el-form-item class="ac">
                    <span class="fontSize16 colorGray">密码设置成功 ,  现在登录吧</span>
                  </el-form-item>
                </el-form>
                <div class="btn"><el-button type="primary" @click="submitFormFour()">现在登录</el-button></div>
              </div>
            </div>
          </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { pwdRequest } from '@/services/request';

let verifyCode;
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码!'));
      } else if (value !== this.thirForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var validateCode = (rule, value, callback) => {
      //        图片验证码
      if (value === '') {
        callback(new Error('请输入验证码!'));
      } else if (value.toUpperCase() !== verifyCode) {
        callback(new Error('验证码不正确!'));
      } else {
        callback();
      }
    };
    var validatePhoCode = (rule, value, callback) => {
      //        短信校验码
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
      code: '',
      codeImg: '',
      ide: '',
      username: '',
      pho: '',
      phoNum: '',
      active: 1,
      thirForm: {
        password: '',
        corrpassword: ''
      },
      secondForm: {
        ide: '',
        username: '',
        pho: '',
        phocode: '',
      },
      rulesSecond: {
        phocode: [{ required: true, validator: validatePhoCode, trigger: 'blur' }]
      },
      firstForm: {
        name: '',
        yanzheng: ''
      },
      rulesThir: {
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 10,
          max: 30,
          message: '长度在 10 到 30 个字符',
          trigger: 'blur'
        }, {
          pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\\\W_!@#$%^&*`~()-+=]{10,30}$/,
          message: '必须包含大小写字母、数字、特殊字符中的三类',
          trigger: 'blur'
        }],
        corrpassword: [{ required: true, validator: validatePass, trigger: 'blur' }]
      },
      rules: {
        name: [
          { required: true, message: '用户名/已验证的手机号', trigger: 'blur' },
          {
            validator (rule, value, callback) {
              if (/^[a-zA-Z]\w{3,15}$/.test(value) === false && /^1[34578]\d{9}$/.test(value) === false) {
                callback(new Error('账号由字母、数字、下划线组成，字母开头，4-16位;手机号码格式不正确'));
              } else {
                callback();
              }
            },
            trigger: 'blur' }
        ],
        yanzheng: [
          { required: true, validator: validateCode, trigger: 'blur' }
        ],
      }
    }
  },
  created () {
    this.createCode();
  },
  methods: {
    // 图片验证码
    createCode () {
      pwdRequest.getImageCode().then((data) => {
        if (data.code === 0) {
          verifyCode = data.data.code.toUpperCase();
          this.codeImg = data.data.image;
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    //    获取身份认证
    getIden: function () {
      var params = { account: this.firstForm.name };
      pwdRequest.getIden(params).then((data) => {
        if (data.code === 0) {
          if (this.active++ > 5) this.active = 1;
          var userInfo = data.data;
          this.username = userInfo.username;
          this.phoNum = userInfo.mobilePhone;
          this.pho = userInfo.mobilePhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        } else {
          window.Alert(data.msg);
        }
      })
    },
    //    获取短信校验码
    getPhoCode: function () {
      var param = { contents: [], mobilePhone: this.phoNum, type: 'IDENTITY_AUTHENTICATION' };
      pwdRequest.getPhoCode(param).then((data) => {
        if (data.code === 0) {
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    submitFormFir: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getIden();
        }
      });
    },
    submitFormSec: function (formName) {
      var param = { mobilePhone: this.phoNum, securityCode: this.secondForm.phocode };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          pwdRequest.getverifyVCode(param).then((data) => {
            if (data.code === 0) {
              if (this.active++ > 5) this.active = 1;
            } else {
              this.$message.error(data.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    submitFormThir: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var param = { mobilePhone: this.phoNum, securityCode: this.secondForm.phocode, password: this.thirForm.password, userName: this.firstForm.name };
          pwdRequest.getPwd(param).then((data) => {
            if (data.code === 0) {
              if (this.active++ > 5) this.active = 1;
            } else {
              this.$message(data.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    submitFormFour: function () {
      //        完成登录
      this.$router.push('/login');
    },
    getCode: function (e) {
      var that = this;
      var num = 60;
      this.getPhoCode();
      e.target.value = 59 + ' ' + '秒';
      e.target.style.backgroundColor = '#666666';
      let timer = setInterval(function () {
        num--;
        e.target.value = num + ' ' + '秒';
        e.target.style.backgroundColor = '#666666';
        that.isDisabled = 'disabled';
        if (num === 0) {
          that.isDisabled = false;
          e.target.style.backgroundColor = '#4680ff';
          e.target.style.color = '#fff';
          e.target.value = '获取验证码';
          clearInterval(timer)
        }
      }, 1000)
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import './style/index.styl';

.pwdWrap {
  height: 100%;
  background-color: #F2F4F7;

  .el-main {
    padding: 0;

    .pwd {
      padding: 38px 324px 271px;

      .btn {
        .el-button {
          padding: 0;
          width: 100px;
          height: 40px;
          background-color: #4680ff;
          border-radius: 5px;
          font-size: 16px;
          letter-spacing: 1px;
          color: #ffffff;
        }
      }

      .firstForm .el-form-item__content, .secondForm .el-form-item__content, .thirForm .el-form-item__content {
        font-size: 16px;
        color: #999;
        letter-spacing: 1px;
        text-align: left;
      }
    }
  }

  .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
    border-bottom: 1px solid #b2b2b2;
    border-top: none;
    border-left: none;
    border-right: none;
  }

  .el-step__line-inner {
    border-style: hidden;
  }

  .el-step__icon {
    background: none;
  }

  .getcode {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #4680ff;
    width: 90px;
    font-size: 14px;
    letter-spacing: 1px;
    color: #fff;
    height: 34px;
    border-radius: 17px;
    border: none;
  }

  .code {
    margin-left: 12px;
    width: 100px;
    height: 43px;
    line-height: 43px;
    border: 1px solid #666666;
    display: inline-block;
  }

  .el-input__inner:hover {
    border: 1px solid rgba(253, 253, 255, 0);
    border-bottom: 1px solid #b2b2b2;
  }

  .el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner:focus, .el-message-box__input input.invalid, .el-message-box__input input.invalid:focus {
    border: 1px solid rgba(253, 253, 255, 0);
    background-color: rgba(253, 253, 255, 0);
    border-bottom: 1px solid #b2b2b2;
  }

  .el-input__inner {
    border: 1px solid rgba(253, 253, 255, 0);
    background-color: rgba(253, 253, 255, 0);
    border-bottom: 1px solid #b2b2b2;
    border-radius: inherit;
  }

  .first_edit {
    width: 80%;
  }

  .second_edit, .thir_edit {
    width: 80%;
  }

  .el-step.is-center .el-step__line {
    left: 80%;
    right: -22%;
    height: 3px;
  }

  .is-finish .el-step__line {
    background-color: #4680ff;
  }

  .is-process .el-step__line, .is-wait .el-step__line {
    background-color: #999;
  }

  .firstForm {
    .el-form-item:nth-child(2) {
      .el-form-item__content {
        img {
          position: absolute;
          right: 0;
          top: 3px;
          width: 90px;
          height: 34px;
          border-radius: 17px;
          border: 1px solid #4680ff;
        }
      }
    }
  }

  .firstForm .el-form-item__label, .secondForm .el-form-item__label, .thirForm .el-form-item__label {
    font-size: 16px;
    letter-spacing: 1px;
    color: #666;
  }

  .el-step__title.is-finish {
    color: #4680ff;
    font-size: 14px;
    margin-top: 15px;
  }

  .el-step__title.is-process, .el-step__title.is-wait {
    font-size: 14px;
    font-weight: normal;
    color: #999;
    margin-top: 15px;
  }

  .el-steps {
    margin: 5% auto 7% auto;
  }

  .el-step__icon.is-icon {
    width: 43px;
  }

  .regstep01 {
    background-image: url('../../assets/img/pwd/pwd_first.png');
    background-size: 100% 100%;
    width: 43px;
    height: 43px;
  }

  .regstep02 {
    background-image: url('../../assets/img/pwd/pwd_sec_back.png');
    background-size: 100% 100%;
    width: 43px;
    height: 43px;
  }

  .regstep022 {
    background-image: url('../../assets/img/pwd/pwd_sec_blue.png');
    background-size: 100% 100%;
    width: 43px;
    height: 43px;
  }

  .regstep03 {
    background-image: url('../../assets/img/pwd/pwd_thir_back.png');
    background-size: 100% 100%;
    width: 43px;
    height: 43px;
  }

  .regstep033 {
    background-image: url('../../assets/img/pwd/pwd_thir_blue.png');
    background-size: 100% 100%;
    width: 43px;
    height: 43px;
  }

  .regstep04 {
    background-image: url('../../assets/img/pwd/pwd_four_back.png');
    background-size: 100% 100%;
    width: 43px;
    height: 43px;
  }

  .regstep044 {
    background-image: url('../../assets/img/pwd/pwd_four_blue.png');
    background-size: 100% 100%;
    width: 43px;
    height: 43px;
  }

  .content {
    margin: 0 auto;
    background-color: #fff;
    padding: 150px 100px;
  }

  .pingtai {
    color: #243b7f;
    font-size: 44Px;
    margin-left: 46px;
  }

  .user {
    font-size: 24px;
    margin-left: 31px;
  }

  .titlepwd {
    padding-top: 3%;
    padding-bottom: 2%;
  }
}
</style>

