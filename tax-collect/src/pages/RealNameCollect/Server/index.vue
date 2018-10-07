<template>
  <div class="serverMain">
    <el-tabs class="tabs" :tab-position="tabPosition" v-model="activeName" @tab-click="changeTabs">
      <el-tab-pane label="在职" name="first" class="list">
        <InService ref="inService"></InService>
      </el-tab-pane>
      <el-tab-pane label="离职" name="second" class="list">
        <Dimission ref="dimission"></Dimission>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import Dimission from './components/dimission.vue'
  import InService from './components/inService.vue'
  export default {
    components: {
      Dimission,
      InService
    },
    data() {
      return {
        defaultOpen: ['2'],
        tabPosition: 'top',
        activeName: 'first'
      }
    },
    methods: {
      changeTabs() {
        this.$refs.inService.refresh();
        this.$refs.dimission.refresh();
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import './style/index.styl'
</style>
