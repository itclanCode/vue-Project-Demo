<template>
  <el-container class='account'>
    <el-container>
      <!--主体内容-->
      <el-main class='main'>
        <div class='mainWrap'>
          <div class='wrap'>
            <el-row>
              <el-col :span="12" class="leftT">
                <p class='message'>基本信息</p>
                <div class='usermessage'>
                  <span class='username'>用户名</span>
                  <span class='text'>{{user}}</span>
                </div>
              </el-col>
              <!-- <el-col :span="12">
                <div class="rightT">
                  <div class="via">
                    <img :src="src" alt="">
                  </div>
                  <el-button size="small" type="primary" class="btn" @click="toggleShow">更改头像</el-button>
                  <my-upload field="file"
                    @crop-success="cropSuccess"
                    @crop-upload-success="cropUploadSuccess"
                    @crop-upload-fail="cropUploadFail"
                    v-model="show"
                    :width="200"
                    :height="200"
                    :url="url"
                    img-format="png"></my-upload> -->
                  <!-- <el-upload
                    class="upload-demo"
                    :action='url'
                    :data="upLoadData"
                    :before-upload="uploadBefore"
                    :show-file-list='false'
                    :onSuccess="uploadSuccess">
                    <el-button size="small" type="primary" class="btn">更改头像</el-button>
                  </el-upload> -->
                <!-- </div>
              </el-col> -->
            </el-row>
            <el-collapse accordion v-model="activeNames">
              <el-collapse-item title='修改手机号' name='1'>
                <p>手机号用于登录时接收验证码，以及找回密码，请谨慎修改。</p>
                <el-form ref='form' :model='form' label-width='80px' size='mini' :rules='rules'>
                  <el-form-item label='原手机' prop='oldPhone'>
                    <el-input v-model.number='form.oldPhone' auto-complete='off' :disabled='true' class="oldPhone"></el-input>
                  </el-form-item>
                  <el-form-item label='密码' prop='pass'>
                    <el-input type='password' class='password' v-model='form.pass' auto-complete='off' placeholder='请输入登录密码'></el-input>
                  </el-form-item>
                  <el-form-item label='新手机' prop='newPhone'>
                    <el-input v-model.number='form.newPhone' auto-complete='off' placeholder='请输入新手机号码'></el-input>
                  </el-form-item>
                  <el-form-item label='验证码' prop='code'>
                    <el-input v-model='form.code' auto-complete='off' placeholder='请输入验证码'></el-input>
                    <input type='button' class='btn' @click='getCode($event)' value='获取验证码' :disabled='form.newPhone ? isDisabled : !isDisabled'>
                  </el-form-item>
                </el-form>
                <div class='sure'>
                  <el-button type='primary' class='btn2' @click='changePhone()'>确定</el-button>
                </div>
              </el-collapse-item>
              <el-collapse-item title='修改密码' name='2'>
                <el-form ref='form1' :model='form1' label-width='80px' size='mini' :rules='rules1'>
                  <el-form-item label='手机号' prop='phone'>
                    <el-input v-model.number='form1.phone' auto-complete='off' :disabled='true'></el-input>
                  </el-form-item>
                  <el-form-item label='原密码' prop='oldPass'>
                    <el-input type='password' class='password' v-model='form1.oldPass' auto-complete='off' placeholder='请输入当前密码'></el-input>
                  </el-form-item>
                  <el-form-item label='新密码' prop='newPass'>
                    <el-input type='password' class='password' v-model='form1.newPass' auto-complete='off' placeholder='请输入新密码'></el-input>
                  </el-form-item>
                  <el-form-item label='确认密码' prop='checkPass'>
                    <el-input type='password' class='password' v-model='form1.checkPass' auto-complete='off' placeholder='请确认新密码'></el-input>
                  </el-form-item>
                  <el-form-item label='验证码' prop='code'>
                    <el-input v-model='form1.code' auto-complete='off' placeholder='请输入验证码'></el-input>
                    <input type='button' class='btn' @click='getCode1($event)' value='获取验证码' :disabled='isDisabled'>
                  </el-form-item>
                </el-form>
                <div class='sure'>
                  <el-button type='primary' class='btn2' @click="changePass()">确定</el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </el-main>
      <!--底部-->
      <!-- <el-footer>
        <bottom></bottom>
      </el-footer> -->
    </el-container>
  </el-container>
</template>
<script>
import { loginRequest, accountRequest } from '@/services/request';

