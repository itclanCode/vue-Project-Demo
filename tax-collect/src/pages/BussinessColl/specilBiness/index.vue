<!--*
 * @Author: wmc
 * @Date: 2018-05-08
 * @LastEditors: wmc
 * @LastEditTime: 2018-06-15 11:16:00
 * @Description: 涉税采集模块
 */
 -->
<template>
  <div>
    <div class="specil-container">
      <div class="tab-report">
         <el-tooltip effect="light" popper-class="tip" :content="decText" placement="bottom-start">
            <span :class="tabPosition === '1'? 'active': ''" @click="tabReport('1')">专项业务报告</span>
        </el-tooltip>
        <span :class="tabPosition === '2'? 'active': ''" @click="tabReport('2')">年度报告</span>
      </div>
      <MenuTab :menu="menuItem" :defaultIndex="activeIndex" @handleTab="handleTab" v-if="tabPosition === '1'" />
      <SearchForm v-if="tabPosition === '1'" ref="searchForm" @featchCardList="featchCardList" :statusType="activeIndex" />
      <CardItem @showModel="showModel" :dataList="cardData">
        <Loading 
            slot="load" 
            @refresh="reloadFn" 
            v-loading="isFirstLoad" 
            :loadstatus="loadstatus" 
            :isFirst="isFirstLoad"
            :status="status" 
            element-loading-text="正在加载中..." />
      </CardItem>
      <PagePatiation :pagiation="initPage" @fetchListData="featchCardList" v-if="tabPosition === '1'" />
      <SpecilModel @showModel="showModel" @featchCardList="featchCardList" @feacthCount="feacthCount" :isVisible="isVisibleModel" :isEdit="formParms.isEdit" :type="formParms.sszyfwwtxmdlDm" :baseQueryInfo="basequeryInfo" :baseCollectInfo="basecollectionInfo" :personData="personData" :baseYearbasic="baseYearbasic" :baseYearinit="baseYearinit" :baseYearywxx="baseYearywxx" :nd="formParms.nd" />
    </div>
  </div>
