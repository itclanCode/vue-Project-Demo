<template>
  <el-container class="demandWrap">
    <el-main>
      <div class="demand">
        <el-form :label-position="labelPosition" :model="ruleForm1" :rules="rules" ref="ruleForm1" label-width="100px" class="ruleForm1">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="ruleForm1.name"></el-input>
          </el-form-item>
          <el-form-item  label="手机号码"  prop="phone">
            <el-input v-model.number="ruleForm1.phone" auto-complete="off" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="ruleForm1.code" auto-complete="off"></el-input>
            <input type="button" class="btn" @click="getCode($event)" value='获取验证码' :disabled='isDisabled'>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input :type="this.pwdType" class="password2" v-model="ruleForm1.pass" auto-complete="off"></el-input>
            <input type="button" class="show2" @click="togglePassWord()" :class="this.pwdType === 'password' ? '':'active'">
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input :type="this.pwdType" class="password2" v-model="ruleForm1.checkPass" auto-complete="off"></el-input>
            <input type="button" class="show2" @click="togglePassWord()" :class="this.pwdType === 'password' ? '':'active'">
          </el-form-item>
        </el-form>
        <div class='argeen'>
          <el-checkbox v-model="checked">
            <span>我已阅读并接受<router-link to='/'><i>《企税易平台服务协议》</i></router-link></span>
          </el-checkbox>
        </div>
        <div class='register'>
          <el-button type="primary" @click="submit('ruleForm1')">立即注册</el-button>
        </div>
        <div class="mask1">
          <img src="../../../assets/img/register/point.png" alt="提示">
          <p>手机号码或用户名已注册</p>
          <router-link to='/register'>
            <el-button type="primary" class='affirm' @click="confirm1()">好的，我知道了</el-button>
          </router-link>
        </div>
        <div class="succeed1">
          <img src="../../../assets/img/register/point2.png" alt="提示">
          <p class="success">注册成功</p>
          <p>恭喜您在涉税专业服务管理平台成功注册</p>
          <p>请继续您的操作</p>
          <router-link to='/login'>
            <el-button type="primary" class='affirm' @click="confirm2()">好的，我知道了</el-button>
          </router-link>
        </div>
        <div class="bg1"></div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import { registerRequest } from '@/services/request';
  export default {
    data() {
      // 验证密码
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm1.checkPass !== '') {
            this.$refs.ruleForm1.validateField('checkPass');
          }
          callback();
        }
      };
      // 确认密码
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm1.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validateName = (rule, value, callback) => {
        // 获取用户名列表
        registerRequest.getUserNameList(value).then(data => {
          let name = data.result;
          if (value === '') {
            callback(new Error('请输入用户名'))
          } else if (name === 'ok') {
            callback(new Error('该用户名已存在'));
          } else {
            callback();
          }
        })
      };
      var validatePhone = (rule, value, callback) => {
        // 获取用户手机号码
        registerRequest.getPhoneList(value).then(data => {
          let phone = data.result;
          if (value + '' === '') {
            callback(new Error('请输入手机号'))
          } else if (phone === 'ok') {
            callback(new Error('该手机号已存在'))
          } else {
            callback();
          }
        })
      };
      return {
        pwdType: 'password',
        checked: true,
        labelPosition: 'right',
        isDisabled: false,
        ruleForm1: {
          name: '',
          phone: null,
          code: '',
          pass: '',
          checkPass: '',
          data: null
        },
        rules: {
          name: [
            { required: true, validator: validateName, trigger: 'blur' },
            {pattern: /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/, message: '请输入输入5-20个以字母开头、可带数字、“_”、“.”的用户名', trigger: 'blur'}
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            {pattern: /^\d{6}$/, message: '请输入6位数验证码', trigger: 'blur'}
          ],
          pass: [
            { required: true, validator: validatePass, trigger: 'blur' },
            {pattern: /^(\w){6,20}$/, message: '请输入6-20个包含字母、数字、下划线的密码', trigger: 'blur'}
          ],
          checkPass: [
            { required: true, validator: validatePass2, trigger: 'blur' },
            {pattern: /^(\w){6,20}$/, message: '请输入6-20个包含字母、数字、下划线的密码', trigger: 'blur'}
          ],
          phone: [
            { required: true, validator: validatePhone, trigger: 'blur' },
            {pattern: /^1[34578]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      // 密码显示与隐藏
      togglePassWord() {
        this.pwdType = this.pwdType === 'password' ? 'text' : 'password';
      },
      // 获取验证码
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
            e.target.style.backgroundColor = '#169bd4';
            e.target.value = '获取验证码';
            clearInterval(timer)
          }
        }, 1000)
        var data = {mobilePhone: this.ruleForm1.phone};
        // 获取短信验证码
        registerRequest.sendCode(data).then(data => {
        })
      },
      // 注册提交
      submit(ruleForm1) {
        let that = this;
        let data = {
          username: this.ruleForm1.name,
          password: this.ruleForm1.pass,
          confirmPassword: this.ruleForm1.checkPass,
          registerVerificationCode: this.ruleForm1.code,
          registerMobilePhone: this.ruleForm1.phone,
          roleType: 8
        };
        registerRequest.postMandator(data).then(data => {
          let data1 = data.data;
          let p = document.querySelector('.mask1 p');
          if (data.result === 'error') {
            p.innerHTML = data1.message;
            that.prompt1();
          } else {
            that.prompt2();
          }
        })
      },
      prompt1() {
        let bg1 = document.querySelector('.bg1');
        let mask1 = document.querySelector('.mask1');
        bg1.style.display = 'block';
        mask1.style.display = 'block';
      },
      confirm1() {
        let bg1 = document.querySelector('.bg1');
        let mask1 = document.querySelector('.mask1');
        bg1.style.display = 'none';
        mask1.style.display = 'none';
      },
      prompt2() {
        let bg1 = document.querySelector('.bg1');
        let succeed1 = document.querySelector('.succeed1');
        bg1.style.display = 'block';
        succeed1.style.display = 'block';
      },
      confirm2() {
        let bg1 = document.querySelector('.bg1');
        let succeed1 = document.querySelector('.succeed1');
        bg1.style.display = 'none';
        succeed1.style.display = 'none';
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
 @import '../style/demand.styl'
</style>
