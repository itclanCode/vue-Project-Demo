<template>
  <div class=' recoverService'>
    <div class="mainWrap">
    <table>
      <tr>
        <td class='tableName'>机构名称</td>
        <td class='tableVal'>{{organizationName}}</td>
        <td class='tableName'>统一社会信用代码</td>
        <td class='tableVal'>{{creditCode}}</td>
      </tr>
      <tr>
        <td class='tableName'>恢复服务时间</td>
        <td class='tableVal' colspan='3'>{{serviceTime}}</td>
      </tr>
      <tr>
        <td class='tableName'><span class="red">*</span>恢复服务原因</td>
        <td class='tableVal' colspan='3'>
          <el-input
            type='textarea'
            :autosize="{ minRows: 2}"
            class='textarea'
            v-model="message.recoverReason"
            placeholder='请输入恢复服务原因'>
          </el-input>
        </td>
      </tr>
    </table>
    <div class="btns">
        <el-button type="primary" @click="restartService()">确定</el-button>
        <router-link to="/organization">
          <el-button style="margin-left: 30px;">取消</el-button>
        </router-link>
      <!-- <input type="button" value="确定" class="btn1" @click="restartService">
      <router-link to="/organization"><input type="button" value="取消" class="btn2"></router-link> -->
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
      message: {
        recoverReason: ''
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
    // 重启服务
    restartService() {
      let data = this.message.recoverReason;
      if (!data) {
        this.$message({
          type: 'error',
          message: '请填写恢复服务原因'
        })
        return;
      }
      organizationRequest.restartService(data).then((res) => { // 获取机构类别码值表
        const that = this;
        const errMsg = {
          7404: '请先进行行政登记'
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
          message: errMsg[res.code] || '操作成功'
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
@import '../style/recoverService.styl';
</style>
