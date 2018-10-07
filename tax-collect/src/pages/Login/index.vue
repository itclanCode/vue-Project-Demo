<template>
  <div class="login">
    <div class="login-wrap">
      <div><img src="../../assets/img/login-logo.png"></div>
      <div class="content">
        <div class="login-nav">
          <span :class="{'blue': active}" @click="navSwitch">用户名登录</span>
          <span :class="{'blue': !active}" @click="navSwitch">手机号码登录</span>
        </div>
        <el-form 
          ref="loginForm" 
          :rules="rules" 
          :model="loginForm"
        >
          <div v-if="active">
            <el-form-item label="" prop="name" class="el-form-item-content">
              <div class="input-con">
                <i class="el-icon-rep-user login-icon"></i>
                <el-input type="text" class="input" v-model="loginForm.name" placeholder="请输入用户名"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="" prop="pwd" class="el-form-item-content">
              <div class="input-con">
                <i class="el-icon-rep-mima1 login-icon"></i>
                <el-input :type="pwdType" class="input" v-model="loginForm.pwd" placeholder="请输入密码" @keyup.enter.native="submitForm('loginForm')"></el-input>
                <i v-if="!showPwd" class="el-icon-rep-chakan showPwd" @click="togglePwd"></i>
                <i v-if="showPwd" class="el-icon-rep-yincang showPwd" @click="togglePwd"></i>
              </div>
            </el-form-item>
          </div>
          <div v-if="!active">
            <el-form-item label="" prop="phone" class="el-form-item-content">
              <div class="input-con">
                <i class="el-icon-rep-shouji-copy login-icon"></i>
                <el-input type="text" class="input" v-model="loginForm.phone" placeholder="请输入手机号"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="" prop="code" class="el-form-item-content">
              <div class="input-con">
                <i class="el-icon-rep-yanzhengma login-icon"></i>
                <el-input type="text" class="input codeInput" v-model="loginForm.code" placeholder="请输入验证码" @keyup.enter.native="submitForm('loginForm')"></el-input>
                <el-button class="code-btn" :disabled="codeDisabled" @click="getCode($event)">获取验证码</el-button>
              </div>
            </el-form-item>
          </div>
          <div>
            <el-button 
              class="login-btn" 
              @click="submitForm('loginForm')" 
              v-loading.fullscreen.lock="fullscreenLoading"
              element-loading-text="登录中，请稍等"
            >
            登录
            </el-button>
          </div>
          <el-row>
            <router-link to='/supply'>
              <el-col :span="12">涉税专业服务机构注册</el-col>
            </router-link>
            <router-link :to="{path: '/pwd', query: {nowActive: 1}}">
              <el-col class="last-col" :span="12">忘记密码</el-col>
            </router-link>
          </el-row>
        </el-form>
      </div>
      <div class="fot">
        <span>
          <i class="el-icon-rep-kefu1"></i>
          <el-tooltip effect="light" content="0755-86565121" placement="bottom">
            <el-button class="tooltipBtn">联系客服</el-button>
          </el-tooltip>
          </span>
        <span>
          <i class="el-icon-rep-xinshouzhinan"></i> 
          <a href="http://qishuiyi.oss-cn-shenzhen.aliyuncs.com/%E6%B6%89%E7%A8%8E%E4%B8%93%E4%B8%9A%E6%9C%8D%E5%8A%A1%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E2%80%9C%E5%AE%9E%E5%90%8D%E4%BF%A1%E6%81%AF%E9%87%87%E9%9B%86%E2%80%9D%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.pdf" target="_blank">操作指引</a>
        </span>
      </div>
    </div>
  </div>
</template>


