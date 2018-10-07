<template>
  <div class="organIndex">
    <!--表格内容-->
    <div class="tableContent" v-loading="loading" element-loading-text="数据正在加载中...">
      <div class="pro-title" style="margin:20px 0;">机构纳税人信息</div>
      <form>
        <table class="w100p fontSize14 xdl">
          <tr>
            <td class="labelStyle">机构名称</td>
            <td class="valueStyle" v-text="organizationName"></td>
            <td class="labelStyle">统一社会信用代码</td>
            <td class="valueStyle" v-text="creditCode"></td>
          </tr>
          <tr>
            <td class="labelStyle">机构地址</td>
            <td class="valueStyle" v-text="organizationSite"></td>
            <td class="labelStyle">邮政编码</td>
            <td class="valueStyle" v-text="postCode"></td>
          </tr>
          <tr>
            <td class="labelStyle">法定代表人</td>
            <td class="valueStyle" v-text="politacalPeople"></td>
            <td class="labelStyle">联系电话</td>
            <td class="valueStyle" v-text="phone"></td>
          </tr>

          <tr>
            <td class="labelStyle">身份证件类型</td>
            <td class="valueStyle" v-text="displayIdCard"></td>
            <td class="labelStyle">身份证件号码</td>
            <td class="valueStyle" v-text="idNumber"></td>
          </tr>
          <tr>
            <td class="labelStyle">登记注册类型</td>
            <td class="valueStyle" v-text="displayRegType"></td>
            <td class="labelStyle">注册资金（元）</td>
            <td class="valueStyle" v-text="loginMoney"></td>
          </tr>
          <tr>
            <td class="labelStyle">成立时间</td>
            <td colspan="3" class="valueStyle" v-text="establishTime"></td>
          </tr>
          <tr>
            <td class="labelStyle">经营范围</td>
            <td colspan="3" class="valueStyle" v-text="manageRange">
              <!-- <el-input type="textarea" v-model='manageRange' :rows="4" :disabled='true' :style="{paddingRight: '10px', boxSizing: 'border-box', margin: '10px 0', display: 'block'}"></el-input> -->
            </td>
          </tr>
        </table>
        <div class="pro-title" style="margin:20px 0;">股东信息</div>
        <table class="w100p fontSize16 xd2 color9">
          <tr>
            <td class="reportColumn">股东姓名</td>
            <td class="reportColumn">股权比例</td>
            <td class="reportColumn">出资金额（元）</td>
          </tr>
          <tr class="color3" v-for="(item, key) in shareholders" :key="key">
            <td  style="text-align: center">{{item.name}}</td>
            <td style="text-align: center">{{item.equity*100}}%</td>
            <td style="text-align: center">{{item.amount}}</td>
          </tr>
        </table>
        <div class="pro-title" style="margin:20px 0;">机构补充信息</div>
        <table class="w100p fontSize14 xdl">
          <tr>
            <td class="labelStyle">服务状态</td>
            <td class="valueStyle" v-text="displayServiceStatus"></td>
            <td class="labelStyle">资产总额（元）</td>
            <td colspan="3" class="valueStyle" v-text="totalAsset"></td>
          </tr>
          <tr>
            <td class="labelStyle">人员总数</td>
            <td class="valueStyle" v-text="peopleNumber"></td>
            <td class="labelStyle">股东或合伙人人数</td>
            <td class="valueStyle" v-text="peopleNumberPartner"></td>
          </tr>
          <tr>
            <td class="labelStyle">是否设立党组织</td>
            <td class="valueStyle" v-text="isOrNot[party]"></td>
            <td class="labelStyle">党组织负责人</td>
            <td class="valueStyle" v-text="communistBoss"></td>
          </tr>
          <tr>
            <td class="labelStyle">机构类型</td>
            <td class="valueStyle" v-text="displayOrgType"></td>
            <td class="labelStyle">是否分支机构</td>
            <td class="valueStyle" v-text="isOrNot[branch]"></td>
          </tr>
          <tr>
            <td class="labelStyle">证书名称</td>
            <td class="valueStyle" v-text="displayLicenceType"></td>
            <td class="labelStyle">机构证书编码</td>
            <td class="valueStyle" v-text="licenceCode"></td>
          </tr>
          <tr>
            <td class="labelStyle">发证机关</td>
            <td class="valueStyle" v-text="licenceOffice"></td>
            <td class="labelStyle">发证日期</td>
            <td class="valueStyle" v-text="licenceTime"></td>
          </tr>
          <tr>
            <td class="labelStyle">行业协会</td>
            <td class="valueStyle">{{joinAssociation ? joinAssociation : '--'}}</td>
            <td class="labelStyle">行业协会会员编码</td>
            <td class="valueStyle">{{associationMemberCode ? associationMemberCode : '--'}}</td>
          </tr>
          <tr>

          </tr>
        </table>
        <!-- 底部按钮放在table外面 -->
        <p>

          <!-- kami -->
          <!-- <router-link :to="{path: '/editOrganization'}"><input type="button" class="editBtn btn1" value="更改"></router-link> -->
          <router-link v-if="serviceState === '03'" :to="{path: '/editOrganization'}">
            <el-button type="primary" class="editBtn">更改</el-button>

          </router-link>
          <!-- kami -->

          <template v-if="isDisabled">
            <router-link v-if="serviceState === '03'" :to="{path: '/stopServices', query: {organizationName: this.organizationName, creditCode: this.creditCode, taxOrgId: this.taxOrgId}}">
              <el-button class="editBtn" style="margin-left: 30px;">中止服务</el-button>
            </router-link>
            <router-link v-else :to="{path: '/recoverService', query: {organizationName: this.organizationName, creditCode: this.creditCode, taxOrgId: this.taxOrgId}}">
              <el-button class="editBtn">恢复服务</el-button>
            </router-link>
          </template>
        </p>
      </form>
    </div>
  </div>
