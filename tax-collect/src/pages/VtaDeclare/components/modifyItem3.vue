<template>
  <div class="modify-item-3">
    <ModTop active="3" :desc="desc"/>
    <p class="modify-item-project">一、减税项目</p>
    <el-table class="modify-table" :data="taxReduData" v-loading="loading" element-loading-text="正在加载数据" border fit header-cell-class-name="mod-headerBack" style="width: 100%">
      <el-table-column width="50" label="编辑">
        <template slot-scope="scope">
          <i class="el-icon-rep-jianshao-copy" @click="del(scope.$index)"></i>
        </template>
      </el-table-column>
      <el-table-column label="减税性质代码及名称" width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="期初余额" align="center">
        <el-table-column prop="ye" label="1" align="center">
          <template slot-scope="scope">
            <el-input :value="scope.row.ye" v-model="scope.row.ye" :disabled="scope.$index === 0 ? true : false" @blur="changeVal($event,0)" v-if="scope.row.isEdit === 0&& type === 0" />
            <span v-else>{{scope.row.ye}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="本期发生额" align="center">
        <el-table-column prop="bq" label="2" align="center">
          <template slot-scope="scope">
            <el-input :value="scope.row.bq" v-model="scope.row.bq" :disabled="scope.$index === 0 ? true: false" @blur="changeVal($event,0)" v-if="scope.row.isEdit === 0 && type === 0" />
            <span v-else>{{scope.row.bq}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="本期应抵减税额" align="center">
        <el-table-column prop="jse" label="3=1+2" align="center">
          <template slot-scope="scope">
            <el-input :value="scope.row.jse" v-model="scope.row.jse" :disabled="true" v-if="scope.row.isEdit === 0 && type === 0" />
            <span v-else>{{scope.row.jse}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="本期实际抵减税额" align="center">
        <el-table-column prop="sjse" label="4≤3" align="center">
          <template slot-scope="scope">
            <el-input :value="scope.row.sjse" v-model="scope.row.sjse" :disabled="scope.$index === 0 ? true:false" @blur="changeVal($event,0)" v-if="scope.row.isEdit === 0 && type === 0" />
            <span v-else>{{scope.row.sjse}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="期末余额" align="center">
        <el-table-column prop="me" label="5=3-4" align="center">
          <template slot-scope="scope">
            <el-input :value="scope.row.me" v-model="scope.row.me" :disabled="true" v-if="scope.row.isEdit === 0 && type === 0" />
            <span v-else>{{scope.row.me}}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <Add @addEvent="add(0)" v-if="type === 0" />
    <p class="modify-item-project">二、免税项目</p>
    <el-table class="modify-table" :data="dutyFreeData" v-loading="loading" element-loading-text="正在加载" border fit header-cell-class-name="mod-headerBack" style="width: 100%">
      <el-table-column width="50" label="编辑">
        <template slot-scope="scope">
          <i class="el-icon-rep-jianshao-copy" @click="del(scope.$index)"></i>
        </template>
      </el-table-column>
      <el-table-column label="免税性质代码及名称" width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="免征增值税项目销售额" align="center">
        <el-table-column prop="mzxse" label="1" width="170" align="center">
          <template slot-scope="scope">
            <el-input :value="scope.row.mzxse" v-model="scope.row.mzxse" :disabled="scope.$index === 0 ? true: false" @blur="changeVal($event,1)" v-if="scope.row.isEdit === 0 && type === 0" />
            <span v-else>{{scope.row.mzxse}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="免税销售额扣除项目本期实际扣除金额" align="center">
        <el-table-column prop="mzxsjse" label="2" width="260" align="center">
          <template slot-scope="scope">
            <el-input :value="scope.row.mzxsjse" v-model="scope.row.mzxsjse" :disabled="scope.$index === 0 ? true: false" @blur="changeVal($event,1)" v-if="scope.row.isEdit === 0 && type === 0" />
            <span v-else>{{scope.row.mzxsjse}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="扣除后免税销售额" align="center">
        <el-table-column prop="kcmse" label="3=1-2" width="140" align="center">
          <template slot-scope="scope">
            <el-input :value="scope.row.kcmse" v-model="scope.row.kcmse" :disabled="true" v-if="scope.row.isEdit === 0 && type === 0" />
            <span v-else>{{scope.row.kcmse}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="免税销售额对应的进项税额" align="center">
        <el-table-column prop="msydjxe" label="4" width="190" align="center">
          <template slot-scope="scope">
            <el-input :value="scope.row.msydjxe" v-model="scope.row.msydjxe" :disabled="scope.$index === 0 ? true: false" v-if="scope.row.isEdit === 0 && type === 0" />
            <span v-else>{{scope.row.msydjxe}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="免税额" align="center">
        <el-table-column prop="mse" label="5" align="center">
          <template slot-scope="scope">
            <el-input :value="scope.row.mse" v-model="scope.row.mse" :disabled="scope.$index === 0 ? true: false" v-if="scope.row.isEdit === 0 && type === 0" />
            <span v-else>{{scope.row.mse}}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <Add @addEvent="add(1)" v-if="type === 0" />
  </div>
</template>

<script>
import ModTop from './ModTop';
import Add from './Add';
export default {
  name: 'modify-item-3',
  components: { ModTop, Add },
  props: ['desc', 'vatSmallscaleFbJmxmDos', 'vatSmallscaleFbMsxmDos'],
  data () {
    return {
      loading: false,
      type: 0,
      tableType: 0,
      sumCol: {},
      taxReduData: [
        {
          name: '合计',
          ye: '0.00',
          bq: '0.00',
          jse: '0.00',
          sjse: '0.00',
          me: '0.00',
          isEdit: 0
        }
      ],
      dutyFreeData: [
        {
          name: '合计',
          mzxse: '0.00',
          mzxsjse: '0.00',
          kcmse: '0.00',
          msydjxe: '0.00',
          mse: '0.00',
          isEdit: 0
        },
        {
          name: '出口免税',
          mzxse: '0.00',
          mzxsjse: '0.00',
          kcmse: '0.00',
          msydjxe: '0.00',
          mse: '0.00',
          isEdit: 0
        }, {
          name: '其中:跨境服务',
          mzxse: '0.00',
          mzxsjse: '0.00',
          kcmse: '0.00',
          msydjxe: '0.00',
          mse: '0.00',
          isEdit: 0
        }
      ]
    }
  },
  watch: {
    taxReduData: function (nVal, old) {
      let table = nVal;
      table.map((item, idx) => {
        if (idx !== 0) {
          this.sumCol = this.getSummaries(this.taxReduData);
          item = { ...this.sumCol }
        }
        return item
      });
      console.log(this.sumCol);
    }
  },
  mounted () {
    let type = this.$route.params.type;
    this.type = type * 1;
  },
  methods: {
    // 改变其值
    changeVal (event, type) {
      if (type === 0) {
        this.taxReduDataFn();
      } else {
        this.dutyFreeDataFn();
      }
    },
    // 第一张表
    taxReduDataFn () {
      this.taxReduData = this.taxReduData.map((item, idx) => {
        for (let key in item) {
          if (isNaN(item[key]) && idx !== 0) {
            item[key] = '0.00';
          } else {
            item[key] = (item[key] * 1).toFixed(2);
            item['isEdit'] = 0;
          }
        }
        if (idx === 0) {
          item.name = '合计';
          item.ye = this.sumCol.ye;
          item.bq = this.sumCol.bq * 1;
          item.jse = this.sumCol.jse * 1;
          item.sjse = this.sumCol.sjse * 1;
          item.me = this.sumCol.me * 1;
        }
        item.jse = (item.ye * 1 + item.bq * 1).toFixed(2);
        item.me = (item.jse * 1 - item.sjse * 1).toFixed(2);
        if (item.sjse * 1 > item.jse * 1) {
          this.getMessage('error', '第4栏<=第3栏');
          return;
        }
        return item
      });
      // this.taxReduData = this.taxReduData.map((item, idx) => {
      //   if (idx === 0) {
      //     item = { ...this.sumCol }
      //   }
      //   return item
      // })
    },
    // 第二张表
    dutyFreeDataFn () {
      this.dutyFreeData = this.dutyFreeData.map((item, idx) => {
        for (let key in item) {
          if (isNaN(item[key])) {
            item[key] = '0.00';
          } else {
            if (!item.hasOwnProperty('isEdit')) {
              item[key] = (item[key] * 1).toFixed(2);
            }
          }
        }
        if (!isNaN(item.mzxse) && !isNaN(item.mzxsjse)) {
          item.kcmse = item.mzxse * 1 - item.mzxsjse * 1;
        }
        return item
      })
    },
    // 合计
    getSummaries (table) {
      let name = '合计';
      let ye = 0; // 期末余额
      let bq = 0; // 本期发生额
      let jse = 0; // 本期应抵减税额
      let sjse = 0; // 本期实际抵减税额
      let me = 0; // 期末余额
      let isEdit = 0;
      let retObj = {};
      table.map((item, idx) => {
        if (idx !== 0) {
          ye += item.ye * 1;
          bq += item.bq * 1;
          sjse += item.sjse * 1;
          jse += item.jse * 1;
          me += item.me * 1;
        }
      })
      ye = this.toFixed(ye) * 1;
      bq = this.toFixed(bq) * 1;
      sjse = this.toFixed(sjse) * 1;
      jse = this.toFixed(jse) * 1;
      me = this.toFixed(me) * 1;
      retObj = { name, ye, bq, jse, me, sjse, isEdit }
      return retObj;
    },
    toFixed (num) {
      return num.toFixed(2)
    },
    add (tableType) {
      this.tableType = tableType;
      let rowData1 = {
        ye: '',
        bq: '',
        jse: '',
        sjse: '',
        me: '',
        isEdit: 0
      }
      let rowData2 = {
        name: '',
        mzxse: '',
        mzxsjse: '',
        kcmse: '',
        msydjxe: '',
        mse: '',
        isEdit: 0

      };
      if (tableType === 0) {
        this.taxReduData.push(rowData1);
        // console.log(this.taxReduData);
      } else {
        this.dutyFreeData.push(rowData2);
      }
    },
    del (idx) {
      let tableType = this.tableType;
      if ((tableType === 0 && idx === 0) || (tableType === 1 && (idx === 1 || idx === 0))) {
        return;
      }
      if (tableType === 0) {
        this.taxReduData.splice(idx, 1);
      } else {
        this.dutyFreeData.splice(idx, 1)
      }
    },
    getMessage (type, msg) {
      this.$message({
        message: msg,
        type: type
      });
    },
  }
}
</script>