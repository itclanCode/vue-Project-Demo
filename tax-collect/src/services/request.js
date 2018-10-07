/**
* Created by qintengbo on 2018/05/08.
* 所有请求统一配置，方便修改
*/

import axios from 'axios';
import Qs from 'qs';
import path from './path';

/* Login */
const loginRequest = {
  // 登录
  getLogin: function (data) {
    return axios.post(path.GET_LOGIN_INFO, Qs.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  // 用户角色
  getUserRole: function () {
    return axios.get(path.GET_LOGIN_USER);
  },
  // 机构是否实名
  getOrgRealname: function () {
    return axios.get(path.ORG_REALNAME);
  },
  // 发送短信验证码
  sendCode: function (data) {
    return axios.post(path.GET_PHO_CODE, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
};

/* Organization */
const organizationRequest = {
  // 获取机构类别
  getOrgtype: function (data) {
    return axios.get(path.GET_ORGTYPE, data);
  },
  // 获得执业许可类别
  getPracticelicense: function (data) {
    return axios.get(path.GET_PRACTICELICENSE, data);
  },
  // 获取机构信息
  getOrginfo: function () {
    return axios.get(path.GET_ORGINFO);
  },
  // 修改机构实名信息
  updateOrginfo: function (data) {
    return axios.post(path.UPDATE_ORGINFO, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  },
  // 终止服务
  stopService: function (reason) {
    return axios.post(path.STOP_SERVICE + '?stopReason=' + reason);
  },
  // 获取机构code码值表
  getOrgTypeCode: function () {
    return axios.get(path.GET_ORG_TYPE_CODE);
  },
  // 获取证书码值
  getOrgCertType: function () {
    return axios.get(path.GET_ORG_CERT_TYPE);
  },
  // 获取身份证件码值表
  getIdCardList: function () {
    return axios.get(path.GET_ID_CARD_LIST);
  },
  // 恢复服务
  restartService: function (reason) {
    return axios.post(path.RESTART_SERVICE + '?recoverReason=' + reason);
  },
  // 登记注册类型码值表
  getSignType: function () {
    return axios.get(path.GET_SIGN_TYPE);
  },
  // 获取用户是否已进行实名
  getIsOrgrealname: function () {
    return axios.get(path.GET_IS_ORGREALNAME);
  }
};

/* Pwd */
const pwdRequest = {
  // 获取 i18n 的种类
  getI18nType: function () {
    return axios.get(path.GET_LANGUAGE_TYPE); // 这里需要先调用后端保存的语言
  },
  // 获取 找回密码身份认证
  getIden: function (data) {
    return axios.post(path.GET_Iden_INFO, Qs.stringify(data), {
      // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  // 获取 短信校验
  getPhoCode: function (data) {
    return axios.post(path.GET_PHO_CODE, Qs.stringify(data));
  },
  // 获取 短信校验
  getverifyVCode: function (data) {
    return axios.post(path.GET_SECURITY_VERIFY, Qs.stringify(data));
  },
  // 获取 设置密码
  getPwd: function (data) {
    return axios.post(path.GET_Pwd_Info, Qs.stringify(data));
  },
  // 获取 图片验证码
  getImageCode: function () {
    return axios.get(path.GET_Image_CODE);
  },
  // 获取 短信校验2
  getPhoCode2: function () {
    return axios.get('/static/dataJson/index.json');
  },
  // 获取i18n 配置json
  // @param language
  // @private
  getI18n: function (language = 'zh') {
    return axios.get('/static/i18n/' + language + '/index.json').then((data) => {
      window.I18n = data;
    });
  }
};

/* Register */
const registerRequest = {
  // 获取机构类型
  getOrgType: function () {
    return axios.get(path.GET_ORG_TYPE);
  },
  // 校验短信验证码
  verifyCode: function (data) {
    return axios.post(path.VERIFY_CODE, Qs.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  // 判断手机号是否存在
  getPhoneList: function (phone) {
    return axios.get(path.GET_PHONE_LIST + '/' + phone);
  },
  // 判断用户名是否存在
  getUserNameList: function (username) {
    return axios.get(path.GET_USERNAME_LIST + '/' + username);
  },
  // 发送短信验证码
  sendCode: function (data) {
    return axios.post(path.GET_PHO_CODE, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  },
  // 判断社会统一信用码是否注册
  getIrd: function (creditCode) {
    return axios.get(path.GET_IRD + '/' + creditCode);
  },
  // 获取法人手机号列表
  // function getLegalPhone(legalPhone) {
  //   return axios.get(path.GET_LEGALPHONE + '/' + legalPhone)
  // },
  // 提交代理机构注册列表
  postAgency: function (data) {
    return axios.post(path.POST_AGENCY_LIST, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });
  },
  // 模拟接口
  getRegisterType: function () {
    return axios.get(path.GET_REGISTER_TYPE);
  },
  getRegister: function () {
    return axios.get('/static/register' + '/index.json').then((data) => {
      window.getRegister = data;
    });
  }
};

/* Server */
const serverRequest = {
  // 获取校验码
  getPhoneCode: function (obj) {
    return axios.post(path.GET_PHO_CODE, Qs.stringify(obj), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  // userListService页面，获取 TA的客户 的信息
  protocol: function (orgAgentId, pageNum, pageSize, keyword, status) {
    return axios.get(path.PROTOCOL +
      '?orgAgentId=' + orgAgentId +
      '&pageNum=' + pageNum +
      '&pageSize' + pageSize +
      '&keyword=' + keyword +
      '&status=' + status);
  },
  // 另分配的弹出窗
  distributionAllModal: function () {
    return axios.get(path.DISTRIBUTION_ALL_MODAL);
  },
  // 另分配弹出框的确定
  distributionOk: function (obj) {
    return axios.post(path.DISTRIBUTION_OK, JSON.stringify(obj), {
      headers: { 'Content-Type': 'application/json' }
    });
  },
  //  状态列表
  userListStatusList: function () {
    return axios.get(path.STATUS_LIST);
  },
  // 搜索
  searchOrgagent: function (searchStr, type, page, rows) {
    return axios.get(path.SEARCH_ORGAGENT + '?searchStr=' + searchStr + '&type=' + type + '&page=' + page + '&rows=' + rows);
  },
  // 获取在职人员列表
  // function getMissionAgents(page, rows) {
  //   return axios.get(path.GET_MISSIONAGENTS + '?page=' + page + '&rows=' + rows);
  // },
  getMissionAgents: function (page, rows) {
    return axios.get(path.GET_MISSIONAGENTS + '?status=1&pageNum=' + page + '&pageSize=' + rows);
  },
  // 离职在职搜索都用一个接口
  getDismissionAgents: function (val, status, page, rows) {
    return axios.get(path.GET_MISSIONAGENTS + '?keyword=' + val + '&status=' + status + '&pageNum=' + page + '&pageSize=' + rows);
  },
  // 删除职业资格证书
  deletePaperattach: function (paperAttachId) {
    return axios.get(path.DELETE_PAPERATTACH + '?paperAttachId=' + paperAttachId);
  },
  // 判断代理人是否注册
  ishasAgentRegiste: function (certTypeCode, certNumber) {
    return axios.get(path.IS_HASAGENT_REGISTE + '?certTypeCode=' + certTypeCode + '&certNumber=' + certNumber);
  },
  // 获得税务代理人详细信息
  getTaxagentDetail: function (taxOrgAgentId) {
    return axios.get(path.GET_TAXAGENT_DETAIL + '/' + taxOrgAgentId);
  },
  // 解除代理人和机构的雇佣关系
  fireOrgagent: function (taxOrgAgentId) {
    return axios.get(path.FIRE_ORGAGENT + '?taxOrgAgentId=' + taxOrgAgentId);
  },
  // 是否还有未完成的服务项目
  isHasUnfinishedServiceItem: function (taxOrgAgentId) {
    return axios.post(path.IS_HASUNFINISHED_SERVICE_ITEM + taxOrgAgentId + '/leave');
  },
  // 查询机构内代理人正在进行中的的代理记录(ta的客户)
  getTaxorgAgent: function (taxOrgAgentId) {
    return axios.get(path.GET_TAX_ORG_AGENT + '/' + taxOrgAgentId + '/server');
  },
  // 筛选机构内代理人正在进行中的的代理记录(ta的客户)
  filtertTaxorgAgent: function (taxOrgAgentId, finishStatus, searchStr, page, pageSize) {
    return axios.get(path.GET_TAX_ORG_AGENT + '/' + taxOrgAgentId + '/server' + '?finishStatus=' + finishStatus + '&searchStr=' + searchStr + '&page=' + page + '&pageSize=' + pageSize);
  },
  // 得到机构内所有的在职代理人（将服务分配给其他人）
  getOrgAgents: function () {
    return axios.get(path.GET_ORGAGENTS);
  },
  // 获得机构内身份类别列表
  getOrgposition: function () {
    return axios.get(path.GET_ORGPOSITION_LIST);
  },
  // 获得政治面貌类别列表
  getPoliticstatus: function () {
    return axios.get(path.GET_POLITICSTATUS_LIST);
  },
  // 获得证件类型代码表
  getCerttypeList: function () {
    return axios.get(path.GET_CERTTYPE_LIST);
  },
  // 获得学历代码表
  getEducationtypeList: function () {
    return axios.get(path.GET_EDUCATIONTYOE_LIST);
  },
  // 根据机构获得机构的服务项目
  getOrgserviceItems: function () {
    return axios.get(path.GET_ORGSERVICE_ITEMS);
  },
  // 职业资格证书类别
  getPaperstypeItem: function () {
    return axios.get(path.GET_PAPERTYPE_ITEM);
  },
  // 提交代理人实名信息，并校验短信验证码
  submitTaxagentInfo: function (data) {
    return axios.post(path.SUBMIT_TAXAGENT_INFO, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  },
  // 更新修改代理人实名信息
  updateTaxagentInfo: function (data) {
    return axios.post(path.UPDATE_TAXAGENT_INFO, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  },
  // 更改代理关系，将该代理人名下的代理客户分配给其他代理人
  changeAgentRelation: function (data) {
    return axios.post(path.CHANGE_AGENT_RELATION, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  },
  // 发送短信验证码
  sendMesCode: function (data) {
    return axios.post(path.POST_SENDMESCODE, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  },
  // 验证手机号
  checkPhoneNum: function (mobilePhone) {
    return axios.get(path.CHECK_PHONE_NUM + '/' + mobilePhone);
  },
  // kami：获取机构名称
  getOrgName: function () {
    return axios.get(path.GET_ORGANIZATION_NAME);
  }
};

/* Agent */
const agentRequest = {
  // 获取机构名称
  getOrgName: function () {
    return axios.get(path.GET_ORGANIZATION_NAME)
  },
  // 查询机构服务状态
  getOrgStatus: function () {
    return axios.get(path.GET_ORG_STATUS)
  },
  // 获取主管税务机关
  getAuthority: function () {
    return axios.get(path.GET_AUTHORITY)
  },
  // 获取代理人信息
  getProviceList: function () {
    return axios.get(path.GET_PROVICE_LIST)
  },
  // 根据机构获得机构的服务项目
  getOrgserviceItems: function () {
    return axios.get(path.GET_ORGSERVICE_ITEMS)
  },
  // 获取所有的委托协议
  getProtocol: function (pageNum, pageSize, keyword, status) {
    return axios.get(path.GET_PROTOCOL + '?page=' + pageNum + '&pageSize=' + pageSize + '&keyword=' + keyword + '&status=' + status)
  },
  // 获取委托协议详细内容
  getProtocolDetail: function (id) {
    return axios.get(path.GET_PROTOCOL_DETAIL + id)
  },
  // 查看状态
  getStatus: function () {
    return axios.get(path.GET_STATUS)
  },
  // 获取代理人信息
  getAent: function () {
    return axios.get(path.GET_AGENT_DETAIL)
  },
  // 通过统一社会信用代码查找委托人
  getAentfromSocialCode: function (socialCreditCode) {
    return axios.get(path.LOOKFOR_AGENT + '/' + socialCreditCode + '/base')
  },
  // 合同下载
  downloadConcat: function (agentId, concatId) {
    return axios.get(path.DOWNLOAD_CONCAT + agentId + '/contract-attach/' + concatId)
  },
  // 移除委托关系
  delDelegation: function (id) {
    return axios.put(path.DEL_DELEGATION + id + '/delete')
  },
  // 通过url添加委托关系
  addAgentOrder: function (orderId, data) {
    return axios.post(path.ADD_AGENT_ORDER + orderId, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  },
  // 添加代理关系
  addAgent: function (data) {
    return axios.post(path.ADD_AGENT_DETAIL, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  },
  // 更改委托关系
  updataAgent: function (data) {
    return axios.post(path.UPDATA_PROTOCOL, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  },
  // 更改代理关系
  changeAgent: function (data, id) {
    return axios.put(path.EDIT_AGENT + id, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  },
  getPhoCode: function (data) {
    // 发送短信
    return axios.post(path.GET_PHO_CODE, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  },
  // 终止委托关系
  Dotermination: function (delegationRelationId, data) {
    // 发送短信
    return axios.put(path.END_TERMINATION + delegationRelationId + '/termination', JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  },
  // 短信校验
  getverifyVCode: function (data) {
    // 短信校验
    return axios.post(path.GET_SECURITY_VERIFY, Qs.stringify(data));
  },
  getUrl: function (delegationRelationId, contractAttachId, token) {
    return path.DOWNLOAD_CONCAT + delegationRelationId + '/contract-attach/' + contractAttachId + '?token=' + token;
  },
  getUrl2: function (delegationRelationId, contractAttachId, token) {
    return path.DOWNLOAD_CONCAT + delegationRelationId + '/termination-attach/' + contractAttachId + '?token=' + token;
  },
  getfileup: function (token) {
    return path.DOWNLOAD_FILE + '?token=' + token;
  }
};

/* Account */
const accountRequest = {
  // 更换头像
  changeUserPhoto: function (data) {
    return axios.put(path.CHANGE_USER_PHOTO, Qs.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  // 更新密码接口
  updatePass: function (data) {
    return axios.put(path.UPDATE_PASS, Qs.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  // 设置密码
  setPsw: function (data) {
    return axios.post(path.SET_PSW, Qs.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  updatePone: function (data) {
    return axios.put(path.UPDATE_PHONE, Qs.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  // 发送短信验证码
  sendCode: function (data) {
    return axios.post(path.GET_CODE, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  },
  // 获取用户名手机号接口
  getPhone: function (data) {
    return axios.post(path.GET_PHONE, Qs.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }
};

/* Authen */
const authenRequest = {
  // 获取 i18n 的种类
  getI18nType: function () {
    return axios.get(path.GET_LANGUAGE_TYPE);
  },
  // 获取 找回密码身份认证
  getPwd: function () {
    return axios.get(path.GET_PWD_INFO);
  },
  // 获取 短信校验
  getPhoCode: function (data) {
    return axios.post(path.GET_PHO_CODE, Qs.stringify(data));
  },
  // 获取异常登录校验码校验
  getUnusual: function (data) {
    return axios.post(path.GET_VERIFY_UNUSUAL, Qs.stringify(data));
  },
  // 获取i18n 配置json
  // @param language
  // @private
  getI18n: function (language = 'zh') {
    return axios.get('/static/i18n/' + language + '/index.json').then((data) => {
      window.I18n = data;
    });
  }
};

/* FincialState */
const fincialStateRequest = {
  // 获取财务报表模板
  getFincialTemplate: function () {
    return axios.get(path.GET_FINCIALTEMPLATE);
  },
  // 下载财务报表模板
  getDownFincialTemplate: function (id) {
    return axios({
      method: 'get',
      url: path.GET_DOWNFINCIALTEMPLATE + `/${id}`,
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    });
  },
  // 查看全部会计制度表格
  getAllCompanyTable: function (id) {
    return axios.get(path.GET_ALLCOMPANYTABLE + `/${id}`);
  },
  // 获取企业列表数据
  getCompanyList: function (data) {
    return axios.get(path.GET_COMPANYLIST, { params: data });
  },
  // 修改会计制度类型
  postModifyAccountType: function (data) {
    return axios.post(path.POST_MODIFYACCOUNTYPE + `/${data.cwbbxh}`, Qs.stringify(data));
  },
  // 上传文件
  postUploadFile: function (token) {
    return path.POST_UPLOADFILE + `?token=${token}`;
  },
  // 报送
  postSubmitTable: function (cwbbxh, data) {
    return axios.post(path.POST_SUBMITTABLE + `/${cwbbxh}`, data);
  },
  // 批量报送
  postBatchSubmit: function (data) {
    return axios.post(path.POST_BATCHSUBMIT, data);
  },
  // 保存
  postSaveTaxTable: function (cwbbxh, data) {
    return axios.post(path.POST_SAVETAXTABLE + `/${cwbbxh}`, data);
  },
  // 查看失败原因
  getViewFail: function (cwbbxh) {
    return axios.get(path.GET_VIEWFAIL + `/${cwbbxh}`);
  }
};

/* taxRelateReport */
const taxRelateReportRequest = {
  // 获取卡片列表数据
  getClientageList: function (data) {
    return axios.get(path.GET_CLIENTAGELIST, { params: data });
  },
  // 查询委托方信息
  getCompanyInfo: function (code) {
    return axios.get(path.GET_COMPANYINFO + `?tyshxydm=${code}`);
  },
  // 获取行业类型码值表详细
  getIndustryCode: function () {
    return axios.get(path.GET_INDUSTRYCODE);
  },
  // 获取行业码值表大类
  getIndustryBigCode: function () {
    return axios.get(path.GET_INDUSTRYBIGCODE);
  },
  // 获取审批人员信息
  getAuditor: function () {
    return axios.get(path.GET_AUDITOR);
  },
  // 涉税报告保存
  postTaxReport: function (data) {
    return axios.post(path.POST_TAXREPORT, data);
  },
  // 涉税报告报送
  postTaxReportUpdate: function (data) {
    return axios.post(path.POST_TAXREPORTUPDATE, data);
  },
  // 涉税报告卡片报送
  postTaxReportCradUpdate: function (id) {
    return axios.post(path.POST_TAXREPORTUPDATE + `/${id}`);
  },
  // 涉税报告删除
  postTaxReportDelete: function (id) {
    return axios.post(path.POST_TAXREPORTDELETE + `/${id}`);
  },
  // 获取涉税报告详情
  getTaxReportInfo: function (id) {
    return axios.get(path.GET_TAXREPORTINFO + `?ssxh=${id}`);
  },
  // 报告上传
  postTaxReportUpload: function (token) {
    return path.POST_TAXREPORTUPLOAD + `?token=${token}`;
  },
  // 删除已上传报告正文
  postDeleteTaxreport: function (id) {
    return axios.get(path.POST_DELETETAXREPORT + `/${id}`);
  },
  // 涉税报告撤回
  postTaxReportCancel: function (id) {
    return axios.post(path.POST_TAXREPORTCANCEL + `/${id}`);
  },
  // 涉税报告下载前判断
  getTaxReportJudgment: function (id) {
    return axios.get(path.GET_TAXREPORTJUDGMENT + `/${id}`);
  },
  // 涉税报告下载
  getTaxReportDownload: function (id) {
    return axios({
      method: 'get',
      url: path.GET_TAXREPORTDOWNLOAD + `/${id}`,
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    });
  },
  // 获取资产总额
  getAssets: function (id) {
    return axios.get(path.GET_ASSETS + `/${id}`);
  },
  // 获取上传文件时的uuid
  getFileUuid: function () {
    return axios.get(path.GET_FILEUUID);
  }
};

/* Declare */
const declareRequest = {
  getPayment: function (data = {}) {
    return axios.get(path.GET_Payment, { params: data });
  },
  payMent: function (data) {
    const d = Array.isArray(data) ? data : [data]
    return axios.post(path.POST_Payment, d);
  }
};

/* specilBiness 采集模块 */
const specilBiness = {
  // 非年度卡片首页
  postcardData: function (parms) {
    const config = parms || {};
    return axios.post(path.POST_card, Qs.stringify(config))
  },
  // 卡片查看
  postqueryData: function (parms) {
    const config = parms || {};
    return axios.post(path.POST_query, Qs.stringify(config))
  },
  // 报送
  postcollectionData: function (parms) {
    const config = parms || {};
    return axios.post(path.POST_collection, Qs.stringify(config))
  },
  // 信息人员查询
  postywqsrData: function (parms) {
    const config = parms || {};
    return axios.post(path.POST_ywqsr, Qs.stringify(config))
  },
  // 上报保存
  postcollectReportSave: function (parms) {
    const config = parms || {};
    return axios.post(path.POST_saveReport, config)
  },
  // 年度卡片首页
  postYearCardData: function (parms) {
    const config = parms || {};
    return axios.post(path.POST_yearCard, Qs.stringify(config))
  },
  // 年度报送
  getYearSendbasic: function (nd) {
    return axios.get(path.Get_yearBasic + `/${nd}`);
  },
  // 年度查新业务信息
  getYearSendinit: function (nd) {
    return axios.get(path.Get_yearInit + `/${nd}`);
  },
  // 年度查询信息
  getYearSendywxx: function (nd, ndbgbh) {
    return axios.get(path.Get_yearywxx + `/${nd}/${ndbgbh}`);
  },
  // 年度保存
  postYearReportSave: function (parms) {
    const config = parms || {};
    return axios.post(path.POST_saveYearReport, config)
  },
  // 卡片首页报送或者未报送统计
  getYearSendcount: function (parms) {
    const config = parms || {};
    return axios.get(path.Get_yearcount, { params: config });
  }
};
/* 涉税机构管理 TaxProfessionMange**/
const TaxProfessionMange = {
  taxcollectorSearch: function (parms = {}) {
    const config = { ...parms };
    return axios.get(path.Get_search, { params: config })
  },
  taxcollectorOrgitem: function (parms = {}) {
    const config = { ...parms };
    return axios.get(path.Get_org_item, { params: config })
  },
  taxcollectorOrgdetail: function (parms = {}) {
    const config = { ...parms };
    return axios.get(path.Get_org_detail, { params: config })
  },
  taxcollectorMandatorlist: function (parms = {}) {
    const config = { ...parms };
    return axios.get(path.Get_mandator_list, { params: config })
  },
  taxcollectorOrgtotal: function (parms) {
    const config = parms || {};
    return axios.get(path.Get_org_total, { params: config })
  },
  taxcollectorMsm: function (parms) {
    const config = parms || '';
    return axios.post(path.Post_org_sms, config)
  }
};

/* 涉税奖惩录入 TaxProfessionEntering**/
const TaxProfessionEntering = {
  taxentering: function (data) {
    return axios.get(path.Get_enterlist, { params: data })
  },
  taxenteringdetail: function (id, code) {
    return axios.get(path.Get_enterdetail + `/${id}/${code}`)
  },
  taxenteringsearch: function (code) {
    return axios.get(path.Get_entersearch + `/${code}`)
  },
  taxenteringdelete: function (code, type, id) {
    return axios.get(path.Get_enterdelete + `/${code}/${type}/${id}`)
  },
  taxenteringedit: function (params) {
    const config = params || {};
    return axios.post(path.Get_enteredit, config)
  },
  taxenteringadd: function (params) {
    const config = params || {};
    return axios.post(path.Get_enteradd, config)
  }
};
/** 小规模增值税 */
const VtaDeclareRequest = {
  // 首页列表
  getVatSbjtList (config = {}) {
    return axios.get(`${path.Get_vatsmallscale}/vatSbjtList`, { params: { ...config } });
  },
  // 修改
  getVatsmallscaleModify(sbtjId, ysbtjuuid, djxh) {
    return axios.get(`${path.Get_vatsmallscale}/${sbtjId}/${ysbtjuuid}/${djxh}/details`)
  },
  // 查看
  getVatsmallscaleInfo(sbtjId, ysbtjuuid, djxh) {
    return axios.get(`${path.Get_vatsmallscale}/${sbtjId}/${ysbtjuuid}/${djxh}/info`);
  },
  // 统计
  getVatsmallscaleVatSbtjCount(parms) {
    return axios.get(`${path.Get_vatsmallscale}/vatSbtjCount`, {params: {...parms}});
  },
  // 失败原因
  getFailReason(ysbtjuuid) {
    return axios.get(`${path.Get_vatsmallscale}/${ysbtjuuid}/failReason`);
  },
  // 批量申报
  postVatsmallscaleBatchdeclare(parms = {}) {
    return axios.post(`${path.Get_vatsmallscale}/batchdeclare`, {...parms})
  }
}
/** 附征税申报 */
const DeclareRequest = {
  declarelist: function (data) {
    return axios.get(path.Get_declarelist, { params: data })
  },
  declaredetail: function (data) {
    return axios.get(path.Get_declaredetail, { params: data })
  },
  declareupdate: function (params) {
    const config = params || {};
    return axios.post(path.Get_declareupdate, config)
  },
  declare: function (params) {
    const config = params || {};
    return axios.post(path.Get_declare, config)
  },
  declareall: function (params) {
    const config = params || {};
    return axios.post(path.Get_declareall, config)
  },
  declarefail: function (data) {
    return axios.get(path.Get_declarefail, { params: data })
  },
}
/** 涉税分析报告----模块 */
const TaxAnalysisReport = {
  getSWJG_DM: function (params) {
    const config = { ...params }
    return axios.get(path.Get_SWJG_DM, {params: config})
  },
  getTime: function (params) {
    const config = params || {};
    return axios.get(path.Get_time, {params: config})
  },
  getOnePage: function (params) {
    const config = {...params}
    return axios.get(path.Get_onePage, { params: config })
  },
  getTwoPage: function (params) {
    const config = { ...params }
    return axios.get(path.Get_twoPage, {params: config})
  },
  getUnNormalPerson: function (params) {
    const config = params
    return axios.get(path.Get_UnNormalPerson, { params: config })
  },
  getThreePage: function (data) {
    return axios.get(path.Get_threePage, {params: data})
  },
  getFourPage: function (data) {
    return axios.get(path.Get_fourPage, {params: data})
  },
  getFourPagePie: function (data) {
    return axios.get(path.Get_FourPage_pie, {params: data})
  },
}
export {
  loginRequest,
  organizationRequest,
  pwdRequest,
  registerRequest,
  serverRequest,
  agentRequest,
  accountRequest,
  authenRequest,
  fincialStateRequest,
  declareRequest,
  specilBiness,
  taxRelateReportRequest,
  TaxProfessionMange,
  TaxProfessionEntering,
  VtaDeclareRequest,
  DeclareRequest,
  TaxAnalysisReport
}
