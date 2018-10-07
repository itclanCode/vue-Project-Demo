/**
 * Created by qintengbo on 2018/05/11.
 * 采用Easy Mock模拟假数据，分模块编写
 */

import axios from 'axios';

const url = 'https://www.easy-mock.com/mock/5af8f8ba113f91088393ab96/tax';

// 财务报表批量报送模块
const fincialMock = {
  // 获取企业列表
  getFincialList: function () {
    return axios.get(`${url}/getFincicalList`)
  },
  // 获取涉税报告上传卡片列表
  getTaxReportCard: function(state) {
    return axios.get(`${url}/taxreportCard?state=${state}`);
  },
  // 涉税报告上传获取委托方信息
  getCompanyInfo: function() {
    return axios.get(`${url}/companyInfo`);
  },
  // 获取增值税申报企业列表
  getVtaCompanyList: function(config = {}) {
    return axios.get(`${url}/vtaDeclareList`, {params: {...config}});
  },
   // 获取附征税申报企业列表
  getDeCompanyList: function(config = {}) {
    return axios.get(`${url}/getDeclare`, {params: {...config}});
  },
  // 附征税修改报表
  getDeclareDetail: function(id) {
    return axios.get(`${url}/getDeclare/detail/${id}`)
  }
};

// 缴款模块
const declareMock = function (path, data) {
  const p = url + '/' + path
  return data ? axios.post(p, data) : axios.get(p)
}
// ---增值税小规模---
const VtaDeclareMock = {
  // 首页列表
  getVatSbjtList(config = {}) {
    return axios.get(`${url}/declare/vatsmallscale/vatSbjtList`, {params: {...config}});
  },
  // 修改
  getVatsmallscaleModify(sbtjId, ysbtjuuid, djxh) {
    return axios.get(`${url}/declare/vatsmallscale/${sbtjId}/${ysbtjuuid}/${djxh}/detail`)
  },
  // 附表查看
  getVatsmallscaleInfo(sbtjId, ysbtjuuid, djxh) {
    return axios.get(`${url}/declare/vatsmallscale/${sbtjId}/${ysbtjuuid}/${djxh}/info`)
  },
  // 失败
  getVatsmallscaleReason(ysbtjuuid) {
    return axios.get(`${url}/declare/vatsmallscale/${ysbtjuuid}/failReason`)
  }
}
// 专向业务报告报送列表
const specilMock = {
  specPostList: function (path, parms) {
    const config = parms || {};
    return axios.post(`${url}/clientage/report/${path}`, config)
  },
  sepcGetCount: function(path, parms) {
    const config = parms || {};
    return axios.get(`${url}/clientage/report/${path}`, {params: config})
  },
  specPostYearCard: function(path, parms) {
    const config = parms || {}
    return axios.post(`${url}/clientage/yearReport/${path}`, config)
  },
  specGetYearModel: function(path, id) {
    return axios.get(`${url}/clientage/yearReport/${path}/${id}`)
  },
  // 涉税专业服务管机构 首页卡片
  taxprofessCard: function(path, parms) {
    const config = parms || {};
    return axios.get(`${url}/taxprofess/${path}`, {params: config})
  },
  // 涉税专业服务管机构 详细信息
  taxprofessDetail: function(parms) {
    const config = parms || {};
    return axios.get(`${url}/professInfo/detail`, {params: config})
  },
  // 涉税专业服务管理机构 委托协议列表
  taxprofessList: function(currentPage) {
    return axios.get(`${url}/professInfo/serverlist/${currentPage}`)
  },
  // 涉税机构管理统计
  taxprofessCount: function() {
    return axios.get(`${url}/taxprofess/count`)
  },
  //  -----涉税机构管理----
  taxcollector: function(path, parms = {}) {
    const config = {...parms};
    return axios.get(`${url}/collector/tax-collector/${path}`, {params: config})
  }
};

// 涉税专业服务机构奖惩情况录入模块
const enterMock = {
  // 奖惩情况列表
  enterList: function () {
    return axios.get(`${url}/taxprofessenter/card`)
  },
  enterDetail: function (code) {
    return axios.get(`${url}/taxEnterInfo/${code}`)
  }
};
export {
  fincialMock,
  declareMock,
  specilMock,
  enterMock,
  VtaDeclareMock
}
