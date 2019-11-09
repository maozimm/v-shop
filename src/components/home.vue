<template>
  <el-container class="container">
    <el-header class="header"></el-header>
    <el-container class="asdie_main">
      <el-aside :width="collapse_flag?'56px':'300px'">
        <el-button type="info" @click="changecollapse">折叠</el-button>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
          @open="handleOpen"
          @close="handleClose"
          :unique-opened="true"
          :collapse="collapse_flag"
          :collapse-transition="false"
          :default-active="keepstate"
          :router="true"
        >
          <el-submenu :index="item.id+''" v-for="item in menus" :key="item.id">
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                :index="items.path+''"
                v-for="items in item.children"
                :key="items.id"
                @click="keepstates(items.path+'')"
              >
                <i :class="icons[items.id]"></i>
                {{items.authName}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: '',
      icons: {
        125: 'iconfont icon-yonghuguanli',
        103: 'iconfont icon-quanxian',
        101: 'iconfont icon-shangpinguanli',
        102: 'iconfont icon-6',
        145: 'iconfont icon-shujutongji',
        110: 'iconfont icon-ico-',
        111: 'iconfont icon-jiaoseliebiao',
        112: 'iconfont icon-permissions-list',
        104: 'iconfont icon-shangpinliebiao',
        115: 'iconfont icon-shangpinfenlei',
        121: 'iconfont icon-fenlei',
        107: 'iconfont icon-dingdanguanli',
        146: 'iconfont icon-shujubaobiao'
      },
      collapse_flag: false,
      keepstate: ''
    }
  },
  methods: {
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    getmenus() {
      return this.$http.get('/menus')
    },
    changecollapse() {
      this.collapse_flag = !this.collapse_flag
    },
    keepstates(data) {
      window.sessionStorage.setItem('keepstate', data)
      this.keepstate = data
    }
  },
  async created() {
    const { data: res } = await this.getmenus()
    this.menus = res.data
    this.keepstate = window.sessionStorage.getItem('keepstate')
  }
}
</script>
<style scoped>
.container {
  height: 100%;
}
.container .header {
  background-color: #333;
}
.container .el-aside {
  background-color: #545c64;
}
.container .el-aside .el-button {
  width: 100%;
  background-color: #545c64;
}
.container .el-aside .el-menu {
  border-right: 0;
}
.container .el-main {
  background-color: #eaedf1;
}
i[class^='iconfont'] {
  margin-right: 10px;
  font-size: 20px;
}
</style>
