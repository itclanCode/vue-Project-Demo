<template>
  <div>
    <el-button type="text" @click="dialogTableVisible = true">修改报表</el-button>
    <el-dialog
      title="附加税(费)申报表明细"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :close-on-click-escape="false"
      center
      width="85%"
    >
      <div class="company-detail">
        <div class="company-column">
          <div>纳税人名称: {{report.name}}</div>
          <div>申报属期限: {{report.startTime}} 至 {{report.endTime}}</div>
        </div>
        <div class="company-column">
          <div>社会统一信用代码: {{report.id}}</div>
          <div>金额单位: RMB 元(列至角分)</div>
        </div>
      </div>
      <el-table
        header-row-class-name="detail-table"
        :data="detail"
        show-summary
        :summary-method="figure"
        style="margin: 20px 0;text-align: center"
      >
        <el-table-column prop="desc" label="征税名目" width="150"/>
        <el-table-column label="增值税" width="200">
          <el-table-column prop="aa" label="一般增值税">
            <template slot-scope="scope">
              <el-input v-model="scope.row.aa"/>
            </template>
          </el-table-column>
          <el-table-column prop="bb" label="免抵税额">
            <template slot-scope="scope">
              <el-input v-model="scope.row.bb"/>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="aa" label="消费税"/>
        <el-table-column prop="bb" label="税率"/>
        <el-table-column prop="cc" label="本期应纳税额"/>
        <el-table-column prop="dd" label="本期已缴税(费)额"/>
        <el-table-column prop="ee" label="减免性质代码"/>
        <el-table-column prop="ff" label="减免额"/>
        <el-table-column prop="aa" label="本期应补(退)税(费)额"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="handleDeclare">申报</el-button>
        <el-button type="info" @click="tempStorage">暂存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      report: Object,
      detail: Array,
    },
    data() {
      return {
        dialogTableVisible: false,
        sums: []
      }
    },
    methods: {
      handleDeclare() {
        console.log(1111)
      },
      tempStorage() {
        this.report.aa = this.sums[1]
        this.dialogTableVisible = false
      },
      figure(param) {
        const { columns, data } = param;
        columns.forEach((column, index) => {
          if (index === 0) {
            this.sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            this.sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            this.sums[index] = this.sums[index].toFixed(2);
          } else {
            this.sums[index] = '0.00';
          }
        });
        return this.sums;
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .company-detail
    display: flex
    flex-wrap: wrap
    align-content: space-between

  .company-column
    flex-basis: 100%
    display: flex
    justify-content: space-between
</style>
