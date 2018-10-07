<!-- Created by qintengbo on 2018/06/01. -->
<!-- 增值税(小规模纳税人)修改报表 -->

<template>
  <el-main>
    <RightMenu :active="active" @select="select" />
    <div class="modifyReport allMainPadding">
      <keep-alive>
        <transition name="component-fade" mode="out-in">
          <component 
            ref="setData" 
            :is="currentTabComponent + curentView" 
            :desc="desc" :loading="loading"
            :gtgshBz="desc.gtgshBz" 
            :vatSmallscaleDos="desc.vatSmallscaleDos"
            :vatSmallscaleFbFlzlDos="desc.vatSmallscaleFbFlzlDos"   
            :vatSmallscaleFbJmxmDos="vatSmallscaleFbJmxmDos" 
            :vatSmallscaleFbMsxmDos="vatSmallscaleFbMsxmDos">
          </component>
        </transition>
      </keep-alive>
      <div class="option-btn" v-if="type === 0">
        <el-button type="primary" @click="submit('zancun')" :loading="successStatus['zancun']">暂存</el-button>
        <el-button :type="desc.fxnsrBz==='N'?'primary':'info'" @click="submit('submit')" :disabled="desc.fxnsrBz==='N'?false:true" v-if="curentView === 1" :loading="successStatus['submit']">提交申报</el-button>
        <el-button type="primary" @click="submit('reset')">重置</el-button>
      </div>
      <div class="option-btn" v-else>
        <el-button type="primary" @click="submit('back')">返回</el-button>
      </div>
    </div>
  </el-main>
