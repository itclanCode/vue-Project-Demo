<template>
  <div class='addAgent'>
    <!--表格内容-->
    <div class='tableContent1'>
      <!--<el-form :model='ruleForm' :rules='rules' ref='ruleForm @submit='addInfo()''>-->
      <!--<form @submit='addInfo()'>-->
      <div class="infoTitle">机构纳税人信息</div>
      <table class='addAgentTab'>
        <tr>
          <td class='labelStyle'><span class="red">*</span> 委托协议信息采集编号</td> <td class='valueStyle color9'>--</td>               
          <td class='labelStyle'><span class="red">*</span> 合同编号</td> 
          <td class='valueStyle'><input type='text' required class='inputText' v-model='area'></td>
        </tr>
        <tr>
          <td class='labelStyle'><span class="red">*</span> 委托人统一社会信用代码</td> 
          <td class='valueStyle'><input type='text' class='inputText' v-model='identity' @blur='getAgentFromSocial'></td>
          <td class='labelStyle'><span class="red">*</span> 委托人名称</td> 
          <td class='valueStyle'>
            <input type='text' required class='inputText' v-model='clientName' :disabled='disabledAgent'></td>
        </tr>
        <tr>
          <td class='labelStyle'><span class="red">*</span> 委托人主管税务机关</td> 
          <td class='valueStyle'>{{tax ? tax : '--'}}</td>
          <td class='labelStyle'><span class="red">*</span> 委托人税务地址</td>
            <td class='valueStyle'>
              <span class="itemTooltip1">{{address ? address : '--'}}</span>
            </td>
        </tr>
        <tr>
          <td class='labelStyle'><span class="red">*</span> 委托人省份</td>
          <td class="valueStyle">{{orgProvince ? orgProvince : '--'}}
        </td>
          <td class='labelStyle'><span class="red">*</span> 审计服务
          <el-tooltip class="item" effect="dark" content="是否在同一纳税年度内为委托人提供审计服务" placement="right">
            <i class="color9 el-icon-rep-wenhao"></i>
          </el-tooltip>
          </td>
          <td class="valueStyle">
          <el-radio-group v-model='serverArea'>
            <el-radio label='是'></el-radio>
            <el-radio label='否'></el-radio>
          </el-radio-group>
        </td>
        </tr>
        <tr>
          <td class='labelStyle'><span class="red">*</span> 委托人法人手机号</td> 
          <td class="valueStyle"><input type="text" class="inputText" v-model="pho" pattern="^1[34578]\d{9}$" :disabled="disabledAgent"></td>
          <td class='labelStyle'><span class="red">*</span> 协议金额(元)</td> 
          <td class="valueStyle"><input class='inputText' v-model='money'></td>
        </tr>
        <tr>
          <td class='labelStyle'><span class="red">*</span> 服务时间起</td> 
          <td class="valueStyle"> 
            <el-date-picker
            v-model="startdate"
            type="date"
            placeholder="选择日期"
            @blur="CompareDate(1)"
            class="datechoose"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker></td>
          <td class='labelStyle'><span class="red">*</span> 服务时间止</td> 
          <td class="valueStyle">
            <el-date-picker
            v-model="enddate"
            type="date"
            placeholder="选择日期"
            @blur="CompareDate(2)"
            class="datechoose"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker></td>
        </tr>
        <!-- <tr>
          <td class='w25p ar  paddingRight20 vm'><span class="red">*</span> 委托服务范围</td> <td colspan='3'>
            <el-tooltip effect="dark" :content="carouselListConstArr" placement="top" popper-class="addtooltip">
              <span class="itemTooltip" style="-webkit-box-orient: vertical;">{{carouselListConstArr}}</span>
            </el-tooltip>
        </td>
        </tr> -->
        <tr>
          <td class='labelStyle'><span style='color:red;margin-right: 8px;'></span>上传合同</td>
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
          <td class='labelStyle'><span class="red">*</span> 服务协议摘要</td> 
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
            <span class="textrea_limit">{{remnant}}/2000</span>
          </td>
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
        <input type='submit' value='添加' class='add_btn2 cursor' @click='addInfo2()'>
        <input type='button' value='取消' class='back_btn cursor' onclick='history.go(-1)'>
      </div>
      <!--</el-form>-->
      <!--</form>-->
    </div>
    <!--手机校验-->
    <el-dialog title='确认添加' :visible.sync='dialogTableVisible_pho'  center :show-close='showClose'  class='dialog_pho3' width='528px' top='25vh' :close-on-click-modal='closemodal=false'>
      <table class='ac w100p table_pho'>
        <tr class='h50' v-if="isMandator">
          <td class='w25p ar vb'>财务负责人手机号</td>
          <td class='w40p borderBottom vb al'>
            {{financeMobilePhone}}
          </td>
        </tr>
        <tr class='h50' v-else>
          <td class='w25p ar vb'>委托人法人手机号</td>
          <td class='w40p borderBottom vb al'>
            {{pho}}
          </td>
        </tr>
        
        <tr class='h50'>
          <td class='ar vb'>短信校验码</td>
          <td class='borderBottom vb al inputText'><input type='text' placeholder="请输入验证码" required class=' al' v-model='phoCode' id='phonecode'><input type='button' class='getCode cursor' @click='getCode($event)' :disabled='isDisabled' value='获取验证码'></td>
        </tr>
      </table>
        <span slot='footer' class='dialog-footer'>
        <el-button type='primary' @click='addInfo()'>添加</el-button>
          <el-button @click='Cancel2()'>取 消</el-button>
        </span>
    </el-dialog>
    <!--服务范围-->
    <el-dialog title='分配委托事项' :visible.sync='dialogTableVisible2'  center :show-close='showClose'  class='dialog_2'>
      <el-select 
        v-model='agentPerson' 
        placeholder='请选择代理人' 
        @change='changeAgent(agentPerson)' 
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
  </div>
