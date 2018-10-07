<template>
  <div class="endmain">
    <!--表格内容-->
    <div class="tableContent">
      <form>
      <table class="w100p fontSize14 endAgent">
        <tr>
          <td class="labelStyle">委托协议信息采集编号</td> <td class="valueStyle">{{dataList.collectNumber ? dataList.collectNumber : '--'}}</td>
          <td class="labelStyle">合同编号</td> <td class="valueStyle">{{dataList.contractNumber}}</td>
        </tr>
        <tr>
          <td class="labelStyle">委托人统一社会信用代码</td> <td class="valueStyle">{{mandator.identificationNumber}}</td>
          <td class="labelStyle">委托人名称</td> <td class="valueStyle">{{mandator.mandatorName}}</td>
        </tr>
        <tr>
          <td class="labelStyle"><span class="red">*</span> 协议执行情况</td>
          <td class="valueStyle color3">
            <!--未完成 0-->
            <!--已完成 1-->
            <el-select  placeholder="请协议执行情况" required class="provincechoose" v-model="finishStatus">
              <el-option value="N" label="未完成"></el-option>
              <el-option value="Y" label="已完成"></el-option>
            </el-select>
          </td>
          <td class="labelStyle"><span class="red">*</span> 协议终止日期</td> 
          <td class="valueStyle color3">
            <el-date-picker
              v-model="enddate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </td>
        </tr>
        <tr>
          <td class="labelStyle"><span class="red">*</span> 上传附件</td>
          <td colspan="3" class="valueStyle color3">
          <el-upload
          class="upload-demo"
          :action="url"
          :onError="uploadError"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :onSuccess="uploadSuccess"
          :beforeUpload="beforeAvatarUpload"
          multiple
          :limit="1"
          :data="upLoadData"
          accept=".jpg,.png,.doc,.pdf"
          :on-exceed="handleExceed"
          :file-list="fileList">
            <el-button size="small" type="primary">上传</el-button>
            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
        </el-upload>
        </td>
        </tr>
        <tr>
          <td class="labelStyle" style="position: relative">
            <span class="textareaLabel"><span class="red">*</span> 协议终止原因</span>
          </td>
          <td colspan="3" class="valueStyle textareaTd">
            <el-input
              class="textarea"
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="des"
              maxlength="2000"
            >
            </el-input>
          </td>
        </tr>
      </table>
      </form>
      <div class="btns"><input type="button" value="确认" class="add_btn2 cursor" @click="queren()"><input type="button" value="取消" class="back_btn cursor" onclick="history.go(-1)"></div>
      <!--手机校验-->
      <el-dialog title='确认终止' :visible.sync="dialogTableVisible_pho"  center :show-close='showClose'  class="dialog_pho2" :close-on-click-modal="closemodal=false" width='528px' top='25vh'>
        <table class="ac table_pho">
          <tr class="h50">
            <td class="w25p ar  paddingRight20 vb">委托人法人手机号</td>
            <td class="w40p borderBottom vb al">
              {{mandator.mobilePhone}}
            </td>
          </tr>
          <tr class="h50">
            <td class="w22p ar  paddingRight20 vb">短信校验码</td>
            <td class="w40p borderBottom vb al"><input type="text" required class="inputText w60p al" v-model="phoCode" id="phonecode" placeholder="请输入验证码"><span style="display: inline-block"><input type="button" class="getCode cursor" @click="getCode($event)" :disabled='isDisabled' value="获取验证码"></span></td>
          </tr>
        </table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="endSure()" class="makeSure">确定</el-button>
          <el-button @click="Cancel2()" class="cancle">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { agentRequest } from '@/services/request';
  import {formatDate} from '@/common/js/date.js'
  export default {
    data() {
      return {
        defaultOpen: ['2'],
        dialogTableVisible: false,
        dialogTableVisible_pho: false,
        isDisabled: false,
        showClose: false,
        phoCode: '',
        url: '',
        finishStatus: '',
        delegationRelationId: '',
        fileList: [],
        upLoadData: {
          uploadUrl: ''
        },
        des: '',
        dataList: '',
        mandator: '',
        enddate: '',
        condition: '',
        orgname: '',
        startdate: ''
//        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
      }
    },
    created: function() {
//      var url = 'http://172.17.6.56/taobao/upload/protocol-attach';
      var token = window.localStorage.getItem('token');
//      this.url = url + '?token=' + token;
      this.url = this.getfileup(token);
      var id = this.$route.query.delegationRelationId;
      this.delegationRelationId = id;
      agentRequest.getProtocolDetail(id).then((data) => {
        if (data.code === 0) {
          this.dataList = data.data;
          this.startdate = this.formatDate(this.dataList.startDate);
          this.delegationRelationId = data.data.delegationRelationId;
          this.mandator = data.data.mandator;
        } else {
          this.$message(data.result);
        }
      })
    },
    mounted() {
      // 获取机构名称
      agentRequest.getOrgName().then(data => {
        if (data.code === 0) {
          this.orgname = data.data
        }
      })
    },
    methods: {
      formatDate (time) {
        time = parseInt(time);
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      },
      Cancel2() {
        this.dialogTableVisible_pho = false;
        this.phoCode = '';
      },
      getfileup(token) {
        return agentRequest.getfileup(token);
      },
      check() {
//        var flag = true;
//        var phoCode;
//        var param = {mobilePhone: this.mandator.mobilePhone, securityCode: this.phoCode};
//        if (this.mandator.mobilePhone !== '' && this.phoCode !== '') {
//          agentRequest.getverifyVCode(param).then((data) => {
//            if (data.result === 'ok') {
//            } else {
//              flag = false;
//              phoCode = data.data.message;
//            }
//            console.log(444, data);
//          });
//        }
        if (this.enddate === '') {
          this.$message('协议终止日期必填!');
          return false;
        } else if (this.des === '') {
          this.$message('协议终止原因必填!');
          return false;
        } else if (this.finishStatus === '') {
          this.$message('协议执行情况必选!');
          return false;
        } else {
          return true;
        }
      },
      endSure() {
        if (this.phoCode === '') {
          this.$message('短信校验码必填!');
          return false;
        } else {
          var param = {
            terminationDate: new Date(this.enddate).getTime(),
            terminationReason: this.des,
            securityCode: this.phoCode,
            finishStatus: this.finishStatus};
          if (this.uploadurl && this.originalName) {
            param.terminationAttachStoragePath = this.uploadurl
            param.originalName = this.originalName
          }
          agentRequest.Dotermination(this.delegationRelationId, param).then((data) => {
            if (data.code === 0) {
              this.$router.push({path: '/realNameCollect', query: {protocolId: this.delegationRelationId}});
            } else {
              this.$message(data.msg);
            }
          });
        }
      },
      queren() {
        var flag = this.check();
        if (flag) {
          this.dialogTableVisible_pho = true;
        } else {
          return false;
        }
      },
      //    获取短信校验码
      getPhoCode: function() {
        var param = {
          mobilePhone: this.mandator.mobilePhone,
          contents: [this.orgname, this.startdate, this.enddate, this.dataList.contractSum],
          type: 'CLIENTAGE_TERMINATION_VERIFICATION'
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
            e.target.style.backgroundColor = '#409EFF';
            e.target.value = '获取验证码';
            clearInterval(timer)
          }
        }, 1000)
      },
      handleRemove(file, fileList) {
        this.fileList = fileList;
      },
      // 上传错误
      uploadError (response, file, fileList) {
        this.$message.warning('上传失败,请重试!');
      },
      // 上传成功后的回调
      uploadSuccess (response, file, fileList) {
        this.uploadurl = response.data.uploadUrl;
        this.originalName = file.name;
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
      // 上传前对文件的大小的判断
      beforeAvatarUpload (file) {
//        const extension = file.name.split('.')[1] === 'jpg';
//        const extension2 = file.name.split('.')[1] === 'png';
        const extension3 = file.name.split('.')[1] === 'doc';
        const extension4 = file.name.split('.')[1] === 'docx';
        const extension5 = file.name.split('.')[1] === 'pdf';
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!extension3 && !extension4 && !extension5) {
          this.$message.warning('上传模板只能是doc、docx、pdf格式!');
        }
        if (!isLt2M) {
          this.$message.warning('上传模板大小不能超过 10MB!');
        }
        this.upLoadData.uploadUrl = URL.createObjectURL(file);
//        return extension || extension2 || extension3 || extension4 || extension5 && isLt2M
        return (extension3 || extension4 || extension5) && isLt2M;
      },
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '../style/index.styl';
  .dialog_pho2
    font-size 16px
    .el-dialog__header
      background-image url('../../../../assets/img/agent/bg.jpg')
      color #fff
      padding 17px 0 18px
      height 16px
      .el-dialog__title
        color #fff
        font-size 16px
    .getCode
      display: inline-block;
      width: 90px;
      height: 34px;
      background: #4680ff;
      line-height: 34px;
      color: #fff;
      border:none;
      border-radius 17px 
  .table_pho input:focus{
    border:none;
    outline: none;
  }
