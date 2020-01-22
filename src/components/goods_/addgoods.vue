<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="active_index-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab -->
      <el-form
        :model="add_Form"
        :rules="add_rules"
        ref="add_ref"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="active_index"
          :before-leave="before_tableave"
          @tab-click="tabclick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="add_Form.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="add_Form.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="add_Form.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="add_Form.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                v-model="add_Form.goods_cat"
                :options="catlist"
                :props="cascader_config"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in many_tabdata" :key="item.attr_id">
              <!-- 复选框租 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item2"
                  v-for="(item2,index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item,index) in only_tabdata" :key="index">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerobj"
              :on-success="upload_success"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor ref="myTextEditor" v-model="add_Form.goods_introduce"></quill-editor>
            <el-button type="primary" class="add_btn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="preview_Visible" width="50%">
      <img :src="previewPath" alt class="prew_img" />
    </el-dialog>
  </div>
</template>

<script>
import { deepCopy } from "../../utils/utils";
export default {
  name: "addgoods",
  data() {
    return {
      active_index: "0",
      add_Form: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: "",
        goods_cat: [],
        //图片的数组
        pics: [],
        attrs: []
      },
      add_rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      //   分类列表
      catlist: [],
      cascader_config: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      //   参数列表
      many_tabdata: [],
      only_tabdata: [],
      // 图片上传组件的请求头对象
      headerobj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewPath: "",
      preview_Visible: false
    };
  },
  created() {
    this.getcatlist();
  },
  computed: {
    catid() {
      if (this.add_Form.goods_cat.length === 3)
        return this.add_Form.goods_cat[2];
      return null;
    }
  },
  methods: {
    //   分类数据
    async getcatlist() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.catlist = res.data;
      //   console.log(res.data);
    },
    handleChange() {
      if (this.add_Form.goods_cat.length !== 3) this.add_Form.goods_cat = [];
    },
    // tab切换
    before_tableave(activename, oldname) {
      if (oldname === "0" && this.add_Form.goods_cat.length !== 3) {
        this.$message.error("请选择分类");
        return false;
      }
    },
    async tabclick() {
      //证明访问的是动态参数面板
      if (this.active_index === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.catid}/attributes`,
          {
            params: { sel: "many" }
          }
        );
        if (res.meta.status !== 200) return;
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.many_tabdata = res.data;
        console.log(res.data);
      } else if (this.active_index === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.catid}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        if (res.meta.status !== 200) return this.$message.error("失败");
        this.only_tabdata = res.data;
        console.log(res.data);
      }
    },
    //处理图片预览
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.preview_Visible = true;
    },
    //图片删除事件
    handleRemove(file) {
      // 获取临时路径
      const file_path = file.response.data.tmp_path;
      // 找到对应索引值
      const i = this.add_Form.pics.findIndex(x => x.pic === file_path);
      // splice
      this.add_Form.pics.splice(i, 1);
      console.log(this.add_Form);
    },
    // 图片上传成功的事件
    upload_success(res) {
      // 拼接得到图片信息对象
      const picinfo = { pic: res.data.tmp_path };
      // 将对象push进数组
      this.add_Form.pics.push(picinfo);
      console.log(this.add_Form);
    },
    add() {
      this.$refs.add_ref.validate(async valid => {
        if (!valid) return this.$message.error("请填写必要的表单项");
        const add_result = deepCopy(this.add_Form);
        add_result.goods_cat = add_result.goods_cat.join(",");
        // 处理动态参数和静态属性
        this.many_tabdata.forEach(item => {
          const newinfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" ")
          };
          this.add_Form.attrs.push(newinfo);
        });
        this.only_tabdata.forEach(item => {
          const newinfo = { attr_id: item.arrt_id, attr_value: item.attr_vals };
          this.add_Form.attrs.push(newinfo);
        });
        add_result.attrs = this.add_Form.attrs
        console.log(add_result);
        const {data:res} =await this.$http.post('goods',add_result)
        if(res.meta.status !==201) return this.$http.message.error('提交失败')
        this.$message.success('添加成功')
        this.$router.push('/goods')
      });
    }
  }
};
</script>

<style lang="less" scoped>
.prew_img {
  width: 100%;
}
.add_btn {
  position: relative;
  left: 90%;
  margin-top: 15px;
}
</style>