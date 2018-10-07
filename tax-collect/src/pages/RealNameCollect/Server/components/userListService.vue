<template>
  <div class="listServer">
    <div class="tableContent">
      <div class="clearfix listServer-header">
        <span>税务代理人：<strong>{{personName}}</strong>　({{orgPosition ? orgPosition : '--'}})</span>
        <el-input 
          class="search" 
          v-model="searchTxt"
          @keyup.enter.native="querySearch(searchTxt)"
          placeholder="请输入内容"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="querySearch"></i>
        </el-input>
      </div>
      <el-table 
        ref='multipleTable'
        :data='tableData'
        @toggleRowSelection="toggleRowSelection"
        tooltip-effect='dark'
        @filter-change="filterChange"
        @selection-change='handleSelectionChange'
        border
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column 
          label='公司名称' 
          align='center' 
          prop="mandatorName"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column 
          align='center' 
          prop='socialCreditCode' 
          label='税号或身份证号码'
        >
        </el-table-column>
        <el-table-column 
          prop='contractSum' 
          align='center' 
          label='合同金额'
        >
        </el-table-column>
        <el-table-column 
          align='center' 
          label='服务时间起'
        >
          <template slot-scope='scope'>
            {{!scope.row.startDate ? '--' : formatDate(scope.row.startDate)}}
          </template>
        </el-table-column>
        <el-table-column 
          align='center' 
          label='服务时间止'
        >
          <template slot-scope='scope'>
            {{!scope.row.endDate ? '--' : formatDate(scope.row.endDate)}}
          </template>
        </el-table-column>
        <el-table-column 
          align='center' 
          label='代理事项' 
          show-overflow-tooltip
        >
          <template slot-scope='scope'>
            <span v-for="(item, idx) in scope.row.items" :key="idx">
              {{item}}
            </span>
          </template>
        </el-table-column>
        <el-table-column 
          v-if="userStatus" 
          label="操作" 
          align='center'
          >
          <template slot-scope="scope" v-if="!(scope.row.status === '提前终止' || scope.row.status === '终止')">
            <span @click="changeAgency(scope.row.id)" class="operation-scope">另分配</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="marginTop20">
        <el-pagination
          background
          @size-change='handleSizeChange'
          @current-change='handleCurrentChange'
          :current-page.sync='pageNum'
          :page-size='pageSize'
          layout='prev, pager, next, jumper'
          :total='total'>
        </el-pagination>
      </div>
      <el-dialog :visible.sync="otherAllocationModal.show" :width="'500px'">
        <div slot="title" class="wl-modal-title">
          <div class="text-center">
            <span>分配给其他代理人</span>
          </div>
        </div>
        <div class="text-center marginTop20">
          <p class="successAdd" style="font-size: 18px;">将 {{personName}} 的客户分配给：</p>
          <div class="marginTop20">
            <el-select v-model="otherAllocationModal.value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.orgAgentId"
                :label="item.personName" :value="item.orgAgentId">
              </el-option>
            </el-select>
          </div>
        </div>

        <div slot='footer' class='dialog-footer text-center'>
          <el-button type="primary" @click="submitChange" round>确 定</el-button>
          <el-button  @click='otherAllocationModal.show = false' round>取消</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>
