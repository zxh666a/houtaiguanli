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
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit_goods(scope.row.goods_id)"
            ></el-button>
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
    <!-- 编辑商品 -->
    <el-dialog title="修改商品" :visible.sync="edit_Visible" width="50%">
      <el-form
        :model="edit_goodsform"
        ref="edit_formref"
        label-width="80px"
        :rules="edit_form_rules"
      >
        <el-form-item label="商品名称" prop="goods_name" ref="edit_dia_refs">
          <el-input v-model="edit_goodsform.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price" ref="edit_dia_refs">
          <el-input v-model="edit_goodsform.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number" ref="edit_dia_refs">
          <el-input v-model="edit_goodsform.goods_number" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edit_Visible = false">取 消</el-button>
        <el-button type="primary" @click="submit_goods">确 定</el-button>
      </span>
    </el-dialog>
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
      goodslist: [],
      edit_goodsform: {
        goods_weight: 1
      },
      edit_Visible: false,
      edit_form_rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ]
      }
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
    },
    async edit_goods(id) {
      const { data: res } = await this.$http.get("goods/" + id);
      if (res.meta.status !== 200) return this.$message.error("失败");
      this.edit_goodsform = res.data;
      this.edit_Visible = true;
      console.log(this.edit_goodsform);
    },
    submit_goods() {
      this.$refs.edit_formref.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `goods/${this.edit_goodsform.goods_id}`,
          this.edit_goodsform
        );
        if (res.meta.status !== 200) return this.$message("修改失败");
        this.$message.success('修改成功')
        this.edit_Visible = false
        this.getgoodslist()
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>