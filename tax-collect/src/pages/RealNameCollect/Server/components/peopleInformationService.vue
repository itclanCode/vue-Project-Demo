<template>
  <div class="serverInfo">
    <div class="tableContent">
      <div class="infoTitle">基本信息</div>
      <table class="serverTable">
        <tr>
          <td class="labelStyle">姓名</td>
          <td class="valueStyle">{{server.personName}}</td>
          <td class="labelStyle">性别</td>
          <td class="valueStyle">
            <span v-if="server.sex === 0">女</span>
            <span v-else-if="server.sex === 1">男</span>
            <span v-else>-</span>
          </td>
        </tr>
        <tr>
          <td class="labelStyle">身份证件种类</td>
          <td class="valueStyle">{{server.certType}}</td>
          <td class="labelStyle">身份证件号码</td>
          <td class="valueStyle">{{server.certNumber}}</td>
        </tr>
        <tr>
          <td class="labelStyle">从事涉税专业服务时间(年)</td>
          <td class="valueStyle">{{server.taxServiceTime}}</td>
          <td class="labelStyle">移动电话</td>
          <td class="valueStyle">{{server.mobilePhone}}</td>
        </tr>
        <tr>
          <td class="labelStyle">学历</td>
          <td class="valueStyle">{{server.education}}</td>
          <td class="labelStyle">政治面貌</td>
          <td class="valueStyle">{{server.politicalStatus}}</td>
        </tr>
        <tr>
          <td class="labelStyle">电子邮箱</td>
          <td class="valueStyle">{{server.email}}</td>
          <td class="labelStyle">是否党支部书记(党组织负责人)</td>
          <td class="valueStyle">{{server.isPartyOrgLeader ? '是': '否'}}</td>
        </tr>
        <tr>
          <td class="labelStyle">机构内身份</td>
          <td class="valueStyle">{{server.orgPosition}}</td>
          <td class="labelStyle">是否政协委员</td>
          <td class="valueStyle">{{server.isCommittee  ? '是': '否'}}</td>
        </tr>
        <tr>
          <td class="labelStyle">是否人大代表</td>
          <td class="valueStyle">{{server.isCongress  ? '是': '否'}}</td>
          <td class="labelStyle">人大代表等级</td>
          <td class="valueStyle">{{server.congressLevel}}</td>
        </tr>
        <!-- 服务项目 -->
        <tr>
          <td class="labelStyle">代理范围</td>
          <td colspan="3" class="valueStyle">{{server.services}}</td>
        </tr>
        <!-- 从事涉税专业服务情况 -->
        <tr>
          <td class="labelStyle">从事涉税专业服务情况</td>
          <td colspan="3" class="valueStyle">{{server.taxServiceSituation}}</td>
        </tr>
      </table>
      <!-- 资格证书采集部分 -->
      <div class="marginTop20">
        <div class="infoTitle">职业资格证书采集</div>
        <el-table :data="listData" class="marginTop20" border>
          <el-table-column 
            label="证书类别" 
            align="center"
            prop="papersCode"
          >
          </el-table-column>
          <el-table-column 
            label="证书编号" 
            align="center"
            prop="papersNumber"
          >
          </el-table-column>
          <el-table-column 
            label="证书取得时间" 
            align="center"
          >
            <template slot-scope="scope">
              <span>{{scope.row.papersLicenceTime ? scope.row.papersLicenceTime : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column 
            label="证书发证机关" 
            align="center"
          >
            <template slot-scope="scope">
              <span>{{scope.row.papersLicenceOrg ? scope.row.papersLicenceOrg : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column 
            label="行业协会会员编号" 
            align="center"
          >
            <template slot-scope="scope">
              <span>{{scope.row.associationMemberCode}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="marginTop20">
        <router-link :to="{path: '/addService', query: {orgAgentId: this.orgAgentId}}"  v-show="isShow">
          <el-button type="primary">编 辑</el-button>
        </router-link>
        <router-link to="/server">
          <el-button>返 回</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
  import { formatDate } from '../../../../common/js/date.js'
  import { serverRequest } from '@/services/request'
  export default {
    data() {
      return {
        server: {},
        orgAgentId: '', // 用户ID
        idType: [], // 证件类别
        educationBg: [], // 学历列表
        inistitutionBg: [], // 机构内身份
        certificateType: [], // 证书类别
        listData: [], // 职业资格证书
        politicalType: [], // 政治面貌
        isShow: true,
      }
    },
    created () {
      this.getCerttypeList();
      this.getEducationtypeList();
      this.getOrgposition();
      this.getPaperstypeItem();
      this.getPoliticstatus();
      if (this.$route.query.onJob === false) {
        this.isShow = false
      }
    },
    mounted() {
      let _this = this;
      this.onJob = this.$route.query.onJob;
      this.orgAgentId = this.$route.query.orgAgentId;
      // 获得税务代理人详细信息
      serverRequest.getTaxagentDetail(this.orgAgentId).then(res => {
        let ser = '';
        _this.server = res.data;
        _this.idType.forEach(function(d, i) { /* certType证件类别 */
          if (d.certCode.toString() === _this.server.certType.toString()) {
            _this.server.certType = d.certDesc;
          }
        });
        _this.educationBg.forEach(function(d, i) { /* education学历列表 */
          if (d.educationCode.toString() === _this.server.education.toString()) {
            _this.server.education = d.educationDesc;
          }
        });
        _this.inistitutionBg.forEach(function(d, i) { /* orgPosition机构内身份 */
          if (d.orgInnerIdentityCode.toString() === _this.server.orgPosition.toString()) {
            _this.server.orgPosition = d.orgInnerIdentityDescribe;
          }
        });
        _this.politicalType.forEach(function(d, i) { /* politicalStatus政治面貌 */
          if (d.politicsStatusCode.toString() === _this.server.politicalStatus.toString()) {
            _this.server.politicalStatus = d.politicsStatusDesc;
          }
        });
        if (_this.server.serviceScope && _this.server.serviceScope.length) {
          _this.server.serviceScope.forEach(function(d, i) {
            ser += d.name + '，';
          });
        }
        _this.server.services = ser;
        /* papersAttachList资格职业证书 */
        let time;
        _this.listData = _this.server.papersAttachList;
        _this.listData.forEach(function(d, i) {
          time = _this.formatDate(d.papersLicenceTime);
          _this.listData[i].papersLicenceTime = time;

          _this.certificateType.forEach(function(item, j) {
            if (item.papersCode.toString() === d.papersCode.toString()) {
              d.papersCode = item.papersDesc;
            }
          })
        });
      })
    },
    methods: {
      getPoliticstatus () {
        let _this = this;
        serverRequest.getPoliticstatus().then(res => {
          if (res) {
            _this.politicalType = res
          } else {
            _this.$message({
              type: 'error',
              message: res.message || res.data.message
            })
          }
        }).catch(err => {
          _this.$message({
            type: 'error',
            message: err
          })
        })
      },
      // 获得证件类别
      getCerttypeList () {
        let _this = this;
        serverRequest.getCerttypeList().then(res => {
          if (res) {
            _this.idType = res
          } else {
            this.$message({
              type: 'error',
              message: '无法获得证件类别'
            })
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
      },
      // 时间转化
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      },
      // 获得学历列表
      getEducationtypeList () {
        let _this = this;
        serverRequest.getEducationtypeList().then(res => {
          if (res) {
            _this.educationBg = res
          } else {
            this.$message({
              type: 'error',
              message: '无法获得获得学历列表'
            })
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
      },
      // 获得机构内身份
      getOrgposition () {
        let _this = this;
        serverRequest.getOrgposition().then(res => {
          if (res) {
            _this.inistitutionBg = res
          } else {
            this.$message({
              type: 'error',
              message: '无法获得获得机构内身份'
            })
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
      },
      // 获得证书类别
      getPaperstypeItem () {
        let _this = this;
        serverRequest.getPaperstypeItem().then(res => {
          if (res) {
            _this.certificateType = res
          } else {
            this.$message({
              type: 'error',
              message: '无法获得获得获得证书类别'
            })
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
      },
    },
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../style/index.styl';
.serverInfo
  .tableContent
    background #f2f4f7
    text-align center
  .serverTable
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
  .el-table th
    background #E5F0FF
    height 40px
    line-height 40px
    color #000
  .el-table td
    height 40px 
    line-height 40px
    color #333
</style>