<script>
import { formatDate } from '../../../../common/js/date.js';
import { serverRequest } from '@/services/request';
export default {
  name: 'userListSevice',
  data() {
    return {
      otherAllocationModal: {
        show: false,
        value: ''
      },
      searchTxt: '',
      tableChecked: true,
      page: 1,
      rows: 10,
      defaultOpen: ['2'],
      orgagentid: null,
      orgAgentId: null,
      delegationRelationId: null,
      mandatorName: '',
      personName: '',
      orgPosition: '',
      endRow: 2,
      firstPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      isFirstPage: true,
      isLastPage: true,
      lastPage: 1,
      navigateFirstPage: 1,
      navigateLastPage: 1,
      navigatePages: 8,
      navigatepageNums: [],
      nextPage: 0,
      pageNum: 1,
      pageSize: 1,
      pages: 1,
      prePage: 0,
      size: 2,
      startRow: 1,
      total: '',
      tableData: [], // 表格
      tableStatusList: [],
      keywords: '',
      status: '',
      multipleSelection: [],
      checked: false,
      centerDialogVisible: false,
      selectOptions: [],
      options: [], // 另分配
      optionsIds: [], // 选中的客户组
      value: '',
      userStatus: ''
    };
  },
  mounted() {
    let _this = this;
    this.orgAgentId = this.$route.query.orgAgentId;
    this.personName = this.$route.query.personName;
    this.orgPosition = this.$route.query.orgPosition;
    _this.getListData();
    serverRequest.userListStatusList()
      .then(function(res) {
        if (res.length) {
          res.forEach(function(d, i) {
            _this.tableStatusList.push({value: d.code, text: d.name})
          })
        }
      })
  },
  methods: {
    getListData () {
      let _this = this;
      serverRequest.protocol(this.orgAgentId, 1, 8)
        .then(function (res) {
          let _data = res.data;
          _this.userStatus = _data.list[0].agentStatus;
          _this.pageNum = _data.page;
          _this.pageSize = _data.pageSize;
          _this.total = _data.total;
          _this.tableData = _data.list;
        });
    },
    toggleRowSelection(row) {
    },
    otherAllocation() {
      this.otherAllocationModal.show = true;
    },
    // 刷选状态
    filterChange(value) {
      let _this = this;
      let _val;
      for (let j in value) {
        _val = value[j]['0']
      }
      serverRequest.protocol(this.orgAgentId, 1, 8, '', _val)
        .then(function (res) {
          let _data = res.data;
          _this.pageNum = _data.page;
          _this.pageSize = _data.pageSize;
          _this.total = _data.total;
          _this.tableData = _data.list;
        })
    },
    // 搜索
    querySearch(val) {
      let _this = this;
      serverRequest.protocol(this.orgAgentId, 1, 8, val)
        .then(function (res) {
          let _data = res.data;
          _this.pageNum = _data.page;
          _this.pageSize = _data.pageSize;
          _this.total = _data.total;
          _this.tableData = _data.list;
        })
    },
    // 表格自带的全选
    handleSelectionChange(val) {
      val.length ? this.tableChecked = false : this.tableChecked = true;
      let _this = this;
      _this.selectOptions = _this.$refs.multipleTable.store.states.selection;
      this.multipleSelection = val;
      if (this.$refs.multipleTable.store.states.isAllSelected) {
        this.checked = false;
      } else {
        // this.checked = true;
        if (this.multipleSelection.length === this.tableData.length) {
          this.checked = true;
        } else {
          this.checked = false;
        }
      }
    },
    // 开关指定选项
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 手动全选
    setAll() {
      // 判断全选按钮是否选中
      if (this.$refs.multipleTable.store.states.isAllSelected) {
        this.toggleSelection();
        this.checked = false;
      } else {
        this.toggleSelection();
        this.toggleSelection(this.tableData);
      }
    },
    // 另分配的弹窗
    changeAgency(id) {
      let _this = this;
      this.otherAllocationModal.show = true;
      this.selectOptions.push(id);
      serverRequest.distributionAllModal()
        .then(function(res) {
          _this.options = res.data;
          _this.options.forEach(function(d, i) {
            if (_this.orgAgentId === d.orgAgentId) {
              _this.options.splice(i, 1);
            }
          })
        })
    },
    submitChange() {
      let _this = this;
      if (!_this.otherAllocationModal.value) {
        _this.$message.error('请选择一个人员，才能进行分配');
      }
      let _saveObj = {
        orgAgentId: _this.otherAllocationModal.value,
        ids: []
      };
      let _saveOptions = [];
      if (_this.selectOptions.length) {
        _this.selectOptions.map(function(d) {
          _saveOptions.push(d)
        })
      }
      _saveObj.ids = _saveOptions
      serverRequest.distributionOk(_saveObj)
        .then(function(res) {
          _this.getListData();
        });
      _this.otherAllocationModal.show = false
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 分頁
    handleCurrentChange(val) {
      this.pageNum = val;
      let that = this
      if (!this.pageSize) {
        this.pageSize = 10
      }
      serverRequest.filtertTaxorgAgent(this.orgAgentId, this.status, this.keywords, val, this.pageSize).then(
        data => {
          if (data.data.page !== 0) {
            // that.pageNum = data.data.page;
            that.pageSize = data.data.pageSize;
            that.total = data.data.total;
            that.tableData = data.data.list;
            for (var i in that.tableData) {
              if (that.tableData[i].finishStatus === 0) {
                that.tableData[i].finishStatus = '未完成'
              } else if (that.tableData[i].finishStatus === 1) {
                that.tableData[i].finishStatus = '完成'
              }
              that.mandatorName = that.tableData[i].mandatorName;
              that.delegationRelationId = that.tableData[i].delegationRelationId
              that.tableData[i].serviceItems = that.tableData[i].serviceItems.join('、');
            }
          }
        }
      );
    },
    // 格式化时间
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd');
    }
  }
};
</script>
<style lang='stylus' rel='stylesheet/stylus'>
@import '../style/index.styl';
.listServer
  .tableContent
    background #f2f4f7
    text-align center
  .search
    margin-left 20px
    float right
    width 320px
    .el-input__inner
      border-radius 20px
      border 1px solid #999
  .listServer-header
    margin-bottom 10px
    text-align left
    height 32px
    line-height 32px
  .el-table th
    background #E5F0FF
    height 40px
    line-height 40px
    color #000
  .el-table td
    height 40px 
    line-height 40px
    color #333
    a 
      color #4680ff
  .operation-scope
    color #4680ff
    cursor pointer
</style>

