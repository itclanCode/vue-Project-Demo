<template>
  <div class="modify-item-2">
    <ModTop active="2" :desc="desc" />
    <div class="table-container" v-loading="loading">
      <div class="table-header">
        <div class="table-row" v-for="item in tableHeader" :key="item.id">{{item.name}}</div>
      </div>
      <div class="table-body">
        <div class="table-left">
          <div class="list-1" v-for="(item, idx) in _constant.Modify2_CONTENT.jsyj_Arr" :key="idx">
            {{item}}
          </div>
        </div>
        <div class="table-right">
          <div class="table-project">
            <div class="table-col">
              <div class="table-row" v-for="(item, idx) in _constant.Modify2_CONTENT.jsjs_Arr" :key="idx">
                <p>{{item}}</p>
              </div>
            </div>
          </div>
          <div class="table-form">
            <div class='table-col'>
              <div class="table-row" v-for="(item, idx) in _constant.Modify2_CONTENT.xgmjs_Arr" :key="idx">
                <p>{{item}}</p>
              </div>
            </div>
            <div class="table-col" v-for="(item, col) in tableDataTemplate" :key="col">
              <div class="table-row" v-for="(value, key, index) in item" :key="index">
                <div v-if="isEdit === 0">
                  <p>
                    <el-input :disabled="isDisabled(key)" @blur="changeVal(item, key, $event)" :value="Number(item[key]).toFixed(2)" />
                  </p>
                  <span v-if="key==='a3'||key==='a11'" class="error">{{errorMsg[`${key}`]}}</span>
                </div>
                <p v-else>{{Number(item[key]).toFixed(2)}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModTop from './ModTop';
export default {
  name: 'modify-item2',
  components: { ModTop },
  props: ['desc', 'vatSmallscaleFbFlzlDos'],
  data () {
    return {
      loading: false,
      vatSmallscaleFbData: this.vatSmallscaleFbFlzlDos,
      errorMsg: {},
      newErrorMsg: {
        'a3': '3≤1+2之和，且3≤5',
        'a11': '11≤9+10之和，且11≤13'
      },
      tableHeader: [
        { name: '栏目', id: 0 },
        { name: '栏次', id: 1 },
        { name: '金额', id: 2 },
      ],
      formData: {},
      isEdit: 0 // 0 可编辑，1查看
    }
  },
  mounted () {
    let type = this.$route.params.type * 1;
    this.isEdit = type;
    let tableData = this.vatSmallscaleFbFlzlDos;
    let keys = [];
    let value = [];
    let nowCurentColl = {};
    tableData.map((item) => {
      keys = Object.keys(item);
      value = Object.values(item);
    })
    this.initChangeVal(() => {
      for (let j = 0; j < keys.length; j++) {
        nowCurentColl[keys[j]] = value[j];
      }
      this.changeVal(nowCurentColl);
    })
  },
  computed: {
    tableDataTemplate: function () {
      let tableData = this.vatSmallscaleFbFlzlDos;
      this.vatSmallscaleFbData = tableData;
      return tableData
    }
  },
  methods: {
    // 是否可编辑
    isDisabled (key) {
      let keyFlag = key === 'a4' || key === 'a6' || key === 'a7' || key === 'a8' || key === 'a12' || key === 'a14' || key === 'a15' || key === 'a16';
      if (keyFlag) {
        return true
      } else {
        return false
      }
    },
    initChangeVal (callbacks) {
      callbacks();
    },
    changeVal (curentCol, key, event) {
      let target = null;
      let value = null;
      let formData = {};
      let tableData = [];
      if (event !== undefined) {
        target = event.target || event.srcElement;
        value = target.value;
        value = isNaN(value) ? '0.00' : (value * 1).toFixed(2);
        curentCol[key] = value; // 重新赋值当前的值
        formData = this.formData;
        tableData = this.vatSmallscaleFbFlzlDos;
        this.vatSmallscaleFbData = tableData.map((item, col) => {
          if (curentCol === item) {
            formData = {};
            formData = curentCol;
            item = curentCol;
          }
          return item
        })
      } else {
        formData = curentCol;
        this.vatSmallscaleFbData = tableData.map((item, col) => {
          item = curentCol;
          return item
        })
      }
      this.errorMsg = { ...curentCol };
      this.ruleCol(this.errorMsg, formData, value);
    },
    // 规则校验
    ruleCol (errorMsg, formData, value) {
      let nowCurentColl = formData;
      let sum12 = nowCurentColl['a1'] * 1 + nowCurentColl['a2'] * 1;
      let sum910 = nowCurentColl['a9'] * 1 + nowCurentColl['a10'] * 1;
      if ((nowCurentColl['a3'] * 1 > sum12) || (nowCurentColl['a3'] * 1 > nowCurentColl['a5'] * 1)) {
        this.newErrorMsg['a3'] = '3≤1+2之和，且3≤5';
        errorMsg = { ...this.newErrorMsg };
      } else {
        this.newErrorMsg['a3'] = '';
        errorMsg = { ...this.newErrorMsg };
      }
      if ((nowCurentColl['a11'] * 1 > sum910) || (nowCurentColl['a11'] * 1 > nowCurentColl['a13'] * 1)) {
        this.newErrorMsg['a11'] = '11≤9+10之和，且11≤13';
        errorMsg = { ...this.newErrorMsg };
      } else {
        this.newErrorMsg['a11'] = '';
        errorMsg = { ...this.newErrorMsg };
      }
      this.errorMsg = Object.create(errorMsg);
      nowCurentColl['a4'] = sum12 - nowCurentColl['a3'] * 1;
      nowCurentColl['a6'] = nowCurentColl['a3'];
      nowCurentColl['a7'] = nowCurentColl['a5'] * 1 - nowCurentColl['a6'] * 1;
      nowCurentColl['a8'] = nowCurentColl['a7'] * 1 / 1.03;
      nowCurentColl['a12'] = sum910 - nowCurentColl['a11'];
      nowCurentColl['a14'] = nowCurentColl['a11'];
      nowCurentColl['a15'] = nowCurentColl['a13'] * 1 - nowCurentColl['a14'] * 1;
      nowCurentColl['a16'] = nowCurentColl['a15'] * 1 / 1.05;
    }
  }
}
</script>
<style lang="stylus" scoped>
.table-container {
  width: 100%;
  height: 100%;
  margin-bottom: 12px;
  clear: both;
  text-align: left;
  overflow: hidden;
  border: 1px solid #d8d0d03b;

  .table-header {
    width: 100%;
    overflow: hidden;
    background: #5c8fff;
    color: #fff;
    text-align: center;
    line-height: 40px;

    div.table-row {
      display: inline-block;
      border-right: 1px solid #e5e5e5;

      &:nth-of-type(1) {
        width: 50%;
      }

      &:nth-of-type(2) {
        width: 23%;
      }

      &:nth-of-type(3) {
        width: 23%;
        border: none;
      }
    }
  }

  .table-body {
    width: 100%;
    text-align: right;
    position: relative;

    .table-left, .table-right {
      display: inline-block;
      font-size: 13px;
    }

    .table-left {
      width: 24%;
      height: 100%;
      position: absolute;
      text-align: left;
      left: 0px;
      top: 0;
      background: #eff6ff;
      border-right: 1px solid #e5e5e5;

      .list-1 {
        padding: 27.8% 10px;
        border-bottom: 1px solid #e5e5e5;
      }

      @media only screen and (min-width: 1620px) {
        .list-1 {
          padding: 20.5% 10px;
        }
      }
    }

    .table-right {
      width: 76%;
      text-align: left;

      .table-project, .table-form {
        display: inline-block;

        span.error {
          position: relative;
          padding-left: 15%;
          bottom: -6px;
        }

        div.table-col {
          border-right: 1px solid #e5e5e5;

          div.table-row {
            height: 53px;
            border-bottom: 1px solid #e5e5e5;
            position: relative;

            p {
              position: relative;
              top: 5px;
              font-size: 13px;
              padding: 0px 10px;
              line-height: 32px;
            }
          }
        }
      }

      .table-project {
        width: 36.8%;
        height: 100%;
        vertical-align: top;
      }

      .table-form {
        width: 62.6%;
        height: 100%;

        .table-col {
          &:nth-of-type(1) {
            width: 47.7%;
          }

          &:nth-of-type(2) {
            width: 51.2%;
          }

          display: inline-block;

          .table-row {
            .el-input {
              width: 74%;
              margin-left: 13%;
            }
          }
        }
      }
    }
  }
}
</style>
