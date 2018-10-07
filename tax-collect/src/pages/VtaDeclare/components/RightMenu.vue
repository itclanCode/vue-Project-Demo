<template>

  <div class="rightMenu">
      <div class="menuBtn">
        <i class="el-icon-arrow-left"></i>
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="rg-title">主附表树</div>
      <el-menu
        class="rg-menu"
        :default-active="activeIndex"
        @select="select">
        <el-menu-item :index="item.idx" v-for="(item, idx) in menuItem" :key="idx">
          <i class="el-icon-rep-yuandianxiao"></i><span slot="title">{{_constant.VTADECLARETABLE_TYPE[item.idx]}}</span>
        </el-menu-item>
      </el-menu>
    </div>
</template>

<script>
  export default {
    name: 'rightMenu',
    props: ['active'],
    data() {
      return {
        activeIndex: this.active,
        menuItem: [
          {idx: '1'},
          {idx: '2'},
          {idx: '3'},
        ]
      }
    },
    watch: {
      active: function(n) {
        this.activeIndex = n;
      }
    },
    methods: {
      select(val) {
        this.activeIndex = val;
        this.$emit('select', this.activeIndex)
      }
    }
  }
</script>

<style scoped>

</style>