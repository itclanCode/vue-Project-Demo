<template>
  <div class="page-pagiation" v-if="totalPage>0">
    <el-pagination 
      background 
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange" 
      :current-page.sync="pageIndex" 
      :page-size="pageSize" 
      layout="total, sizes, prev, pager, next, jumper" 
      :total="totalPage">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'pagepagiation',
  props: ['pagiation'],
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
    }
  },
  mounted () {
  },
  created () {
    // console.log(2222);
    // console.log(this.pagiation);
    // this.totalPage = this.pagiation.totalCount;
  },
  updated () {
  },
  watch: {
    pagiation: function (n, p) {
      this.totalPage = n.totalCount;
      this.pageIndex = n.pageIndex;
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange (val) {
      this.pageIndex = val;
      this.fetchData();
    },
    fetchData () {
      let parms = { pageIndex: this.pageIndex, pageSize: this.pageSize };
      this.$emit('fetchListData', { ...parms })
    }
  }
}
</script>

<style scoped>
</style>