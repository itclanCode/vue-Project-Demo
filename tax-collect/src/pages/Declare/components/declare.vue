<template>
  <div class="declare">
    <el-table ref="multipleTable" :data="tableData" border fit v-loading="loading" element-loading-text="正在加载数据" header-cell-class-name="vta-headerBack"
      tooltip-effect="light" style="width: 100%" empty-text="暂无数据" slot="empty" :show-overflow-tooltip="true" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
    </el-table-column>
      <el-table-column prop="nsrmc" label="纳税人名称" align="center" width="180" />
      <el-table-column prop="bqynseZzs" label="一般增值税" align="center" />
      <el-table-column prop="mdseSum" label="免抵税额" align="center" />
      <el-table-column prop="bqybtseXfs" label="消费税" align="center" />
      <el-table-column prop="yjskSum" label="本期已缴税额" align="center" />
      <el-table-column prop="jmeSum" label="减免额" align="center" />
      <el-table-column prop="bqybtseSum" label="本期应补(退)税额" align="center" />
      <el-table-column label="操作" align="center" width="150" label-class-name="option">
        <template slot-scope="scope">
          <span @click="fallreason(scope.row.djxh)" v-if="defaultActive === '2'">失败原因&nbsp;/</span>
          <span v-if="defaultActive === '1' || defaultActive === '2'" @click="update(scope.row.djxh, defaultActive, sbdate)">修改报表</span>
          <span v-if="defaultActive === '3'" @click="update(scope.row.djxh, defaultActive, sbdate)">查看</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog custom-class="fail-model" @close="closeModel" :visible.sync="dialogVisible" width="60%" center>
      <div class="title-header">
        失败原因
      </div>
      <ul class='mode-content'>
        <li>申报表第2栏第1列
          <span>¥500.00</span>应≥应税货物及劳务增值税专用发票不含税销售额
          <span>¥600.00</span>（税务机关代开+防伪税控系统自开）</li>
        <li>申报表第2栏第2列
          <span>¥500.00</span>应≥应税服务税务增值税专用发票不含税销售额
          <span>¥600.00</span>（税务机关代开+防伪税控系统自开）</li>
        <li>申报表第5栏第2列¥500.00应≥税务机关代开的增值税专用发票不含税销售额¥600.00（销售、出租不动产</li>
        <li>申报表第3栏+第6栏+第8栏+第9栏+第14栏
          <span>¥500.00</span>应≥当期开具增值税普通发票不含税销售额
          <span>¥600.00</span>（包括货物劳务和服务）</li>
        <li>申报表第1栏+第4栏+第7栏+第9栏+第13栏+附列资料本期扣除额 ¥500.00应≥当期开具发票不含税销售额合计
          <span>¥600.00</span>（包括货物劳务和服务)</li>
        <li>申报表第18栏'本期应纳税额减征额
          <span>¥500000.00</span>应≤
          <span>¥5000</span>
        </li>
        <li>申报表第12栏其他免税销售额
          <span>¥500.00</span>应≥开票系统的免税销售额
          <span>¥400</span>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sure">确定</el-button>
        <el-button @click="back">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { DeclareRequest } from '@/services/request';

  export default {
    name: 'declare',
    props: ['loading', 'defaultActive', 'tableData', 'sbdate'],
    data() {
      return {
        dialogVisible: false,
        multipleSelection: [],
        checkarr: [],
        params: {}
      }
    },
    computed: {
    },
    methods: {
      update: function (id, defaultActive, sbdate) {
        this.$router.push({ path: `Updated/${id}/${defaultActive}/${sbdate}` });
      },
      fallreason: function (id) {
        this.dialogVisible = true;
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection);
        this.multipleSelection.map(item => {
          this.checkarr.push(item.djxh)
        })
        this.params = {
          'djxh': this.checkarr,
          'isdeclare': this.defaultActive,
          'ysbqx': this.sbdate
        }
        DeclareRequest.declareall(this.params).then((res) => {
          console.log(res)
        })
      }
    },
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .declare 
    .el-table
    background red
      th 
        .el-checkbox
          font-size 40px
  .fail-model 
    .title-header 
      text-align center
      font-size 18px
      color #2770E9
      font-weight bold
  .mode-content 
    li 
      position relative
      padding 9px 20px
      font-size 13px
      span
        color #f00
      &::before 
        content ''
        display inline-block
        position absolute
        left 0
        top 14px
        width 12px
        height 12px
        background-color #4680FF
        border-radius 50%
        -webkit-border-radius 50%
</style>