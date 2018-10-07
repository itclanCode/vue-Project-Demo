<template>
  <div class="dimission">
    <div class="operationCon">
      <el-input 
        class="search" 
        v-model="searchTxt"
        @keyup.enter.native="querySearch"
        placeholder="请输入人员姓名"
      >
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <el-row class='cardCon' :gutter="20">
      <el-col :xl="4" :lg="6" :md="8" v-for='(item, key) in list' :key='key'>
        <el-card>
          <div slot="header">
            <router-link :to="{path: '/peopleInformationService', query: {orgAgentId: item.orgAgentId, onJob: false}}">
              <span class="cart-title-name">{{item.personName || "测试"}}</span>
              <span class="gender">({{item.sex ? '男' : '女'}})</span>
            </router-link>
            <span class="pull-right lz">已离职</span>
          </div>
          <div class="card-content">
            <el-row class="span-mr20">
              <el-col :span="12">
                <a href="javascript:void(0);" :title="item.orgPosition || '--'">{{item.orgPosition || '--'}}</a>
              </el-col>
              <el-col :span="12">
                <a href="javascript:void(0);" :title="item.education || '--'">{{item.education || '--'}}</a>
              </el-col>
            </el-row>
            <div class="marginTop15">
              <span>移动电话：</span>
              <span>{{item.mobilePhone}}</span>
            </div>
            <div class="marginTop15">
              <span>录入时间：</span>
              <span>{{item.entryDate | formatDate}}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageNum"
      :page-size="pageSize"
      layout="prev, pager, next, jumper"
      :total="total"
      >
    </el-pagination>
  </div>
</template>
<script>
import { serverRequest } from '@/services/request';
import {formatDate} from '@/common/js/date.js';
export default {
  data () {
    return {
      searchTxt: '',
      page: 1,
      rows: 10,
      lastPage: 1,
      navigatepageNums: [1],
      startRow: 1,
      hasNextPage: false,
      prePage: 0,
      nextPage: 0,
      endRow: 1,
      pageSize: 10,
      list: [
//        {
//          personName: '',
//          mobilePhone: '',
//          taxServiceTime: 2,
//          photo: '1',
//          orderSum: 1,
//          sex: 0,
//          orgAgentId: 4,
//          orgPosition: '普通人'
//        }
      ],
      pageNum: 1,
      navigatePages: 8,
      navigateFirstPage: 1,
      total: 1,
      pages: 1,
      firstPage: 1,
      size: 1,
      isLastPage: true,
      hasPreviousPage: false,
      navigateLastPage: 1,
      isFirstPage: true,
      updateList: false
    }
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  mounted () {
  },
  methods: {
    // 刷新
    refresh() {
      serverRequest.getDismissionAgents(this.searchTxt, 0, this.page, this.rows).then(data => {
        this.list = data.data.list;
        this.pageNum = data.data.pageNum;
        this.pageSize = data.data.pageSize;
        this.total = data.data.total;
        for (var i in this.list) {
          this.orgPosition = this.list[i].orgPosition
          this.personName = this.list[i].personName
        }
      })
    },
    // 搜索
    querySearch(val) {
      let that = this;
      serverRequest.getDismissionAgents(this.searchTxt, 0, this.pageNum, this.pageSize).then(data => {
        that.list = data.data.list;
        that.pageNum = data.data.pageNum;
        that.pageSize = data.data.pageSize;
        that.total = data.data.total;
      })
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      serverRequest.getDismissionAgents(this.searchTxt, 0, this.pageNum, this.pageSize).then(data => {
        if (data.data.pageNum !== 0) {
          this.list = data.data.list;
          this.pageNum = data.data.pageNum;
          this.pageSize = data.data.pageSize;
          this.total = data.data.total;
        }
      })
    }
//    previous(item) {
//      this.$router.push(
//        {
//          name: 'userListService',
//          params: {
//            orgAgentId: item.orgAgentId,
//            orgPosition: item.orgPosition,
//            personName: item.personName,
//            userStatus: 0}})
//    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '../style/dimission.styl'
</style>
