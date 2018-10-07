/**
 * Created by qintengbo on 2018/05/10.
 * 将菜单数据统一放到这里配置，添加修改方便
 */

export default [
  {
    id: '2',
    name: '实名信息采集',
    path: 'realName',
    icon: 'el-icon-rep-caidan',
    roleId: 6,
    children: [
      {
        id: '2-1',
        name: '涉税机构实名',
        path: 'Organization'
      },
      {
        id: '2-2',
        name: '涉税服务人员实名',
        path: 'Server'
      },
      {
        id: '3-3',
        name: '委托代理关系实名',
        path: 'RealNameCollect'
      }
    ]
  },
  {
    id: '3',
    name: '需求广场',
    path: 'demandSquare',
    icon: 'el-icon-rep-guangchang',
    roleId: 10
  },
  {
    id: '4',
    name: '店铺管理',
    path: 'storeManagement',
    icon: 'el-icon-rep-dianpu1',
    roleId: 6,
    children: [
      {
        id: '4-1',
        name: '店铺设置',
        url: '/storeSet'
      },
      {
        id: '4-2',
        name: '订单管理',
        url: '/orderControl'
      },
      {
        id: '4-3',
        name: '产品管理',
        url: '/productControl'
      }
    ]
  },
  {
    id: '5',
    name: '涉税业务报送',
    path: 'TaxRelatedBusiness',
    roleId: 6,
    icon: 'el-icon-rep-feiji',
    children: [
      {
        id: '5-1',
        name: '业务报告采集',
        path: 'SpecilBiness'
      },
      {
        id: '5-2',
        name: '涉税报告上传',
        path: 'TaxRelatedReport'
      }
    ]
  },
  {
    id: '6',
    name: '涉税监督管理',
    path: 'taxSupervision',
    roleId: 9,
    icon: 'el-icon-rep-guanli1',
    children: [
      {
        id: '6-1',
        name: '涉税专业服务机构管理',
        path: 'TaxProfessionManage'
      },
      {
        id: '6-2',
        name: '涉税专业服务机构奖惩情况录入',
        path: 'TaxProfessionEntering'
      },
      {
        id: '6-3',
        name: '涉税分析报告',
        path: 'TaxReportChart'
      }
    ]
  },
  {
    id: '7',
    name: '便捷办税',
    path: 'convenientTaxation',
    roleId: 7,
    icon: 'el-icon-rep-qianzhengbanli',
    children: [
      {
        id: '7-1',
        name: '申报',
        path: 'declare',
        children: [
          {
            id: '7-1-1',
            name: '增值税(小规模纳税人)申报',
            path: 'VtaDeclare'
          },
          {
            id: '7-1-2',
            name: '财务报表',
            path: 'FinancialState'
          },
          {
            id: '7-1-3',
            name: '附征税申报',
            path: 'Declare'
          },
          {
            id: '7-1-4',
            name: '申报表管理',
            path: ''
          },
          {
            id: '7-1-5',
            name: '企业所得税季度申报表(A类)',
            path: ''
          },
          {
            id: '7-1-6',
            name: '企业所得税季度申报表(B类)',
            path: ''
          }
          //  {
          //    id: '7-1-4',
          //    name: '首页',
          //    path: 'Index1'
          //  }
        ]
      },
      {
        id: '7-2',
        name: '缴款',
        path: 'Payment'
      }
    ]
  }
]
