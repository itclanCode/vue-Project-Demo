<template>
  <div class="editmain editAgent">
    <!--表格内容-->
    <div class="tableContent">
      <div class="infoTitle">机构纳税人信息</div>
      <table class="w100p fontSize14 addAgent1">
        <tr>
          <td class="labelStyle"><span class="red">*</span> 委托协议信息采集编号</td>
          <td class="valueStyle">{{dataList.collectNumber ? dataList.collectNumber : '--'}}</td>
          <td class="labelStyle"><span class="red">*</span> 合同编号</td>
          <td class="valueStyle">
            <input class="inputText" type="text" v-model="dataList.contractNumber">
          </td>
        </tr>
          <tr>
          <td class="labelStyle"><span class="red">*</span> 委托人统一社会信用代码</td>
          <td class="valueStyle">{{mandator.identificationNumber}}</td>
          <td class="labelStyle"><span class="red">*</span> 委托人名称</td>
          <td class="valueStyle">{{mandator.mandatorName}}</td>
        </tr>
        <tr>
          <td class="labelStyle"><span class="red">*</span> 委托人主管税务机关</td>
          <td class="valueStyle">{{mandator.manageTaxOrg ? mandator.manageTaxOrg : '--'}}
          <td class="labelStyle"><span class="red">*</span> 委托人税务地址</td>
          <td class="valueStyle">
            <a href="javascript:void(0);" class="adress" :title="mandator.enterpriseAddress">
              {{mandator.enterpriseAddress ? mandator.enterpriseAddress : '--'}}
            </a>
          </td>
        </tr>
        <tr>
          <td class="labelStyle"><span class="red">*</span> 委托人省份</td>
          <td class="valueStyle">{{mandator.mandatorProvince ? mandator.mandatorProvince : '--'}}
        </td>
          <td class="labelStyle"><span class="red">*</span> 审计服务
          <el-tooltip class="item" effect="dark" content="是否在同一纳税年度内为委托人提供审计服务" placement="right">
            <i class="color9 el-icon-rep-wenhao"></i>
          </el-tooltip>
          </td>
          <td  class="valueStyle">
          <el-radio-group v-model="serverArea">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </td>
        </tr>
        <tr>
          <td class="labelStyle"><span class="red">*</span> 委托人法人手机号</td>
          <td class="valueStyle">{{mandator.mobilePhone}}</td>
          <td class="labelStyle"><span class="red">*</span> 协议金额(元)</td>
          <td class="valueStyle">
            <input type="text" class="inputText" v-model="dataList.contractSum">
          </td>
        </tr>
        <tr>
          <td class="labelStyle"><span class="red">*</span> 服务时间起</td> <td class="valueStyle">
          <el-date-picker
            v-model="startdate"
            type="date"
            placeholder="选择日期"
            align="right"
            @blur="CompareDate(1)"
            class="datechoose"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker></td>
          <td class="labelStyle"><span class="red">*</span> 服务时间止</td> <td class="valueStyle">
          <el-date-picker
            v-model="enddate"
            type="date"
            placeholder="选择日期"
            align="right"
            @blur="CompareDate(2)"
            class="datechoose"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker></td>
        </tr>
        <!-- <tr>
          <td class="w25p ar  paddingRight20"><span style="color:red;margin-right: 8px;"></span>委托服务范围</td>
          <td colspan="3" class="color3 valueStyle">
            <el-tooltip effect="dark" :content="itemNames" placement="top" popper-class="tooltip">
              <span class="itemTooltip" style="-webkit-box-orient: vertical;">{{itemNames}}</span>
            </el-tooltip>
          </td>
        </tr> -->
        <tr>
          <td class="labelStyle"><span style="color:red;margin-right: 8px;"></span>上传合同</td>
          <td colspan="3" class="valueStyle">
            <el-upload
              class="upload-demo_1"
              :action="url"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="1"
              :data="upLoadData"
              name="file"
              :onError="uploadError"
              :onSuccess="uploadSuccess"
              :beforeUpload="beforeAvatarUpload"
              accept=".doc, .pdf, .docx"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button size="small" type="primary" class="upload_btn">选择文件</el-button>
              <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
          </td>
        </tr>
        <tr>
          <td class="labelStyle" style="position: relative">
            <span class="textareaLabel"><span class="red">*</span> 服务协议摘要</span></td>
          <td colspan="3" class="valueStyle textareaTd">
            <el-input
              class="textarea"
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              @input.native="descInput"
              v-model="des"
              maxlength="2000"
            >
            </el-input>
            <span class="textrea_limit">{{remnant}}/2000</span></td>
        </tr>
      </table>
      <div class="infoTitle">税务代理人员信息<span class='assign' @click='assignDialog()'>分配委托事项</span></div>
      <table class="xd2">
        <tr>
          <td class="headerName w200"><span class="red">*</span> 姓名</td>
          <td class="headerName"><span class="red">*</span> 服务项目</td>
          <td class="headerName w300"><span class="red">*</span> 操作</td>
        </tr>
        <tr v-for="(item, key) in carouselList3" :key='key'>
          <td>{{item.name}}</td>
          <td>
            <span>{{item.content}}</span>
          </td>
          <td class="colorBl cursor vm">
            <span @click="changeItems(item)">修改</span>&nbsp;&nbsp;
            <span @click="del(item)">
              删除</span>
          </td>
        </tr>
      </table>
      <div class="btns">
        <input type="button" value="确认" @click="addInfo()">
        <input type="button" value="取消" class="back_btn" onclick="history.go(-1)">
      </div>
    </div>
    <!--分配委托事项-->
    <el-dialog title='分配委托事项' :visible.sync='dialogTableVisible'  center :show-close='showClose'  class='dialog_2' @open='handleOpen'>
      <el-select 
        v-model='agentPerson' 
        placeholder='请选择代理人' 
        @change='changePerson(agentPerson)' 
        :disabled="isSelected"
      >
        <el-option 
          :label="i.personName" 
          :value='i.orgAgentId' 
          v-for='(i, index) in agentPersonInfo' 
          :key='index'>
        </el-option>
      </el-select>
      <el-input
        class="dialoag-input"
        placeholder='输入关键字进行过滤'
        v-model='filterText'>
      </el-input>
      <el-tree 
        class="marginTop15"
        :data='carouselList' 
        :props='defaultProps'
        node-key='id' 
        show-checkbox 
        @node-click='handleNodeClick'
        :filter-node-method='filterNode' 
        ref='tree'
        accordion
      >
      </el-tree>
      <span slot='footer' class='dialog-footer'>
        <el-button type='primary' @click='querenServer()'>确 定</el-button>
        <el-button @click='Cancel()'>取 消</el-button>
      </span>
    </el-dialog>
    <!--手机校验-->
    <el-dialog title='更改确认' :visible.sync="dialogTableVisible_pho"  center :show-close='showClose'  class="dialog_pho1" width='528px' top='25vh' :close-on-click-modal="closemodal=false">
      <table class="ac table_pho">
        <tr class="h50" v-if="isMandator">
          <td class="w25p ar  paddingRight20 vb">财务负责人手机号</td>
          <td class="w40p borderBottom vb al">
            {{financeMobilePhone}}
          </td>
        </tr>
        <tr class="h50" v-else>
          <td class="w25p ar  paddingRight20 vb">委托人法人手机号</td>
          <td class="w40p borderBottom vb al">
            {{mandator.mobilePhone}}
          </td>
        </tr>
        <tr class="h50">
          <td class="ar  paddingRight20 vb">短信校验码</td>
          <td class="borderBottom vb al"><input type="text" placeholder="请输入验证码" required class="al" v-model="phoCode" id="phonecode"><input type="button" class="getCode cursor" @click="getCode($event)" :disabled='isDisabled' value="获取验证码"></td>
        </tr>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeAgent()">确定</el-button>
        <el-button @click="Cancel2()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { agentRequest } from '@/services/request';
  import {formatDate} from '@/common/js/date.js'
  export default {
    data() {
      return {
        financeMobilePhone: '',
        isMandator: true,
        defaultProps: {
          children: 'child',
          label: 'name'
        },
        // itemNames: '',
        carouselList: [],
        carouselListConst: [],
        filterText: '',
        agentPerson: '',
        defaultOpen: ['2'],
        dialogTableVisible: false,
        dialogTableVisible_pho: false,
        showClose: false,
        serverArea: '否',
        isDisabled: false,
        phoCode: '',
        des: '',
        url: '',
        status: '',
        statusFlag: true,
        uploadurl: '',
        startdate: '',
        enddate: '',
        dataList: '',
        mandator: '',
        upLoadData: {
          uploadUrl: ''
        },
 //       fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        fileList: [],
        provinceData: ['北京市', '天津市', '上海市 ', '重庆市', '河北省 ', '山西省 ', '辽宁省', '吉林省 ', '黑龙江省', '江苏省', '浙江省 ', '安徽省 ', '福建省 ', '江西省 ', '山东省', '河南省', '湖北省', '湖南省 ', '广东省', '海南省', '四川省', '贵州省', '云南省', '陕西省 ', '甘肃省', '青海省', '台湾省', '广西壮族自治区', '内蒙古自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区', '香港特别行政区', '澳门特别行政区'],
        // 20180115
        clientAll: {},
        clientRest: {},
        clientChecked: {},
        check: false,
        input: 1,
        productsAll: [],
        convertProduct: {}, // 得到后台数据后转化的商品
        restProduct: {}, // 剩余的商品
        showProduct: {}, // 用来显示的商品
        selectedProduct: {}, // 已分配给代理人的商品
        selectedClient: '',
        showClient: [],
        dialogType: 1, // 1 表示通过委托按钮打开， 2 表示编辑按钮打开,
        selectedClientInfo: {},
        delegationRelationId: '',
        agentPersonInfo: '',
        list3: {
          id: '',
          name: '',
          content: [],
          serviceItems: []
        },
        list: [],
        carouselList2: [],
        carouselList3: [],
        items: [],
        currentItems: {},
        delItems: {},
        isSelected: false,
        orgname: '',
        remnant: 0
      }
    },
    mounted: function() {
      this.financeMobilePhone = this.$route.query.financeMobilePhone;
      this.delegationRelationId = this.$route.query.delegationRelationId;
      agentRequest.getProtocolDetail(this.delegationRelationId).then((data) => {
        if (data.code === 0) {
          this.dataList = data.data;
          this.mandator = data.data.mandator;
          // this.items = data.data.itemNames
          // this.items = Array.from(new Set(this.items))
          // this.itemNames = this.items.join(',')
          this.status = data.data.status;
          this.des = this.dataList.delegationDigest;
          this.remnant = 0 + this.des.length;
          this.serverArea = data.data.isUnifyAnnualPayRatepaying === 1 ? '是' : '否';
          this.enddate = this.formatDate(data.data.endDate);
          this.startdate = this.formatDate(data.data.startDate);
          this.productsAll = data.data.serviceAgents;
          let _arr = [];
          for (let i = 0; i < this.productsAll.length; i++) {
            let arr1 = []
            let arr2 = []
            let arr3 = []
            for (let j in this.productsAll[i].serviceItems) {
              arr1.push(this.productsAll[i].serviceItems[j].name)
              arr2.push({code: this.productsAll[i].serviceItems[j].code})
              arr3.push(this.productsAll[i].serviceItems[j].id)
            }
            arr1 = Array.from(new Set(arr1))
            let str = arr1.join(',');
            _arr.push({id: this.productsAll[i].taxOrgAgentId, name: this.productsAll[i].personName, content: str, items: arr1, serviceItems: arr2, checkedIds: arr3});
          }
          this.carouselList3 = _arr
          agentRequest.getOrgserviceItems().then(data => {
            if (data.code === 0) {
              this.carouselListConst = data.data;
              this.carouselList = data.data;
              // this.callBack1(this.carouselList)
            }
          });
          if (data.data.contractAttachId === 0) {
            this.fileList = [];
          } else {
            if (data.data.hasOwnProperty('contractAttach')) {
              // this.fileList = [{name: data.data.contractAttach.originalName}];
            } else {
              this.fileList = [];
            }
          }
        } else {
          this.$message.warning(data.msg);
        }
      })
      agentRequest.getAent().then(data => {
        if (data.code === 0) {
          this.agentPersonInfo = data.data;
        }
      });
      // 获取机构名称
      agentRequest.getOrgName().then(data => {
        if (data.code === 0) {
          this.orgname = data.data
        }
      })
    },
    created() {
//      var url = 'http://172.17.6.56/taobao/upload/protocol-attach';
      var token = window.localStorage.getItem('token');
      this.url = this.getfileup(token);
      this.getAgent();
//      this.convertProductToMyUse();
    },
    methods: {
      handleOpen() {
        this.$nextTick(() => {
          if (this.dialogType === 2) {
            this.$refs.tree.setCheckedKeys(this.currentItems.checkedIds)
          }
        });
      },
      descInput() {
        var txtVal = this.des.length;
        this.remnant = 0 + txtVal;
      },
       //          分配委托事项弹窗
      assignDialog() {
        this.dialogType = 1
        this.agentPerson = '';
        this.isSelected = false;
        this.$refs.tree && this.$refs.tree.setCheckedKeys([]);
        //          委托事项
        this.dialogTableVisible = true;
        this.carouselList2 = [];
      },
      //      选择服务范围关闭弹窗
      querenServer() {
        //        this.carouselList3 = this.carouselList2.slice(0);
        let list1 = this.$refs.tree.getCheckedNodes(true);
        // this.list.push(list1);
        // let arr = []
        // for (let i in this.list) {
        //   for (let j in this.list[i]) {
        //     if (this.agentPerson !== '') {
        //       arr.push(this.list[i][j].name);
        //       arr = Array.from(new Set(arr));
        //     }
        //   }
        // }
        // let item = Array.from(new Set(arr.concat(this.items)))
        // this.itemNames = item.join(',')
        // this.itemNames += arr.join(',')
        let ids = []
        let serviceItems = []
        this.carouselList2 = []
        for (let key in list1) {
          this.carouselList2.push(list1[key].name);
          serviceItems.push({code: list1[key].code})
        }
        let _nodes = this.$refs.tree.getCheckedNodes();
        for (let b in _nodes) {
          ids.push(_nodes[b].id)
        }
        // this.carouselList2 = this.carouselList3;
        if (this.agentPerson === '') {
          this.$message('代理人必选');
          return false;
        } else if (this.carouselList2.length === 0 && this.dialogType === 1) {
          this.$message('请选择代理事项!');
          return false;
        } else {
          // this.callBack(this.carouselList);
          this.dialogTableVisible = false;
          this.list3.serviceItems = [];
          this.list3.items = Array.from(new Set(this.carouselList2))
          this.list3.content = this.list3.items.join(',')
          this.list3.serviceItems = Array.from(new Set(this.list3.serviceItems.concat(serviceItems)));
          this.list3.checkedIds = ids;
          // 深拷贝
          var objCopy = JSON.parse(JSON.stringify(this.list3));
          let flag = true
          if (this.carouselList3.length > 0) {
            for (let a = 0; a < this.carouselList3.length; a++) {
              if (this.currentItems.id === this.carouselList3[a].id) {
                if (objCopy.checkedIds.length === 0) {
                  this.carouselList3.splice(a, 1)
                  a--
                  this.carouselList3 = [...this.carouselList3]
                } else if (objCopy.checkedIds.length > 0 && this.dialogType === 2) {
                  this.carouselList3[a].items = objCopy.items
                  this.carouselList3[a].content = this.carouselList3[a].items.join(',')
                  this.carouselList3[a].checkedIds = objCopy.checkedIds
                  this.carouselList3[a].serviceItems = objCopy.serviceItems
                } else {
                  this.carouselList3[a].items = Array.from(new Set(this.carouselList3[a].items.concat(objCopy.items)))
                  this.carouselList3[a].content = this.carouselList3[a].items.join(',')
                  // this.carouselList3[a].content += objCopy.content
                  this.carouselList3[a].serviceItems = Array.from(new Set(this.carouselList3[a].serviceItems.concat(objCopy.serviceItems)));
                  this.carouselList3[a].checkedIds = objCopy ? Array.from(new Set(this.carouselList3[a].checkedIds.concat(objCopy.checkedIds))) : []
                  for (let b = 0; b < this.carouselList3[a].serviceItems.length; b++) {
                    for (let c = b + 1; c < this.carouselList3[a].serviceItems.length; c++) {
                      if (this.carouselList3[a].serviceItems[b].code === this.carouselList3[a].serviceItems[c].code) {
                        this.carouselList3[a].serviceItems.splice(b, 1)
                        c--
                      }
                    }
                  }
                }
                flag = false
              }
            }
            if (flag === true) {
              this.carouselList3.push(objCopy);
            }
          } else {
            this.carouselList3.push(objCopy);
          }
        }
        this.$refs.tree.setCheckedKeys([]);
        this.agentPerson = ''
      },
      callBack(obj) {
        for (let i = 0; i < obj.length; i++) {
          let list = this.$refs.tree.getCheckedNodes();
          if (obj[i].child !== undefined && obj[i].child.length > 0) {
            obj[i].child = this.callBack(obj[i].child)
          }
          for (let j in list) {
            if (list[j].code === obj[i].code) {
              obj[i].disabled = true
            }
          }
        }
        return obj
      },
      callBack1(obj) {
        let list = this.carouselList3;
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].child !== undefined && obj[i].child.length > 0) {
            obj[i].child = this.callBack1(obj[i].child)
          }
          for (let j in list) {
            for (let k in list[j].serviceItems) {
              if (list[j].serviceItems[k].code === obj[i].code) {
                obj[i].disabled = true;
              }
            }
          }
        }
        return obj
      },
      callBack2(obj) {
        let list = this.currentItems
        let arr = list
        let arr2 = []
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].child !== undefined && obj[i].child.length > 0) {
            arr2 = arr2.concat(this.callBack2(obj[i].child))
          }
          if (arr.checkedIds) {
            for (let b = 0; b < arr.checkedIds.length; b++) {
              if (arr.checkedIds[b] === obj[i].id) {
                if (this.dialogType === 2) {
                  // obj[i].disabled = false
                  arr2.push(arr.checkedIds[b])
                }
              }
            }
          }
        }
        return arr2
      },
      callBack3(obj) {
        for (let i = 0; i < obj.length; i++) {
          let list = this.delItems.checkedIds
          if (obj[i].child !== undefined && obj[i].child.length > 0) {
            obj[i].child = this.callBack3(obj[i].child)
          }
          for (let j = 0; j < list.length; j++) {
            if (list[j] === obj[i].id) {
              if (this.dialogType === 1) {
                obj[i].disabled = false
              }
            }
          }
        }
        return obj
      },
      handleNodeClick(data) {
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      changePerson(val) {
        // for (let i in this.agentPersonInfo) {
        //   if (val === this.agentPersonInfo[i].orgAgentId) {
        //     this.list3.id = val;
        //     this.list3.name = this.agentPersonInfo[i].personName;
        //     this.currentItems = this.list3
        //   }
        // }
        for (let i in this.agentPersonInfo) {
          if (val === this.agentPersonInfo[i].orgAgentId) {
            this.list3.id = val;
            this.list3.name = this.agentPersonInfo[i].personName;
            this.currentItems = this.list3
            let selectarr = this.callBack2(this.carouselList)
            this.$refs.tree.setCheckedKeys(selectarr)
          }
        }
      },
      getAgent() {
        // 获取代理人信息
        agentRequest.getAent().then((data) => {
          if (data.code === 0) {
            this.client = data.data.list;
          } else {
            this.$message(data.result);
          }
        })
      },
      getfileup(token) {
        return agentRequest.getfileup(token);
      },
      //        比较时间大小
      CompareDate(i) {
        if (this.enddate !== '') {
          if (this.enddate < this.startdate) {
            this.$message('服务时间止要大于服务时间起!');
            if (i === 1) {
              this.startdate = '';
            } else {
              this.enddate = '';
            }
          }
        }
      },
      checks() {
        if (this.serverArea === '') {
          this.$message('是否在同一纳税年度内为委托人提供审计服务必填!');
          return false;
        } else if (this.dataList.contractSum === '') {
          this.$message('协议金额必填!');
          return false;
        } else if (this.startdate === '') {
          this.$message('服务时间起必填!');
          return false;
        } else if (this.enddate === '') {
          this.$message('服务时间止必填!');
          return false;
        } else if (this.des === '') {
          this.$message('服务协议摘要必填!');
          return false;
        } else if (this.carouselList3.length === 0) {
          this.$message('税务代理人员信息必填!');
          return false;
        } else {
          return true;
        }
      },
      //      选择服务范围关闭弹窗
      Cancel() {
        this.dialogTableVisible = false;
        this.carouselList2 = [];
        let obj = this.carouselList ? this.carouselList : [];
        // this.callBack4(obj)
        this.carouselList = [...obj]
      },
      callBack4(obj) {
        let list = this.currentItems.checkedIds ? this.currentItems.checkedIds : [];
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].child !== undefined && obj[i].child.length > 0) {
            obj[i].child = this.callBack4(obj[i].child)
          }
          for (let j in list) {
            if (list[j] === obj[i].id) {
              obj[i].disabled = true;
            }
          }
        }
        return obj
      },
      Cancel2() {
        this.dialogTableVisible_pho = false;
        this.phoCode = '';
      },
      addInfo() {
        this.isMandator = true;
        var flag = this.checks();
        if (flag) {
          if (Object.keys(this.restProduct).length !== 0) {
            this.$message('委托服务范围必须分配完!');
            return false;
          } else {
            this.dialogTableVisible_pho = true;
          }
        }
        if (this.financeMobilePhone) {
          this.carouselList3.map(v => {
            v.serviceItems.map(item => {
              if (item.code === '050000' || item.code === '050100' || item.code === '050200' || item.code === '050300' || item.code === '050400' || item.code === '050500' || item.code === '050600' || item.code === '050700' || item.code === '059900' || item.code === '030000' || item.code === '040000' || item.code === '060000') {
                this.isMandator = false;
              }
            })
          })
        } else {
          this.isMandator = false
        }
      },
      changeAgent () {
        if (this.phoCode === '') {
          this.$message('短信校验码必填!');
          return false;
        } else {
          var serviceAgents = [];
          for (var i = 0; i < this.carouselList3.length; i++) {
            var taxOrgAgent = {};
            taxOrgAgent = {
              taxOrgAgentId: this.carouselList3[i].id,
              ServiceItems: this.carouselList3[i].serviceItems
            };
            serviceAgents.push(taxOrgAgent);
          }
          var param = {
            // 委托关系
            delegationRelationId: this.$route.query.delegationRelationId,
            isUnifyAnnualPayRatepaying: this.serverArea === '是' ? 1 : 0,
            delegationDigest: this.des,
            startDate: new Date(this.startdate).getTime(),
            endDate: new Date(this.enddate).getTime(),
            contractSum: this.dataList.contractSum,
            contractNumber: this.dataList.contractNumber,
            mandator: {
              mandatorName: this.mandator.mandatorName,
              mobilePhone: this.isMandator === true ? this.financeMobilePhone : this.mandator.mobilePhone,
              identificationNumber: this.mandator.identificationNumber
            },
            // 验证码(提交参数带有的验证码)
            securityCode: this.phoCode,
            serviceAgents: serviceAgents
          };
          if (this.uploadurl && this.originalName) {
            param.contractAttach = {
              storagePath: this.uploadurl,
              originalName: this.originalName
            }
          }
          agentRequest.updataAgent(param).then(data => {
            if (data.code === 0) {
              //              this.$router.push({name: 'RealNameCollect', query: {userId: 123, importfile: 123}});
              this.$router.push('/RealNameCollect');
            } else {
              this.$message(data.msg);
            }
          });
        }
      },
      formatDate (time) {
        time = parseInt(time);
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      },
      //    获取短信校验码
      getPhoCode: function() {
        var param = {
          mobilePhone: this.isMandator === true ? this.financeMobilePhone : this.mandator.mobilePhone,
          contents: [this.orgname, this.startdate, this.enddate, this.dataList.contractSum],
          type: 'CLIENTAGE_MODIFY_VERIFICATION'
        };
        agentRequest.getPhoCode(param).then((data) => {
          if (data.code === 0) {
          } else {
            this.$message(data.msg);
          }
        });
      },
      //      获取短信校验码
      getCode: function (e) {
        var that = this;
        var num = 60;
        this.getPhoCode();
        e.target.value = 59 + ' ' + '秒';
        e.target.style.backgroundColor = '#666666';
        let timer = setInterval(function() {
          num--;
          e.target.value = num + ' ' + '秒';
          e.target.style.backgroundColor = '#666666';
          that.isDisabled = 'disabled';
          if (num === 0) {
            that.isDisabled = false;
            e.target.style.backgroundColor = '#4680ff';
            e.target.value = '获取验证码';
            clearInterval(timer)
          }
        }, 1000)
      },
      handleRemove(file, fileList) {
        this.fileList = fileList;
      },
      handlePreview(file) {
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
//        return this.$confirm('确定移除 ${ file.name }？');
      },
      // 上传成功后的回调
      uploadSuccess (response, file, fileList) {
        this.uploadurl = response.data;
        this.originalName = file.name;
        this.fileList = fileList;
      },
      // 上传错误
      uploadError (response, file, fileList) {
        this.$message.warning('上传失败,请重试!');
      },
      // 上传前对文件的大小的判断
      beforeAvatarUpload (file) {
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
          this.$message.warning('上传模板大小不能超过 10MB!');
        }
        this.upLoadData.uploadUrl = URL.createObjectURL(file);
        return isLt2M;
      },
      getProductInfo (id) {
        const item = this.productsAll.find(v => v.orderProductServerId === id)
        if (item) {
          return {
            id: item.productId,
            title: item.title
          }
        } else {
          return {}
        }
      },

      // 点击修改分配委托事项
      changeItems (val) {
        this.currentItems = val
        if (val) {
          this.dialogType = 2;
        } else {
          this.dialogType = 1;
        }
        this.dialogTableVisible = true;
        if (this.dialogType === 2) {
          this.agentPerson = val.name
          this.isSelected = true
          this.callBack2(this.carouselList)
        }
      },

