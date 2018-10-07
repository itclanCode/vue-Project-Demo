<template>
  <div class="updatecontainer"  v-loading="loading" element-loading-text="正在加载数据">
    <div v-for="(item, id) in detailtable" :key=id >
    <div class="mod-top">
      <p class="mod-top-title">附加税(费)申报表明细</p>
      <div class="mod-list">
        <p>
          <span>纳税人名称:</span>
          <span>{{item.nsrmc}}</span>
        </p>
        <p>
          <span>税款所属期:</span>
          <span>{{item.skssqq}}</span>
          <span>至</span>
          <span>{{item.skssqz}}</span>
        </p>
      </div>
      <div class="mod-list">
        <p>
          <span>统一社会信用代码</span>
          <span>{{item.socialCreditCode}}</span>
        </p>
        <p>
          <span>金额单位: </span>
          <span>RMB 元(列至角分)</span>
        </p>
      </div>
    </div>
    <div class="table-container" >
      <el-table 
      header-cell-class-name="reportRow"
      row-class-name="reportColumn"
      :data="item.baseSurtaxDetailList" 
      show-summary 
      :summary-method="getSum"
      :default-sort="{prop: 'bqynseZzs', order: 'descending'}"
      style="border: #d8d0d03b">
        <el-table-column prop="zspmName" label="征税名目" width="150"  align="center"  />
        <el-table-column label="增值税" width="200" align="center" >
          <el-table-column prop="bqynseZzs" label="一般增值税" sortable align="center" />
          <el-table-column prop="mdse" label="免抵税额" align="center" />
        </el-table-column>
        <el-table-column prop="bqybtseXfs" label="消费税" align="center" />
        <el-table-column prop="sl" label="税率" align="center">
            <template slot-scope="scope">
                <p>{{parseInt(scope.row.sl*100)}}%</p>
              </template>
        </el-table-column>
        <el-table-column prop="bqynse" label="本期应纳税额" align="center"/>
        <el-table-column prop="bqyjsk" label="本期已缴税(费)额" align="center" />
        <el-table-column prop="jmxzDm" label="减免性质代码" align="center">
          <template slot-scope="scope">
              <el-select v-model="scope.row.jmxzDm" placeholder="其他"  v-if="scope.row.jme > 0">
                  <el-option label="重点群体从事个体经营扣减增值税优惠" value="重点群体从事个体经营扣减增值税优惠"></el-option>
                </el-select>
                <el-select v-model="scope.row.jmxzDm"  placeholder="其他" :disabled="true" v-else>
                    <el-option label="0099129999 " value="0099129999 "></el-option>
                  </el-select>
            </template>
        </el-table-column>
        <el-table-column prop="jme" label="减免额" align="center">
          <template slot-scope="scope">
              <p v-if="defaultActive === '3'">{{scope.row.jme}}</p>
              <el-input v-model="scope.row.jme"  @change="selectChange(scope.$index, scope.row)" v-else />
            </template>
        </el-table-column>
        <el-table-column prop="bqybtse" label="本期应补(退)税(费)额" align="center" />
      </el-table>
      <!-- <div v-if="defaultActive === '3'" class="marginTop20">
          <el-button type="primary">返回</el-button>
        </div> -->
        <div class="marginTop20">
          <el-button type="primary" @click="declare" v-if="defaultActive != '3'" :disabled="editdisabled">申报</el-button>
          <el-button type="primary" style="margin-left: 20px" @click="editsave" :disabled="editdisabled" v-if="defaultActive != '3'">保存</el-button>
          <el-button style="margin-left: 20px" @click="back">返回</el-button>
        </div>
    </div>
  </div>
  </div>
</template>

