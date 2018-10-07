<template>
  <div class="checkmain">
    <!--表格内容-->
    <div class="tableContent">
      <form>
      <div class="infoTitle">机构纳税人信息</div>
      <table class="w100p checkAgent fontSize14">
        <tr>
          <!--<td class="labelStyle">关联订单编号</td>-->
          <!--<td class="w25p">-->
            <!--<span v-if="dataList.orderNumber==0">&#45;&#45;</span>-->
            <!--<span v-else>{{dataList.orderNumber}}</span>-->
          <!--</td>-->
          <td class="labelStyle">委托协议信息采集编号</td>
          <td class="valueStyle">{{dataList.collectNumber ? dataList.collectNumber : '--'}}</td>
          <td class="labelStyle">合同编号</td>
          <td class="valueStyle">
            <span>{{dataList.contractNumber}}</span>
          </td>
        </tr>
        <tr>
          <td class="labelStyle">委托人统一社会信用代码</td> <td class="valueStyle">{{mandator.identificationNumber}}</td>
          <td class="labelStyle">委托人名称</td> <td class="valueStyle">{{mandator.mandatorName}}</td>
        </tr>
        <tr>
          <td class="labelStyle">委托人主管税务机关</td> <td class="valueStyle">{{mandator.manageTaxOrg ? mandator.manageTaxOrg : '--'}}</td>
          <td class="labelStyle">委托人税务地址</td>
          
          <td class="valueStyle">
            <a href="javascript:void(0);" class="adress" :title="mandator.enterpriseAddress">
              {{mandator.enterpriseAddress ? mandator.enterpriseAddress : '--'}}
            </a>
          </td>
          
        </tr>
        <tr>
          <td class="labelStyle">委托人省份</td> <td class="valueStyle">{{mandator.mandatorProvince ? mandator.mandatorProvince : '--' }}</td>
          <td class="labelStyle">审计服务
            <el-tooltip class="item" effect="dark" content="是否在同一纳税年度内为委托人提供审计服务" placement="right">
              <i class="tipInfo el-icon-rep-wenhao"></i>
            </el-tooltip>
          </td>
          <td  class="valueStyle">{{dataList.isUnifyAnnualPayRatepaying==1?'是':'否'}}</td>
        </tr>
        <tr>
          <td class="labelStyle">委托人法人手机号</td> <td class="valueStyle">{{mandator.mobilePhone}}</td>
          <td class="labelStyle">合同金额(元)</td> <td class="valueStyle">{{dataList.contractSum}}</td>
        </tr>
        <tr>
          <td class="labelStyle">服务时间起</td>
          <td class="valueStyle">
            <span v-if="dataList.startDate==''||dataList.startDate==null||dataList.startDate==undefined">--</span>
            <span v-else>{{dataList.startDate | formatDate}}</span>
          </td>
          <td class="labelStyle">服务时间止</td>
          <td class="valueStyle">
            <span v-if="dataList.endDate==''||dataList.endDate==null||dataList.endDate==undefined">--</span>
            <span v-else>{{dataList.endDate | formatDate}}</span>
          </td>
        </tr>
        <tr>
          <td class="labelStyle">合同</td>
          <td class="valueStyle"><span class="cursor">
            <a :href="getUrl(dataList.delegationRelationId,dataList.contractAttachId,token)" class="colorBlack">{{dataList.contractAttach ? (dataList.contractAttach.originalName ? dataList.contractAttach.originalName : '--') : '--'}}</a>
          </span>
          </td>
          <td class="labelStyle">服务状态</td> <td class="valueStyle">{{dataList.status}}</td>
        </tr>
        <tr>
          <td class="labelStyle vt">服务协议摘要</td> 
          
          <td colspan="3" class="valueStyle ">
            <!-- <el-tooltip effect="dark" :content="dataList.delegationDigest" placement="top-start" popper-class="checktooltip"> -->
            <span class="itemTooltip special_span">{{dataList.delegationDigest}}</span>
            <!-- </el-tooltip> -->
          </td>
          
        </tr>
      </table>
      <div class="infoTitle">税务代理人员信息</div>
      <table class="xd2">
        <tr>
          <td class="headerName w200">姓名</td><td class="headerName">服务项目</td>
        </tr>
        <tr v-for="(item, key) in serviceAgent2" :key="key" style="background-color: #fff;">
          <td class="vm tableVal fontSize14">{{item.name}}</td>
          <td>
            <span>{{item.content}}</span>
          </td>
        </tr>
      </table>
      <div v-show="dataList.status=='正常'" class="btns">
        <router-link :to="{path:'/editAgent', query:{delegationRelationId: delegationRelationId}}"><input type="submit" value="变更" class="add_btn3 cursor"></router-link>
        <router-link :to="{path:'/endAgent', query:{delegationRelationId: delegationRelationId}}"><input type="button" value="终止" class="back_btn3 cursor"></router-link>
      </div>
      </form>
    </div>
  </div>