.endmain
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
  .color3
    color #333
  .h35
    height 35px
    line-height 35px
  .tableContent
    background #f2f4f7
    text-align center
    .el-dialog__body
      padding: 19px 46px 30px;
      font-size 16px
      #phonecode
        margin-top 6px
        height 34px
    .el-dialog__footer
      padding-top 0
    .dialog-footer
      .el-button
        width: 88px;
        height: 32px;
        background-color: #4680ff;
        border-radius: 4px
        padding 0
      .cancle
        background-color #fff
        border: solid 1px #4680ff
        color #4680ff
        margin-left 64px
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
    .endAgent
      tr
        height 40px;
        line-height:40px;
        td
          border 1px solid #dfdfdf
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
          .el-date-editor.el-input
            width 100%
            .el-input__inner
              border none
              height 32px
          .el-select
            .el-input
              height 32px
            .el-input__inner
              padding-left 10px
              height 32px
              line-height 32px
      tr:nth-child(3)
        td:nth-child(2)
          height 24px
          line-height 24px
          padding-top 3px
          padding-bottom 3px
        .provincechoose
          width 98%
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
    color #333
  .inputText
    width 95%
    padding-left 10px
    font-size 14px
    height 28px
    line-height 28px
    border 1px solid #e8e8e8
    border-radius 4px
  .red
    color #f56c6c
  .el-upload-list__item:first-child
    margin-top 0
    margin-bottom 8px
</style>