<script>
  // import { fincialMock } from '@/mock/mockData'
  import { DeclareRequest } from '@/services/request';
  export default {
    name: 'updatecontainer',
    data() {
      return {
        loading: true,
        detailtable: [],
        defaultActive: this.$route.params.type,
        djxh: this.$route.params.id,
        // ysbqx: this.$route.params.date,
        xzdm: '',
        params: {},
        editdisabled: false
      }
    },
    mounted() {
      this.getDetails();
    },
    methods: {
      // getDetail() {
      //   let id = this.$route.params.id;
      //   fincialMock.getDeclareDetail(id).then((res) => {
      //     console.log(res.data.list);
      //     if (res.code === 0) {
      //       this.detailtable = res.data.list;
      //     }
      //   }).catch((error) => {
      //     console.log(error);
      //   })
      // },
      getDetails() {
        this.loading = true
        this.params = {
          isDeclare: this.defaultActive,
          djxh: this.djxh
        }
        DeclareRequest.declaredetail(this.params).then((res) => {
          this.loading = false
          console.log(res.data.list);
          if (res.code === 0) {
            this.detailtable = res.data.list;
          }
        }).catch((error) => {
          console.log(error);
        })
      },
      // 减免额改变减免性质代码
      selectChange(index, row) {
        // if (row.jme <= 0) {
        //   row.jmxzDm = '';
        // } else {
        //   row.jmxzDm = '0099129999';
        // }
        row.bqybtse = parseInt(row.bqynse) - parseInt(row.bqyjsk) - parseInt(row.jme)
        if (row.bqybtse < 0) {
          this.$message({
            type: 'error',
            message: '请重新输入!'
          });
          this.editdisabled = true
        } else {
          this.editdisabled = false
        }
      },
     // 合计
      getSum(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => { // 这步是为了让最后一行出现 合计 这一行，并且最后一行第一列出现 合计 二字。合计的字可以在这里更改
          if (index === 0) {
            sums[index] = '合计';
          } else if (index === 5 || index === 6 || index === 8 || index === 9) {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] = sums[index].toFixed(2);
            }
          } else {
            sums[index] = '--';
          }
        })
        return sums
      },
      // 修改保存
      editsave() {
        let update = {};
        this.editdisabled = false
        this.detailtable.map(item => {
          update.baseSurtaxDetailList = item.baseSurtaxDetailList;
          update.djxh = item.djxh;
          update.skssqq = item.skssqq;
          update.skssqz = item.skssqz;
          update.socialCreditCode = item.socialCreditCode;
          // update.ysbqx = this.ysbqx;
          DeclareRequest.declareupdate(update).then((res) => {
            console.log(res);
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            } else {
              this.$message({
                type: 'error',
                message: '修改失败'
              })
            }
          }).catch((error) => {
            console.log(error);
          })
        })
      },
      // 申报
      declare() {
        let declare = {};
        this.detailtable.map(item => {
          declare.baseSurtaxDetailList = item.baseSurtaxDetailList;
          declare.djxh = item.djxh;
          declare.skssqq = item.skssqq;
          declare.skssqz = item.skssqz;
          declare.socialCreditCode = item.socialCreditCode;
          // declare.ysbqx = this.ysbqx;
        })
        DeclareRequest.declare(declare).then((res) => {
          console.log(res);
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '申报成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '申报失败'
            })
          }
        }).catch((error) => {
          console.log(error);
        })
      },
      back() {
        this.$router.push({ path: '/Declare' });
      }
    },
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" >
  /* @import './stylus/index.styl'; */
.updatecontainer 
  .mod-top 
    width 100%
    height 100%
    overflow hidden
    .mod-top-title 
      text-align center
      color #111
      font-weight bold
      font-size 18px
      padding 10px 0px
    .modify-item-project 
      text-align left
      padding 10px 0
      font-weight bold
      color #111
    .mod-list 
      width 100%
      overflow hidden
      padding 10px 0
      &:last-child 
        border-bottom 1px solid #ebd6d6
      p 
        &:first-child 
          float left
        &:last-child 
          float right
        span:nth-of-type(2n) 
          font-weight bold
          color #111 
  .table-container 
    width 100%
    height 100%
    margin-bottom 12px
    text-align center
    clear both
    overflow hidden
    .reportRow 
      height 30px
      overflow hidden
      background #5c8fff
      color #fff 
      line-height 30px
      border 1px solid #d8d0d03b
    .reportColumn
      line-height 64px
      height 64px
      background #f2f4f7
</style>