//      删除
      del(item) {
        this.delItems = item
        var arr = this.carouselList3;
        for (var i = 0; i < arr.length; i++) {
          if (arr[i]['name'] === item.name) {
            arr.splice(i, 1);
          }
        }
        let obj = this.carouselList ? this.carouselList : []
        // this.callBack5(obj)
        this.carouselList = [...obj];
      },
      callBack5(obj) {
        let list = this.delItems ? this.delItems.checkedIds : [];
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].child !== undefined && obj[i].child.length > 0) {
            obj[i].child = this.callBack5(obj[i].child)
          }
          for (let j in list) {
            if (list[j] === obj[i].id) {
              obj[i].disabled = false;
            }
          }
        }
        return obj
      }
    },
    computed: {
      // 计算弹窗中 代理人的禁用情况
      getSelectStatus () {
        if (!this.selectedClient) {
          return false
        }
        for (let v in this.showProduct) {
          const { service } = this.showProduct[v];
          for (let i = 0; i < service.length; i++) {
            if (service[i].checked) {
              return true
            }
          }
        }
        return false
      },

    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
    },
    directives: {
      focus: {
        // 弹出层 input 自动获取焦点
        inserted: function (el) {
          el.focus()
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '../style/index.styl';
  .editAgent
    .xd2
      width 100%
      tr
        height 40px
        line-height 40px
      td
        border 1px solid #dfdfdf
        background #fff
    .infoTitle
      text-align left
      margin-bottom 15px
      font-size 18px
      color #000
      font-weight bold
    .labelStyle
      text-align left
      font-size 14px
      color #000
      background #E5F0FF
      padding-left 10px
    .valueStyle
      background:#fff;
      width:30%!important;
      text-align :left;
      padding-left 10px;
      font-size: 14px;
      color: #333;
    .color9
      color #999
    .h35
      height 35px
      line-height 35px
  .dialog_pho1
      font-size 16px
      .getCode
        display: inline-block;
        width: 90px;
        height: 34px;
        background: #4680ff;
        line-height: 34px;
        color: #fff;
        border:none;
      .el-dialog__header
        background-image url('../../../../assets/img/agent/bg.jpg')
        color:#fff;
        padding 17px 0 18px
        height 16px
        .el-dialog__title
          color:#fff;
          font-size 16px
      .el-dialog__body
        padding: 19px 46px 30px;
        font-size 16px
        tr:nth-child(2)
          td
            position relative
            input:nth-child(1)
              border none
              height 34px
            input:nth-child(2)
              position absolute
              bottom 7px
              border-radius 17px
      .el-dialog__footer
        padding-top 0
        .el-button
          width: 88px;
          height: 32px;
          padding 0
          background-color: #4680ff;
          border-radius: 4px;
        .el-button--default
          background-color #fff
          color #4680ff
          border 1px solid #4680ff
          margin-left 64px
  .datechoose input {
    border: none;
    color: #333 !important;
  }
  .addAgent1 tr:last-child td:last-child{
    border:none
  }
  .tooltip1
    max-width 15%
  .tooltip
    max-width 50%
  .editmain
    .tableContent
      background #f2f4f7
      text-align center
      .btns
        margin-top 25px
        input
          height:32px;
          width:88px;
          color:#fff;
          border:none;
          border-radius 4px
          font-size:14px;
          background: #4680ff;
        .back_btn
          background: #fff;
          border:1px solid #4680ff;
          color:#4680ff;
          margin-left:20px;
      .addAgent1
        margin-bottom 15px
        tr
          height 40px
          line-height 40px
          td
            border 1px solid #dfdfdf
          .inputText
            width 95%
            padding-left 10px
            font-size 14px
            height 28px
            line-height 28px
            border 1px solid #e8e8e8
            border-radius 4px
          .textareaLabel
            position absolute
            top 0
            left 10px
          .textareaTd
            padding-right 5px 
            position relative
          .textarea
            margin-top 5px
            margin-bottom 5px
          .textrea_limit
            position absolute
            right 16px
            bottom -4px
          .upload-demo_1
            .el-upload
              .el-button
                width 60px
                height 28px
                border-radius 5px
                padding 0
                background:#fff;
                border:1px solid #4680ff;
                color:#4680ff;
                font-size 12px
                margin-right 91px
            .el-upload-list
              width 50%
              text-align left !important 
  .el-upload-list__item:first-child
    margin-top 0
  .assign
    float: right;
    width: 88px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    color: #4680ff;
    display: inline-block;
    cursor: pointer;
    font-size 14px
    border 1px solid #4680ff
    font-weight 400
    border-radius 5px
  .dialog_1 .el-dialog--center .el-dialog__header{
    padding:0px;
    background:#169bd4;
    height:50px;
    line-height:50px;
  }
  .dialog_1 .el-dialog__title{
    color:#fff;
  }
  .table_pho input:focus{
    border:none;
    outline: none;
  }
  /*// 20180115 新增样式*/
  .dialog_1 .edit_input{
    border : none;
    outline : none;
    border-bottom : 1px solid rgb(169, 169, 169);
    display: inline-block;
    max-width : 50px;
    min-width : 20px;
  }
  .dialog_1 .edit_num{
    cursor: pointer;
    font-size: 14px;
    color: #666;
  }
  /* 分配代理人弹出窗*/
  .el-dialog--center .el-dialog__body
    padding 10px 25px 25px
  .dialoag-input
    margin-left 15px
    width 320px
  .el-select .el-input.is-disabled .el-input__inner
    height 32px !important
  .dialog_1 .edit-tab-container{
    width: 423px;
  }
  .dialog_1 .edit-tab-container .el-tabs__header{
    max-width: 150px;
  }
  .dialog_1 .edit-tab-container .el-tabs__header .el-tabs__item{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .dialog_1 .el-tab-pane{
    text-align: left !important;
  }
  .dialog_1 .el-checkbox__label{
    font-size: 14px !important;
  }
  .dialog_1 .agent-service-name{
    max-width: 150px;
    display: inline-block;
    vertical-align: middle;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .dialog_1 .el-dialog__body{
   color: #606266 !important;
   line-height: 24px !important;
   font-size: 14px !important;
  }
  .dialog_1 .txt-left{
    text-align: left;
  }
  .red
    color #f56c6c
  .headerName 
    background #E5F0FF !important
</style>

