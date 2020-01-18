<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="showdiglog">添加分类</el-button>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="tree"
        :data="cate_list"
        :columns="columnconfig"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level ===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot-scope="scope" slot="opt">
          {{scope.id}}
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editform(scope.row.cat_id)"
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteform(scope.row.cat_id)"></el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 5, 10, 15]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      ></el-pagination>
      <!-- 添加的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="dialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @close="dialog_reset"
        ref="dia_ref"
      >
        <el-form :rules="add_rules" :model="addform" ref="add_ref">
          <el-form-item prop="cat_name" label="分类名称:">
            <el-input v-model="addform.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类:" class="cas_item">
            <el-cascader
              expand-trigger="hover"
              v-model="selectedoptions"
              :options="parent_catlist"
              :props="cat_config"
              @change="parent_catchange"
              clearable
              change-on-select="true"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addcat">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改分类的对话框 -->
      <el-dialog title="修改分类" :visible.sync="edit_dialogVisible" width="50%">
        <el-form :rules="add_rules" :model="edit" ref="edit_ref">
          <el-form-item prop="cat_name" label="分类名称:">
            <el-input v-model="edit.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="edit_dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add_edit_form">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "cate",
  created() {
    this.getcategory();
  },
  data() {
    return {
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //商品分类列表
      cate_list: [],
      //总数据条数
      total: 0,
      //表格的列配置
      columnconfig: [
        { label: "分类名称", prop: "cat_name" },
        { label: "是否有效", type: "template", template: "isok" },
        { label: "排序", type: "template", template: "sort" },
        { label: "操作", type: "template", template: "opt" }
      ],
      dialogVisible: false,
      //添加分类
      addform: {},
      add_rules: {
        cat_name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      //父级分类id
      cat_pid: 0,
      //等级
      cat_level: 0,
      //父级分类的列表
      parent_catlist: [],
      //级联选择器的配置对象
      cat_config: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //选中的分类的id
      selectedoptions: [],
      //修改分类的对话框
      edit_dialogVisible: false,
      edit: {},
    };
  },
  methods: {
    //获取分类列表
    async getcategory() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryinfo
      });
      if (res.meta.status !== 200) return this.$message.error("获取失败");
      this.cate_list = res.data.result;
      this.total = res.data.total;
    },
    //监听pagesize
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize;
      this.getcategory();
    },
    //监听pagenum
    handleCurrentChange(newpage) {
      this.queryinfo.pagenum = newpage;
      this.getcategory();
    },
    //添加的对话框
    showdiglog() {
      this.getparentcatlist();
      this.dialogVisible = true;
    },
    //获取父级分类的列表
    async getparentcatlist() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取分类数据失败");
      this.parent_catlist = res.data;
    },
    //级联选择器发生变化
    parent_catchange() {
      if (this.selectedoptions.length > 0) {
        // 把父级分类的id传出去
        this.addform.cat_pid = this.selectedoptions[
          this.selectedoptions.length - 1
        ];
        this.addform.cat_level = this.selectedoptions.length;
        return;
      } else {
        this.addform.cat_pid = 0;
        this.addform.cat_level = 0;
      }
    },
    //添加
    addcat() {
      this.$refs.add_ref.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("categories", this.addform);
        if (res.meta.status !== 201) return this.$message.error("添加分类失败");
        this.$message.success("添加成功");
        this.getcategory();
        this.dialogVisible = false;
      });
    },
    //关闭重置表单
    dialog_reset() {
      this.$refs.add_ref.resetFields();
      this.selectedoptions = [];
      this.addform.cat_level = 0;
      this.addform.cat_pid = 0;
    },
    async editform(id) {
      this.edit_dialogVisible = true;
      // console.log(id);
      const { data: res } = await this.$http.get("categories/" + id);
      this.edit = res.data;
    },
    //修改
    add_edit_form() {
      // console.log(this.edit.cat_id)
      this.$refs.edit_ref.validate(async valid => {
        if (!valid) return;
        console.log(valid)
        const { data: res } = await this.$http.put(
          "categories/" + this.edit.cat_id,this.edit
        );
        if (res.meta.status !== 200) return this.$message.error("提交失败");
        this.$message.success("修改成功");
        this.getcategory();
      });
      this.edit_dialogVisible = false;
    },
    //删除
   async deleteform(id){
      console.log(id)
            const confirmresult = await this.$confirm(
        "此操作将永久删除该条分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if(confirmresult !=='confirm') return this.$message.info('已经取消本次操作')
      const{data:res} = await this.$http.delete('categories/'+id)
      if(res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getcategory()
    }
  }
};
</script>

<style lang="less" scoped>
.tree {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
.el-input {
  width: 80%;
}
.el-cascader {
  width: 80%;
  margin-left: 10px;
}
</style>