</template>
<script>
  import {formatDate} from '@/common/js/date.js'
  import { agentRequest } from '@/services/request';
  export default {
    data() {
      return {
        defaultOpen: ['2'],
        mandator: '',
        dialogTableVisible: false,
        showClose: false,
        dataList: {
          contractAttach: {
            originalName: ''
          }
        },
        url: '',
        url2: '',
        token: '',
        dataStatus: '',
        delegationRelationId: '',
        serviceAgents: [],
        serviceAgent2: [],
        id: ''
      }
    },
    created: function() {
      var id = this.$route.query.protocolId;
      this.id = this.getQueryString('id')
      if (this.id) {
        this.delegationRelationId = this.id;
        this.getInit(this.id);
      } else {
        this.delegationRelationId = id;
        this.getInit(id);
      }
    },
    methods: {
      getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = decodeURIComponent(window.location.search).substr(1).match(reg);
        if (r != null) {
          return unescape(r[2]);
        }
        return null;
      },
      getInit(id) {
        agentRequest.getProtocolDetail(id).then((data) => {
          if (data.code === 0) {
            let that = this;
            this.dataList = data.data;
            this.mandator = data.data.mandator;
            this.serviceAgents = data.data.serviceAgents
            for (let j = 0; j < this.serviceAgents.length; j++) {
              let arr = [];
              for (let k = 0; k < this.serviceAgents[j].serviceItems.length; k++) {
                arr.push(this.serviceAgents[j].serviceItems[k].name)
              }
              arr = Array.from(new Set(arr))
              let str = arr.join(',')
              this.serviceAgent2.push({name: this.serviceAgents[j].personName, content: str})
            }
//            服务状态
            agentRequest.getStatus().then((data) => {
              data.map(function (i) {
                if (i.code === that.dataList.status) {
                  that.dataList.status = i.name;
                }
              });
            });
//              省份
//            agentRequest.getProviceList().then((dataValue) => {
//              debugger;
//              dataValue.map(function(i) {
//                if (i.code === that.mandator.mandatorProvince) {
//                  that.mandator.mandatorProvince = i.name;
//                }
//              });
//            })
//            机关
            agentRequest.getAuthority().then((dataValue) => {
              dataValue.map(function(i) {
                if (i.code === that.mandator.mandatorTaxOrg) {
                  data.data.mandator.mandatorTaxOrg = i.name;
                }
              });
            })
          } else {
            window.Alert(data.msg);
          }
        })
      },
//      getStatusInit() {
//        agentRequest.getStatus().then((data) => {
//          this.dataStatus = data;
//        })
//        return this.dataStatus;
//      },
//      getStatus(code) {
//        let index, name;
//        if (this.dataStatus !== '') {
//          index = this.dataStatus.find(x => x.code === code);
//          if (index !== undefined) {
//            name = index.name;
//          }
//        }
//        return name;
//      },
      getUrl(delegationRelationId, contractAttachId, token) {
        token = window.localStorage.token;
        return agentRequest.getUrl(this.delegationRelationId, contractAttachId, token);
      },
      getUrl2(delegationRelationId, terminationAttachId, token) {
        token = window.localStorage.token;
        return agentRequest.getUrl2(this.delegationRelationId, terminationAttachId, token);
      },
      handleRemove(file, fileList) {
      },
      handlePreview(file) {
      },
      handleExceed(files, fileList) {
//        this.$message.warning('当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件');
      },
      beforeRemove(file, fileList) {
//        return this.$confirm('确定移除 ${ file.name }？');
      },
    },
    filters: {
      formatDate (time) {
        time = parseInt(time);
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      }
    },
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../style/index.styl';
.checkmain
  .xd2
    width 100%
    tr
      height 40px
      line-height 40px
    td
      border 1px solid #dfdfdf
  .infoTitle
    text-align left
    margin-bottom 15px
    font-size 18px
    color #000
    font-weight bold
  .labelStyle
    width 20%
    text-align left
    font-size 14px
    color #000
    background #E5F0FF
    padding-left 10px
  .valueStyle
    width 30%
    background #fff
    text-align left
    padding-left 10px
    font-size 14px
    color #333
  .color9
    color #999
  .h35
    height 35px
    line-height 35px
  .checktooltip1
    max-width 15%
  .checktooltip
    max-width 50%
  .checkAgent
    margin-bottom 15px
    tr
      height:40px;
      line-height:40px;
      td
        border 1px solid #dfdfdf
      .special_td
        position relative
        top -75px
      .itemTooltip
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      .special_span
        height: 70px;
        overflow: auto;
        display: inline-block;
        line-height: 20px;
        margin: 8px 0;
      .itemTooltip1
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
    .tableContent
      background #f2f4f7
      text-align center
  .btns
    margin-top 25px
    input
      height:32px;
      width:88px;
      color:#fff;
      border:none;
      font-size:14px;
      background: #4680ff;
      border-radius 4px
    .back_btn3
      background: #fff;
      border:1px solid #4680ff;
      color:#4680ff;
      margin-left:20px;
  .tipInfo
    color #999
  .headerName 
    background #E5F0FF
</style>

