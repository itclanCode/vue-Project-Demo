<!-- Created by qintengbo on 2018/05/28. -->
<!-- 涉税报告采集流程 -->

<template>
  <div class="taxReportFlow">
    <el-card v-loading="loading" :element-loading-text="loadingText">
      <el-row v-if="num != '1'">
        <el-col :span="24" class="step">
          <el-steps :active="active" finish-status="success" simple>
            <el-step title="委托方信息采集"></el-step>
            <el-step title="报告信息采集"></el-step>
            <el-step title="审核人员信息采集"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <el-row>
        <el-form class="from clearfix" 
          ref="infoForm" 
          :model="companyInfoForm" 
          :rules="InfoRules"
          inline-message
          status-icon
          label-position="right"
          label-width="140px"
        >
          <el-col :span="24" v-if="active == 0">
            <div class="flow-title">委托方信息</div>
            <table class="marginBot20">
              <tr>
                <td class="nametd"><span class="red">*</span> 统一社会信用代码</td>
                <td>
                  <el-form-item 
                    class="formLabel" 
                    label="" 
                    prop="tyshxydm">
                    <el-input 
                      class="formInput"
                      v-model="companyInfoForm.tyshxydm" 
                      clearable
                      @change="changeCode"
                      maxlength="18"
                      placeholder="请输入统一社会信用代码或纳税人识别号"
                    >
                    </el-input>
                  </el-form-item>
                </td>
              </tr>
            </table>
            <table>
              <tr>
                <td class="nametd"><span class="red">*</span> 名称</td>
                <td>
                  <el-form-item prop="enterpriseName">
                    <el-input 
                      class="projectInput" 
                      clearable 
                      v-model="companyInfoForm.enterpriseName" 
                      :placeholder="placeholder" 
                      :disabled="inputDisabled"
                    >
                    </el-input>
                  </el-form-item>
                </td>
                <td class="nametd"><span class="red">*</span> 登记注册类型</td>
                <td>
                  <el-form-item prop="registerType">
                    <el-select 
                      v-model="companyInfoForm.registerType" 
                      filterable 
                      clearable
                      :placeholder="placeholder" 
                      :disabled="inputDisabled"
                    >
                      <el-option
                        v-for="item in regConstant"
                        :key="item.regTypeCode"
                        :label="item.regTypeName"
                        :value="item.regTypeCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="nametd">纳税人识别号</td>
                <td>
                  <el-form-item prop="socialCreditCode">
                    <el-input 
                      class="projectInput"
                      clearable 
                      v-model="companyInfoForm.socialCreditCode" 
                      :placeholder="placeholder" 
                      :disabled="inputDisabled"
                    >
                    </el-input>
                  </el-form-item>
                </td>
                <td class="nametd"><span class="red">*</span> 所属行业</td>
                <td>
                  <el-form-item prop="industryInfo">
                    <el-select 
                      v-model="companyInfoForm.industryInfo" 
                      filterable
                      clearable 
                      :placeholder="placeholder" 
                      :disabled="inputDisabled"
                    >
                      <el-option
                        v-for="item in industryType"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="nametd">开业设立日期</td>
                <td>
                  <el-form-item class="register-date" prop="registerDate">
                    <el-date-picker
                      v-model="companyInfoForm.registerDate"
                      type="date"
                      :disabled="inputDisabled"
                      :placeholder="placeholder">
                    </el-date-picker>
                  </el-form-item>
                </td>
                <td class="nametd"><span class="red">*</span> 一般纳税人</td>
                <td>
                  <el-form-item prop="isGeneralTaxpayer">
                    <el-radio :disabled="inputDisabled" v-model="companyInfoForm.isGeneralTaxpayer" label="201">是</el-radio>
                    <el-radio :disabled="inputDisabled" v-model="companyInfoForm.isGeneralTaxpayer" label="-1">否</el-radio>
                  </el-form-item>
                </td>
              </tr>
              <tr v-if="inputDis && num != '2'">
                <td class="nametd">信用等级</td>
                <td colspan="3">
                  <el-input class="projectInput" v-model="companyInfoForm.nationalCreditGrade" :placeholder="placeholder" :disabled="inputDisabled"></el-input>
                </td>
              </tr>
              <tr>
                <td class="nametd"><span class="red">*</span> 经营范围</td>
                <td class="rangetd" colspan="3">
                  <el-form-item prop="frame">
                    <el-input 
                      type="textarea" 
                      :rows="5"
                      v-model="companyInfoForm.frame" 
                      :placeholder="placeholder" 
                      :disabled="inputDisabled"
                    >
                    </el-input>
                  </el-form-item>
                </td>
              </tr>
            </table>
            <el-table
              class="marginTop20"
              header-cell-class-name="reportRow"
              row-class-name="reportCol"
              :data="companyInfoForm.list"
              border
              fit
              style="width: 100%">
              <el-table-column
                prop="identityType"
                label="身份类型"
                class-name="reportColumn"
                width="220">
              </el-table-column>
              <el-table-column
                label="姓名">
                <template slot-scope="scope">
                  <el-form-item>
                    <el-input clearable v-model="scope.row.name" :disabled="inputDisabled"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="固定电话">
                <template slot-scope="scope">
                  <el-form-item prop="telephone">
                    <el-input clearable v-model="scope.row.telephone" :disabled="inputDisabled"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="移动电话">
                <template slot-scope="scope">
                  <el-form-item>
                    <el-input clearable v-model="scope.row.phone" :disabled="inputDisabled"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="证件名称">
                <template slot-scope="scope">
                  <el-form-item>
                    <el-select clearable v-model="scope.row.paperName" :disabled="inputDisabled">
                      <el-option
                        v-for="item in certTypeConstant"
                        :key="item.certCode"
                        :label="item.certDesc"
                        :value="item.certCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="证件号码"
                width="260">
                <template slot-scope="scope">
                  <el-form-item>
                    <el-input  
                      clearable 
                      v-model="scope.row.paperNum" 
                      :disabled="inputDisabled"
                    >
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table> 
          </el-col>
        </el-form>
        <el-form class="from clearfix" 
          ref="reportForm" 
          :model="clientForm" 
          :rules="reportRules"
          inline-message
          status-icon
          label-position="right"
          label-width="140px"
        >
          <el-col style="margin-bottom: 20px" :span="24" v-if="active == 1 || num == '1'">
            <div class="flow-title">报告信息</div>
            <table class="reportAdd">
              <tr>
                <td class="nametd"><span class="red">*</span> 涉税业务类型</td>
                <td>
                  <el-form-item prop="ssywlx">
                    <el-select 
                      v-model="clientForm.ssywlx"
                      @change="workSelectChange" 
                      clearable
                      :disabled="taxreDisabled" 
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(value, key) in _constant.TAXRELATED_TYPE"
                        :key="key"
                        :label="value"
                        :value="key">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <td class="nametd"><span class="red" v-if="clientForm.ssywlx == '050000'">*</span>  涉税项目类型</td>
                <td>
                  <el-form-item prop="ssxmlx">
                    <el-select 
                      class="projectSelect" 
                      v-model="clientForm.ssxmlx" 
                      @change="projectSelectChange"
                      clearable
                      :disabled="clientForm.ssywlx != '050000' || num == '1'"
                      :placeholder="reportPlaceholder">
                      <el-option
                        v-for="(value, key) in _constant.PROJECT_CON"
                        :key="key"
                        :label="value"
                        :value="key">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="nametd"><span class="red">*</span> 报告所属时期</td>
                <td>
                  <el-form-item class="reportPicker" prop="ssqq">
                    <el-date-picker
                      :disabled="taxreDisabled"
                      v-model="clientForm.ssqq"
                      value-format="yyyy-MM-dd"
                      @change="reportPickerChange"
                      :clearable="false"
                      type="date"
                      placeholder="选择起始日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <span style="margin: 0 10px">至</span>
                  <el-form-item class="reportPicker" prop="ssqz">
                    <el-date-picker
                      :disabled="taxreDisabled"
                      v-model="clientForm.ssqz"
                      value-format="yyyy-MM-dd"
                      @change="reportPickerChange"
                      :clearable="false"
                      type="date"
                      placeholder="选择截止日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                </td>
                <td class="nametd">鉴证结论类型</td>
                <td>
                  <el-form-item prop="jzjllx">
                    <el-select 
                      class="projectSelect" 
                      v-model="clientForm.jzjllx" 
                      clearable
                      :disabled="taxreDisabled" 
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(value, key) in _constant.FORENSICCONCLUSION_TYPE"
                        :key="key"
                        :label="value"
                        :value="key">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <!-- 公用部分 -->
              <tr v-if="clientForm.ssxmlx == '050600' 
                || clientForm.ssxmlx == '059900'">
                <td class="nametd">应补税额</td>
                <td>
                  <el-input 
                    class="projectInput" 
                    type="tel"
                    v-model="clientForm.ybse" 
                    clearable
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'ybse')"
                    @blur="yeBlur($event, clientForm, 'ybse')"
                    @keyup.native="yeKeyUp($event, clientForm, 'ybse')"
                  >
                  </el-input>
                </td>
                <td class="nametd">应退税额</td>
                <td>
                  <el-input 
                    class="projectInput" 
                    type="tel"
                    v-model="clientForm.ytse"
                    clearable 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'ytse')"
                    @blur="yeBlur($event, clientForm, 'ytse')"
                    @keyup.native="yeKeyUp($event, clientForm, 'ytse')"
                  >
                  </el-input>
                </td>
              </tr>
              <!-- 涉税项目类型为企业所得税汇算清缴纳税申报鉴证业务 -->
              <tr v-if="clientForm.ssxmlx == '050100'">
                <td class="nametd">资产总额</td>
                <td>
                  <el-input 
                    :disabled="taxreDisabled"
                    type="tel"
                    class="projectInput" 
                    clearable
                    v-model="clientForm.zcze" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'zcze')"
                    @blur="yeBlur($event, clientForm, 'zcze')"
                    @keyup.native="yeKeyUp($event, clientForm, 'zcze')"
                  >
                  </el-input>
                </td>
                <td class="nametd">委托企业营业收入</td>
                <td>
                  <el-input 
                    class="projectInput" 
                    type="tel"
                    clearable
                    v-model="clientForm.wtqyyysr" 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'wtqyyysr')"
                    @blur="yeBlur($event, clientForm, 'wtqyyysr')"
                    @keyup.native="yeKeyUp($event, clientForm, 'wtqyyysr')"
                  >
                  </el-input>
                </td>
              </tr>
              <tr v-if="clientForm.ssxmlx == '050100'">
                <td class="nametd"><span class="red">*</span> 所得税征收方式</td>
                <td>
                  <el-form-item prop="sdszsfs">
                    <el-select 
                      clearable
                      v-model="clientForm.sdszsfs" 
                      :disabled="taxreDisabled" 
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(value, key) in _constant.INCOMETAXCOLLECTION_TYPE"
                        :key="key"
                        :label="value"
                        :value="key">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <td class="nametd">实际应纳所得税额<br></td>
                <td>
                  <el-input 
                    class="projectInput" 
                    type="tel"
                    clearable
                    v-model="clientForm.sjynsdse" 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'sjynsdse')"
                    @blur="yeBlur($event, clientForm, 'sjynsdse')"
                    @keyup.native="yeKeyUp($event, clientForm, 'sjynsdse')"
                  >
                  </el-input>
                </td>
              </tr>
              <!-- 涉税项目类型为企业税前弥补亏损鉴证业务 -->
              <tr v-if="clientForm.ssxmlx == '050200'">
                <td class="nametd">具体年度</td>
                <td>
                  <el-select 
                    v-model="clientForm.jtnd" 
                    clearable
                    :disabled="taxreDisabled" 
                    placeholder="请选择"
                  >
                    <el-option 
                      v-for="(item, index) in yearArr"
                      :key="index"
                      :label="item" 
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </td>
                <td class="nametd">可弥补金额</td>
                <td>
                  <el-input 
                    class="projectInput"
                    type="tel" 
                    clearable
                    v-model="clientForm.kmbje" 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'kmbje')"
                    @blur="yeBlur($event, clientForm, 'kmbje')"
                    @keyup.native="yeKeyUp($event, clientForm, 'kmbje')"
                  >
                  </el-input>
                </td>
              </tr>
              <tr v-if="clientForm.ssxmlx == '050200'">
                <td class="nametd">涉及委托人税额<br>(可弥补金额*税率)</td>
                <td>
                  <el-input 
                    class="projectInput"
                    type="tel" 
                    clearable 
                    v-model="clientForm.sjwtrse" 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'sjwtrse')"
                    @blur="yeBlur($event, clientForm, 'sjwtrse')"
                    @keyup.native="yeKeyUp($event, clientForm, 'sjwtrses')"
                  >
                  </el-input>
                </td>
                <td class="nametd"></td>
                <td></td>
              </tr>
              <!-- 涉税项目类型为企业资产损失税前扣除鉴证业务 -->
              <tr v-if="clientForm.ssxmlx == '050300'">
                <td class="nametd">报损金额</td>
                <td>
                  <el-input 
                    class="projectInput" 
                    type="tel" 
                    clearable
                    v-model="clientForm.bsje" 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'bsje')"
                    @blur="yeBlur($event, clientForm, 'bsje')"
                    @keyup.native="yeKeyUp($event, clientForm, 'bsje')"
                  >
                  </el-input>
                </td>
                <td class="nametd">委托企业营业收入</td>
                <td>
                  <el-input 
                    class="projectInput" 
                    type="tel" 
                    clearable
                    v-model="clientForm.wtqyyysr" 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'wtqyyysr')"
                    @blur="yeBlur($event, clientForm, 'wtqyyysr')"
                    @keyup.native="yeKeyUp($event, clientForm, 'wtqyyysr')"
                  >
                  </el-input>
                </td>
              </tr>
              <tr v-if="clientForm.ssxmlx == '050300'">
                <td class="nametd">所得税税前扣除金额</td>
                <td>
                  <el-input 
                    class="projectInput" 
                    type="tel" 
                    clearable
                    v-model="clientForm.sdssqkcje" 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'sdssqkcje')"
                    @blur="yeBlur($event, clientForm, 'sdssqkcje')"
                    @keyup.native="yeKeyUp($event, clientForm, 'sdssqkcje')"
                  >
                  </el-input>
                </td>
                <td class="nametd">涉及委托人税额<br>(所得税税前扣除额*税率)</td>
                <td>
                  <el-input 
                    class="projectInput"
                    type="tel" 
                    clearable 
                    v-model="clientForm.sjwtrse" 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'sjwtrse')"
                    @blur="yeBlur($event, clientForm, 'sjwtrse')"
                    @keyup.native="yeKeyUp($event, clientForm, 'sjwtrses')"
                  >
                  </el-input>
                </td>
              </tr>
              <!-- 涉税项目类型为土地增值税清算鉴证业务 -->
              <tr v-if="clientForm.ssxmlx == '050400'">
                <td class="nametd">应缴土地增值税税额</td>
                <td>
                  <el-input 
                    class="projectInput" 
                    type="tel" 
                    clearable 
                    v-model="clientForm.yjtdzzsse" 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'yjtdzzsse')"
                    @blur="yeBlur($event, clientForm, 'yjtdzzsse')"
                    @keyup.native="yeKeyUp($event, clientForm, 'yjtdzzsse')"
                  >
                  </el-input>
                </td>
                <td class="nametd"></td>
                <td></td>
              </tr>
              <!-- 涉税项目类型为高新技术企业认定鉴证业务 -->
              <tr v-if="clientForm.ssxmlx == '050500'">
                <td class="nametd">研发费用发生额</td>
                <td>
                  <el-input 
                    class="projectInput"
                    type="tel" 
                    clearable 
                    v-model="clientForm.yffyfse" 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'yffyfse')"
                    @blur="yeBlur($event, clientForm, 'yffyfse')"
                    @keyup.native="yeKeyUp($event, clientForm, 'yffyfse')"
                  >
                  </el-input>
                </td>
                <td class="nametd">资产总额</td>
                <td>
                  <el-input 
                    class="projectInput" 
                    type="tel" 
                    clearable 
                    v-model="clientForm.zcze" 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'zcze')"
                    @blur="yeBlur($event, clientForm, 'zcze')"
                    @keyup.native="yeKeyUp($event, clientForm, 'zcze')"
                  ></el-input>
                </td>
              </tr>
              <tr v-if="clientForm.ssxmlx == '050500'">
                <td class="nametd">委托企业营业收入</td>
                <td>
                  <el-input 
                    class="projectInput"
                    type="tel" 
                    clearable 
                    v-model="clientForm.wtqyyysr" 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'wtqyyysr')"
                    @blur="yeBlur($event, clientForm, 'wtqyyysr')"
                    @keyup.native="yeKeyUp($event, clientForm, 'wtqyyysr')"
                  >
                  </el-input>
                </td>
                <td class="nametd"></td>
                <td></td>
              </tr>
              <!-- 涉税项目类型为企业注销税务登记税款清算鉴证业务 -->
              <tr v-if="clientForm.ssxmlx == '050600'">
                <td class="nametd">委托企业营业收入</td>
                <td>
                  <el-input 
                    class="projectInput" 
                    type="tel" 
                    clearable 
                    v-model="clientForm.wtqyyysr" 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'wtqyyysr')"
                    @blur="yeBlur($event, clientForm, 'wtqyyysr')"
                    @keyup.native="yeKeyUp($event, clientForm, 'wtqyyysr')"
                  >
                  </el-input>
                </td>
                <td class="nametd"></td>
                <td></td>
              </tr>
              <!-- 涉税项目类型为研发费加计扣除鉴证业务 -->
              <tr v-if="clientForm.ssxmlx == '050700'">
                <td class="nametd">研发费用加计扣除额</td>
                <td>
                  <el-input 
                    class="projectInput" 
                    type="tel" 
                    clearable
                    v-model="clientForm.yffyjjkce" 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'yffyjjkce')"
                    @blur="yeBlur($event, clientForm, 'yffyjjkce')"
                    @keyup.native="yeKeyUp($event, clientForm, 'yffyjjkce')"
                  >
                  </el-input>
                </td>
                <td class="nametd">实际扣除金额</td>
                <td>
                  <el-input 
                    class="projectInput" 
                    type="tel" 
                    clearable
                    v-model="clientForm.sjkcje" 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'sjkcje')"
                    @blur="yeBlur($event, clientForm, 'sjkcje')"
                    @keyup.native="yeKeyUp($event, clientForm, 'sjkcje')"
                  >
                  </el-input>
                </td>
              </tr>
              <tr v-if="clientForm.ssxmlx == '050700'">
                <td class="nametd">涉及委托人税额<br>(研发费用加计扣除额*税率)</td>
                <td>
                  <el-input 
                    class="projectInput"
                    type="tel" 
                    clearable 
                    v-model="clientForm.sjwtrse" 
                    :disabled="taxreDisabled" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'sjwtrse')"
                    @blur="yeBlur($event, clientForm, 'sjwtrse')"
                    @keyup.native="yeKeyUp($event, clientForm, 'sjwtrse')"
                  >
                  </el-input>
                </td>
                <td class="nametd"></td>
                <td></td>
              </tr>
              <!-- 涉税项目类型为其他涉税鉴证 -->
              <!-- 公用部分 -->
              <tr v-if="clientForm.ssxmlx == '050300' 
                || clientForm.ssxmlx == '050400'
                || clientForm.ssxmlx == '050700'
                || clientForm.ssxmlx == '059900'">
                <td class="nametd"><span class="red">*</span> 具体项目</td>
                <td colspan="3">
                  <el-form-item prop="jtxm">
                    <el-input
                      :disabled="taxreDisabled"
                      clearable
                      type="textarea"
                      autosize
                      maxlength="500" 
                      class="projectText-input"
                      placeholder="请输入内容"
                      v-model="clientForm.jtxm"
                    >
                    </el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr class="tr-height">
                <td colspan="4"></td>
              </tr>
              <tr>
                <td class="nametd">收费金额</td>
                <td>
                  <el-input 
                    :disabled="taxreDisabled"
                    type="tel"
                    class="projectInput" 
                    clearable 
                    v-model="clientForm.sfje" 
                    placeholder="0.00"
                    @focus="yeFocus($event, clientForm, 'sfje')"
                    @blur="yeBlur($event, clientForm, 'sfje')"
                    @keyup.native="yeKeyUp($event, clientForm, 'sfje')"
                  >
                  </el-input>
                </td>
                <td class="nametd"></td>
                <td></td>
              </tr>
              <tr>
                <td class="nametd"><span class="red">*</span> 业务报告正文</td>
                <td class="uploadTd" colspan="3">
                  <el-form-item prop="ywbgzwurl" ref="upload">
                    <el-upload
                      class="upload"
                      :action="action"
                      :disabled="taxreDisabled"
                      accept=".zip, .doc, .docx, .pdf"
                      :before-upload="beforeUpload"
                      :on-success="onSuccess"
                      :data="uploadFileData"
                      :on-error="onError"
                      :on-remove="onRemove"
                      multiple
                      name="file"
                      :file-list="fileList"
                      >
                      <el-button 
                        type="primary" 
                        size="medium"
                      >
                        <i class="el-icon-upload el-icon--right"> 上传业务报告</i>
                      </el-button>
                      <span slot="tip" class="el-upload__tip">只能上传.doc、.docx、.pdf、.zip的文件，可以选择多个文件</span>
                    </el-upload>
                  </el-form-item>
                </td>
              </tr>
            </table>
          </el-col>
          <el-col :span="24" v-if="active == 2 || num == '1'">
            <div class="flow-title">审核人员信息</div>
            <table class="reportAdd">
              <tr>
                <td class="shnametd"><span class="red">*</span> 初审</td>
                <td>
                  <el-form-item prop="csryryxh" ref="cs">
                    <el-select 
                      @change="changModel('cs', clientForm.csryryxh)"
                      clearable 
                      v-model="clientForm.csryryxh" 
                      :disabled="taxreDisabled" 
                      placeholder="请选择"
                    >
                      <el-option 
                        v-for="(item, index) in reviewPeopleList.first" 
                        :key="index"
                        :label="item.xm" 
                        :value="item.ryxh"
                        :disabled="item.status == 0"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <td class="shnametd"><span class="red">*</span> 复审</td>
                <td>
                  <el-form-item prop="fsryryxh" ref="fs">
                    <el-select 
                      @change="changModel('fs', clientForm.fsryryxh)" 
                      clearable 
                      v-model="clientForm.fsryryxh" 
                      :disabled="taxreDisabled" 
                      placeholder="请选择"
                    >
                      <el-option 
                        v-for="(item, index) in reviewPeopleList.repeat" 
                        :key="index"
                        :label="item.xm" 
                        :value="item.ryxh"
                        :disabled="item.status == 0"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <td class="shnametd">终审</td>
                <td>
                  <el-form-item prop="zsryryxh" ref="zs">
                    <el-select @change="changModel('zs', clientForm.zsryryxh)" v-model="clientForm.zsryryxh" :disabled="taxreDisabled" placeholder="请选择">
                      <el-option 
                        v-for="(item, index) in reviewPeopleList.end" 
                        :key="index"
                        :label="item.xm" 
                        :value="item.ryxh"
                        :disabled="item.status == 0"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
            </table>
          </el-col>
          <el-col :span="24" v-if="active == 4">
            <div class="successCon">
              <div class="successIcon"><i class="el-icon-success"></i></div>
              <div class="tipText">{{ tipText }}</div>
            </div>
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" v-if="active !== 2 && active !== 4 && num != '1'" :disabled="!nextType" @click="nextStep">下一步</el-button>
          <el-button type="primary" v-if="active !== 0 && active !== 4" @click="lastStep">上一步</el-button>
          <el-button type="primary" v-if="active == 2 && state != 2" @click="keep('save')">暂存</el-button>
          <el-button type="success" v-if="active == 2 || updateBl" @click="keep('submit')">报送</el-button>
          <el-button plain class="cancelBtn" v-if="active == 0 && num != '1' " @click="cancel">取消</el-button>
          <el-button type="primary" v-if="active == 4 || num == '1'" @click="cancel">返回</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { taxRelateReportRequest, organizationRequest } from '@/services/request';
