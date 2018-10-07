<template>
  <div class="dashboard">
    <Header></Header>
    <el-container class="dashboardCon">
      <el-aside>
        <left-menu></left-menu>
      </el-aside>
      <el-main id="main">
        <breadcrumb/>
        <router-view/>
      </el-main>
    </el-container>

    <!-- 设置密码弹窗 -->
    <el-dialog title="设置密码" :visible.sync="dialogVisible" center width="400px" :show-close="showClose">
      <div class="dashboard-tip"><i class="el-icon-warning"></i> 您还未设置密码：</div>
      <el-form :model="form" ref="detailForm" :rules="rules">
        <el-form-item label="密码" label-width="80px" prop="psw">
          <el-input type="password" v-model="form.psw" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="80px" prop="pswSecond">
          <el-input type="password" v-model="form.pswSecond" auto-complete="off" placeholder="请再次输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Header from '@/components/Header';
  import leftMenu from '@/components/leftMenu';
  import breadcrumb from '@/components/breadcrumb';
  import { accountRequest } from '@/services/request';

  export default {
    components: {
      Header,
      leftMenu,
      breadcrumb
    },
    data() {
      return {
        dialogVisible: false,
        showClose: false,
        form: {
          psw: '',
          pswSecond: ''
        },
        rules: {
          psw: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 10, max: 30, message: '长度在 10 到 30 个字符' },
            {
              pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\\\W_!@#$%^&*`~()-+=]{10,30}$/,
              message: '必须包含大小写字母、数字、特殊字符中的三类'
            }
          ],
          pswSecond: [
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { validator: this.pswSecondValidator, trigger: 'change' }
          ]
        }
      }
    },
    mounted() {
      if (window.localStorage['isFirstLogin'] === 'true') {
        this.dialogVisible = true;
      }
    },
    methods: {
      pswSecondValidator(rule, value, callback) {
        if (this.form.psw !== this.form.pswSecond) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      ok() {
        this.$refs.detailForm.validate(valid => {
          if (valid) {
            let data = {
              mobilePhone: window.localStorage['name'],
              password: this.form.psw
            };
            accountRequest.setPsw(data).then(res => {
              if (res.code === 0) {
                window.Success('设置密码成功');
                this.dialogVisible = false;
                window.localStorage['isFirstLogin'] = '';
              } else {
                window.Alert('设置密码失败');
              }
            });
          }
        });
      },
      cancel() {
        window.localStorage['isFirstLogin'] = '';
        this.dialogVisible = false;
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .dashboard 
    height 100% 
    background #f2f4f7 
    font-size 14px 
  .dashboardCon 
    padding-top 13px 
    height calc(100% - 80px)
    position relative
  .el-form-item__content
    margin-left 82px !important
  .dashboard-tip
    margin-top -15px
    margin-bottom 15px
    i 
      color #E6A23C
  .dialog-footer
    margin-top -20px
</style>