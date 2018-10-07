<template>
  <div class="vtaDeclare">
    <el-table ref="multipleTable" :data="tableData" border fit v-loading="loading" element-loading-text="正在加载数据..." header-cell-class-name="vta-headerBack" tooltip-effect="light" style="width: 100%" empty-text="暂无数据" slot="empty" :show-overflow-tooltip="true">
      <el-table-column align="center" width="50" v-if="defaultActive!=='1'">
        <template slot-scope="scope">
          <el-checkbox v-if="scope.row.fxnsrBz === 'N'" v-model="checkObj[scope.row.sbtjId]" @change="handleCheckedIdChange(scope.row.id, $event)"></el-checkbox>
          <i v-else class="el-icon-rep-wuuiconsuotanhao-copy"></i>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="60" />
      <el-table-column prop="wtrmc" label="纳税人名称" align="center" width="300">
        <template slot-scope="scope">
            <el-tooltip class="item" effect="light" :content="scope.row.wtrmc" placement="bottom">
                <span class="text-over">{{scope.row.wtrmc ? scope.row.wtrmc : '暂无'}}</span>
            </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="bqynse" label="本期应纳税额" align="center">
        <template slot-scope="scope">
            <span>{{scope.row.bqynse ? scope.row.bqynse : '0.00'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bqyjse" label="本期已缴税额" align="center">
        <template slot-scope="scope">
            <span>{{scope.row.bqyjse ? scope.row.bqyjse : '0.00'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bqjmse" label="本期免税额" align="center">
        <template slot-scope="scope">
            <span>{{scope.row.bqjmse ? scope.row.bqjmse : '0.00'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bqybtse" label="本期应补(退)税额" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.bqybtse ? scope.row.bqybtse : '0.00'}}</span>
          </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" label-class-name="option">
        <template slot-scope="scope">
          <span @click="fallError(scope.row.ysbtjuuid)" v-if="defaultActive === '2'">失败原因&nbsp;/</span>
          <span @click="modify(scope.row.djxh, scope.row.sbtjId, scope.row.ysbtjuuid,0)" v-if="defaultActive === '0' || defaultActive === '2'">修改报表</span>
          <span @click="modify(scope.row.djxh, scope.row.sbtjId, scope.row.ysbtjuuid,1)" v-if="defaultActive === '1'">查看</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { VtaDeclareMock } from '@/mock/mockData';
import { VtaDeclareRequest } from '@/services/request';
export default {
  name: 'vtaDeclare',
  props: ['loading', 'defaultActive', 'tableData', 'checkObj'],
  data () {
    return {
      failReason: [],
      testFlag: true
    }
  },
  methods: {
    fallError (ysbtjuuid) {
      this.$emit('showModel', { bool: true });
      if (!this.testFlag) {
        VtaDeclareMock.getVatsmallscaleReason(ysbtjuuid).then(res => {
          console.log(res);
        })
      } else {
        VtaDeclareRequest.getVatsmallscaleReason(ysbtjuuid).then(res => {
          console.log(res);
        })
      }
    },
    // 单选
    handleCheckedIdChange (value, id) {
      let checkObj = this.checkObj;
      for (let ids in checkObj) {
        if (checkObj[ids] === false) {
          this.$emit('CheckedIdChange', { checks: false })
          return;
        } else {
          this.$emit('CheckedIdChange', { checks: true })
        }
      }
    },
    // 修改报表type 0 // 查看 type 1
    modify (djxh, sbtjId, ysbtjuuid, type) {
      this.$router.push({name: 'ModifyReport', params: {djxh: djxh, sbtjId: sbtjId, ysbtjuuid: ysbtjuuid, type: type}})
    }
  }
}
</script>