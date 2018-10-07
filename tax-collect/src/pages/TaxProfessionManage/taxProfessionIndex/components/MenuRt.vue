<template>
  <div class="menu-rt">
    <div class="update-time">
      <span>最后更新时间:</span>
      <span>{{nowTime.yearRet}} {{nowTime.dateRet}}</span>
      <span>共{{totalCount}}个税务代理机构</span>
    </div>
    <div class="tuisong-part" v-if="isTip===1">
      <el-button :type="timeCount>-1?'primary':'info'" :disabled="timeCount<0" class="tuisong" @click="tuisongAction">
        <span v-if="timeCount>-1">
          <i class='el-icon-rep-duanxin'></i>
          <i v-if="timeCount===5">短信提醒</i>
          <i v-else>正在发送中...</i>
          <i v-if="timeCount>-1&&timeCount<5">({{timeCount}}s)</i>
        </span>
        <span v-else>已提醒</span>
      </el-button>
    </div>
  </div>
</template>
<script>
import { TaxProfessionMange } from '@/services/request'
export default {
  name: 'menu-rt',
  props: ['isTip', 'totalCount', 'legalMobilePhone'],
  data () {
    return {
      timeCount: 5,
      timer: null
    }
  },
  computed: {
    nowTime () {
      return this.formStateDate();
    }
  },
  methods: {
    // 发送短信
    tuisongAction () {
      this.confim('您确定要发送短信吗?');
    },
    confim (msg) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.taxcollectorMsm();
      }).catch(() => {
      });
    },
    taxcollectorMsm () {
      // http://localhost/tax/collector/tax-collector/org_sms?legalMobilePhones
      // let parms = ['18820975125', '17328552583'];
      let parms = [{ '18820975125': '深圳市中准税务师事务所有限公司' }, { '18820975125': '深圳市君合信税务师事务所有限公司' }]
      TaxProfessionMange.taxcollectorMsm(parms).then((res) => {
        if (res.code === 0) {
          this.timeCount = 5;
        }
      })
      this.timer = setInterval(() => {
        this.timeCount--;
        if (this.timeCount < 0) {
          clearInterval(this.timer)
          this.timer = null;
          setTimeout(() => {
            this.timeCount = 5;
          }, 2000)
        };
      }, 1000);
    },
    formStateDate () {
      let YearRet = [];
      let DateRet = [];
      let retObj = {};
      let now = new Date();
      let YY = now.getFullYear();
      let MM = now.getMonth() + 1;
      let DD = now.getDate();
      let HH = now.getHours();
      let mm = now.getMinutes();
      let SS = now.getSeconds();
      YearRet.push(YY, MM, DD);
      DateRet.push(HH, mm, SS);
      YearRet = YearRet.map(item => {
        if (item < 10) {
          item = '0' + item;
        }
        return item;
      });
      retObj.yearRet = YearRet.join('-');
      DateRet = DateRet.map(item => {
        if (item < 10) {
          item = '0' + item;
        }
        return item
      })
      retObj.dateRet = DateRet.join(':');
      return retObj
    }
  }
}
</script>

