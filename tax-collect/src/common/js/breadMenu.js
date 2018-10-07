/**
 * Created by qintengbo on 2018/06/22.
 * 面包屑全局配置,方便修改
 */
export default [
  {
    name: '首页',
    path: 'Index',
  },
  {
    name: '实名信息采集',
    path: '',
    children: [
      {
        name: '涉税机构实名',
        path: 'Organization',
        children: [
          {
            name: '中止服务',
            path: 'StopServices'
          },
          {
            name: '更改',
            path: 'EditOrganization'
          },
          {
            name: '恢复',
            path: 'RecoverService'
          }
        ]
      },
      {
        name: '涉税服务人员实名',
        path: 'Server',
        children: [
          {
            name: '添加 / 编辑税务代理人',
            path: 'AddService'
          },
          {
            name: '涉税服务人员信息',
            path: 'PeopleInformationService'
          },
          {
            name: '客户管理',
            path: 'userListService'
          }
        ]
      },
      {
        name: '委托代理关系实名',
        path: 'RealNameCollect',
        children: [
          {
            name: '添加委托代理关系',
            path: 'addAgent'
          },
          {
            name: '查看委托代理关系',
            path: 'checkAgent'
          },
          {
            name: '变更委托代理关系',
            path: 'editAgent'
          },
          {
            name: '终止委托代理关系',
            path: 'endAgent'
          }
        ]
      },
    ]
  },
  {
    name: '涉税业务报送',
    path: '',
    children: [
      {
        name: '业务报告采集',
        path: 'SpecilBiness'
      },
      {
        name: '涉税报告上传',
        path: 'TaxRelatedReport',
        children: [
          {
            name: '添加涉税报告',
            path: 'TaxReportFlow'
          }
        ]
      },
    ]
  },
  {
    name: '涉税监督管理',
    path: '',
    children: [
      {
        name: '涉税专业服务机构管理',
        path: 'TaxProfessionManage',
        children: [
          {
            name: '基本信息',
            path: 'TaxProfessionInfo'
          }
        ]
      },
      {
        name: '涉税专业服务机构奖惩情况录入',
        path: 'TaxProfessionEntering',
        children: [
          {
            name: '添加',
            path: 'TaxEnterInfo'
          }
        ]
      },
      {
        name: '涉税分析报告',
        path: 'TaxReportChart'
      }
    ]
  },
  {
    name: '便捷办税',
    path: '',
    children: [
      {
        name: '申报',
        path: '',
        children: [
          {
            name: '附征税申报',
            path: 'Declare',
            children: [
              {
                name: '修改报表',
                path: 'Updated',
              }
            ]
          },
          {
            name: '增值税(小规模纳税人)申报',
            path: 'VtaDeclare',
            children: [
              {
                name: '增值税主附表',
                path: 'ModifyReport'
              }
            ]
          },
          {
            name: '财务报表',
            path: 'FinancialState'
          },
        ]
      },
      {
        name: '缴款',
        path: 'Payment'
      },
    ]
  },
  {
    name: '账号设置',
    path: 'Account'
  }
]
