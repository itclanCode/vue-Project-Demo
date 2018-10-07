<template>
  <div class='editServer'>
    <div class='h50 al lineHeight50 fontSize20'>
      <router-link to='/server'><span class='colorBl'>涉税服务人员</span>
      </router-link><i class='marginLeft10 marginRight15'>/</i><router-link to='/peopleInformationService'><span class='colorBl'>涉税服务人员信息</span>
    </router-link><i class='marginLeft10 marginRight15'>/</i><span>编辑</span>
    </div>
    <!--表格内容-->
    <div class='tableContent'>
      <form>
        <table class='fontSize14 wl wl-table-add'>
          <tr>
            <td style="width:15%"><span class='asterisk-red'></span>姓名</td>
            <td style="width:25%"><input type='text' required class='inputText' v-model='name'></td>
            <td style="width:15%"><span class="asterisk-red"></span>性别</td>
            <td style="width:30%">
              <el-radio-group v-model='sexData'>
                <el-radio :label='0' class='radio_label'>女</el-radio>
                <el-radio :label='1'>男</el-radio>
              </el-radio-group>
            </td>
          </tr>

          <tr>
            <td><span class="asterisk-red"></span>证件类别</td>
            <td>
              <el-select  placeholder='请选择证件类别' required class='inputText provincechoose' v-model='idType'>
                <el-option v-for='item in certType' :value='item.val' :label='item.label' :key='item.value'></el-option>
              </el-select>
            </td>
            <td><span class="asterisk-red"></span>证件号码</td>
            <td>
              <input type='text'  required class='inputText' v-model='idNUm'>
            </td>
          </tr>

          <tr>
            <td><span class="asterisk-red"></span>国籍</td>
            <td>
              <el-select  placeholder='请选择国籍' required class='inputText provincechoose' v-model='defaultCountry'>
                <el-option v-for='(item, index) in country' :value='item.value' :label='item.label' :key='index'></el-option>
              </el-select>
            </td>
            <td><span class="asterisk-red"></span>政治面貌</td>
            <td>
              <el-select  placeholder='请选择政治面貌' required class='inputText provincechoose' v-model='choosePoliticalType'>
                <el-option v-for='(item, key) in politicalType' :value='item.value' :label='item.label' :key='key'></el-option>
              </el-select>
            </td>
          </tr>

          <tr>
            <td><span class="asterisk-red"></span>手机号</td>
            <td><input type='text' required class='inputText' v-model='phone'></td>
            <td><span class="asterisk-red"></span>入职日期</td>
            <td>
              <el-date-picker
                v-model='workData'
                type='date'
                placeholder='选择日期'
                align='right'
                class='datechoose' style="width:100%;"
              >
              </el-date-picker>
            </td>
          </tr>

          <tr>
            <td><span class="asterisk-red"></span>代理人手机号</td>
            <td class="text-center"><span>{{phone}}</span></td>
            <td><span class="asterisk-red"></span>短信校验码</td>
            <td>
              <input type="text" required class="inputText w50p" v-model="phoCode" id="phonecode">
              <span class="w50p">
                <input type="button" class="getCode cursor" @click="getCode($event)" :disabled='isDisabled' value="获取短信校验码"></span></td>
          </tr>
          <tr>
            <td><span class="asterisk-red"></span>学历</td>
            <td>
              <el-select  placeholder='请选择政学历' required class='inputText provincechoose' v-model='educationBgDefault'>
                <el-option v-for='(item, key) in educationBg' :value='item.value' :label='item.label' :key='key'></el-option>
              </el-select>
            </td>
            <td><span class="asterisk-red"></span>机构内身份</td>
            <td>
              <el-select  placeholder='' required class='inputText provincechoose' v-model='politicalTypeDefault'>
                <el-option v-for='(item, key) in inistitutionBg' :value='item.value' :label='item.label' :key='key'></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td>电子邮箱</td>
            <td><input type='text' required  class='inputText' v-model='email'></td>
            <td><span class="asterisk-red"></span>从事纳税专业服务时间(年)</td>
            <td><input type='text' required  class='inputText' v-model='taxYear'></td>
          </tr>
          <tr>
            <td><span class="asterisk-red"></span>是否党支部书记(党组织负责人)</td>
            <td>
              <el-radio-group v-model='leader'>
                <el-radio :label='0'>否</el-radio>
                <el-radio :label='1'>是</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td><span class="asterisk-red"></span>服务项目</td>
            <!-- <td colspan='3' class='vm lineHeight16'><span class='projectChoose'>请选择项目</span></td> -->
            <td colspan='3' class='vm lineHeight16' >
              <span class='changeBtn' @click='chooseService'>修改</span>
              <span v-for='(item,index) in serviceProject' :key='index' style='padding-left:20px;float:left'>
              <span>{{item.itemName}}</span>
            </span>
            </td>
          </tr>
          <tr>
            <td><span class="asterisk-red"></span>从事涉税专业服务情况</td>
            <td colspan='3'>
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入该人员的从事涉税专业服务的情况"
                v-model="taxServiceSituation">
              </el-input>
            </td>
          </tr>
        </table>
        <!-- 底部表格 -->

        <div class="marginTop20">
          <div>
            <h3>职业资格证书采集</h3>
            <el-button type="success" @click='addCertificateItem' class="pull-right">添加证书</el-button>
          </div>
          <el-table :data="certificateType" style="width: 100%">

            <el-table-column label="证书类别" align="center">
              <template slot-scope="scope">
                <el-select  placeholder='请选择证件类别'
                            v-model='scope.row.papersCode' size="small"
                            @change="certificateInputChange(scope.row,scope.row.papersNumber)">
                  <el-option v-for='i in certificateType' :value='i.papersCode' :label='i.papersDesc' :key='i.papersCode'></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="证书编号" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.papersNumber" size="small" @input="certificateInputChange(scope.row, scope.row.papersNumber)" placeholder="请输入证书编号"></el-input>
                <span style="color:red;" v-show="scope.row.rules">{{scope.row.rulesText}}</span>
              </template>
            </el-table-column>
            <el-table-column label="证书取得时间" align="center">
              <template slot-scope="scope">
                <el-date-picker
                  v-model='scope.row.papersLicenceTime'
                  type='date' size="small"
                  placeholder='选择日期'
                  align='top'
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="证书发证机关" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.papersLicenceOrg" size="small" placeholder="请填写发证机关"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="行业协会会员编号" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.papersLicenceOrg" size="small" placeholder="请填写会员编号"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDel(index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p>
          <el-button type='primary'  class='add_btn2 cursor' @click='updateInfo'>保存</el-button>
          <router-link to='/server'><input type='button' value='返回' class='back_btn cursor'></router-link>
        </p>
      </form>
      <!-- 弹出框-保存成功 -->
      <el-dialog
        title=''
        :visible.sync='centerDialogVisible'
        width='30%'
        center>
        <i class='el-icon-circle-check-outline'></i>
        <p class='successAdd'>保存成功</p>
        <span slot='footer' class='dialog-footer'>
          <router-link to='/addService'>
            <el-button type='primary'  @click='centerDialogVisible = false' class='addContinueBtn'>继续添加</el-button>
          </router-link>
            <router-link to='/server'>
            <el-button  @click='centerDialogVisible = false' class='backBtn'>返回</el-button>
          </router-link>
        </span>
      </el-dialog>
      <!-- 弹出框-修改项目 -->
      <el-dialog
        title='提示'
        :visible.sync='centerDialogVisible_chooseProject'
        width='30%'
        center>
        <span>请选择需要修改的项目内容 </span>
        <span slot='footer' class='dialog-footer'>
          <el-button type='primary' @click='centerDialogVisible_chooseProject = false'>确定</el-button>
          <el-button @click='centerDialogVisible_chooseProject = false'>取消</el-button>
        </span>
      </el-dialog>
      <!--服务范围-->
      <el-dialog title='' :visible.sync='dialogTableVisible2'  center :show-close='showClose'  class='dialog_2'>
        <el-carousel indicator-position='outside' :autoplay='autoplay' class='carousel' trigger='click'>
          <el-carousel-item v-for='(item,index) in carouselList'  :label='item.serviceItemName' :key='index'>
            <div class='carouselItem'>
              <!--<span v-for='(item2,index2) in item' class='displayIn padding10 cursor' @click='getServer($event,item2)' :class='item2===serFunction(item2)?'chooseColor':'''>-->
              <!--{{item2}}-->
              <!--</span>-->
              <span v-for='(item2, index2) in item.childServiceItem' class='displayIn padding10 cursor' @click='getServer($event, item2)' :class='item2.serviceItemId === serFunction(item2) ? "chooseColor": ""'>
            {{item2.itemName}}
          </span>
            </div>
          </el-carousel-item>
        </el-carousel>
        <span slot='footer' class='dialog-footer'>
        <el-button type='primary' @click='querenServer()'>确定</el-button>
          <el-button @click='Cancel()'>取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { formatDate } from '../../../../common/js/date.js';
import { serverRequest } from '@/services/request';
let Serverarr = [];
export default {
  mounted() {
    this.taxOrgAgentId = this.$route.query.taxOrgAgentId;
    serverRequest.getTaxagentDetail(this.taxOrgAgentId).then(data => {
      let data1 = data.data.taxAgent;
      this.name = data1.personName;
      this.sexData = data1.sex;
      this.idType = data1.certType;
      this.idNUm = data1.certNumber;
      this.defaultCountry = data1.nationality;
      this.choosePoliticalType = data1.politicalStatus;
      this.phone = data1.mobilePhone;
      this.workData = data.data.entryDate;
      this.educationBgDefault = data1.education;
      this.politicalTypeDefault = data.data.orgPosition;
      this.email = data1.email;
      this.taxYear = data1.taxServiceTime;
      this.leader = data1.isPartyOrgLeader;
      this.taxAgentId = data1.taxAgentId;
      this.collectData = this.formatDate(data1.collectTime);
      this.taxServiceSituation = data1.taxServiceSituation;
      this.listData = data.data.paperList;
      // 将证件类别码值转换为字符串文字
      for (var i in this.listData) {
        for (var j in this.certificateType) {
          if (Number(this.listData[i].papersCode) === this.certificateType[j].value) {
            this.listData[i].papersCode = this.certificateType[j].label;
            break;
          }
        }
      }
      // 将政治面貌的码值转换为中文字符串
      for (var k in this.politicalType) {
        if (Number(this.choosePoliticalType) === this.politicalType[k].value) {
          this.choosePoliticalType = this.politicalType[k].label;
        }
      }
      // 将证件类别的码值转换为中文字符串
      for (var key in this.certType) {
        if (Number(this.idType) === this.certType[key].value) {
          this.idType = this.certType[key].label;
        }
      }
      // 将学历的码值转换为中文字符串
      for (var index in this.educationBg) {
        if (Number(this.educationBgDefault) === this.educationBg[index].value) {
          this.educationBgDefault = this.educationBg[index].label;
        }
      }
      // 将机构身份的码值转换为中文字符串
      for (var i1 in this.inistitutionBg) {
        if (
          Number(this.politicalTypeDefault) === this.inistitutionBg[i1].value
        ) {
          this.politicalTypeDefault = this.inistitutionBg[i1].label;
        }
      }
      this.serviceProject = data.data.serviceItemList;
      Serverarr = this.serviceProject;
    });
  },
  data() {
    return {
      isDisabled: false,
      phoCode: '',
      autoplay: false,
      carouselList: [],
      dialogTableVisible2: false,
      taxServiceSituation: '',
      leader: 0,
      taxOrgAgentId: null,
      centerDialogVisible: false,
      centerDialogVisible_chooseProject: false,
      defaultOpen: ['2'],
      dialogTableVisible: false,
      defaultNone: '',
      showClose: false,
      startdate: '',
      enddate: '',
      name: '张三',
      sexData: 0,
      taxAgentId: null,
      chooseIdType: '',
      idNUm: '43042419990213',
      fileList: [],
      certificateType: [
        {papersCode: '111', papersDesc: '税务师执业资格证书'}, /* 校验规则为 长度为7位、8位或为SW+8位数字 */
        {papersCode: '222', papersDesc: '注册会计师证书'}, /* 长度为12位 */
        {papersCode: '333', papersDesc: '律师执业证'}, /* 长度为17位 */
        {papersCode: '444', papersDesc: '其他'}, /* 没有校验 */
      ], // 证书类别
      certificateRules: {
        111: {papersCode: 111, papersDesc: '税务师执业资格证书', msg: '请输入7位、8位或为SW（大写）+8位数字', reg: /[SW]([0-9]{8}$)|^[A-Za-z0-9]{7}$|^[A-Za-z0-9]{8}$/},
        222: {papersCode: 222, papersDesc: '注册会计师证书', msg: '请输入12位字符', reg: /^[A-Za-z0-9]{12}$/},
        333: {papersCode: 333, papersDesc: '律师执业证', msg: '请输入17位字符', reg: /^[A-Za-z0-9]{17}$/},
        444: {papersCode: 444, papersDesc: '其他', reg: ''},
      },
      politicalType: [
        { value: 112001, label: '中国共产党员' },
        { value: 112002, label: '中国共产党预备党员' },
        { value: 112003, label: '中共共产主义青年团团员' },
        { value: 112004, label: '中国国名党革命委员会会员' },
        { value: 112005, label: '中国民主同盟盟员' },
        { value: 112006, label: '中国民主建国会会员' },
        { value: 112007, label: '中国民主促进会会员' },
        { value: 112008, label: '中国农工民主党党员' },
        { value: 112009, label: '中国致公党党员' },
        { value: 112010, label: '九三学社社员' },
        { value: 112011, label: '台湾民主自治同盟盟员' },
        { value: 112012, label: '无党派民主人士、群众' }
      ],
      politicalTypeDefault: '',
      phone: '17600227689',
      choosePoliticalType: '',
      idType: '',
      certType: [
        { value: 110001, label: '居民身份证' },
        { value: 110002, label: '外国护照' },
        { value: 110003, label: '港澳居民来往内地通行证' },
        { value: 110004, label: '台湾居民来往大陆通行证' },
        { value: 110005, label: '香港永久性居民身份证' },
        { value: 110006, label: '台湾身份证' },
        { value: 110007, label: '澳门特别行政区永久性居民身份证' },
        { value: 110008, label: '外国人身份证件' },
        { value: 110009, label: '其他个人证件' }
      ],
      country: [
        { value: '119001', label: '中华人民共和国' },
        { value: '119002', label: '美国' },
        { value: '119003', label: '英国' },
        { value: '119004', label: '法国' },
        { value: '119005', label: '俄罗斯' },
        { value: '119006', label: '日本' },
        { value: '119007', label: '巴西' }
      ],
      defaultCountry: '',
      educationBg: [
        { value: 111001, label: '博士研究生毕业' },
        { value: 111002, label: '博士研究生结业' },
        { value: 111003, label: '博士研究生肄业' },
        { value: 111004, label: '硕士研究生毕业' },
        { value: 111005, label: '硕士研究生结业' },
        { value: 111006, label: '硕士研究生肄业' },
        { value: 111007, label: '研究生班毕业' },
        { value: 111008, label: '研究生班结业' },
        { value: 111009, label: '研究生班肄业' },
        { value: 111010, label: '大学本科毕业' },
        { value: 111011, label: '大学本科结业' },
        { value: 111012, label: '大学本科肄业' },
        { value: 111013, label: '大学普通班毕业' },
        { value: 111014, label: '大学专科毕业' },
        { value: 111015, label: '大学专科结业' },
        { value: 111016, label: '大学专科肄业' },
        { value: 111017, label: '中等专科毕业' },
        { value: 111018, label: '中等专科结业' },
        { value: 111019, label: '中等专科肄业' },
        { value: 111020, label: '职业高中毕业' },
        { value: 111021, label: '职业高中结业' },
        { value: 111022, label: '职业高中肄业' },
        { value: 111023, label: '技工学校毕业' },
        { value: 111024, label: '技工学校结业' },
        { value: 111025, label: '技工学校肄业' },
        { value: 111026, label: '普通高中毕业' },
        { value: 111027, label: '普通高中结业' },
        { value: 111028, label: '普通高中肄业' },
        { value: 111029, label: '初中毕业' },
        { value: 111030, label: '初中肄业' },
        { value: 111031, label: '小学毕业' },
        { value: 111032, label: '小学肄业' },
        { value: 111033, label: '其他' }
      ],
      educationBgDefault: '',
      inistitutionBg: [
        { value: 118001, label: '法定代表人' },
        { value: 118002, label: '执行事务合伙人' },
        { value: 118003, label: '涉税专业服务人员' }
      ],
      email: '1124564722@qq.com',
      taxYear: '7',
      collectData: '2017-10-23',
      serviceProject: '税务登记',
      certificateTypeDefault: '',
      workData: '2017-4-15',
      getBookData: '2005-2-13',
      paperName: '',
      listData: [
        {
          createTime: null,
          modifyTime: null,
          papersAttachId: null,
          papersCode: '',
          papersLicenceOrg: '',
          papersLicenceTime: null,
          papersNumber: '',
          taxAgentId: null
        }
      ]
    };
  },
  methods: {
    certificateInputChange (item, val) {
      const _item = item;
      const _val = val;
      const _this = this;
      if (val === '') {
        _item.rules = true;
        _item.rulesText = '不能为空';
      } else {
        _item.rules = false;
        if (_item.papersCode === _this.certificateRules[_item.papersCode].papersCode.toString()) {
          let _rulesData = _this.certificateRules[_item.papersCode];
          if (_rulesData.reg.test(_val)) {
            _item.rules = false;
          } else {
            _item.rulesText = _rulesData.msg;
            _item.rules = true;
          }
        }
      }
    },
    // 获取短信验证码
    getCode: function (e) {
      var that = this;
      var num = 60;
      e.target.value = 59 + ' ' + '秒';
      e.target.style.backgroundColor = '#666666';
      let timer = setInterval(function() {
        num--;
        e.target.value = num + ' ' + '秒';
        e.target.style.backgroundColor = '#666666';
        that.isDisabled = 'disabled';
        if (num === 0) {
          that.isDisabled = false;
          e.target.style.backgroundColor = '#409EFF';
          e.target.value = '获取验证码';
          clearInterval(timer)
        }
      }, 1000)
      // 发送短信验证码接口
      var data = {mobilePhone: this.phone}
      serverRequest.sendMesCode(data).then(data => {
      })
    },
    querenServer() {
      this.dialogTableVisible2 = false;
    },
    Cancel() {
      this.dialogTableVisible2 = false;
      this.serviceProject = [];
    },
    getServer($event, item) {
      //          获取委托服务范围
      var def = false;
      var flag = $event.target.classList.contains('chooseColor');
      if (flag) {
        $event.target.classList.remove('chooseColor');
        for (var j = 0; j < Serverarr.length; j++) {
          if (Serverarr[j].id === item.serviceItemId) {
            Serverarr.splice(j, 1);
          }
        }
      } else {
        $event.target.classList.add('chooseColor');
        if (Serverarr.length > 0) {
          for (var i = 0; i < Serverarr.length; i++) {
            if (Serverarr[i].id === item.serviceItemId) {
              def = true;
            }
          }
          if (!def) {
            Serverarr.push({ id: item.serviceItemId, itemName: item.itemName });
          }
        } else {
          Serverarr.push({ id: item.serviceItemId, itemName: item.itemName });
        }
      }
      this.serviceProject = Serverarr.slice(0);
    },
    serFunction(item2) {
      var ids;
      for (var i = 0; i < this.serviceProject.length; i++) {
        if (this.serviceProject[i].id === item2.serviceItemId) {
          ids = item2.serviceItemId;
        }
      }
      return ids;
    },
    chooseService() {
      this.dialogTableVisible2 = true;
      serverRequest.getOrgserviceItems().then(data => {
        this.carouselList = data.data.list;
      });
    },
    // 更新修改代理人实名信息
    updateInfo() {
      if (
        this.phoCode === '' ||
        this.sexData === '' ||
        this.defaultCountry === '' ||
        this.choosePoliticalType === '' ||
        this.workData === '' ||
        this.educationBgDefault === '' ||
        this.politicalTypeDefault === '' ||
        this.taxYear === '' ||
        this.leader === '' ||
        this.collectData === '' ||
        this.serviceProject === '' ||
        this.taxServiceSituation === '' ||
        this.listData.papersCode === '' ||
        this.listData.papersNumber === '' ||
        this.listData.papersLicenceTime === '' ||
        this.listData.papersLicenceOrg === ''
      ) {
        alert('必填信息未填完整');
        // this.$router.push({path: '/peopleInformationService?taxOrgAgentId=' + this.taxOrgAgentId})
        return false;
      }
      for (let i = 0; i < this.listData.length; i++) {
        if ((this.listData[i].papersNumber).toString().length !== 16) {
          alert('证书编号必须为16为数字');
          return false;
        }
      }
      let arr = [];
      // 时间
      for (var i in this.listData) {
        var date = new Date(this.listData[i].papersLicenceTime) - 0;
        arr.push({
          papersCode: this.listData[i].papersCode,
          papersLicenceOrg: this.listData[i].papersLicenceOrg,
          papersLicenceTime: date,
          papersNumber: this.listData[i].papersNumber,
          taxAgentId: this.listData[i].taxAgentId,
          papersAttachId: this.listData[i].papersAttachId
        });
      }
      for (var k in arr) {
        for (var j in this.certificateType) {
          if (arr[k].papersCode === this.certificateType[j].label) {
            arr[k].papersCode = this.certificateType[j].value;
            break;
          }
        }
      }
      for (var key in this.politicalType) {
        if (this.choosePoliticalType === this.politicalType[key].label) {
          this.choosePoliticalType = this.politicalType[key].value;
        }
      }
      for (var key1 in this.certType) {
        if (this.idType === this.certType[key1].label) {
          this.idType = this.certType[key1].value;
        }
      }
      // 将学历的中文字符串转换为码值
      for (var index in this.educationBg) {
        if (this.educationBgDefault === this.educationBg[index].label) {
          this.educationBgDefault = this.educationBg[index].value;
        }
      }
      // 将机构身份的中文字符串转换为码值
      for (var i1 in this.inistitutionBg) {
        if (this.politicalTypeDefault === this.inistitutionBg[i1].label) {
          this.politicalTypeDefault = this.inistitutionBg[i1].value;
        }
      }
      let data2 = {
        securityCode: this.phoCode, // 短信验证码
        taxOrgAgentId: this.taxOrgAgentId,
        paperList: arr,
        serviceItemList: this.serviceProject,
        orgPosition: this.politicalTypeDefault,
        entryDate: this.workData,
        taxAgent: {
          education: this.educationBgDefault,
          email: this.email,
          isPartyOrgLeader: this.leader,
          nationality: this.defaultCountry,
          politicalStatus: this.choosePoliticalType,
          sex: this.sexData,
          mobilePhone: this.phone,
          taxAgentId: this.taxAgentId,
          taxServiceSituation: this.taxServiceSituation,
          taxServiceTime: this.taxYear
        }
      };

      serverRequest.updateTaxagentInfo(data2).then(res => {
        if (res.result === 'ok') {
          this.$router.push({path: '/peopleInformationService?taxOrgAgentId=' + this.taxOrgAgentId})
          this.centerDialogVisible = true;
        } else if (res.result === 'error') {
          this.$message({
            type: 'error',
            message: res.data.message
          })
          this.centerDialogVisible = false;
        }
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err
        })
        this.centerDialogVisible = true;
      })
    },
    addCertificateItem() {
      this.listData.push({
        papersCode: '',
        papersLicenceOrg: '',
        papersLicenceTime: null,
        papersNumber: '',
        papersAttachId: null,
        taxAgentId: this.taxAgentId
      });
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    // 格式化时间
    formatDate(time) {
      // time = parseInt(time);
      var date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd');
    }
  }
};
</script>
<style lang='stylus' rel='stylesheet/stylus'>
@import '../style/index.styl';
</style>

