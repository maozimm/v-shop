<template>
  <div class="categories">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addBtn">添加分类</el-button>
      <tree-table
        :data="categoriesList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效插槽 -->
        <template slot-scope="scope" slot="isvalid">
          <i
            class="iconfont icon-Icon-zhengque-"
            v-if="scope.row.cat_deleted===false"
            style="color:lightgreen;"
          ></i>
          <i class="iconfont icon-cuowu" v-else style="color:red;"></i>
        </template>
        <!-- 排序插槽 -->
        <template slot-scope="scope" slot="sort">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作插槽 -->
        <template slot-scope="scope" slot="operate">
          {{scope.row.cat_id}}
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="modifyCategories(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCategories(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <div class="block marginTop">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="5"
          layout="total,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisibleAdd"
      width="30%"
      @close="addCategoriesClose"
    >
      <el-form
        label-width="80px"
        labelPosition="right"
        :model="addCategoriesForm"
        :rules="rules"
        ref="addCategoriesForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoriesForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <div class="block">
            <el-cascader
              :options="parentCategoriesList"
              v-model="selectedKeys"
              expand-trigger="hover"
              :props="cascaderProps"
              @change="cascaderChange"
              clearable
              change-on-select
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoriesCancel">取 消</el-button>
        <el-button type="primary" @click="addCategoriesConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改会话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="dialogVisibleModify"
      width="30%"
      @close="modifyCategoriesClose"
    >
      <el-form ref="modifyCategoriesRef" :rules="rules" :model="modifyCategoriesForm">
        <el-form-item label="分类名称" label-width="80px" prop="cat_name">
          <el-input v-model="modifyCategoriesForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleModify = false">取 消</el-button>
        <el-button type="primary" @click="modifyCategoriesConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCategoriesReq,
  addCategoriesReq,
  modifyCategoriesReq,
  deleteCategoriesReq
} from '../assets/api/home'
import axios from 'axios'

export default {
  data() {
    return {
      categoriesList: [],
      total: null,
      dialogVisibleAdd: false,
      dialogVisibleModify: false,
      // 点击的当前页
      currentPage: 1,
      parentCategoriesList: [],
      // 级联选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器选中的id
      selectedKeys: null,
      // 修改时的id
      modifyCategoriescat_id: null,
      addCategoriesForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      modifyCategoriesForm: {
        cat_name: ''
      },
      rules: {
        cat_name: [
          { required: true, message: '请输分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isvalid'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate'
        }
      ]
    }
  },
  methods: {
    // 获取分类列表
    async getCategoriesList(pagenum) {
      const { data: res } = await getCategoriesReq(pagenum)
      this.total = res.data.total
      this.categoriesList = res.data.result
    },
    handleCurrentChange(val) {
      this.getCategoriesList(val)
      this.currentPage = val
    },
    async addBtn() {
      this.dialogVisibleAdd = true
      const { data: res } = await axios.get('/categories', {
        params: {
          type: 2
        }
      })
      this.parentCategoriesList = res.data
    },
    // 级联选择器发生变化时
    cascaderChange() {
      if (this.selectedKeys.length > 0) {
        var length = this.selectedKeys.length - 1
        this.addCategoriesForm.cat_pid = this.selectedKeys[length]
        this.addCategoriesForm.cat_level = this.selectedKeys.length
      } else {
        this.addCategoriesForm.cat_pid = 0
        this.addCategoriesForm.cat_level = 0
      }
    },
    // 关闭添加分类弹框
    addCategoriesClose() {
      this.$refs.addCategoriesForm.resetFields()
      // 置空级联选择器选中的数组
      this.selectedKeys = []
    },
    // 取消添加角色
    addCategoriesCancel() {
      this.dialogVisibleAdd = false
      this.$refs.addCategoriesForm.resetFields()
      this.selectedKeys = []
      this.$message.info('取消成功')
    },
    // 确认添加角色
    addCategoriesConfirm() {
      this.$refs.addCategoriesForm.validate(async validate => {
        if (!validate) {
          this.$message.error('请按要求填写表单')
        } else {
          await addCategoriesReq(this.addCategoriesForm)
          this.getCategoriesList(this.currentPage)
          this.dialogVisibleAdd = false
          this.$message.success('添加分类成功')
        }
      })
    },
    // 修改角色
    modifyCategories(id) {
      this.dialogVisibleModify = true
      this.modifyCategoriescat_id = id
    },
    // 关闭修改角色对话框
    modifyCategoriesClose() {
      this.$refs.modifyCategoriesRef.resetFields()
    },
    // 确定修改角色
    modifyCategoriesConfirm() {
      this.$refs.modifyCategoriesRef.validate(async validate => {
        if (!validate) {
          this.$message.error('请按要求填写')
        } else {
          this.dialogVisibleModify = false
          await modifyCategoriesReq(this.modifyCategoriescat_id, {
            cat_name: this.modifyCategoriesForm.cat_name
          })
          this.$message.success('修改分类成功')
          this.getCategoriesList(this.currentPage)
        }
      })
    },
    async deleteCategories(id) {
      const deleteResult = await this.$confirm(
        '此操作将永久删除该商品分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (deleteResult === 'confirm') {
        await deleteCategoriesReq(id)
        this.$message.success('成功删除商品分类')
        this.getCategoriesList(this.currentPage)
      } else {
        this.$message.info('取消删除')
      }
    }
  },
  created() {
    this.getCategoriesList(1)
  }
}
</script>
<style scoped>
.el-breadcrumb {
  font-size: 12px;
  margin-bottom: 15px;
}
.zk-table {
  margin-top: 20px;
}
.marginTop {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>
