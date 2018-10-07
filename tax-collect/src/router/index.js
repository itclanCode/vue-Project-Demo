import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../pages/Dashboard/dashboard.vue';
import RealNameCollect from '../pages/RealNameCollect/Agent/index.vue'
import AddAgent from '../pages/RealNameCollect/Agent/components/addAgent.vue'
import CheckAgent from '../pages/RealNameCollect/Agent/components/checkAgent.vue'
import EditAgent from '../pages/RealNameCollect/Agent/components/editAgent.vue'
import EndAgent from '../pages/RealNameCollect/Agent/components/endAgent.vue'
import Server from '../pages/RealNameCollect/Server'
import EditService from '../pages/RealNameCollect/Server/components/editService.vue'
import AddService from '../pages/RealNameCollect/Server/components/addService.vue'
import UserListService from '../pages/RealNameCollect/Server/components/userListService.vue'
import PeopleInformationService from '../pages/RealNameCollect/Server/components/PeopleInformationService.vue'
import Organization from '../pages/RealNameCollect/Organization/index.vue'
import EditOrganization from '../pages/RealNameCollect/Organization/components/editOrganization.vue'
import Login from '../pages/Login'
import StopServices from '../pages/RealNameCollect/Organization/components/stopServices.vue'
import RecoverService from '../pages/RealNameCollect/Organization/components/recoverService.vue'
import Index from '../pages/Index'
import PromiseInfo from '../pages/PromiseInfo'
import Pwd from '../pages/Pwd'
import Demand from '../pages/Register/components/demand.vue'
import Supply from '../pages/Register/components/supply.vue'
import Aut from '../pages/Authen'
import Account from '../pages/Account'
import Update from '../pages/Update'
import SpecilBiness from '../pages/BussinessColl/specilBiness';
import Declare from '../pages/Declare';
import Updated from '../pages/Declare/components/updated.vue';
import FinancialState from '../pages/FinancialState';
import Payment from '../pages/Payment';
import TaxrelatedReport from '../pages/TaxRelatedReport';
import TaxReportFlow from '../pages/TaxRelatedReport/taxReportFlow';
import VtaDeclare from '../pages/VtaDeclare';
import ModifyReport from '../pages/VtaDeclare/ModifyReport';
import TaxProfessionIndex from '../pages/TaxProfessionManage/taxProfessionIndex';
import TaxProfessionEntering from '../pages/TaxProfessionEntering/index.vue';
import taxEnterInfo from '../pages/TaxProfessionEntering/taxEnterInfo.vue'
import TaxProfessionInfo from '../pages/TaxProfessionManage/taxProfessionInfo';
import ErrorPage from '../pages/ErrorPage/netErrorPage';
import LoadingPage from '../pages/ErrorPage/loadingPage';
import Index1 from '../pages/Index/index.vue';
import TaxReportChart from '../pages/TaxReportChart/index.vue';
Vue.use(Router)

const vueRouter = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: 'login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/pwd',
      name: 'Pwd',
      component: Pwd
    },
    {
      path: '/aut',
      name: 'Aut',
      component: Aut
    },
    {
      path: '/supply',
      name: 'Supply',
      component: Supply
    },
    {
      path: '/error/',
      name: 'Error',
      component: { ErrorPage }
    },
    {
      path: '/loading',
      name: 'Neterror',
      component: { LoadingPage }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      children: [
        {
          path: '/index',
          name: 'Index',
          component: Index
        },
        {
          path: '/realNameCollect',
          name: 'RealNameCollect',
          component: RealNameCollect
        },
        {
          path: '/addAgent',
          name: 'addAgent',
          component: AddAgent
        },
        {
          path: '/checkAgent',
          name: 'checkAgent',
          component: CheckAgent
        },
        {
          path: '/editAgent',
          name: 'editAgent',
          component: EditAgent
        },
        {
          path: '/endAgent',
          name: 'endAgent',
          component: EndAgent
        },
        {
          path: '/server',
          name: 'Server',
          component: Server
        },
        {
          path: '/editService',
          name: 'EditService',
          component: EditService
        },
        {
          path: '/addService',
          name: 'AddService',
          component: AddService
        },
        {
          path: '/organization',
          name: 'Organization',
          component: Organization
        },
        {
          path: '/userListService',
          name: 'userListService',
          component: UserListService
        },
        {
          path: '/peopleInformationService',
          name: 'PeopleInformationService',
          component: PeopleInformationService
        },
        {
          path: '/editOrganization',
          name: 'EditOrganization',
          component: EditOrganization
        },
        {
          path: '/stopServices',
          name: 'StopServices',
          component: StopServices
        },
        {
          path: '/recoverService',
          name: 'RecoverService',
          component: RecoverService
        },
        {
          path: '/promiseInfo',
          name: 'PromiseInfo',
          component: PromiseInfo
        },
        {
          path: '/demand',
          name: 'Demand',
          component: Demand
        },
        {
          path: '/account',
          name: 'Account',
          component: Account
        },
        {
          path: '/update',
          name: 'Update',
          component: Update
        },
        {
          path: '/specilBiness',
          name: 'SpecilBiness',
          component: SpecilBiness
        },
        {
          path: '/declare',
          name: 'Declare',
          component: Declare
        },
        {
          path: '/updated/:id/:type/:date',
          name: 'Updated',
          component: Updated
        },
        {
          path: '/financialState',
          name: 'FinancialState',
          component: FinancialState
        },
        {
          path: '/index1',
          name: 'Index1',
          component: Index1
        },
        {
          path: '/payment',
          name: 'Payment',
          component: Payment
        },
        {
          path: '/taxRelatedReport',
          name: 'TaxRelatedReport',
          component: TaxrelatedReport
        },
        {
          path: '/taxReportFlow/:ssxh/:num',
          name: 'TaxReportFlow',
          component: TaxReportFlow
        },
        {
          path: '/vtaDeclare',
          name: 'VtaDeclare',
          component: VtaDeclare
        },
        {
          path: '/modifyReport/:djxh/:sbtjId/:ysbtjuuid/:type',
          name: 'ModifyReport',
          component: ModifyReport
        },
        {
          path: '/taxProfessionManage',
          name: 'TaxProfessionManage',
          component: TaxProfessionIndex
        },
        {
          path: '/taxProfessionEntering',
          name: 'TaxProfessionEntering',
          component: TaxProfessionEntering
        },
        {
          path: '/taxEnterInfo/:id/:code',
          name: 'TaxEnterInfo',
          component: taxEnterInfo
        },
        {
          path: '/TaxProfessionInfo/:taxOrgId/:socialCreditCode',
          name: 'TaxProfessionInfo',
          component: TaxProfessionInfo
        },
        {
          path: '/taxReportChart',
          name: 'TaxReportChart',
          component: TaxReportChart
        }
      ]
    }
  ]
});
vueRouter.beforeEach(function (to, from, next) {
  // url中带有token，存入localstorage
  var token = window.location.search.split('&')[0].split('=')[1];
  var key = window.location.search.split('&')[0].split('=')[0];
  if (key === '?token') {
    localStorage.setItem('token', token)
  }
  // 未登录时直接使用路径跳转到登陆页面并且没有带token值
  if (!localStorage.getItem('token') && to.name !== 'Login') {
    vueRouter.push({name: 'Login'});
  }
  next();
});
export default vueRouter
