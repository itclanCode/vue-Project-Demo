<template>
  <div class='inService'>
    <div class="operationCon">
      <router-link to='/addService'>
        <el-button type='primary' @click='centerDialogVisible1 = true'>添加税务代理人</el-button>
      </router-link>
      <el-input 
        class="search" 
        v-model="searchTxt"
        @keyup.enter.native="querySearch(searchTxt)"
        placeholder="请输入人员姓名"
      >
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <el-row class='cardCon' :gutter="20">
      <el-col :xl="4" :lg="6" :md="8" v-for='(item, key) in list' :key='key'>
        <el-card>
          <div slot="header">
            <router-link :to="{path: '/peopleInformationService', query: {orgAgentId: item.orgAgentId, onJob: true}}">
              <span class="cart-title-name">{{item.personName || "测试"}}</span>
              <span class="gender">({{item.sex ? '男' : '女'}})</span>
            </router-link>
            <span class="pull-right">
              <router-link :to="{path: '/addService', query: {orgAgentId: item.orgAgentId}}">
                <el-tooltip effect="light" content="编辑" placement="top">
                  <i class="el-icon-edit-outline itemIcon"></i>
                </el-tooltip>
              </router-link>
              <el-tooltip effect="light" content="离职" placement="top">
                <i class="el-icon-rep-lizhi itemIcon" @click='remove(item.orgAgentId)'></i>
              </el-tooltip>
              <router-link :to="{path:'/userListService', query: {orgAgentId: item.orgAgentId,orgPosition: item.orgPosition,personName: item.personName, userStatus: 1}}">
                <el-tooltip effect="light" content="客户管理" placement="top">
                  <i class="el-icon-rep-kehuguanli itemIcon"></i>
                </el-tooltip>
              </router-link>
            </span>
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
      @size-change='handleSizeChange'
      @current-change='handleCurrentChange'
      :current-page.sync='pageNum'
      :page-size='pageSize'
      layout='prev, pager, next, jumper'
      :total='total'
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
      personName: '',
      orgPosition: '',
      orgAgentId: null,
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
      ],
      pageNum: 2,
      navigatePages: 8,
      navigateFirstPage: 1,
      total: 1,
      pages: 1,
      firstPage: 1,
      size: 1,
      isLastPage: true,
      hasPreviousPage: false,
      navigateLastPage: 1,
      isFirstPage: true
    }
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  mounted () {
    let page = this.page;
    let rows = this.rows;
    serverRequest.getDismissionAgents(this.searchTxt, 1, page, rows).then(data => {
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
  methods: {
    // 刷新
    refresh() {
      serverRequest.getDismissionAgents(this.searchTxt, 1, this.page, this.rows).then(data => {
        this.list = data.data.list;
        this.pageNum = data.data.pageNum;
        this.pageSize = data.data.pageSize;
        this.total = data.data.total;
        for (var i in this.list) {
          this.orgPosition = this.list[i].orgPosition;
          this.personName = this.list[i].personName
        }
      })
    },
    // 解除雇佣关系
    remove(orgAgentId) {
      let that = this;
      this.$confirm('此操作将永久解除雇佣关系, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'delServer',
        confirmButtonClass: 'confirmBtn',
        cancelButtonClass: 'cancelBtn',
        center: true
      }).then(() => {
        serverRequest.isHasUnfinishedServiceItem(orgAgentId).then(data => {
          if (data.code === 0) {
            this.$message({
              type: 'success',
              message: '解除雇佣关系成功!'
            });
            serverRequest.getDismissionAgents(this.searchTxt, 1, that.pageNum, that.pageSize).then(data => {
              if (data.data.pageNum !== 0) {
                that.list = data.data.list;
                that.pageNum = data.data.pageNum;
                that.pageSize = data.data.pageSize;
                that.total = data.data.total;
                for (var i in that.list) {
                  that.orgPosition = that.list[i].orgPosition
                  that.personName = that.list[i].personName
                }
              }
            })
          } else if (data.code === 4208) {
            this.$alert('您的机构类型是税务师事务所, 离职三师人员信息需要到柜台先办理税务师事务所行政登记变更!', '', {
              confirmButtonText: '确定'
            })
          } else if (data.code === 4210) {
            this.$alert('该税务代理人仍有未完成服务项目, 请另分配再解除雇佣关系!', '', {
              confirmButtonText: '确定'
            })
          } else {
            this.$message.error('解除失败');
          }
        })
      })
    },
    // 搜索
    querySearch(val) {
      let that = this;
      serverRequest.getDismissionAgents(this.searchTxt, 1, this.pageNum, this.pageSize).then(data => {
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
      let that = this;
      this.pageNum = val;
      serverRequest.getDismissionAgents(this.searchTxt, 1, this.pageNum, this.pageSize).then(data => {
        if (data.data.pageNum !== 0) {
          that.list = data.data.list;
          that.pageNum = data.data.pageNum;
          that.pageSize = data.data.pageSize;
          that.total = data.data.total;
        }
      })
    }
  }
}
</script>
<style lang='stylus' rel='stylesheet/stylus'>
  @import '../style/inService.styl'
</style>
