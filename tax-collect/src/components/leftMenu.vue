<template>
  <div class="leftMenu">
    <div class="shopCon" @click="toShop">
      <i class="el-icon-rep-dianpufill"></i>
      <span class="shopText">已为您免费开设店铺，<strong>点击进入</strong></span>
      <span class="shopOrder"></span>
      <span class="shopTriangle"></span>
    </div>
    <div class="userInfo">
      <div class="order">
        <img style="border-radius: 50%" :src="photo" class="header-photo">
      </div>
      <p class="menu-title"><a herf="" :title="orgName">{{ orgName }}</a></p>
      <p class="menu-name">{{ _constant.ORGTYPE[orgType] }}</p>
    </div>
    <el-menu
      ref="sub"
      :default-active="activeIndex"
      :default-openeds='defaultOpen'
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      @select="handleSelect"
      background-color="#fff"
      text-color="#fff"
      unique-opened
      active-text-color="#ffd04b">
      <!-- <router-link class="routerLink" :to="{path: '/index1'}">
        <el-menu-item index="1">
          <i class="el-icon-rep-geren setIcon"></i>
          <span slot="title">主页</span>
        </el-menu-item>
      </router-link> -->
      <el-menu-item index="/people" v-if="role != 9 && role != 7">
        <i class="el-icon-rep-geren setIcon"></i>
        <a class="indexText" :href="url + '/people/?token=' + token" slot="title">主页</a>
      </el-menu-item>
      <template v-for="items of menuList">
        <el-submenu v-if="items.roleId == role" :index="items.path" :key="items.id">
          <template slot="title">
            <i :class="items.icon"></i>
            <span>{{ items.name }}</span>
          </template>
          <template v-for="item of items.children">
            <router-link :to="{name: item.path}" :key="item.id" v-if="!item.children && item.path">
              <el-menu-item :index="item.path">{{ item.name }}</el-menu-item>
            </router-link>
            <el-menu-item v-if="!item.children && item.url" :index="item.url" :key="item.url">
              <a :href="url + item.url + '/?token=' + token">{{ item.name }}</a>
            </el-menu-item>
            <el-submenu :index="item.path" v-if="item.children" :key="item.id">
              <template slot="title">{{ item.name }}</template>
              <router-link v-for="val of item.children" :to="{name: val.path}" :key="val.id">
                <el-menu-item :index="val.path">{{ val.name }}</el-menu-item>
              </router-link>
            </el-submenu>
          </template>
        </el-submenu>
      </template>
      <router-link class="routerLink" :to="{path: '/account'}">
        <el-menu-item index="/account">
          <i class="el-icon-rep-shezhi setIcon"></i>
          <span slot="title">账号设置</span>
        </el-menu-item>
      </router-link>
    </el-menu>
  </div>
</template>
<script>
  import { loginRequest } from '@/services/request';
  import menu from '@/common/js/menu';

  export default {
    name: 'leftMenu',
    data() {
      return {
        menuList: [],
        isFirst: false,
        activeIndex: '',
        defaultOpen: [],
        role: '',
        photo: '',
        orgName: '',
        orgType: '',
        type: '',
        menu: '',
        token: window.localStorage['token'],
        url: window.localStorage['url']
      }
    },
    mounted() {
      // 企易税链接地址
      this.url = `${this.url}:81`;

      loginRequest.getOrgRealname().then(data => {
        if (data.code === 7205) {
          this.isFirst = false;
        } else if (data.code === 7206) {
          this.isFirst = true;
        }
      });
      // 获取角色类型及头像
      this.role = window.localStorage['role'];
      this.photo = window.localStorage['photo'];
      this.orgName = window.localStorage['orgName'];
      this.orgType = '116' + window.localStorage['orgType'];
      this.type = window.localStorage['orgType'];
      this.menu = this.deepCopy(menu);

      // TODO:非税务师事务所机构无法查看涉税报告上传模块，这里暂时写死，后期会进行权限管理
      if (this.type === '01') {
        this.menuList = this.menu;
      } else {
        this.menu[3].children.pop();
        this.menuList = this.menu;
      }
      // 根据路由高亮菜单
      this.activeIndex = this.$route.name;
    },
    methods: {
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
      },
      handleSelect(key, keyPath) {
      },
      // 深拷贝方法
      deepCopy: function(obj) {
        // 定义一个对象,用来确定当前的参数是数组还是对象
        let objArr = obj.constructor === Array ? [] : {};
        // 如果obj存在,且类型为对象
        if (obj && typeof obj === 'object') {
          for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
              // 如果obj的子元素是对象,递归操作
              if (obj[key] && typeof obj[key] === 'object') {
                objArr[key] = this.deepCopy(obj[key]);
              } else {
                // 如果不是,直接赋值
                objArr[key] = obj[key];
              }
            }
          }
        }
        return objArr;
      },
      toShop() {
        let url = 'http://139.199.201.11:6060?token=' + this.token;
        window.location.href = url;
      }
    },
    watch: {
      $route(to, from) {
        this.activeIndex = this.$route.name;
      }
    },
  }
  </script>
  <style lang="stylus" rel="stylesheet/stylus">
    @import '../style/leftMenu.styl';
    .tigong{
      width: 136px;
      height: 136px;
      display:inline-block;
      border-radius: 50%;
    }
    .leftMenu .el-menu-item.is-active
      background-color #3399fe !important
    .setIcon
      color #fff !important
    .userInfo
      padding 30px 0
      color #fff
      p
        font-size 14px
      .menu-title
        font-weight bold
        margin-bottom 7px
        font-size 15px
        a
          width 100%
          display inline-block
          padding-bottom 5px
          color #fff
          overflow: hidden
          white-space: nowrap
          text-overflow: ellipsis
      .menu-name
        width 85%
        margin 5px auto 0
        border-bottom 1px solid #fff
        padding-bottom 10px
    .order
      position relative
      margin 0 auto 18px
      padding 5px
      width 110px
      height 110px 
      border-radius 50%
      border 1px solid #fff
    .header-photo
      width 100%
  .header-item
    font-size 16px !important
  .el-submenu__icon-arrow:before
    content: '\e919'
  .el-menu a
    color #fff
  .indexText  
    font-size 16px !important
  .shopCon
    position absolute
    top 30px
    left 10px
    height 40px
    line-height 40px
    padding 0 0 0 15px
    background #fff
    color #3aa3f6
    z-index 99
    cursor pointer
    box-shadow 0 2px 12px 0 rgba(0,0,0,.1)
    &:hover .shopText
      width 196px 
    i 
      font-size 20px
      vertical-align middle
  .shopText 
    display inline-block
    width 0
    overflow hidden
    white-space nowrap
    transition width 0.5s
    -moz-transition width 0.5s /* Firefox 4 */
    -webkit-transition width 0.5s /* Safari and Chrome */
    -o-transition width 0.5s /* Opera */
    vertical-align middle
    margin-left 5px
  .shopOrder
    position absolute
    top 0
    right -20px
    display inline-block
    width 20px
    height 40px
    vertical-align middle 
    border-radius 0 100px 100px 0
    background #fff
  .shopTriangle
    display inline-block
    position absolute 
    top -6px
    left 0
    height 0px
    width 0px
    border-top 6px solid transparent
    border-right 14px solid #cac8c8
  </style>

