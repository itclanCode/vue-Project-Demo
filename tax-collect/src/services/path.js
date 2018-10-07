/**
 * Created by qintengbo on 2018/05/08.
 * 接口路径统一配置，方便修改
 */

let api = process.env.API_PATH // 开发环境
// let api = 'http://134.175.48.152'; // 测试环境
// let api = 'http://193.112.60.53'; // 生产环境

// 企易税链接IP通用
window.localStorage['url'] = 'http://139.199.201.11';

export default {
  /* Common */
  // 获取i18n种类
  GET_LANGUAGE_TYPE: `${api}/get/i18n_type`,
  // 短信校验码
  GET_PHO_CODE: `${api}/sms/anon/code/send`,
  // 验证码校验
  GET_SECURITY_VERIFY: `${api}/sms/anon/code/verify`,

  /* Login */
  // 获取登录信息
  GET_LOGIN_INFO: `${api}/sso/login`,
  // 获取用户角色信息
  GET_LOGIN_USER: `${api}/user/role`,
  // 机构是否实名
  ORG_REALNAME: `${api}/agency/tax-org/real-name`,

  /* Organization */
  // 获取机构类别
  GET_ORGTYPE: `${api}/agency/agency-code/org-type`,
  // 获得执业许可类别
  GET_PRACTICELICENSE: `${api}/getpracticelicense`,
  // 若机构类型为“税务师事务所” ,调用外部服务接口判断断该机构是否已进行税务师事务所行政登记
  GET_IS_ORGADMINREG: `${api}/isorgadminreg`,
  // 获取机构信息
  GET_ORGINFO: `${api}/agency/tax-org/current`,
  // 修改机构实名信息
  UPDATE_ORGINFO: `${api}/agency/tax-org`,
  // 终止服务
  STOP_SERVICE: `${api}/agency/tax-org/stop-service`,
  // 恢复服务
  RESTART_SERVICE: `${api}/agency/tax-org/recover-service`,
  // 获取机构码值
  GET_ORG_TYPE_CODE: `${api}/agency/code/org-type`,
  // 获取证书码值
  GET_ORG_CERT_TYPE: `${api}/agency/code/license`,
  // 获取身份证件码值表
  GET_ID_CARD_LIST: `${api}/agency/code/card`,
  // 登记注册类型码值表
  GET_SIGN_TYPE: `${api}/agency/code/register`,
  // 获取用户是否已进行实名
  GET_IS_ORGREALNAME: `${api}/agency/tax-org/real-name`,

  /* Agent */
  // 根据机构获得机构的服务项目
  // GET_ORGSERVICE_ITEMS: '/getorgserviceitems',
  // 根据机构获得机构的服务项目
  GET_ORGSERVICE_ITEMS: `${api}/agency/tax-org/service-item`,
  // 获取所有的委托协议
  GET_PROTOCOL: `${api}/clientage/protocol`,
  // 获取所有详细的委托协议
  GET_PROTOCOL_DETAIL: `${api}/clientage/protocol/`,
  // 查看状态
  GET_STATUS: `${api}/agency/code/protocol-status`,
  // 获取代理人信息
  GET_AGENT_DETAIL: `${api}/agent/org-agent/all`,
  // 添加委托关系
  ADD_AGENT_DETAIL: `${api}/clientage/protocol`,
  // 通过url添加委托关系
  ADD_AGENT_ORDER: `${api}/taobao/order/protocol/`,
  // 更改委托关系
  UPDATA_PROTOCOL: `${api}/clientage/protocol/update`,
  // 更改代理关系
  EDIT_AGENT: `${api}/protocol/`,
  // 通过统一社会信用代码查找委托人
  LOOKFOR_AGENT: `${api}/mandator`,
  // 合同下载
  DOWNLOAD_CONCAT: `${api}/clientage/protocol/`,
  // 移除委托关系
  DEL_DELEGATION: `${api}/protocol/`,
  // 合同上传
  DOWNLOAD_FILE: `${api}/oss/file-upload`,
  // 获取省份
  GET_PROVICE_LIST: `${api}/agency/code/regions`,
  END_TERMINATION: `${api}/clientage/protocol/`,
  //  获取主管税务机关
  GET_AUTHORITY: `${api}/agency/code/authority`,
  // 查询机构服务状态
  GET_ORG_STATUS: `${api}/clientage/agency/status`,
  // 获取机构名称
  GET_ORGANIZATION_NAME: `${api}/agency/tax-org/name`,

  /* Server */
  // 获取在职人员列表
  // GET_MISSIONAGENTS: `${api}/getmissionagents`,
  // 获取在职人员列表
  GET_MISSIONAGENTS: `${api}/agent/org-agent`,
  // 获取离职人员列表
  GET_DISMISSIONAGENTS: `${api}/getdismissionagents`,
  // 提交代理人实名信息
  // SUBMIT_TAXAGENT_INFO: `${api}/submittaxagentinfo`,
  // 保存代理人信息
  SUBMIT_TAXAGENT_INFO: `${api}/agent/org-agent`,
  // 更新修改代理人实名信息
  UPDATE_TAXAGENT_INFO: `${api}/updatetaxagentinfo`,
  // 删除职业资格证书
  DELETE_PAPERATTACH: `${api}/deletepaperattach`,
  // 判断代理人是否注册
  IS_HASAGENT_REGISTE: `${api}/ishasagentregiste`,
  // 获得税务代理人详细信息
  // GET_TAXAGENT_DETAIL: `${api}/gettaxagentdetail`,
  GET_TAXAGENT_DETAIL: `${api}/agent/org-agent`,
  // 解除代理人和机构的雇佣关系
  FIRE_ORGAGENT: `${api}/fireorgagent`,
  // 查询机构内代理人正在进行中的的代理记录(ta的客户)
  GET_TAX_ORG_AGENT: `${api}/tax-org/agent`,
  // 得到机构内所有的在职代理人（将服务分配给其他人）
  GET_ORGAGENTS: `${api}/getorgagents`,
  // 更改代理关系，将该代理人名下的代理客户分配给其他代理人
  CHANGE_AGENT_RELATION: `${api}/changeagentrelation`,
  // 获得机构内身份类别列表
  // GET_ORGPOSITION_LIST: `${api}/code/getorgposition`,
  GET_ORGPOSITION_LIST: `${api}/agent/code/org-inner-identity`,
  // 获得政治面貌类别列表
  // GET_POLITICSTATUS_LIST: `${api}/code/getpoliticstatus`,
  GET_POLITICSTATUS_LIST: `${api}/agent/code/politics-status`,
  // 获得证件类型代码表
  // GET_CERTTYPE_LIST: `${api}/code/getcerttypelist`,
  GET_CERTTYPE_LIST: `${api}/agent/code/cert`,
  // 获得学历列表
  // GET_EDUCATIONTYOE_LIST: `${api}/code/geteducationtypelist`,
  GET_EDUCATIONTYOE_LIST: `${api}/agent/code/education`,
  // 根据机构获得机构的服务项目
  // GET_ORGSERVICE_ITEMS: `${api}/getorgserviceitems`,
  // GET_ORGSERVICE_ITEMS: `${api}/agency/tax-org/service-item`,
  // 职业资格证书类别
  // GET_PAPERTYPE_ITEM: `${api}/code/getpaperstypeitem`,
  GET_PAPERTYPE_ITEM: `${api}/agent/code/papers`,
  // 发送短信验证码
  // POST_SENDMESCODE: `${api}/security/code/send`,
  POST_SENDMESCODE: `${api}/sms/anon/code/send`,
  // 搜索
  SEARCH_ORGAGENT: `${api}/searchorgagent`,
  // 离职
  // IS_HASUNFINISHED_SERVICE_ITEM: `${api}/ishasunfinishedserviceitem`,
  IS_HASUNFINISHED_SERVICE_ITEM: `${api}/agent/org-agent/`,
  // 获取手机号码信息
  // CHECK_PHONE_NUM: `${api}/agent`,
  // 通过手机号码获取用户信息
  CHECK_PHONE_NUM: `${api}/agent/org-agent/phone/`,
  // userListService页面，获取 TA的客户 的信息
  PROTOCOL: `${api}/agent/protocol`,
  // userListService页面，另分配弹出框的列表信息
  DISTRIBUTION_ALL_MODAL: `${api}/agent/org-agent/all`,
  // userListService页面，另分配弹出框的确定
  DISTRIBUTION_OK: `${api}/agent/protocol/assign`,
  // userListService页面， 状态列表
  STATUS_LIST: `${api}/agency/code/protocol-complete`,
  // kami: addService页面，获取机构名称传到短信验证码发送接口
  // GET_ORGANIZATION_NAME: `${api}/agency/tax-org/name`,

  /* Account */
  // 更新密码接口
  UPDATE_PASS: `${api}/user/pass/update`,
  // 设置密码
  SET_PSW: `${api}/user/anon/mobilPass/reset`,
  // 更新手机号
  UPDATE_PHONE: `${api}/user/phone/update`,
  // 获取短信验证码
  GET_CODE: `${api}/sms/anon/code/send`,
  // 获取用户名手机号接口
  GET_PHONE: `${api}/user/anon/account/info`,
  // 更换头像
  CHANGE_USER_PHOTO: `${api}/photo/update`,

  /* Authen */
  // 找回密码验证身份
  GET_PWD_INFO: `${api}/get/pwd`,
  // 短信校验码
  GET_VERIFY_UNUSUAL: `${api}/verify/unusual`,

  /* Pwd */
  // 找回密码验证身份
  GET_Iden_INFO: `${api}/user/anon/account/info`,
  // 图片校验码
  GET_Image_CODE: `${api}/user/anon/image/code`,
  // 设置密码
  GET_Pwd_Info: `${api}/user/anon/pass/reset`,

  /* Register */
  // 代理机构注册
  POST_AGENCY_LIST: `${api}/user/anon/register/agency`,
  // 判断手机号是否存在
  GET_PHONE_LIST: `${api}/user/anon/registered/phone`,
  // 判断用户名是否存在
  GET_USERNAME_LIST: `${api}/user/anon/registered/username`,
  // 校验短信验证码
  VERIFY_CODE: `${api}/sms/anon/code/verify`,
  // 判断社会统一信用码是否注册
  GET_IRD: `${api}/user/anon/registered/credit-code`,
  // 获取法人手机号列表
  // GET_LEGALPHONE: `${api}/legal/phone/exist`,
  // 获取机构类型
  GET_ORG_TYPE: `${api}/agency/code/org-type`,

  /* fincialState */
  // 获取财务报表模板下载链接
  GET_FINCIALTEMPLATE: `${api}/declare/cwbb/download/templates`,
  // 下载财务报表模板
  GET_DOWNFINCIALTEMPLATE: `${api}/declare/cwbb/download/template`,
  // 上传报表
  POST_UPLOADFILE: `${api}/declare/cwbb/import`,
  // 获取企业列表数据
  GET_COMPANYLIST: `${api}/declare/cwbb/enterprises`,
  // 修改会计制度类型
  POST_MODIFYACCOUNTYPE: `${api}/declare/cwbb/changeType`,
  // 查看会计制度表格
  GET_ALLCOMPANYTABLE: `${api}/declare/cwbb/view`,
  // 报送
  POST_SUBMITTABLE: `${api}/declare/cwbb/submit`,
  // 批量报送
  POST_BATCHSUBMIT: `${api}/declare/cwbb/batchSubmit`,
  // 保存
  POST_SAVETAXTABLE: `${api}/declare/cwbb/update`,
  // 查看失败原因
  GET_VIEWFAIL: `${api}/declare/cwbb/failed`,

  /* taxRelateReport */
  // 涉税报告上传卡片列表
  GET_CLIENTAGELIST: `${api}/clientage/ssbg/list`,
  // 获取委托方信息
  GET_COMPANYINFO: `${api}/clientage/ssbg/wtf`,
  // 获取行业码值表详细
  GET_INDUSTRYCODE: `${api}/agency/code/industry`,
  // 获取行业码值表大类
  GET_INDUSTRYBIGCODE: `${api}/clientage/ssbg/hy`,
  // 涉税报告保存
  POST_TAXREPORT: `${api}/clientage/ssbg/save`,
  // 涉税报告报送
  POST_TAXREPORTUPDATE: `${api}/clientage/ssbg/submit`,
  // 获取审批人员
  GET_AUDITOR: `${api}/clientage/ssbg/auditor`,
  // 涉税报告删除
  POST_TAXREPORTDELETE: `${api}/clientage/ssbg/delete`,
  // 涉税报告查看
  GET_TAXREPORTINFO: `${api}/clientage/ssbg/view`,
  // 上传报告正文
  POST_TAXREPORTUPLOAD: `${api}/oss/cos/upload/ssbg`,
  // 删除已上传报告正文
  POST_DELETETAXREPORT: `${api}/clientage/ssbg/deletedFile`,
  // 涉税报告撤回
  POST_TAXREPORTCANCEL: `${api}/clientage/ssbg/cancel`,
  // 涉税报告下载前判断
  GET_TAXREPORTJUDGMENT: `${api}/clientage/ssbg/checkDownload`,
  // 涉税报告下载
  GET_TAXREPORTDOWNLOAD: `${api}/clientage/ssbg/download`,
  // 获取资产总额
  GET_ASSETS: `${api}/clientage/ssbg/wtrkz`,
  // 文件上传获取uuid
  GET_FILEUUID: `${api}/oss/cos/ssbg/uuid`,

  /* Declare */
  // 获取缴款信息
  GET_Payment: `${api}/pay/getPayment`,
  // 单户缴款
  POST_Payment: `${api}/pay/doPay`,

  /* BussinessCol */
  // 业务报告采集
  // 卡片首页
  POST_card: `${api}/clientage/report/card`,
  // 卡片首页查看报表接口
  POST_query: `${api}/clientage/report/query`,
  // 卡片首页报送报表接口
  POST_collection: `${api}/clientage/report/collection`,
  // 查询相关人员接口
  POST_ywqsr: `${api}/clientage/report/ywqsr`,
  // 保存接口
  POST_saveReport: `${api}/clientage/report/saveReport`,
  // 年度首页卡片查询
  POST_yearCard: `${api}/clientage/yearReport/card`,
  // 年度报送基本信息
  Get_yearBasic: `${api}/clientage/yearReport/basic`,
  // 年度报送业务查询
  Get_yearInit: `${api}/clientage/yearReport/init`,
  // 报送或者已报送的统计
  Get_yearcount: `${api}/clientage/report/cardcount`,
  // 年度查询
  Get_yearywxx: `${api}/clientage/yearReport/ywxx`,
  // 年度保存
  POST_saveYearReport: `${api}/clientage/yearReport/save`,
  // 涉税机构管理 税务机关下拉框接口
  Get_org_item: `${api}/collector/tax-collector/org_item`,
  // 涉税机构首页搜索接口
  Get_search: `${api}/collector/tax-collector/search`,
  // 涉税机构管理 查询涉税机构详情接口
  Get_org_detail: `${api}/collector/tax-collector/org_detail`,
  // 获取委托托人信息接口
  Get_mandator_list: `${api}/collector/tax-collector/mandator_list`,
  // 涉税机构管理计数
  Get_org_total: `${api}/collector/tax-collector/org_total`,
  // 短信接口
  Post_org_sms: `${api}/collector/tax-collector/org_sms`,

  /**
   * 涉税奖惩情况录入模块接口
   */
  // 涉税奖惩录入列表接口
  Get_enterlist: `${api}/collector/agencyrp/getCards`,
  // 涉税奖惩录入详情接口
  Get_enterdetail: `${api}/collector/agencyrp/detailsAgencyRp`,
  // 涉税奖惩录入查询接口
  Get_entersearch: `${api}/collector/agencyrp/getAgencyBasic`,
  // 涉税奖惩录入删除接口
  Get_enterdelete: `${api}/collector/agencyrp/delteSituation`,
  // 涉税奖惩录入编辑接口
  Get_enteredit: `${api}/collector/agencyrp/updateSituation`,
  // 涉税奖惩录入新增接口
  Get_enteradd: `${api}/collector/agencyrp/addSituation`,
  /** 增值税小规模 */
  Get_vatsmallscale: `${api}/declare/vatsmallscale`,
  /**
   * 附征税申报模块接口
   */
  // 附征税申报列表接口
  Get_declarelist: `${api}/declare/surtax/search`,
  // 附征税详情列表接口
  Get_declaredetail: `${api}/declare/surtax/detail`,
  // 附征税详情列表修改接口
  Get_declareupdate: `${api}/declare/surtax/update`,
  // 附征税详情列表申报接口
  Get_declare: `${api}/declare/surtax/declare`,
  // 附征税详情列表批量申报接口
  Get_declareall: `${api}/declare/surtax/declare_all`,
  // 附征税详情列表失败原因接口
  Get_declarefail: `${api}/declare/surtax/declare_fail`,
  /**
   * 涉税分析报告----模块接口
   */
  Get_SWJG_DM: `${api}/dynanalyze/getswjgdm`,
  Get_time: `${api}/dynanalyze/ysmsszyfw/date`,
  Get_onePage: `${api}/dynanalyze/ssxxfxbgsy`,
  Get_twoPage: `${api}/dynanalyze/sszyfwjgjbqk`,
  Get_UnNormalPerson: `${api}/dynanalyze/getfzch`,
  Get_threePage: `${api}/dynanalyze/ysmsszyfw`,
  Get_fourPage: `${api}/dynanalyze/glqiqk`,
  Get_FourPage_pie: `${api}/dynanalyze/glqiqk/status`
}
