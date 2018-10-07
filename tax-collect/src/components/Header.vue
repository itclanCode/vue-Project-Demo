<template>
  <el-header class="clearfix">
    <span class="header-title"><img src="../assets/img/logo-title.png"></span>
    <div class="operation">
      <span v-if="role == 6"><a :href="url" target="_blank">企易税首页</a></span>
      <span>
        <el-dropdown v-if="userName" @command="command">
          <span class="header-name">
            <i class="el-icon-rep-yonghu"></i> 个人中心 <i class="el-icon-arrow-down"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">收藏夹</el-dropdown-item>
            <el-dropdown-item command="b" v-if="role == 6">待处理需求</el-dropdown-item>
            <el-dropdown-item command="c" v-if="role == 6">订单管理</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
      <span class="header-login" v-if="!userName" @click="loginButton">登录</span>
      <span>
        <el-dropdown v-if="userName" @command="command">
          <span class="header-name">
            {{ userName }} <i class="el-icon-arrow-down userIcon"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1"><i class="el-icon-rep-shezhi"></i> 账号设置</el-dropdown-item>
            <el-dropdown-item command="2"><i class="el-icon-rep-tuichu"></i> 退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>
  </el-header>
</template>

<script>
import { loginRequest } from '@/services/request';

export default {
  name: 'Header',
  data() {
    return {
      disStatus: false,
      content: '',
      index: '',
      keyword: '',
      role: '',
      userName: '',
      serachName: '',
      token: window.localStorage['token'],
      url: window.localStorage['url']
    }
  },
  created() {
    this.getUser();
  },
  mounted() {
    // 企易税首页链接地址
    this.url = `${this.url}:81/?token=${this.token}`;

    this.index = window.localStorage['index']
    if (this.$route.path === '/index') {
      this.disStatus = true
    } else {
      this.disStatus = false
    }
  },
  methods: {
    getUser() {
      loginRequest.getUserRole().then(data => {
        if (data.code === 0) {
          this.userName = data.data.username;
          this.role = data.data.role;
          window.localStorage['name'] = data.data.username;
          window.localStorage['photo'] = data.data.photo;
          window.localStorage['orgName'] = data.data.orgName;
          window.localStorage['orgType'] = data.data.orgType;
          if (data.data.role === 6) {
            window.localStorage['dataRole'] = '/organization'
          } else if (data.data.role === 7) {
            window.localStorage['dataRole'] = '/agentCenter'
          } else if (data.data.role === 8) {
            window.localStorage['dataRole'] = '/needmain'
          } else {

          }
        }
      })
    },
    loginOut () {
      window.localStorage['token'] = '';
      window.localStorage['name'] = '';
      window.localStorage['index'] = 1;
      window.localStorage['dataRole'] = '';
      window.localStorage['serachId'] = 1;
      window.localStorage['serachName'] = '';
      window.localStorage['serachShow'] = '';
      window.localStorage['role'] = '';
      window.localStorage['photo'] = '';
      window.localStorage['isFirstLogin'] = '';
      window.localStorage['orgName'] = '';
      window.localStorage['orgType'] = '';
      sessionStorage.removeItem('date');
      sessionStorage.removeItem('tyshxydm');
      sessionStorage.removeItem('activeNum');
      sessionStorage.removeItem('activePay');
      sessionStorage.removeItem('activeFin');
      this.userName = ''
      this.$emit('localStorageChange', {'name': window.localStorage['name'], 'role': window.localStorage['role'], 'photo': window.localStorage['photo']})
      this.$router.push({path: '/login'})
    },
    loginButton () {
      this.$router.push({path: '/login'})
    },
    command(command) {
      switch (command) {
        case '1':
          this.$router.push({path: '/account'});
          break;
        case '2':
          this.loginOut();
          break;
        case 'a':
          break;
        case 'b':
          break;
        case 'c':
          location.href = window.localStorage['url'] + ':81/orderControl/?token=' + this.token;
          break;
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .el-header
    height 80px !important 
    padding 0 24px !important
    font-size 16px
    color #333
    background url('../assets/img/header-background.png') no-repeat
    backgroun-size 100% 100%
    box-shadow 0 2px 12px 0 rgba(0,0,0,.1)
    .header-title
      float left
      height 100%
      line-height 111px
      font-size 24px
      font-weight bold
      color #4680ff
    .operation
      float right 
      margin-right 25px
      margin-top 31px
      span 
        margin-left 30px
        &:first-child
          margin-left 0
      a 
        color #333
        &:hover
          color #66b1ff
      .el-dropdown
        outline 0
      .header-login
        cursor pointer 
        &:hover
          color #66b1ff
      .header-name
        font-size 16px
        color #333
        cursor pointer
        i:first-child
          font-weight bold
        &:hover
         color #66b1ff
      .userIcon
        font-weight 400 !important
</style>
