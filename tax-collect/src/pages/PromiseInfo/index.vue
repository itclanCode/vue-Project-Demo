<template>
  <el-container class="promise">
    <el-main>
      <div class="mainwrap">
        <div class="promiseWrap">
          <div class="promiseTitle">涉税专业服务信用承诺书</div>
          <p class="promiseText" style="text-indent:2em;">为提高税法遵从度，共建诚信社会，按照国家税务总局《涉税专业服务监管办法（试行）》（2017年第13号公告）有关要求，我承诺：在涉税专业服务过程中，自觉遵守税收法律、法规及相关规定，认真履行《涉税专业服务监管办法（试行）》规定的各项义务，主动报送相关信息并对信息的真实性、合法性和准确性负责，遵循涉税专业服务业务规范（准则、规则），接受税务机关涉税专业服务信用管理，对违反税收法律、法规及《涉税专业服务监管办法（试行）》的行为承担责任，自愿接受相应处理。</p>
          <div class="btns">
            <router-link :to="{path: '/editOrganization'}">
              <input type="button" value="同意">
            </router-link> 
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang='stylus' rel='stylesheet/stylus'>
@import './style/index.styl';
</style>