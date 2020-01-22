<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 输入 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getgoodslist">
            <el-button slot="append" icon="el-icon-search" @click="getgoodslist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goadd_page">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template slot-scope="scope">{{scope.row.add_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delete_goods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 5, 10, 15]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
// import { dataFormat } from "../../utils/utils";
export default {
  name: "goodslist",
  data() {
    return {
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      goodslist: []
    };
  },
  created() {
    this.getgoodslist();
  },
  methods: {
    //   获取列表
    async getgoodslist() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryinfo
      });
      if (res.meta.status !== 200) return this.$message.error("获取失败");
      //   this.$message.success("获取成功");
      this.goodslist = res.data.goods;
      this.total = res.data.total;
      console.log(res.data);
    },
    // 分页
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize;
      this.getgoodslist();
    },
    handleCurrentChange(newpage) {
      this.queryinfo.pagenum = newpage;
      this.getgoodslist();
    },
    async delete_goods(id) {
      const confirmresult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmresult !== "confirm")
        return this.$message.info("已取消本次操作");
      const { data: res } = await this.$http.delete(`goods/${id}`);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getgoodslist();
    },
    goadd_page() {
      this.$router.push("/goods/add");
    }
  }
};
</script>

<style lang="less" scoped>
</style>