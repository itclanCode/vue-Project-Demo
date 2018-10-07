<!-- Created by qintengbo on 2018/05/22. -->
<!-- 涉税报告上传 -->

<template>
  <div>
    <div class="taxReport">
      <el-row>
        <el-col :span="24" class="header-col">
          <el-menu
            class="reportmenu"
            :default-active="activeIndex"
            mode="horizontal"
            active-text-color="#4680ff"
            @select="handleSelect">
            <el-menu-item index="1">未报送 ({{ cardData.waittingCount }})</el-menu-item>
            <el-menu-item index="2">已报送 ({{ cardData.submittenCount }})</el-menu-item>
            <el-menu-item index="3">归档 ({{ cardData.guidangCount }})</el-menu-item>
            <el-menu-item index="4">全部 ({{ cardData.allCount }})</el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
      <el-row class="marginTop20 clearfix">
        <el-col :span="17" class="screen-con clearfix">
          <template>
            <el-date-picker
              class="datepicker"
              v-model="time"
              unlink-panels
              type="daterange"
              value-format="yyyy-MM-dd"
              @change="getTaxReportCard"
              range-separator="至"
              start-placeholder="报告所属日期起"
              end-placeholder="报告所属日期止">
            </el-date-picker>
            <el-select 
              class="select" 
              @change="getTaxReportCard" 
              clearable 
              v-model="ssywlx" 
              placeholder="涉税业务类型"
            >
              <el-option
                v-for="(val, key) in _constant.TAXRELATED_TYPE"
                :key="key"
                :label="val"
                :value="key">
              </el-option>
            </el-select>
            <el-select 
              class="select" 
              clearable
              @change="getTaxReportCard" 
              v-model="ssxmlx" 
              placeholder="涉税项目类型"
            >
              <el-option
                v-for="(val, key) in _constant.PROJECT_CON"
                :key="key"
                :label="val"
                :value="key">
              </el-option>
            </el-select>
            <el-select 
              class="select" 
              @change="getTaxReportCard" 
              v-model="bbnf" 
              clearable 
              placeholder="报送年份"
            >
              <el-option 
                v-for="(item, index) in yearArr"
                :key="index"
                :label="item" 
                :value="item"
              >
              </el-option>
            </el-select>
          </template>
        </el-col>
        <el-col :span="7" class="col-search">
          <el-input 
            class="search" 
            v-model="searchKey"
            clearable
            @clear="getTaxReportCard"
            @keyup.enter.native="getTaxReportCard"
            placeholder="请输入纳税人名称或统一社会信用代码"
          >
            <i slot="suffix" @click="getTaxReportCard" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
      </el-row>
      <div class="notData" v-loading="loading" element-loading-text="正在加载数据">
        <el-row v-if="cardTodyData.size !== 0 || state == 1" class="marginTop20 main-fir" :class="{ 'border-bot0': cardData.cardData.length == 0 }" :gutter="20">
          <div class="texreport-time">{{ conversionTime(new Date()) }} ({{ cardTodyData.size }})</div>
          <el-col :xl="6" :lg="8" :md="12" v-if="state == 1 && currentPage === 1">
            <router-link :to="{name: 'TaxReportFlow', params: {ssxh: 'undefined', num: 0, state: 1}}">
              <el-card class="addCard">
                <div class="addCon"><i class="el-icon-circle-plus"></i></div>
                <div class="addtext">添加涉税报告</div>
              </el-card>
            </router-link>
          </el-col>
          <el-col :xl="6" :lg="8" :md="12" v-for="(ele, num) in cardTodyData.cards" :key="num">
            <el-card>
              <div class="cardContainter" :class="{ 'notCard': ele.state == 1, 'alreadyCard': ele.state == 2, 'fileCard': ele. state == 3}">
                <div class="card-title clearfix" @click="seeTaxReport(ele.ssxh, ele.state)">
                  <a href="javascript:void(0);" :title="ele.enterpriseName">{{ ele.enterpriseName }}</a>
                  <i class="el-icon-arrow-right"></i>
                </div>
                <div class="card-tag">
                  <el-tag size="mini" class="taxportTag" color="#fff">{{ ele.ssxmlx }}</el-tag>
                </div>
                <div class="card-info">统一社会信用代码 <span>{{ ele.tyshxydm }}</span></div>
                <div class="card-info">报告所属时期 <span>{{ ele.ssqq }} 至 {{ ele.ssqz }}</span></div>
                <el-row class="btnGroup">
                  <el-col :span="i.span" v-for="(i, index) in ele.btnData" :key="i.text">
                    <el-button type="text" v-if="ele.cxbscs != '0' || ele.state == 3" @click.stop="btnEvents(i.type, i.text, ele.ssxh, ele.state, ele.cxbscs)">
                      <i :class="i.icon"></i> {{ i.text }}<span v-if="ele.state == 2 && index == 1">({{ ele.cxbscs }})</span>
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row 
          v-for="(item, index) in cardData.cardData" 
          class="marginTop20 Main" 
          :gutter="20" 
          :key="index"
          :class="{ 'border-bot0': cardData.cardData.length < 2 }"
        >
          <div class="texreport-time">{{ conversionTime(item.time) }} ({{ item.size }})</div>
          <el-col :xl="6" :lg="8" :md="12" v-for="(ele, num) in item.cards" :key="num">
            <el-card>
              <div class="cardContainter" :class="{ 'notCard': ele.state == 1, 'alreadyCard': ele.state == 2, 'fileCard': ele.state == 3 }">
                <div class="card-title" @click="seeTaxReport(ele.ssxh, ele.state)">
                  <a href="javascript:void(0);" :title="ele.enterpriseName">{{ ele.enterpriseName }}</a>
                  <i class="el-icon-arrow-right"></i>
                </div>
                <div class="card-tag">
                  <el-tag size="mini" class="taxportTag" color="#fff">{{ ele.ssxmlx }}</el-tag>
                </div>
                <div class="card-info">统一社会信用代码 <span>{{ ele.tyshxydm }}</span></div>
                <div class="card-info">报告所属时期 <span>{{ ele.ssqq }} 至 {{ ele.ssqz }}</span></div>
                <el-row class="btnGroup">
                  <el-col :span="i.span" v-for="(i, index) in ele.btnData" :key="i.text">
                    <el-button type="text" v-if="ele.cxbscs != '0' || ele.state == 3" @click.stop="btnEvents(i.type, i.text, ele.ssxh, ele.state, ele.cxbscs)">
                      <i :class="i.icon"></i> {{ i.text }}<span v-if="ele.state == 2 && index == 1">({{ ele.cxbscs }})</span>
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <el-row v-if="total != 0" class="taxReport-fot">
        <el-col :span="24">
          <el-pagination
            background
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper, sizes"
            @current-change="currentChange"
            :current-page="currentPage"
            @size-change="sizeChange"
            :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { taxRelateReportRequest } from '@/services/request';