import { getYearArr } from '@/common/js/date';
import TaxRes from '@/mock/data';

export default {
  data() {
    return {
      loading: false,
      active: 0,
      nextType: false,
      tipText: '',
      inputDisabled: true,
      inputDis: true,
      taxreDisabled: false,
      placeholder: '自动识别',
      reportPlaceholder: '请选择',
      uploadFileData: { // 上传文件参数
        uuid: '',
        fileUuid: '' // 文件ID
      },
      fileList: [], // 上传文件的列表
      updateBl: false,
      ssxh: this.$route.params.ssxh, // 涉税报告卡片序号
      num: Number(this.$route.params.num), // 1:查看 2:修改
      state: this.$route.params.state, // 涉税报告状态
      list: [], // 企业人员信息
      loadingText: '正在查询委托方信息，请稍等',
      pickerBl: true,
      yearArr: [], // 年份数组
      precapital: '', // 金额缓存值
      workSelectValue: '', // 涉税业务类型缓存值
      projectSelectValue: '', // 涉税项目类型缓存值
      assets: '', // 资产总额缓存值
      action: '', // 上传文件地址
      industryType: '', // 行业类型
      regConstant: '', // 企业注册类型常量
      industryConstant: '', // 行业类型常量-详细
      industryBigConstant: '', // 行业类型常量-大类
      certTypeConstant: '', // 证件类型常量
      reviewPeopleList: '', // 审核人员列表
      restCompanyInfo: '', // 重置委托人字段表
      restClientForm: '', // 重置报告信息字段表
      companyInfoForm: {
        tyshxydm: '', // 统一社会信用代码
        socialCreditCode: '', // 纳税人识别号
        enterpriseName: '', // 企业名称
        registerType: '', // 登记注册类型
        industryInfo: '', // 所属行业
        registerDate: '', // 开业设立日期
        isGeneralTaxpayer: null, // 是否一般纳税人
        rentCreditGrade: '', // 信用等级
        frame: '', // 经营范围
        corpName: '', // 法人姓名
        corpFixPhone: '', // 法人固定电话
        corpMobilePhone: '', // 法人手机号
        corpCertType: '', // 法人证件类型
        corpCertNumber: '', // 法人证件号码
        financeName: '', // 财务负责人姓名
        financeFixPhone: '', // 财务负责人固定电话
        financeMobilePhone: '', // 财务负责人手机号
        financeCertType: '', // 财务负责人证件类型
        financeCertNumber: '', // 财务负责人证件号码
        taxName: '', // 办税人员姓名
        taxFixPhone: '', // 办税人员固定电话
        taxMobilePhone: '', // 办税人员手机号码
        taxCertType: '', // 办税人员证件类型
        taxCertNumber: '', // 办税人员证件号码
        list: [],
        // 多余字段
        createTime: '', // 创建时间
        deletedFlag: '', // 删除标志
        enterpriseAddress: '', // 企业地址
        enterpriseId: '', // 委托企业ID
        enterpriseProvince: '', // 企业省份
        manageTaxOrg: '', // 主管税务机关
        modifyTime: '', // 修改时间
        operatingStatus: '', // 营业状态 1：营业 2：非营业
        registerSequenceNumber: '', // 登记序号
        sznsrflag: '', // 是否深圳纳税人 0：是 1：否
        nationalCreditGrade: '' // 国税信用等级
      },
      // 为方便后端跟金三数据库对接，字段均采用拼音首字母拼接
      clientForm: {
        ssywlx: '', // 涉税业务类型
        ssxmlx: '', // 涉税项目类型
        jzjllx: '', // 鉴证结论类型
        sfje: '0.00', // 收费金额
        ssqq: '', // 所属期起
        ssqz: '', // 所属期止
        ywbgzwurl: '', // 上传业务报文
        // 企业所得税汇算清缴纳税申报鉴证业务字段
        zcze: '0.00', // 资产总额
        wtqyyysr: '0.00', // 委托企业营业收入
        sdszsfs: '', // 所得税征收方式
        sjynsdse: '0.00', // 实际应纳所得税额
        // 企业税前弥补亏损鉴证业务字段
        jtnd: new Date().getFullYear(), // 具体年度
        kmbje: '0.00', // 可弥补金额
        // 企业资产损失税前扣除鉴证业务字段
        bsje: '0.00', // 报损金额
        sdssqkcje: '0.00', // 所得税税前扣除金额
        // 土地增值税清算鉴证业务字段
        yjtdzzsse: '0.00', // 应缴土地增值税税额
        // 高新技术企业认定鉴证业务字段
        yffyfse: '0.00', // 研发费用发生额
        sjkcje: '0.00', // 实际扣除金额
        // 研发费加计扣除鉴证业务字段
        yffyjjkce: '0.00', // 研发费用加计扣除额
        // 公用字段
        sjwtrse: '0.00', // 涉及委托人税额
        ybse: '0.00', // 应补税额
        ytse: '0.00', // 应退税额
        jtxm: '', // 具体项目
        csryryxh: '', // 初审序号
        csryxm: '', // 初审姓名
        fsryryxh: '', // 复审序号
        fsryxm: '', // 复审姓名
        zsryryxh: '', // 终审序号
        zsryxm: '' // 终审姓名
      },
      InfoRules: {
        tyshxydm: [
          { validator: this.checkCreditCode, trigger: 'blur' },
          {
            min: 15,
            max: 18,
            message: '长度在 15 到 18 个字符'
          }
        ],
        enterpriseName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        registerType: [
          { required: true, message: '请输入登记注册类型', trigger: 'change' },
        ],
        industryInfo: [
          { required: true, message: '请输入所属行业', trigger: 'change' },
        ],
        isGeneralTaxpayer: [
          { required: true, message: '请选择是否是一般纳税人', trigger: 'change' },
        ],
        frame: [
          { required: true, message: '请输入经营范围', trigger: 'blur' },
        ],
      },
      reportRules: {
        ssywlx: [
          { required: true, message: '请选择涉税业务类型', trigger: 'change' },
        ],
        ssxmlx: [
          { validator: this.ssxmlxValidator, trigger: 'change' }
        ],
        ssqq: [
          { validator: this.ssqqValidate, trigger: 'blur' },
        ],
        ssqz: [
          { validator: this.ssqzValidate, trigger: 'blur' },
        ],
        ywbgzwurl: [
          { required: true, message: '请上传业务报告', trigger: 'change' }
        ],
        sdszsfs: [
          { required: true, message: '请选择所得税征收方式', trigger: 'change' }
        ],
        csryryxh: [
          { required: true, message: '请选择初审人员', trigger: 'change' }
        ],
        fsryryxh: [
          { required: true, message: '请选择复审人员', trigger: 'change' }
        ],
        jtxm: [
          { required: true, message: '请输入具体项目', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.yearArr = getYearArr();
    this.restCompanyInfo = this.deepCopy(this.companyInfoForm);
    this.restClientForm = this.deepCopy(this.clientForm);
    let token = window.localStorage['token'];
    this.action = taxRelateReportRequest.postTaxReportUpload(token);
    // 判断修改还是查看, 查看则不可编辑
    if (this.num === 1) {
      this.taxreDisabled = true;
      this.reportPlaceholder = '';
    } else if (this.num === 2) {
      this.inputDisabled = false;
    }
    // 获取本地JSON数据
    this.companyInfoForm.list = TaxRes.list;
    this.list = this.deepCopy(TaxRes.list);
    // 获取登记注册类型码值表
    organizationRequest.getSignType().then(res => {
      this.regConstant = res;
    });
    // 获取行业类型码值表详细
    taxRelateReportRequest.getIndustryCode().then(res => {
      this.industryConstant = res;
      this.industryType = res;
    });
    // 获取行业码值表大类
    taxRelateReportRequest.getIndustryBigCode().then(res => {
      this.industryBigConstant = res.data.list;
    });
    // 获取证件类型码值表
    organizationRequest.getIdCardList().then(res => {
      this.certTypeConstant = res;
    });
    // 获取审批人员信息
    taxRelateReportRequest.getAuditor().then(res => {
      this.reviewPeopleList = res.data;
    });
    // 获取卡片序号参数,有则请求数据
    if (this.ssxh !== 'undefined') {
      this.loading = true;
      this.loadingText = '正在加载数据';
      taxRelateReportRequest.getTaxReportInfo(this.ssxh).then(res => {
        this.loading = false;
        if (res.code === 0) {
          if (res.data.wtr.sznsrflag === 0) {
            this.inputDisabled = true;
          }
          this.companyInfoForm = res.data.wtr;
          this.clientForm = res.data.ssbg;
          this.fileList = res.data.ssbg.files;
          this.uploadFileData.uuid = this.clientForm.ywbgzwurl;
          this.companyInfoForm.tyshxydm = res.data.wtr.socialCreditCode;
          this.companyInfoForm.list = this.deepCopy(this.list);
          this.companyPeopleMatch();
          this.nextType = true;
          this.placeholder = '';
        } else {
          window.Alert(res.msg);
        }
      });
    }
  },
  methods: {
    // 统一社会信用代码校验
    checkCreditCode: function(rule, value, callback) {
      let reg = /^[A-Za-z0-9]{4,40}$/;
      if (value === '') {
        callback(new Error('统一社会信用代码或者纳税人识别号不能为空'));
      } else if (!value.match(reg)) {
        setTimeout(() => {
          callback(new Error('请输入正确的统一社会信用代码或者纳税人识别号'));
        }, 500);
      } else {
        sessionStorage.setItem('tyshxydm', JSON.stringify(this.companyInfoForm.tyshxydm));
        if (!this.nextType) {
          this.getCompanyInfo();
        }
        setTimeout(() => {
          callback();
        }, 500);
      }
    },
    // 所属期起校验
    ssqqValidate: function(rule, value, callback) {
      if (!value || value === '') {
        callback(new Error('起始日期不能为空'))
      } else if (value && this.clientForm.ssqz !== '') {
        if (!this.pickerBl) {
          this.clientForm.ssqq = '';
          callback(new Error('大于截止日期'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 所属期止校验
    ssqzValidate: function(rule, value, callback) {
      if (!value || value === '') {
        callback(new Error('截止日期不能为空'))
      } else if (value && this.clientForm.ssqq !== '') {
        if (!this.pickerBl) {
          this.clientForm.ssqz = '';
          callback(new Error('小于起始日期'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 验证所属期
    reportPickerChange: function() {
      if (new Date(this.clientForm.ssqq).getTime() > new Date(this.clientForm.ssqz).getTime()) {
        this.pickerBl = false;
      } else {
        this.pickerBl = true;
      }
    },
    // 涉税项目类型选择校验
    ssxmlxValidator: function(rule, value, callback) {
      if (value === '' && this.clientForm.ssywlx === '050000') {
        callback(new Error('请选择登记注册类型'));
      } else {
        callback();
      }
    },
    // 涉税业务类型更改回调函数
    workSelectChange: function(val) {
      this.workSelectValue = val;
      this.clientForm = this.deepCopy(this.restClientForm);
      this.clientForm.ssywlx = this.workSelectValue;
      this.clientForm.zcze = this.assets;
    },
    // 涉税项目类型更改回调函数
    projectSelectChange: function(val) {
      this.projectSelectValue = val;
      this.clientForm = this.deepCopy(this.restClientForm);
      this.clientForm.ssywlx = this.workSelectValue;
      this.clientForm.zcze = this.assets;
      this.clientForm.ssxmlx = this.projectSelectValue;
    },
    // 获取委托方信息,如果查询不到信息则手动输入
    getCompanyInfo: function() {
      this.loading = true;
      taxRelateReportRequest.getCompanyInfo(this.companyInfoForm.tyshxydm).then((res) => {
        this.loading = false;
        this.$refs.infoForm.resetFields();
        this.companyInfoForm = this.deepCopy(this.restCompanyInfo);
        this.companyInfoForm.list = this.list;
        this.companyInfoForm.tyshxydm = JSON.parse(sessionStorage.getItem('tyshxydm'));
        this.getTaxReportAssets();
        if (res.code === 0) {
          this.companyInfoForm = res.data;
          this.companyInfoForm.tyshxydm = res.data.socialCreditCode;
          this.companyInfoForm.list = this.deepCopy(this.list);
          this.companyPeopleMatch();
          this.nextType = true;
          this.placeholder = '';
        } else if (res.code === 9001) {
          this.$confirm(
            `统一社会信用代码 <em style="color: #4680ff">${this.companyInfoForm.tyshxydm}</em> 对应的纳税人不存在，
            您是否为非深圳注册的纳税人，如果是则点击 <strong>确定</strong> 进行纳税人信息自主填写，
            如果不是则选择 <strong>取消</strong> 并检查统一社会信用代码是否录入有误`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              dangerouslyUseHTMLString: true,
              center: true
            }).then(() => {
              this.placeholder = '请输入';
              this.inputDisabled = false;
              this.inputDis = false;
              this.nextType = true;
              this.industryType = this.industryBigConstant;
            })
            .catch(() => {
              this.nextType = false;
              this.inputDis = true;
            });
        } else {
          window.Alert(res.msg);
        }
      });
    },
    // 获取资产总额
    getTaxReportAssets: function() {
      taxRelateReportRequest.getAssets(this.companyInfoForm.tyshxydm).then(res => {
        if (res.code === 0) {
          this.assets = res.data.zcze;
          this.clientForm.zcze = res.data.zcze;
        } else {
          window.Alert(res.msg);
        }
      })
    },
    // 企业人员信息数据匹配
    companyPeopleMatch: function() {
      this.companyInfoForm.list.forEach(item => {
        switch (item.type) {
          case '1':
            item.name = this.companyInfoForm.corpName;
            item.telephone = this.companyInfoForm.corpFixPhone;
            item.phone = this.companyInfoForm.corpMobilePhone;
            item.paperName = this.companyInfoForm.corpCertType;
            item.paperNum = this.companyInfoForm.corpCertNumber;
            break;
          case '2':
            item.name = this.companyInfoForm.financeName;
            item.telephone = this.companyInfoForm.financeFixPhone;
            item.phone = this.companyInfoForm.financeMobilePhone;
            item.paperName = this.companyInfoForm.financeCertType;
            item.paperNum = this.companyInfoForm.financeCertNumber;
            break;
          case '3':
            item.name = this.companyInfoForm.taxName;
            item.telephone = this.companyInfoForm.taxFixPhone;
            item.phone = this.companyInfoForm.taxMobilePhone;
            item.paperName = this.companyInfoForm.taxCertType;
            item.paperNum = this.companyInfoForm.taxCertNumber;
            break;
        }
      });
    },
    // 企业人员数据保存时转换
    companyPeopleUpdate: function() {
      this.companyInfoForm.list.forEach(item => {
        switch (item.type) {
          case '1':
            this.companyInfoForm.corpName = item.name;
            this.companyInfoForm.corpFixPhone = item.telephone;
            this.companyInfoForm.corpMobilePhone = item.phone;
            this.companyInfoForm.corpCertType = item.paperName;
            this.companyInfoForm.corpCertNumber = item.paperNum;
            break;
          case '2':
            this.companyInfoForm.financeName = item.name;
            this.companyInfoForm.financeFixPhone = item.telephone;
            this.companyInfoForm.financeMobilePhone = item.phone;
            this.companyInfoForm.financeCertType = item.paperName;
            this.companyInfoForm.financeCertNumber = item.paperNum;
            break;
          case '3':
            this.companyInfoForm.taxName = item.name;
            this.companyInfoForm.taxFixPhone = item.telephone;
            this.companyInfoForm.taxMobilePhone = item.phone;
            this.companyInfoForm.taxCertType = item.paperName;
            this.companyInfoForm.taxCertNumber = item.paperNum;
            break;
        }
      })
    },
    // 统一社会信用代码一旦改变就改变下一步按钮的状态
    changeCode: function() {
      this.inputDisabled = true;
      this.nextType = false;
    },
    // 取消新建及返回
    cancel() {
      this.$router.push({name: 'TaxRelatedReport'});
    },
    // 上一步
    lastStep() {
      this.active -= 1;
      this.nextType = true;
      if (this.active === 2) {
        this.$refs['cs'].clearValidate();
        this.$refs['fs'].clearValidate();
      }
    },
    // 下一步
    nextStep() {
      if (this.active === 0) {
        this.$refs.infoForm.validate(valid => {
          if (valid) {
            this.active += 1;
            if (this.uploadFileData.uuid === '') {
              taxRelateReportRequest.getFileUuid().then(res => {
                if (res.code === 0) {
                  this.uploadFileData.uuid = res.data;
                } else {
                  window.Alert(res.msg);
                }
              });
            }
          } else {
            return false;
          }
        });
      } else if (this.active === 1) {
        this.$refs.reportForm.validate(valid => {
          if (valid) {
            this.active += 1;
            setTimeout(() => {
              this.$refs['cs'].clearValidate();
              this.$refs['fs'].clearValidate();
            }, 100);
          } else {
            return false;
          }
        });
      }
    },
    // 保存和报送
    keep(type) {
      if (this.updateBl) {
        this.loadingText = '正在报送中，请稍等';
        this.loading = true;
        taxRelateReportRequest.postTaxReportCradUpdate(this.ssxh).then(res => {
          this.loading = false;
          if (res.code === 0) {
            window.Success(res.msg);
            this.$router.push({name: 'TaxRelatedReport'});
          } else {
            window.Alert(res.msg);
          }
        });
      } else {
        this.$refs.reportForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.companyPeopleUpdate();
            if (this.ssxh !== 'undefined') {
              this.clientForm.ssxh = this.ssxh;
            }
            let data = {
              wtr: this.companyInfoForm,
              ssbg: this.clientForm
            };
            if (type === 'save') {
              this.loadingText = '正在暂存中，请稍等';
              taxRelateReportRequest.postTaxReport(data).then(res => {
                this.loading = false;
                if (res.code === 0) {
                  this.active += 2;
                  this.updateBl = true;
                  this.ssxh = res.data;
                  this.tipText = '您已暂存成功，还需报送税务机关';
                } else {
                  window.Alert(res.msg);
                }
              });
            } else if (type === 'submit') {
              if (this.clientForm.zsryryxh === '') {
                this.loading = false;
                window.Alert('未选择终审人员，不能报送');
              } else {
                this.loadingText = '正在报送中，请稍等';
                taxRelateReportRequest.postTaxReportUpdate(data).then(res => {
                  this.loading = false;
                  if (res.code === 0) {
                    this.active += 2;
                    this.tipText = '您已报送成功';
                  } else {
                    window.Alert(res.msg);
                  }
                });
              }
            }
          } else {
            return false;
          }
        });
      }
    },
    // 上传文件前的回调函数
    beforeUpload: function(file) {
      let bool = true;
      this.uploadFileData.fileUuid = file.uid;
      if (this.uploadFileData.uuid === '') {
        bool = false;
      }
      if (this.fileList.length > 0) {
        this.fileList.forEach(item => {
          if (item.name === file.name) {
            window.Alert('选择了重复文件');
            bool = false;
          }
        });
      }
      return bool;
    },
    // 上传文件成功后的回调函数
    onSuccess: function(response, file, fileList) {
      if (response.code === 0) {
        this.fileList = fileList;
        if (this.num === 0 || this.num === '0') {
          this.uploadFileData.uuid = response.data.uuid;
        }
        this.clientForm.ywbgzwurl = response.data.uuid;
        this.$refs['upload'].clearValidate();
        window.Success('文件上传成功');
      } else {
        window.Alert(response.msg);
        file.status = 'fail';
      }
    },
    // 文件上传失败的回调函数
    onError: function(err, file, fileList) {
      console.log(err)
      window.Alert('网络故障，上传文件失败');
    },
    // 已上传文件删除
    onRemove: function(file, fileList) {
      if (fileList.length === 0) {
        this.clientForm.ywbgzwurl = '';
      }
      taxRelateReportRequest.postDeleteTaxreport(file.uid).then(res => {
        if (res.code === 0) {
          this.fileList = fileList;
          window.Success(`删除文件 "${res.data}" 成功`);
        } else {
          if (file.status !== 'fail') {
            window.Alert(res.msg);
          }
        }
      });
    },
    // 审核人员改变值回调函数
    changModel: function(type, val) {
      if (type === 'cs') {
        this.reviewPeopleList.first.forEach(item => {
          if (item.ryxh === val) {
            this.clientForm.csryxm = item.xm;
          }
        });
      } else if (type === 'fs') {
        this.reviewPeopleList.repeat.forEach(item => {
          if (item.ryxh === val) {
            this.clientForm.fsryxm = item.xm;
          }
        });
      } else {
        this.reviewPeopleList.end.forEach(item => {
          if (item.ryxh === val) {
            this.clientForm.zsryxm = item.xm;
          }
        });
      }
    },
    // 深拷贝方法
    deepCopy: function(obj) {
      // 定义一个对象,用来确定当前的参数是数组还是对象
      let objArr = obj.constructor === Array ? [] : {};
      // 如果obj存在,且类型为对象
      if (obj && typeof obj === 'object') {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 如果obj的子元素是对象,递归操作
            if (obj[key] && typeof obj[key] === 'object') {
              objArr[key] = this.deepCopy(obj[key]);
            } else {
              // 如果不是,直接赋值
              objArr[key] = obj[key];
            }
          }
        }
      }
      return objArr;
    },
    // 输入框设置金额输入格式-获取焦点
    yeFocus: function(event, data, prop) {
      let val = event.srcElement.value;
      if (val === '0.00' || val === '0.0' || val === '0') {
        val = '';
      } else {
        val = val.replace(/\.00/, '').replace(/(\.\d)0/, '$1');
      }
      this.precapital = val;
      event.srcElement.value = val;
      data[prop] = val;
    },
    // 输入框设置金额输入格式-按键
    yeKeyUp: function(event, data, prop) {
      let val = event.srcElement.value;
      val = val.replace(/^[.]/, '').replace(/[^\d.]/g, '');
      if (val.split('.').length - 1 > 1) {
        val = this.precapital;
      }
      this.precapital = val;
      event.srcElement.value = val;
      data[prop] = val;
    },
    // 输入框设置金额输入格式-失去焦点
    yeBlur: function(event, data, prop) {
      let val = event.srcElement.value;
      val = val.replace(/[.]$/, '');
      val = val.replace(/(.*)\.(\d*)(\d*)/g, '$1.$2');
      val = Number(val).toFixed(2);
      event.srcElement.value = val;
      data[prop] = val;
    },
  },
}
</script>

<style lang="stylus">
.taxReportFlow
  .el-card
    box-shadow none
    border 0
    background #f2f4f7
    .el-card__body
      padding 20px 0
  .taxreportBtnCon
    position absolute
    bottom 0
    left 50%
    transform translateX(-50%)
  .red
    color #f56c6c
    margin-right 5px
  .from
    color #2a2a2a
    margin-bottom 20px
    font-size 14px
    .flow-title
      color #2a2a2a
      margin-bottom 15px
      margin-top 15px
      font-size 18px
      text-align left
      font-weight 600
    .reportRow
      background #5C8FFF !important
      color #fff
      padding 8px 0
    .reportColumn
      background #E5F0FF
      text-align left
    .reportCol:hover > td
      background-color inherit !important
    .reportCol:hover > td:first-child
      background-color #E5F0FF !important
    .formInput
      float left
      width 100%
    table
      width 100%
      background #fff
      .el-form-item__error--inline
        position absolute
        right 28px
    table > tr > td
      display table-cell
      vertical-align middle
      border 1px solid #DFDFDF
      padding 3px 10px
      text-align left
      line-height 1.2
      .el-form-item
        margin-bottom 0
      .el-form-item__content
        margin-left 0 !important
    .el-table td, .el-table th.is-leaf
      border-bottom 1px solid #DFDFDF
    .el-table--border td, 
    .el-table--border th, 
    .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed
      border-right 1px solid #DFDFDF
    .el-table .el-form-item
      margin-bottom 0
    .el-table .el-form-item__content
      margin-left 0 !important
    .nametd
      background #E5F0FF
      width 200px
    .shnametd
      background #E5F0FF
      width 150px
      text-align center
    .rangetd
      text-align left
      line-height 1.4
    .projectSelect
      width 100%
      min-width 340px
    .projectInput 
      width 100%
    .projectText-input
      width 100%
    .tr-height
      height 20px
      td
        background #f2f4f7
        border-left 0
        border-right 0
    .successCon
      margin 15% 0
      .successIcon
        font-size 120px
        color #67c23a
      .tipText
        margin-top 30px
        font-size 30px
        color #000
  .reportPicker
    width calc(50% - 22px) !important
    display inline-block !important
    .el-icon-circle-close:before
      content '\E62E' important
  .uploadTd .el-form-item__content
    line-height 1.4
  .upload
    display inline-block
  .el-form-item__error--inline
    float left 
    top 10px
  .el-form-item__label:before
    content '*'
    color #f56c6c
    margin-right 4px
  .el-input__inner
    color #2a2a2a
  .el-input.is-disabled .el-input__inner,
  .el-textarea.is-disabled .el-textarea__inner
    color #2a2a2a
    background #fff
  .el-form-item__label
    color #2a2a2a
  .cancelBtn
    border 1px solid #4680FF
    color #4680FF
  .el-button--primary
    background #4680FF
    border-color #4680FF
  .el-select .el-input__inner
    height 32px !important
  .el-date-editor.el-input, .el-date-editor.el-input__inner
    width 100%
  .el-select
    width 100%
  .el-radio__input.is-disabled+span.el-radio__label
    color #2a2a2a
  .el-radio__input.is-disabled.is-checked .el-radio__inner::after
    background-color #fff
  .el-radio__input.is-checked .el-radio__inner
    background-color #409EFF
  .el-input__icon
    line-height 25px
  .el-range-editor.is-disabled, .el-range-editor.is-disabled input
    color #2a2a2a
    background #fff
  .el-icon-circle-close:before
    content '\E62E'
  .el-input__clear:before
    content '\E607'
  .is-show-close:before
    content '\E607'
  .register-date .el-date-editor .el-icon-circle-close:before
    content '\E607' !important
  .el-upload__tip
    margin-left 10px
  .el-steps--simple
    background #fff
</style>

