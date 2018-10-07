<!--/*
 * @Author: wmc
 * @Date: 2018-06-15 11:27:27
 * @LastEditors: wmc
 * @LastEditTime: 2018-06-15 11:27:27
 * @Description: 涉税专业服务机构管理模块
 */
 -->
<template>
  <div class="taxProfession-container">
    <MenuTab :menu="menuItem" :defaultIndex="activeIndex" @handleTab="handleTab">
      <MenuRt slot="menu-rt" :isTip="isTip" :totalCount="totalCount" :legalMobilePhone="legalMobilePhone" />
    </MenuTab>
    <FormItem ref="searchForm" @fetchCardList="getCardList" :taxList="taxList" :isTip="isTip" />
    <CardItem :cardData="cardData">
      <Loading 
        slot="load" 
        @refresh="reloadFn"
         v-loading="isFirstLoad"
          :isFirst="isFirstLoad"
          :loadstatus="loadstatus"
          :status="status"
        element-loading-text="正在加载中..." />
    </CardItem>
    <PagePatiation :pagiation="formParms" @fetchListData="getCardList" />
  </div>
</template>

<script>
  import util from '@/common/js/util'
  import { specilMock } from '@/mock/mockData';
  import { TaxProfessionMange } from '@/services/request';
  import MenuTab from '@/components/MenuTab';
  import Loading from '@/components/Loading';
  import FormItem from './components/FormItem';
  import CardItem from './components/CardItem';
  import MenuRt from './components/MenuRt';
  import PagePatiation from './components/PagePagiation.vue';
  export default {
    name: 'taxProfessionIndex',
    components: { MenuTab, FormItem, CardItem, Loading, MenuRt, PagePatiation },
    data() {
      return {
        isFirstLoad: true, // 第一次加卡片数据,
        loadstatus: true, // 数据加载异常时
        cardData: [],
        taxList: [],
        isTip: 1,
        status: 2,
        ajaxing: {},
        activeIndex: '1',
        tabProfess: {}, // 缓存
        formParms: {},
        parms: {},
        legalMobilePhone: [], // 短信接口参数
        initPage: {
          isRealName: 1,
          pageIndex: 1,
          pageSize: 10
        },
        totalCount: 0,
        menuItem: [
          { idx: '1', name: '未实名', count: '0' },
          { idx: '2', name: '已实名', count: '0' }
          // { idx: '2', name: '全部', count: '0' },
        ],
        errorInfo: '网络状态异常,请求错误',
        testFlag: true
      }
    },
    mounted() {
      let activeCacheIndex = util.storage('tabProfess') !== null ? util.storage('tabProfess')['activeIndex'] : '1';
      this.activeIndex = activeCacheIndex;
      this.isTip = this.activeIndex * 1;
      this.initPage.isRealName = this.activeIndex;
      this.getCardList({ ...this.initPage });
      this.getOrgitem();
    },
    watch: {
      activeIndex(n, p) {
        if (n === this.activeIndex) {
          this.ajaxing = {};
        }
      },
    },
    methods: {
      handleTab(idx) {
        this.isTip = idx * 1;
        this.activeIndex = idx;
        this.tabProfess.activeIndex = idx;
        this.initPage.isRealName = idx * 1;
        util.storage('tabProfess', this.tabProfess);
        // localStorage.removeItem('argsCacheTaxManage');
        // 防止重复点击tab重复请求接口数据
        if (this.ajaxing[this.activeIndex]) {
          return;
        }
        // 清除搜索
        // this.$refs.searchForm.resetForm();
        this.getCardList({ ...this.initPage });
      },
      getCount() {
        let menuItem = this.menuItem;
        specilMock.taxprofessCount().then(res => {
          let data = res.data;
          if (res.code === 0) {
            this.menuItem = menuItem.map((item, idx) => {
              if (item.idx === '0') {
                item.count = data.wbs;
              } else if (item.idx === '1') {
                item.count = data.ybs;
              } else {
                item.count = data.qbs;
              }
              return item
            })
          } else {
            this.Message('error', res.msg);
          }
        })
      },
      getCardList(arg = {}) {
        // let argCache = util.storage('argsCacheTaxManage');
        let parms = {};
        this.isFirstLoad = true;
        this.loadstatus = false;
        this.cardData = [];
        parms = { ...arg };
        this.parms.isRealName = this.activeIndex * 1;
        if (arg.hasOwnProperty('keyword') || arg.hasOwnProperty('authorities')) {
          this.parms.keyword = arg.keyword;
          this.parms.authorities = arg.authorities
          parms.keyword = this.parms.keyword;
          parms.authorities = this.parms.authorities;
        } else {
          parms.keyword = this.parms.keyword;
          parms.authorities = this.parms.authorities;
        }
        // if (argCache && JSON.stringify(argCache) !== '{}') {
        //   this.parms.keyword = argCache.keyword;
        //   this.parms.authorities = argCache.authorities;
        // }
        let config = { ...this.initPage, ...parms }
        this.getTaxfessCount(config);
        // 首页卡片
        if (this.testFlag) {
          TaxProfessionMange.taxcollectorSearch(config).then(res => {
            let data = res.data;
            let parms = {};
            if (res.code === 0) {
              this.isFirstLoad = false;
              if (Array.isArray(data.data) && data.data.length > 0) {
                // this.loadstatus = false;
                this.cardData = data.data;
                this.cardData.map(item => {
                  item.baseOrgList.map(items => {
                    if (items.legalMobilePhone !== '') {
                      parms[`${items.legalMobilePhone}`] = items.orgName
                      this.legalMobilePhone.push(parms);
                    }
                  })
                })
                this.ajaxing[this.activeIndex] = true;
                let pageParms = {
                  pageIndex: data.pageIndex,
                  pageSize: data.pageSize,
                  totalCount: data.totalCount,
                  totalPage: data.totalPage
                };
                this.formParms = { ...pageParms };
              } else {
                this.formParms = {
                  pageIndex: 1,
                  pageSize: 0,
                  totalPage: 0
                };
                this.Message('success', '暂无数据');
                // this.status = 3;  空数据
                // this.isFirstLoad = false;
                // this.loadstatus = true;
              }
            } else {
              this.isFirstLoad = false;
              this.Message('error', res.msg);
              // this.status = 0;  请求异常
              // this.loadstatus = true;
              // this.isFirstLoad = false;
              this.formParms = {
                pageIndex: 1,
                pageSize: 0,
                totalPage: 0
              };
            }
          }).catch(res => {
            this.isFirstLoad = false;
            // this.loadstatus = true;
            // this.isFirstLoad = false;
            // this.status = 2;  网络异常
            this.Message('error');
          });
        } else {
          specilMock.taxcollector('search', config).then(res => {
            let data = res.data;
            if (res.code === 0) {
              this.isFirstLoad = false;
              if (data.data.length > 0) {
                this.loadstatus = false;
                this.cardData = data.data;
                this.ajaxing[this.activeIndex] = true;
                let pageParms = {
                  pageIndex: data.pageIndex,
                  pageSize: data.pageSize,
                  totalCount: data.totalCount,
                  totalPage: data.totalPage
                };
                this.formParms = { ...pageParms };
              } else {
                this.isFirstLoad = false;
                this.loadstatus = true;
              }
            } else {
              this.Message('error', res.msg);
              // this.loadstatus = true;
              // this.isFirstLoad = false;
            }
          }).catch(res => {
            // this.loadstatus = true;
            // this.isFirstLoad = false;
            this.Message('error');
          });
        }
      },
      // 机构列表
      getOrgitem() {
        if (this.testFlag) {
          TaxProfessionMange.taxcollectorOrgitem().then(res => {
            let data = res.data;
            if (res.code === 0) {
              if (Array.isArray(data) && data.length > 0) {
                this.taxList = data;
              }
            } else {
              this.Message('error', res.msg);
            }
          }).catch(res => {
            this.Message('error');
          })
        } else {
          specilMock.taxcollector('org_item').then(res => {
            let list = res.data.list;
            if (res.code === 0) {
              if (list.length > 0) {
                this.taxList = list;
              }
            } else {
              this.Message('error', res.msg);
            }
          })
        }
      },
      // 机构管理计数
      getTaxfessCount(parms) {
        let menuItem = this.menuItem;
        TaxProfessionMange.taxcollectorOrgtotal(parms).then(res => {
          let data = res.data;
          if (res.code === 0) {
            this.menuItem = menuItem.map((item, idx) => {
              if (item.idx === '1') {
                item.count = data.notRealNameOrgSum;
              } else if (item.idx === '2') {
                item.count = data.realNameOrgSum;
              }
              this.totalCount = data.notRealNameOrgSum * 1 + data.realNameOrgSum * 1;
              return item
            })
          }
        })
      },
      // 重新刷新
      reloadFn() {
        this.getCardList();
      },
      Message(type, msg) {
        let msssage = msg !== undefined ? msg : this.errorInfo;
        this.$message({
          message: msssage,
          type: type
        });
      }
    }
  }
</script>
<style lang="stylus">
  @import './index.styl';
</style>