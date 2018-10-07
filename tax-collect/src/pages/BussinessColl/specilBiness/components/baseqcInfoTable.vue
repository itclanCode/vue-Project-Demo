<template>
  <el-table
      v-loading="loading"
      v-if="is_Edit?baseCollectInfoTemplate:(is_Save?baseCollectInfoTemplate:baseQueryInfoTemplate)" 
      :data="is_Edit?baseCollectInfoTemplate.baseInfo:(is_Save?baseCollectInfoTemplate.baseInfo:baseQueryInfoTemplate.baseInfo)"
      empty-text="暂无数据"
      slot="empty"
      style="width: 100%">
      <el-table-column>
        <template slot-scope="props">
            <el-form inline class="demo-table-expand">
                <el-form-item label="受托人统一社会信用代码" class="text-over">
                  <span> n   
                    <a href="javascript:;" :title="props.row.strtyshxydm">{{ props.row.strtyshxydm ? props.row.strtyshxydm : '暂无' }}</a>
                  </span>
                </el-form-item>
                <el-form-item label="受托人名称" class="text-over">
                    <span><a href="javascript:;" :title="props.row.strmc">{{ props.row.strmc ? props.row.strmc : '' }}</a></span>
                </el-form-item>
                <el-form-item label="委托协议信息采集编号" class="text-over">
                    <span>
                      <a href="javascript:;" :title="props.row.wtxyxxcjbh">{{ props.row.wtxyxxcjbh ? props.row.wtxyxxcjbh : '暂无' }}</a>
                    </span>
                </el-form-item>
                <el-form-item label="委托人名称" class="text-over">
                    <span><a href="javascript:;" :title="props.row.wtrmc">{{ props.row.wtrmc ? props.row.wtrmc: '暂无'}}</a></span>
                </el-form-item>
                <el-form-item label="委托人统一社会信用代码" class="text-over">
                    <span>
                      <a href="javascript:;" :title="props.row.wtrtyshxydm">{{ props.row.wtrtyshxydm ? props.row.wtrtyshxydm : '暂无' }}</a>
                    </span>
                </el-form-item>
                <el-form-item label="合同金额" class="text-over">
                    <span>
                      <a href="javascript:;" :title="props.row.htje">{{ props.row.htje ? props.row.htje: '0' }}</a>
                    </span>
                </el-form-item>
                <el-form-item label="涉税专项业务编号" class="text-over">
                    <span>
                        <a href="javascript:;" :title="props.row.sszyfwbgbh">{{ props.row.sszyfwbgbh?props.row.sszyfwbgbh:'暂无'}}</a>
                    </span>
                </el-form-item>
                <el-form-item label="委托项目" class="text-over">
                    <span>
                      <a href="javascript:;" :title="_constant.PROTOCOL_TYPE[props.row.sszyfwwtxmdlDm]">{{ _constant.PROTOCOL_TYPE[props.row.sszyfwwtxmdlDm]}}</a>
                    </span>
                </el-form-item>
            </el-form>
        </template>
          </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'qc',
  data() {
    return {
      loading: true,
    }
  },
  props: ['is_Edit', 'is_Save', 'baseCollectInfoTemplate', 'baseQueryInfoTemplate'],
  mounted() {
    if (this.baseQueryInfoTemplate && this.baseQueryInfoTemplate.wtxmList.length > 0) {
      this.loading = false;
    } else {
      this.loading = true;
    }
  },
  updated () {
    this.$watch('baseCollectInfoTemplate', (n) => {
      if (n.wtxmList && n.wtxmList.length > 0) {
        this.loading = false;
      } else {
        this.loading = true
      }
    })
    this.$watch('baseQueryInfoTemplate', (n) => {
      if (n && n.wtxmList && n.wtxmList.length > 0) {
        this.loading = false
      } else {
        this.loading = true;
      }
    })
  }
}
</script>

<style scoped>
</style>