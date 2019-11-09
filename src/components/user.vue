<template>
  <div class="user">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <div>
        <el-row :gutter="20">
          <!-- 查询框 -->
          <el-col :span="7">
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="query"
              clearable
              @clear="getuer"
            >
              <el-button slot="append" icon="el-icon-search" @click="getuer"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="dialogVisible = true">添加</el-button>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table :data="tableData" stripe style="width: 100%" border>
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="username" label="姓名" width="180"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="250"></el-table-column>
          <el-table-column prop="mobile" label="电话" width="250"></el-table-column>
          <el-table-column prop="role_name" label="角色" width="150"></el-table-column>
          <el-table-column label="状态" width="150">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="switchchange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              {{scope.row.id}}
              <el-button-group>
                <div class="btn">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="modifyformbtn(scope.row)"
                  ></el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="deleteById(scope.row.id)"
                  ></el-button>
                  <el-button type="warning" icon="el-icon-share" size="mini"></el-button>
                </div>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="block paginations">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current_page"
          :page-sizes="[5,10]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <!-- 添加用户弹框 -->
      <div class="addform">
        <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%">
          <!-- 添加表单 -->
          <el-form
            :model="addForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm">取 消</el-button>
            <el-button type="primary" @click="addform">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <!-- 修改用户表单 -->
      <div class="modifyform">
        <el-dialog title="修改用户" :visible.sync="dialogVisible_modify" width="50%">
          <!-- 修改表单 -->
          <el-form
            :model="modifyForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="modifyForm.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="modifyForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="modifyForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="modifyRestForm">取 消</el-button>
            <el-button type="primary" @click="modifyFormPut">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
import {
  usersdata,
  statechange,
  adduser,
  modifyuser,
  deleteUser
  // deleteUser
} from '../assets/api/home'
export default {
  data() {
    // 自定义邮箱 手机验证规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      } else {
        // 邮箱不合法时 抛出错误
        callback(new Error('请输入合法的邮箱'))
      }
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法的手机号'))
      }
    }
    return {
      tableData: [],
      total: null,
      current_page: null,
      page_size: null,
      query: '',
      dialogVisible: false,
      dialogVisible_modify: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      modifyForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      id: '',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 状态开关
    async switchchange(data) {
      const { data: res } = await statechange(
        `users/${data.id}/state/${data.mg_state}`
      )
      if (res.meta.status === 200) {
        this.$message.success('修改权限成功')
      } else {
        this.$message.error('修改权限失败')
        data.mg_state = !data.mg_state
      }
    },
    // 页数框逻辑
    async handleSizeChange(val) {
      const { data: res } = await usersdata({
        pagenum: 1,
        pagesize: val
      })
      this.page_size = val
      this.tableData = res.data.users
    },
    // 点击页数逻辑
    async handleCurrentChange(val) {
      const { data: res } = await usersdata({
        pagenum: val,
        pagesize: this.page_size
      })
      this.current_page = val
      this.tableData = res.data.users
    },
    // 获取角色列表
    async getuer() {
      const { data: res } = await usersdata({
        query: this.query,
        pagenum: this.current_page,
        pagesize: this.page_size
      })
      this.total = res.data.total
      this.tableData = res.data.users
    },
    // 清除表单
    resetForm(formName) {
      this.$refs.ruleForm.resetFields()
      this.dialogVisible = false
    },
    // 添加用户
    addform() {
      this.$refs.ruleForm.validate(async validate => {
        if (!validate) {
          return this.$message.error('请按要求填写表单')
        } else {
          this.$message.success('添加成功')
          await adduser(this.addForm)
          this.getuer()
          this.resetForm()
        }
      })
    },
    // 修改表单清空
    modifyRestForm() {
      this.$refs.ruleForm.resetFields()
      this.dialogVisible_modify = false
    },
    // 修改用户按钮
    modifyformbtn(data) {
      this.dialogVisible_modify = true
      this.modifyForm.username = data.username
      this.id = data.id
    },
    // 修改用户确定
    modifyFormPut() {
      this.$refs.ruleForm.validate(async validate => {
        if (!validate) {
          return this.$message.error('请按要求填写表单')
        } else {
          this.$message.success('添加成功')
          await modifyuser(this.id, {
            email: this.modifyForm.email,
            mobile: this.modifyForm.mobile
          })
          this.getuer()
          this.modifyRestForm()
        }
      })
    },
    // 删除用户按钮
    async deleteById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult === 'confirm') {
        await deleteUser(id)
        this.$message.success('已删除成功')
        this.getuer()
      } else {
        return this.$message.info('已取消删除')
      }
    }
  },
  async created() {
    this.current_page = 1
    this.page_size = 5
    const { data: res } = await usersdata({
      query: '',
      pagenum: 1,
      pagesize: 5
    })
    this.total = res.data.total
    this.tableData = res.data.users
  }
}
</script>
<style scoped>
.el-breadcrumb {
  font-size: 12px;
  margin-bottom: 15px;
}
.el-table {
  margin-top: 20px;
}
.paginations {
  margin-top: 20px;
}
.addform .el-input {
  margin-top: 10px;
}
</style>
