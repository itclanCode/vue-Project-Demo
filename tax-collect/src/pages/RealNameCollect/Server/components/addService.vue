<template>
  <div class="addServer">
    <div class='tableContent'>
      <div class="infoTitle">基本信息</div>
      <table class="marginTop15 addServerTable fontSize14">
        <tr>
          <td class="labelStyle"><span class='red'>*</span > 姓名</td>
          <td class="valueStyle">
            <input type='text' class='inputText' :disabled="isTaxOffice" v-model='server.personName'>
          </td>
          <td class="labelStyle"><span class='red'>*</span > 性别</td>
          <td class="valueStyle">
            <el-radio-group v-model='server.sex'>
              <el-radio :label='1' class='radio_label'>男</el-radio>
              <el-radio :label='0' class='radio_label'>女</el-radio>
            </el-radio-group>
          </td>
        </tr>
        <tr>
          <td class="labelStyle"><span class='red'>*</span > 证件类别</td>
          <td class="valueStyle">
            <el-select 
              placeholder='请选择证件类别'
              class='select'
              v-model="server.certType" 
              :disabled="isTaxOffice || editEPhone || isPhoneInfo"
              >
              <el-option 
                v-for='item in idType'
                :value='item.certCode'
                :label="item.certDesc"
                :key='item.certCode'
                >
              </el-option>
            </el-select>
          </td>
          <td class="labelStyle"><span class='red'>*</span > 证件号码</td>
          <td class="valueStyle">
            <input 
              type='text'
              class='inputText'
              @blur="checkCertNumber(server.certNumber)"
              v-model='server.certNumber'
              :disabled="isTaxOffice || editEPhone || !isAdd || isPhoneInfo"
            >
          </td>
        </tr>
        <tr>
          <td class="labelStyle"><span class='red'>*</span > 从事纳税专业服务时间(年)</td>
          <td class="valueStyle">
            <input 
              type='text'
              v-model="server.taxServiceTime" 
              class="inputText"
              >
          </td>
          <td class="labelStyle"><span class='red'>*</span > 移动电话</td>
          <td class="valueStyle">
            <input 
              type='text'
              @blur="checkPhoneNum(server.mobilePhone)"
              required
              class='inputText'
              v-model='server.mobilePhone'
              :disabled="!isAdd"
            >
          </td>
        </tr>
        <tr>
          <td class="labelStyle"><span class='red'>*</span > 学历</td>
          <td class="valueStyle">
            <el-select  
              placeholder='请选择学历' 
              required 
              class='select' 
              v-model='server.education'
            >
              <el-option 
                v-for='item in educationBg' 
                :value='item.educationCode' 
                :label='item.educationDesc' 
                :key='item.educationCode'
              >
              </el-option>
            </el-select>
          </td>
          <td class="labelStyle"><span class='red'>*</span > 政治面貌</td>
          <td class="valueStyle">
            <el-select  
              placeholder='请选择政治面貌' 
              required 
              class='select' 
              v-model='server.politicalStatus'
            >
              <el-option 
                v-for='item in politicalType' 
                :value='item.politicsStatusCode' 
                :label='item.politicsStatusDesc' 
                :key='item.politicsStatusCode'
              >
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="labelStyle">电子邮箱</td>
          <td class="valueStyle">
            <input 
              type='text' 
              required 
              class='inputText' 
              v-model='server.email'
            >
          </td>
          <td class="labelStyle"><span class='red'>*</span > 是否党支部书记(党组织负责人)</td>
          <td class="valueStyle">
            <el-radio-group 
              v-model='server.isPartyOrgLeader'
            >
              <el-radio :label='1' class='radio_label'>是</el-radio>
              <el-radio :label='0' class='radio_label'>否</el-radio>
            </el-radio-group>
          </td>
        </tr>
        <tr>
          <td class="labelStyle"><span class='red'>*</span > 机构内身份</td>
          <td class="valueStyle">
            <el-select
              placeholder='请选择机构内身份' 
              required 
              class='select' 
              v-model='server.orgPosition'
            >
              <el-option 
                v-for='item in inistitutionBg' 
                :value='item.orgInnerIdentityCode' 
                :label='item.orgInnerIdentityDescribe' 
                :key='item.orgInnerIdentityCode'
              >
              </el-option>
            </el-select>
          </td>
          <td class="labelStyle"><span class='red'>*</span > 是否政协委员</td>
          <td class="valueStyle">
            <el-radio-group v-model='server.isCommittee'>
              <el-radio :label='1' class='radio_label'>是</el-radio>
              <el-radio :label='0' class='radio_label'>否</el-radio>
            </el-radio-group>
          </td>
        </tr>
        <tr>
          <td class="labelStyle"><span class='red'>*</span > 是否人大代表</td>
          <td class="valueStyle">
            <el-radio-group v-model='server.isCongress' @change="isCongressLevel(server.isCongress)">
              <el-radio :label='1' class='radio_label'>是</el-radio>
              <el-radio :label='0' class='radio_label'>否</el-radio>
            </el-radio-group>
          </td>
          <td class="labelStyle">人大代表等级</td>
          <td class="valueStyle">
            <input 
              type='text' 
              required 
              class='inputText' 
              :disabled='!server.isCongress' 
              v-model='server.congressLevel'
            >
          </td>
        </tr>
        <tr>
          <td class="labelStyle">
            <span>
              <span class='red'>*</span > 代理范围
              <template v-if="activeNames">
                (<span class='colorBl cursor' @click='handleChange'>收起列表</span>)
              </template>
              <template v-else>
                (<span class='colorBl cursor' @click='handleChange'>选择项目</span>)
              </template>
            </span>
          </td>
          <td class="valueStyle" colspan='3'>
            <div>
              <span 
                v-for="(oneItem,index) in selectcarouselList.oneItem" 
                :key="index" 
                v-if="selectcarouselList.oneItem.length"
              >
                {{oneItem.name}}
                <i v-if="index!=selectcarouselList.oneItem.length-1"> ， </i>
              </span>
              <br v-if="selectcarouselList.oneItem.length">
              <span 
                v-for="(twoItem,index) in selectcarouselList.twoItem" 
                :key="index" 
                v-if="selectcarouselList.twoItem.length"
              >
                {{twoItem.name}}
                <i v-if="index!=selectcarouselList.twoItem.length-1"> ， </i>
              </span>
              <br v-if="selectcarouselList.twoItem.length">
              <span 
                v-for="(lastItem,index) in selectcarouselList.lastItem" 
                :key="index" 
                v-if="selectcarouselList.lastItem.length"
              >
                {{lastItem.name}}
                <i v-if="index!=selectcarouselList.lastItem.length-1"> ， </i>
              </span>
            </div>
            <el-collapse v-model="activeNames">
              <el-collapse-item title="代理范围选择" name="1">
                <div style="height:260px;overflow-y: scroll">
                  <el-tree
                    :data="carouselList"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    highlight-current
                    :expand-on-click-node="false"
                    :props="defaultProps"
                    @check-change="checkChange"
                  >
                  </el-tree>
                </div>
              </el-collapse-item>
            </el-collapse>
          </td>
        </tr>
        <tr>
          <td class="labelStyle" style="position: relative">
            <span class="textareaLabel"><span class='red'>*</span > 从事涉税专业服务情况</span>
          </td>
          <td colspan='3' class="valueStyle textareaTd">
            <el-input
              class="textarea"
              type="textarea"
              :rows="5"
              placeholder="请输入该人员的从事涉税专业服务的情况"
              v-model="server.taxServiceSituation"
              maxlength="2000"
            >
            </el-input>
          </td>
        </tr>
      </table>
      <div class="infoTitle">职业资格证书采集
        <span class='assign' @click='addCertificateItem'>添加证书</span>
      </div>
      <el-table :data="listData" class="xd2" border>
        <el-table-column label="证书类别" align="center">
          <template slot-scope="scope">
            <el-select  
              placeholder='请选择证件类别'
              class="select"
              v-model='scope.row.papersCode'
              :disabled="scope.row.papersCode !== '99' && !(scope.row.papersCode === '' || scope.row.papersCode === null) && isTaxOffice"
              @change="certificateInputChange(scope.row,scope.row.papersNumber,certificateRules)"
            >
              <el-option 
                v-for='item in certificateRules' 
                :value='item.papersCode' 
                :label="item.papersDesc"
                :key='item.papersCode' 
                :disabled="item.disable && item.papersDesc !== '其他'"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="证书编号" align="center">
          <template slot-scope="scope">
            <el-input 
              v-model="scope.row.papersNumber"
              class="inputText"
              @input="certificateInputChange(scope.row, scope.row.papersNumber)"
              :disabled="scope.row.papersCode !== '99' && !(scope.row.papersCode === '' || scope.row.papersCode === null) && isTaxOffice"
              placeholder="请输入证书编号"
            >
            </el-input>
            <span class="tipText" v-show="scope.row.rules">{{scope.row.rulesText}}</span>
          </template>
        </el-table-column>
        <el-table-column label="证书取得时间" align="center">
          <template slot-scope="scope">
            <el-date-picker
              v-model='scope.row.papersLicenceTime'
              type='date'
              placeholder='选择日期'
              class="datePicker"
            >
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="证书发证机关" align="center">
          <template slot-scope="scope">
            <el-input 
              class="inputText"
              v-model="scope.row.papersLicenceOrg"
              placeholder="请填写发证机关"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="行业协会会员编号" align="center">
          <template slot-scope="scope">
            <el-input 
              class="inputText"
              v-model="scope.row.associationMemberCode"
              placeholder="请填写会员编号"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button 
              :disabled="scope.row.papersCode !== '99' && !(scope.row.papersCode === '' || scope.row.papersCode === null)  && isTaxOffice"
              type="danger" 
              @click="handleDel(scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 按钮 -->
      <div class="marginTop20">
        <el-button type="primary" @click='submitBtn(server, listData)' v-if="isAdd">添加</el-button>
        <el-button type="primary" @click='submitBtn(server, listData)' v-if="!isAdd">保存</el-button>
        <router-link to='/server'><el-button type="info" plain>返 回</el-button></router-link>
      </div>
      <el-dialog title='提示' :visible.sync='centerDialogVisible_chooseProject' width='30%' center>
        <span>请选择项目内容 </span>
        <span slot='footer' class='dialog-footer'>
          <el-button type='primary' @click='centerDialogVisible_chooseProject = false'>确定</el-button>
          <el-button @click='centerDialogVisible_chooseProject = false'>取消</el-button>
        </span>
      </el-dialog>
      <!--服务范围-->
      <!-- 弹出框-身份证已经注册过 -->
      <!-- <el-button type="text" @click="centerDialogVisible_isReg = false">证件号码状态为2的弹出框</el-button> -->
      <el-dialog
        title='提示'
        :visible.sync='centerDialogVisible_isReg'
        width='30%'
        center>
        <p @click="bringMes()">点击</p>
        <span>“姓名：{{server.personName}}，证件类别：{{server.certType}}，证件号码：{{server.certNumber}} 已在本平台上注册，是否继续添加 </span>
        <span slot='footer' class='dialog-footer'>
          <el-button type='primary' @click='centerDialogVisible_isReg = false'><span>是</span></el-button>
          <el-button @click='centerDialogVisible_isReg = false'><span>否</span></el-button>
        </span>
      </el-dialog>
      <!--手机校验-->
      <el-dialog title='手机号码确认' :visible.sync="dialogTableVisible_pho" :width="'600px'"
        center :show-close='showClose1'
        class="dialog_pho"
        :close-on-click-modal="closemodal=false">
        <table>
          <tr class="dialog-tr">
            <td class="dialog-name">涉税代理服务人员手机号</td>
            <td class="dialog-value">
              {{server.mobilePhone || '--'}}
            </td>
          </tr>
          <tr class="dialog-tr">
            <td class="dialog-name">短信校验码</td>
            <td class="dialog-value" style="position:relative">
              <input type="text" required class="input-text" v-model="securityCode" id="phonecode" placeholder="请输入验证码">
              <span class="code-btn">
                <el-button type="primary" size="small" @click="getCode($event)" round v-if="!getCodeBtn.disabled">{{getCodeBtn.text}}</el-button>
                <el-button type="info" size="small" v-else  round :disabled="getCodeBtn.disabled">{{getCodeBtn.text}}</el-button>
              </span>
            </td>
          </tr>
        </table>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="endSure(server)" round>确定</el-button>
          <el-button @click="Cancel2()" round>取 消</el-button>
        </span>
      </el-dialog>

      <!-- 弹出框-添加成功 -->
      <el-dialog title='' :visible.sync='centerDialogVisible' width='30%' center>
        <i class='el-icon-circle-check-outline'></i>
        <p class='successAdd'>恭喜您成功添加税务服务代理人</p>
        <div class="marginTop20">
          <span class="fontSize14" style="color:rgba(100,100,100,1)">
            您已成功添加代理人，后续代理人可以通过个人账号登录本平台，为他们的客户更便捷的处理办税业务，敬请期待！
          </span>
        </div>
        <div slot='footer' class='dialog-footer'>
            <el-button type='primary' @click='goon' class="marginRight50" round>继续添加</el-button>
            <router-link to='/server'>
            <el-button  @click='centerDialogVisible = false' round>返回</el-button>
          </router-link>
        </div>
      </el-dialog>
      <!-- 弹出框-编辑成功 -->
      <el-dialog title='' :visible.sync='editDialogVisible' width='30%' center>
        <i class='el-icon-circle-check-outline'></i>
        <p class='successAdd'>恭喜您成功修改税务服务代理人</p>
        <div class="marginTop20">
          <span class="fontSize14" style="color:rgba(100,100,100,1)">
            本平台已将初始密码短信发送至代理人手机，税务代理人可凭姓名货手机号及初始密码登录本平台，为他们的客户更便捷的处理办税业务！
          </span>
        </div>
        <div slot='footer' class='dialog-footer'>
          <router-link to='/server'>
            <el-button  @click='editDialogVisible = false' round>返回</el-button>
          </router-link>
        </div>
      </el-dialog>

    </div>
  </div>
