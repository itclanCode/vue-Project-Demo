<template>
  <div class="menu-container">
    <div class="menu-tab">
      <el-menu :default-active="activeIndex" background-color="#f2f4f7" active-text-color="#4680ff" class="el-menu-demo" mode="horizontal" @select="handleTab">
        <el-menu-item :index="item.idx" v-for="(item,idx) in menu" :key="idx">
          {{item.name}}
          <span v-if="type !=='server'">({{item.count}})</span>
        </el-menu-item>
      </el-menu>
    </div>
    <slot name="menu-rt"></slot>
  </div>
</template>
<script>
export default {
  name: 'menuTab',
  props: ['menu', 'defaultIndex', 'type'],
  data () {
    return {
      activeIndex: '1'
    }
  },
  updated () {
    this.activeIndex = this.defaultIndex;
  },
  methods: {
    handleTab (index) {
      this.activeIndex = index;
      this.$emit('handleTab', this.activeIndex)
    }
  }
}
</script>

<style lang="stylus" scoped>
.menu-container {
  position: relative;
  .menu-tab {
    .el-menu-item {
      height: 22px;
      line-height: 22px;
      padding-bottom: 27px;
      font-size: 14px;
    }
  }
  .el-menu {
    li:hover {
      background: none !important;
      color: #409EFF !important;
    }
  }
}
</style>