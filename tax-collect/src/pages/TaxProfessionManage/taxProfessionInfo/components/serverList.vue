<template>
    <div class="server-list">
        <h2 class="base-header">涉税专业服务人员列表</h2>
        <el-card class="box-card">
           <div class="head-card">
               <p>姓名</p>
               <p>机构内身份</p>
               <p>职业资格证书</p>  
           </div>
           <div class="card-content">
             <ul class="server-list" :class="showFlag?'hide':'show'" v-if="taxproBaseinfo.baseOrgStaffList && taxproBaseinfo.baseOrgStaffList.length>0">
               <li v-for="(item,idx) in taxproBaseinfo.baseOrgStaffList" :key="idx">
                 <p><a href="javascript:;" :title="item.personName">{{item.personName?item.personName: '暂无'}}</a></p>
                 <p><a href="javascript:;" :title="item.orgProvince">{{item.orgProvince ? item.orgProvince: '暂无'}}</a></p>
                 <p><a href="javascript:;" :title="item.papersAttach">{{item.papersAttach?item.papersAttach: '暂无'}}</a></p>
               </li>
             </ul>
             <p v-else class='text-left' v-loading="isLoading">暂无数据</p>
             <p @click="showContent" v-if="taxproBaseinfo.baseOrgStaffList && taxproBaseinfo.baseOrgStaffList.length>7" class="show-btn">
               <a href="javascript:;">{{showFlag?'展开':'收起'}}</a>
               <i class="el-icon-rep-jiantou" :class="showFlag?'':'up'"></i>
             </p>
           </div>
        </el-card>
      </div>
</template>
<script>
export default {
  name: 'serverList',
  props: ['taxproBaseinfo'],
  data () {
    return {
      showFlag: true,
      isLoading: true
    }
  },
  watch: {
    taxproBaseinfo: function(n, p) {
      if (n.baseOrgStaffList && n.baseOrgStaffList.length > 0) {
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    }
  },
  methods: {
    showContent () {
      this.showFlag = !this.showFlag;
    },
  }
}
</script>