import { formatDate, getYearArr } from '@/common/js/date';
import fileDownload from 'js-file-download';

export default {
  data() {
    return {
      loading: true,
      activeIndex: '1',
      time: '', // 报告所属期
      toggle: false,
      state: 1, // 报告状态：1-未报送，2-已报送，3-归档，4-全部
      ssywlx: '', // 涉税业务类型
      ssxmlx: '', // 涉税项目类型
      searchKey: '', // 搜索关键字
      yearArr: [], // 年份数组
      bbnf: '', // 报送年份
      pageSize: 10, // 每页条数
      currentPage: 1, // 当前页
      total: null, // 数据总条数
      cardData: { // 卡片数据列表
        cardData: []
      },
      cardTodyData: { // 今天日期对应的卡片列表
        size: 0,
        cards: []
      },
      notBtnData: [
        {
          type: 1,
          text: '修改',
          icon: 'el-icon-rep-xiugai',
          span: 8
        },
        {
          type: 2,
          text: '报送',
          icon: 'el-icon-rep-zhifeiji',
          span: 8
        },
        {
          type: 3,
          text: '删除',
          icon: 'el-icon-delete',
          span: 8
        }
      ],
      alreadyBtnData: [
        {
          type: 4,
          text: '下载',
          icon: 'el-icon-rep-xiazai',
          span: 7
        },
        {
          type: 5,
          text: '重新修改',
          icon: 'el-icon-rep-zhifeiji',
          span: 10
        },
        {
          type: 6,
          text: '撤回',
          icon: 'el-icon-rep-chehui',
          span: 7
        }
      ],
      fileBtnData: [{
        type: 4,
        text: '下载',
        icon: 'el-icon-rep-xiazai',
        span: 24
      }]
    }
  },
  inject: ['reload'], // 接收App.vue传过来的刷新路由函数
  mounted() {
    // 页面刷新仍然停留在当前页面状态
    this.activeIndex = JSON.parse(sessionStorage.getItem('activeNum'));
    if (!this.activeIndex) {
      this.activeIndex = '1';
    }
    if (this.activeIndex === '4' || this.activeIndex === 4) {
      this.state = '';
    } else {
      this.state = this.activeIndex;
    }
    this.yearArr = getYearArr();
    this.getTaxReportCard(this.state);
  },
  methods: {
    // 格式化时间
    conversionTime: function(time) {
      return formatDate(new Date(Number(time)), 'yyyy年MM月dd日');
    },
    // 请求卡片数据
    getTaxReportCard: function() {
      this.loading = true;
      if (!this.time && typeof this.time !== 'undefined' && this.time !== 0) {
        this.time = '';
      }
      let data = {
        state: this.state,
        ssywlx: this.ssywlx,
        ssqq: this.time[0] || '',
        ssqz: this.time[1] || '',
        ssxmlx: this.ssxmlx,
        searchKey: this.searchKey,
        bbnf: this.bbnf,
        pageSize: this.pageSize,
        pageNum: this.currentPage
      };
      // 兼容IE浏览器Get请求会缓存
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        data.time = new Date().getTime();
      }
      taxRelateReportRequest.getClientageList(data).then((res) => {
        this.loading = false;
        if (res.code === 0) {
          this.total = res.data.total;
          if (res.data.cardData.length !== 0) {
            let time1 = formatDate(new Date(Number(res.data.cardData[0].time)), 'yyyy-MM-dd');
            let time2 = formatDate(new Date(), 'yyyy-MM-dd');
            res.data.cardData.forEach(item => {
              item.cards.forEach(ele => {
                ele.btnData = this.btnTypeFn(ele.state);
              });
            });
            if (time1 === time2) {
              this.cardTodyData = res.data.cardData[0];
              let depData = this.deepCopy(res.data);
              depData.cardData.shift();
              this.cardData = depData;
            } else {
              this.cardData = res.data;
              this.cardTodyData = { size: 0, cards: [] };
            }
          } else {
            this.cardData = res.data;
            this.cardTodyData = { size: 0, cards: [] };
          }
        } else {
          window.Alert(res.msg);
        }
      });
    },
    // 切换报送状态
    handleSelect: function(index, indexPath) {
      this.loading = true;
      if (index === '4' || index === 4) {
        this.state = '';
      } else {
        this.state = index;
      }
      sessionStorage.setItem('activeNum', JSON.stringify(index));
      this.currentPage = 1;
      this.pageSize = 10;
      this.getTaxReportCard();
    },
    // 判断按钮类型
    btnTypeFn: function(state) {
      let btnData;
      switch (state) {
        case 1:
          btnData = this.notBtnData;
          break;
        case 2:
          btnData = this.alreadyBtnData;
          break;
        case 3:
          btnData = this.fileBtnData;
          break;
      }
      return btnData;
    },
    // 报送
    taxReportUpdate: function(xh) {
      taxRelateReportRequest.postTaxReportCradUpdate(xh).then(res => {
        if (res.code === 0) {
          window.Success(res.msg);
          this.isIE();
        } else {
          window.Alert(res.msg);
        }
      });
    },
    // 删除
    taxReportDelete: function(xh) {
      taxRelateReportRequest.postTaxReportDelete(xh).then(res => {
        if (res.code === 0) {
          window.Success(res.msg);
          this.isIE();
        } else {
          window.Alert(res.msg);
        }
      });
    },
    // 查看
    seeTaxReport: function(xh, state) {
      this.$router.push({ name: 'TaxReportFlow', params: { ssxh: xh, num: 1, state: state } });
    },
    // 修改
    detailTaxReport: function(xh, state) {
      this.$router.push({ name: 'TaxReportFlow', params: { ssxh: xh, num: 2, state: state } });
    },
    // 撤回
    cancelTaxReport: function(xh) {
      taxRelateReportRequest.postTaxReportCancel(xh).then(res => {
        if (res.code === 0) {
          window.Success(res.msg);
          this.isIE();
        } else {
          window.Alert(res.msg);
        }
      });
    },
    // 下载
    downLoadTaxReport: function(xh) {
      taxRelateReportRequest.getTaxReportDownload(xh).then(res => {
        // 文件名存在header的content-disposition里
        let disposition = res.headers['content-disposition'];
        // 获取到文件名
        let filename = decodeURI(disposition.split('filename=')[1]);
        // 下载文件
        fileDownload(res.data, filename);
      });
    },
    // 按钮事件
    btnEvents: function(type, text, xh, state, cxbscs) {
      let tipText = '';
      if ((state === '2' || state === 2) && type === 5 && cxbscs === '1') {
        tipText = '当前为最后一次报告修改机会，若3次机会使用完毕，且报告仍需修改或撤回，则需向深圳市注册税务师协会提出书面申请，同时您的申请信息将被记录到行业诚信档案，您确认要继续 <span style="color: #4680ff">重新修改</span> 吗？';
      } else {
        tipText = `您将 <span style="color: #4680ff">${text}</span> 此条涉税报告，确定继续吗？`;
      }
      this.$confirm(`${tipText}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true
      }).then(() => {
        switch (type) {
          case 1:
            this.detailTaxReport(xh, state);
            break;
          case 2:
            this.taxReportUpdate(xh);
            break;
          case 3:
            this.taxReportDelete(xh);
            break;
          case 4:
            this.downLoadTaxReport(xh);
            break;
          case 5:
            this.detailTaxReport(xh, state);
            break;
          case 6:
            this.cancelTaxReport(xh);
            break;
        }
      })
      .catch(() => { return false; });
    },
    // 分页
    currentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getTaxReportCard();
    },
    // 改变每页条数
    sizeChange: function(pageSize) {
      this.pageSize = pageSize;
      this.getTaxReportCard();
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
    // 由于IE对this.reload()刷新不支持, 此处判断浏览器是否是IE
    isIE() {
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        this.$router.go(0);
      } else {
        this.reload();
      }
    }
  }
}
</script>

<style lang="stylus">
.taxReport
  .el-menu--horizontal>.el-menu-item
    height 40px
    line-height 40px
  .el-date-editor .el-range__close-icon
    line-height 26px
  .marginTop5
    margin-top 5px
  .border-bot0
    border-bottom 0 !important
  .reportmenu 
    background #f2f4f7 !important
    .el-menu-item:focus
    .el-menu-item:hover
      color #4680ff !important
      background transparent
  .header-col 
    position relative
  .btngroup
    position absolute 
    right 0
    top 21px
    .el-button
      cursor auto
      padding 8px 15px
      &:hover 
        background #409eff
    .dropdown
      cursor pointer 
      color #fff
  .selectBtn  
    line-height 0
  .col-search
    text-align left 
    .el-input__icon
      cursor pointer
    .el-button
      padding 7.5px 20px 
  .search
    float right
    width 320px
    .el-input__inner
      border-radius 20px
      border 1px solid #999
  .screen-con
    text-align left
  .datepicker
    width 290px
    margin-right 12px
    vertical-align middle
  .select
    margin-right 12px
    width: 135px
    vertical-align middle
    &:last-child  
      width 110px
      margin-right 0
  .notData
    min-height 200px
  .main-fir,
  .Main
    margin-bottom 12px
    border-bottom solid 1px #e6e6e6
    &:last-child
      border-bottom 0
    .texreport-time
      margin-left 10px
      margin-bottom 20px
      text-align left
      font-size 20px
      color #2A2A2A
    .addCard
      text-align center !important
    .notCard
      border-left 3px solid #4680FF
    .alreadyCard
      border-left 3px solid #999
    .fileCard
      border-left 3px solid #966AE7
    .el-card
      height 200px
      margin-bottom 20px
      text-align left
      border-radius 10px
    .el-card__body
      padding 0
    .addCon
      margin 52px auto 0
      font-size 55px
      color #4680FF
    .addtext
      margin-top 20px
      color #4680FF
    .cardContainter
      padding 10px 20px
      margin 10px 0
      box-sizing border-box
      height 180px
    .card-title
      position relative
      font-weight bold
      font-size 16px
      width 100%
      a
        display inline-block
        width 100%
        overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
        color #2a2a2a
      i
        position absolute
        right 0
        top 0
        font-weight 700
    .card-tag
      margin-top 8px
    .taxportTag
      color #93BE52
      border 1px solid #93BE52
    .card-info
      width 100%
      font-size 14px
      margin-top 19px
      padding-bottom 5px
      & > span 
        float right
        font-size 14px
    .btnGroup
      margin-top 20px
      .el-col
        text-align center
        border-left 1px solid #409eff
        &:first-child
          border-left 0
        .el-button
          padding 1px 0
</style>