</template>
<script>
import util from '@/common/js/util';
import RightMenu from './components/RightMenu';
import ModifyItem1 from './components/ModifyItem1';
import ModifyItem2 from './components/ModifyItem2';
import ModifyItem3 from './components/ModifyItem3';
import { VtaDeclareRequest } from '@/services/request';
import { VtaDeclareMock } from '@/mock/mockData';
export default {
  components: { RightMenu, ModifyItem1, ModifyItem2, ModifyItem3 },
  data () {
    return {
      loading: true,
      active: '1',
      curentView: 1,
      currentTabComponent: 'modifyItem',
      desc: {
        djxh: '',
        sbtjId: '',
        ysbtjuuid: '',
        wtrtyshxydm: '',
        wtrmc: '',
        skssqq: '',
        skssqz: '',
        wdqzdBz: '',
        sbqx: '',
        nsrsbh: '',
        flbz: '', // 分类标志 A ,B, AB 控制1,2列是否可编辑
        fxnsrBz: 'Y', // 风险纳税人标志
        fddbrxm: '',
        bqynse: '',
        bqyjse: '',
        bqybtse: '',
        bqjmse: '',
        gtgshBz: '', // 受否为个体工商户 N 否
        vatSmallscaleDos: [], // 第一张表数据
        vatSmallscaleFbFlzlDos: []
      },
      vatSmallscaleFbJmxmDos: [],
      vatSmallscaleFbMsxmDos: [],
      successStatus: {
        'zancun': false,
        'submit': false
      },
      type: 0, // 0 可修改编辑 1 查看,
      testFlag: true
    }
  },
  watch: {
    'desc.vatSmallscaleDos': function (nVal, oldVal) {
      if (nVal instanceof Array && nVal.length > 0) {
        this.loading = false;
      } else {
        this.loading = true;
      }
    }
  },
  mounted () {
    this.type = this.$route.params.type * 1;
    let parms = { ...this.$route.params };
    if (this.testFlag) {
      this.getVatSmallscaleDos(parms, this.type);
    } else {
      this.getMockVatSmallscalDos(parms, this.type);
    }
  },
  methods: {
    // 右侧导航栏激活回调
    select (index) {
      this.active = index;
      this.curentView = index * 1;
    },
    reset () {
      this.$router.replace('/vtaDeclare');
    },
    getVatSmallscaleDos (parms = {}, type = 0) {
      let { djxh, sbtjId, ysbtjuuid } = parms;
      let isType = 'Modify';
      if (type === 0) {
        isType = 'Modify'; // 修改
      } else {
        isType = 'Info'; // 查看
      }
      VtaDeclareRequest[`getVatsmallscale${isType}`](sbtjId, ysbtjuuid, djxh).then(res => {
        let {
          wtrtyshxydm,
          wtrmc,
          skssqq,
          skssqz,
          wdqzdBz,
          sbqx,
          nsrsbh,
          gtgshBz,
          flbz,
          fxnsrBz,
          fddbrxm,
          bqynse,
          bqyjse,
          bqybtse,
          bqjmse,
          vatSmallscaleDos,
          vatSmallscaleFbFlzlDos,
          vatSmallscaleFbJmxmDos,
          vatSmallscaleFbMsxmDos } = res.data;
        this.desc = {
          djxh,
          sbtjId,
          ysbtjuuid,
          wtrtyshxydm,
          wtrmc,
          skssqq,
          skssqz,
          wdqzdBz,
          sbqx,
          nsrsbh,
          flbz,
          fxnsrBz,
          fddbrxm,
          bqynse,
          bqyjse,
          bqybtse,
          bqjmse,
          gtgshBz
        }
        this.desc.vatSmallscaleDos = this.initData([...vatSmallscaleDos], 'scaleDos');
        this.desc.vatSmallscaleFbFlzlDos = this.initData([...vatSmallscaleFbFlzlDos], 'FbFlzlDos');
        this.vatSmallscaleFbJmxmDos = vatSmallscaleFbJmxmDos;
        this.vatSmallscaleFbMsxmDos = vatSmallscaleFbMsxmDos;
        if (isType === 'Modify') {
          util.storage('modifyItem1', [...this.desc.vatSmallscaleDos]);
        }
      })
    },
    // 初始化处理中转所有的字段
    initData (data = [], typeData) {
      let ndata = [];
      if (data.length > 0) {
        for (let k in data) {
          let nowCol = { ...data[k] };
          let newCol = {};
          switch (typeData) {
            case 'scaleDos': newCol = this.newColData(nowCol, newCol); break;
            case 'FbFlzlDos': newCol = this.newFbFlzDos(nowCol, newCol); break;
            default: break;
          }
          ndata.push(newCol);
        }
      } else {
        if (typeData === 'FbFlzlDos') {
          let nowCol = {};
          let newCol = {};
          newCol = this.newFbFlzDos(nowCol, newCol);
          ndata.push(newCol);
        }
      }
      return ndata
    },
    // 第一张表数据初始化数据中转
    newColData (nowCol, newCol = {}) {
      let mc = util.mcPush();
      mc.push(nowCol['yzzzsbhsxse'])
        .push(nowCol['swjgdkdzzszyfpbhsxse'])
        .push(nowCol['skqjkjdptfpbhsxse'])
        .push(nowCol['xsczbdcbhsxse'])
        .push(nowCol['swjgdkdzzszyfpbhsxse1'])
        .push(nowCol['skqjkjdptfpbhsxse2'])
        .push(nowCol['xssygdysgdzcbhsxse'])
        .push(nowCol['skqjkjdptfpbhsxse1'])
        .push(nowCol['msxse'])
        .push(nowCol['xwqymsxse'])
        .push(nowCol['wdqzdxse'])
        .push(nowCol['qtmsxse'])
        .push(nowCol['ckmsxse'])
        .push(nowCol['skqjkjdptfpxse1'])
        .push(nowCol['hdxse'])
        .push(nowCol['bqynse'])
        .push(nowCol['hdynse'])
        .push(nowCol['bqynsejze'])
        .push(nowCol['bqmse'])
        .push(nowCol['xwqymse'])
        .push(nowCol['wdqzdmse'])
        .push(nowCol['ynsehj'])
        .push(nowCol['bqyjse1'])
        .push(nowCol['bqybtse'])
        .push(nowCol['lmc'])
        .push(nowCol['ysbbz'])
        .push(nowCol['zzsqzd'])
        .push(nowCol['ewblxh']);
      let retArr = mc.retArr;
      retArr.map((item, idx) => {
        newCol[`a${idx + 1}`] = item;
      });
      return newCol
    },
    // 第二张表数据
    newFbFlzDos (nowCol, newCol = {}) {
      let initNowCol = {
        qcye: '0.00',
        bqfse: '0.00',
        bqkce: '0.00',
        qmye: '0.00',
        ysfwxsbhsxse: '0.00',
        bqkce_1: '0.00',
        ysfwxshsxse: '0.00',
        ysfwxsqbhssr: '0.00',
        qcye5: '0.00',
        bqfse5: '0.00',
        bqkce5: '0.00',
        qmye5: '0.00',
        ysfwxsbhsxse5: '0.00',
        bqkce5_1: '0.00',
        ysfwxshsxse5: '0.00',
        ysfwxsqbhssr5: '0.00'
      }
      if (!nowCol || JSON.stringify(nowCol) === '{}') {
        nowCol = { ...initNowCol }
      }
      let mc = util.mcPush();
      mc.push(nowCol['qcye'])
        .push(nowCol['bqfse'])
        .push(nowCol['bqkce'])
        .push(nowCol['qmye'])
        .push(nowCol['ysfwxsbhsxse'])
        .push(nowCol['bqkce_1'])
        .push(nowCol['ysfwxshsxse'])
        .push(nowCol['ysfwxsqbhssr'])
        .push(nowCol['qcye5'])
        .push(nowCol['bqfse5'])
        .push(nowCol['bqkce5'])
        .push(nowCol['qmye5'])
        .push(nowCol['ysfwxsbhsxse5'])
        .push(nowCol['bqkce5_1'])
        .push(nowCol['ysfwxshsxse5'])
        .push(nowCol['ysfwxsqbhssr5'])
      let retArr = mc.retArr;
      retArr.map((item, idx) => {
        newCol[`a${idx + 1}`] = item;
      });
      return newCol
    },
    mcPush () {
      function Chain () {
        this.retArr = [];
        this.push = function (parms) {
          this.retArr.push(parms);
          return this
        }
        return this
      }
      let chainObj = new Chain();
      return chainObj
    },
    // 模拟接口
    getMockVatSmallscalDos (parms = {}, type = 0) {
      let { djxh, sbtjId, ysbtjuuid } = parms;
      let isType = 'Modify';
      if (type === 0) {
        isType = 'Modify'; // 修改
      } else {
        isType = 'Info'; // 查看
      }
      VtaDeclareMock[`getVatsmallscale${isType}`](sbtjId, ysbtjuuid, djxh).then(res => {
        let {
          wtrtyshxydm,
          wtrmc,
          skssqq,
          skssqz,
          wdqzdBz,
          sbqx,
          nsrsbh,
          gtgshBz,
          flbz,
          fddbrxm,
          bqynse,
          bqyjse,
          bqybtse,
          bqjmse,
          vatSmallscaleDos,
          vatSmallscaleFbFlzlDos,
          vatSmallscaleFbJmxmDos,
          vatSmallscaleFbMsxmDos } = res.data;
        this.desc = {
          djxh,
          sbtjId,
          ysbtjuuid,
          wtrtyshxydm,
          wtrmc,
          skssqq,
          skssqz,
          wdqzdBz,
          sbqx,
          nsrsbh,
          flbz,
          fddbrxm,
          bqynse,
          bqyjse,
          bqybtse,
          bqjmse,
          gtgshBz
        }
        this.desc.vatSmallscaleDos = this.initData([...vatSmallscaleDos], 'scaleDos');
        this.desc.vatSmallscaleFbFlzlDos = this.initData([...vatSmallscaleFbFlzlDos], 'FbFlzlDos');
        this.vatSmallscaleFbJmxmDos = vatSmallscaleFbJmxmDos;
        this.vatSmallscaleFbMsxmDos = vatSmallscaleFbMsxmDos;
        if (isType === 'Modify') {
          util.storage('modifyItem1', [...this.desc.vatSmallscaleDos]);
        }
      })
    },
    confim (msg, type) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.successStatus[type] = true;
      }).catch(() => {
        this.successStatus[type] = false;
      });
    },
    submit (type) {
      switch (type) {
        case 'zancun':
          // util.removeStorge('modifyItem1');
          this.confim('您确定要暂存吗?', type);
          break;
        case 'submit':
          // util.removeStorge('modifyItem1');
          this.confim('您确定要申报吗?', type);
          break;
        case 'reset':
          this.$refs.setData.setCacheData();
          this.confim('您确定要重置吗?', type);
          break;
        case 'back':
          this.$router.replace('/vtaDeclare');
          break;
        default: break;
      }
    }
  }
}
</script>

<style lang="stylus">
@import './stylus/modifyReport.styl';
</style>