</template>
<script>
// import util from '@/common/js/util'
import MenuTab from '@/components/MenuTab'
import Loading from '@/components/Loading'
import SearchForm from './components/SearchFormItem'
import CardItem from './components/CardItem'
import SpecilModel from './components/SpecilModel'
import PagePatiation from './components/PagePagiation'
import { specilMock } from '@/mock/mockData'
import { specilBiness } from '@/services/request'
export default {
  components: { MenuTab, SearchForm, CardItem, SpecilModel, Loading, PagePatiation },
  data () {
    return {
      isVisibleModel: false,
      isFirstLoad: true, // 第一次加卡片数据
      loadstatus: true, // 数据加载异常时
      status: 2,
      ajaxing: {},
      tabPosition: '1',
      tabPosObjCache: {}, // 缓存
      formParms: {
        statusType: 0, // 状态查询
        sxNumber: '', // 涉税选项编号,
        sszyfwwtxmdlDm: '', // 委托项目编号
        key: '',
        isEdit: false, // 是否可编辑状态
        nd: '', // 年度
        ndbgbh: '' // 年度报告编号,
      },
      initPage: {},
      defaultPage: {// 默认分页参数
        pageIndex: 1,
        pageSize: 10
      },
      menuItem: [
        { idx: '1', name: '未报送', count: 0 },
        { idx: '2', name: '已报送', count: 0 },
        { idx: '0', name: '全部', count: 0 }
      ],
      cardData: [],
      basequeryInfo: {}, // 基本信息
      basecollectionInfo: {}, // 报送
      personData: [], // 查询人员
      baseYearbasic: {}, // 年度基本信息
      baseYearinit: [], // 年度报送
      baseYearywxx: [], // 年度查看
      activeIndex: '1',
      errorInfo: '网络状态异常,请求错误',
      decText: '委托代理协议中服务项目包含“专业税务顾问”、“税收策划”、“涉税鉴证”、“纳税情况审查”，需进行专项业务报告采集',
      testFlag: true
    }
  },
  watch: {
    activeIndex: function (n, p) {
      if (n === this.activeIndex) {
        this.ajaxing = {};
      }
    },
    isVisibleModel: function (n, p) {
      // 关闭弹框时，清空所有传入子组件的接口数据
      if (!n) {
        this.basequeryInfo = {};  // 查看
        this.basecollectionInfo = {}; // 报送
        this.baseYearbasic = {}; // 年度报送基本信息
        this.baseYearinit = []; // 年度报送
        this.baseYearywxx = []; // 年度查看
        this.personData = []; // 查询人员
        this.formParms = {};
      }
    }
  },
  updated () {
  },
  mounted () {
    if (this.tabPosition === '1') {
      this.featchCardList(this.defaultPage);
    } else {
      this.fetchYearData();
    }
  },
  methods: {
    handleTab (idx) {
      this.activeIndex = idx;
      let parms = {};
      parms.sszyfwwtxmdlDm = this.formParms.sszyfwwtxmdlDm;
      parms.key = this.formParms.key;
      // util.removeStorge('specillargs');
      // 防止重复点击tab重复请求接口数据
      if (this.ajaxing[this.activeIndex]) {
        return;
      }
      // 清除搜索
      // this.$refs.searchForm.resetForm();
      this.featchCardList({...this.defaultPage, ...parms});
    },
    tabReport (tab) {
      this.tabPosition = tab;
      let tabPosition = this.tabPosition;
      // util.removeStorge('specillargs');
      if (tabPosition === '1') {
        this.featchCardList(this.defaultPage);
      } else {
        this.fetchYearData();
      }
    },
    // 非年度card列表请求
    featchCardList (parms) {
      // let argCache = util.storage('specillargs');
      let args = {};
      this.isFirstLoad = true;
      this.loadstatus = false;
      this.cardData = [];
      parms = parms || {};
      let statusType = this.activeIndex;
      this.formParms.statusType = statusType;
      if (parms.hasOwnProperty('sszyfwwtxmdlDm') || parms.hasOwnProperty('key')) {
        this.formParms.sszyfwwtxmdlDm = parms.sszyfwwtxmdlDm;
        this.formParms.key = parms.key;
        args.sszyfwwtxmdlDm = this.formParms.sszyfwwtxmdlDm;
        args.key = this.formParms.key;
        args.statusType = this.formParms.statusType;
      } else {
        if (parms.init === 1) {
          args.statusType = this.formParms.statusType;
        } else {
          args.statusType = this.formParms.statusType;
          args.sszyfwwtxmdlDm = this.formParms.sszyfwwtxmdlDm;
          args.key = this.formParms.key;
        }
      }
      // if (argCache && JSON.stringify(argCache) !== '{}') {
      //   parms.key = argCache.key;
      //   parms.sszyfwwtxmdlDm = argCache.sszyfwwtxmdlDm;
      // } else {
      //   parms.key = '';
      //   parms.sszyfwwtxmdlDm = '';
      // }
      // this.formParms.nd = parms.nd ? parms.nd : this.formParms.nd;
      args = Object.assign({}, args, parms);
      // 非年度card首页
      if (this.testFlag) {
        this.feacthCount(args);
        specilBiness.postcardData(args).then((res) => {
          let data = res.data;
          if (res.code === 0) {
            this.isFirstLoad = false;
            if (data.data.length > 0) {
              // this.loadstatus = false;
              this.cardData = data;
              this.ajaxing[statusType] = true; // 防止重复点击请求接口
              let pageParms = {
                pageIndex: data.pageIndex,
                pageSize: data.pageSize,
                totalCount: data.totalCount,
                totalPage: data.totalPage
              };
              this.initPage = { ...pageParms };
            } else {
              // this.loadstatus = true;
              // this.isFirstLoad = false;
              // this.status = 3;  空数据
              let pageParms = {
                pageIndex: data.pageIndex,
                pageSize: data.pageSize,
                totalCount: data.totalCount,
                totalPage: data.totalPage
              };
              this.initPage = { ...pageParms };
              this.getMessage('success', '暂无数据');
            }
          } else {
            this.isFirstLoad = false;
            // this.loadstatus = true;
            // this.isFirstLoad = false;
            // this.status = 0; // 请求异常
            this.getMessage('error', res.msg);
          }
        }).catch(res => {
          // this.loadstatus = true;
          // this.isFirstLoad = false;
          // this.status = 2; // 网络异常
          // this.getMessage('error');
        })
      } else {
        this.feacthCount(args);
        specilMock.specPostList('card', args).then((res) => {
          let data = res.data;
          let dataFlag = data.data.length > 0;
          this.isFirstLoad = true;
          this.loaderDataError = false;
          if (res.code === 0) {
            this.isFirstLoad = false;
            if (data && dataFlag) {
              this.loadstatus = false;
              this.cardData = data;
              this.ajaxing[statusType] = true; // 防止重复点击请求接口
              let pageParms = {
                pageIndex: data.pageIndex,
                pageSize: data.pageSize,
                totalCount: data.totalCount,
                totalPage: data.totalPage
              };
              this.initPage = { ...pageParms };
            } else {
              this.initPage = {
                pageIndex: 1,
                pageSize: 10,
                totalCount: 0
              };
              this.loadstatus = true;
              this.isFirstLoad = false;
            }
          } else {
            this.loadstatus = true;
            this.isFirstLoad = false;
            this.$message({
              message: res.msg,
              type: 'error'
            });
          }
        })
      }
    },
    // 年度卡片首页
    fetchYearData (args) {
      this.isFirstLoad = true;
      this.loadstatus = false;
      this.cardData = [];
      if (this.testFlag) {
        specilBiness.postYearCardData(args).then((res) => {
          let data = res.data;
          if (res.code === 0) {
            this.isFirstLoad = false;
            if (data.length > 0) {
              // this.loadstatus = false;
              this.cardData = data;
            } else {
              this.cardData = data;
              this.getMessage('success', '暂无数据');
              // this.loadstatus = true;
            }
          } else {
            this.isFirstLoad = false;
            // this.loadstatus = true;
            // this.isFirstLoad = false;
            this.getMessage('error', res.msg);
          }
        }).catch(res => {
          // this.loadstatus = true;
          // this.isFirstLoad = false;
          // this.getMessage('error');
        })
      } else {
        specilMock.specPostYearCard('card', args).then((res) => {
          let data = res.data;
          if (res.code === 0) {
            this.isFirstLoad = false;
            if (data) {
              this.loadstatus = false;
              this.cardData = data;
            }
          } else {
            this.isFirstLoad = false;
            // this.loadstatus = false;
            this.getMessage('error', res.msg);
          }
        }).catch(res => {
          // this.loadstatus = true;
          // this.isFirstLoad = false;
          // this.getMessage('error');
        })
      }
    },
    // 卡片弹框请求数据,查看以及报送接口查询
    featchModalData (isSend, parms) {
      if (!this.testFlag) {
        specilMock.specPostList(isSend, parms).then((data) => {
          if (!data.code && data.data) {
            this[`base${isSend}Info`] = data.data
          } else {
            this.getMessage('error', data.msg)
          }
        })
      } else {
        specilBiness[`post${isSend}Data`](parms).then((res) => {
          if (res.code === 0 && res.data) {
            this[`base${isSend}Info`] = res.data;
          } else {
            this.getMessage('error', res.msg)
          }
        }).catch(res => {
          // this.getMessage('error')
        })
      }
    },
    // 报送计数
    feacthCount (parms) {
      if (this.testFlag) {
        specilBiness.getYearSendcount(parms).then((res) => {
          let data = res.data;
          let menuItem = this.menuItem;
          if (res.code === 0 && data) {
            menuItem.map(item => {
              if (item.idx === '0') {
                item.count = data.qbs;
              } else if (item.idx === '1') {
                item.count = data.wbs;
              } else {
                item.count = data.ybs;
              }
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            });
          }
        }).catch(res => {
        })
      } else {
        // specilMock
        specilMock.sepcGetCount('cardcount', parms).then((res) => {
          let data = res.data;
          let menuItem = this.menuItem;
          if (res.code === 0 && data) {
            menuItem.map(item => {
              if (item.idx === '0') {
                item.count = data.qbs;
              } else if (item.idx === '1') {
                item.count = data.wbs;
              } else {
                item.count = data.ybs;
              }
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            });
          }
        }).catch(res => {
        })
      }
    },
    // 年度报送弹框数据
    featchModalYearData (path, nd, ndbgbh) {
      if (!this.testFlag) {
        specilMock.specGetYearModel(path, nd).then((data) => {
          if (data.code === 0) {
            if (path === 'basic') {
              this.baseYearbasic = data.data;
            }
            if (path === 'init') {
              this.baseYearinit = data.data;
            }
            if (path === 'ywxx') {
              this.baseYearywxx = data.data
            }
          } else {
            this.getMessage('error', data.msg)
          }
        }).catch(res => {
          this.getMessage('error')
        });
      } else {
        // basic 年度基本信息  init 年度报送
        if (path === 'basic' || path === 'init') {
          specilBiness[`getYearSend${path}`](nd).then((res) => {
            if (res.code === 0) {
              this[`baseYear${path}`] = res.data;
            } else {
              this.getMessage('error', res.msg)
            }
          }).catch(res => {
            this.getMessage('error')
          })
        } else {
          // 年度查看
          specilBiness.getYearSendywxx(nd, ndbgbh).then((res) => {
            if (res.code === 0) {
              this[`baseYear${path}`] = res.data;
            } else {
              this.getMessage('error', res.msg)
            }
          }).catch(res => {
            this.getMessage('error')
          });
        }
      }
    },
    // 服务人员接口
    featchPersonData (isSend, parms) {
      if (!this.testFlag) {
        specilMock.specPostList(isSend, parms).then((data) => {
          if (data.code === 0) {
            this.personData = data.data;
            this.featchModalData('collection', parms)
          } else {
            this.getMessage('error', data.msg)
          }
        });
      } else {
        specilBiness[`post${isSend}Data`](parms).then((res) => {
          if (res.code === 0 && res.data) {
            this.personData = res.data;
            this.featchModalData('collection', parms)
          } else {
            this.getMessage('error', res.msg)
          }
        }).catch(res => {
          this.getMessage('error')
        })
      }
    },
    // 弹框
    showModel (parms) {
      this.isVisibleModel = parms.bool;
      // console.log('isVisibleModel' + this.isVisibleModel);
      switch (parms.isYear) { // 0：非年度查看报送 1：年度
        case 0:
          this.formParms.isEdit = parms.isEdit;// 是否可编辑状态
          this.formParms.sxNumber = parms.sxNumber;// 涉税选项编号
          this.formParms.sszyfwwtxmdlDm = parms.sszyfwwtxmdlDm; // 项目编号
          let args = {};
          if (parms.isSend === 'query') { // 查看
            args.sszywfbgbh = this.formParms.sxNumber;
            this.featchModalData('query', args)
          } else { // 采集
            args.wtxyxxcjbh = this.formParms.sxNumber;
            args.sszyfwwtxmdlDm = this.formParms.sszyfwwtxmdlDm;
            this.featchPersonData('ywqsr', args);// 服务人员请求接口
          }
          break;
        case 1:
          this.formParms.nd = parms.nd;
          this.formParms.ndbgbh = parms.ndbgbh;
          this.featchModalYearData('basic', this.formParms.nd); // 年度 查看基础信息
          if (this.formParms.ndbgbh === '') { // 年度报送
            this.formParms.isEdit = true;
            this.featchModalYearData('init', this.formParms.nd);
          } else { // 年度查看
            this.formParms.isEdit = false;
            this.featchModalYearData('ywxx', this.formParms.nd, parms.ndbgbh);
          }
          break;
        default: ; break;
      }
    },
    getMessage (type, msg) {
      let messg = msg !== undefined ? msg : this.errorInfo
      this.$message({
        message: messg,
        type: type
      })
    },
    // 重新刷新
    reloadFn: function (parms) {
      // this.reload = parms.reload;
      // let args = {
      //   statusType: this.formParms.statusType,
      //   sszyfwwtxmdlDm: this.formParms.sszyfwwtxmdlDm
      // }
      if (this.tabPosition === '1') {
        this.featchCardList(this.defaultPage);
      } else {
        this.fetchYearData();
      }
    }
  }
}
</script>

<style lang="stylus">
@import './index.styl';
</style>