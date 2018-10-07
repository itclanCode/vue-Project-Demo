<template>
  <div class="modify-item-1">
    <ModTop active="1" :desc="desc" />
    <div class="table-container" v-loading="loading" element-loading-text="正在加载数据...">
      <div class="table-header">
        <div class="table-row">
          <div class="table-col-25">项目</div>
          <div class="table-col-25" style="width:154px;">栏次</div>
          <div class="table-col-25">
            <div class="table-row">本期数</div>
            <div class="table-col-50">货物及劳务</div>
            <div class="table-col-50">服务、不动产和无形资产</div>
          </div>
          <div class="table-col-25">
            <div class="table-row">本年累计</div>
            <div class="table-col-50">货物及劳务</div>
            <div class="table-col-50">服务、不动产和无形资产</div>
          </div>
        </div>
      </div>
      <div class="table-body">
        <div class="table-left">
          <div class="list-1">计税依据</div>
          <div class="list-2">计税计算</div>
        </div>
        <div class="table-right">
          <div class="table-project">
            <div class="table-col">
              <div class="table-row" v-for="(item,id) in _constant.Modify_CONTENT.jsyj_Arr" :key="id">
                <div>{{item}}</div>
              </div>
            </div>
          </div>
          <div class="table-form">
            <div class="table-col">
              <div class="table-row" v-for="(item, id) in _constant.Modify_CONTENT.lc" :key="id">
                <div>{{item}}</div>
              </div>
            </div>
            <div class="table-col" v-for="(item, col) in vatSmallscaleDosData" :key="col" v-if="col!==4 || col!==5">
              <div class="table-row" v-for="(value, key, index) in item" :key="index">
                <div v-if="isEdit === 0">
                  <p v-if="col===0">
                    <span v-if="key==='a4'||key==='a5'||key==='a6'">-------</span>
                    <el-input v-else-if="key==='a9'&&key==='a15'||key==='a16'||key==='a17'||key==='a19'||key==='a20'||key==='a21'||key==='a22'||key==='a24'" :value="Number(value).toFixed(2)" :disabled="true"/>
                    <el-input v-else-if="gtgshBz==='Y'&&key==='a10'&&isZepto===false" :disabled="true" :value="Number(value).toFixed(2)"/>
                    <el-input v-else-if="gtgshBz==='N'&&key==='a11'&&isZepto===false" :disabled="true" :value="Number(value).toFixed(2)"/>
                    <el-input v-else :disabled="desc.flbz === 'B'" :value="Number(value).toFixed(2)" @blur="changeVal(item, key, $event, col)"/>
                    <span class='error' v-if="desc.flbz!=='B'">{{errorMsg1[key]}}</span>
                  </p>
                  <p v-if="col===1 && (key !=='a25' && key!=='a26' && key!=='a27')">
                    <span v-if="key==='a7'||key==='a8'">-------</span>
                    <el-input v-else-if="gtgshBz==='Y' && key==='a10' && isZepto===false" :disabled="true" value="0.00" />
                    <el-input v-else-if="gtgshBz==='N' && key==='a11' && isZepto === false" :disabled="true" value="0.00" />
                     <el-input v-else-if="key==='a9'&&key==='a15'||key==='a16'||key==='a17'||key==='a19'||key==='a20'||key==='a21'||key==='a22'||key==='a24'" :disabled="true" :value="Number(value).toFixed(2)" />
                    <el-input v-else :disabled="desc.flbz === 'A'" :value="Number(value).toFixed(2)"  @blur="changeVal(item, key, $event, col)"/>
                    <span class='error' v-if="desc.flbz!=='A'">{{errorMsg2[`${key}`]}}</span>
                  </p>
                  <p v-if="col===2 && (key !=='a25' && key!=='a26' && key!=='a27')">
                    <span>{{(Number(item[key]).toFixed(2))}}</span>
                    <span class='error'></span>
                  </p>
                  <p v-if="col===3 && (key !=='a25' && key!=='a26' && key!=='a27')">
                    <span>{{(Number(item[key]).toFixed(2))}}</span>
                    <span class='error'></span>
                  </p>
                </div>
                <div v-else>{{(Number(item[key]).toFixed(2))}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import util from '@/common/js/util';
import ModTop from './ModTop';
export default {
  name: 'modify-item-1',
  components: { ModTop },
  props: ['desc', 'loading', 'vatSmallscaleDos', 'gtgshBz'],
  data () {
    return {
      formData: {},
      vatSmallscaleDosData: this.vatSmallscaleDos,
      errorMsg1: {}, // 货物及劳务提示信息
      errorMsg2: {}, // 服务，不动产提示信息
      contentCol3: {},
      contentCol4: {},
      contentCol5: {}, // 累计
      contentCol6: {}, // 累计
      newMessage: {
        1: {
          a1: '第1栏>=第2栏+第3栏',
          a7: '第7栏>=第8栏',
          a13: '第13栏>=第14栏',
          a23: '该值不能大于初始值1.5倍'
        },
        2: {
          a1: '第1栏>=第2栏+第3栏',
          a4: '第4栏>=第5栏+第6栏',
          a13: '第13栏>=第14栏',
          a23: '该值不能大于初始值1.5倍'
        }
      },
      isEdit: 0, // 0 可编辑 1 查看,
      isZepto: false, // 起征点税判断,
      benqiCashed: 0, // 初始本期额
      testFlag: false
    }
  },
  mounted () {
    let type = this.$route.params.type * 1; // 0 修改 1 查看
    this.isEdit = type;
  },
  watch: {
    vatSmallscaleDosData: function(nVal, oldVal) {
      this.vatSmallscaleDosData = nVal;
    }
  },
  updated () {
    this.vatSmallscaleDosData = this.vatSmallscaleDos;
  },
  computed: {
    tableData: function () {
      let vatSmallscaleDos = this.vatSmallscaleDos || [];
      vatSmallscaleDos.map((item, idx) => {
        switch (idx) {
          case 0:
            if (item.hasOwnProperty('a23')) {
              this.benqiCashed = item['a23'] * 1
            };
            break;
          case 1:
            if (item.hasOwnProperty('a23')) {
              this.benqiCashed = item['a23'] * 1
            };
            break;
          case 2: ; break;
          case 4: ; break;
          default: break;
        }
      })
      this.vatSmallscaleDosData = vatSmallscaleDos
      return this.vatSmallscaleDosData
    }
  },
  methods: {
    // 修改表单的值
    changeVal (curentCol, idx, event, cell) {
      let target = event.target || event.srcElement;
      let value = target.value;
      let formData = this.formData;
      let tcell = cell + 1;
      let tableData = this.vatSmallscaleDosData;
      value = isNaN(value) ? '0.00' : (value * 1).toFixed(2);
      curentCol[idx] = value;
      this.vatSmallscaleDosData = tableData.map((items, col) => {
        if (curentCol === items) {
          formData = {}; // 初始化清空所有信息
          formData[cell] = curentCol;
          items = curentCol;
        }
        if (col === 2) {
          this.contentCol3 = items;
          items = this.contentCol3;
        }
        if (col === 3) {
          this.contentCol4 = items;
          items = this.contentCol4;
        }
        if (col === 4) {
          this.contentCol5 = items;
          items = this.contentCol5;
        }
        if (col === 5) {
          this.contentCol6 = items;
          items = this.contentCol6;
        }
        return items
      });
      if (tcell === 1 || tcell === 2) {
        this[`errorMsg${tcell}`] = { ...curentCol };
        this[`ruleCol${tcell}`](this[`errorMsg${tcell}`], formData, value, tcell);
      }
    },
    // 第二列表单校验
    ruleCol2 (errorMsg, formData, value, col) {
      let nowCurentColl = null;
      let contentCol4 = this.contentCol4;
      let contentCol6 = {...this.contentCol6};
      for (let key in formData) {
        nowCurentColl = formData[key];
        for (let j in nowCurentColl) {
          contentCol4[j] = nowCurentColl[j] * 1 + contentCol6[j] * 1;
        }
        if (nowCurentColl['a4'] * 1 < nowCurentColl['a5'] * 1 + nowCurentColl['a6'] * 1) {
          this.newMessage[col]['a4'] = '第4栏>=第5栏+第6栏';
          errorMsg = { ...this.newMessage[col] };
        } else {
          this.newMessage[col]['a4'] = '';
          errorMsg = { ...this.newMessage[col] };
        }
        // 税控器具开具的普通发票不含税销售额
        let initVal = nowCurentColl['a1'] * 1 + nowCurentColl['a7'] * 1 + nowCurentColl['a9'] * 1 + nowCurentColl['a13'];
        if (initVal < nowCurentColl['a27'] * 1) {
          this.isZepto = true;
        } else {
          this.isZepto = false;
        }
      }
      errorMsg = { ...this.commonRule(nowCurentColl, value, col) };
      this[`errorMsg${col}`] = { ...errorMsg };
    },
    // 第一列表单校验
    ruleCol1 (errorMsg, formData, value, col) {
      let nowCurentColl = null;
      let contentCol3 = this.contentCol3;
      let contentCol5 = {...this.contentCol5};
      for (let key in formData) {
        nowCurentColl = formData[key];
        for (let j in nowCurentColl) {
          contentCol3[j] = nowCurentColl[j] * 1 + contentCol5[j] * 1; // 累计数
        }
        if (nowCurentColl['a7'] * 1 < nowCurentColl['a8'] * 1) {
          this.newMessage[col]['a7'] = '第7栏>=第8栏';
          errorMsg = { ...this.newMessage[col] };
        } else {
          this.newMessage[col]['a7'] = '';
          errorMsg = { ...this.newMessage[col] };
        }
      }
      errorMsg = { ...this.commonRule(nowCurentColl, value, col) };
      this[`errorMsg${col}`] = { ...errorMsg };
    },
    commonRule (nowCurentColl, value, col) {
      let errorMesg = null;
      if (nowCurentColl['a1'] * 1 < nowCurentColl['a2'] * 1 + nowCurentColl['a3'] * 1) {
        this.newMessage[col]['a1'] = '第1栏>=第2栏+第3栏';
        errorMesg = { ...this.newMessage[col] };
      } else {
        this.newMessage[col]['a1'] = '';
        errorMesg = { ...this.newMessage[col] };
      }
      // （五）出口免税销售额
      if (nowCurentColl['a13'] < nowCurentColl['a14']) {
        this.newMessage[col]['a13'] = '第13栏>=第14栏';
        errorMesg = { ...this.newMessage[col] }
      } else {
        this.newMessage[col]['a13'] = '';
        errorMesg = { ...this.newMessage[col] };
      }
      // 本期预缴税额
      let t = this.benqiCashed * 1.5;
      if (value > t) {
        this.newMessage[col]['a23'] = '该值不能大于初始值1.5倍';
        errorMesg = { ...this.newMessage[col] }
      } else {
        this.newMessage['a23'] = '';
        nowCurentColl['a24'] = Number(nowCurentColl['a22']) - Number(nowCurentColl['a23']);
        errorMesg = { ...this.newMessage[col] };
      }
      return errorMesg
    },
    // 获取缓存
    setCacheData () {
      this.vatSmallscaleDosData = util.storage('modifyItem1');
    }
  }
}
</script>
<style lang="stylus" scoped>
.table-container {
  width: 100%;
  height: 100%;
  margin-bottom: 12px;
  text-align: center;
  clear: both;
  overflow: hidden;
  border: 1px solid #d8d0d03b;

  .table-header {
    width: 100%;
    height: 80px;
    overflow: hidden;
    background: #5c8fff;
    color: #fff;
    line-height: 40px;

    .table-row {
      width: 100%;
      display: block;
      overflow: hidden;
      position: relative;

      .table-col-25 {
        display: inline-block;
        width: 28%;
        padding: 20px 0px;
        vertical-align: top;
        border-right: 1px solid #d8d0d03b;

        &:last-child {
          border-right: none;
        }

        .table-row {
          width: 108%;
          display: inline-block;
          vertical-align: top;
          margin-top: -16px;
          border-bottom: 1px solid #d8d0d03b;
          margin-left: -4px;
        }

        .table-col-50 {
          width: 48%;
          float: left;
          margin-top: -15px;
          border-right: 1px solid #d8d0d03b;

          &:last-child {
            border-right: none;
            padding-left: 5px;
          }
        }
      }
    }
  }

  .table-body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: right;
    position: relative;

    .table-right, .table-left {
      display: inline-block;
    }

    .table-left {
      width: 7.6%;
      height: 100%;
      font-size: 13px;
      position: absolute;
      left: 0;
      top: 0;

      .list-1, .list-2 {
        display: inline-block;
        width: 100%;
        float: left;
        text-align: center;
        background: rgba(239, 246, 255, 1);
        border-right: 1px solid #e5e5e5;

        p {
          display: inline-block;
        }
      }

      .list-1 {
        padding: 519.2% 0;
      }

      .list-2 {
        border-top: 1px solid #e5e5e5;
        padding: 370% 0;
      }
    }

    .table-right {
      width: 92.4%;
      overflow: hidden;
      position: relative;
      text-align: left;

      .table-project, .table-form {
        display: inline-block;

        div.table-col {
          border-right: 1px solid #e5e5e5;
          vertical-align: top;

          div.table-row {
            height: 63px;
            border-bottom: 1px solid #e5e5e5;

            >div {
              position: relative;
              top: 10px;
              font-size: 13px;
              padding: 0px 6px;
              line-height: 22px;

              >p {
                >span:first-child {
                  padding-left: 10px;
                }
              }
            }
          }
        }
      }

      .table-form {
        width: 78%;
        position: absolute;
        top: 0;

        div.table-col {
          display: inline-block;

          &:nth-of-type(1) {
            width: 19.4%;
          }

          &:nth-of-type(2) {
            width: 18.5%;
          }

          &:nth-of-type(3) {
            width: 20%;
          }

          &:nth-of-type(4) {
            width: 19.3%;
          }

          &:nth-of-type(5) {
            width: 20.5%;
          }
        }
      }

      .table-project {
        width: 22.8%;
      }
    }
  }
}

@media only screen and (min-width: 1620px) {
  .table-container {
    .table-body {
      .table-right {
        .table-form {
          width: 76.1%;

          div.table-col {
            &:nth-of-type(1) {
              width: 14.8%;
            }

            &:nth-of-type(2) {
              width: 19.4%;
            }

            &:nth-of-type(3) {
              width: 20.6%;
            }

            &:nth-of-type(4) {
              width: 19.5%;
            }

            &:nth-of-type(5) {
              width: 23.5%;
            }
          }
        }

        .table-project {
          width: 24.8%;
        }
      }
    }
  }
}
</style>
