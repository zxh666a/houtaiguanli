<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-alert title="提示：只允许给第三级分类添加相关参数" type="warning" :closable="false" show-icon></el-alert>
      <!-- 分类 -->
      <el-row class="cat_row">
        <el-col>
          <span>选择商品分类</span>
          <el-cascader
            v-model="selected_cat"
            :options="catlist"
            expand-trigger="hover"
            @change="handleChange"
            :props="cascader_config"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isbtndisable"
            @click="add_dialogVisible=true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="many_tabledata" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 输入文本框 -->
                <el-input
                  class="tag_input"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  ref="saveTagInput"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
                <!-- 渲染tag -->
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="tag_close(index,scope.row)"
                >{{item}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  icon="el-icaon-edit"
                  type="primary"
                  size="mini"
                  @click="showeditdialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  icon="el-icaon-delete"
                  type="danger"
                  size="mini"
                  @click="delete_cat(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isbtndisable"
            @click="add_dialogVisible=true"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="only_tabledata" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 输入文本框 -->
                <el-input
                  class="tag_input"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  ref="saveTagInput"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
                <!-- 渲染tag -->
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="tag_close(index,scope.row)"
                >{{item}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  icon="el-icaon-edit"
                  type="primary"
                  size="mini"
                  @click="showeditdialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  icon="el-icaon-delete"
                  type="danger"
                  size="mini"
                  @click="delete_cat(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加'+titletext"
      :visible.sync="add_dialogVisible"
      width="50%"
      @close="add_dialog_close"
    >
      <el-form :model="add_form" ref="formref" label-width="80px" :rules="add_form_rules">
        <el-form-item :label="titletext" prop="attr_name" ref="add_dia_refs">
          <el-input v-model="add_form.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="add_dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add_params">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改'+titletext"
      :visible.sync="edit_dialogVisible"
      width="50%"
      @close="edit_dialog_close"
    >
      <el-form :model="edit_form" ref="edit_formref" label-width="80px" :rules="edit_form_rules">
        <el-form-item :label="titletext" prop="attr_name" ref="edit_dia_refs">
          <el-input v-model="edit_form.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="edit_dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit_params">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "params",
  data() {
    return {
      catlist: [],
      cascader_config: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selected_cat: [],
      activeName: "many",
      // 表格
      many_tabledata: [],
      only_tabledata: [],
      add_dialogVisible: false,
      //添加参数的表单数据
      add_form: {
        attr_name: ""
      },
      add_form_rules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      edit_dialogVisible: false,
      edit_form: {},
      edit_form_rules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getcatlist();
  },
  computed: {
    // 按钮是否可用
    isbtndisable() {
      if (this.selected_cat.length !== 3) {
        return true;
      }
      return false;
    },
    // 三级id
    catid() {
      if (this.selected_cat.length === 3) {
        return this.selected_cat[2];
      }
      return null;
    },
    // 计算title
    titletext() {
      if (this.activeName === "many") return "动态参数";
      return "静态属性";
    }
  },
  methods: {
    //获取分类数据
    async getcatlist() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) return this.$methods.error("获取数据失败");
      this.catlist = res.data;
    },
    // 选择框变化
    handleChange() {
      this.getparams();
    },
    //获取数据
    async getparams() {
      //保证只能选中第三级的分类
      if (this.selected_cat.length !== 3) {
        this.selected_cat = [];
        this.many_tabledata = [];
        this.only_tabledata = [];
        return;
      }
      //根据所选分类的id和面板获取对应的数据
      const { data: res } = await this.$http.get(
        "categories/" + this.catid + "/attributes",
        {
          params: { sel: this.activeName }
        }
      );
      console.log(this.catid);
      if (res.meta.status !== 200) return;

      //空格分隔为数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        //控制文本框的显示与隐藏
        item.inputVisible = false;
        item.inputValue = "";
      });
      console.log(res.data);
      if (this.activeName === "many") {
        this.many_tabledata = res.data;
      }
      this.only_tabledata = res.data;
    },
    // tab
    handleTabClick() {
      this.getparams();
    },
    add_dialog_close() {
      this.$refs.formref.resetFields();
    },
    edit_dialog_close() {
      this.$refs.edit_formref.resetFields();
    },
    //添加
    add_params() {
      this.$refs.formref.validate(async valid => {
        if (!valid) return this.$message.error("傻逼");
        const { data: res } = await this.$http.post(
          `categories/${this.catid}/attributes`,
          {
            attr_name: this.add_form.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) return this.$message.error("添加失败");
        this.$message.success("添加成功");
        console.log(valid);
      });
      this.add_dialogVisible = false;
      this.getparams();
    },
    // 修改对话框的显示
    async showeditdialog(id) {
      console.log(id);
      const { data: res } = await this.$http.get(
        `categories/${this.catid}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) return;
      this.edit_form = res.data;
      this.edit_dialogVisible = true;
    },
    // 修改
    edit_params() {
      this.$refs.edit_formref.validate(async valid => {
        if (!valid) return;
        const {
          data: res
        } = await this.$http.put(
          `categories/${this.catid}/attributes/${this.edit_form.attr_id}`,
          { attr_name: this.edit_form.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status !== 200) return this.$message.error("失败");
        this.$message.success("修改成功");
        this.edit_dialogVisible = false;
        this.getparams();
      });
    },
    // 删除
    async delete_cat(id) {
      const confirmresult = await this.$confirm(
        "此操作将永久删除该条参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmresult !== "confirm")
        return this.$message.info("已取消该操作");
      const { data: res } = await this.$http.delete(
        `categories/${this.catid}/attributes/${id}`
      );
      console.log(res.meta.status);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.edit_dialogVisible = false;
      this.getparams();
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      //发起请求
      this.saveattrvals(row);
    },
    //对attr_vals的操作，保存到数据库
    async saveattrvals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.catid}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) return this.$message.error("修改失败");
      this.$message.success("修改成功");
    },
    showInput(row) {
      row.inputVisible = true;
      //自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
        console.log(_);
      });
    },
    //删除tag
    tag_close(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveattrvals(row);
    }
  }
};
</script>

<style lang="less" scoped>
.cat_row {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.tag_input {
  width: 84px;
}
</style>