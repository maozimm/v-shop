<template>
  <div class="goddAdd">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card
      ><el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="true"
      >
      </el-alert>
      <el-steps
        :space="200"
        finish-status="success"
        align-center
        :active="activeIndex - 0"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-tabs tab-position="left" style="height: 200px;" v-model="activeIndex">
        <el-tab-pane label="基本信息" name="0">用户管理</el-tab-pane>
        <el-tab-pane label="商品参数" name="1">配置管理</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">定时任务补偿</el-tab-pane>
        <el-tab-pane label="商品内容" name="4">定时任务补偿</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 控制步骤条的索引
      activeIndex: '0'
    }
  }
}
</script>
<style scoped>
.el-breadcrumb {
  font-size: 12px;
  margin-bottom: 15px;
}
.el-alert {
  margin-bottom: 50px;
}
</style>
