<!-- Created by qulx on 2018/06/20. -->
<!-- 机构信息 -->

<template>
  <div class="taxProfessionInfo-container">
    <el-card>
      <el-row>
        <el-form class="from clearfix" ref="clientForm" :model="clientForm" :rules="rules" inline-message status-icon label-position="right"
          label-width="140px">
          <el-col :span="24">
            <div class="pro-title">机构信息</div>
            <el-form-item class="formLabel" label="统一社会信用代码" prop="creditCode">
              <el-input class="formInput" v-model="clientForm.creditCode" :disabled="viewDisabled" placeholder="请输入" clearable @change="search"
                @blur="search" maxlength="18" @keyup.native="search">
                <i class="el-icon-rep-xiazai5"></i>
              </el-input>
            </el-form-item>
            <div v-loading="loading" element-loading-text="正在查询机构信息，请稍等">
              <table>
                <tr>
                  <td class="labels">机构名称</td>
                  <td>
                    <span v-if="viewable">{{companyInfo.jgmc.length > 0 ? companyInfo.jgmc : '暂无'}}</span>
                    <el-input v-else class="projectInput" v-model="companyInfo.jgmc" placeholder="自动识别" :disabled="inputDisabled"></el-input>
                  </td>
                  <td class="labels">机构类别</td>
                  <td>
                    <span v-if="viewable">{{companyInfo.sszyfwjglbmc.length > 0 ? companyInfo.sszyfwjglbmc : '暂无'}}</span>
                    <el-input v-else class="projectInput" v-model="companyInfo.sszyfwjglbmc" placeholder="自动识别" :disabled="inputDisabled"></el-input>
                  </td>
                </tr>
                <tr>
                  <td class="labels">信用评分/评级</td>
                  <td>
                    <span v-if="viewable">{{companyInfo.xypf.length > 0 ? companyInfo.xypf : '暂无'}}</span>
                    <el-input v-else class="projectInput" v-model="companyInfo.xypf" placeholder="自动识别" :disabled="inputDisabled"></el-input>
                  </td>
                  <td class="labels">资产总额</td>
                  <td>
                    <span v-if="viewable">{{companyInfo.zcze.length > 0 ? companyInfo.zcze : '暂无'}}</span>
                    <el-input v-else class="projectInput" v-model="companyInfo.xypf" placeholder="自动识别" :disabled="inputDisabled"></el-input>
                  </td>
                </tr>
                <tr>
                  <td class="labels">从事涉税服务人员总数占比</td>
                  <td>
                    <span v-if="viewable">{{companyInfo.csssfwryszb.length > 0 ? companyInfo.csssfwryszb : '暂无'}}</span>
                    <el-input v-else class="projectInput" v-model="companyInfo.csssfwryszb" placeholder="自动识别" :disabled="inputDisabled"></el-input>
                  </td>
                  <td class="labels">登记注册类型</td>
                  <td>
                    <span v-if="viewable">{{companyInfo.djzclx_mc.length > 0 ? companyInfo.djzclx_mc : '暂无'}}</span>
                    <el-input v-else class="projectInput" v-model="companyInfo.djzclx_mc" placeholder="自动识别" :disabled="inputDisabled"></el-input>
                  </td>
                </tr>
                <tr>
                  <td class="labels">法定代表人</td>
                  <td>
                    <span v-if="viewable">{{companyInfo.fddbrmc.length > 0 ? companyInfo.fddbrmc : '暂无'}}</span>
                    <el-input v-else class="projectInput" v-model="companyInfo.fddbrmc" placeholder="自动识别" :disabled="inputDisabled"></el-input>
                  </td>
                  <td class="labels">法人手机号</td>
                  <td>
                    <span v-if="viewable">{{companyInfo.fddbryddh.length > 0 ? companyInfo.fddbryddh : '暂无'}}</span>
                    <el-input v-else class="projectInput" v-model="companyInfo.fddbryddh" placeholder="自动识别" :disabled="inputDisabled"></el-input>
                  </td>
                </tr>
                <tr>
                  <td class="labels">成立时间</td>
                  <td>
                    <span v-if="viewable">{{companyInfo.kyslrq.length > 0 ? companyInfo.kyslrq : '暂无'}}</span>
                    <el-input v-else class="projectInput" v-model="companyInfo.kyslrq" placeholder="自动识别" :disabled="inputDisabled"></el-input>
                  </td>
                  <td class="labels">服务状态</td>
                  <td>
                    <span v-if="viewable">{{companyInfo.fwzt.length > 0 ? companyInfo.fwzt : '暂无'}}</span>
                    <el-input v-else class="projectInput" v-model="companyInfo.fwzt" placeholder="自动识别" :disabled="inputDisabled"></el-input>
                  </td>
                </tr>
                <tr>
                  <td class="labels">机构地址</td>
                  <td class="rangetd" colspan="3">
                    <span v-if="viewable">{{companyInfo.scjydz.length > 0 ? companyInfo.scjydz : '暂无'}}</span>
                    <el-input v-else class="projectInput" v-model="companyInfo.scjydz" placeholder="自动带出" :disabled="inputDisabled"></el-input>
                  </td>
                </tr>
              </table>
              <div class="pro-title" style="margin:20px 0;">行政处罚情况</div>
              <div class="punish">
                <el-button plain icon="el-icon-plus" @click="add(1)">新增</el-button>
              </div>
              <el-table class="marginTop20" header-cell-class-name="reportRow" row-class-name="reportCol" :data="companyInfo.xzPunishList"
                fit style="width: 100%">
                <el-table-column label="序号" type="index" class-name="reportColumn" align="center" width="80">
                </el-table-column>
                <el-table-column label="处罚时间" prop="penaltyTime" class-name="reportColumn" align="center" width="280">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.state">{{ scope.row.penaltyTime }}</span>
                    <!-- <el-date-picker v-if="new" v-model="punishdate" type="date" placeholder="选择日期"> -->
                    <el-date-picker v-else v-model="scope.row.penaltyTime" placeholder="请选择日期" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="处罚说明" prop="penaltyExplain" class-name="reportColumn" align="center">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.state">{{ scope.row.penaltyExplain }}</span>
                    <!-- <el-input v-if="new" v-model="punishdetail" placeholder="请输入"></el-input> -->
                    <el-input v-else v-model="scope.row.penaltyExplain" placeholder="请输入"></el-input>
                  </template>1
                </el-table-column>
                <el-table-column label="操作" class-name="reportColumn" align="center" width="160">
                  <template slot-scope="scope">
                    <div class="delete">
                      <el-button type="text" style="margin-right: 10px;" @click="editone(scope.$index, scope.row)" v-if="!scope.row.state">编辑</el-button>
                      <el-button type="text" @click="deletepunish(scope.$index, scope.row)" v-if="!scope.row.state">删除</el-button>
                      <el-button type="text" style="margin-right: 10px;" @click="saveone(scope.$index, scope.row)" v-if="scope.row.state">保存</el-button>
                      <el-button type="text" @click="cancelone(scope.$index, scope.row)" v-if="scope.row.state">取消</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pro-title" style="margin:20px 0;">行业协会处罚情况</div>
              <div class="punish">
                <el-button plain icon="el-icon-plus" @click="add(2)">新增</el-button>
              </div>
              <el-table class="marginTop20" header-cell-class-name="reportRow" row-class-name="reportCol" :data="companyInfo.xhPunishList"
                fit style="width: 100%">
                <el-table-column label="序号" type="index" class-name="reportColumn" align="center" width="80">
                </el-table-column>
                <el-table-column label="处罚时间" prop="penaltyTime" class-name="reportColumn" align="center" width="280">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.state">{{ scope.row.penaltyTime }}</span>
                    <!-- <el-date-picker v-if="new" v-model="punishdate" type="date" placeholder="选择日期"> -->
                    <el-date-picker v-else v-model="scope.row.penaltyTime" placeholder="请选择日期" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="处罚说明" prop="penaltyExplain" class-name="reportColumn" align="center">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.state">{{ scope.row.penaltyExplain }}</span>
                    <!-- <el-input v-if="new" v-model="punishdetail" placeholder="请输入"></el-input> -->
                    <el-input v-else v-model="scope.row.penaltyExplain" placeholder="输入"></el-input>
                  </template>1
                </el-table-column>
                <el-table-column label="操作" class-name="reportColumn" align="center" width="160">
                  <template slot-scope="scope">
                    <div class="delete">
                      <el-button type="text" style="margin-right: 10px;" @click="editone(scope.$index, scope.row)" v-if="!scope.row.state">编辑</el-button>
                      <el-button type="text" @click="deletepunish(scope.$index, scope.row)" v-if="!scope.row.state">删除</el-button>
                      <el-button type="text" style="margin-right: 10px;" @click="saveone(scope.$index, scope.row)" v-if="scope.row.state">保存</el-button>
                      <el-button type="text" @click="cancelone(scope.$index, scope.row)" v-if="scope.row.state">取消</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-form>
      </el-row>
    </el-card>
    <el-button  @click="back">返回</el-button>
  </div>