export default {
  mounted() {
    this.src = this.$route.query.src
    var token = window.localStorage.getItem('token');
    this.url = this.url + '?token=' + token;
    this.getuserRole();
    this.user = window.localStorage.name;
    console.log(window.localStorage);
    let data = {
      account: window.localStorage.name
    }
    accountRequest.getPhone(data).then(data => {
      console.log(data, 'phone');
      if (data.code === 0) {
        let data1 = data.data;
        this.form.oldPhone = data1.mobilePhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        this.form1.phone = data1.mobilePhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        this.form1.phone1 = data1.mobilePhone;
      }
    })
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form1.checkPass !== '') {
          this.$refs.form1.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form1.newPass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      defaultOpen: ['1'],
      show: false,
      src: '',
      url: 'http://172.16.18.28/taobao/upload/user-photo',
      uploadurl: '',
      upLoadData: {
        uploadUrl: ''
      },
      isDisabled: false,
      activeNames: null,
      userRole: '',
      user: '',
      form: {
        oldPhone: '',
        pass: '',
        newPhone: null,
        code: ''
      },
      form1: {
        phone: '',
        phone1: '',
        oldPass: '',
        newPass: '',
        checkPass: '',
        code: ''
      },
      rules: {
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\\\W_!@#$%^&*`~()-+=]{10,30}$/,
            message: '请输入10-30个包含大小写字母、数字、特殊字符的密码',
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          {pattern: /[0-9]{4}/, message: '请输入4位数验证码', trigger: 'blur'}
        ],
        oldPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ],
        newPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ]
      },
      rules1: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ],
        oldPass: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\\\W_!@#$%^&*`~()-+=]{10,30}$/,
            message: '请输入10-30个包含大小写字母、数字、特殊字符的密码',
            trigger: 'blur'
          }
        ],
        newPass: [
          { required: true, validator: validatePass, trigger: 'blur' },
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\\\W_!@#$%^&*`~()-+=]{10,30}$/,
            message: '请输入10-30个包含大小写字母、数字、特殊字符的密码',
            trigger: 'blur'
          }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' },
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\\\W_!@#$%^&*`~()-+=]{10,30}$/,
            message: '请输入10-30个包含大小写字母、数字、特殊字符的密码',
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          {pattern: /[0-9]{4}/, message: '请输入4位数验证码', trigger: 'blur'}
        ]
      },
      changeImg: false, // 更改头像后 切换changeImg
    };
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    cropUploadFail(status, field) {
    },
    cropUploadSuccess(jsonData, field) {
      this.uploadurl = jsonData.data.uploadUrl
      this.src = this.uploadurl;
      if (jsonData.result === 'error') {
        this.$message.error(jsonData.data.message);
      } else {
        let data = {photoUrl: this.uploadurl}
        accountRequest.changeUserPhoto(data).then(data => {
          this.changeImg = !this.changeImg
        })
      }
    },
    cropSuccess(imgDataUrl, field) {
    },
    getuserRole() {
      loginRequest.getUserRole().then((data) => {
        if (data.code === 0) {
          if (data.data.role === 6) {
          // 提供版
            this.userRole = 6;
          } else if (data.data.role === 7) {
          // 税务代理版
            this.userRole = 7;
          } else if (data.data.role === 8) {
          // 需求版
            this.userRole = 8;
          } else {
          }
        }
      })
    },
    // 修改密码
    changePass() {
      let data = {
        originalPassword: this.form1.oldPass,
        securityCode: this.form1.code,
        newPassword: this.form1.newPass
      }
      for (var i in this.form1) {
        if (!this.form1[i]) {
          this.$message({
            message: '请填写完整信息',
            type: 'warning'
          });
          return false;
        }
      }
      accountRequest.updatePass(data).then(data => {
        if (data.code === 0) {
          this.activeNames = null
          this.$message({
            message: '恭喜你，密码修改成功',
            type: 'success'
          });
          this.form1.phone1 = '';
          this.form1.oldPass = '';
          this.form1.newPass = '';
          this.form1.checkPass = '';
          this.form1.code = '';
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    // 修改手机号
    changePhone() {
      let data = {
        originalPassword: this.form.pass,
        securityCode: this.form.code,
        newMobilePhone: this.form.newPhone
      }
      for (var i in this.form) {
        if (!this.form[i]) {
          this.$message({
            message: '请填写完整信息',
            type: 'warning'
          });
          return false;
        }
      }
      accountRequest.updatePone(data).then(data => {
        if (data.code === 0) {
          this.activeNames = null
          this.$message({
            message: '恭喜你，手机号修改成功',
            type: 'success'
          });
          this.form.oldPhone = (this.form.newPhone + '').replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
          this.form.pass = '';
          this.form.newPhone = '';
          this.form.code = '';
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    // 修改手机号获取验证
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
          clearInterval(timer);
        }
      }, 1000);
      // kami ** 这里要修改传的参数 **
      var data = {mobilePhone: this.form.newPhone, type: 'USER_PHONE_MODIFY_VERIFICATION', contents: []}
      // 获取短信验证码
      accountRequest.sendCode(data).then(data => {})
    },
    // 修改密码获取验证
    getCode1(e) {
      console.log('111');
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
          clearInterval(timer);
        }
      }, 1000);
      // kami ** 这里要修改传的参数 **
      var data = {mobilePhone: this.form1.phone1, type: 'USER_PASSWORD_CHANGE_VERIFICATION', contents: []}
      // 获取短信验证码
      accountRequest.sendCode(data).then(data => {})
    }
  }
};
</script>
<style lang='stylus' rel='stylesheet/stylus'>
@import './style/index.styl';
</style>
