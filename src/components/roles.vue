<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addRoleBtn">添加角色</el-button>
      <el-table :data="listData" stripe style="width: 100%" border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 第一层权限 -->
            <el-row v-for="item in scope.row.children " :key="item.id" class="tagrow">
              <el-col :span="5">
                <el-tag>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(items,index) in item.children"
                  :key="items.id"
                  :class="[index===0?'':'bodertop','center']"
                >
                  <el-col :span="6">
                    <!-- 第二层权限 -->
                    <el-tag type="success">{{items.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 第三层 -->
                    <el-tag
                      closable
                      type="warning"
                      v-for="itemss in items.children"
                      :key="itemss.id"
                      @close="deletepower(scope.row,itemss.id)"
                    >{{itemss.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <div class="btn">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="modifyBtn(scope.row.id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteRole(scope.row.id)"
                >删除</el-button>
                <el-button
                  type="warning"
                  icon="el-icon-share"
                  size="mini"
                  @click="setPower(scope.row)"
                >分配权限</el-button>
              </div>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogVisibleAddRole" width="30%">
      <el-form :rules="addRoleRules" :model="addRoleForm" ref="addRole">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleFormCancel">取 消</el-button>
        <el-button type="primary" @click="verifyAddRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色 -->
    <el-dialog title="修改角色" :visible.sync="dialogVisibleModifyRole" width="30%">
      <el-form :rules="addRoleRules" :model="modifyRoleForm" ref="modifyRole">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="modifyRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="modifyRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyRoleFormCancel">取 消</el-button>
        <el-button type="primary" @click="verifyModifyRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限框 -->
    <el-dialog :title="authname" :visible.sync="dialogVisible" width="50%" @close="clearArray">
      <span>分配权限</span>
      <!-- 权限树 -->
      <!-- props是配置项 -->
      <el-tree
        :data="powerTree"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="treeProps"
        :default-checked-keys="defaultKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyPower()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRolesList,
  deleRolesPower,
  allPower,
  setPowerbtn,
  addRoleReq,
  modifyRoleReq,
  deleteRoleReq
} from '../assets/api/home'
export default {
  data() {
    return {
      listData: [],
      dialogVisible: false,
      dialogVisibleAddRole: false,
      dialogVisibleModifyRole: false,
      // 在权限框中title的名字
      authname: '',
      powerTree: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的id
      defaultKeys: [],
      roleId: '',
      addRoleForm: {
        roleDesc: '',
        roleName: ''
      },
      modifyRoleForm: {
        roleDesc: '',
        roleName: ''
      },
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取角色列表
    async getRoles() {
      const { data: res } = await getRolesList()
      this.listData = res.data
    },
    // 删除指定权限
    async deletepower(role, powerId) {
      const result = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        return err
      })
      if (result === 'confirm') {
        const { data: res } = await deleRolesPower(role.id, powerId)
        this.$message.success('删除权限成功')
        role.children = res.data
      } else {
        this.$message.info('已取消删除')
      }
    },
    // 分配权限
    async setPower(children) {
      this.roleId = children.id
      this.authname = children.roleName
      this.dialogVisible = true
      const { data: res } = await allPower('tree')
      this.powerTree = res.data
      this.getId(children)
    },
    // 递归拿到第三层权限的id
    getId(parmas) {
      if (!parmas.children) {
        return this.defaultKeys.push(parmas.id)
      }
      parmas.children.forEach(element => {
        this.getId(element)
      })
    },
    // 对话框关闭的时候清空数组
    clearArray() {
      this.defaultKeys = []
    },
    // 对话框点击确定按钮
    async modifyPower() {
      this.dialogVisible = false
      // 获取半选中节点
      const halfChecked = this.$refs.tree.getHalfCheckedKeys()
      // 获取全选中节点
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      // 将数组打散转化成字符串
      let str = [...halfChecked, ...checkedKeys].join(',')
      await setPowerbtn(this.roleId, str)
      this.$message.success('分配权限成功')
      this.getRoles()
    },
    // 添加用户角色
    addRoleBtn() {
      this.dialogVisibleAddRole = true
    },
    // 取消添加角色
    addRoleFormCancel() {
      this.dialogVisibleAddRole = false
      this.$refs.addRole.resetFields()
      this.$message.info('取消添加角色')
    },
    // 确认添加角色
    verifyAddRole() {
      this.$refs.addRole.validate(async validate => {
        if (!validate) {
          return this.$message.error('请按要求填写表单')
        } else {
          this.dialogVisibleAddRole = false
          this.$message.success('添加成功')
          await addRoleReq(this.addRoleForm)
          this.$refs.addRole.resetFields()
          this.getRoles()
        }
      })
    },
    // 修改按钮
    modifyBtn(id) {
      this.roleId = id
      this.dialogVisibleModifyRole = true
      console.log(this.roleId)
    },
    // 修改角色取消
    modifyRoleFormCancel() {
      this.dialogVisibleModifyRole = false
      this.$refs.modifyRole.resetFields()
      this.$message.info('取消添加角色')
    },
    // 确认修改角色
    verifyModifyRole() {
      this.$refs.modifyRole.validate(async validate => {
        if (!validate) {
          return this.$message.error('请按要求填写表单')
        } else {
          this.dialogVisibleModifyRole = false
          await modifyRoleReq(this.roleId, this.modifyRoleForm)
          this.$message.success('编辑角色成功')
          this.$refs.modifyRole.resetFields()
          this.getRoles()
        }
      })
    },
    // 角色删除按钮
    async deleteRole(id) {
      const deleteResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (deleteResult === 'confirm') {
        await deleteRoleReq(id)
        this.$message.success('成功删除角色')
        this.getRoles()
      } else {
        this.$message.info('取消删除')
      }
    }
  },
  created() {
    this.getRoles()
  }
}
</script>
<style scoped>
.el-breadcrumb {
  font-size: 12px;
  margin-bottom: 15px;
}
.el-table {
  margin-top: 15px;
}
.tagrow {
  border-bottom: 1px solid #eee;
}
.tagrow:first-child {
  border-top: 1px solid #eee;
}
.tagrow .el-tag {
  margin-top: 20px;
  margin-bottom: 10px;
  margin: 10px;
}
.bodertop {
  border-top: 1px solid #eee;
}
.tagrow {
  display: flex;
  align-items: center;
}
.center {
  display: flex;
  align-items: center;
}
</style>
