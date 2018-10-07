<template>
<el-table :data="baseYearInfoTemplate" empty-text="暂无数据" slot="empty" v-loading="loading" style="width: 100%">
  <el-table-column>
    <template slot-scope="props">
      <el-form inline class="demo-table-expand">
        <el-form-item label="统一社会信用代码" class="text-over">
            <span>
                <a href="javascript:;" :title="props.row.socialCreditCode">{{ props.row.socialCreditCode }}</a>
            </span>
        </el-form-item>
        <el-form-item label="机构名称" class="text-over">
          <span>
            <a href="javascript:;" :title="props.row.orgName">{{ props.row.orgName }}</a>
          </span>
        </el-form-item>
        <el-form-item label="登记注册类型" class="text-over">
          <span>
            <a href="javascript:;" :title="props.row.regTypeName">{{ props.row.regTypeName }}</a>
          </span>
        </el-form-item>
        <el-form-item label="处理日期" class="text-over">
          <span>
            <a href="javascript:;" :title="props.row.createTime">{{ props.row.createTime }}</a>
          </span>
        </el-form-item>
        <el-form-item label="法人代表人" class="text-over">
          <span>
            <a href="javascript:;" :title="props.row.legalPersonName">{{ props.row.legalPersonName }}</a>
          </span>
        </el-form-item>
        <el-form-item label="税务师人数" class="text-over">
          <span>
            <a href="javascript:;" :title="props.row.swsrs">{{ props.row.swsrs }}</a>
          </span>
        </el-form-item>
        <el-form-item label="律师人数" class="text-over">
          <span>
            <a href="javascript:;" :title="props.row.lsrs">{{ props.row.lsrs}}</a>
          </span>
        </el-form-item>
        <el-form-item label="注册会计师人数" class="text-over">
          <span>
            <a href="javascript:;" :title="props.row.zckjsrs">{{ props.row.zckjsrs}}</a>
          </span>
        </el-form-item>
        <el-form-item label="其中丛书涉税服务外籍人员数" class="text-over">
          <span>
            <a href="javascript:;" :title="props.row.taxServiceForeignSum">{{ props.row.taxServiceForeignSum}}</a>
          </span>
        </el-form-item>
        <el-form-item label="从事涉税服务人员数" class="text-over">
          <span>
            <a href="javascript:;" :title="props.row.taxServicePersonSum">{{props.row.taxServicePersonSum}}</a>
          </span>
        </el-form-item>
        <el-form-item label="机构地址" class="text-over address">
          <span>
            <a href="javacript:;" :title="props.row.orgAddress">{{props.row.orgAddress}}</a>
          </span>
        </el-form-item>
        <el-form-item label="受到行政处罚情况" class="text-over chufa">
          <span>
            <a href="javascript:;" :title="props.row.xzcfqk">{{props.row.xzcfqk}}</a>
           </span>
        </el-form-item>
        <el-form-item label="行业协会奖惩情况" class="text-over hangye">
          <span>
              <a href="javascript:;" :title="props.row.hyxhjcqk">{{props.row.hyxhjcqk}}</a>
          </span>
          <span class="warn-info">温馨提示：若您对上述行业协会奖惩有疑异，请携带相关证明文件前往办事大厅进行处理。</span>
        </el-form-item>
      </el-form>
    </template>
  </el-table-column>
</el-table>
</template>

<script>
export default {
  name: 'baseyear',
  props: ['baseYearInfo'],
  data() {
    return {
      loading: true,
    }
  },
  mounted() {
    if (JSON.stringify(this.baseYearInfo) !== '{}') {
      this.loading = false;
    }
  },
  computed: {
    baseYearInfoTemplate: function () {
      if (this.baseYearInfo) {
        this.loading = false;
      }
      let baseInfoArr = [];
      baseInfoArr.push(this.baseYearInfo);
      baseInfoArr.map(item => {
        item.createTime = this.formDate(item.createTime)
      })
      return baseInfoArr
    }
  },
  created() {
    this.$watch('baseYearInfo', (n) => {
      if (this.baseYearInfo) {
        this.loading = false;
      }
    })
  },
  methods: {
    formDate(date) {
      let target = date ? new Date(date * 1).toLocaleDateString().split('/') : new Date().toLocaleDateString().split('/');
      let nArr = []
      target.map(item => {
        if (item < 10) {
          item = '0' + item;
        }
        nArr.push(item)
      });
      return nArr.join('-')
    }
  }
}
</script>

<style lang="stylus">
.address,
.chufa,
.hangye {
  width: 100% !important;
  position: relative;
  .el-form-item__label {
    padding: 19px 10px;
  }
  .el-form-item__content {
    position: absolute;
    left: 190px;
    line-height: 26px !important;
    white-space: normal;
    span:first-child {
      word-break: break-all;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
  .warn-info {
    color: #F5934B;
    font-size: 13px;
  }
}
</style>
