<template>
  <div class="wtxylist">
    <h2 class="base-header">委托协议列表</h2>
    <el-card>
      <el-table :data="wtxyListDateTemplate" v-loading="isloading" stripe style="width: 100%">
        <el-table-column label="委托人名称" width="180">
          <template slot-scope="scope">
            <a href="javascript:;" :title="scope.row.mandatorName">{{scope.row.mandatorName ? scope.row.mandatorName : '无'}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="socialCreditCode" label="税号/身份证号" width="180" />
        <el-table-column prop="startDate" label="服务时间起" />
        <el-table-column prop="endDate" label="服务时间止" />
      </el-table>
      <div class="page-pagiation" v-if="totalPage>0">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'wtxylist',
  props: ['wtxyList', 'formParms'],
  data () {
    return {
      tableData: this.wtxylist,
      isloading: true,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  watch: {
    tableData: function (n, p) {
      if (n instanceof Array && n.length > 0) {
        this.isloading = false;
      }
    }
  },
  // created() {
  //   if (this.wtxyList.length > 0) {
  //     this.isloading = false;
  //   } else if (this.wtxyList.length === 0) {
  //     this.isloading = false
  //   }
  // },
  mounted () {
    if (this.wtxyList && this.wtxyList.length > 0) {
      this.isloading = false;
    } else {
      setTimeout(() => {
        this.isloading = false;
      }, 1000)
    }
  },
  updated () {
    this.totalPage = this.formParms.totalPage;
    this.pageIndex = this.formParms.pageIndex;
    if (this.wtxyList && this.wtxyList.length > 0) {
      this.isloading = false;
    } else {
      this.isloading = true;
    }
  },
  methods: {
    formDateStr (arr) {
      let arrRet = arr.map(item => {
        item.startDate = item.startDate ? this.formStateDate(this.ieToLocalDateArr(item.startDate)) : '暂无';
        item.endDate = item.startDate ? this.formStateDate(this.ieToLocalDateArr(item.endDate)) : '暂无';
        return item
      })
      return arrRet;
    },
    // 兼容ie的 toLocaleDateString方法
    ieToLocalDateArr (str) {
      let ntoDate = new Date(str * 1).toLocaleDateString();
      let retArr = [];
      if (ntoDate.includes('年')) {
        ntoDate = ntoDate.replace('年', '/').replace('月', '/').replace('日', '/');
        ntoDate = ntoDate.substring(0, ntoDate.length - 1);
      }
      retArr = ntoDate.split('/');
      return retArr
    },
    formStateDate (arr) {
      let YearRet = [];
      YearRet = arr.map(item => {
        if (item < 10) {
          item = '0' + item;
        }
        return item;
      });
      return YearRet.join('-')
    },
    handleSizeChange (val) {
      this.tableData = [];
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange (val) {
      this.tableData = [];
      this.pageIndex = val;
      this.fetchData();
    },
    fetchData () {
      let parms = { pageIndex: this.pageIndex, pageSize: this.pageSize };
      this.$emit('fetchListData', { ...parms })
    }
  },
  computed: {
    wtxyListDateTemplate: function () {
      this.tableData = this.formDateStr(this.wtxyList);
      return this.tableData
    }
  }
}
</script>