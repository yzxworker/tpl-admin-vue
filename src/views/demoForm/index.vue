<template>
  <div class="page-container demoForm-container">
    <!--条件查询-->
    <el-form :inline="true" ref="filterForm" :model="filterForm" :rules="filterRules" class="filter-form-mod">
      <div class="filter-form-row">
        <el-form-item label-width="100px" label="姓名：" prop="userName" class="col-filter-item">
          <el-input v-model="filterForm.userName" placeholder="请输入姓名" clearable size="small"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="手机号：" prop="userPhoneNumber" class="col-filter-item">
          <el-input v-model="filterForm.userPhoneNumber" placeholder="手机号" clearable size="small"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="创建日期：" prop="createDate" class="col-filter-item">
          <el-date-picker
            class="filter-data-picker"
            prop="startDate"
            v-model="filterForm.createDate"
            :editable="false"
            value-format="yyyy-MM-dd"
            type="date"
            size="small"
            placeholder="日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label-width="100px" label="状态：" class="col-filter-item">
          <el-select v-model="filterForm.status" clearable placeholder="请选择" size="small">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="col-filter-item filter-form-submit-row">
          <div class="filter-form-submit">
            <el-button size="small" type="info" @click.stop.prevent="resetFilterForm">清空</el-button>
            <el-button size="small" type="primary" native-type="submit"
                       @click.stop.prevent="queryFilterForm"
                       :disabled="filterForm.submitting"
            >{{ filterForm.submitting?'正在查询...':'查询' }}
            </el-button>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <!--表格功能区域-->
    <div class="table-btnGroup-ctrl">
      <el-row>
        <el-button type="primary" size="mini" @click="onAddEditDialog($event,'add')">添加</el-button>
      </el-row>
    </div>
    <!--表格列表 v-loading="listLoading"-->
    <div class="m-table-mod">
      <el-table
        ref="listTable"
        :key="tableKey"
        :data="list"
        border
        fit
        highlight-current-row
        cell-class-name="col-table-item"
        @select="onTableColSelect"
        @select-all="onTableSelectAll"
        @selection-change="onTableSelectAll"
        @sort-change="onSortChange"
        style="width: 100%;">
        <el-table-column type="selection" width="55"/>
        <el-table-column type="index" label="序号" prop="id" align="center" width="60" :fixed="list.length !== 0"/>
        <el-table-column label="姓名" align="center" :fixed="list.length !== 0" prop="userName"/>
        <el-table-column label="手机号" align="center" prop="userPhoneNumber"/>
        <el-table-column label="创建时间" align="center" prop="createDate"/>
        <el-table-column label="状态" align="center" width="120" prop="status"/>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-edit" size="mini" @click="onTableEditRow(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pagination class="station-pagination"
                  v-show="total>0"
                  :total="total"
                  :pageSizes="[20,50,100]"
                  :page.sync="listQuery.pageNo"
                  :limit.sync="listQuery.pageSize"
                  :autoScroll="false"
                  @pagination="onPagination"
      />
    </div>
    <!--弹窗添加/编辑-->
    <el-dialog
      :title="textMap[currentDialogState]"
      :visible.sync="dialogFormVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      center
      class="addEdit-stationStaff-dialog"
      width="700px"
      @close="onCloseDialog('dialogForm')"
    >
      <el-form ref="dialogForm"
               :model="dialogForm"
               :rules="dialogFormRules"
               label-width="140px"
               class="dialogForm"
      >
        <div class="addEdit-stationStaff-wrap" ref="addEditWrap">
          <div class="dialogForm-row">
            <el-form-item label="姓名：" prop="userName" class="col-dialog-item">
              <el-input class="col-input-small" v-model="dialogForm.userName" clearable size="small"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="userPhoneNumber" class="col-dialog-item">
              <el-input class="col-input-small" v-model="dialogForm.userPhoneNumber" clearable size="small"></el-input>
            </el-form-item>
          </div>

          <div class="dialogForm-row">
            <el-form-item label="状态：" class="col-filter-item">
              <el-switch
                v-model="dialogForm.status"
                :active-value="true"
                active-text="正常"
                :inactive-value="false"
                inactive-text="冻结">
              </el-switch>
            </el-form-item>

          </div>

        </div>
      </el-form>
      <div slot="footer" class="dialogForm-submit-row">
        <el-button size="small" type="info" class="dialog-btn" @click="onCloseDialog">取消</el-button>
        <el-button size="small" type="primary" class="dialog-btn" @click="onSaveDialogForm"
                   :disabled="this.dialogForm.submitting">保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import {defaultFilterForm, defaultDialogForm, defaultListQuery} from './relationFieldDemoForm'// data中关联的字段
  import {filterFormRules, dialogFormRules} from './validateDemoForm'// 验证规则
  import { demoFormService } from '../../api' // api 服务

  export default {
    name: 'demoForm',
    components: {
      Pagination
    },
    filters: {},
    data() {
      return {
        // 查询表单验证
        filterRules: Object.assign({}, filterFormRules),
        filterForm: Object.assign({}, defaultFilterForm),
        statusOptions: [
          {
            value: true,
            label: '正常'
          },
          {
            value: false,
            label: '冻结'
          }
        ],
        // 表格
        tableKey: 0,
        list: [],
        listLoading: false,
        listQuery: Object.assign({}, defaultListQuery), // 分页查询条件
        total: 0,
        currentSelectedList: [],// 当前选中的对象集合
        currentSelected: null,//当前选中的对象
        // 弹窗表单
        currentDialogState: 'add',
        dialogFormVisible: false,
        dialogForm: Object.assign({}, defaultDialogForm),
        dialogFormRules: dialogFormRules,
        textMap: {
          edit: '修改xxx',
          add: '添加xxx'
        },
      }
    },
    computed: {},
    created() {
      this.queryTableList(this.listQuery);
    },
    methods: {
      /****查询条件****/
      resetFilterForm(){
        this.filterForm = Object.assign({}, defaultFilterForm);
        this.listQuery = Object.assign({}, defaultListQuery);
        this.$refs['filterForm'].resetFields();
        // 请求table列表
        this.queryTableList(this.listQuery);
      },
      queryFilterForm(){
        try {
          this.filterForm.submitting = true;
          this.$refs['filterForm'].validate(async (valid) => {
            if (valid) {
              this.listQuery = Object.assign({}, defaultListQuery, this.filterForm);
              this.queryTableList(this.listQuery);
            } else {
              console.log('error submit!');
              return false
            }
            this.filterForm.submitting = false;
          })
        } catch (e) {
          console.log('queryFilterForm error:', e);
          this.filterForm.submitting = false;
        }
      },
      // 表格数据查询
      async queryTableList(params){
        try {
          const res = await demoFormService.list(params);
          if(res && res.data){
            this.list = res.data.records;
            this.total = res.data.total;
          }
        }catch (e) {
          console.warn('queryTableList error:', e)
        }
      },
      /****表格****/
      // 表格单行选择
      onTableColSelect(selection, row){

      },
      // 全选
      onTableSelectAll(val){
        this.currentSelectedList = val;
      },
      // 排序
      onSortChange(data){
        const { column, prop, order } = data;
        // todo 排序字段
        let _asc = '';
        switch (order) {
          case 'ascending':
            // 升序
            break;
          case 'descending':
            // 降序
            break;
          default:
            // 降序
        }
        this.listQuery = Object.assign({},this.listQuery,{
          asc:_asc
        });
        this.queryTableList(this.listQuery)
      },
      // 分页
      onPagination(data){
        const { page , limit } = data;
        this.listQuery.pageNo = page;
        this.listQuery.pageSize = limit;
        this.queryTableList(this.listQuery);
      },
      /****弹窗添加编辑****/
      // 单条记录编辑
      async onTableEditRow(row){
        // 编辑
        try {
          this.currentDialogState = 'edit';
          this.dialogFormVisible = true;
          const { id } = row;
          const res = await demoFormService.getRowById(id);
          if (res && res.data) {
            this.dialogForm = Object.assign({}, res.data);
          } else {
            this.$message({
              message: '查询失败',
              type: 'warning'
            });
          }
        }catch (e) {
          console.warn('onTableEditRow error:', e)
        }
      },
      async onAddEditDialog(e, state = 'add') {
        try {
          this.currentDialogState = state;
          this.dialogFormVisible = true;
        } catch (e) {
          console.warn('onAddEditStation error:', e)
        }
      },
      onCloseDialog(){
        // 重置表单
        this.dialogForm = Object.assign({}, defaultDialogForm);
        this.$refs['dialogForm'].clearValidate();
        this.$refs['dialogForm'].resetFields();
        this.dialogFormVisible = false;
        this.currentDialogState = '';
        this.$refs.listTable.clearSelection();
        // this.$refs.addEditWrap && this.$refs.addEditWrap.scroll(0,0);// 如果有滚动条
      },
      onSaveDialogForm(){
        const currentState = this.currentDialogState === 'add';
        this.$refs['dialogForm'].validate(async (valid) => {
          if (valid) {
            try {
              if(this.dialogForm.submitting){
                return
              }
              this.dialogForm.submitting = true;
              let res;
              if (currentState) {
                // 添加
                res = await demoFormService.addDialogForm(this.dialogForm.userName,this.dialogForm.userPhoneNumber,this.dialogForm.status);
              } else {
                // 编辑
                res = await demoFormService.updateDialogForm(this.dialogForm.userName,this.dialogForm.userPhoneNumber,this.dialogForm.status);
              }
              if (res && res.rspCode === 'success') {
                this.$message({
                  message: '保存成功',
                  type: 'success',
                });
                this.onCloseDialog();
                this.queryTableList(this.listQuery)
              } else {
                this.$message({
                  message: '保存失败',
                  type: 'warning'
                });
              }
            } catch (e) {
              console.log('onSaveStationForm error:',e);
            }
            this.dialogForm.submitting = false;
            // this.$refs.addEditWrap && this.$refs.addEditWrap.scroll(0,0);
          } else {
            console.log('error submit!');
            this.dialogForm.submitting = false;
            return false
          }
        })
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../assets/styles/mixin";
  .demoForm-container {
    padding: 10px 20px;
    /*查询条件表单*/
    .filter-form-mod {
      padding: 10px;
      border-bottom: 1px solid #ddd;
      font-size: 14px;

      .create-time-picker {
        width: 230px;
      }

      .col-filter-item {
        margin-bottom: 10px;
      }

      .filter-data-picker {
        width: 160px;
      }

      .filter-form-submit-row{
        text-align: center;
        max-width: 300px;
        margin: 0 auto;
      }
    }

    .table-btnGroup-ctrl {
      padding: 20px 20px 20px 0px;
      button {
        margin-left: 0;
        margin-right: 5px;
      }
    }
    /*表格*/
    .station-table-mod{
      padding:10px 20px;
      .col-table-item .cell {
        max-height: 23px;
        @include text-overflow;
      }

      .station-pagination{
        margin-top: 0;
      }
    }
    /**弹窗添加/编辑**/
    .addEdit-demoForm-dialog{
      .col-dialog-item {
        margin-bottom: 15px;
      }

      .addEdit-station-wrap {
        max-height: 400px;
        overflow-y: auto;
        padding: 10px 20px;
      }

      .dialog-btn {
        margin-right: 20px;
      }

      .dialogForm-row {
        display: flex;
        align-items: center;
      }

      .dialogForm-data-picker{
        width: 185px;
      }
    }
  }
</style>
