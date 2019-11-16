<template>
  <div class="goods">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 查询框 -->
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="query"
            clearable
            @clear="getQueryGoods"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getQueryGoods"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoodsLink">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table border :data="goodsList">
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
          width="800"
        ></el-table-column>
        <el-table-column
          label="商品价格(元)"
          width="150"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          width="150"
          prop="goods_weight"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | formatTime('YYYY-MM-DD hh:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block paginations">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current_page"
          :page-sizes="[5, 10]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getGoodsReq } from '../assets/api/home'

export default {
  data() {
    return {
      query: '',
      goodsList: [],
      // 列表数据总数
      total: null,
      // 当前页
      current_page: 1,
      // 当前每页条数
      current_size: 10
    }
  },
  methods: {
    getuer() {},
    // 获取商品列表
    async getGoods(query, num, size) {
      const { data: res } = await getGoodsReq(query, num, size)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleCurrentChange(val) {
      this.current_page = val
      this.getGoods(this.query, val, this.current_size)
    },
    handleSizeChange(val) {
      this.current_size = val
      this.getGoods(this.query, this.current_page, val)
    },
    // 商品查询
    getQueryGoods() {
      this.current_page = 1
      this.getGoods(this.query, this.current_page, this.current_size)
    },
    // 跳转到添加商品页面
    addGoodsLink() {
      this.$router.push('/goods/add')
    }
  },
  created() {
    this.getGoods(this.query, 1, 10)
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
</style>
