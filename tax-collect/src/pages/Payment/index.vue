<!-- Created by qintengbo on 2018/08/01. -->
<!-- 缴款模块，重构 -->

<template>
  <div class="payMent">
    <el-row>
      <el-col :span="24" class="header-col">
        <el-menu
          class="reportmenu"
          :default-active="activeIndex"
          mode="horizontal"
          active-text-color="#4680ff"
          @select="handleSelect">
          <el-menu-item index="1">未缴款 ({{ unpayNum }})</el-menu-item>
          <el-menu-item index="3">缴款失败 ({{ payFailNum }})</el-menu-item>
          <el-menu-item index="2">缴款成功 ({{ paySuccessNum }})</el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
    <section class="pay-section">
      <div class="headerCon clearfix">
        <header :class="{ 'inline1': status == 2 }">
          <el-select 
            @change="getPayList" 
            v-model="collection" 
            placeholder="征收项目"
            clearable
          >
            <el-option 
              v-for="(value, key) in filterMsg" 
              :key="key" 
              :label="value" 
              :value="key"
            >
            </el-option>
          </el-select>
          <div class="tipcon" v-if="status != 2">
            <span class="fir-tip">本次缴款金额： <span class="red">￥{{ amount }}</span></span>
            <span>应征税(费)总金额： <span class="red">￥{{ taxation }}</span></span>
          </div>
        </header>
        <div class="operation-con clearfix" :class="{ 'inline2': status == 2 }">
          <el-checkbox
            v-if="status != 2"
            v-model="allChecked"
            class="payment-checked"
            @change="toggleSelection(tableData)"
          >
            全选
          </el-checkbox>
          <el-button 
            v-if="status != 2" 
            class="paymentBtn" 
            @click="handlePay(2)" 
            type="primary"
          >
            <i class="el-icon-rep-jiaofei"></i> 
            批量缴款
          </el-button>
          <el-input 
            class="payment-input" 
            v-model="filterName"
            clearable
            @clear="getPayList"
            @keyup.enter.native="getPayList"
            placeholder="请输入纳税人名称或社会统一信用代码"
          >
            <i slot="suffix" @click="getPayList" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
      </div>
      <el-card v-loading="loading" element-loading-text="正在加载数据">
        <el-table
          ref="multipleTable"
          class="payTable"
          :data="tableData"
          border
          header-row-class-name="payment-table"
          :span-method="arraySpanMethod"
          :cell-style="cellStyle"
          :header-cell-style="headerCellStyle"
          @selection-change="handleSelectionChange"
        >
          <el-table-column 
            type="expand"
            fixed="right"
            v-if="status == 3"
          >
            <template slot-scope="scope">
              <el-form class="clearfix" label-position="left" inline>
                <span class="toggleText" @click="viewFail(scope.row)">收起 <i class="el-icon-arrow-up"></i></span>
                <div class="labelCon" v-for="item in scope.row.FAILRESONLIST">
                  <el-form-item label="">
                    <span><i class="el-icon-rep-yuandianxiao dialogTitle"></i> 操作时间：{{ item.date }}</span>
                  </el-form-item>
                  <el-form-item label="失败原因：" class="red">
                    <span>{{ item.reason }}</span>
                  </el-form-item>
                </div>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column v-if="status != 2" type="selection" :selectable="checkedDisabled"/>
          <el-table-column type="index" label="序号" width="50"/>
          <el-table-column prop="YZPZXH" label="凭证序号" width="180%"/>
          <el-table-column prop="NSRMC" label="纳税人名称"/>
          <el-table-column  
            label="征收项目"
          >
            <template slot-scope="scope">
              <div class="table-div" v-for="item in scope.row.PAYMENT">{{ item.ZSXM_MC }}</div>
            </template>
          </el-table-column>
          <el-table-column 
            label="税款属期起止" 
            width="200%"
          >
            <template slot-scope="scope">
              <div class="table-date" v-for="item in scope.row.PAYMENT">{{ item.SKSSQ }}</div>
            </template>
          </el-table-column>
          <el-table-column 
            prop="YBTSE" 
            label="应征税/费额 (元)" 
            width="140%"
          >
            <template slot-scope="scope">
              <div class="table-div" v-for="item in scope.row.PAYMENT">{{ item.YBTSE }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="TYPE" label="支付方式"/>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div v-if="status == 1">
                <el-button
                  type="text"
                  @click="handlePay(1, scope.row)"
                  :disabled="scope.row.SFXYH == '' || !scope.row.SFXYH"
                  v-loading.fullscreen.lock="screenLoading"
                  element-loading-text="正在为您缴款，请等待..."
                >
                  单户缴款
                </el-button>
              </div>
              <div v-if="status == 3">
                <el-button
                  type="text"
                  @click="viewFail(scope.row)"
                >
                  失败原因
                </el-button>
                <el-button
                  type="text"
                  @click="handlePay(1, scope.row)"
                  :disabled="scope.row.SFXYH == '' || !scope.row.SFXYH"
                  v-loading.fullscreen.lock="screenLoading"
                  element-loading-text="正在为您缴款，请等待..."
                >
                  重新缴款
                </el-button>
              </div>
              <div v-if="status == 2">
                <el-button
                  type="text"
                >
                  查看
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-row v-if="totalData != 0">
          <el-col :span="24">
            <el-pagination
              background
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper, sizes"
              @current-change="currentChange"
              :current-page="currentPage"
              @size-change="sizeChange"
              :total="totalData">
            </el-pagination>
          </el-col>
        </el-row>
      </el-card>

      <!-- 弹窗 -->
      <el-dialog
        width="30%"
        title="提示"
        :visible.sync="resDialogVisible"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <span>
          您本次缴款条目数为 <span class="dialogTitle">{{ allNum }}</span> 条，
          <span class="dialogTitle">{{successNum}}</span> 条缴款成功，
          <span class="dialogTitle">{{failNum}}</span> 条缴款失败，
          成功缴款金额 <span class="dialogTitle">{{ successAmount }}</span> 元
        </span>
        <div v-if="failNum != 0" class="dialogFailText" @click="lookFail">查看失败原因 <i class="el-icon-arrow-right"></i></div>
        <span slot="footer">
          <el-button @click="continuePay">返回</el-button>
        </span>
      </el-dialog>
    </section>
  </div>
</template>

<script>
import { declareRequest } from '@/services/request';

export default {
  data() {
    return {
      activeIndex: '1',
      amount: '0.00', // 缴款总金额
      taxation: '0.00', // 应征税(费)总金额
      allChecked: false, // 全选状态
      pageSize: 10, // 每页条数
      status: 1, // 状态
      unpayNum: 0, // 未缴款总数
      payFailNum: 0, // 缴款失败总数
      paySuccessNum: 0, // 缴款成功总数
      successAmount: 0, // 成功缴款金额
      allNum: 0,
      successNum: 0,
      failNum: 0,
      resDialogVisible: false,
      filterName: '', // 查询
      totalData: 0, // 数据总条数
      collection: '', // 征收项目
      loading: false, // 加载
      screenLoading: false, // 全屏加载
      multipleSelection: [], // 全选列表
      tableData: [], // 列表数据
      currentPage: 1, // 当前页
      filterMsg: {}, // 征收项目列表
    }
  },
  inject: ['reload'], // 接收App.vue传过来的刷新路由函数
  mounted() {
    // 页面刷新仍然停留在当前页面状态
    this.activeIndex = JSON.parse(sessionStorage.getItem('activePay'));
    if (!this.activeIndex) {
      this.activeIndex = '1';
    }
    this.status = this.activeIndex;
    this.getPayList();
  },
  methods: {
    // 获取列表数据
    getPayList: function() {
      this.loading = true;
      this.loadingText = '正在加载数据';
      let data = {
        page: this.currentPage,
        limit: this.pageSize,
        status: this.status,
        searchValue: this.filterName,
        sort: this.collection
      }
      declareRequest.getPayment(data).then(res => {
        this.loading = false;
        if (res.code === 0) {
          this.tableData = res.data.payment;
          this.filterMsg = res.data.zsxm_list;
          this.totalData = res.data.totalNum;
          this.unpayNum = res.data.UNPAY_NUM;
          this.payFailNum = res.data.PAYFAIL_NUM;
          this.paySuccessNum = res.data.PAYED_NUM;
          this.taxation = res.data.all_ybtse.toFixed(2);
        } else {
          window.Alert(res.msg);
        }
      });
    },
    // 缴款
    handlePay(type, data) {
      let text = '';
      if (type === 1) {
        text = `您将对 <span style="color: #4680ff">${data.NSRMC}</span> 进行 <span style="color: #4680ff">缴款</span> 操作`;
      } else {
        if (this.multipleSelection.length === 0) {
          return false;
        }
        text = `您将对 <span style="color: #4680ff">${this.multipleSelection.length}</span> 位纳税人进行 <span style="color: #4680ff">批量缴款</span> 操作`;
      }
      this.$confirm(`${text}，确定继续吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.screenLoading = true;
        this.resDialogVisible = false;
        const params = data || this.multipleSelection;
        declareRequest.payMent(params)
          .then(({ code, data, msg }) => {
            if (code === 0) {
              this.allNum = data.totalNum;
              this.successNum = data.successNum;
              this.failNum = data.failNum;
              this.successAmount = data.total_pay_amount;
            } else {
              window.Alert(msg);
            }
          })
          .finally(() => {
            this.screenLoading = false;
            this.resDialogVisible = true;
          });
      })
      .catch(() => { return false; });
    },
    // 切换状态
    handleSelect: function(index, indexPath) {
      this.loading = true;
      this.status = index;
      sessionStorage.setItem('activePay', JSON.stringify(index));
      this.currentPage = 1;
      this.pageSize = 10;
      this.allChecked = false;
      this.multipleSelection = [];
      this.tableData = [];
      this.getPayList();
    },
    // 分页
    currentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getPayList();
    },
    // 改变每页条数
    sizeChange: function(pageSize) {
      this.pageSize = pageSize;
      this.getPayList();
    },
    // 全选
    toggleSelection(rows) {
      if (this.allChecked) {
        this.$refs.multipleTable.clearSelection();
      }
      if (rows) {
        rows.forEach(row => {
          if (row.SFXYH && row.SFXYH !== '') {
            this.$refs.multipleTable.toggleRowSelection(row);
          }
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 表格选择多项
    handleSelectionChange(val) {
      let list = [];
      this.tableData.forEach(ele => {
        if (ele.SFXYH && ele.SFXYH !== '') {
          list.push(ele);
        }
      });
      if (val.length < list.length) {
        this.allChecked = false;
      } else {
        this.allChecked = true;
      }
      this.multipleSelection = val;
      // 选择的多项缴款金额总和
      this.amount = '0.00';
      this.multipleSelection.forEach(item => {
        item.PAYMENT.forEach(val => {
          this.amount = (Number(this.amount) + Number(val.YBTSE)).toFixed(2);
        });
      });
    },
    // 多选框只能在存在三方协议的状态下才能勾选
    checkedDisabled: function(row, index) {
      if (row.SFXYH && row.SFXYH !== '') {
        return true;
      } else {
        return false;
      }
    },
    // 返回
    continuePay: function() {
      this.resDialogVisible = false;
      this.isIE();
    },
    // 弹窗查看失败原因
    lookFail: function() {
      this.resDialogVisible = false;
      this.activeIndex = '3';
      sessionStorage.setItem('activePay', JSON.stringify(this.activeIndex));
      this.status = this.activeIndex;
      this.isIE();
    },
    // 列表查看失败原因
    viewFail: function(row) {
      this.$refs.multipleTable.toggleRowExpansion(row);
    },
    // 由于IE对this.reload()刷新不支持, 此处判断浏览器是否是IE
    isIE() {
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        this.$router.go(0);
      } else {
        this.reload();
      }
    },
    // 合并单元格
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 8 && this.status === '3') {
        return [1, 2];
      }
    },
    // 隐藏展开列
    cellStyle: function({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 8 && this.status === '3') {
        return {'z-index': 99};
      }
    },
    // 合并表头展开列
    headerCellStyle: function({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 8 && this.status === '3') {
        return {'border-right': 0, 'padding-left': '48px'};
      }
    }
  }
}
</script>

<style lang="stylus">
.payMent
  .el-menu--horizontal>.el-menu-item
    height 40px
    line-height 40px
  .reportmenu 
    background #f2f4f7 !important
    .el-menu-item:focus
    .el-menu-item:hover
      color #4680ff !important
      background transparent
  .header-col 
    position relative
  .pay-section
    margin-top 10px
    .headerCon
      text-align left
    header
      display flex
      justify-content space-between
    .fir-tip
      margin-right 30px
    .red
      color #F56C6C
    .tipcon
      height 32px
      line-height 32px
    .operation-con
      margin-top 20px
      text-align left
      .payment-checked
        margin-left 20px
        margin-right 10px
        color #999
      .paymentBtn
        padding 8px 10px
        border 1px solid #2770E9
        box-sizing border-box
        color #2770E9
        background #fff
    .payment-input
      float right 
      width 380px
      .el-input__inner
        border-radius 20px
        border 1px solid #999
    .nexPay
      padding 8px 0
    .el-card
      margin-top 15px
    .payTable
      margin-bottom 20px
    .payment-table th
      text-align center
      color #fff
      padding 10px 0
      background #4680FF
    .el-table td
      padding 0
    .el-table .cell
      padding 0
    .table-div
      border-bottom 1px solid #ebeef5
      height 45px
      line-height 45px
      box-sizing border-box
      &:last-child
        border-bottom 0
    .table-date
      border-bottom 1px solid #ebeef5
      box-sizing border-box
      white-space normal
      word-break break-all
      line-height 44px
      &:last-child
        border-bottom 0
    .el-table .zebra-row
      background #f5f7fa
    .dialogTitle
      color #4680FF
    .dialogFailText
      margin-top 10px
      color #D0021B
      cursor pointer
    .el-button+.el-button
      margin-left 0
    .el-button
      padding 8px 10px
  .inline1
    display inline-block !important
  .inline2
    margin-top 0 !important
    display inline-block !important
    float right
  .labelCon
    padding-left 20px
    text-align left
    .el-form-item
      margin-bottom 0
  .toggleText
    position absolute 
    top 10px
    right 10px
    color #409EFF
    cursor pointer
</style>
