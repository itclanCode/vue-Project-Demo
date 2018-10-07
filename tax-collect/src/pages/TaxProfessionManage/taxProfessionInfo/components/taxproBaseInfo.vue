<template>
    <div class="taxproBaseInfo">
        <h2 class="base-header">机构基本信息</h2>
        <el-card class="box-card">
            <div v-if="isEmpty">
                <div class="card-header">
                    <h2>
                        <a href="javascript;" :title="taxproBaseinfo.orgName">{{taxproBaseinfo.orgName}}</a>
                    </h2>
                </div>
                <div class="card-content">
                    <el-row>
                        <el-col :span="24">
                            <p class="tyxycode">统一社会信用代码：
                                <a href="javascript:;" :title="taxproBaseinfo.socialCreditCode">{{taxproBaseinfo.socialCreditCode?taxproBaseinfo.socialCreditCode: '暂无'}}</a>
                            </p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <div>
                                <h2>机构地址</h2>
                                <p class="text-over">
                                    <a href="javascript:;" :title="taxproBaseinfo.orgAddress">{{taxproBaseinfo.orgAddress ? taxproBaseinfo.orgAddress:'暂无'}}</a>
                                </p>
                            </div>
                            <div>
                                <h2>从事涉税服务人员总数占比</h2>
                                <p>{{taxproBaseinfo.serviceStaffSum ? taxproBaseinfo.serviceStaffSum : 0}}/{{taxproBaseinfo.staffSum ? taxproBaseinfo.serviceStaffSum: 0}}</p>
                            </div>
                            <div>
                                <h2>登记注册类型</h2>
                                <p class="text-over">
                                    <a href="javascript:;" :title="taxproBaseinfo.regType">{{taxproBaseinfo.regType ? taxproBaseinfo.regType: '暂无'}}</a>
                                </p>
                            </div>
                            <div>
                                <h2>法定代表人</h2>
                                <p>{{taxproBaseinfo.legalPersonName ? taxproBaseinfo.legalPersonName: '暂无'}}</p>
                            </div>
                            <div>
                                <h2>成立时间</h2>
                                <p>{{taxproBaseinfo.foundTime ? taxproBaseinfo.foundTime: '暂无'}}</p>
                            </div>
                        </el-col>
                        <el-col :span="12" class="p-12">
                            <div>
                                <h2>信用评分/评级</h2>
                                <p>{{taxproBaseinfo.xypj?taxproBaseinfo.xypj:0}}/A</p>
                            </div>
                            <div>
                                <h2>机构类别</h2>
                                <p class="text-over">
                                    <a href="javascript:;" :title="taxproBaseinfo.orgType">{{taxproBaseinfo.orgType ? taxproBaseinfo.orgType: '暂无'}}</a>
                                </p>
                            </div>
                            <div>
                                <h2>资产总额（万元）</h2>
                                <p class="text-over">
                                    <a href="javascript:;" :title="taxproBaseinfo.assetSum">{{taxproBaseinfo.assetSum ? taxproBaseinfo.assetSum: 0}}</a>
                                </p>
                            </div>
                            <div>
                                <h2>法人手机号</h2>
                                <p>{{taxproBaseinfo.legalMobilePhone ? taxproBaseinfo.legalMobilePhone: '暂无'}}</p>
                            </div>
                            <div>
                                <h2>服务状态</h2>
                                <p>{{taxproBaseinfo.serviceStatus?taxproBaseinfo.serviceStatus: '暂无'}}</p>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <p v-else class="text-center" v-loading="isloading">暂无数据</p>
        </el-card>
    </div>
</template>
<script>
    export default {
      name: 'taxproBaseInfo',
      props: ['taxproBaseinfo'],
      data() {
        return {
          defaultData: this.taxproBaseinfo,
          isloading: true
        }
      },
      updated() {
      },
      created() {
      },
      watch: {
        taxproBaseinfo: function(n) {
          if (JSON.stringify(n) !== '{}') {
            this.isloading = false;
          }
        }
      },
      computed: {
        isEmpty: function () {
          let taxproBaseinfo = this.taxproBaseinfo;
          for (let i in taxproBaseinfo) {
            if (taxproBaseinfo.hasOwnProperty(i)) {
              return true
            }
          }
          return false;
        }
      }
    }
</script>