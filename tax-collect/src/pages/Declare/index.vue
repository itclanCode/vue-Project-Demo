<template>
  <div class="declare-container">
    <MenuTab :menu="menuItem" :defaultIndex="activeIndex" @handleTab="handleTab">
      <span slot='menu-rt' class="shenbao-date">申报期限: {{conversionTime(sbdate)}}</span>
    </MenuTab>
    <el-form :model="formParms" :rules="rules" ref="formParms" size="small" :inline="true" class="form-wrap">
      <div class='select-part'>
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <span class="plsb" @click="declarealls">
          <i class="el-icon-rep-shengchanshuliang"></i>
          批量申报
        </span>
      </div>
      <el-form-item prop="xycode" class="xycode" style="position:absolute;right:0;top:9px">
        <div class="search-code">
          <el-input placeholder="纳税人名称或统一社会信用代码" :value="formParms.xycode" v-model="formParms.xycode" class="xycode" @keydown.enter.native.prevent="searchName('formParms')"
          />
          <i class="el-icon-rep-xiazai5" @click="searchName('formParms')"></i>
        </div>
      </el-form-item>
    </el-form>
    <!-- <Declare :loading="loading" :tableData="tableData" :sbdate="sbdate" :defaultActive="activeIndex" 
    /> -->
    <div class="declare">
      <el-table ref="multipleTable" :data="tableData" border fit v-loading="loading" element-loading-text="正在加载数据" header-cell-class-name="headerBack"
        tooltip-effect="light" style="width: 100%" empty-text="暂无数据" slot="empty" :show-overflow-tooltip="true" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <!-- <el-table-column align="center" width="50" >
            <template slot-scope="scope">
              <el-checkbox  v-model="checkedNames[scope.row.djxh]" @change="handleCheckedIdChange(scope.row.djxh, $event)"></el-checkbox>
            </template>
          </el-table-column> -->
        <el-table-column prop="nsrmc" label="纳税人名称" align="center" width="180" />
        <el-table-column prop="bqynseZzs" label="一般增值税" align="center" />
        <el-table-column prop="mdseSum" label="免抵税额" align="center" />
        <el-table-column prop="bqybtseXfs" label="消费税" align="center" />
        <el-table-column prop="yjskSum" label="本期已缴税额" align="center" />
        <el-table-column prop="jmeSum" label="减免额" align="center" />
        <el-table-column prop="bqybtseSum" label="本期应补(退)税额" align="center" />
        <el-table-column label="操作" align="center" width="150" label-class-name="option">
          <template slot-scope="scope">
            <span @click="fallreason(scope.row.djxh)" v-if="activeIndex === '2'">失败原因&nbsp;/</span>
            <span v-if="activeIndex === '1' || activeIndex === '2'" @click="update(scope.row.djxh, activeIndex, sbdate)">修改报表</span>
            <span v-if="activeIndex === '3'" @click="update(scope.row.djxh, activeIndex, sbdate)">查看</span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog custom-class="fail-model" @close="closeModel" :visible.sync="dialogVisible" width="45%" center>
          <div class="title-header">
              失败原因
          </div>
          <ul class='mode-content'>
              <span>{{failreason}}</span>
              </li>
              </ul>
        <!-- <div>{{failreason}}</div> -->
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sure">确定</el-button>
          <el-button @click="back">返回</el-button>
        </span>
      </el-dialog>
    </div>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex"
      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
    </el-pagination>
  </div>
</template>

