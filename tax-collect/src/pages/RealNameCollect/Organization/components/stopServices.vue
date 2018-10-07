<template>
  <div class='stopServices'>
    <div class="mainWrap">
    <table>
      <tr>
        <td class='tableName'>机构名称</td>
        <td class='tableVal'>{{organizationName}}</td>
        <td class='tableName'>统一社会信用代码</td>
        <td class='tableVal'>{{creditCode}}</td>
      </tr>
      <tr>
        <td class='tableName'>中止服务时间</td>
        <td class='tableVal' colspan='3'>{{serviceTime}}</td>
      </tr>
      <tr>
        <td class='tableName'><span class="red">*</span>中止服务原因</td>
        <td class='tableVal' colspan='3'>
          <el-input
            v-model="pageData.reason"
            type='textarea'
            :autosize="{ minRows: 2}"
            class='textarea'
            placeholder='请输入中止服务原因'>
          </el-input>
        </td>
      </tr>
    </table>
    <div class="btns">
      <!-- <input type="button" value="确定" class="btn1" @click="stopServer()"> -->
      <el-button type="primary" @click="stopServer()">确定</el-button>
      <router-link to="/organization">
        <el-button style="margin-left: 30px;">取消</el-button>
        </router-link>
    </div>
    </div>
  </div>
</template>
<script>
import { organizationRequest } from '@/services/request';
export default {
  data() {
    return {
      defaultOpen: ['2'],
      organizationName: '',
      creditCode: '',
      serviceTime: '',
      pageData: {
        reason: ''
      }
    };
  },
  created() {
    this.organizationName = this.$route.query.organizationName;
    this.creditCode = this.$route.query.creditCode;
    this.serviceTime = this.getNowFormatDate()
  },
  methods: {
    // 获取当前时间
    getNowFormatDate() {
      var date = new Date();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = '0' + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
      }
      var currentdate = date.getFullYear() + '-' + month + '-' + strDate;
      return currentdate;
    },
    stopServer() {
      if (!this.pageData.reason) {
        this.$message({
          type: 'error',
          message: '请完善终止服务原因！'
        })
        return;
      };
      let data = 'aaa';
      organizationRequest.stopService(data).then(res => {
        const that = this;
        const errMsg = {
          7404: '您选择的机构类型为税务师事务所，请先办理税务师事务所行政登记',
          7407: '该机构涉税专业服务协议仍存在续存期内, 不能中止',
          7403: '无法获取机构信息'
        }
        const successCode = [0, 7205, 7206, 7208];
        const code = res.code;
        if (successCode.indexOf(code) < 0) {
          const msg = errMsg[code] || '网络请求失败，请稍后重试';
          this.$alert(msg, '操作失败', {callback: () => {
            that.$router.push({path: '/organization'});
          }});
          return;
        }
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        let t = setTimeout(function() {
          that.$router.push({path: '/organization'});
          clearTimeout(t);
        }, 500)
      })
    }
  }
};
</script>
<style lang='stylus' rel='stylesheet/stylus'>
@import '../style/stopServices.styl';
</style>
