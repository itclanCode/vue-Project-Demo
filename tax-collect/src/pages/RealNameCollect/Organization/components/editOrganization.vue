<template>
  <div class="editOrganization" v-loading="loading" element-loading-text="数据正在加载中...">
  <div class='mainWrap' >
    <div class='tableWrap'>
      <el-form ref='form' :model='form' :rules='rules' :label-position='labelPosition'>
          <div class="pro-title" style="margin:20px 0;">机构纳税人信息</div>
        <table style='table-layout:fixed;word-wrap:break-word'>
          <tr>
                <td class="labelStyle">机构名称</td>
                <td class="v_disabled">{{form.name}}</td>
                <td class="labelStyle">统一社会信用代码</td>
                <td class="v_disabled">{{form.ird}}</td>
          </tr>
          <tr>
              <td class="labelStyle">机构地址</td>
              <td class="v_disabled">{{form.address}}</td>
              <td class="labelStyle">邮政编码</td>
              <td class="v_disabled">{{form.zipcode}}</td>
          </tr>
          <tr>
            <td class="labelStyle">法定代表人</td>
            <td class="v_disabled">{{form.referee}}</td>
            <td class="labelStyle">联系电话</td>
            <td class="v_disabled">{{form.phone}}</td>
          </tr>
          <tr>
              <td class="labelStyle">身份证件类型</td>
              <td class="v_disabled">{{displayIdCard}}</td>
              <td class="labelStyle">身份证件号码</td>
            <td class="v_disabled">{{form.idNo}}</td>
            
          </tr>
          <tr>
              <td class="labelStyle">登记注册类型</td>
              <td class="v_disabled">{{displayRegType}}</td>
              <td class="labelStyle">注册资金（元）</td>
            <td class="v_disabled">{{form.registerMoney}}</td>
          </tr>
          <tr>
            <td class="labelStyle">成立时间</td>
            <td class="v_disabled" colspan="3">{{form.regtime}}</td>
          </tr>
          <tr>
              <td class="labelStyle">经营范围</td>
              <td class="v_disabled" colspan="3">{{form.businessScope}}</td>
          </tr>
        </table>
        <div class="pro-title" style="margin:20px 0;">股东信息</div>
        <table class="w100p fontSize16 xd2 color9">
          <tr>
            <td class="reportColumn">股东姓名</td>
            <td class="reportColumn">股权比例</td>
            <td class="reportColumn">出资金额（元）</td>
          </tr>
          <tr class="color3" v-for="(item, key) in shareholders" :key="key" >
            <td style="text-align: center">{{item.name}}</td>
            <td style="text-align: center">{{item.equity*100}}%</td>
            <td style="text-align: center">{{item.amount}}</td>
          </tr>
        </table>
        <div class="pro-title" style="margin:20px 0;">机构补充信息</div>
        <table >
          <tr>
              <td class="labelStyle"><span class="red">*</span>服务状态</td>
              <td>
                  <el-form-item  prop='serviceStatus'>
                      <el-select v-model="form.serviceStatus" placeholder="请选择服务状态" :disabled='isDisabled'>
                        <el-option label="正常" value="03">正常</el-option>
                        <el-option label="中止" value="04">中止</el-option>
                      </el-select>
                    </el-form-item>
              </td>
              <td class="labelStyle"><span class="red">*</span>资产总额（元）</td>
              <td>
                  <el-form-item label='' prop='totalAssets' :show-message=false>
                      <el-input type='number' v-model='form.totalAssets' min=0></el-input>
                    </el-form-item>
              </td>
          </tr>
          <tr>
              <td class="labelStyle"><span class="red">*</span>人员总数</td>
              <td>
                <el-form-item prop='totalNo' :show-message=false>
                  <el-input type='number' v-model='form.totalNo' min=0></el-input>
                </el-form-item>
              </td>
              <td class="labelStyle"><span class="red">*</span>股东或合伙人人数</td>
              <td>
                <el-form-item  prop='shareholderNo' :show-message=false>
                  <el-input type='number' v-model='form.shareholderNo' min=0></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
                <td class="labelStyle"><span class="red">*</span>是否设立党组织</td>
                <td>
                    <el-form-item  prop="organization" :show-message=false>
                      <el-radio-group v-model='form.organization'>
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </td>
                  <td class="labelStyle"><span class="red">*</span>党组织负责人</td>
                  <td>
                    <el-form-item prop="CCPLeader" :show-message=false>
                      <el-input v-model="form.CCPLeader" :disabled='isDisabled || !form.organization'></el-input>
                    </el-form-item>
                  </td>

            </tr>
            <tr>
                <td class="labelStyle"><span class="red">*</span>机构类型</td>
            <td>
              <el-form-item prop='organizationType'>
                <el-select v-model='form.organizationType' class="orgType" value-key='label' @change="clear" placeholder='请选择机构类别'>
                  <el-option v-for='(item, key) in options' :key='key' :label='item.label' :value='item.value'></el-option>
                </el-select>
              </el-form-item>
            </td>
            <td class="labelStyle"><span class="red">*</span>是否分支机构</td>
            <td>
              <el-form-item prop='radio' :show-message=false>
                <el-radio-group v-model='form.radio'>
                  <el-radio :label='1'>是</el-radio>
                  <el-radio :label='0'>否</el-radio>
                </el-radio-group>
              </el-form-item>
            </td>
          </tr>
          <tr>
              <td class="labelStyle"><span class="red">*</span>证书名称</td>
            <td>
              <el-form-item prop='permitType' :show-message=false>
                <div class="v_disabled">{{form.permitType}}</div>
              </el-form-item>
            </td>
            <td class="labelStyle"><span class="red">*</span>机构证书编码</td>
            <!-- <td>
              <el-form-item prop='certificateCode' :show-message=false>
                <div class="v_disabled">{{form.certificateCode}}</div>
              </el-form-item>
            </td> -->
            <td>
              <el-form-item prop='certificateCode' :show-message=false>
                <el-input v-model='form.certificateCode' :disabled='cursor.controlByOrgtype'></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
              <td class="labelStyle"><span class="red" >*</span>发证机关</td>
            <td>
              <el-form-item prop='issuer' :show-message=false>
                <el-input v-model='form.issuer' :disabled='cursor.controlByOrgtype'></el-input>
              </el-form-item>
            </td>
            <!-- <td>
              <el-form-item prop='issuer' :show-message=false>
                <div class="v_disabled">{{form.issuer}}</div>
              </el-form-item>
            </td> -->
            <td class="labelStyle"><span class="red">*</span>发证日期</td>
            <td>
              <el-form-item prop='issuingDate' :show-message=false>
                <!-- <el-input v-model='form.issuingDate'></el-input> -->
                <el-date-picker
                  v-if='cursor.canEdit'
                  v-model='form.issuingDate'
                  type='date'
                  default-value='2010-10-01'
                  align='center'
                  :disabled='cursor.controlByOrgtype'
                  >
                </el-date-picker>
                <div class="v_disabled" v-else>--</div>
              </el-form-item>
            </td>
          </tr>
          <tr>
              <td class="labelStyle">行业协会</td>
            <td>
              <el-form-item prop="isAssociation" :show-message=false>
                <el-input v-model='form.isAssociation' :disabled='isDisabled'></el-input>
              </el-form-item>
            </td>
            <td class="labelStyle">行业协会会员编码</td>
            <td>
              <el-form-item prop="mid" :show-message=false>
                <el-input v-model="form.mid" :disabled='isDisabled'></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    <div class='btns'>
      <el-button type="primary" @click='changeProfile()'>确认</el-button>
      <router-link to='/organization'>
        <el-button style="margin-left: 30px;">取消</el-button>
      </router-link>
    </div>
  </div>
