<!-- Created by qintengbo on 2018/06/22. -->
<!-- 全局面包屑 -->

<template>
  <div class="breadCon">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item, index) in breadMenuData" :key="index">
        <span v-if="item.path == ''">{{ item.name }}</span>
        <router-link v-else :to="{name: item.path}">{{ item.name }}</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import breadMenu from '@/common/js/breadMenu';

export default {
  name: 'breadcrumb',
  data() {
    return {
      breadMenuData: [],
      path: '',
      breadMenu: breadMenu,
      params: ''
    }
  },
  mounted() {
    this.path = this.$router.history.current.name;
    this.breadMenuMatching(this.path);
  },
  methods: {
    breadMenuMatching: function(path) {
      this.params = this.$route.params;
      if (this.params.num === 0 || this.params.num === '0') {
        this.breadMenu[2].children[1].children[0].name = '添加涉税报告';
      } else if (this.params.num === 1 || this.params.num === '1') {
        this.breadMenu[2].children[1].children[0].name = '查看涉税报告';
      } else if (this.params.num === 2 || this.params.num === '2') {
        this.breadMenu[2].children[1].children[0].name = '修改涉税报告';
      }
      this.breadMenu.forEach(item => {
        if (item.path === path) {
          this.breadMenuData.push(item);
        } else {
          if (item.children) {
            item.children.forEach(val => {
              if (val.path === path) {
                this.breadMenuData.push({name: item.name, path: item.path});
                this.breadMenuData.push(val);
              } else {
                if (val.children) {
                  val.children.forEach(ele => {
                    if (ele.path === path) {
                      this.breadMenuData.push({name: item.name, path: item.path});
                      this.breadMenuData.push({name: val.name, path: val.path});
                      this.breadMenuData.push(ele);
                    } else {
                      if (ele.children) {
                        ele.children.forEach(k => {
                          if (k.path === path) {
                            this.breadMenuData.push({name: item.name, path: item.path});
                            this.breadMenuData.push({name: val.name, path: val.path});
                            this.breadMenuData.push({name: ele.name, path: ele.path});
                            this.breadMenuData.push(k);
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        }
      });
    }
  },
  watch: {
    $route(to, from) {
      this.breadMenuData = [];
      this.breadMenuMatching(to.name);
    }
  },
}
</script>

<style lang="stylus">
.breadCon 
  margin 3px 0 16px
  .el-breadcrumb__inner
    color #2a2a2a
  .el-breadcrumb__item:last-child .el-breadcrumb__inner, 
  .el-breadcrumb__item:last-child .el-breadcrumb__inner a, 
  .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
  .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover
    color #4680FF
  .el-breadcrumb__inner a,
  .el-breadcrumb__inner.is-link
    font-weight 400
</style>