</template>
<script>
  // import { enterMock } from '@/mock/mockData';
  import { TaxProfessionEntering } from '@/services/request';
  import { formatDate } from '@/common/js/date';

  export default {
    data() {
      return {
        loading: false,
        inputDisabled: true,
        viewDisabled: true,
        addone: true,
        viewable: true,
        ajaxing: '',
        companyInfo: {
          jgmc: '',
          sszyfwjglbmc: '',
          xypf: '',
          zcze: '',
          csssfwryszb: '',
          djzclx_mc: '',
          fddbrmc: '',
          fddbryddh: '',
          kyslrq: '',
          fwzt: '',
          scjydz: '',
          xzPunishList: [],
          xhPunishList: []
        },
        // new: false,
        punishdate: '',
        punishdetail: '',
        clientForm: {
          creditCode: '' // 统一社会信用代码
        },
        rules: {
          creditCode: [{
            validator: this.checkCreditCode,
            trigger: 'blur'
          }]
        }
      };
    },
    watch: {
      'clientForm.creditCode': function (curentVal, oldValue) {
        if (curentVal !== oldValue) {
          this.ajaxing = '';
        }
      }
    },
    mounted() {
      this.getDetail();
    },
    methods: {
      // 格式化时间
      conversionTime: function (time) {
        return formatDate(new Date(Number(time)), 'yyyy-MM-dd');
      },
      // 统一社会信用代码校验
      checkCreditCode: function (rule, value, callback) {
        let reg = /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/g;
        if (value === '') {
          callback(new Error('统一社会信用代码不能为空'));
        } else if (!value.match(reg)) {
          this.inputDisabled = true;
          setTimeout(() => {
            callback(new Error('请输入正确的统一社会信用代码'));
          }, 500);
        } else {
          // this.getDetail(value);
          setTimeout(() => {
            callback();
          }, 500);
        }
      },
      search: function () {
        // debugger
        if (this.clientForm.creditCode === this.ajaxing) {
          return false;
        } else {
          this.loading = true;
          let reg = /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/g;
          if (this.clientForm.creditCode && this.clientForm.creditCode.match(reg)) {
            TaxProfessionEntering.taxenteringsearch(this.clientForm.creditCode).then(res => {
              this.loading = false;
              if (res.code === 0) {
                this.inputDisabled = true;
                if (res.data.xypf.length === 0) {
                  res.data.xypf = '暂无';
                }
                if (res.data.gszgswj_dm.length === 0) {
                  res.data.gszgswj_dm = '暂无';
                }
                this.companyInfo = res.data;
                this.ajaxing = res.data.tyshxydm;
              } else {
                this.loading = false;
                window.Alert(res.msg);
              }
            })
          } else {
            this.loading = false;
            this.companyInfo = {
              jgmc: '',
              sszyfwjglbmc: '',
              xypf: '',
              zcze: '',
              csssfwryszb: '',
              djzclx_mc: '',
              fddbrmc: '',
              fddbryddh: '',
              kyslrq: '',
              fwzt: '',
              scjydz: '',
              xzPunishList: [],
              xhPunishList: []
            }
          }
        }
      },
      // 获取委托方信息,如果查询不到信息则手动输入
      getDetail: function () {
        // 根据id判断是添加还是查看
        if (this.$route.params.id === '0') {
          this.viewable = false;
          this.viewDisabled = false;
          this.loading = false;
          this.companyInfo = {
            jgmc: '',
            sszyfwjglbmc: '',
            xypf: '',
            zcze: '',
            csssfwryszb: '',
            djzclx_mc: '',
            fddbrmc: '',
            fddbryddh: '',
            kyslrq: '',
            fwzt: '',
            scjydz: '',
            xzPunishList: [],
            xhPunishList: []
          }
        } else {
          this.viewable = true;
          this.viewDisabled = true;
          this.clientForm.creditCode = this.$route.params.code;
          this.loading = true;
          TaxProfessionEntering.taxenteringdetail(this.$route.params.id, this.$route.params.code).then(res => {
            this.loading = false;
            if (res.code === 0) {
              this.inputDisabled = true;
              this.companyInfo = res.data;
            } else if (res.code === -1) {
              window.Warning(res.msg);
              this.inputDisabled = false;
            } else {
              window.Alert(res.msg);
            }
          })
            // .catch(error => {
            //   this.loading = false;
            //   console.log(error);
            // });
        }
      },
      // 添加
      add: function (type) {
        if (this.addone && this.companyInfo.tyshxydm) {
          if (type === 1) {
            this.companyInfo.xzPunishList.push({ state: true, penaltyType: '1' });
          } else if (type === 2) {
            this.companyInfo.xhPunishList.push({ state: true, penaltyType: '2' });
          }
          this.addone = false;
        }
      },
      // 删除
      deletepunish($index, row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (row.penaltyType === '3') {
            window.Alert('不可删除');
          } else {
            TaxProfessionEntering.taxenteringdelete(row.tyshxydm, row.penaltyType, row.penaltyId).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                if (row.penaltyType === '1') {
                  this.companyInfo.xzPunishList.splice($index, 1);
                } else if (row.penaltyType === '2') {
                  this.companyInfo.xhPunishList.splice($index, 1);
                }
                this.search();
                // this.ajaxing = '';
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败!'
                });
              }
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 编辑
      editone($index, row) {
        if (row.penaltyType === '3') {
          window.Alert('不可编辑');
        } else {
          if (row.penaltyType === '1') {
            this.$set(this.companyInfo.xzPunishList[$index], 'state', true);
          } else if (row.penaltyType === '2') {
            this.$set(this.companyInfo.xhPunishList[$index], 'state', true);
          }
        }
      },
      // 保存
      saveone($index, row) {
        // 判断是否为空
        if (row.penaltyTime && row.penaltyExplain) {
          // 新增保存
          if (row.penaltyId === undefined || row.penaltyId === '') {
            let para = {
              penaltyExplain: row.penaltyExplain,
              penaltyTime: row.penaltyTime,
              penaltyType: row.penaltyType,
              tyshxydm: this.companyInfo.tyshxydm,
              jgmc: this.companyInfo.jgmc,
              rpId: this.companyInfo.rpId,
              gszgswj_dm: this.gszgswj_dm
            }
            TaxProfessionEntering.taxenteringadd(para).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                });
                this.search();
              } else {
                this.$message({
                  type: 'error',
                  message: '添加失败!'
                });
              }
              this.addone = true;
              if (row.penaltyType === '1') {
                this.$set(this.companyInfo.xzPunishList[$index], 'state', false);
              } else if (row.penaltyType === '2') {
                this.$set(this.companyInfo.xhPunishList[$index], 'state', false);
              }
            })
          } else {
            // 修改保存
            let params = {
              penaltyExplain: row.penaltyExplain,
              penaltyTime: row.penaltyTime,
              penaltyType: row.penaltyType,
              penaltyId: String(row.penaltyId)
            }
            TaxProfessionEntering.taxenteringedit(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                this.search();
              } else {
                this.$message({
                  type: 'error',
                  message: '修改失败!'
                });
              }
              this.addone = true;
              if (row.penaltyType === '1') {
                this.$set(this.companyInfo.xzPunishList[$index], 'state', false);
              } else if (row.penaltyType === '2') {
                this.$set(this.companyInfo.xhPunishList[$index], 'state', false);
              }
            })
          }
        } else {
          this.addone = false;
          window.Alert('不能为空');
        }
      },
      // 取消
      cancelone($index, row) {
      // 新增取消
        if (row.penaltyExplain === undefined || row.penaltyTime === undefined) {
          if (row.penaltyType === '1') {
            this.companyInfo.xzPunishList.splice($index, 1);
          } else if (row.penaltyType === '2') {
            this.$set(this.companyInfo.xhPunishList[$index], 'state', false);
          }
        } else {
      // 编辑取消
          if (row.penaltyType === '1') {
            this.$set(this.companyInfo.xzPunishList[$index], 'state', false);
          } else if (row.penaltyType === '2') {
            this.$set(this.companyInfo.xhPunishList[$index], 'state', false);
          }
        }
        this.addone = true;
        this.search();
      },
      back() {
        this.$router.push({ path: '/TaxProfessionEntering' });
      }
    }
  };
</script>
<style lang="stylus">
  @import './index.styl';
</style>