</template>
<script>
import { agentRequest } from '@/services/request';
import { formatDate } from '@/common/js/date.js';

export default {
  data() {
    return {
      isMandator: true,
      isSelected: false,
      orgProvince: '',
      orgAuthority: '',
      filterText: '',
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      defaultOpen: ['2'],
      upLoadData: {
        uploadUrl: ''
      },
      url: '',
      uploadurl: '',
      originalName: '',
      showClose: false,
      orderNum: '--',
      isDisabled: false,
      disabledAgent: false,
      disabled: '',
      serverItem: {
        text1: ['a', 'b', 'c'],
        text2: ['w', 'e'],
        text3: ['r', 'f']
      },
      agentPersonInfo: '',
      area: '',
      identity: '',
      clientName: '',
      tax: '',
      address: '',
      money: '',
      pho: '',
      phoCode: '',
      des: '',
      assginArr: [],
      obj: {},
      tag: false,
      dialogTableVisible_pho: false,
      dialogTableVisible: false,
      dialogTableVisible2: false,
      autoplay: false,
      chooseColor: -1,
      startdate: '',
      enddate: '',
      serverArea: '否',
      agentThings: [],
      agentPerson: '',
      //        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
      fileList: [],
      provinceData: [],
      carouselList: [],
      carouselList2: [],
      carouselList3: [],
      list3: {
        id: '',
        name: '',
        content: '',
        items: []
      },
      carouselListConst: [],
      // carouselListConstArr: '',
      authorityList: [],
      dialogType: 1, // 1 表示通过委托按钮打开， 2 表示编辑按钮打开,
      currentItems: {},
      delItems: {},
      editItems: [],
      financeMobilePhone: '',
      orgname: '',
      remnant: 0,
      orderId: '',
      demandId: ''
    }
  },
  created: function() {
    //      var url = 'http://172.17.6.56/taobao/upload/protocol-attach';
    console.log(this);
    var token = window.localStorage.getItem('token');
    this.url = this.getfileup(token);
    //      this.url = url;
  },
  mounted() {
    // 获取省份码值
    agentRequest.getProviceList().then(data => {
      this.provinceData = data
    })
    // 获取主管税务机关码值
    agentRequest.getAuthority().then(data => {
      this.authorityList = data
    })
    agentRequest.getOrgserviceItems().then(data => {
      if (data.code === 0) {
        this.carouselListConst = data.data;
        this.carouselList = data.data;
      }
    });
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
    this.identity = this.getQueryString('identificationNumber') ? this.getQueryString('identificationNumber') : ''
    this.pho = this.getQueryString('corpMobilePhone') ? this.getQueryString('corpMobilePhone') : ''
    this.clientName = this.getQueryString('mandatorName') ? this.getQueryString('mandatorName') : ''
    this.orderId = this.getQueryString('orderId') ? this.getQueryString('orderId') : ''
    this.money = this.getQueryString('payment') ? this.getQueryString('payment') : ''
    this.demandId = this.getQueryString('demandId') ? this.getQueryString('demandId') : ''
    console.log(this.identity === true)
    if (this.identity) {
      this.getAgentFromSocial()
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    getQueryString(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      var r = decodeURIComponent(window.location.search).substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
    },
    descInput() {
      var txtVal = this.des.length;
      this.remnant = 0 + txtVal;
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
    getfileup(token) {
      // config.url.replace(config.url.match(/^http(s)?:\/\/(.*?)\//)[0], 'http://39.108.191.243/')
      return agentRequest.getfileup(token);
    },
    //      通过统一社会信用代码查找委托人
    getAgentFromSocial() {
      if (this.identity === '') {
        this.disabledAgent = false;
        this.clientName = '';
        this.orgProvince = '';
        this.address = '';
        this.tax = '';
        this.pho = '';
      } else {
        agentRequest.getAentfromSocialCode(this.identity).then(data => {
          console.log(data, 'data')
          if (data.code === 0) {
            if (data.data !== undefined && data.data) {
              this.disabledAgent = true;
              this.clientName = data.data.mandatorName;
              this.orgProvince = data.data.mandatorProvince;
              this.address = data.data.enterpriseAddress;
              this.tax = data.data.manageTaxOrg;
              this.pho = data.data.corpMobilePhone;
              this.financeMobilePhone = data.data.financeMobilePhone
            }
          }
        });
      }
    },
    formatDate(time) {
      time = parseInt(time);
      var date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd');
    },
    changeAgent(val) {
      for (let i in this.agentPersonInfo) {
        if (val === this.agentPersonInfo[i].orgAgentId) {
          this.list3.id = val;
          this.list3.name = this.agentPersonInfo[i].personName;
          this.currentItems = this.list3
          let selectarr = this.callBack1(this.carouselList)
          // let selectarr = this.carouselList
          this.$refs.tree.setCheckedKeys(selectarr)
        }
      }
    },
    check() {
      if (this.identity === '') {
        this.$message('委托人统一社会信用代码必填!');
        return false;
      } else if (this.clientName === '') {
        this.$message('委托人名称必填!');
        return false;
      } else if (this.serverArea === '') {
        this.$message('是否在同一纳税年度内为委托人提供审计服务必填!');
        return false;
      } else if (this.pho === '') {
        this.$message('委托人法人手机号必填!');
        return false;
      } else if (this.money === '') {
        this.$message('协议金额(元)必填!');
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
        this.$message('税务代理人信息不为空!');
        return false;
      } else {
        return true;
      }
    },
    // 修改
    changeItems (val) {
      this.currentItems = val
      if (val) {
        this.dialogType = 2;
      } else {
        this.dialogType = 1;
      }
      this.dialogTableVisible2 = true;
      if (this.dialogType === 2) {
        this.agentPerson = val.name
        this.isSelected = true
        let selectarr = this.callBack1(this.carouselList)
        // let selectarr = this.carouselList
        this.$refs.tree.setCheckedKeys(selectarr)
      }
    },
    //          分配委托事项弹窗
    assignDialog() {
      this.dialogType = 1
      this.agentPerson = '';
      this.isSelected = false;
      this.$refs.tree && this.$refs.tree.setCheckedKeys([]);
      //          委托事项
      this.dialogTableVisible2 = true;
      this.carouselList2 = [];
      this.currentItems = {}
    },
    //          删除
    del(item) {
      this.delItems = item
      var arr = this.carouselList3;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i]['name'] === item.name) {
          arr.splice(i, 1);
        }
      }
      // let arr1 = this.callBack2(this.carouselList)
      // this.carouselList = [...arr1]
      let obj = this.carouselList ? this.carouselList : []
      // this.callBack5(obj)
      this.carouselList = [...obj]
      console.log(this.carouselList3, 'list3')
      // let arr3 = []
      // this.carouselList3.map(v => {
      //   arr3.push(v.items)
      // })
      // this.carouselListConstArr = arr3.join(',')
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
    },
    callBack2(obj) {
      for (let i = 0; i < obj.length; i++) {
        let list = this.delItems.checkedIds
        if (obj[i].child !== undefined && obj[i].child.length > 0) {
          obj[i].child = this.callBack2(obj[i].child)
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
    callBack(obj) {
      for (let i = 0; i < obj.length; i++) {
        let list = this.$refs.tree.getCheckedNodes();
        if (obj[i].child !== undefined && obj[i].child.length > 0) {
          obj[i].child = this.callBack(obj[i].child)
        }
        for (let j = 0; j < list.length; j++) {
          if (list[j].id === obj[i].id) {
            obj[i].disabled = true
          }
        }
      }
      return obj
    },
    callBack1(obj) {
      let list = this.currentItems
      let arr = list
      let arr2 = []
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].child !== undefined && obj[i].child.length > 0) {
          arr2 = arr2.concat(this.callBack1(obj[i].child))
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
    //      选择服务范围关闭弹窗
    querenServer() {
      let list1 = this.$refs.tree.getCheckedNodes(true);
      let serviceItems = []
      let ids = []
      this.carouselList2 = []
      for (let key in list1) {
        this.carouselList2.push(list1[key].name);
        serviceItems.push({code: list1[key].code})
      }
      let _nodes = this.$refs.tree.getCheckedNodes();
      for (let b in _nodes) {
        ids.push(_nodes[b].id)
      }
      if (this.agentPerson === '') {
        this.$message('代理人必选');
        return false;
      } else if (this.carouselList2.length === 0 && this.dialogType === 1) {
        this.$message('请选择代理事项!');
        return false;
      } else {
        // this.callBack(this.carouselList);
        this.dialogTableVisible2 = false;
        this.list3.items = Array.from(new Set(this.carouselList2))
        this.list3.content = this.list3.items.join(',');
        // this.list3.items = Array.from(new Set(this.carouselList2))
        this.list3.serviceItems = serviceItems
        this.list3.checkedIds = ids;
        // 深拷贝
        var objCopy = JSON.parse(JSON.stringify(this.list3));
        let flag = true
        if (this.carouselList3.length > 0) {
          for (let a in this.carouselList3) {
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
                this.carouselList3[a].checkedIds = objCopy ? Array.from(new Set(this.carouselList3[a].checkedIds.concat(objCopy.checkedIds))) : []
                // this.carouselList3[a].content += objCopy.content
                this.carouselList3[a].serviceItems = Array.from(new Set(this.carouselList3[a].serviceItems.concat(objCopy.serviceItems)));
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
      // let arr3 = []
      // this.carouselList3.map(v => {
      //   arr3.push(v.items)
      // })
      // this.carouselListConstArr = arr3.join(',')
      // this.$refs.tree.setCheckedKeys([]);
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handlePreview(file) {
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      //        return this.$confirm('确定移除 ${ file.name }？');
    },
    // 上传成功后的回调
    uploadSuccess(response, file, fileList) {
      if (response.code === 0) {
        this.uploadurl = response.data;
      }
      this.originalName = file.name;
      this.fileList = fileList;
    },
    // 上传错误
    uploadError(response, file, fileList) {
      this.$message.warning('上传失败,请重试!');
    },
    // 上传前对文件的大小的判断
    beforeAvatarUpload(file) {
      //        const extension = file.name.split('.')[1] === 'jpg';
      //        const extension2 = file.name.split('.')[1] === 'png';
      const extension3 = file.name.split('.')[1] === 'doc';
      const extension4 = file.name.split('.')[1] === 'docx';
      const extension5 = file.name.split('.')[1] === 'pdf';
      //        const extension6 = file.name.split('.')[1] === 'txt';
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension3 && !extension4 && !extension5) {
        this.$message.warning('上传模板只能是 doc、docx、pdf格式!');
      }
      if (!isLt2M) {
        this.$message.warning('上传模板大小不能超过 10MB!');
      }
      this.upLoadData.uploadUrl = URL.createObjectURL(file);
      return (extension3 || extension4 || extension5) && isLt2M;
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
    //      选择服务范围关闭弹窗
    Cancel() {
      this.dialogTableVisible2 = false;
      this.carouselList2 = [];
      let obj = this.carouselList ? this.carouselList : [];
      // this.callBack4(obj)
      this.carouselList = [...obj]
    },
    Cancel2() {
      this.dialogTableVisible_pho = false;
      this.phoCode = '';
    },
    addInfo2() {
      let check = this.check();
      if (check) {
        this.dialogTableVisible_pho = true;
      }
      if (this.financeMobilePhone) {
        this.carouselList3.map(v => {
          v.serviceItems.map(item => {
            // console.log(typeof (item.code))
            if (item.code === '050000' || item.code === '050100' || item.code === '050200' || item.code === '050300' || item.code === '050400' || item.code === '050500' || item.code === '050600' || item.code === '050700' || item.code === '059900' || item.code === '030000' || item.code === '040000' || item.code === '060000') {
              this.isMandator = false;
            }
          })
        })
      } else {
        this.isMandator = false
      }
    },
    addInfo() {
      //          确认添加
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
          isUnifyAnnualPayRatepaying: this.serverArea === '是' ? 1 : 0,
          delegationDigest: this.des,
          startDate: new Date(this.startdate).getTime(),
          endDate: new Date(this.enddate).getTime(),
          contractSum: this.money,
          contractNumber: this.area,
          mandator: {
            mandatorName: this.clientName,
            mobilePhone: this.isMandator === true ? this.financeMobilePhone : this.pho,
            identificationNumber: this.identity
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
        if (this.orderId) {
          param.remoteBusinessType = 'order_submit_protocol'
          param.remoteBusinessInfo = this.orderId
        } else if (this.demandId) {
          param.remoteBusinessType = 'demand'
          param.remoteBusinessInfo = this.demandId
        }
        agentRequest.addAgent(param).then(data => {
          if (data.code === 0) {
            //              this.$router.push({name: 'RealNameCollect', query: {userId: 123, importfile: 123}});
            this.$router.push('/RealNameCollect');
          } else {
            this.$message({
              showClose: true,
              message: data.msg,
              type: 'error',
              duration: 0
            })
          }
        });
      }
    },
    getPhoCode: function() {
      var param = {
        mobilePhone: this.isMandator === true ? this.financeMobilePhone : this.pho,
        contents: [this.orgname, this.startdate, this.enddate, this.money],
        type: 'CLIENTAGE_REAL_NAME_AUTHENTICATION'
      };
      agentRequest.getPhoCode(param).then(data => {
        if (data.code === 0) {
        } else {
          this.$message.warning(data.msg);
        }
      });
    },
    //      获取短信校验码
    getCode: function(e) {
      if (this.pho === '') {
        this.$message('请先输入手机!');
        return false;
      } else {
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
            e.target.style.color = '#fff';
            e.target.value = '获取验证码';
            clearInterval(timer);
          }
        }, 1000);
      }
    }
  }
}
</script>
<style lang='stylus' rel='stylesheet/stylus'>
@import '../style/index.styl';
.addAgent
  input[type='text']:disabled
    background-color #fff
    border none
    color #999
  .addtooltip1
  max-width 15%
  .addtooltip
    max-width 50%
  .xd2
    width 100%
    tr:not(:first-child)
      td:nth-child(2)
        padding 8px 24px 8px 60px
        line-height 20px
    tr:nth-child(1)
      height 40px
      line-height 40px
      background-color #f4f7fe
      td
        span:nth-child(1)
          position relative
          .star
            position absolute
            left -15px
            top -8px
    tr
      height 50px
      line-height 50px
      td
        border 1px solid #e8e8e8
        .itemTooltip
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        .itemTooltip1
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
      td:nth-child(1),td:nth-child(3)
        width 25%
      td:nth-child(2),td:nth-child(3)
        text-align left
        padding-left 60px
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
    width 30%
    background #fff
    text-align left
    padding-left 10px
    font-size 14px
    color #333
  .color9
    color #999
  .h35
    height 35px
    line-height 35px
  .datechoose input {
    border: none;
    color: #333 !important;
  }

  .table_pho input:focus {
    border: none;
    outline: none;
  }
  .dialog_pho3
      .el-dialog__header
        background:#4680ff;
        color:#fff;
        padding-top:15px;
        .el-dialog__title
          color:#fff;
      .el-dialog__body
        padding: 19px 46px 30px;
        font-size 16px
        tr
          #phonecode
            height 34px
          td:nth-child(odd)
            width 40%
            padding-right 36px
        tr:nth-child(2)
          td
            position relative
            input:nth-child(1)
              border none
            input:nth-child(2)
              position absolute
              bottom 7px
              right 0
              border-radius 17px
      .el-dialog__footer
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
  .chooseColor {
    color: #26d3a4;
  }

  .addAgentTab
    width 100%
    margin-bottom 20px 
    tr
      height 40px
      line-height 40px
      td
        border 1px solid #dfdfdf
  .datechoose .el-input__icon {
    font-size: 14px;
  }

  .el-dialog--center .el-dialog__body
    padding 10px 25px 25px
  .dialoag-input
    margin-left 15px
    width 320px
  .el-select .el-input.is-disabled .el-input__inner
    height 32px !important

  .carousel .el-input, .carousel .el-select {
    width: 100%;
  }

  .multi_checkbox label {
    width: 100%;
    padding: 8px;
    margin-left: 0px !important;
  }

  .selectAgent input {
    border: none;
  }
  . {
    background: #ceecf8;
  } 
  .tableContent1 
    background #f2f4f7
    text-align center
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
    margin-bottom 8px
  .table_2 tr td {
    height: 45px;
    line-height: 45px;
  }

  .multi_checked {
    display: inline-block;
    width: 100%;
    line-height: 16px;
    height: 250px;
    margin-top: 12px;
    overflow-y: scroll;
    overflow-x: hidden;
    border: 1px solid rgb(169, 169, 169);
  }

  .lineHeight23 {
    line-height: 23px !important;
  }

  .lineHeight50 {
    line-height: 50px !important;
  }

  .lineHeight16 {
    line-height: 16px !important;
  }

  .getCode {
    display: inline-block;
    width: 90px;
    height: 34px;
    background: #4680ff;
    line-height: 34px;
    color: #fff;
    border: none;
  }
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
  .dialog_1 .el-dialog--center .el-dialog__header {
    padding: 0px;
    background: #169bd4;
    height: 50px;
    line-height: 50px;
  }

  .dialog_1 .el-dialog__title {
    color: #fff;
  }

  .carousel {
    height: 310px;
  }

  .carousel .el-carousel__item {
    background: none;
  }

  .carousel .el-carousel__container {
    height: 250px;
    top: 55px;
    border: 1px solid #999;
  }

  .carousel .el-carousel__indicators--outside {
    bottom: 0px;
    position: absolute;
  }

  .carousel .el-carousel__indicators {
    top: 0;
    left: 0%;
    width: 100%;
    z-index: 0;
  }

  .carousel .el-carousel__indicators--labels .el-carousel__indicator {
    padding: 0px 1px;
  }
  .red
    color #f56c6c
  .headerName 
    background #E5F0FF !important
</style>

