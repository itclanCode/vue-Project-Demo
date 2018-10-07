<!-- Created by qintengbo on 2018/05/11. -->
<!-- 财务报表批量报送 -->

<template>
  <div class="financial">
    <div class="fin-main">
      <el-row>
        <el-col :span="24" class="header-col">
          <el-menu
            class="reportmenu"
            :default-active="activeIndex"
            mode="horizontal"
            active-text-color="#4680ff"
            @select="listSelect">
            <el-menu-item index="1">未报送 ({{ tableData.notSubCount }})</el-menu-item>
            <el-menu-item index="3">报送失败 ({{ tableData.failedCount }})</el-menu-item>
            <el-menu-item index="2">已报送 ({{ tableData.subCount }})</el-menu-item>
          </el-menu>
        </el-col>
        <div class="downLoadCon">
          <span class="fin-tps">本系统暂时只提供表样中三类会计报表的报送</span>
          <el-dropdown @command="getFileTemplate">
            <el-button type="primary">
              <i class="el-icon-document"></i>
              参考表样下载 
              <i class="el-icon-rep-f11-copy"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item 
                v-for="item in fileList"
                :key="item.fileId"
                :command="item.fileId"
              >
                {{ item.fileName }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-row>
      <el-row class="dateCon">
        <el-col :span="17">
          <span>所属期：</span> 
          <span class="dateColor">{{ genus[0] }}</span> 至 
          <span class="dateColor">{{ genus[1] }}</span>
        </el-col>
        <el-col :span="7" class="col-search">
          <el-input 
            class="search" 
            v-model="inputValue"
            clearable
            @clear="getFincialData(listParams)"
            @keyup.enter.native="getFincialData(listParams)"
            placeholder="请输入纳税人名称或统一社会信用代码"
          >
            <i slot="suffix" @click="getFincialData(listParams)" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
      </el-row>
      <el-row class="operation-con" v-if="state != 2">
        <el-checkbox
          v-model="allChecked"
          class="finChecked"
          @change="toggleSelection(tableData.declares)"
        >
          全选
        </el-checkbox>
        <el-button 
          class="finBtn" 
          @click="batchSubmit" 
          type="primary"
        >
          <i class="el-icon-rep-zhifeiji"></i> 
          批量报送
        </el-button>
      </el-row>
      <el-card>
        <el-row>
          <el-col :span="24">
            <el-table
              ref="multipleTable"
              :data="tableData.declares"
              fit
              v-loading="loading"
              :element-loading-text="loadingText"
              header-cell-class-name="headerBack"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                :selectable="checkedDisabled"
                align="center"
                v-if="state != 2"
                key="a"
                width="55">
              </el-table-column>
              <el-table-column
                type="index"
                label="序号"
                align="center"
                key="b"
                width="50">
              </el-table-column>
              <el-table-column
                prop="wtrmc"
                align="center"
                key="c"
                width="300%"
                label="企业名称">
              </el-table-column>
              <el-table-column
                align="center"
                key="d"
                label="适用会计制度">
                <template slot-scope="scope">
                  <el-select 
                    v-if="state != 2"
                    v-model="scope.row.zlbsxlDm" 
                    @change="selectChange(scope.row.cwbbxh, scope.row.zlbsxlDm)"
                    placeholder="请选择会计制度"
                  >
                    <el-option
                      v-for="(value, key) in _constant.COMPANYACCOUNT_TYPE"
                      :key="key"
                      :label="value"
                      :value="key">
                    </el-option>
                  </el-select>
                  <span v-if="state == 2">{{ _constant.COMPANYACCOUNT_TYPE[scope.row.zlbsxlDm] }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="状态"
                key="e"
                align="center"
                width="180">
                <template slot-scope="scope">
                  <span>{{ _constant.FINCIAL_STATUS[scope.row.state] }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="填报日期"
                align="center"
                key="f"
                width="180"
                v-if="state == 2"
              >
                <template slot-scope="scope">
                  <span>{{ dateFormat(scope.row.slrq) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                key="g"
                align="center">
                <template slot-scope="scope">
                  <el-upload
                    v-if="state != 2"
                    class="upload"
                    :action="action"
                    :data="uploadFileData"
                    accept=".xlsx, .xls"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :disabled="scope.row.zlbsxlDm == ''"
                    :on-success="onSuccess"
                    :on-error="onError"
                    name="file"
                    >
                    <el-button 
                      type="text" 
                      @click="importFile(scope.$index, scope.row)"
                      :disabled="scope.row.zlbsxlDm == ''"
                    >
                      导入
                      </el-button>
                  </el-upload>
                  <el-button
                    type="text"
                    :disabled="scope.row.zlbsxlDm == ''"
                    @click="seeInfo(scope.$index, scope.row)"
                    v-if="state != 2"
                  >
                    修改报表
                  </el-button>
                  <el-button
                    type="text"
                    :disabled="scope.row.zlbsxlDm == ''"
                    @click="seeInfo(scope.$index, scope.row)"
                    v-if="state == 2"
                  >
                    查看
                  </el-button>
                  <el-button
                    type="text"
                    @click="viewFail(scope.row.cwbbxh)"
                    v-if="state == 3"
                  >
                    失败原因
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row class="fin-fot">
          <el-col :span="24">
            <el-pagination
              background
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper, sizes"
              @current-change="currentChange"
              @size-change="sizeChange"
              :total="tableData.total">
            </el-pagination>
          </el-col>
        </el-row>
      </el-card>
    </div>
    
    <!-- 会计制度表格弹窗 -->
    <el-dialog 
      :visible.sync="dialogVisible" 
      fullscreen
      top="0"
      @close="dialogClose" 
      custom-class="fin-dialog">
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        @select="handleSelect">
        <el-menu-item index="1">资产负债表</el-menu-item>
        <el-menu-item index="2">利润表</el-menu-item>
      </el-menu>
      <el-main class="fin-wrap">
        <div class="company">
          <el-row>
            <el-col :span="24" class="com-title">
              {{ _constant.ACCOUNTTABLE_TYPE[currentView] }}
              ({{ _constant.ACCOUNTTABLE_TITLE[accountType] }})</el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="textCenter">所属期: 
              <span class="dateColor">{{ genus[0] }}</span> 至 
              <span class="dateColor">{{ genus[1] }}</span>
            </el-col>
          </el-row>
          <el-row class="marginTop20">
            <el-col :span="24">
              纳税人识别号: 
              <span class="fontWei">{{ creditCode }}</span>
            </el-col>
          </el-row>
          <el-row class="marginTop5">
            <el-col :span="12">
              纳税人名称: 
              <span class="fontWei">{{ companyName }}</span>
            </el-col>
            <el-col :span="12" class="textRight">
              报送日期: 
              <span class="fontWei">{{ submitDate }}</span>
            </el-col>
          </el-row>
          <el-row class="tableCon" v-if="currentView == '1'">
            <el-col :span="24">
              <el-table
                v-loading="loading"
                :element-loading-text="loadingText"
                class="marginTop5"
                :data="accountTableData.zcfzb"
                border
                fit
                header-cell-class-name="fin-headback"
                :cell-style="styleChange"
                style="width: 100%">
                <el-table-column
                  prop="zcxmmc"
                  label="资产"
                >
                </el-table-column>
                <el-table-column
                  prop="hcZc"
                  label="行次"
                  align="center"
                  :formatter="(row) => parseInt(row.hcZc) || ''"
                  width="80">
                </el-table-column>
                <el-table-column
                  label="期末余额"
                  v-if="accountType != 'ZL1001002'"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span 
                      v-if="scope.$index == 0 || (accountType == 'ZL1001001' && scope.$index == 15)"
                    >--</span>
                    <span v-else-if="(accountType == 'ZL1001001' && (scope.$index == 19 || scope.$index == 20 || scope.$index == 24 
                    || scope.$index == 31 || scope.$index == 32 || scope.$index == 33 || scope.$index == 36))
                    || (accountType == 'ZL1001003' && (scope.$index == 16))"></span>
                    <el-input
                      v-else 
                      type="tel"
                      v-model="scope.row.qmyeZc"
                      @focus="yeFocus($event, scope.$index, accountTableData.zcfzb, 'qmyeZc')"
                      @blur="yeBlur($event, scope.$index, accountTableData.zcfzb, 'qmyeZc')"
                      @keyup.native="yeKeyUp($event, scope.$index, accountTableData.zcfzb, 'qmyeZc')"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="accountType == 'ZL1001002'"
                  label="年初数"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span 
                      v-if="scope.$index == 0 || scope.$index == 18 || scope.$index == 28 || scope.$index == 34"
                    >--</span>
                    <span v-else-if="scope.$index == 33"></span>
                    <el-input
                      v-else 
                      type="tel"
                      v-model="scope.row.ncsZc"
                      @focus="yeFocus($event, scope.$index, accountTableData.zcfzb, 'ncsZc')"
                      @blur="yeBlur($event, scope.$index, accountTableData.zcfzb, 'ncsZc')"
                      @keyup.native="yeKeyUp($event, scope.$index, accountTableData.zcfzb, 'ncsZc')"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="年初余额"
                  v-if="accountType != 'ZL1001002'"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span 
                      v-if="scope.$index == 0 || (accountType == 'ZL1001001' && scope.$index == 15)"
                    >--</span>
                    <span v-else-if="(accountType == 'ZL1001001' && (scope.$index == 19 || scope.$index == 20 || scope.$index == 24 
                    || scope.$index == 31 || scope.$index == 32 || scope.$index == 33 || scope.$index == 36))
                    || (accountType == 'ZL1001003' && (scope.$index == 16))"></span>
                    <el-input 
                      v-else
                      type="tel"
                      v-model="scope.row.ncyeZc"
                      @focus="yeFocus($event, scope.$index, accountTableData.zcfzb, 'ncyeZc')"
                      @blur="yeBlur($event, scope.$index, accountTableData.zcfzb, 'ncyeZc')"
                      @keyup.native="yeKeyUp($event, scope.$index, accountTableData.zcfzb, 'ncyeZc')"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="期末数"
                  v-if="accountType == 'ZL1001002'"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span 
                      v-if="scope.$index == 0 || scope.$index == 18 || scope.$index == 28 || scope.$index == 34"
                    >--</span>
                    <span v-else-if="scope.$index == 33"></span>
                    <el-input 
                      v-else
                      type="tel"
                      v-model="scope.row.qmsZc"
                      @focus="yeFocus($event, scope.$index, accountTableData.zcfzb, 'qmsZc')"
                      @blur="yeBlur($event, scope.$index, accountTableData.zcfzb, 'qmsZc')"
                      @keyup.native="yeKeyUp($event, scope.$index, accountTableData.zcfzb, 'qmsZc')"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="qyxmmc"
                  label="负债和所有者权益(或股东权益)"
                >
                </el-table-column>
                <el-table-column
                  prop="hcQy"
                  label="行次"
                  :formatter="(row) => parseInt(row.hcQy) || ''"
                  align="center"
                  width="80">
                </el-table-column>
                <el-table-column
                  label="期末余额"
                  v-if="accountType != 'ZL1001002'"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span 
                      v-if="scope.$index == 0 || (accountType == 'ZL1001001' && (scope.$index == 16 || scope.$index == 29))"
                    >--</span>
                    <span v-else-if="(accountType == 'ZL1001001' && scope.$index == 40)
                    || (accountType == 'ZL1001003' && (scope.$index == 12 || scope.$index == 19 || scope.$index == 20 || scope.$index == 21 || scope.$index == 22
                    || scope.$index == 23 || scope.$index == 24 || scope.$index == 25))"></span>
                    <el-input 
                      v-else
                      type="tel"
                      v-model="scope.row.qmyeQy"
                      @focus="yeFocus($event, scope.$index, accountTableData.zcfzb, 'qmyeQy')"
                      @blur="yeBlur($event, scope.$index, accountTableData.zcfzb, 'qmyeQy')"
                      @keyup.native="yeKeyUp($event, scope.$index, accountTableData.zcfzb, 'qmyeQy')"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="年初数"
                  v-if="accountType == 'ZL1001002'"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span 
                      v-if="scope.$index == 0 || scope.$index == 16 || scope.$index == 23 || scope.$index == 27"
                    >--</span>
                    <span v-else-if="scope.$index == 26"></span>
                    <el-input 
                      v-else
                      type="tel"
                      v-model="scope.row.ncsQy"
                      @focus="yeFocus($event, scope.$index, accountTableData.zcfzb, 'ncsQy')"
                      @blur="yeBlur($event, scope.$index, accountTableData.zcfzb, 'ncsQy')"
                      @keyup.native="yeKeyUp($event, scope.$index, accountTableData.zcfzb, 'ncsQy')"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="年初余额"
                  v-if="accountType != 'ZL1001002'"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span 
                      v-if="scope.$index == 0 || (accountType == 'ZL1001001' && (scope.$index == 16 || scope.$index == 29))"
                    >--</span>
                    <span v-else-if="(accountType == 'ZL1001001' && scope.$index == 40)
                    || (accountType == 'ZL1001003' && (scope.$index == 12 || scope.$index == 19 || scope.$index == 20 || scope.$index == 21 || scope.$index == 22
                    || scope.$index == 23 || scope.$index == 24 || scope.$index == 25))"></span>
                    <el-input 
                      v-else
                      type="tel"
                      v-model="scope.row.ncyeQy"
                      @focus="yeFocus($event, scope.$index, accountTableData.zcfzb, 'ncyeQy')"
                      @blur="yeBlur($event, scope.$index, accountTableData.zcfzb, 'ncyeQy')"
                      @keyup.native="yeKeyUp($event, scope.$index, accountTableData.zcfzb, 'ncyeQy')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="期末数"
                  v-if="accountType == 'ZL1001002'"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span 
                      v-if="scope.$index == 0 || scope.$index == 16 || scope.$index == 23 || scope.$index == 27"
                    >--</span>
                    <span v-else-if="scope.$index == 26"></span>
                    <el-input 
                      v-else
                      type="tel"
                      v-model="scope.row.qmsQy"
                      @focus="yeFocus($event, scope.$index, accountTableData.zcfzb, 'qmsQy')"
                      @blur="yeBlur($event, scope.$index, accountTableData.zcfzb, 'qmsQy')"
                      @keyup.native="yeKeyUp($event, scope.$index, accountTableData.zcfzb, 'qmsQy')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row class="tableCon" v-if="currentView == '2'">
            <el-col :span="24">
              <el-table
                class="marginTop5"
                :data="accountTableData.lrb"
                border
                fit
                header-cell-class-name="fin-headback"
                :cell-style="profitStyleChange"
                style="width: 100%">
                <el-table-column
                  prop="hmc"
                  label="项目"
                  key="1"
                >
                </el-table-column>
                <el-table-column
                  prop="hc"
                  label="行次"
                  align="center"
                  v-if="accountType != 'ZL1001001'"
                  width="100"
                  key="2"
                >
                </el-table-column>
                <el-table-column
                  label="本期金额"
                  align="center"
                  v-if="accountType == 'ZL1001001'"
                  key="3"
                >
                  <template slot-scope="scope">
                    <el-input 
                      type="tel"
                      v-model="scope.row.bqje" 
                      @focus="yeFocus($event, scope.$index, accountTableData.lrb, 'bqje')"
                      @blur="yeBlur($event, scope.$index, accountTableData.lrb, 'bqje')"
                      @keyup.native="yeKeyUp($event, scope.$index, accountTableData.lrb, 'bqje')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="本月金额"
                  align="center"
                  key="4"
                  v-if="accountType == 'ZL1001003'"
                >
                  <template slot-scope="scope">
                    <el-input 
                      type="tel"
                      v-model="scope.row.byje" 
                      @focus="yeFocus($event, scope.$index, accountTableData.lrb, 'byje')"
                      @blur="yeBlur($event, scope.$index, accountTableData.lrb, 'byje')"
                      @keyup.native="yeKeyUp($event, scope.$index, accountTableData.lrb, 'byje')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="本月数"
                  align="center"
                  key="5"
                  v-if="accountType == 'ZL1001002'"
                >
                  <template slot-scope="scope">
                    <el-input 
                      type="tel"
                      v-model="scope.row.bys" 
                      @focus="yeFocus($event, scope.$index, accountTableData.lrb, 'bys')"
                      @blur="yeBlur($event, scope.$index, accountTableData.lrb, 'bys')"
                      @keyup.native="yeKeyUp($event, scope.$index, accountTableData.lrb, 'bys')"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="上期金额"
                  align="center"
                  key="6"
                  v-if="accountType == 'ZL1001001'"
                >
                  <template slot-scope="scope">
                    <el-input 
                      type="tel"
                      v-model="scope.row.sqje" 
                      @focus="yeFocus($event, scope.$index, accountTableData.lrb, 'sqje')"
                      @blur="yeBlur($event, scope.$index, accountTableData.lrb, 'sqje')"
                      @keyup.native="yeKeyUp($event, scope.$index, accountTableData.lrb, 'sqje')"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="本年累计数"
                  align="center"
                  v-if="accountType == 'ZL1001002'"
                  key="7"
                >
                  <template slot-scope="scope">
                    <el-input 
                      type="tel"
                      v-model="scope.row.bnljs" 
                      @focus="yeFocus($event, scope.$index, accountTableData.lrb, 'bnljs')"
                      @blur="yeBlur($event, scope.$index, accountTableData.lrb, 'bnljs')"
                      @keyup.native="yeKeyUp($event, scope.$index, accountTableData.lrb, 'bnljs')"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="本年累计金额"
                  align="center"
                  v-if="accountType == 'ZL1001003'"
                  key="8"
                >
                  <template slot-scope="scope">
                    <el-input 
                      type="tel"
                      v-model="scope.row.bnljje" 
                      @focus="yeFocus($event, scope.$index, accountTableData.lrb, 'bnljje')"
                      @blur="yeBlur($event, scope.$index, accountTableData.lrb, 'bnljje')"
                      @keyup.native="yeKeyUp($event, scope.$index, accountTableData.lrb, 'bnljje')"
                    ></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row class="tableCon" v-if="currentView == '2' && accountType == 'ZL1001002'">
            <div class="addTableTitle">补充资料</div>
            <el-col :span="24">
              <el-table
                class="marginTop5"
                :data="accountTableData.bczl"
                border
                fit
                header-cell-class-name="fin-headback"
                style="width: 100%"
              >
                <el-table-column
                  prop="hmc"
                  label="项目"
                  key="1"
                >
                </el-table-column>
                <el-table-column
                  label="本年累计数"
                  align="center"
                  key="2"
                >
                  <template slot-scope="scope">
                    <el-input 
                      type="tel"
                      v-model="scope.row.bys" 
                      @focus="yeFocus($event, scope.$index, accountTableData.lrb, 'bys')"
                      @blur="yeBlur($event, scope.$index, accountTableData.lrb, 'bys')"
                      @keyup.native="yeKeyUp($event, scope.$index, accountTableData.lrb, 'bys')"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="上年实际数"
                  align="center"
                  key="3"
                >
                  <template slot-scope="scope">
                    <el-input 
                      type="tel"
                      v-model="scope.row.bnljs" 
                      @focus="yeFocus($event, scope.$index, accountTableData.lrb, 'bnljs')"
                      @blur="yeBlur($event, scope.$index, accountTableData.lrb, 'bnljs')"
                      @keyup.native="yeKeyUp($event, scope.$index, accountTableData.lrb, 'bnljs')"
                    ></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-main>
      <div class="modal-fot">
        <template v-if="btnType != 2">
          <el-button type="primary" @click="save">暂存</el-button>
          <el-button type="success" @click="submit">报送</el-button>
        </template>
        <el-button type="info" @click="dialogClose">返回</el-button>
      </div>
    </el-dialog>

    <!-- 批量报送弹窗 -->
    <el-dialog
      width="30%"
      title="提示"
      :visible.sync="resDialogVisible"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <span>
        您本次报送条目数为 <span class="fin-blue">{{ allNum }}</span> 条，
        <span class="fin-blue">{{ successNum }}</span> 条报送成功，
        <span class="fin-blue">{{ failNum }}</span> 条报送失败。
      </span>
      <div v-if="failNum != 0" class="dialogFailText" @click="lookFail">查看失败原因 <i class="el-icon-arrow-right"></i></div>
      <span slot="footer">
        <el-button @click="continuePay">返回</el-button>
      </span>
    </el-dialog>

    <!-- 失败原因弹窗 -->
    <el-dialog
      class="failDialog"
      width="50%"
      title="失败原因"
      :visible.sync="failDialogVisible"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <p class="failText" v-for="item in failList">
        <i class="el-icon-rep-yuandianxiao fin-blue"></i>
        <span v-html="item"></span>
      </p>
      <span slot="footer">
        <el-button @click="continuePay">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getQuarterDate, formatDate } from '@/common/js/date';