</div>
</div>
</template>
<script>
  import { formatDate } from '../../../../common/js/date.js';
  import { organizationRequest } from '@/services/request';
  export default {
    mounted() {
      this.loading = true;
      organizationRequest.getIsOrgrealname().then(data => {
        this.loading = false;
        // if (data.code === 7205) {
        //   this.isDisabled = true;
        // } else if (data.code === 7206) {
        //   this.isDisabled = false;
        // }
      });
      // this.isDisabled = this.$root.isRealName; // 从根节点获取用户实名状态
      organizationRequest.getOrginfo().then(data => {
        this.loading = false;
        let orginfo = data.data;
        this.form.name = orginfo.orgName;
        this.form.ird = orginfo.socialCreditCode;
        this.form.phone = orginfo.legalMobilePhone;
        this.form.registrationType = orginfo.regType;
        this.form.address = orginfo.orgAddress;
        this.form.referee = orginfo.legalPersonName;
        this.form.cardType = orginfo.certType;
        this.form.idNo = orginfo.certNumber;
        this.form.zipcode = orginfo.postalCode;
        this.form.regtime = this.formatDate(orginfo.foundTime);
        this.form.registerMoney = orginfo.regSum;
        this.form.serviceStatus = orginfo.serviceStatus;
        this.form.businessScope = orginfo.businessScope;
        this.form.totalStaff = orginfo.taxServicePersonSum;
        this.form.foreignersNo = orginfo.taxServiceForeignSum;
        this.form.totalNo = orginfo.staffSum;
        this.form.shareholderNo = orginfo.partnerSum;
        this.form.organizationType = orginfo.orgType
        this.form.certificateCode = orginfo.papersCode;
        this.form.issuer = orginfo.certAuthority;
        this.form.issuingDate = orginfo.certDate === -28800000 ? '' : orginfo.certDate;
        this.form.totalAssets = orginfo.assetSum;
        this.form.organization = orginfo.isFoundPartyBranch;
        this.form.website = orginfo.website;
        this.form.vipcn = orginfo.weixinOfficialAccounts;
        this.form.radio = orginfo.isBranchOrg;
        this.form.taxOrgId = orginfo.taxOrgId;
        this.form.permitCode = orginfo.licensePracticeType;
        this.form.CCPLeader = orginfo.communistBoss;
        this.form.mid = this.isDisabled === true ? (orginfo.associationMemberCode ? orginfo.associationMemberCode : '--') : '';
        this.form.isAssociation = this.isDisabled === true ? (orginfo.isJoinAssociation ? orginfo.isJoinAssociation : '--') : '';
        this.shareholders = orginfo.shareholders;
      });
      organizationRequest.getOrgTypeCode().then((data) => {
        this.orgTypeCode = data;
        let that = this;
        this.orgTypeCode.map(function (v) {
          that.options.push(
            {
              label: v.name,
              value: v.code
            }
          )
        })
      });
      organizationRequest.getOrgCertType().then((data) => {
        this.orgCertType = data;
      });
      organizationRequest.getSignType().then((data) => {
        this.signType = data;
      });
      // 获取身份证件码值表
      organizationRequest.getIdCardList().then((data) => {
        this.IdCardList = data;
      });
    },
    data() {
      return {
        loading: false,
        shareholders: [],
        isDisabled: false,
        defaultOpen: ['2'],
        tabPosition: 'top',
        activeName: 'first',
        labelPosition: 'right',
        disabled: false,
        orgTypeCode: [], // 存储机构名称码值表
        orgCertType: [], // 存储证书
        signType: [],
        IdCardList: [],
        tmp: {},
        cursor: {
          controlByOrgtype: true,
          must_choose: true,
          canEdit: true,
        },
        isOrNot: {
          0: '否',
          1: '是'
        },
        form: {
          name: '', // 机构名称
          ird: '', // 税号
          phone: '', // 联系电话
          registrationType: '', // 登记注册类型
          address: '', // 机构地址
          referee: '', // 法定代表人
          cardType: '', // 身份证类型
          idNo: '', // 身份证号码
          zipcode: '', // 邮政编码
          regtime: '', // 成立时间
          registerMoney: '', // 注册资金
          serviceStatus: '', // 服务状态
          businessScope: '', // 经营范围
          totalStaff: '', // 从事情涉税服务人员总数
          foreignersNo: '', // 从事情涉税服务外籍人员总数
          totalNo: '', // 人员总数
          shareholderNo: '', // 股东或合伙人人数
          organizationType: '', // 机构类别
          permitType: '', // 执业许可证类别
          permitCode: '', // 执业许可证码值
          certificateCode: '', // 机构证书编码
          issuer: '', // 发证机关
          issuingDate: '', // 发证日期
          totalAssets: '', // 资产总额
          organization: '0', // 是否设立党组织
          website: '', // 网址
          vipcn: '', // 微信公众号
          radio: '0',
          taxOrgId: '',
          CCPLeader: '', // 党组织负责人
          isAssociation: '',
          mid: ''// 行业协会会员编码
        },
        options: [],
        rules: {
          name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
          ird: [{ required: true, message: '请输入税号', trigger: 'blur' }],
          phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
          registrationType: [
            { required: true, message: '请输入登记注册类型', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入机构地址' }
          ],
          referee: [
            { required: true, message: '请输入法定代表人' }
          ],
          cardType: [
            { required: true, message: '请输入身份证类型' }
          ],
          idNo: [
            { required: true, message: '请输入身份证号码' }
          ],
          zipcode: [
            { required: true, message: '请输入邮政编码' }
          ],
          regtime: [
            { required: true, message: '请输入成立时间' }
          ],
          registerMoney: [
            { required: true, message: '请输入注册资金' }
          ],
          serviceStatus: [
            { required: true, message: '请输入服务状态' }
          ],
          businessScope: [
            { required: true, message: '请输入经营范围' }
          ],
          // CCPLeader: [{ required: true, message: '请输入党组织负责人', trigger: 'blur' }],
          totalStaff: [
            {
              pattern: /^([1-9]\d*|[0]{1,1})$/,
              message: '请输入非负整数',
              trigger: 'blur'
            }
          ],
          foreignersNo: [
            {
              pattern: /^([1-9]\d*|[0]{1,1})$/,
              message: '请输入非负整数',
              trigger: 'blur'
            }
          ],
          totalNo: [
            { required: true, message: '请输入人员总数', trigger: 'blur' },
            {
              pattern: /^([1-9]\d*|[0]{1,1})$/,
              message: '请输入非负整数',
              trigger: 'blur'
            }
          ],
          shareholderNo: [
            {
              required: true,
              message: '请输入股东或合伙人人数',
              trigger: 'blur'
            },
            {
              pattern: /^([1-9]\d*|[0]{1,1})$/,
              message: '请输入非负整数',
              trigger: 'blur'
            }
          ],
          CCPLeader: [
          { required: true, message: '请输入党组织负责人', trigger: 'blur' }
          ],
          organizationType: [
            { required: true, message: '请输入机构类别', trigger: 'blur' }
          ],
          permitType: [
            { required: true, message: '请输入执业许可证类别', trigger: 'blur' }
          ],
          certificateCode: [
            { required: true, message: '请输入机构证书编码', trigger: 'blur' }
          ],
          issuer: [
            { required: true, message: '请输入发证机关', trigger: 'blur' }
          ],
          issuingDate: [
            { required: true, message: '请输入发证日期', trigger: 'blur' }
          ],
          totalAssets: [
            { required: true, message: '请输入资产总额', trigger: 'blur' },
            {
              pattern: /^([1-9]\d*|[0]{1,1})$/,
              message: '请输入非负整数',
              trigger: 'blur'
            }
          ],
          radio: [{ required: true, message: '请选择是否分支结构', trigger: 'blur' }],
          organization: [{ required: true, message: '请选择是否', trigger: 'blur' }],
        }
      };
    },
    methods: {
      // 消息提示框
      open() {
        this.$notify.info({
          title: '提示',
          message: '您的机构类型为税务师事务所，请先进行税务师事务所行政登记'
        });
      },
      clear() {
        this.form.permitCode = '';
        this.form.permitType = '';
        this.form.certificateCode = '';
        this.form.issuer = '';
        this.form.issuingDate = '';
      },
      // 机构类别更改
      getOrgType(code) {
        let type = '';
        this.orgTypeCode.map(function (val) {
          if (parseInt(val.orgTypeCode) === code) {
            type = val.orgTypeDesc;
          }
        })
        return type;
      },
      getCertType(code) {
        let type = '';
        this.orgCertType.map(function (val) {
          if (val.code === code) {
            type = val.name;
            if (type === '代理记账许可证书') {
              type = '代理记账许可证书或营业执照'
            }
          }
        })
        return type;
      },
      changeCategory() {
        global.vue = this;
        const codeTypeArr = { // 配置机构类别证书码值对应表
          '01': '61',
          '02': '62',
          '03': '63',
          '04': '64',
        };
        let that = this;
        const code = that.form.organizationType;
        this.cursor.canEdit = !!codeTypeArr[code];
        this.cursor.must_choose = codeTypeArr[code] ? 1 : 0;
        this.rules.issuer[0].required = this.cursor.must_choose;
        this.rules.issuingDate[0].required = this.cursor.must_choose;
        this.rules.permitType[0].required = this.cursor.must_choose;
        this.rules.certificateCode[0].required = this.cursor.must_choose;
        this.form.permitType = this.getCertType(codeTypeArr[code]); // 证书名称
        this.form.permitCode = codeTypeArr[code];
        // 是否可编辑
        if (codeTypeArr[code]) {
          this.cursor.controlByOrgtype = false;
        } else {
          this.cursor.controlByOrgtype = true;
          this.form.certificateCode = '--';
          this.form.permitType = '--';
          this.form.issuer = '--';
          // this.form.issuingDate = '--';
        }
      },
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      },
      // 提交表单
      changeProfile() {
        console.log(this.rules);
        this.$refs['form'].validate((valid) => {
          if (valid) {
            const date = new Date(this.form.issuingDate).valueOf();
            // todo 缺 taxServicePersonSum taxServiceForeignSum
            let data = {
              taxOrgId: this.form.taxOrgId || '',
              orgType: this.form.organizationType || '', // 机构类别
              certNumber: this.form.idNo || 0,
              staffSum: this.form.totalNo || 0,
              partnerSum: this.form.shareholderNo || 0,
              licensePracticeType: this.form.permitCode || 0, // 执业许可证
              isFoundPartyBranch: this.form.organization || 0, // 是否设立党组织
              isBranchOrg: this.form.radio || 0, // 是否分支机构
              assetSum: this.form.totalAssets || 0, // 资产总额
              papersCode: this.form.certificateCode === '--' || !this.form.certificateCode ? '' : this.form.certificateCode, // 机构证书编码
              certAuthority: this.form.issuer === '--' || !this.form.issuer ? '' : this.form.issuer, // 发证机关
              certDate: date,
              isJoinAssociation: this.form.isAssociation || null, // 是否加入行业协会
              associationMemberCode: this.form.mid || '', // 行业协会编码
              communistBoss: this.form.CCPLeader === '--' ? '' : this.form.CCPLeader, // 党组织负责人
              serviceStatus: this.form.serviceStatus,
            }
            organizationRequest.updateOrginfo(data).then(res => {
              const errMsg = {
                7404: '您选择的机构类型为税务师事务所，请先办理税务师事务所行政登记',
                7208: '机构类别已变更, 请办理税务师事务所行政登记终止',
              }
              const that = this;
              const msg = errMsg[res.code];
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功！'
                })
                let t = setTimeout(function () {
                  that.$router.push({ path: '/organization' });
                  clearTimeout(t);
                }, 1000)
              } else if (res.code === 7208) {
                this.$alert(msg, '操作成功', {
                  callback: () => {
                    that.$router.push({ path: '/organization' });
                  }
                });
              } else if (res.code === 7404) {
                this.$alert(msg, '操作失败', {
                  callback: () => {
                    that.isDisabled && that.$router.push({ path: '/organization' });
                  }
                });
              } else {
                this.$alert(res.error, '操作失败', {
                  callback: () => {
                    that.isDisabled && that.$router.push({ path: '/organization' });
                  }
                });
              }
            })
          } else {
            window.Alert('必填信息未填完整');
          }
        })
      },
    },
    watch: {
      disabled: function (val) {
        if (val) {
          this.rules.certificateCode = [{ required: false }];
          this.rules.issuer = [{ required: false }];
          this.rules.issuingDate = [{ required: false }];
          this.rules.permitType = [{ required: false }];
          this.rules = { ...this.rules }
        } else {
          this.rules.certificateCode = [{ required: true, message: '请输入机构证书编码', trigger: 'blur' }];
          this.rules.issuer = [{ required: true, message: '请输入发证机关', trigger: 'blur' }];
          this.rules.issuingDate = [{ required: true, message: '请输入发证日期', trigger: 'blur' }];
          this.rules.permitType = [{ required: true, message: '请输入执业许可证类别', trigger: 'blur' }];
        }
      },
      'form.organizationType': function () {
        this.changeCategory();
      },
      'form.organization': function () {
        if (!this.isDisabled) this.form.CCPLeader = '';
        if (!this.form.organization) this.form.CCPLeader = '--';
      }
    },
    computed: {
      displayIdCard() {
        const code = this.form.cardType;
        let value = '';
        this.IdCardList.map(function (v) {
          if (code === v.certCode) {
            value = v.certDesc;
          }
        })
        return value;
      },
      displayRegType() {
        const code = this.form.registrationType;
        for (let i = 0; i <= this.signType.length; i += 1) {
          let tmp = this.signType[i];
          if (!tmp) return;
          if (code === tmp.regTypeCode) {
            return tmp.regTypeName;
          }
        }
      }
    }
  };
</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
@import '../style/editOrganization.styl';
.v_disabled{
  line-height: 20px;
  padding: 14px 15px;
  font-size: 16px;
  color: #999;
}
.form_label_styl{
  font-size: 16px;
  color: #999;
  }
</style>