<script>
  // import { fincialMock } from '@/mock/mockData';
  import { DeclareRequest } from '@/services/request';
  import MenuTab from '@/components/MenuTab';
  import { formatDate } from '@/common/js/date';

  export default {
    components: { MenuTab },
    data() {
      let validatorName = (rule, value, callback) => {
        let regs = /^[0-9a-zA-Z]||[^\u4E00-\u9FA5]{1,20}$/;
        let regEn = /[`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]/im;
        let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        if (!regs.test(value)) {
          callback(new Error('只限20位长度的字母或者数字，请重新输入...'));
          rule.message = '只限20位长度的字母或者数字，请重新输入...';
        } else if (regEn.test(value) || regCn.test(value)) {
          callback(new Error('搜索名称不能包含特殊字符，请重新输入...'));
          rule.message = '搜索名称不能包含特殊字符，请重新输入....';
        } else {
          callback();
        }
      }
      return {
        sbdate: '',
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        loading: true,
        tableData: [],
        totalData: 0,
        failreason: '',
        activeIndex: '1',
        formParms: {
          xycode: '',
        },
        params: {},
        dialogVisible: false,
        multipleSelection: [],
        checkAll: false,
        // isIndeterminate: true,
        // checkarr: [],
        selected: [],
        par: {},
        rules: {
          xycode: [
            { validator: validatorName }
          ]
        },
        menuItem: [
          { idx: '1', name: '未申报', count: 0 },
          { idx: '2', name: '申报失败', count: 0 },
          { idx: '3', name: '已申报', count: 0 }
        ]
      }
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      // 格式化时间
      conversionTime: function (time) {
        return formatDate(new Date(Number(time)), 'yyyy年MM月dd日');
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        // this.selected = [...this.multipleSelection];
        this.fetchData();
      },
      fetchData() {
        this.params = {
          isDeclare: this.activeIndex,
          keyword: '',
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
        this.getdeclarelist({ ...this.params });
        // this.getDeCompanyList({ ...this.params });
      },
      // 获取附征税列表
      getdeclarelist(params) {
        this.loading = true;
        DeclareRequest.declarelist(params).then((res) => {
          const { data, totalCountMap } = res.data;
          console.log(res);
          if (res.code === 0) {
            this.loading = false;
            this.tableData = data;
            this.sbdate = res.data.ysbqx;
            if (totalCountMap === null) {
              totalCountMap.undeclared = 0;
              totalCountMap.declareFail = 0;
              totalCountMap.declareSuccess = 0;
            } else {
              this.menuItem.map(item => {
                switch (item.idx) {
                  case '1' : item.count = totalCountMap.undeclared; break;
                  case '2' : item.count = totalCountMap.declareFail; break;
                  case '3' : item.count = totalCountMap.declareSuccess; break;
                  default: ; break;
                }
                return item;
              })
              switch (this.activeIndex) {
                case '1' : this.totalPage = totalCountMap.undeclared; break;
                case '2' : this.totalPage = totalCountMap.declareFail; break;
                case '3' : this.totalPage = totalCountMap.declareSuccess; break;
                default: ; break;
              }
            }
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        }).catch((error) => {
          console.log(error);
        });
      },
       // mock获取附征税列表
      // getDeCompanyList(parms = {}) {
      //   this.loading = true;
      //   let config = { ...parms };
      //   fincialMock.getDeCompanyList(config).then((res) => {
      //     let { list, total, ysbqx } = res.data;
      //     if (res.code === 0) {
      //       this.loading = false;
      //       this.tableData = list;
      //       this.totalPage = total;
      //       this.sbdate = ysbqx;
      //     }
      //   }).catch((error) => {
      //     console.log(error);
      //   });
      // },
      // tab切换
      handleTab(tab) {
        this.activeIndex = tab;
        this.pageIndex = 1;
        this.pageSize = 10;
        this.totalPage = 0;
        this.fetchData();
      },
      // 查询
      searchName(formName) {
        if (this.formParms.xycode) {
          this.params = {
            isDeclare: this.activeIndex,
            keyword: this.formParms.xycode,
          }
          this.getdeclarelist({ ...this.params });
        } else if (this.formParms.xycode.length === 0) {
          this.fetchData();
        } else {
          this.formParms.xycode = '';
        }
      },
      // 修改报表
      update: function (id, activeIndex, sbdate) {
        // this.$router.push({ path: `Updated/${id}/${activeIndex}/${sbdate}` });
        this.$router.push({ name: 'Updated', params: { id: id, type: activeIndex } });
      },
      // 失败原因弹框
      fallreason(id) {
        this.dialogVisible = true;
        let parm = {
          'djxh': id,
          'ysbqx': this.sbdate
        }
        DeclareRequest.declarefail(parm).thehandleCheckAllChangen((res) => {
          if (res.code === 0) {
            this.failreason = res.data;
          }
        })
      },
      sure() {
        this.closeModel();
      },
      back() {
        this.closeModel();
      },
      closeModel() {
        this.dialogVisible = false;
      },
      // 复选框
      handleSelectionChange(val) {
        this.multipleSelection = val;
        // console.log(this.multipleSelection.length)
        // console.log([...this.selected, ...this.multipleSelection].length);
        // let newarr = new Set([...this.selected, ...this.multipleSelection])
        // console.log(newarr);
        this.checkAll = this.multipleSelection.length === this.tableData.length
      },
      // 全选
      handleCheckAllChange(val) {
        // 清除
        this.$refs.multipleTable.clearSelection();
        this.multipleSelection = [];
        let config = val ? this.tableData : []
        if (val) {
          this.tableData.map(item => {
            this.$refs.multipleTable.toggleRowSelection(item);
            return item;
          })
        } else {
          this.$refs.multipleTable.clearSelection();
        }
        this.handleSelectionChange(config);
      },
      // 批量申报
      declarealls: function() {
        this.$confirm(`您将对 <span style="color: #4680ff">${this.multipleSelection.length}</span> 
      位纳税人进行 <span style="color: #4680ff">批量申报</span> 操作，确定继续吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true
      })
      .then(() => {
        let checkarr = [];
        this.multipleSelection.map(item => {
          checkarr.push(item.djxh)
          return item;
        });
        this.par = {
          'djxh': checkarr,
          'isDeclare': this.activeIndex
        }
        console.log(this.par);
        DeclareRequest.declareall(this.par).then((res) => {
          console.log(res)
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '申报成功' + res.data.declareCount + '条'
            })
          } else {
            this.$message({
              type: 'error',
              message: '申报失败'
            })
          }
          this.fetchData();
          this.checkarr = [];
        }).catch((error) => {
          console.log(error);
        });
      })
      },
    }
  }
</script>

<style lang="stylus">
  @import './stylus/index.styl';
</style>