<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary">添加角色</el-button>
      <el-table :data="listData" stripe style="width: 100%" border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="item in scope.row.children " :key="item.id" class="tagrow">
              <el-col :span="5">
                <el-tag closable>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(items,index) in item.children"
                  :key="items.id"
                  :class="[index===0?'':'bodertop']"
                >
                  <el-col :span="6">
                    <el-tag closable type="success">{{items.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="success"
                      v-for="itemss in items.children"
                      :key="itemss.id"
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
            {{scope.row.id}}
            <el-button-group>
              <div class="btn">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                <el-button type="warning" icon="el-icon-share" size="mini">分配权限</el-button>
              </div>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { getRolesList } from '../assets/api/home'
export default {
  data() {
    return {
      listData: []
    }
  },
  methods: {},
  async created() {
    const { data: res } = await getRolesList()
    this.listData = res.data
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
</style>