import { fincialStateRequest } from '@/services/request';
import fileDownload from 'js-file-download';

export default {
  data() {
    return {
      loading: true,
      activeIndex: '1',
      resDialogVisible: false, // 批量报送弹窗
      failDialogVisible: false, // 失败原因弹窗
      allNum: 0, // 报送条数
      successNum: 0, // 报送成功条数
      failNum: 0, // 报送失败条数
      state: 1, // 列表状态
      genus: [], // 所属期
      submitDate: '', // 报送日期
      inputValue: '', // 查询字段
      allChecked: false, // 全选状态
      tableData: '', // 企业列表数据
      accountTableData: '', // 会计制度表格数据
      currentPage: 1, // 页码
      pageSize: 10, // 每页条数
      multipleSelection: [], // 全选数据
      dialogVisible: false, // 会计制度表格弹窗状态
      btnType: '', // 导入状态
      accountType: '', // 会计制度类型
      companyName: '', // 企业名称
      cwbbId: '', // 财务报表id
      creditCode: '', // 纳税人识别号
      currentView: '1',
      loadingText: '正在加载数据',
      fileList: [], // 财务报表模板数据
      action: '', // 上传文件地址
      uploadFileData: {
        cwbbxh: ''
      },
      listParams: {
        ssqq: '',
        ssqz: '',
        key: '',
        pageNum: '',
        pageSize: '',
        state: ''
      },
      precapital: '',
      failList: [] // 失败原因列表
    }
  },
  inject: ['reload'], // 接收App.vue传过来的刷新路由函数
  mounted() {
    let token = window.localStorage['token'];
    this.action = fincialStateRequest.postUploadFile(token);
    // 默认所属期为上季度起止日期或者已选择日期
    this.genus = getQuarterDate().lastQuarter;
    // 页面刷新仍然停留在当前页面状态
    this.activeIndex = JSON.parse(sessionStorage.getItem('activeFin'));
    if (!this.activeIndex) {
      this.activeIndex = '1';
    }
    this.state = this.activeIndex;
    // 获取初始化列表数据
    this.getFincialData(this.listParams);
    // 获取财务报表下载链接
    fincialStateRequest.getFincialTemplate().then((res) => {
      if (res.code === 0) {
        this.fileList = res.data.list;
      } else {
        window.Alert(res.msg);
      }
    });
  },
  methods: {
    // 时间格式化
    dateFormat: function(cellValue) {
      if (cellValue) {
        return formatDate(new Date(cellValue), 'yyyy-MM-dd');
      }
    },
    // 切换列表
    listSelect: function(index, indexPath) {
      this.loading = true;
      this.state = index;
      sessionStorage.setItem('activeFin', JSON.stringify(index));
      this.currentPage = 1;
      this.allChecked = false;
      this.multipleSelection = [];
      this.pageSize = 10;
      this.tableData.declares = [];
      this.getFincialData(this.listParams);
    },
    // 上传文件前判断文件大小
    beforeUpload: function(file) {
      let fileSize = file.size / 1024 / 1024 < 10;
      if (!fileSize) {
        window.Warning('导入文件大小不能超过10MB');
      } else {
        this.uploadFileData.cwbbxh = this.cwbbId;
        this.loading = true;
        this.loadingText = '文件正在导入中，请稍等';
      }
    },
    // 导入文件
    importFile(index, row) {
      this.cwbbId = row.cwbbxh;
    },
    // 上传文件成功后的回调函数
    onSuccess: function(response, file, fileList) {
      this.loading = false;
      this.loadingText = '正在加载数据';
      if (response.code === 0) {
        window.Success('文件导入成功');
        // 文件上传成功后刷新列表数据
        this.isIE();
      } else {
        window.Alert(response.msg);
        this.loading = false;
      }
    },
    // 上传文件失败后的回调函数
    onError: function(err, file, fileList) {
      console.log(err);
      window.Alert('网络故障，导入文件失败');
    },
    // 打开弹窗
    seeInfo(index, row) {
      this.loading = true;
      this.btnType = row.state;
      this.cwbbId = row.cwbbxh;
      this.companyName = row.wtrmc;
      this.creditCode = row.wtrTyshxydm;
      this.dialogVisible = true;
      this.accountType = row.zlbsxlDm;
      this.submitDate = formatDate(new Date(row.slrq), 'yyyy-MM-dd') || formatDate(new Date(), 'yyyy-MM-dd');
      // 获取会计制度表格
      fincialStateRequest.getAllCompanyTable(this.cwbbId).then((res) => {
        this.loading = false;
        if (res.code === 0) {
          this.accountTableData = res.data;
          if (this.accountType === 'ZL1001001') {
            this.generalSummary();
          } else if (this.accountType === 'ZL1001002') {
            this.companySummary();
          } else {
            this.smallCompanySummary();
          }
        } else {
          window.Alert(res.msg);
        }
      });
    },
    // 修改会计制度
    selectChange: function(id, value) {
      let data = {cwbbxh: id, zlbsxlDm: value};
      fincialStateRequest.postModifyAccountType(data).then(res => {
        if (res.code === 0) {
          window.Success(res.msg);
          this.isIE();
        } else {
          window.Alert(res.msg);
        }
      });
    },
    // 获取列表数据
    getFincialData: function(params) {
      this.loading = true;
      params.ssqq = this.genus[0];
      params.ssqz = this.genus[1];
      params.key = this.inputValue;
      params.state = this.state;
      params.pageSize = this.pageSize;
      params.pageNum = this.currentPage;
      fincialStateRequest.getCompanyList(params).then((res) => {
        this.loading = false;
        if (res.code === 0) {
          this.tableData = res.data;
        } else {
          window.Alert(res.msg);
        }
      });
    },
    // 分页
    currentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getFincialData(this.listParams);
    },
    // 改变每页条数
    sizeChange: function(pageSize) {
      this.pageSize = pageSize;
      this.getFincialData(this.listParams);
    },
    // 全选
    toggleSelection(rows) {
      if (this.allChecked) {
        this.$refs.multipleTable.clearSelection();
      }
      if (rows) {
        rows.forEach(row => {
          if (row.state === '1' || row.state === 1) {
            this.$refs.multipleTable.toggleRowSelection(row);
          }
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 表格选择多项
    handleSelectionChange(val) {
      let list = [];
      this.tableData.declares.forEach(item => {
        if (item.state === '1' || item.state === 1) {
          list.push(item);
        }
      });
      if (val.length < list.length) {
        this.allChecked = false;
      } else {
        this.allChecked = true;
      }
      this.multipleSelection = val;
    },
    // 弹窗负债表和利润表切换
    handleSelect: function(index, indexPath) {
      this.currentView = index;
    },
    // 点击下载财务报表模板
    getFileTemplate: function(command) {
      fincialStateRequest.getDownFincialTemplate(command).then((res) => {
        // 文件名存在header的content-disposition里
        let disposition = res.headers['content-disposition'];
        // 获取到文件名
        let filename = decodeURI(disposition.split('filename=')[1]);
        // 下载文件
        fileDownload(res.data, filename);
      });
    },
    // 弹窗关闭
    dialogClose: function() {
      // 这里必须刷新路由,不然弹窗内部导航栏初始激活菜单不是资产负债表
      this.reload();
    },
    // 多选框只能在已导入状态下才能勾选
    checkedDisabled: function(row, index) {
      if (row.state === '1') {
        return true;
      } else {
        return false;
      }
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
    // 报送
    submit: function() {
      let data = this.deepCopy(this.accountTableData);
      data.zcfzb.shift();
      fincialStateRequest.postSubmitTable(this.cwbbId, data).then(res => {
        if (res.code === 0) {
          window.Success(res.msg);
          this.dialogVisible = false;
        } else if (res.code === -2) {
          window.Alert(res.msg);
          this.dialogVisible = false;
        } else {
          window.Alert(res.msg);
        }
      });
    },
    // 批量报送
    batchSubmit: function() {
      this.$confirm(`您将对 <span style="color: #4680ff">${this.multipleSelection.length}</span> 
      位纳税人进行 <span style="color: #4680ff">批量报送</span> 操作，确定继续吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true
      })
      .then(() => {
        this.loading = true;
        this.loadingText = '正在进行批量报送，请稍等';
        this.resDialogVisible = false;
        let cwbbxhs = [];
        this.multipleSelection.forEach(item => {
          cwbbxhs.push(item.cwbbxh);
        });
        fincialStateRequest.postBatchSubmit(cwbbxhs).then(res => {
          if (res.code === 0) {
            this.allNum = this.multipleSelection.length;
            this.failNum = res.data.failedCount;
            this.successNum = res.data.successCount;
          } else {
            window.Alert(res.msg);
          }
        })
        .finally(() => {
          this.loading = false;
          this.resDialogVisible = true;
        });
      })
      .catch(() => false);
    },
    // 返回
    continuePay: function(visible) {
      this.resDialogVisible = false;
      this.failDialogVisible = false;
      this.isIE();
    },
    // 弹窗中查看失败原因
    lookFail: function() {
      this.resDialogVisible = false;
      this.activeIndex = '3';
      sessionStorage.setItem('activeFin', JSON.stringify(this.activeIndex));
      this.state = this.activeIndex;
      this.isIE();
    },
    // 列表查看失败原因
    viewFail: function(cwbbxh) {
      fincialStateRequest.getViewFail(cwbbxh).then(res => {
        if (res.code === 0) {
          res.data.list.forEach(item => {
            item.sbyy = item.sbyy.replace(/￥-?\d*\.\d{2}/g, '<span class="fin-red">$&</span>');
            this.failList.push(item.sbyy);
          });
          this.failDialogVisible = true;
        } else {
          window.Alert(res.msg);
        }
      })
    },
    // 暂存
    save() {
      let data = this.deepCopy(this.accountTableData);
      data.zcfzb.shift();
      fincialStateRequest.postSaveTaxTable(this.cwbbId, data).then(res => {
        if (res.code === 0) {
          window.Success(res.msg);
          this.dialogClose();
        } else {
          window.Alert(res.msg);
        }
      })
    },
    /**
     * TODO:由于三个会计制度下的资产负债表和利润表合计公式是死的，且返回数据是数组格式，因此只能根据数组下标去取数据，
     * 然后根据公式去进行计算。代码量比较多，但无技术含量，如能优化此块代码则佳。
     */
    // 一般企业合计
    generalSummary() {
      // 资产负债表合计
      let dataLiab = this.accountTableData.zcfzb;
      let currentAssetNcyeZcTotal = 0;
      let currentAssetQmyeZcTotal = 0;
      let notCurrentAssetNcyeZcTotal = 0;
      let notCurrentAssetQmyeZcTotal = 0;
      let currentAssetQmyeQyTotal = 0;
      let currentAssetNcyeQyTotal = 0;
      let notCurrentAssetQmyeQyTotal = 0;
      let notCurrentAssetNcyeQyTotal = 0;
      let ownerQmyeQyTotal = 0;
      let ownerNcyeQyTotal = 0;
      let bondsPayableQm = 0; // 应付债券-期末余额
      let bondsPayableNc = 0; // 应付债券-年初余额
      let equityInstrumentQm = 0; // 其他权益工具-期末余额
      let equityInstrumentNc = 0; // 其他权益工具-年初余额
      this.accountTableData.zcfzb.forEach((item, index) => {
        item.qmyeZc = item.qmyeZc ? item.qmyeZc : 0;
        item.ncyeZc = item.ncyeZc ? item.ncyeZc : 0;
        item.qmyeQy = item.qmyeQy ? item.qmyeQy : 0;
        item.ncyeQy = item.ncyeQy ? item.ncyeQy : 0;
        if (index > 0 && index < 13) {
          currentAssetQmyeZcTotal = currentAssetQmyeZcTotal + Number(item.qmyeZc);
          currentAssetNcyeZcTotal = currentAssetNcyeZcTotal + Number(item.ncyeZc);
        }
        if (index > 0 && index < 14) {
          currentAssetQmyeQyTotal = currentAssetQmyeQyTotal + Number(item.qmyeQy);
          currentAssetNcyeQyTotal = currentAssetNcyeQyTotal + Number(item.ncyeQy);
        }
        if (index > 15 && index < 39) {
          notCurrentAssetQmyeZcTotal = notCurrentAssetQmyeZcTotal + Number(item.qmyeZc);
          notCurrentAssetNcyeZcTotal = notCurrentAssetNcyeZcTotal + Number(item.ncyeZc);
        }
        if (index > 16 && index < 26) {
          notCurrentAssetQmyeQyTotal = notCurrentAssetQmyeQyTotal + Number(item.qmyeQy);
          notCurrentAssetNcyeQyTotal = notCurrentAssetNcyeQyTotal + Number(item.ncyeQy);
        }
      });
      bondsPayableQm = Number(dataLiab[19].qmyeQy) + Number(dataLiab[20].qmyeQy);
      bondsPayableNc = Number(dataLiab[19].ncyeQy) + Number(dataLiab[20].ncyeQy);
      equityInstrumentQm = Number(dataLiab[32].qmyeQy) + Number(dataLiab[33].qmyeQy);
      equityInstrumentNc = Number(dataLiab[32].ncyeQy) + Number(dataLiab[33].ncyeQy);
      ownerQmyeQyTotal = Number(dataLiab[30].qmyeQy) + equityInstrumentQm + Number(dataLiab[34].qmyeQy) - Number(dataLiab[35].qmyeQy) + Number(dataLiab[36].qmyeQy) + Number(dataLiab[37].qmyeQy) + Number(dataLiab[38].qmyeQy);
      ownerNcyeQyTotal = Number(dataLiab[30].ncyeQy) + equityInstrumentQm + Number(dataLiab[34].ncyeQy) - Number(dataLiab[35].ncyeQy) + Number(dataLiab[36].ncyeQy) + Number(dataLiab[37].ncyeQy) + Number(dataLiab[38].ncyeQy);
      dataLiab[14].qmyeZc = currentAssetQmyeZcTotal.toFixed(2); // 流动资产合计-期末余额
      dataLiab[14].ncyeZc = currentAssetNcyeZcTotal.toFixed(2); // 流动资产合计-年初余额
      dataLiab[40].qmyeZc = notCurrentAssetQmyeZcTotal.toFixed(2); // 非流动资产合计-期末余额
      dataLiab[40].ncyeZc = notCurrentAssetNcyeZcTotal.toFixed(2); // 非流动资产合计-年初余额
      dataLiab[41].qmyeZc = (currentAssetQmyeZcTotal + notCurrentAssetQmyeZcTotal).toFixed(2); // 资产合计-期末余额
      dataLiab[41].ncyeZc = (currentAssetNcyeZcTotal + notCurrentAssetNcyeZcTotal).toFixed(2); // 资产合计-年初余额
      dataLiab[15].qmyeQy = currentAssetQmyeQyTotal.toFixed(2); // 流动负债合计-期末余额
      dataLiab[15].ncyeQy = currentAssetNcyeQyTotal.toFixed(2); // 流动负债合计-年初余额
      dataLiab[27].qmyeQy = notCurrentAssetQmyeQyTotal.toFixed(2); // 非流动负债合计-期末余额
      dataLiab[27].ncyeQy = notCurrentAssetNcyeQyTotal.toFixed(2); // 非流动负债合计-年初余额
      dataLiab[28].qmyeQy = (currentAssetQmyeQyTotal + notCurrentAssetQmyeQyTotal).toFixed(2); // 负债合计-期末余额
      dataLiab[28].ncyeQy = (currentAssetNcyeQyTotal + notCurrentAssetNcyeQyTotal).toFixed(2); // 负债合计-年初余额
      dataLiab[39].qmyeQy = ownerQmyeQyTotal.toFixed(2); // 所有者权益合计-期末余额
      dataLiab[39].ncyeQy = ownerNcyeQyTotal.toFixed(2); // 所有者权益合计-年初余额
      dataLiab[41].qmyeQy = (currentAssetQmyeQyTotal + notCurrentAssetQmyeQyTotal + ownerQmyeQyTotal).toFixed(2); // 负债和所有者权益合计-期末余额
      dataLiab[41].ncyeQy = (currentAssetNcyeQyTotal + notCurrentAssetNcyeQyTotal + ownerNcyeQyTotal).toFixed(2); // 负债和所有者权益合计-年初余额
      dataLiab[18].qmyeQy = bondsPayableQm.toFixed(2);
      dataLiab[18].ncyeQy = bondsPayableNc.toFixed(2);
      dataLiab[31].qmyeQy = equityInstrumentQm.toFixed(2);
      dataLiab[31].ncyeQy = equityInstrumentNc.toFixed(2);
      // 利润表合计
      let lrbLiab = this.accountTableData.lrb;
      let operatingProfitBqje = 0; // 营业利润-本期金额
      let operatingProfitSqje = 0; // 营业利润-上期金额
      let profitTotalBqje = 0; // 利润总额-本期金额
      let profitTotalSqje = 0; // 利润总额-上期金额
      let netProfitBqje = 0; // 净利润-本期金额
      let netProfitSqje = 0; // 净利润-上期金额
      let totalComprehensiveIncomeBqje = 0; // 综合收益总额-本期金额
      let totalComprehensiveIncomeSqje = 0; // 综合收益总额-上期金额
      let otherComprehensiveIncomeBqje = 0; // 以后将重分类进损益的其他综合收益-本期金额
      let otherComprehensiveIncomeSqje = 0; // 以后将重分类进损益的其他综合收益-上期金额
      this.accountTableData.lrb.forEach((item, index) => {
        if (index > 24 && index < 29) {
          otherComprehensiveIncomeBqje += Number(item.bqje);
          otherComprehensiveIncomeSqje += Number(item.sqje);
        }
      })
      operatingProfitBqje = Number(lrbLiab[0].bqje) - Number(lrbLiab[1].bqje) - Number(lrbLiab[2].bqje) - Number(lrbLiab[3].bqje) - Number(lrbLiab[4].bqje) - Number(lrbLiab[5].bqje) - Number(lrbLiab[6].bqje) + Number(lrbLiab[7].bqje) + Number(lrbLiab[8].bqje) + Number(lrbLiab[10].bqje) + Number(lrbLiab[11].bqje);
      operatingProfitSqje = Number(lrbLiab[0].sqje) - Number(lrbLiab[1].sqje) - Number(lrbLiab[2].sqje) - Number(lrbLiab[3].sqje) - Number(lrbLiab[4].sqje) - Number(lrbLiab[5].sqje) - Number(lrbLiab[6].sqje) + Number(lrbLiab[7].sqje) + Number(lrbLiab[8].sqje) + Number(lrbLiab[10].sqje) + Number(lrbLiab[11].sqje);
      profitTotalBqje = operatingProfitBqje + Number(lrbLiab[13].bqje) - Number(lrbLiab[14].bqje);
      profitTotalSqje = operatingProfitSqje + Number(lrbLiab[13].sqje) - Number(lrbLiab[14].sqje);
      netProfitBqje = profitTotalBqje - Number(lrbLiab[16].bqje);
      netProfitSqje = profitTotalSqje - Number(lrbLiab[16].sqje);
      totalComprehensiveIncomeBqje = netProfitBqje + Number(lrbLiab[20].bqje);
      totalComprehensiveIncomeSqje = netProfitSqje + Number(lrbLiab[20].sqje);
      lrbLiab[12].bqje = operatingProfitBqje.toFixed(2);
      lrbLiab[12].sqje = operatingProfitSqje.toFixed(2);
      lrbLiab[15].bqje = profitTotalBqje.toFixed(2);
      lrbLiab[15].sqje = profitTotalSqje.toFixed(2);
      lrbLiab[17].bqje = netProfitBqje.toFixed(2);
      lrbLiab[17].sqje = netProfitSqje.toFixed(2);
      lrbLiab[30].bqje = totalComprehensiveIncomeBqje.toFixed(2);
      lrbLiab[30].sqje = totalComprehensiveIncomeSqje.toFixed(2);
      lrbLiab[21].bqje = (Number(lrbLiab[22].bqje) + Number(lrbLiab[23].bqje)).toFixed(2);
      lrbLiab[21].sqje = (lrbLiab[22].sqje + lrbLiab[23].sqje).toFixed(2);
      lrbLiab[24].bqje = otherComprehensiveIncomeBqje.toFixed(2);
      lrbLiab[24].sqje = otherComprehensiveIncomeSqje.toFixed(2);
      lrbLiab[20].bqje = (Number(lrbLiab[22].bqje) + Number(lrbLiab[23].bqje) + otherComprehensiveIncomeBqje).toFixed(2);
      lrbLiab[20].sqje = (Number(lrbLiab[22].sqje) + Number(lrbLiab[23].sqje) + otherComprehensiveIncomeSqje).toFixed(2);
    },
    // 企业会计制度合计
    companySummary() {
      // 资产负债表合计
      let dataLiab = this.accountTableData.zcfzb;
      let currentAssetsTotalNc = 0; // 流动资产合计-年初数
      let currentAssetsTotalQm = 0; // 流动资产合计-期末数
      let longInvestmentNc = 0; // 长期投资合计-年初数
      let longInvestmentQm = 0; // 长期投资-期末数
      let fixedAssetsNc = 0; // 固定资产净值-年初数
      let fixedAssetsQm = 0; // 固定资产净值-期末数
      let fixedAssetsTotalNc = 0; // 固定资产合计-年初数
      let fixedAssetsTotalQm = 0; // 固定资产合计-期末数
      let intangibleAssetsNc = 0; // 无形资产-年初数
      let intangibleAssetsQm = 0; // 无形资产-期末数
      let assetsTotalNc = 0; // 资产合计-年初数
      let assetsTotalQm = 0; // 资产合计-期末数
      let currentLiabilityNc = 0; // 流动负债合计-年初数
      let currentLiabilityQm = 0; // 流动负债合计-期末数
      let longLiabilityNc = 0; // 长期负债-年初数
      let longLiabilityQm = 0; // 长期负债-期末数
      let liabilityTotalNc = 0; // 负债合计-年初数
      let liabilityTotalQm = 0; // 负债合计-期末数
      let paidCapitalNc = 0; // 实收资本净额-年初数
      let paidCaptionQm = 0; // 实收资本净额-期末数
      let ownersEquityNc = 0; // 所有者权益-年初数
      let ownersEquityQm = 0; // 所有者权益-期末数
      this.accountTableData.zcfzb.forEach((item, index) => {
        item.ncsZc = item.ncsZc ? item.ncsZc : 0;
        item.qmsZc = item.qmsZc ? item.qmsZc : 0;
        item.ncsQy = item.ncsQy ? item.ncsQy : 0;
        item.qmsQy = item.qmsQy ? item.qmsQy : 0;
        if (index > 0 && index < 13) {
          currentAssetsTotalNc = currentAssetsTotalNc + Number(item.ncsZc);
          currentAssetsTotalQm = currentAssetsTotalQm + Number(item.qmsZc);
        }
        if (index > 14 && index < 16) {
          longInvestmentNc = longInvestmentNc + Number(item.ncsZc);
          longInvestmentQm = longInvestmentQm + Number(item.qmsZc);
        }
        if (index > 28 && index < 31) {
          intangibleAssetsNc = intangibleAssetsNc + Number(item.ncsZc);
          intangibleAssetsQm = intangibleAssetsQm + Number(item.qmsZc);
        }
        if (index > 0 && index < 14) {
          currentLiabilityNc = currentLiabilityNc + Number(item.ncsQy);
          currentLiabilityQm = currentLiabilityQm + Number(item.qmsQy);
        }
        if (index > 16 && index < 21) {
          longLiabilityNc = longLiabilityNc + Number(item.ncsQy);
          longLiabilityQm = longLiabilityQm + Number(item.qmsQy);
        }
      });
      fixedAssetsNc = Number(dataLiab[19].ncsZc) - Number(dataLiab[20].ncsZc);
      fixedAssetsQm = Number(dataLiab[19].qmsZc) - Number(dataLiab[20].qmsZc);
      fixedAssetsTotalNc = fixedAssetsNc - Number(dataLiab[22].ncsZc) + Number(dataLiab[24].ncsZc) + Number(dataLiab[25].ncsZc) + Number(dataLiab[26].ncsZc);
      fixedAssetsTotalQm = fixedAssetsQm - Number(dataLiab[22].qmsZc) + Number(dataLiab[24].qmsZc) + Number(dataLiab[25].qmsZc) + Number(dataLiab[26].qmsZc);
      assetsTotalNc = currentAssetsTotalNc + longInvestmentNc + fixedAssetsTotalNc + intangibleAssetsNc + Number(dataLiab[35].ncsZc);
      assetsTotalQm = currentAssetsTotalQm + longInvestmentQm + fixedAssetsTotalQm + intangibleAssetsQm + Number(dataLiab[35].qmsZc);
      liabilityTotalNc = currentLiabilityNc + longLiabilityNc + Number(dataLiab[24].ncsQy);
      liabilityTotalQm = currentLiabilityQm + longLiabilityQm + Number(dataLiab[24].qmsQy);
      paidCapitalNc = Number(dataLiab[28].ncsQy) - Number(dataLiab[29].ncsQy);
      paidCaptionQm = Number(dataLiab[28].qmsQy) - Number(dataLiab[29].qmsQy);
      ownersEquityNc = paidCapitalNc + Number(dataLiab[31].ncsQy) + Number(dataLiab[32].ncsQy) + Number(dataLiab[34].ncsQy);
      ownersEquityQm = paidCaptionQm + Number(dataLiab[31].qmsQy) + Number(dataLiab[32].qmsQy) + Number(dataLiab[34].qmsQy);
      dataLiab[14].ncsZc = currentAssetsTotalNc.toFixed(2);
      dataLiab[14].qmsZc = currentAssetsTotalQm.toFixed(2);
      dataLiab[17].ncsZc = longInvestmentNc.toFixed(2);
      dataLiab[17].qmsZc = longInvestmentQm.toFixed(2);
      dataLiab[21].ncsZc = fixedAssetsNc.toFixed(2);
      dataLiab[21].qmsZc = fixedAssetsQm.toFixed(2);
      dataLiab[23].ncsZc = (fixedAssetsNc - Number(dataLiab[22].ncsZc)).toFixed(2); // 固定资产净额-年初数
      dataLiab[23].qmsZc = (fixedAssetsQm - Number(dataLiab[22].qmsZc)).toFixed(2); // 固定资产净额-期末数
      dataLiab[27].ncsZc = fixedAssetsTotalNc.toFixed(2);
      dataLiab[27].qmsZc = fixedAssetsTotalQm.toFixed(2);
      dataLiab[32].ncsZc = intangibleAssetsNc.toFixed(2);
      dataLiab[32].qmsZc = intangibleAssetsQm.toFixed(2);
      dataLiab[36].ncsZc = assetsTotalNc.toFixed(2);
      dataLiab[36].qmsZc = assetsTotalQm.toFixed(2);
      dataLiab[15].ncsQy = currentLiabilityNc.toFixed(2);
      dataLiab[15].qmsQy = currentLiabilityQm.toFixed(2);
      dataLiab[22].ncsQy = longLiabilityNc.toFixed(2);
      dataLiab[22].qmsQy = longLiabilityQm.toFixed(2);
      dataLiab[25].ncsQy = liabilityTotalNc.toFixed(2);
      dataLiab[25].qmsQy = liabilityTotalQm.toFixed(2);
      dataLiab[30].ncsQy = paidCapitalNc.toFixed(2);
      dataLiab[30].qmsQy = paidCaptionQm.toFixed(2);
      dataLiab[35].ncsQy = ownersEquityNc.toFixed(2);
      dataLiab[35].qmsQy = ownersEquityQm.toFixed(2);
      dataLiab[36].ncsQy = (liabilityTotalNc + ownersEquityNc).toFixed(2);
      dataLiab[36].qmsQy = (liabilityTotalQm + ownersEquityQm).toFixed(2);

      // 利润表合计
      let lrbLiab = this.accountTableData.lrb;
      let mainBusinessBy = 0; // 主营业务利润-本月数
      let mainBusinessBn = 0; // 主营业务利润-本年累计数
      let profitTotalBy = 0; // 利润总额-本月数
      let profitTotalBn = 0; // 利润总额-本年累计数
      let operatingProfitBy = 0; // 营业利润-本月数
      let operatingProfitBn = 0; // 营业利润-本年累计数
      mainBusinessBy = Number(lrbLiab[0].bys) - Number(lrbLiab[1].bys) - Number(lrbLiab[2].bys);
      mainBusinessBn = Number(lrbLiab[0].bnljs) - Number(lrbLiab[1].bnljs) - Number(lrbLiab[2].bnljs);
      profitTotalBy = Number(lrbLiab[8].bys) + Number(lrbLiab[9].bys) + Number(lrbLiab[10].bys) + Number(lrbLiab[11].bys) - Number(lrbLiab[12].bys);
      profitTotalBn = Number(lrbLiab[8].bnljs) + Number(lrbLiab[9].bnljs) + Number(lrbLiab[10].bnljs) + Number(lrbLiab[11].bnljs) - Number(lrbLiab[12].bnljs);
      operatingProfitBy = mainBusinessBy + Number(lrbLiab[4].bys) - Number(lrbLiab[5].bys) - Number(lrbLiab[6].bys) - Number(lrbLiab[7].bys);
      operatingProfitBn = mainBusinessBn + Number(lrbLiab[4].bnljs) - Number(lrbLiab[5].bnljs) - Number(lrbLiab[6].bnljs) - Number(lrbLiab[7].bnljs);
      lrbLiab[3].bys = mainBusinessBy.toFixed(2);
      lrbLiab[3].bnljs = mainBusinessBn.toFixed(2);
      lrbLiab[13].bys = profitTotalBy.toFixed(2);
      lrbLiab[13].bnljs = profitTotalBn.toFixed(2);
      lrbLiab[15].bys = (profitTotalBy - Number(lrbLiab[14].bys)).toFixed(2);
      lrbLiab[15].bnljs = (profitTotalBn - Number(lrbLiab[14].bnljs)).toFixed(2);
      lrbLiab[8].bys = operatingProfitBy.toFixed(2);
      lrbLiab[8].bnljs = operatingProfitBn.toFixed(2);
    },
    // 小企业会计制度合计
    smallCompanySummary() {
      let dataLiab = this.accountTableData.zcfzb;
      let currentAssetsTotalQm = 0; // 流动资产合计-期末余额
      let currentAssetsTotalNc = 0; // 流动资产合计-年初余额
      let fixedAssetsQm = 0; // 固定资产账面价值-期末余额
      let fixedAssetsNc = 0; // 固定资产账面价值-年初余额
      let notCurrentAssetsTotalQm = 0; // 非流动资产合计-期末余额
      let notCurrentAssetsTotalNc = 0; // 非流动资产合计-年初余额
      let assetsTotalQm = 0; // 资产合计-期末余额
      let assetsTotalNc = 0; // 资产合计-年初余额
      let currentLiabilityQm = 0; // 流动负债合计-期末余额
      let currentLiabilityNc = 0; // 流动负债合计-年初余额
      let notCurrentLiabilityQm = 0; // 非流动负债合计-期末余额
      let notCurrentLiabilityNc = 0; // 非流动负债合计-年初余额
      let liabilityTotalQm = 0; // 负债合计-期末余额
      let liabilityTotalNc = 0; // 负债合计-年初余额
      let ownersEquityQm = 0; // 所有者权益-期末余额
      let ownersEquityNc = 0; // 所有者权益-年初余额
      this.accountTableData.zcfzb.forEach((item, index) => {
        item.qmyeZc = item.qmyeZc ? item.qmyeZc : 0;
        item.ncyeZc = item.ncyeZc ? item.ncyeZc : 0;
        item.qmyeQy = item.qmyeQy ? item.qmyeQy : 0;
        item.ncyeQy = item.ncyeQy ? item.ncyeQy : 0;
        if (index > 0 && index < 9) {
          currentAssetsTotalQm = currentAssetsTotalQm + Number(item.qmyeZc);
          currentAssetsTotalNc = currentAssetsTotalNc + Number(item.ncyeZc);
        }
        if (index > 21 && index < 29) {
          notCurrentAssetsTotalQm += Number(item.qmyeZc);
          notCurrentAssetsTotalNc += Number(item.ncyeZc);
        }
        if (index > 0 && index < 10) {
          currentLiabilityQm += Number(item.qmyeQy);
          currentLiabilityNc += Number(item.ncyeQy);
        }
        if (index > 12 && index < 16) {
          notCurrentLiabilityQm += Number(item.qmyeQy);
          notCurrentLiabilityNc += Number(item.ncyeQy);
        }
        if (index > 25 && index < 29) {
          ownersEquityQm += Number(item.qmyeQy);
          ownersEquityNc += Number(item.ncyeQy);
        }
      });
      currentAssetsTotalQm += Number(dataLiab[14].qmyeZc);
      currentAssetsTotalNc += Number(dataLiab[14].ncyeZc);
      fixedAssetsQm = Number(dataLiab[19].qmyeZc) - Number(dataLiab[20].qmyeZc);
      fixedAssetsNc = Number(dataLiab[19].ncyeZc) - Number(dataLiab[20].ncyeZc);
      notCurrentAssetsTotalQm = Number(dataLiab[17].qmyeZc) + Number(dataLiab[18].qmyeZc) + Number(dataLiab[19].qmyeZc) - Number(dataLiab[20].qmyeZc) + notCurrentAssetsTotalQm;
      notCurrentAssetsTotalNc = Number(dataLiab[17].ncyeZc) + Number(dataLiab[18].ncyeZc) + Number(dataLiab[19].ncyeZc) - Number(dataLiab[20].ncyeZc) + notCurrentAssetsTotalNc;
      assetsTotalQm = currentAssetsTotalQm + notCurrentAssetsTotalQm;
      assetsTotalNc = currentAssetsTotalNc + notCurrentAssetsTotalNc;
      liabilityTotalQm = notCurrentAssetsTotalQm + assetsTotalQm;
      liabilityTotalNc = notCurrentAssetsTotalNc + assetsTotalNc;
      dataLiab[15].qmyeZc = currentAssetsTotalQm.toFixed(2);
      dataLiab[15].ncyeZc = currentAssetsTotalNc.toFixed(2);
      dataLiab[21].qmyeZc = fixedAssetsQm.toFixed(2);
      dataLiab[21].ncyeZc = fixedAssetsNc.toFixed(2);
      dataLiab[30].qmyeZc = notCurrentAssetsTotalQm.toFixed(2);
      dataLiab[30].ncyeZc = notCurrentAssetsTotalNc.toFixed(2);
      dataLiab[31].qmyeZc = assetsTotalQm.toFixed(2);
      dataLiab[31].ncyeZc = assetsTotalNc.toFixed(2);
      dataLiab[11].qmyeQy = currentLiabilityQm.toFixed(2);
      dataLiab[11].ncyeQy = currentLiabilityNc.toFixed(2);
      dataLiab[17].qmyeQy = notCurrentLiabilityQm.toFixed(2);
      dataLiab[17].ncyeQy = notCurrentLiabilityNc.toFixed(2);
      dataLiab[18].qmyeQy = liabilityTotalQm.toFixed(2);
      dataLiab[18].ncyeQy = liabilityTotalNc.toFixed(2);
      dataLiab[30].qmyeQy = ownersEquityQm.toFixed(2);
      dataLiab[30].ncyeQy = ownersEquityNc.toFixed(2);
      dataLiab[31].qmyeQy = (liabilityTotalQm + ownersEquityQm).toFixed(2);
      dataLiab[31].ncyeQy = (liabilityTotalNc + ownersEquityNc).toFixed(2);

      // 利润表合计
      let lrbLiab = this.accountTableData.lrb;
      let operatingProfitBy = 0; // 营业利润-本月金额
      let operatingProfitBn = 0; // 营业利润-本年累计金额
      let profitTotalBy = 0; // 利润总额-本月金额
      let profitTotalBn = 0; // 利润总额-本年累计金额
      operatingProfitBy = Number(lrbLiab[0].byje) - Number(lrbLiab[1].byje) - Number(lrbLiab[2].byje) - Number(lrbLiab[10].byje) - Number(lrbLiab[13].byje) - Number(lrbLiab[17].byje) + Number(lrbLiab[19].byje);
      operatingProfitBn = Number(lrbLiab[0].bnljje) - Number(lrbLiab[1].bnljje) - Number(lrbLiab[2].bnljje) - Number(lrbLiab[10].bnljje) - Number(lrbLiab[13].bnljje) - Number(lrbLiab[17].bnljje) + Number(lrbLiab[19].bnljje);
      profitTotalBy = operatingProfitBy + Number(lrbLiab[21].byje) - Number(lrbLiab[23].byje);
      profitTotalBn = operatingProfitBn + Number(lrbLiab[21].bnljje) - Number(lrbLiab[23].bnljje);
      lrbLiab[20].byje = operatingProfitBy.toFixed(2);
      lrbLiab[20].bnljje = operatingProfitBn.toFixed(2);
      lrbLiab[29].byje = profitTotalBy.toFixed(2);
      lrbLiab[29].bnljje = profitTotalBn.toFixed(2);
      lrbLiab[31].byje = (profitTotalBy - Number(lrbLiab[30].byje)).toFixed(2);
      lrbLiab[31].bnljje = (profitTotalBn - Number(lrbLiab[30].bnljje)).toFixed(2);
    },
    // 输入框设置金额输入格式-获取焦点
    yeFocus: function(event, index, data, prop) {
      let val = event.srcElement.value;
      if (val === '0.00' || val === '0.0' || val === '0') {
        val = '';
      } else {
        val = val.replace(/\.00/, '').replace(/(\.\d)0/, '$1');
      }
      this.precapital = val;
      event.srcElement.value = val;
      data[index][prop] = val;
    },
    // 输入框设置金额输入格式-按键
    yeKeyUp: function(event, index, data, prop) {
      let val = event.srcElement.value;
      val = val.replace(/^[.]/, '').replace(/[^-\d.]/g, '');
      if (val.split('.').length - 1 > 1) {
        val = this.precapital;
      }
      this.precapital = val;
      event.srcElement.value = val;
      data[index][prop] = val;
    },
    // 输入框设置金额输入格式-失去焦点
    yeBlur: function(event, index, data, prop) {
      let val = event.srcElement.value;
      val = val.replace(/[.]$/, '');
      val = val.replace(/(.*)\.([\d]{2})(\d*)/g, '$1.$2');
      val = Number(val).toFixed(2);
      event.srcElement.value = val;
      data[index][prop] = val;
      if (this.accountType === 'ZL1001001') {
        this.generalSummary();
      } else if (this.accountType === 'ZL1001002') {
        this.companySummary();
      } else {
        this.smallCompanySummary();
      }
    },
    // 资产负债表修改表格样式
    styleChange: function({row, column, rowIndex, columnIndex}) {
      if (this.accountType === 'ZL1001001') {
        if (columnIndex === 0 && rowIndex !== 0 && rowIndex !== 14 && rowIndex !== 15 && rowIndex !== 40 && rowIndex !== 41) {
          return {'padding-left': '25px'};
        }
        if (columnIndex === 4 && rowIndex !== 0 && rowIndex !== 15 && rowIndex !== 16 && rowIndex !== 27 && rowIndex !== 28 && rowIndex !== 29 && rowIndex !== 39 && rowIndex !== 41) {
          return {'padding-left': '25px'};
        }
      } else if (this.accountType === 'ZL1001002') {
        if (columnIndex === 0 && rowIndex !== 0 && rowIndex !== 18 && rowIndex !== 28 && rowIndex !== 34) {
          return {'padding-left': '25px'};
        }
        if (columnIndex === 4 && rowIndex !== 0 && rowIndex !== 16 && rowIndex !== 23 && rowIndex !== 27) {
          return {'padding-left': '25px'};
        }
      } else {
        if (columnIndex === 0 && rowIndex !== 0) {
          return {'padding-left': '25px'};
        }
        if (columnIndex === 4 && rowIndex !== 0) {
          return {'padding-left': '25px'};
        }
      }
    },
    // 利润表修改表格样式
    profitStyleChange: function({row, column, rowIndex, columnIndex}) {
      if (this.accountType === 'ZL1001001') {
        if (columnIndex === 0 && rowIndex !== 0 && rowIndex !== 12 && rowIndex !== 15 && rowIndex !== 17 && rowIndex !== 20 && rowIndex !== 30 && rowIndex !== 31) {
          return {'padding-left': '25px'};
        }
      }
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

<style lang="stylus" rel="stylesheet/stylus">
@import 'common.styl';
.financial
  .reportmenu 
    background #f2f4f7 !important
    .el-menu-item
      height 40px
      line-height 40px
    .el-menu-item:focus
    .el-menu-item:hover
      color #4680ff !important
      background transparent
  .header-col 
    position relative
    margin-bottom 10px
  .headerBack
    overflow-y hidden
    text-align center !important
    color #333
    font-weight 700
  .el-table th
    padding 6px 0
  .fin-main
    .el-input.is-disabled .el-input__inner
      color #606266 !important
    .el-card__body
      padding 10px 20px 20px
  .downLoadCon
    position absolute
    top 4px
    right 0
    .el-button
      padding 8px 10px
      border-radius 23px
  .fin-tps
    color #f56c6c
    margin-right 10px
  .dateCon
    text-align left
    margin-bottom 10px
    line-height 32px
    span:first-child
      font-weight 700
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
  .operation-con
    text-align left
    margin-bottom 10px
    .finChecked
      margin-left 20px
      margin-right 10px
      color #999
    .finBtn
      padding 8px 10px
      border 1px solid #2770E9
      box-sizing border-box
      color #2770E9
      background #fff
  .fin-fot
    margin-top 25px
    .el-col
      &:first-child
        text-align left
      &:last-child
        text-align: right
  .fin-checked
    margin-right 20px
  .fin-blue
    color #4680ff
  .fin-red
    color #f56c6c
  .fin-green
    color #67c23a
  .fin-main .el-menu-item.is-active
    border-left 0
  .fin-dialog
    margin-bottom 0
    min-height 100vh
    .el-input.is-disabled .el-input__inner
      color #606266 !important
  .fin-dialog .el-dialog__body
    padding 10px 35px
  .fin-dialog .el-dialog__headerbtn
    top 20px
    z-index 10
  .fin-dialog .el-dialog__header
    padding 0 20px
  .modal-fot
    margin: 30px 0
  .fontWei
    font-weight 600
  .upload
    display inline-block
    margin-right 10px
  .custom-class
    top 50% !important
    left 50% !important
    transform translateX(-50%) translateY(-50%)
  .dialogFailText
    margin-top 10px
    color #D0021B
    cursor pointer
  .el-table .el-button
    padding 8px 5px
  .failText
    margin-top 15px
    line-height 1.4
    border-top 1px solid #ebeef5
    padding-top 15px
  .failDialog .el-dialog__body
    padding 0 25px 30px
  .addTableTitle
    margin-top 20px
    margin-bottom 10px
    font-size 16px
    font-weight 700
</style>
