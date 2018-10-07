<template>
  <el-container class="supplyWrap">
    <el-main>
      <div class="supply">
        <el-steps :active="isActive" align-center class="steps">
          <el-step title="注册"></el-step>
          <el-step title="实名认证"></el-step>
        </el-steps>
        <div v-if="isActive === 1">
          <el-form :label-position="labelPosition" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
            <el-form-item label="机构类型" prop="region">
              <el-select v-model="ruleForm.region" placeholder="请选择企业类型" class="select">
                <i class="el-icon-caret-bottom" slot="icon"></i>
                <el-option v-for="(item, key) in orgType" :key="key" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户名" prop="name" class="username">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone" class="telphone">
              <el-input v-model.number="ruleForm.phone" auto-complete="off" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-input v-model="ruleForm.code" auto-complete="off"></el-input>
              <input type="button" class="btn" @click="getCode($event)" value='获取验证码' :disabled='isDisabled'>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input :type="this.pwdType" class="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
              <input type="button" class="show" @click="togglePassWord()" :class="this.pwdType === 'password' ? '':'active'">
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input :type="this.pwdType" class="password" v-model="ruleForm.checkPass" auto-complete="off"></el-input>
              <input class="show" type="button" @click="togglePassWord()" :class="this.pwdType === 'password' ? '':'active'">
            </el-form-item>
          </el-form>
          <!-- <div class='argeen'>
            <el-checkbox v-model="checked">
              <span>我已阅读并接受
                <router-link to="/protocol" target="_blank">
                  <i>《涉税专业服务管理平台协议》</i>
                </router-link>
              </span>
            </el-checkbox>
          </div> -->
          <el-button type="primary" class='register' @click="submit('ruleForm')">下一步</el-button>
        </div>
        <div v-else>
          <el-form :label-position="labelPosition" :model="ruleForm1" :rules="rules" ref="ruleForm1" label-width="100px" class="ruleForm1">
            <el-form-item label="统一社会信用代码" prop="ird">
                <el-input v-model="ruleForm1.ird" auto-complete="off"></el-input>
              </el-form-item>
            <el-form-item label="法人手机号码"  prop="legalPhone">
              <el-input v-model.number="ruleForm1.legalPhone" auto-complete="off" placeholder="请输入法人手机号码"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-input v-model="ruleForm1.code" auto-complete="off"></el-input>
              <input type="button" class="btn" @click="getCode1($event)" value='获取验证码' :disabled='isPoint'>
            </el-form-item>
          </el-form>
          <el-button type="primary" class='register' @click="pre()">上一步</el-button>
          <el-button type="primary" class='register' @click="submit1('ruleForm','ruleForm1')">立即认证</el-button>
        </div>
        <div class="failed">
          <img src="../../../assets/img/register/point.png" alt="提示">
          <p>您的企业税号和法人电话号不匹配</p>
          <router-link to='/supply'>
            <el-button type="primary" class='affirm' @click="affirm()">好的，我知道了</el-button>
          </router-link>
        </div>
        <div class="failed1">
          <img src="../../../assets/img/register/point.png" alt="提示">
          <div>查不到企业信息!</div>
          <p></p>
          <router-link to='/supply'>
            <el-button type="primary" class='affirm' @click="affirm3()">好的，我知道了</el-button>
          </router-link>
        </div>
        <div class="succeed">
          <img src="../../../assets/img/register/point2.png" alt="提示">
          <p class="success">注册成功</p>
          <p>恭喜您在涉税专业服务管理平台成功注册</p>
          <p>请登录平台完成实名信息采集</p>
          <router-link to='/login'>
            <el-button type="primary" class='affirm' @click="affirm2()">好的，我知道了</el-button>
          </router-link>
        </div>
        <div class="bg"></div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import { registerRequest } from '@/services/request';
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validateName = (rule, value, callback) => {
        // 判断用户名是否已存在
        let reg = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/
        if (value === '') {
          callback(new Error('请输入用户名'))
        } else if (!reg.test(value)) {
          callback(new Error('请输入5-20个以字母开头、可带数字、“_”、“.”的用户名'))
        } else {
          registerRequest.getUserNameList(value).then(data => {
            if (data.code === 12016) {
              callback(new Error('该用户名已存在'));
            } else {
              callback();
            }
          })
        }
      };
      var validatePhone = (rule, value, callback) => {
        let reg = /^1[34578]\d{9}$/
        // 判断用户手机号码是否已存在
        if (value + '' === '') {
          callback(new Error('请输入手机号'))
        } else if (!reg.test(value)) {
          callback(new Error('手机号码格式不正确!'))
        } else {
          registerRequest.getPhoneList(value).then(data => {
            // let phone = data.result;
            if (data.code === 12016) {
              callback(new Error('该手机号已存在'))
            } else {
              callback();
            }
          })
        }
      };
      var validateIrd = (rule, value, callback) => {
        // 判断企业税号是否存在
        let reg = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/
        if (value + '' === '') {
          callback(new Error('请输入统一社会信用代码'))
        } else if (!reg.test(value)) {
          callback(new Error('统一社会信用代码格式不正确'))
        } else {
          registerRequest.getIrd(value).then(data => {
            if (data.code === 12006) {
              callback(new Error('该统一社会信用代码已存在'))
            } else {
              callback();
            }
          })
        }
      };
      var validateLegalPhone = (rule, value, callback) => {
        // 获取法人手机号
        let reg = /^1[34578]\d{9}$/
        // 判断用户手机号码是否已存在
        if (value + '' === '') {
          callback(new Error('请输入法人手机号'))
        } else if (!reg.test(value)) {
          callback(new Error('法人手机号码格式不正确!'))
        }
      };
      return {
        isActive: 1,
        pwdType: 'password',
        checked: true,
        labelPosition: 'right',
        isDisabled: false,
        isPoint: false,
        orgType: [],
        ruleForm: {
          region: null, // 企业类型
          name: '', // 用户名
          phone: '', // 手机号
          code: '', // 验证码
          pass: '', // 密码
          checkPass: '', // 确认密码
          data: {
            phone: '',
            name: ''
          }
        },
        ruleForm1: {
          legalPhone: '', // 法人手机号
          ird: '', // 企业税号
          code: ''
        },
        rules: {
          region: [
            { required: true, message: '请选择企业类型', trigger: 'change' }
          ],
          name: [
            { required: true, validator: validateName, trigger: 'blur' },
            {pattern: /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/, message: '请输入5-20个以字母开头、可带数字、“_”、“.”的用户名', trigger: 'blur'}
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            {pattern: /^\d{6}$/, message: '请输入6位数验证码', trigger: 'blur'}
          ],
          pass: [
            {
              min: 10,
              max: 30,
              message: '长度在 10 到 30 个字符'
            }, {
              pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\\\W_!@#$%^&*`~()-+=]{10,30}$/,
              message: '必须包含大小写字母、数字、特殊字符中的三类'
            },
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            {
              min: 10,
              max: 30,
              message: '长度在 10 到 30 个字符',
              trigger: 'blur'
            }, {
              pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\\\W_!@#$%^&*`~()-+=]{10,30}$/,
              message: '必须包含大小写字母、数字、特殊字符中的三类',
              trigger: 'blur'
            },
            { validator: validatePass2, trigger: 'blur' }
          ],
          phone: [
            { required: true, validator: validatePhone, trigger: 'blur' },
            {pattern: /^1[34578]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur'}
          ],
          legalPhone: [
            { required: true, validator: validateLegalPhone, trigger: 'blur' },
            {pattern: /^1[34578]\d{9}$/, message: '法人手机号码格式不正确', trigger: 'blur'}
          ],
          ird: [
            { required: true, validator: validateIrd, trigger: 'blur' },
            {pattern: /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/, message: '统一社会信用代码格式不正确', trigger: 'blur'}
          ]
        }
      };
    },
    mounted() {
      registerRequest.getOrgType().then(data => {
        this.orgType = data
      })
    },
    methods: {
      pre() {
        this.isActive = 1
      },
      // 密码显示与隐藏
      togglePassWord() {
        this.pwdType = this.pwdType === 'password' ? 'text' : 'password';
      },
      // 获取验证
      getCode(e) {
        let that = this;
        let num = 60;
        let timer = setInterval(function() {
          num--;
          e.target.value = num + ' ' + '秒';
          e.target.style.backgroundColor = '#666666';
          that.isDisabled = 'disabled';
          if (num === 0) {
            that.isDisabled = false;
            e.target.style.backgroundColor = '#4680ff';
            e.target.value = '获取验证码';
            clearInterval(timer)
          }
        }, 1000)
        // ** 这里要修改传的参数 **
        // var data = {mobilePhone: this.ruleForm.phone};
        var data = {mobilePhone: this.ruleForm.phone, contents: [], type: 'USER_VERIFICATION'};
        // 获取短信验证码
        registerRequest.sendCode(data).then(data => {
          if (data.code === 0) {
            this.$message({
              message: data.msg,
              type: 'success'
            });
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      // 获取法人验证
      getCode1(e) {
        let that = this;
        let num = 60;
        let timer = setInterval(function() {
          num--;
          e.target.value = num + ' ' + '秒';
          e.target.style.backgroundColor = '#666666';
          that.isPoint = 'disabled';
          if (num === 0) {
            that.isPoint = false;
            e.target.style.backgroundColor = '#4680ff';
            e.target.value = '获取验证码';
            clearInterval(timer)
          }
        }, 1000)
        // ** 这里要修改传的参数 **
        var data = {mobilePhone: this.ruleForm1.legalPhone, contents: [], type: 'LEGAL_PERSON_VERIFICATION'};
        // 获取短信验证码
        registerRequest.sendCode(data).then(data => {
          if (data.code === 0) {
            this.$message({
              message: data.msg,
              type: 'success'
            });
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      // 验证验证码是否正确
      submit(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            let data = {
              mobilePhone: this.ruleForm.phone,
              securityCode: this.ruleForm.code
            }
            registerRequest.verifyCode(data).then(data => {
              if (data.code === 0) {
                this.isActive = 2
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            return false;
          }
        });
      },
      // 注册提交
      submit1(ruleForm1) {
        let that = this;
        let reg = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/
        let reg1 = /^1[34578]\d{9}$/
        let reg2 = /^\d{6}$/
        let data = {
          agencyType: that.ruleForm.region,
          username: that.ruleForm.name,
          registerMobilePhone: that.ruleForm.phone,
          registerVerificationCode: that.ruleForm.code,
          password: that.ruleForm.pass,
          confirmPassword: that.ruleForm.checkPass,
          socialCreditCode: that.ruleForm1.ird,
          corpMobilePhone: that.ruleForm1.legalPhone,
          corpVerificationCode: that.ruleForm1.code,
        };
        if (this.ruleForm1.ird + '' === '') {
          that.$message.error('统一社会信用代码不得为空')
          return false
        } else if (!reg.test(this.ruleForm1.ird)) {
          that.$message.error('企业税号格式不正确')
          return false
        } else if (this.ruleForm1.legalPhone + '' === '') {
          that.$message.error('法人手机号不得为空')
          return false
        } else if (!reg1.test(this.ruleForm1.legalPhone)) {
          that.$message.error('法人手机号码格式不正确')
          return false
        } else if (this.ruleForm1.code + '' === '') {
          that.$message.error('验证码不得为空')
          return false
        } else if (!reg2.test(this.ruleForm1.code)) {
          that.$message.error('验证码必须为六位数')
          return false
        } else {
          registerRequest.postAgency(data).then(data => {
            let p = document.querySelector('.failed p');
            let p1 = document.querySelector('.failed1 p');
            if (data.code === 0) {
              that.hint2();
            } else {
              if (data.code === 12018) {
                that.hint3();
                p1.innerHTML = data.msg;
              } else {
                that.hint1();
                p.innerHTML = data.msg;
              }
            }
          })
        }
      },
      // 查不到社会信用代码相关信息
      hint3() {
        let bg = document.querySelector('.bg');
        let failed = document.querySelector('.failed1');
        bg.style.display = 'block';
        failed.style.display = 'block';
      },
      affirm3() {
        let bg = document.querySelector('.bg');
        let failed = document.querySelector('.failed1');
        bg.style.display = 'none';
        failed.style.display = 'none';
        this.$router.go(0);
      },
      // 注册失败弹窗
      hint1() {
        let bg = document.querySelector('.bg');
        let failed = document.querySelector('.failed');
        bg.style.display = 'block';
        failed.style.display = 'block';
      },
      affirm() {
        let bg = document.querySelector('.bg');
        let failed = document.querySelector('.failed');
        bg.style.display = 'none';
        failed.style.display = 'none';
        this.$router.go(0);
      },
      // 成功的弹窗
      hint2() {
        let bg = document.querySelector('.bg');
        let succeed = document.querySelector('.succeed');
        bg.style.display = 'block';
        succeed.style.display = 'block';
      },
      affirm2() {
        let bg = document.querySelector('.bg');
        let succeed = document.querySelector('.succeed');
        bg.style.display = 'none';
        succeed.style.display = 'none';
        this.isActive = 2;
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../style/supply.styl'
</style>