</template>
<script>
  import { formatDate } from '../../../../common/js/date.js'
  import { serverRequest } from '@/services/request';
  export default {
    data() {
      return {
        isCongressLevelWrite: true,
        isPhoneInfo: false,
        editEPhone: false,
        isAdd: true,   // 添加状态(true)或者编辑状态(false)
        taxOffice: {
          isTaxOffice: false,
          certificate: false
        },
        isTaxOffice: false, // 税务师事务所(true)
        activeNames: '',
        services: {
          initNodes: [],
          serviceSaveNodes: [],
        },
        getCodeBtn: {
          text: '获取短信校验码',
          disabled: false
        },
        defaultOpen: ['2'],
        centerDialogVisible: false,
        editDialogVisible: false,
        centerDialogVisible_chooseProject: false,
        showClose: false,
        autoplay: false,
        centerDialogVisible_isReg: false, // 身份证是否注册过弹出框
        server: {
          personName: '',  // 姓名
          sex: 1,        // 性别
          certType: '',   // 证件类型
          certNumber: '', // 证件编码
          taxServiceTime: '', // 涉税专业服务时间(年)
          mobilePhone: '',  // 移动电话
          education: '',  // 学历
          politicalStatus: '', // 政治面貌
          email: '',      // 邮件
          isPartyOrgLeader: '',  // 是否党支部书记
          orgPosition: '', // 机构内身份
          isCommittee: '', // 是或否政协委员
          isCongress: '',  //  是否人大代表
          congressLevel: '',   // 人大代表等级
//          serviceItemIds: [],  // 代理范围
          serviceScope: '',
          taxServiceSituation: '',  // 从事涉税专业服务情况
        },
        securityCode: '',
        sRules: {
          personName: '姓名',  // 姓名
          sex: '性别',        // 性别
          certType: '证件类别',   // 证件类型
          certNumber: '证件号码', // 证件编码
          taxServiceTime: '涉税专业服务时间(年)', // 涉税专业服务时间(年)
          mobilePhone: '移动电话',  // 移动电话
          education: '学历',  // 学历
          politicalStatus: '政治面貌', // 政治面貌
//          email: '邮件',      // 邮件
          isPartyOrgLeader: '是否党支部书记',  // 是否党支部书记
          orgPosition: '机构内身份', // 机构内身份
          isCommittee: '是或否政协委员', // 是或否政协委员
          isCongress: '是否人大代表',  //  是否人大代表
//          congressLevel: '人大代表等级',   // 人大代表等级
//          serviceItemIds: '代理范围',  // 代理范围
          serviceScope: '代理范围',
          taxServiceSituation: '从事涉税专业服务情况',  // 从事涉税专业服务情况
          papersAttachList: '职业资格证书',
        },
        carouselList: [],   // 服务项目
        selectcarouselList: {
          oneItem: [],
          twoItem: [],
          lastItem: [],
        },
        politicalType: [],  // 政治面貌类别列表
        idType: [], // 证件列表
        educationBg: [],  // 学历列表
        country: [], // 国籍
        inistitutionBg: '',   // 机构内身份
        listData: [],   // 证件类别
        rulesTimeout: '',
        certificateType: '', // 证书类别
        certificateRules: {
          '39': {papersCode: '39', papersDesc: '税务师', msg: '请输入7位、8位或为SW（大写）+8位数字', disable: false, index: '', code: '', reg: /[SW]([0-9]{8}$)|^[0-9]{7}$|^[0-9]{8}$/},
          '06': {papersCode: '06', papersDesc: '注册会计师', msg: '请输入12位字符', disable: false, index: '', code: '', reg: /^[A-Za-z0-9]{12}$/},
          '01': {papersCode: '01', papersDesc: '律师', msg: '请输入17位字符', disable: false, index: '', code: '', reg: /^[A-Za-z0-9]{17}$/},
          '99': {papersCode: '99', papersDesc: '其他', index: '', code: '', reg: ''},
        },
        certificateFlag: true,
        dialogTableVisible_pho: false,
        isDisabled: false,
        showClose1: false,
        phoCode: '',
        mandator: '',
        formData: {},
        defaultProps: {
          children: 'child',
          label: 'name',
        },
        orgAgentId: ''
      };
    },
    created () {
      const _this = this;
     // this.initService();
      this.getPoliticstatus();
      this.getCerttypeList();
      this.getEducationtypeList();
      this.getOrgposition();
      this.getPaperstypeItem();
      // kami
      this.getOrgName();
      serverRequest.getOrgserviceItems().then((data) => {
        _this.carouselList = data.data;
        if (this.$route.query.orgAgentId) {
          this.initService();
        }
      })
    },
    // kami
    methods: {
      // kami：获取机构名称
      getOrgName () {
        serverRequest.getOrgName().then(res => {
          if (res) {
            this.orgName = res.data
          } else {
            this.$message({
              type: 'error',
              message: res.message || res.data.message
            })
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
      },

      // 获得政治面貌类别列表
      getPoliticstatus () {
        serverRequest.getPoliticstatus().then(res => {
          if (res) {
            this.politicalType = res
          } else {
            this.$message({
              type: 'error',
              message: res.message || res.data.message
            })
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
      },
      // 获得证件类别
      getCerttypeList () {
        let _this = this;
        serverRequest.getCerttypeList().then(res => {
          if (res && res.length) {
            res.forEach(function(d, i) {
              if (d.certCode === '201') {
                _this.idType.push(d)
              }
            })
            // kami
            // _this.server.certType = '201'
            _this.idType = res
            // kami
//            _this.idType = res
          } else {
            this.$message({
              type: 'error',
              message: res.message || res.data.message
            })
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
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
              message: res.message || res.data.message
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
              message: res.message || res.data.message
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
            _this.certificateType = res;
          } else {
            this.$message({
              type: 'error',
              message: res.message || res.data.message
            })
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err
          })
        })
      },
      // 选择证件类别
      certificateInputChange (item, val, listArr) {
        const _item = item;
        const _val = val;
        const _this = this;
        let _c = _this.certificateRules[_item.papersCode];
        if (_c) {
          if (listArr) {
//            let _c = _this.certificateRules[_item.papersCode];
            if (_item.indexCode && _item.indexCode !== _c.papersCode) {
              _this.certificateRules[_item.indexCode].disable = false;
              _c.disable = true;
              _item.indexCode = _item.papersCode;
            } else {
              _c.disable = true;
              _item.indexCode = _item.papersCode;
            }
          }
          if (val === '') {
            _item.rules = true;
            _item.rulesText = '不能为空';
          } else {
            _item.rules = false;
            let _rulesData = _this.certificateRules[_item.papersCode];
            if (_item.papersCode === _this.certificateRules[_item.papersCode].papersCode.toString()) {
              if (_rulesData.reg && _rulesData.reg.test(_val)) {
                _item.rules = false;
              } else {
                _item.rulesText = _rulesData.msg;
                _item.rules = true;
              }
            }
            if (_rulesData.papersDesc === '其他') {
              _item.rules = false;
            }
          }
        }
      },
      // 人大代表等级是否可填
      isCongressLevel (val) {
        if (val === 0) {
          this.isCongressLevelWrite = true;
          this.server.congressLevel = '--';
        } else {
          this.server.congressLevel = ''
          this.isCongressLevelWrite = false;
        }
      },
      // 时间转化
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      },
      /* *****************编辑状态加载数据******** */
      initService() {
        const _this = this;
        let queryId;
        let _treeInit = [];
        _this.isAdd = false;
        this.orgAgentId = this.$route.query.orgAgentId;
        queryId = this.$route.query.orgAgentId;
        serverRequest.getTaxagentDetail(queryId)
          .then((res) => {
            if (res.data) {
              const _data = res.data;
            //  _data.mobilePhone = '';
              if (!_data.mobilePhone) {
                _this.isAdd = true;
              };
              if (!_this.isAdd) {
                _this.editEPhone = true;
              }
            //  if (!_this.isAdd) {
              _this.isTaxOffice = _data.taxOffice;
            //  }
              if (_data.serviceScope && _data.serviceScope.length) {
                _data.serviceScope.forEach(function(d, i) {
                  _treeInit.push(d.id)
                });
                _this.services.initNodes = _treeInit;
                _this.$refs.tree.setCheckedKeys(_treeInit);
              }
              /* papersAttachList资格职业证书 */
              if (_data.papersAttachList) {
                _this.listData = _data.papersAttachList;
                _this.listDataChooseItems(_this.listData, _this.certificateRules);
              } else {
                _this.listData = [];
              }
              if (_this.isTaxOffice) {
                if (_this.listData.length) {
                  for (let i = 0; i < _this.listData.length; i++) {
                    if (_this.listData[i].papersCode.toString() !== '99') {
                      _this.isTaxOffice = true;
                      break
                    }
                    _this.isTaxOffice = false;
                  }
                } else {
                  _this.isTaxOffice = false;
                }
              }

              if (_this.isTaxOffice) { /*  */
                for (let o in _this.certificateRules) {
                  if (o.toString() !== '99') {
                    _this.certificateRules[o].disable = true;
                  }
                }
              };
              for (var o in _data) {
                _this.server[o] = _data[o];
              }
            }
          })
      },
      // 请选择项目按钮开启关闭
      handleChange() {
        if (!this.activeNames) {
          this.activeNames = '1';
        } else {
          this.activeNames = '';
        }
      },
      checkChange() {
        let _this = this;
        _this.services.serviceSaveNodes = [];
        _this.selectcarouselList = {
          oneItem: [],
          twoItem: [],
          lastItem: []
        };
        let oneItem = _this.selectcarouselList.oneItem;
        let twoItem = _this.selectcarouselList.twoItem;
        let lastItem = _this.selectcarouselList.lastItem;
        let _nodes = _this.$refs.tree.root.childNodes;
        let _saveNodes = _this.$refs.tree.getCheckedNodes(true);
        _nodes.forEach(function(d) {
          if (d.checked) {
            oneItem.push({id: d.id, name: d.label});
          } else if (d.indeterminate && d.childNodes) {
            d.childNodes.forEach(function(k) {
              if (k.checked) {
                twoItem.push({id: k.id, name: k.label});
              } else if (k.indeterminate && k.childNodes) {
                k.childNodes.forEach(function(l) {
                  if (l.checked) {
                    lastItem.push({id: l.id, name: l.label});
                  }
                })
              }
            })
          }
        })
        _saveNodes.forEach(function(d) {
          if (!d.child || !d.child.length) {
            _this.services.serviceSaveNodes.push(d)
          }
        });
      },
      // 添加证书
      addCertificateItem() {  // 添加证书
        this.listData.push({
          papersCode: '', // 证书类别
          papersNumber: '', // 证书编号
          papersLicenceTime: '', // 证书取得时间
          papersLicenceOrg: '', // 证书发证机关
          associationMemberCode: ''
        });
      },
      // 删除资格证书
      handleDel(index) {
        this.listData.splice(index, 1);
      },
      // 将时间格式转换为时间戳
      getTimeStamp(time) {
        var timestamp = Date.parse(new Date(time));
        timestamp = timestamp - 0;
        return timestamp;
      },
      // 20180206 新增手机号验证
      // 20180206 有的话就覆盖所有信息，没有就无所谓了
      checkPhoneNum (number) {
        let _this = this;
        let reg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (number) {
          if (!reg.test(number)) {
            _this.server.mobilePhone = '';
            _this.$message.error('手机号码错误');
          } else {
            serverRequest.checkPhoneNum(_this.server.mobilePhone).then(res => {
              if (res.code === 9007) { // token不合法，或者获取的信息不合
                _this.$message.error('登录信息过期，请重新登录。');
                _this.$router.push('/login')
              } else if (res.code === 4204) { // 这个手机号码已经被添加
                _this.clearformData(true);
                _this.$message.error('该代理人已在机构内注册！');
              } else if (res.code === 0) {
                if (res.data) {
                  const _data = res.data;
                  let _treeInit = [];
                  _data.taxAgentId = '';
                  _this.isPhoneInfo = true;
                  if (_data.serviceScope && _data.serviceScope.length) {
                    _data.serviceScope.forEach(function(d, i) {
                      _treeInit.push(d.id)
                    });
                    _this.services.initNodes = _treeInit;
                    _this.$refs.tree.setCheckedKeys(_this.services.initNodes, true);
                  }
                  /* papersAttachList资格职业证书 */
                  if (_this.isTaxOffice && _this.isAdd) {
                    delete _data.certNumber;
                    delete _data.certType;
                    delete _data.personName;
                    delete _data.papersAttachList;
                    for (let s in _this.server) {
                      for (let d in _data) {
                        if (s === d) {
                          _this.server[s] = _data[d]
                        }
                      }
                    }
                  } else {
                    _this.server = _data;
                  }
                  if (_data.papersAttachList) {
                    _this.listData = _data.papersAttachList;
                    _this.listDataChooseItems(_this.listData, _this.certificateRules);
                  } else {
                    if (_this.isTaxOffice && _this.isAdd) {} else {
                      _this.listData = [];
                    }
                  }
                } else {
                  _this.clearformData();
                }
              }
            })
          }
        }
      },
      clearformData (flag) {
//        for (let j in this.server) {
//          if (j !== 'mobilePhone' && !flag) {
//            this.server[j] = ''
//          } else {
//            this.server[j] = ''
//          }
//        };
//        this.services.serviceSaveNodes = [];
//        this.selectcarouselList = {
//          oneItem: [],
//          twoItem: [],
//          lastItem: []
//        };
//        this.listData = [];
//        this.$refs.tree.setCheckedKeys([])
        this.isPhoneInfo = false;
      },
      listDataChooseItems (list, rules) {
        let _list = list;
        let _rules = rules;
        if (_list.length) {
          _list.forEach(function(d, i) {
            for (let j in _rules) {
              if (d.papersCode.toString() !== '99' && d.papersCode.toString() === j.toString()) {
                _rules[j].disable = true;
                d.indexCode = d.papersCode;
              }
            }
          })
        }
      },
      checkCertNumber (number) {
        let _this = this;
        if (_this.server.certType.toString() === '201') {
          let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
          if (number) {
            if (!reg.test(number)) {
              _this.server.certNumber = '';
              _this.$message.error('身份证错误');
            }
          }
        }
      },
      //  继续添加
      goon() {
//        location.reload()
        this.$router.push('/addService')
        location.reload()
      },
      submitBtn (form, table) {
        let _this = this;
        _this.server.serviceScope = _this.services.serviceSaveNodes;
        for (let o in _this.server) {
          if (o === 'orgPosition') {
          }
          if (_this.server[o] === '' || _this.server[o].length === 0) {
            if (_this.sRules[o] && _this.sRules[o] !== '职业资格证书') {
              _this.$message.error(_this.sRules[o] + '不能为空')
              return false;
            }
          }
        }
        // kami

        if (!_this.services.serviceSaveNodes.length) {
          _this.$message('请在代理范围选择一个项目');
          return false;
        }
        if (!_this.listData.length) {
//          _this.$message.error('请添加一个职业资格证书');
//          return false;
        } else {
          for (let i = 0; i < _this.listData.length; i++) {
            let _d = _this.listData[i];
            if (_d.rules) {
              _this.$message.error('证书编号格式不正确');
              return false;
            }
           // delete _d.associationMemberCode;
//            for (let o in _d) {
            if (!_d['papersCode'] || !_d['papersNumber'] || !_d['papersLicenceTime'] || !_d['papersLicenceOrg']) {
              _this.$message.error('职业资格证书的信息需要填写完整');
              return false;
            }
//            }
          }
        }
        _this.dialogTableVisible_pho = true;
      },
      //    获取短信校验码
      // kami ** 这里要修改传的参数 **getPhoneCode
      // 发送短信，按钮倒计时
      countDown () {
        var _this = this;
        var num = 60;
        _this.getCodeBtn.disabled = true;
        _this.getCodeBtn.text = num + ' ' + '秒';
        let timer = setInterval(function() {
          num--;
          _this.getCodeBtn.text = num + ' ' + '秒';
          if (num === 0) {
            _this.isDisabled = false;
            _this.getCodeBtn.disabled = false;
            _this.getCodeBtn.text = '获取短信校验码';
            clearInterval(timer)
          }
        }, 1000)
      },
      //      add: 获取短信校验码
      getCode: function (e) {
        let _this = this;
        let _isAdd = 'AGENT_REAL_NAME_AUTHENTICATION';
        let _isEdit = 'AGENT_INFO_MOTIFLY_VERIFICATION';
        var param = {mobilePhone: _this.server.mobilePhone, contents: [_this.orgName]}
        if (_this.isAdd) {
          param.type = _isAdd;
        } else {
          param.type = _isEdit
        }
        serverRequest.sendMesCode(param)
          .then(function(res) {
            if (res.code.toString() === '0') {
              _this.countDown()
              _this.$message.success('短信验证码发送成功，请留意接收！');
            } else {
              _this.$message.error('短信验证码发送失败，请重新尝试发送！');
            }
          })
      },
      // 取消手机验证
      Cancel2() {
        this.dialogTableVisible_pho = false;
      //  this.server.securityCode = '';
        delete this.server.securityCode;
      },
      // 手机验证确认
      endSure(server) {
        let _this = this;
        if (_this.securityCode === '') {
          _this.$message.error('短信校验码必填!');
          return false;
        } else {
//          delete _this.server.serviceItemIds;
          _this.server.securityCode = _this.securityCode;
          _this.server.papersAttachList = _this.listData;
          _this.server.serviceScope = _this.services.serviceSaveNodes;
          _this.server.orgAgentId = _this.orgAgentId;  // 用户编码
          serverRequest.submitTaxagentInfo(_this.server).then(res => {
            if (res.code === 0) {
              _this.dialogTableVisible_pho = false;
              delete _this.server.securityCode;
              if (this.$route.query.orgAgentId) {
                this.$router.push('/peopleInformationService??orgAgentId=' + this.$route.query.orgAgentId + '&onJob=true')
              } else {
                _this.centerDialogVisible = true;
              }
            } else if (res.code === 4207) {
              this.$alert('您的机构类型是税务师事务所, 变更三师人员信息需要到税务师管理中心先办理税务师事务所行政登记变更！', '', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.dialogTableVisible_pho = false;
                }
              });
//              _this.$message.error('您的机构类型是税务师事务所, 变更三师人员信息需要到柜台先办理税务师事务所行政登记变更！');
            } else if (res.code === 4209) {
              this.$alert('您的机构类型是税务师事务所, 新增三师人员信息需要到税务师管理中心先办理税务师事务所行政登记变更！', '', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.dialogTableVisible_pho = false;
                }
              });
//              _this.$message.error('您的机构类型是税务师事务所, 新增三师人员信息需要到柜台先办理税务师事务所行政登记变更！');
            } else if (res.code === 4411) {
              this.$alert('抱歉，系统未能查到该代理人在您的企业中的工作痕迹，请携带工作证明（如劳动合同、社保缴纳证明、个税代缴证明等），移步到办事大厅办理该代理人的实名采集。', '', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.dialogTableVisible_pho = false;
                }
              });
            } else if (res.code === 4406) {
              _this.$message.error('验证码错误！')
            } else {
              _this.$message.error(res.msg);
            }
          });
        }
      }
    },
    mounted() {}
  };
</script>
<style lang='stylus' rel='stylesheet/stylus'>
@import '../style/addService.styl';
</style>


