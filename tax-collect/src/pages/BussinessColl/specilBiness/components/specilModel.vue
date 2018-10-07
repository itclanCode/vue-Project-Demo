<template>
  <el-dialog :visible.sync="isShowModel" @close="closeModel" width="58%" :show-close="true" :close-on-click-modal="isMoak" center>
    <el-form ref="specilForm" :model="specilForm" :rules="rules" size="medium">
      <div class="base-info">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item name="1">
            <template slot="title">
              <p class="base-info-title" :class="isActive? 'down': 'right'" @click="isActive = !isActive">基本信息</p>
            </template>
            <div class="table-content">
              <div v-if="!baseYearbasic.socialCreditCode">
                <baseqcInfoTable :is_Edit="is_Edit" :is_Save="is_Save" :baseCollectInfoTemplate="baseCollectInfoTemplate" :baseQueryInfoTemplate="baseQueryInfoTemplate" />
              </div>
              <div v-if="baseYearbasic.socialCreditCode">
                <baseyearInfoTable :is_Edit="is_Edit" :is_Save="is_Save" :baseYearInfo="baseYearbasic" />
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <!-- <div class="complete-date" v-if="!baseYearbasic.socialCreditCode">
        <p class="complete-date-title">业务完成日期</p>
        <div class="complete-date-content" >
          <el-form-item prop="ywwcrq">
            <el-date-picker
              v-if="is_Edit&&!is_Save"
              v-model="specilForm.ywwcrq"
              type="date"
              placeholder="选择日期"
              @change="formateDate"
              format="yyyy-MM-dd"
            >
            </el-date-picker>
            <p v-else class="computed-date">{{templeteDate}}</p>
          </el-form-item>
        </div>
      </div> -->
      <div class="bussin-completion">
        <p class="bussin-completion-title" v-if="name === 'YearReport'">业务完成情况</p>
        <div class="bussin-completion-title" v-else>
          <span>业务信息</span>
          <div class="complete-date-content" v-if="!baseYearbasic.socialCreditCode">
            <el-form-item prop="ywwcrq">
              <el-date-picker v-if="is_Edit&&!is_Save" v-model="specilForm.ywwcrq" type="date" placeholder="请选择业务完成日期" @change="formateDate" format="yyyy-MM-dd">
              </el-date-picker>
              <p v-else class="computed-date">{{templeteDate}}</p>
            </el-form-item>
          </div>
        </div>
        <div class="bussin-table" v-loading="lookLoading"  v-if="(yearDataTemplate.init&&yearDataTemplate.init.length>0) || (yearDataLookTempalte.init&&yearDataLookTempalte.init.length>0)">
          <el-table v-loading="loading" :data="is_Edit?yearDataTemplate.init:(is_Save?yearDataTemplate.init:yearDataLookTempalte.init)" stripe empty-text="暂无数据" slot="empty" ref="completetable" show-summary :summary-method="getSummaries" style="width: 100%;">
            <el-table-column label="服务项目" width="260">
              <template slot-scope="scope">
                {{_constant.SERVER_CONTENT[scope.row.hc]}}
              </template>
            </el-table-column>
            <el-table-column prop="hs" label="户数">
              <template slot-scope="scope">
                <div v-if="is_Edit&&!is_Save">
                  <el-input v-if="scope.row.disable" placeholder="请输入户数" v-model.trim="scope.row.nhs" :value="scope.row.nhs?scope.row.nhs: '0'" :disabled="scope.row.disable" clearable>
                  </el-input>
                  <el-input v-else placeholder="请输入户数" v-model.trim="scope.row.hs" :value="scope.row.hs" @input.native="computeValue(yearDataTemplate.init, $event, 'hs')" @blur="computeValue2(yearDataTemplate.init, $event, 'hs')" clearable>
                  </el-input>
                </div>
                <div v-else>
                  <span v-if="scope.row.hs">{{(parseInt(scope.row.hs * 1))}}</span>
                  <span v-else>{{scope.row.nhs?scope.row.nhs: '0'}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="ywsr" label="业务收入金额">
              <template slot-scope="scope">
                <div v-if="is_Edit&&!is_Save">
                  <el-input v-if="scope.row.disable" placeholder="请输入业务收入金额" v-model.trim="scope.row.nywsr" :value="scope.row.nywsr?scope.row.nywsr: '0.00'" :disabled="scope.row.disable" clearable>
                  </el-input>
                  <el-input v-else placeholder="请输入业务收入金额" v-model.trim="scope.row.ywsr" :value="scope.row.ywsrje" @input.native="computeValue(yearDataTemplate.init, $event, 'ywsr')" @blur="computeValue2(yearDataTemplate.init, $event, 'ywsr')" clearable>
                  </el-input>
                </div>
                <div v-else>
                  <span v-if="scope.row.ywsr">{{(scope.row.ywsr * 1).toFixed(2)}}</span>
                  <span v-else>{{(scope.row.nywsr*1).toFixed(2)}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="ywje" label="涉及委托人税款金额">
              <template slot-scope="scope">
                <div v-if="is_Edit&&!is_Save">
                  <el-input v-if="scope.row.disable" placeholder="请输入委托人税款金额" v-model.trim="scope.row.nywje" :value="scope.row.nywje?scope.row.nywje: '0.00'" :disabled="scope.row.disable" clearable>
                  </el-input>
                  <el-input v-else placeholder="请输入委托人税款金额" v-model.trim="scope.row.ywje" :value="scope.row.ywje" :disabled="scope.row.disable" @input.native="computeValue(yearDataTemplate.init,$event,'ywje')" @blur="computeValue2(yearDataTemplate.init,$event,'ywje')" clearable>
                  </el-input>
                </div>
                <div v-else>
                  <span v-if="scope.row.ywje">{{(scope.row.ywje*1).toFixed(2)}}</span>
                  <span v-else>{{(scope.row.nywje*1).toFixed(2)}}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div class="sum-cashed">
            <div class="sum-cashed-title w256">合计</div>
            <div class="sum-cashed-1 w200">{{yearDataLookTempalte.zhs?yearDataLookTempalte.zhs:(totalhsAmount * 1)}}</div>
            <div class="sum-cashed-1 w200">{{yearDataLookTempalte.zywsr?yearDataLookTempalte.zywsr:(totalAmount * 1).toFixed(2)}}</div>
            <div class="sum-cashed-1 w200">{{yearDataLookTempalte.zywje?yearDataLookTempalte.zywje:(totalWtAmount * 1).toFixed(2)}}</div>
          </div> -->
        </div>
        <div class="bussin-table" v-loading="lookLoading" v-else>
          <el-table v-loading="loading" v-if="is_Edit ? baseCollectInfoTemplate:(is_Save?baseCollectInfoTemplate:baseQueryInfoTemplate)" :data="is_Edit ? baseCollectInfoTemplate.wtxmList : (is_Save?baseCollectInfoTemplate.wtxmList:baseQueryInfoTemplate.wtxmList)" border empty-text="暂无数据" slot="empty" ref="completetable" :summary-method="getSummaries" show-summary style="width: 100%;">
            <el-table-column label="序号" type="index" :index="indexMethod"></el-table-column>
            <el-table-column v-if="type === taxVisa" label="业务内容" width="240">
              <template slot-scope="scope">
                {{_constant.PROJECT_CONTENT[scope.row.sszyfwwtxmDm]}}
              </template>
            </el-table-column>
            <el-table-column label="业务报告签署人">
              <template slot-scope="scope">
                <div v-if="is_Edit&&!is_Save">
                  <el-select v-model="selectArr[scope.row.id]" multiple clearable placeholder="请选择签署人" size="medium" @change="selectSigner(scope.row.id, $event)">
                    <el-option :label="optionItem.name" :value="optionItem.ryxh" :key="idxs" v-for="(optionItem, idxs) in scope.row.ywqsrList" />
                  </el-select>
                </div>
                <div v-else>
                  <span v-if="scope.row.nName" v-for="item in scope.row.nName" :key="item.ryxh">{{item.name}}</span>
                  <span v-if="scope.row.ywqsrList" v-for="(item,idx) in scope.row.ywqsrList" :key="idx">{{item.ywbgqsr}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="ywsrje" label="业务收入金额">
              <template slot-scope="scope">
                <div v-if="is_Edit&&!is_Save">
                  <el-input placeholder="请输入业务收入金额" v-model.trim="scope.row.ywsrje" :value="scope.row.ywsrje" name="ywsrje" @input.native="computeValue(baseCollectInfoTemplate.wtxmList, $event, 'ywsrje')" @blur="computeValue2(baseCollectInfoTemplate.wtxmList, $event, 'ywsrje')" clearable>
                  </el-input>
                </div>
                <div v-else>{{(scope.row.ywsrje * 1).toFixed(2)}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="ywje" label="涉及委托人税款金额">
              <template slot-scope="scope">
                <div v-if="is_Edit&&!is_Save">
                  <el-input placeholder="请输入委托人税款金额" v-model.trim="scope.row.ywje" :value="scope.row.ywje" @input.native="computeValue(baseCollectInfoTemplate.wtxmList,$event,'ywje')" @blur="computeValue2(baseCollectInfoTemplate.wtxmList,$event,'ywje')" clearable>
                  </el-input>
                </div>
                <div v-else>{{(scope.row.ywje*1).toFixed(2)}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" v-if="false" width="180">
              <template slot-scope="scope">
                <el-button :type="!scope.row.isEdit?'primary':'info'" :disabled="!scope.row.isEdit?false:true" icon="el-icon-edit" size="small">编辑
                </el-button>
                <el-button :type="!scope.row.isEdit?'info':'success'" :disabled="!scope.row.isEdit?true:false" size="small" @click="handleSure(scope.$index, scope.row)">确认
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div class="sum-cashed" v-if="(baseCollectInfoTemplate&&baseCollectInfoTemplate.wtxmList) || (baseQueryInfoTemplate&&baseQueryInfoTemplate.wtxmList)">
            <div class="sum-cashed-title" :class="type === taxVisa ? 'sum-cashed-active' : '' ">合计</div>
            <div class="sum-cashed-1" :class="type === taxVisa ? 'sum-cashed-active-1' : '' ">{{(totalAmount*1).toFixed(2)}}</div>
            <div class="sum-cashed-1" :class="type === taxVisa ? 'sum-cashed-active-1' : '' ">{{(totalWtAmount * 1).toFixed(2)}}</div>
          </div> -->
        </div>
      </div>
      <div class="bussin-sum">
        <p class="bussin-sum-title">业务情况摘要</p>
        <el-input v-if="is_Edit&&!is_Save" type="textarea" :rows="2" autosize placeholder="请输入业务摘要..." v-model="specilForm.fwqkzy">
        </el-input>
        <div v-else class="text-area"> {{specilForm.fwqkzy}}</div>
      </div>
      <!--bussin-sum-end-->
    </el-form>
    <!--foot-start-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="save('specilForm')" type="primary" :loading="successStatus" v-if="is_Edit&&!is_Save">报送</el-button>
      <a href="javascript:;" class="prient-btn" v-if="!is_Edit" @click="closeModel">
        <!-- <i class="el-icon-rep-dayin"></i>
        打印 -->
        关闭
      </a>
      <el-button type="primary" class="cancel-btn" @click="closeModel" v-if="is_Edit">取消</el-button>
    </span>
    <!--foot-end-->
  </el-dialog>
</template>
<script>
import util from '@/common/js/util'
import baseqcInfoTable from './BaseqcInfoTable'
import baseyearInfoTable from './BaseyearTable'
import { specilBiness } from '@/services/request'
export default {
  name: 'specilModel',
  props: ['isVisible', 'isEdit', 'type', 'baseQueryInfo', 'baseCollectInfo', 'personData', 'baseYearbasic', 'baseYearinit', 'baseYearywxx', 'nd'],
  components: { baseqcInfoTable, baseyearInfoTable },
  data () {
    return {
      isShowModel: this.isVisible,
      isActive: false,
      templeteDate: '', // 业务完成日期
      totalAmount: 0, // 业务收入总金额
      totalhsAmount: 0, // 户数
      totalWtAmount: 0, // 委托人收入总金额
      lookLoading: true, // 查看时，加载
      loading: true, // 首次加载时，加载进度
      is_Edit: this.isEdit, // true 编辑，false 不可编辑
      is_Save: false,
      isCancel: false, // 是否提交
      name: '', // yearReport 表示年度保存 collectReport表示非年度保存
      taxVisa: '050000', // 涉税签证
      isEmptySelectPerson: false, // 选择签署人不能为空
      successStatus: false, // 提交后表单的状态
      activeNames: ['0'],
      selectArr: [],
      parmsId: [],
      personId: [],
      specilForm: {
        ywwcrq: '',
        wtxmList: [],
        yearInit: [],
        nName: [], // 选择业务签署人
        firstSelect: true, // 第一次默认全选
        ywsrje: '',
        ywje: '',
        sszyfwbgbh: '', // 涉税专项业务编号
        fwqkzy: '' // 业务情况摘要
      },
      rules: {
        ywwcrq: [
          { type: 'date', required: true, message: '您选择日期不能为空', trigger: 'change' }
        ]
      },
      saveParms: {
        ywwcrq: '',
        wtxmList: []
      }, // 非年度保存参数
      saveYearParms: {}
    }
  },
  watch: {
    isEdit: function (nVal) {
      this.is_Edit = nVal;
    },
    isVisible: function (nVal) {
      this.isShowModel = nVal;
    },
    totalAmount: function (nVal) {
      this.totalAmount = nVal;
    },
    totalWtAmount: function (nVal) {
      this.totalWtAmount = nVal;
    }
  },
  created () {
    this.$watch('baseQueryInfo', (n) => { // 非年度查看
      this.name = 'collectReport';
      this.loading = !n.wtxmList;
      if (Array.isArray(n.wtxmList) && n.wtxmList.length > 0) {
        this.lookLoading = false;
      }
    })
    this.$watch('baseCollectInfo', (n) => { // 非年度报送
      this.name = 'collectReport';
      this.loading = !n.wtxmList;
      if (Array.isArray(n.wtxmList) && n.wtxmList.length > 0) {
        this.lookLoading = false;
      }
    })
    this.$watch('baseYearinit', (n) => { // 年度基本信息
      this.name = 'YearReport';
      this.loading = !(n.length > 0);
      if (Array.isArray(n) && n.length > 0) {
        this.lookLoading = false;
      }
    });
    this.$watch('baseYearywxx', (n) => { // 年度查看
      this.loading = !(n.ywxxList && n.ywxxList.length > 0);
      if (Array.isArray(n.ywxxList) && n.ywxxList.length > 0) {
        this.lookLoading = false;
      }
    })
  },
  updated () {
    let wtxmList = this.baseQueryInfo.wtxmList;
    // 选择签署人
    // if (this.specilForm.firstSelect) {
    //   this.selectPerson(this.baseCollectInfo.wtxmList);
    // }
    // let baselist = this.baseYearinit; // 年度报送
    let baseYearywxx = this.baseYearywxx; // 年度查看
    // console.log('===name===' + this.name);
    let isEmpeyFlag = JSON.stringify(this.yearDataLookTempalte) || JSON.stringify(this.yearDataTemplate);
    if (isEmpeyFlag === '{}') {
      this.name = 'collectReport';
    } else {
      this.name = 'YearReport';
    }
    this.$watch('isVisible', (n) => {
      if (!n) {
        this.totalAmount = 0;
        this.totalWtAmount = 0;
        this.totalhsAmount = 0;
      }
    });
    if (Array.isArray(wtxmList) && wtxmList.length > 0) {
      let sumywje = 0;
      let ywsrjesum = 0;
      wtxmList.map((item) => {
        ywsrjesum += item.ywsrje * 1
        sumywje += item.ywje * 1;
      })
      this.totalAmount = ywsrjesum;
      this.totalWtAmount = sumywje;
    }
    // 年度查看
    if (Array.isArray(baseYearywxx) && baseYearywxx.length > 0) {
      let ywsrsum = 0;
      let ywjesum = 0;
      let hssum = 0;
      baseYearywxx.map((item) => {
        ywsrsum += item.ywsr * 1
        ywjesum += item.ywje * 1;
        hssum += item.hs * 1;
      })
      this.totalAmount = ywsrsum;
      this.totalWtAmount = ywjesum;
      this.totalhsAmount = hssum;
    }
  },
  computed: {
    /**
     * htje:801  合同金额
     sszyfwwtxmdlDm: '' 涉税专业服务编号代码
     sszywfbgbh:"" 涉税专项业务编号
     strmc:"需全商复集中还" 受托人名称
     strtyshxydm:"xedededde" 受托人统一社会信用代码
     wtrmc:"以取加行火结员" 委托人名称
     wtrtyshxydm:4121106627578741 委托人统一社会信用代码
     wtxyxxcjbh:6939978043714441 委托协议信息采集编号
     */
    // 查看
    baseQueryInfoTemplate: function () {
      let BASEINOFDATA = {};
      let initData = {};
      if (this.baseQueryInfo.wtxmList) {
        BASEINOFDATA.baseInfo = [];
        BASEINOFDATA.wtxmList = [];
        // 基础信息
        initData = this.initBaseInfoData('Query');
        BASEINOFDATA.baseObj = Object.assign({}, initData);
        // this.templeteDate = this.formateDate(this.baseQueryInfo.ywwcrq, true);
        this.templeteDate = util.formateDate(this.baseQueryInfo.ywwcrq, 'YY-MM-RR');
        BASEINOFDATA.baseInfo.push(BASEINOFDATA.baseObj);
        BASEINOFDATA.wtxmList = [...this.baseQueryInfo.wtxmList];
        BASEINOFDATA.wtxmList.map(item => {
          if (item.sszyfwwtxmDm === this.taxVisa) {
            let indx = BASEINOFDATA.wtxmList.indexOf(item);
            BASEINOFDATA.wtxmList.splice(indx, 1);
          }
        })
        // 签署人特殊处理
        BASEINOFDATA.wtxmList = this.formateSelect(BASEINOFDATA.wtxmList, 'ywbgqsr');
        return BASEINOFDATA
      }
    },
    // 报送
    baseCollectInfoTemplate: function () {
      let initData = {};
      let BASEINOFDATA = {};
      BASEINOFDATA.baseInfo = [];
      BASEINOFDATA.wtxmList = [];
      initData = this.initBaseInfoData('Collect');
      // 基础信息
      BASEINOFDATA.baseObj = Object.assign({}, initData);
      BASEINOFDATA.baseInfo.push(BASEINOFDATA.baseObj);
      BASEINOFDATA.wtxmList = this.baseCollectInfo.wtxmList;
      // let defaultWtxmList = {
      //   reportWtxmUuid: '1223',
      //   sszyfwwtxmDm: '050100',
      //   ywje: '0.00',
      //   ywsrje: '0.00',
      //   ywqsrName: [],
      //   idObj: [],
      // }
      let wtxmList = BASEINOFDATA.wtxmList;
      let personData = this.personData;
      let idArr = []; // 业务签署人id
      personData.map((item, idx) => {
        idArr.push(item.ryxh);
      })
      this.personId = idArr;
      if (Array.isArray(personData) && personData.length > 0) {
        if (wtxmList instanceof Array) {
          wtxmList.map((item, idx) => {
            item.nName = [];
            item.id = idx; // 伪造一个id
            item.ywqsrList = personData;
            item.ywqsrName = idArr; // 业务签署人id
            item.nName = personData;
          })
          this.specilForm.wtxmList = wtxmList;
        }
        BASEINOFDATA.wtxmList = this.specilForm.wtxmList;
      } else {
        this.specilForm.wtxmList = [];
      }
      // 保存接口的相关参数
      this.saveParms = initData;
      this.saveParms.wtxmList = [...this.specilForm.wtxmList];
      return BASEINOFDATA
    },
    // 年度报送
    yearDataTemplate: function () {
      let BASEINFODATA = {};
      this.specilForm.yearInit = this.yearInitData(this.baseYearinit)
      BASEINFODATA.init = this.specilForm.yearInit;
      this.saveYearParms.ywxxList = this.specilForm.yearInit;
      this.saveYearParms.nd = this.nd;
      return BASEINFODATA;
    },
    // 年度查看
    yearDataLookTempalte: function () {
      let BASEINFODATA = {};
      BASEINFODATA.init = this.baseYearywxx.ywxxList;
      BASEINFODATA.zhs = this.baseYearywxx.zhs;
      BASEINFODATA.zywje = this.baseYearywxx.zywje;
      BASEINFODATA.zywsr = this.baseYearywxx.zywsr;
      return BASEINFODATA
    },
    // 蒙层弹框 可编辑的点击蒙层不关闭，不可编辑的，点击蒙层关闭
    isMoak: function () {
      let flag = JSON.stringify(this.baseCollectInfo) || JSON.stringify(this.baseYearinit);
      if (flag === '{}') {
        return true;
      } else {
        return false
      }
    }
  },
  mounted () {
  },
  methods: {
    // 合计
    getSummaries (param) {
      const { columns, data } = param;
      const sums = [];
      // let PROJECT_KEY = Object.keys(this._constant.PROJECT_CONTENT)
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index].toFixed(2);
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },
    indexMethod (idx) {
      return idx + 1
    },
    initBaseInfoData (baseType) {
      let nObj = {};
      // nObj.htje = this.baseCollectInfo.htje;
      nObj.htje = this[`base${baseType}Info`]['htje']
      nObj.sszyfwwtxmdlDm = this[`base${baseType}Info`]['sszyfwwtxmdlDm'];
      nObj.sszyfwbgbh = this[`base${baseType}Info`]['sszyfwbgbh'];
      nObj.strmc = this[`base${baseType}Info`]['strmc'];
      nObj.strtyshxydm = this[`base${baseType}Info`]['strtyshxydm'];
      nObj.wtrmc = this[`base${baseType}Info`]['wtrmc'];
      nObj.wtrtyshxydm = this[`base${baseType}Info`]['wtrtyshxydm'];
      nObj.wtxyxxcjbh = this[`base${baseType}Info`]['wtxyxxcjbh'];
      // nObj.jsrq = this.formateDate(new Date().getTime(), true);
      nObj.jsrq = new Date().getTime();
      nObj.jbr = window.localStorage.name;
      this.specilForm.fwqkzy = this[`base${baseType}Info`]['fwqkzy'] ? this[`base${baseType}Info`]['fwqkzy'] : this.specilForm.fwqkzy;
      nObj.fwqkzy = this.specilForm.fwqkzy;
      // 保存成功后，返回服务编号
      if (this.specilForm.sszyfwbgbh) {
        nObj.sszyfwbgbh = this.specilForm.sszyfwbgbh;
      }
      return nObj;
    },
    handleChange (val) {
    },
    toformDate (arr) {
      var regArr = [];
      arr.map(function (item) {
        if (Number(item) < 10) {
          item = '0' + item * 1;
        }
        regArr.push(item)
      });
      return regArr.join('-')
    },
    // 处理业务签署人，显示
    formateSelect (selectList, type) {
      let tempArr = [];
      for (let j = 0; j < selectList.length; j++) {
        tempArr = type === 'ywbgqsr' ? selectList[j].ywqsrList : selectList[j].nName
        for (let k = 0; k < tempArr.length - 1; k++) {
          if (k > 0 || k < tempArr.length) {
            tempArr[k][type] = tempArr[k][type] + '，'
          }
        }
        if (type === 'ywbgqsr') {
          selectList[j].ywqsrName = tempArr;
        } else {
          selectList[j].nName = tempArr;
        }
      }
      return selectList
    },
    formateDate (target, bool) {
      let ndate = new Date(target * 1);
      let ntoDate = ndate.toLocaleDateString();
      // 兼容ie处理  toLocaleDateString日期格式化处理
      if (ntoDate.includes('年')) {
        ntoDate = ntoDate.replace('年', '/').replace('月', '/').replace('日', '/');
        ntoDate = ntoDate.substring(0, ntoDate.length - 1);
      }
      let nLocalDate = ntoDate.split('/');
      this.templeteDate = this.toformDate(nLocalDate);
      if (bool) {
        return this.templeteDate
      }
    },
    // 涉税签证计算户数，业务员收入金额 委托人税款金额
    yearInitData (data) {
      let flag = false;
      let flag2 = false;
      let hsSum = 0;
      let srSum = 0;
      let jeSum = 0;
      let hsSum1 = 0;
      let srSum1 = 0;
      let jeSum1 = 0;
      data.map((item) => {
        flag = Number(item.hc) > 6 && Number(item.hc) < 16;
        if (flag) {
          hsSum += item.hs * 1;
          srSum += item.ywsr * 1;
          jeSum += item.ywje * 1;
        }
        flag2 = (Number(item.hc) > 0 && Number(item.hc) < 5) || Number(item.hc > 15 && item.hc < 19);
        if (flag2) {
          hsSum1 += item.hs * 1;
          srSum1 += item.ywsr * 1;
          jeSum1 += item.ywje * 1;
        }
        if (Number(item.hc) === 5) {
          item.disable = true;
        }
        item.hmc = this._constant.SERVER_CONTENT[item.hc]
      });
      data.map(item => {
        this.totalhsAmount = hsSum + hsSum1;
        this.totalAmount = srSum + srSum1;
        this.totalWtAmount = jeSum + jeSum1;
        if (Number(item.hc) === 5) {
          item.nhs = hsSum;
          item.nywsr = srSum;
          item.nywje = jeSum;
        }
      });
      this.saveYearParms.ywxxList = data;
      this.saveYearParms.ywxxList.map(item => {
        if (Number(item.hc) === 5) {
          item.hs = hsSum;
          item.ywsr = srSum;
          item.ywje = jeSum;
        }
      })
      return data;
    },
    // 输入框条件限制，只能输入数字金额
    computeValue (row, event, type) {
      this.specilForm.firstSelect = false;
      let tableData = row;
      tableData.map((item) => {
        if (item[type] instanceof String) {
          item[type] = item[type].replace(/^\s+|\s+$/g, '');
        }
      });
    },
    // 失去焦点输入非法字符串
    computeValue2 (row, event, type) {
      this.specilForm.firstSelect = false;
      let tableData = row;
      let sum = 0;
      let reg2 = /^d*(?:.d{2})?$/;// 只能限定数字小数点后两位
      // let chinease = /[^\u4E00-\u9FA5]+/g;
      // // let word = /[a-zA-Z]+/g;
      let hsSum = 0;
      let srSum = 0;
      let jeSum = 0;
      tableData.map(item => {
        if (item.hc > 6 && item.hc < 15) {
          hsSum += item.hs * 1;
          srSum += item.ywsr * 1;
          jeSum += item.ywje * 1;
        }
      });
      tableData.map((item) => {
        if (item.disable) {
          item.nhs = hsSum || '';
          item.nywsr = srSum ? srSum.toFixed(2) : '';
          item.nywje = jeSum ? jeSum.toFixed(2) : '';
        }
        // 户数处理
        if (type === 'hs') {
          if (isNaN(item[type])) {
            item[type] = 0;
          } else {
            if (item[type] === '') {
              item[type] = 0
            } else {
              item[type] = parseInt(item[type])
            }
          }
        }
        if (type === 'ywsrje' || type === 'ywje' || type === 'ywsr') {
          if (isNaN(item[type])) {
            item[type] = '0.00';
          } else {
            if (!reg2.test(item[type])) {
              item[type] = (item[type] * 1).toFixed(2);
            }
            if (item[type] === '') {
              item[type] = '0.00'
            }
          }
        }
        // if (item[type] !== undefined) {
        //   if (!reg2.test(item[type])) {
        //     item[type] = item[type].toString();
        //     if (item[type].match(word)) {
        //       console.log('mytrue' + true);
        //       item[type] = '0.00';
        //     } else if (!item[type].match(chinease)) {
        //       item[type] = '0.00';
        //     } else {
        //       item[type] = (item[type] * 1).toFixed(2);
        //     }
        //   }
        // }
        if (item.disable !== true) {
          sum += item[type] * 1;
        }
      });
      if (this.name === 'collectReport') {
        this.specilForm.wtxmList = tableData
      } else {
        this.specilForm.yearInit = tableData;
      }
      this.saveYearParms.ywxxList = this.specilForm.yearInit;
      this.saveYearParms.ywxxList.map(item => {
        if (Number(item.hc) === 5) {
          item.hs = hsSum;
          item.ywsr = srSum;
          item.ywje = jeSum;
        }
      })
      if (type === 'ywsrje' || type === 'ywsr') {
        this.totalAmount = sum;
      } else if (type === 'ywje') {
        this.totalWtAmount = sum;
      } else {
        this.totalhsAmount = sum;
      }
      // 保存请求参数
      this.saveParms.jsje1 = this.totalAmount;
      this.saveParms.wtxmList = this.specilForm.wtxmList;
    },
    fillterId (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr.indexOf(arr[i]) !== i) {
          arr.splice(i, 1);
          i--;
        }
      } return arr;
    },
    // 业务签署人选择
    selectSigner (index, val) {
      this.specilForm.firstSelect = false;
      let wtxmList = this.specilForm.wtxmList;
      let nwtxmList = [];
      for (let i = 0; i < wtxmList.length; i++) {
        wtxmList[index]['ywqsrName'] = val;
        nwtxmList = wtxmList[index]['ywqsrList'].filter((item, idx) => {
          if (val[idx] === item.ryxh) {
            return item
          }
        })
      }
      wtxmList[index]['nName'] = nwtxmList;
      this.saveParms.wtxmList = [...wtxmList];
      this.specilForm.wtxmList = wtxmList;
      // 选择签署人不能为空
      wtxmList.map(item => {
        if (item.ywqsrName.length === 0) {
          this.isEmptySelectPerson = true;
        } else {
          this.isEmptySelectPerson = false;
        }
      })
    },
    // 选择签署人
    selectPerson (wtxmCollectList) {
      this.selectArr = [];
      let personData = this.personData;
      if (wtxmCollectList instanceof Array) {
        for (let i = 0; i < wtxmCollectList.length; i++) {
          this.selectArr[i] = [];
          personData.map(item => {
            this.selectArr[i].push(item.ryxh)
          })
        }
      }
    },
    handleEdit (index, row) {
      // row.isEdit = 1;
    },
    handleSure (index, row) {
      // row.isEdit = 0;
    },
    save (formName) {
      let selectArr = this.selectArr;
      selectArr.map(item => {
        if (item.length > 0) {
          this.isEmptySelectPerson = false;
        } else {
          this.isEmptySelectPerson = true;
        }
      });
      if (this.isEmptySelectPerson) {
        this.getMessage('error', '您输入的选择签署人不能为空');
      } else {
        this.confim('您是否确认报送', formName);
      }
    },
    // 保存接口
    feacthSaveData (parms) {
      // name:collectReport 报送保存 name: yearReport 年度报送
      specilBiness[`post${this.name}Save`](parms).then(res => {
        if (res.code === 0 && res.data) {
          this.loading = false;
          if (this.name === 'collectReport') {
            this.specilForm.sszyfwbgbh = res.data;
          }
          // 保存成功后，签署人处理
          this.specilForm.wtxmList = this.formateSelect(this.specilForm.wtxmList, 'name');
          this.is_Edit = false;
          this.is_Save = true;
          this.successStatus = false;
          this.$emit('featchCardList', { init: 1, pageIndex: 1, pageSize: 10 });
          this.getMessage('success', res.msg);
        } else {
          this.successStatus = false;
          this.getMessage('error', res.msg);
        }
      })
    },
    submitForm (formName) {
      this.loading = false;
      let parms = {};
      let sum = 0;
      if (this.parmsId.length === 0) {
        this.specilForm.wtxmList.map((item) => {
          sum += item.ywsrje * 1;
        })
        this.saveParms.jsje1 = sum;
      }
      // 保存参数
      let wtxmsaveList = this.saveParms.wtxmList;
      if (!this.specilForm.ywwcrq) {
        this.successStatus = false;
      } else {
        // this.saveParms.ywwcrq = this.formateDate(this.specilForm.ywwcrq, true);
        this.saveParms.ywwcrq = new Date(this.specilForm.ywwcrq * 1).getTime();
      }
      if (this.saveParms.wtxmList) {
        if (wtxmsaveList instanceof Array && this.type === this.taxVisa) {
          wtxmsaveList.push({
            sszyfwwtxmDm: this.taxVisa,
            ywqsrName: this.personId,
            ywsrje: this.totalAmount.toString(),
            ywje: this.totalWtAmount.toString()
          })
        }
      };
      if (this.name === 'collectReport') { // 报送
        parms = this.saveParms; // 非年度报送
      } else {
        parms = this.saveYearParms;
      }
      this.specilForm.NameId = [];
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.feacthSaveData(parms);
        } else {
          return true;
        }
      });
    },
    confim (msg, formName) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!this.specilForm.ywwcrq) {
          this.successStatus = false;
        } else {
          this.successStatus = true;
        }
        this.submitForm(formName);
      }).catch(() => {
        this.successStatus = false;
      });
    },
    // 关闭弹框
    closeModel () {
      // 清空所有的当前数据
      this.clearData();
    },
    getMessage (type, msg) {
      this.$message({
        message: msg,
        type: type
      });
    },
    clearData () {
      this.activeNames = ['0'];
      this.is_Save = false;
      this.lookLoading = true; // 查看时解决初始化加载问题
      this.selectArr = [];
      this.successStatus = false;
      this.name = '';
      this.specilForm.fwqkzy = '';
      this.specilForm.ywwcrq = '';
      this.templeteDate = ''; // 清空业务完成时间
      this.specilForm.sszyfwbgbh = '';
      this.saveParms = {};
      this.saveYearParms = {};
      this.$emit('showModel', { bool: false });
      this.$refs['specilForm'].resetFields();
    }
  }
}
</script>