<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status ==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showbox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showprogress"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="修改地址" :visible.sync="dialogVisible" width="50%" @close="close_dialog">
      <el-form :model="addressForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="省市区县" prop="address1">
          <el-cascader :options="city" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="物流进度" :visible.sync="progress" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in wuliu"
          :key="index"
          :timestamp="item.time"
        >{{item.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import city from "../../assets/js/citydata";
export default {
  name: "order",
  data() {
    return {
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      orderlist: [],
      total: 0,
      dialogVisible: false,
      addressForm: {
        address1: [],
        address2: ""
      },
      rules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      city,
      progress: false,
      wuliu: []
    };
  },
  created() {
    this.getlist();
  },
  methods: {
    async getlist() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryinfo
      });
      if (res.meta.status !== 200) return;
      this.orderlist = res.data.goods;
      this.total = res.data.total;
      console.log(this.orderlist);
    },
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize;
      this.getlist();
    },
    handleCurrentChange(newpage) {
      this.queryinfo.pagenum = newpage;
      this.getlist();
    },
    showbox() {
      this.dialogVisible = true;
    },
    close_dialog() {
      this.$refs.ruleForm.resetFields();
    },
    async showprogress() {
      const { data: res } = await this.$http.get("kuaidi/1106975712662");
      if (res.meta.status !== 200) return this.$message("查询失败");
      this.wuliu = res.data;
      this.progress = true;
    }
  }
};
</script>

<style lang="less" scoped>
.el-timeline-item{
  font-size: 12px
}
</style>