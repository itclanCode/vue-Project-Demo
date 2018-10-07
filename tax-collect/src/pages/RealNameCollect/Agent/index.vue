<template>
  <div class='agentIndex'>
    <!--主体内容-->
    <div class="header">
      <el-button class="addBtn" type="primary" @click="handleAdd()">添加委托代理关系</el-button>
      <el-input 
        v-if="dataList.length !== 0"
        class="search" 
        v-model="searchInput"
        @blur="searchInputs"
        @keyup.enter.native="searchs()"
        placeholder="请输入客户名称"
      >
        <i slot="suffix" @click="searchInputs" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <!--表格内容-->
    <div class="tableList">
      <table class="ac table_list">
        <tr class="table_title">
          <th class="w30p">客户名称</th>
          <th class="w14p">税号或身份证号码</th>
          <!--<th>订单编号</th>-->
          <th class="w14p">合同金额(元)</th>
          <!--<th>合同</th>-->
          <th class="w14p">服务时间起</th>
          <th class="w14p">服务时间止</th>
          <!-- <th>
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                状态<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="">全部</el-dropdown-item>
                <el-dropdown-item command="01">正常</el-dropdown-item>
                <el-dropdown-item command="03">终止</el-dropdown-item>
                <el-dropdown-item command="02">提前终止</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </th> -->
          <th class="w14p">操作</th>
        </tr>
        <tr v-if="dataList.length === 0"><td class="noData" colspan="6">暂无数据</td></tr>
        <tr v-for="(item, key) in dataList" :key="key" class="dataTr">
          <td class="w30p"> <router-link :to="{path:'/checkAgent', query:{protocolId: item.protocolId}}" class="companyName">{{item.mandatorName}}</router-link></td>
          <td class="w14p">{{item.identificationNumber}}</td>
          <!--<td><span v-if="item.orderNumber==0">&#45;&#45;</span><span v-else class="colorBl"><router-link :to="{path: '/orderDetail',query:{orderId: item.orderId}}" class="colorBl">{{item.orderNumber}}</router-link></span></td>-->
          <td class="w14p"><span>{{item.contractSum}}</span></td>
          <!--<td><span v-if="item.contractAttachId==0">&#45;&#45;</span><span v-else class="colorBl">-->
            <!--<a :href="getUrl(item.delegationRelationId,item.contractAttachId,token)"-->
                <!--class="colorBl">合同</a></span></td>-->
          <td class="w14p"><span v-if="item.startDate==undefined||item.startDate==''">--</span><span v-else>{{item.startDate | formatDate}}</span></td>
          <td class="w14p"><span v-if="item.endDate==undefined||item.endDate==''">--</span><span v-else :class="comDate(item.endDate,today)===true?'colorRed':''">{{item.endDate | formatDate}}</span></td>
          <!-- <td>{{item.status}}</td> -->
          <td class="w14p">
            <span v-show="item.status=='正常'">
              <router-link  :to="{path:'/editAgent', query: {delegationRelationId:item.protocolId, financeMobilePhone: item.financeMobilePhone}}" class="colorBl" >变更</router-link>
              <router-link :to="{path:'/endAgent', query:{delegationRelationId: item.protocolId}}" class="colorBl marginLeft20" >终止</router-link>
            </span>
            </td>
        </tr>
      </table>
      <div class="ar marginRight50 paddingBottom30">
      <!--分页-->
        <el-pagination
        v-if="dataList.length !==0"
          background
          layout="prev, pager, next,jumper"
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :total="pages">
        </el-pagination>
      </div>
    </div>
    <!--分配委托事项-->
    <el-dialog title="移除客户" :visible.sync="dialogTableVisible"  center :show-close='showClose' class="dialog_1">
      <p class="ac paddingTop30 paddingBottom20 fontSize16">确认移除如下客户?</p>
      <p class="ac fontSize16"><span class="displayIn w200 ar">客户名称:</span><span class="displayIn w200 al paddingLeft20">百度有限科技</span></p>
      <p class="ac fontSize16"><span class="displayIn w200 ar">税号或身份证号码:</span><span class="displayIn w200 al paddingLeft20">10230354334353345</span></p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="delSure()">确 定</el-button>
          <el-button @click="dialogTableVisible = false">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  import {formatDate} from '@/common/js/date.js'
  import { agentRequest } from '@/services/request';
  export default {
    data: function () {
      return {
        pageSize: 10,
        pages: 1,
        val: 1,
        today: Date.parse(new Date()),
        defaultOpen: ['2'],
        dialogTableVisible: false,
        showClose: false,
        dataList: [],
        delegationRelationId: '',
        url: '',
        searchInput: '',
        token: '',
        dataStatus: '',
      }
    },
    created: function() {
      this.getInit(1, this.pageSize, this.searchInput, this.dataStatus);
      this.token = window.localStorage.getItem('token');
      agentRequest.getOrgStatus().then(data => {
        if (data.code === 0) {
          if (data.data.serviceStatus === false) {
            let btn = document.getElementsByClassName('add_btn');
            btn[0].classList.add('change_add_btn');
          }
        }
      })
    },
    methods: {
      handleCommand(command) {
        console.log(typeof (command), 'status')
        this.getInit(1, this.pageSize, this.searchInput, command);
      },
      handleAdd() {
        agentRequest.getOrgStatus().then(data => {
          if (data.code === 0) {
            if (data.data.serviceStatus === true) {
              this.$router.push('/addAgent')
            }
          }
        })
      },
      delSure() {
        agentRequest.delDelegation(this.delegationRelationId).then((data) => {
          if (data.result === 'ok') {
            this.dialogTableVisible = false;
            this.getInit(this.val, this.pageSize, this.searchInput, this.dataStatus);
          }
        })
      },
      del(id) {
        this.dialogTableVisible = true;
        this.delegationRelationId = id;
      },
      searchs() {
        this.getInit(1, this.pageSize, this.searchInput, this.dataStatus);
        this.pages = 1;
      },
      searchInputs() {
        this.getInit(1, this.pageSize, this.searchInput, this.dataStatus);
        this.pages = 1;
      },
      getUrl(delegationRelationId, contractAttachId, token) {
        token = window.localStorage.token;
        return agentRequest.getUrl(delegationRelationId, contractAttachId, token);
      },
      handleCurrentChange(val) {
        this.val = val;
        this.getInit(val, this.pageSize, this.searchInput, this.dataStatus);
      },
      getInit(pageNum, pageSize, keyword, status) {
        agentRequest.getProtocol(pageNum, pageSize, keyword, status).then((data) => {
          this.dataList = data.data.list;
          this.dataList.map(function(item) {
            agentRequest.getStatus().then((data) => {
              data.map(function(i) {
                if (i.code === item.status) {
                  item.status = i.name;
                }
              });
            })
          })
          this.pageSize = data.data.pageSize;
          this.pages = Number(data.data.pages) * 10;
        })
      },
      comDate(date1, date2) {
        date1 = parseInt(date1);
        date2 = parseInt(date2);
        var oDate1 = new Date(date1);
        var oDate2 = new Date(date2);
        if (oDate1.getTime() > oDate2.getTime()) {
          return false
        } else {
          return true;
        }
      }
    },
    filters: {
      formatDate (time) {
        time = parseInt(time);
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      }
    },
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './style/index.styl';
</style>
<style lang="stylus" rel="stylesheet/stylus">
.agentIndex
  .header 
    margin-bottom 15px
    text-align right
  .addBtn
    margin-right 20px
  .search
    width 320px
    .el-input__inner
      border-radius 20px
      border 1px solid #999
  .paddingBottom30
    padding-bottom 30px
  .maincontent{
    padding:0 46px 0 33px;
    overflow-x: hidden;
  }
  .noData
    text-align center!important
  .change_add_btn
    background-color gray!important
    border-color gray
    font-size 16px
    cursor default!important
  .add_btn
    width:174px;
    height:27px;
    line-height:27px;
    color:#fefefe;
    text-align:center;
    background-color:#4680ff;
    letter-spacing: 2px;
    display: inline-block;
    border-radius 13px
    font-size 16px
    letter-spacing 1px
    margin-top 10px
    margin-right 12px
    cursor pointer
    a
      width: 100%;
      display: inline-block;
      height: 100%;
  .dialog_1 .el-dialog--center .el-dialog__header{
    padding:0px;
    background:#169bd4;
    height:50px;
    line-height:50px;
  }
  .dialog_1 .el-dialog__title{
    color:#fff;
  }
  .search_input{
    width: 162px;
    height: 27px;
    text-align:center;
    line-height: 27px;
    background: #f2f4f7;
    border:1px solid #999;
    border-radius 13px
  }
  .tableList {
    background:#fff;
    text-align: center;
    padding 0 16px
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  .table_list tr:first-child{
    border-bottom: 1px solid #c5c5c5;
  }
  .table_list
    font-size 14px
    color #333
    margin-bottom 13px
    width: 100%
    tr
      th
        color #000
        text-align left
        font-weight 700
      td
        text-align left
      th:nth-child(3),td:nth-child(3)
        text-align right
        padding-right 3%
      th:nth-child(4),td:nth-child(4)
        padding-left 3%
  .table_list tr 
    height 45px
    line-height 45px
  .companyName 
    color #000
    &:hover 
      color #4680ff
  .dataTr
    height 40px !important
    line-height 40px !important
</style>