<script>
  import { loginRequest } from '@/services/request';
  
  export default {
    data: function () {
      return {
        active: true,
        fullscreenLoading: false,
        showPwd: true,
        pwdType: 'password',
        codeDisabled: true,
        loginForm: {
          name: '',
          pwd: '',
          phone: '',
          code: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {
              validator(rule, value, callback) {
                if (/^[a-zA-Z]\w{3,15}$/.test(value) === false && /^1[34578]\d{9}$/.test(value) === false) {
                  callback(new Error('账号由字母开头、数字和下划线组成，长度4-16位'));
                } else {
                  callback();
                }
              },
              trigger: 'blur'}
          ],
          pwd: [
            {
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
            }
          ],
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: this.validatorPhone, trigger: 'change' }
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            {pattern: /^\d{6}$/, message: '请输入6位数验证码', trigger: 'blur'},
          ]
        }
      };
    },
    methods: {
      validatorPhone(rule, value, callback) {
        if (/^1[34578]\d{9}$/.test(value) === false) {
          callback(new Error('手机号码格式不正确'));
          this.codeDisabled = true;
        } else {
          this.codeDisabled = false;
          callback();
        }
      },
      getuserRole() {
        loginRequest.getUserRole().then((data) => {
          window.localStorage['index'] = '2';
          if (data.code === 0) {
            window.localStorage['role'] = data.data.role;
            window.localStorage['orgType'] = data.data.orgType;
            window.localStorage['orgName'] = data.data.orgName;
            window.localStorage['photo'] = data.data.photo;
            window.localStorage['name'] = data.data.username;
            if (data.data.role === 6) {
              this.getOrgRealname();
            } else if (data.data.role === 7) {
              this.$router.push('/vtaDeclare');
              this.fullscreenLoading = false;
            } else if (data.data.role === 8) {
              // this.$router.push('');
              // this.fullscreenLoading = false;
            } else if (data.data.role === 9) {
              this.$router.push('/taxProfessionManage');
              this.fullscreenLoading = false;
            } else {
              window.Alert(data.msg);
              this.fullscreenLoading = false;
            }
          } else {
            window.Alert(data.msg);
            this.fullscreenLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
          this.fullscreenLoading = false;
        });
      },
      getOrgRealname() {
        loginRequest.getOrgRealname().then((data) => {
          if (data.code === 7205) {
            this.$router.push('/organization');
            this.fullscreenLoading = false;
          } else if (data.code === 7206) {
            this.$router.push('/promiseInfo');
            this.fullscreenLoading = false;
          } else {
            this.$message(data.msg);
            this.fullscreenLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
          this.fullscreenLoading = false;
        });
      },
      navSwitch: function() {
        this.active = !this.active;
        this.$refs.loginForm.resetFields();
        this.codeDisabled = true;
      },
      togglePwd: function() {
        if (this.showPwd) {
          this.pwdType = 'text';
        } else {
          this.pwdType = 'password';
        }
        this.showPwd = !this.showPwd;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.fullscreenLoading = true;
            let params;
            if (this.active) {
              params = {username: this.loginForm.name, password: this.loginForm.pwd};
            } else {
              params = {username: this.loginForm.phone, password: this.loginForm.code, loginType: 'phone'};
            }
            loginRequest.getLogin(params).then((data) => {
              var url = this.$route.query.url;
              window.localStorage['isFirstLogin'] = data.isFirstLogin;
              if (data.result === 'ok') {
                if (data.isUnusual === true) {
                  this.$router.push({path: '/aut', query: {nowActive: 3}});
                  this.fullscreenLoading = false;
                } else {
                  window.localStorage['token'] = data.token;
                  window.localStorage['name'] = this.loginForm.name;
                  if (url !== undefined) {
                    this.$router.push(url);
                    this.fullscreenLoading = false;
                  } else {
                    this.getuserRole();
                  }
                }
              } else {
                window.Warning(data.msg);
                this.$refs.loginForm.resetFields();
                this.fullscreenLoading = false;
              }
            })
            .catch(error => {
              console.log(error);
              this.fullscreenLoading = false;
            });
          } else {
            return false;
          }
        });
        sessionStorage.removeItem('menuInfo');
      },
      getCode(e) {
        if (this.loginForm.phone) {
          let num = 60;
          let timer = setInterval(function() {
            num--;
            e.target.innerText = num + ' ' + '秒';
            e.target.parentElement.style.backgroundColor = '#f8f8f8';
            e.target.parentElement.style.cursor = 'not-allowed';
            e.target.parentElement.disabled = true;
            if (num === 0) {
              e.target.parentElement.disabled = false;
              e.target.parentElement.style.backgroundColor = '#fff';
              e.target.parentElement.style.cursor = 'pointer';
              e.target.innerText = '获取验证码';
              clearInterval(timer)
            }
          }, 1000)
          var data = {mobilePhone: this.loginForm.phone, contents: [], type: 'PHONE_LOGIN_VERIFICATION'};
          // 获取短信验证码
          loginRequest.sendCode(data).then(data => {
            if (data.code === 0) {
              this.$message.success(data.msg)
            } else {
              window.Alert(data.msg);
            }
          })
        }
      },
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.login
  position relative
  width 100%
  height 100%
  overflow hidden
  background url('../../assets/img/login-background.png') no-repeat
  background-size 100% 100%
  overflow-x hidden
  .login-wrap
    width 594px
    position absolute 
    top 47%
    left 50%
    transform translateX(-50%) translateY(-50%)
  .content
    width 560px
    margin 12% auto 30px
    padding 40px 80px 50px
    border-radius 10px
    box-sizing border-box
    background #fff
  .login-nav
    margin-bottom 40px
    color #181818
    text-align center
    .blue
      color #478AF1
    span 
      padding 2px 20px
      cursor pointer
    span:first-child
      border-right 1px solid #181818
    span:last-child
      margin-left -4px
  .input-con
    position relative
    margin-bottom 30px
    padding-bottom 15px
    border-bottom 1px solid #D4D4D4
    font-size 14px
  .code-btn
    position absolute
    bottom 5px
    right 0
    border-color #478AF1
    color #478AF1
  .login-icon
    color #478AF1
    font-size 20px
    vertical-align middle
  .tooltipBtn
    background transparent
    border 0
    padding 0
    color #fff
    span
      padding 0 !important
      border 0 !important
  .showPwd
    margin-top 4px
    margin-right 30px
    float right
    font-size 16px
    color #8a8a8a
    cursor pointer
  .input
    width 308px
    margin-left 15px
    vertical-align middle
    border 0
  .codeInput
    width 220px
  input::-webkit-input-placeholder
    /* WebKit browsers */   
    color #7A7A7A 
  input:-moz-placeholder 
    /* Mozilla Firefox 4 to 18 */   
    color #7A7A7A
  input::-moz-placeholder
    /* Mozilla Firefox 19+ */   
    color #7A7A7A
  input:-ms-input-placeholder 
    /* Internet Explorer 10+ */   
    color #7A7A7A
  .login-btn
    width 100%
    height 50px
    padding 0
    line-height 50px
    color #fff
    border-radius 0
    background #478AF1
  .el-row
    margin-top 50px
    .el-col 
      color #000
      font-size 14px
      text-align left 
      cursor pointer
      &:hover
        color #478AF1
        text-decoration underline
  .last-col
    text-align right !important
  .fot
    color #fff
    font-size 14px
    text-align center
    span 
      cursor pointer
      a 
        color #fff
    span:first-child
      border-right 2px solid #fff
      padding 2px 45px 2px 0
    span:last-child
      padding 2px 0 2px 45px
      margin-left -2px
    i 
      margin-right 8px
      font-size 22px
      vertical-align middle
  .el-form-item
    margin-bottom 0
  .el-form-item__content
    line-height 0 !important
  .el-input__inner
    height 17px !important 
    line-height 17px !important
    padding 0
    border 0
    color #000
  .el-form-item__error
    top 53%
</style>
