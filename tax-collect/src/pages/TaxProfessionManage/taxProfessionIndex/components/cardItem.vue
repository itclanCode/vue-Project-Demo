<template>
  <div class="card-container">
    <el-row :gutter="24" class="line" v-for="(items,idx) in templateData" :key="idx">
      <div class="year-date">
        {{items.type}}({{items.baseOrgList ?items.baseOrgList.length : ''}})
      </div>
      <el-col :xl="6" :lg="8" :md="12" style="position:relative;margin: 8px 0;" v-for="(item,idex) in items.baseOrgList" :key="idex">
        <el-card class="box-card" :class="item.isRealName === 1?'active':'default'">
          <h1 class="card-header text-over">
            <a href="javascript:;" :title="item.orgName">{{item.orgName ? item.orgName: '无'}}</a>
            <!-- <i class="el-icon-rep-jiantou"></i> -->
          </h1>
          <div class="tongyi-xycode text-over">
            <span>统一社会信用代码</span>
            <a href="javascript:;" :title="item.socialCreditCode">{{item.socialCreditCode ? item.socialCreditCode : '无'}}</a>
          </div>
          <ul class="card-content">
            <li>
              <p>
                <span>服务状态</span>
                <span :class="item.serviceStatus===2?'error':''">{{item.serviceStatus?(item.serviceStatus===1?'正常':'异常'): '暂无'}}</span>
              </p>
              <p>
                <span>信用评分/等级</span>
                <span>{{item.xypf?item.xypf : 0}}/B</span>
              </p>
            </li>
            <li>
              <p>
                <span>委托人数量</span>
                <span>{{item.mandatorNum ? item.mandatorNum: 0}}</span>
              </p>
              <P>
                <span>涉税专业服务人员数量</span>
                <span>{{item.orgServiceNum ? item.orgServiceNum: 0}}</span>
              </P>
            </li>
            <li v-if="item.isRealName === 1" class='text-over'>
              <span>主管机关</span>
              <span>{{item.authoritiesName}}</span>
            </li>
          </ul>
          <div class="look-btn" v-if="item.isRealName === 2" @click="getBaseInfo(item.taxOrgId, item.socialCreditCode)">
            <p>
              <i class="el-icon-rep-chakan1"></i>
              <span>查看</span>
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <slot name="load" />
  </div>
</template>
<script>
import util from '@/common/js/util'
export default {
  name: 'cardList',
  props: ['cardData'],
  data () {
    return {
    }
  },
  computed: {
    templateData: function() {
      let data = this.cardData;
      data = data.map(item => {
        item.type = util.formateDate(item.type, '年-月-日'); // 格式化时间
        return item
      });
      return data
    }
  },
  methods: {
    getBaseInfo (taxOrgId, socialCreditCode) {
      this.$router.push({ path: `TaxProfessionInfo/${taxOrgId}/${socialCreditCode}` });
    }
  }
}
</script>