</template>
<script>
  import { formatDate } from '../../../common/js/date.js'
  import { organizationRequest } from '@/services/request';

  export default {
    data() {
      return {
        loading: false,
        isDisabled: true,
        joinAssociation: '',
        communistBoss: '',
        associationMemberCode: '',
        taxOrgId: '',
        defaultOpen: ['2'],
        dialogTableVisible: false,
        showClose: false,
        organizationName: '',
        creditCode: '',
        phone: '',
        loginType: '',
        organizationSite: '',
        politacalPeople: '',
        registerType: '',
        idType: '',
        idNumber: '',
        postCode: '', // 邮政编码
        establishTime: '',
        loginMoney: '',
        serviceState: '',
        manageRange: '',
        taxPeopleCount: '',
        taxPeopleCountForeign: '',
        peopleNumber: '',
        peopleNumberPartner: '',
        organizationType: '',
        branch: '',
        licenceType: '',
        licenceCode: '',
        licenceOffice: '',
        licenceTime: '',
        totalAsset: '',
        party: '',
        websiteUrl: '',
        wechatAccounts: '',
        isOrNot: {
          0: '否',
          1: '是'
        },
        shareholders: [],
        orgTypeList: [],
        orgCertType: [],
        orgTypeCode: [],
        IdCardList: [],
        signType: [],
      }
    },
    mounted() {
      organizationRequest.getIsOrgrealname().then(data => {
        // let data = data.data;
        if (data.code === 7205) {
          this.isDisabled = true;
        } else if (data.code === 7206) {
          this.isDisabled = false; // 未实名
        }
      })
      this.getinfo();
      // 获取证书码值表
      organizationRequest.getOrgCertType().then((data) => {
        this.orgCertType = data;
      });
      // 获取机构类别码值表
      organizationRequest.getOrgTypeCode().then((data) => {
        this.orgTypeCode = data;
      });
      // 获取身份证件码值表
      organizationRequest.getIdCardList().then((data) => {
        this.IdCardList = data;
      });
      organizationRequest.getSignType().then((data) => {
        this.signType = data;
      })
    },
    methods: {
      // 格式化时间
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      },
      // 获取涉税机构基本信息
      getinfo() {
        this.loading = true;
        organizationRequest.getOrginfo().then(data => {
          this.loading = false;
          this.shareholders = data.data.shareholders;
          this.taxOrgId = data.data.taxOrgId
          this.joinAssociation = data.data.isJoinAssociation; // 行业协会
          this.communistBoss = data.data.communistBoss; // 党组织负责人
          this.associationMemberCode = data.data.associationMemberCode; // 行业协会会员编码
          this.organizationName = data.data.orgName; // 机构名称
          this.creditCode = data.data.socialCreditCode; // 信用代码
          this.phone = data.data.legalMobilePhone; // 联系电话
          this.loginType = data.data.regType; // 注册类型
          this.organizationSite = data.data.orgAddress; // 机构地址
          this.politacalPeople = data.data.legalPersonName; // 法定代表人
          this.idType = data.data.certType; // 身份证类型
          this.idNumber = data.data.certNumber; // 身份证证件号码
          this.postCode = data.data.postalCode; // 邮政编码
          // this.establishTime = data.data.foundTime; // 成立时间
          this.establishTime = this.formatDate(data.data.foundTime); // 成立时间
          this.loginMoney = data.data.regSum; // 注册资金
          this.serviceState = data.data.serviceStatus; // 服务状态
          this.manageRange = data.data.businessScope; // 经营范围--不可编辑
          this.taxPeopleCount = data.data.taxServicePersonSum; // 纳税人员总数
          this.taxPeopleCountForeign = data.data.taxServiceForeignSum; // 外籍人员总数
          this.peopleNumber = data.data.staffSum; // 人员总数
          this.peopleNumberPartner = data.data.partnerSum; // 股东或合伙人总数
          this.organizationType = data.data.orgType; // 机构类别
          this.branch = data.data.isBranchOrg; // 是否分支
          this.licenceType = data.data.licensePracticeType; // 执行证许可类别
          this.licenceCode = data.data.papersCode || '--'; // 机构证书编码
          this.licenceOffice = data.data.certAuthority || '--'; // 发证机关
          this.licenceTime = data.data.certDate ? this.formatDate(data.data.certDate) : '--'; // 发证日期
          this.totalAsset = data.data.assetSum; // 资产总额
          this.party = data.data.isFoundPartyBranch; // 是否设立党支部
          this.websiteUrl = data.data.website; // 网站地址
          this.wechatAccounts = data.data.weixinOfficialAccounts; // 微信公众号
        });
      }
    },
    computed: {
      displayOrgType() { // 回显机构类别，转码
        let code = this.organizationType;
        let type = '';
        this.orgTypeCode.map(function (val) {
          (parseInt(val.code) === parseInt(code)) && (type = val.name);
        })
        return type;
      },
      displayLicenceType() { // 回显证书名称，转码
        let code = this.licenceType;
        let type = '';
        this.orgCertType.map(function (val) {
          // (val.code === code) && (type = val.name);
          if (val.code === code) {
            type = val.name;
            if (type === '代理记账许可证书') {
              type = '代理记账许可证书或营业执照'
            }
          }
        })
        return type || '--';
      },
      displayServiceStatus() {
        const code = this.serviceState;
        let textArr = {
          '03': '正常',
          '04': '中止'
        }
        return textArr[code];
      },
      displayIdCard() {
        const code = this.idType;
        let value = '';
        this.IdCardList.map(function (v) {
          if (code === v.certCode) {
            value = v.certDesc;
          }
        })
        return value;
      },
      displayRegType() {
        const code = this.loginType;
        for (let i = 0; i <= this.signType.length; i += 1) {
          let tmp = this.signType[i];
          if (!tmp) return;
          if (code === tmp.regTypeCode) {
            return tmp.regTypeName;
          }
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import './style/index.styl';
.organIndex
  .tableContent {
    background: #f2f4f7;
    text-align: center;
    p {
      width: 100%;
    }
    .pro-title {
      color: #303133;
      margin-bottom: 15px;
      font-size: 18px;
      text-align: left;
      font-weight: 600;
    }
    .lineHeight23 {
      line-height: 23px !important;
    }
    .lineHeight16 {
      line-height: 16px !important;
    }
    .valueStyle {
      background: #fff;
      width:30%;
      text-align: left;
      padding-left: 20px;
      font-size: 14px;
      color: #333333;
    }
    .editBtn {
      margin-top: 30px;
      margin-bottom: 40px;
    }
    .subhead {
      color: #4680ff;
      font-size: 16px;
      letter-spacing: 1px;
    }
    table>tr>td {
      display: table-cell;
      vertical-align: middle;
      border: 1px solid #dfdfdf;
      padding: 3px 10px;
      text-align: left;
      line-height: 34px;
      background: #fff;
    }

    .labelStyle {
      background: #E5F0FF;
      width: 200px;
      text-align: left;
    }

    .el-table td,
    .el-table th {
      color: #000;
    }

    .reportColumn {
      background: #E5F0FF;
      color: #333;
      text-align: center;
      padding: 3px 0;
    }
  }
</style>