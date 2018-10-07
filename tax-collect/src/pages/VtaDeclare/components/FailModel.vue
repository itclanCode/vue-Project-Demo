<template>
  <el-dialog custom-class="fail-model" @close="closeModel" :visible.sync="isShowModel" width="60%" center>
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
</template>

<script>
export default {
  name: 'failModel',
  props: ['isVisible', 'failDec'],
  data () {
    return {
      isShowModel: this.isVisible
    }
  },
  created () { },
  updated () { },
  watch: {
    isVisible: function (n) {
      this.isShowModel = n;
    }
  },
  computed: {
  },
  methods: {
    sure () {
      this.closeModel();
    },
    back () {
      this.closeModel();
    },
    closeModel () {
      this.$emit('showModel', { bool: false });
    }
  }
}
</script>

<style lang="stylus" scoped>
// 弹框
.fail-model {
    .title-header{
      text-align: center;
      font-size:18px;
      color:#2770E9;
      font-weight:bold;
    }
  }
.mode-content {
  li {
    position: relative;
    padding: 9px 20px;
    font-size: 13px;
    span {
      color: #f00;
    }
    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      left: 0;
      top: 14px;
      width: 12px;
      height: 12px;
      background-color: #4680FF;
      border-radius: 50%;
      -webkit-border-radius: 50%;
    }
  }
}
</style>