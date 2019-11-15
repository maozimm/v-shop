<template>
  <div class="goodsParams">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
      <el-row class="choose">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            expand-trigger="hover"
            :options="categoriesList"
            v-model="selectedKeys"
            :props="cascaderProps"
            @change="cascaderChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab栏 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="1">
          <el-button type="primary" class="margin" :disabled="btnFlag" @click="addParamsBtn">添加参数</el-button>
          <el-table border :data="paramsList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  class="tagRight"
                  closable
                >{{item}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  type="primary"
                  @click="modifyParamsBtn(scope.row.attr_id,scope.row.cat_id)"
                >修改参数</el-button>
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  @click="deleteParamsBtn(scope.row.attr_id,scope.row.cat_id)"
                >删除参数</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="2">
          <el-button type="primary" class="margin" :disabled="btnFlag" @click="addParamsBtn">添加属性</el-button>
          <el-table border :data="paramsList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  class="tagRight"
                  closable
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  ref="TagBtn"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  type="primary"
                  @click="modifyParamsBtn(scope.row.attr_id,scope.row.cat_id)"
                >修改属性</el-button>
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  @click="deleteParamsBtn(scope.row.attr_id,scope.row.cat_id)"
                >删除属性</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="changeAttr_sel=='many'?'添加参数':'添加属性'"
      :visible.sync="dialogVisibleAddParams"
      width="30%"
      @close="addParamsClose"
    >
      <el-form :model="addParmasForm" :rules="rules" ref="addParmasRef">
        <el-form-item :label="changeAttr_sel=='many'?'参数名称':'属性名称'" prop="attr_name">
          <el-input v-model="addParmasForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAddParams = false">取 消</el-button>
        <el-button type="primary" @click="addParamsConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      :title="changeAttr_sel=='many'?'修改参数':'修改属性'"
      :visible.sync="dialogVisibleModifyParams"
      width="30%"
      @close="modifyParamsClose"
    >
      <el-form :model="modifyParmasForm" :rules="rules" ref="modifyParmasRef">
        <el-form-item :label="changeAttr_sel=='many'?'参数名称':'属性名称'" prop="attr_name">
          <el-input v-model="modifyParmasForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleModifyParams = false">取 消</el-button>
        <el-button type="primary" @click="modifyParamsConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getParamsListReq,
  addParamsReq,
  modifyParamsReq,
  deleteParamsReq
} from '../assets/api/home'
import axios from 'axios'
export default {
  data() {
    return {
      categoriesList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器当前选中的id
      selectedKeys: null,
      // tab栏选中项
      activeName: '1',
      // 表格数据源
      paramsList: [],
      // 控制按钮状态
      btnFlag: true,
      dialogVisibleAddParams: false,
      dialogVisibleModifyParams: false,
      modifyCat_id: null,
      modifyAttr_id: null,
      inputVisible: false,
      changeAttr_sel: 'many',
      // 添加表格的数据
      addParmasForm: {
        attr_name: '',
        attr_sel: 'many'
      },
      // 修改表格的数据
      modifyParmasForm: {
        attr_name: '',
        attr_sel: 'many'
      },
      arrtId: null,
      // 验证规则
      rules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2到 8个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getCategoriesList() {
      const { data: res } = await axios.get('/categories')
      this.categoriesList = res.data
    },
    // 联级选择器发生变化
    async cascaderChange() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.btnFlag = true
      } else {
        this.showParams(this.changeAttr_sel)
        this.btnFlag = false
        this.arrtId = this.selectedKeys[this.selectedKeys.length - 1]
      }
    },
    // tab栏发生切换
    handleClick() {
      if (this.activeName === '1') {
        this.changeAttr_sel = 'many'
        this.addParmasForm.attr_sel = 'many'
        this.modifyParmasForm.attr_sel = 'many'
        if (this.selectedKeys !== null) {
          this.showParams(this.changeAttr_sel)
        }
      } else {
        this.changeAttr_sel = 'only'
        this.addParmasForm.attr_sel = 'only'
        this.modifyParmasForm.attr_sel = 'only'
        if (this.selectedKeys !== null) {
          this.showParams(this.changeAttr_sel)
        }
      }
    },
    addParamsBtn() {
      this.dialogVisibleAddParams = true
    },
    // 添加对话框关闭
    addParamsClose() {
      this.dialogVisibleAddParams = false
      this.$refs.addParmasRef.resetFields()
    },
    // 确认添加
    async addParamsConfirm() {
      this.$refs.addParmasRef.validate(async validate => {
        if (!validate) {
          this.$message.error('请按要求填写表单')
        } else {
          await addParamsReq(this.arrtId, this.addParmasForm)
          this.$message.success('添加成功')
          this.dialogVisibleAddParams = false
          this.showParams(this.changeAttr_sel)
        }
      })
    },
    async showParams(type) {
      const { data: res } = await getParamsListReq(
        this.selectedKeys[this.selectedKeys.length - 1],
        type
      )
      this.paramsList = res.data
      this.paramsList.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      })
    },
    // 修改按钮
    modifyParamsBtn(id1, id2) {
      this.dialogVisibleModifyParams = true
      this.modifyAttr_id = id1
      this.modifyCat_id = id2
    },
    // 修改对话框关闭
    modifyParamsClose() {
      this.dialogVisibleModifyParams = false
      this.$refs.modifyParmasRef.resetFields()
    },
    // 确认修改
    async modifyParamsConfirm() {
      this.$refs.modifyParmasRef.validate(async validate => {
        if (!validate) {
          this.$message.error('请按要求填写表单')
        } else {
          await modifyParamsReq(
            this.modifyCat_id,
            this.modifyAttr_id,
            this.modifyParmasForm
          )
          this.$message.success('修改成功')
          this.dialogVisibleModifyParams = false
          this.showParams(this.changeAttr_sel)
        }
      })
    },
    // 删除按钮
    async deleteParamsBtn(id1, id2) {
      var name
      if (this.changeAttr_sel === 'many') {
        name = '参数'
      } else {
        name = '属性'
      }
      const result = await this.$confirm(
        '此操作将永久删除该' + name + ', 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (result === 'cancel') {
        this.$message.info('取消删除')
      } else {
        await deleteParamsReq(id2, id1)
        this.$message.success('删除成功')
        this.showParams(this.changeAttr_sel)
      }
    },
    // input
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput(row) {
      console.log(row, 88888)
      console.log(row.inputVisible)
      this.inputVisible = true
      console.log(this.$refs.TagBtn)
      this.$nextTick(() => {
        row.inputVisible = true
        console.log(112222)
        // this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = 0
      this.inputValue = ''
    }
  },
  created() {
    this.getCategoriesList()
  }
}
</script>
<style scoped>
.el-breadcrumb {
  font-size: 12px;
  margin-bottom: 15px;
}
.choose {
  margin: 20px 0 20px 0;
}
.margin {
  margin-bottom: 20px;
}
.tagRight {
  margin-right: 10px;
}
.input-new-tag {
  width: 200px;
}
</style>
