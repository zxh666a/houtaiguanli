<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 输入框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getuserlist">
            <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="isdialogVisible=!isdialogVisible">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="userlist" style="width: 100%" border :stripe="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="权限"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="switchchange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="removeuserbyid(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配成员" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-star-off"
                circle
                size="mini"
                @click="showdialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 5, 10, 15]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加用户 -->
      <el-dialog
        title="修改用户"
        :visible.sync="isdialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @close="adddialogclose"
      >
        <span>
          <el-form :model="addform" :rules="addformrules" ref="addformref" label-width="100px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addform.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addform.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addform.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="addform.mobile"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="adduser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户 -->
      <el-dialog
        title="用户修改"
        :visible.sync="editdialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @close="editialogclose"
      >
        <span>
          <el-form
            :model="editformdata"
            :rules="editformrules"
            ref="editformref"
            label-width="70px"
          >
            <el-form-item label="用户名">
              <el-input v-model="editformdata.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editformdata.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="editformdata.mobile"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="edituserinfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色 -->
      <el-dialog
        title="分配角色"
        :visible.sync="fenpei_dialogVisible"
        width="50%"
        @close="roledialogclose"
      >
        <div>
          <p>当前用户：{{userinfo.username}}</p>
          <p>当前角色：{{userinfo.role_name}}</p>
          <p>
            分配新角色：
            <el-select placeholder="请选择" v-model="selectedroleid">
              <el-option
                v-for="item in roleslist"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="fenpei_dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="tijiao">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "user",
  created() {
    this.getuserlist();
  },
  data() {
    //校验规则
    var checkemail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    var checkemobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      //   用户列表的参数对象
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      isdialogVisible: false,
      //添加用户的表单数据
      addform: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //表单验证
      addformrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 13, message: "长度在5到13个字符之间", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 8, max: 12, message: "长度在8到12个字符之间", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkemail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号", trigger: "blur" },
          { validator: checkemobile, trigger: "blur" }
        ]
      },
      //修改用户
      editdialogVisible: false,
      editformdata: {},
      //修改表单验证
      editformrules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkemail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号", trigger: "blur" },
          { validator: checkemobile, trigger: "blur" }
        ]
      },
      //分配觉色
      fenpei_dialogVisible: false,
      //角色信息
      userinfo: {},
      //所有权限
      roleslist: [],
      //已选中的角色id
      selectedroleid: ""
    };
  },
  methods: {
    //获取数据
    async getuserlist() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryinfo
      });
      if (res.meta.status !== 200) return this.$message.error("失败");
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    //监听每页显示多少条数据
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize;
      this.getuserlist();
    },
    //页码值改变
    handleCurrentChange(newpage) {
      this.queryinfo.pagenum = newpage;
      this.getuserlist();
    },
    //监听开关窗台改变
    async switchchange(scope) {
      const { data: res } = await this.$http.put(
        `users/${scope.id}/state/${scope.mg_state}`
      );
      if (res.meta.status !== 200) {
        scope.mg_state = !scope.mg_states;
        return this.$message.error("用户状态更新失败！");
      }
      this.$message.success("更新成功");
    },
    //监听对话框关闭
    adddialogclose() {
      this.$refs.addformref.resetFields();
    },
    //添加新用户
    adduser() {
      this.$refs.addformref.validate(async valid => {
        if (!valid) return;
        //添加请求
        const { data: res } = await this.$http.post("users", this.addform);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        //隐藏添加的对话框
        this.isdialogVisible = false;
        //  重新获取列表
        this.getuserlist();
      });
      console.log(123);
    },
    // 修改对话框
    async showEditDialog(id) {
      console.log(id);
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status !== 200) return this.$message.error("查询信息失败");
      this.editformdata = res.data;
      this.editdialogVisible = true;
    },
    // 修改对话框的重置
    editialogclose() {
      this.$refs.editformref.resetFields();
    },
    //修改用户信息并提交
    edituserinfo() {
      this.$refs.editformref.validate(async valid => {
        if (!valid) return this.$message.error("请输入正确的信息");
        const { data: res } = await this.$http.put(
          `users/${this.editformdata.id}`,
          {
            email: this.editformdata.email,
            mobile: this.editformdata.mobile
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("更新用户信息失败");
        this.editdialogVisible = false;
        this.getuserlist();
        this.$message.success("更新成功");
      });
    },
    //根据id删除用户讯息
    async removeuserbyid(id) {
      //弹框
      const confirmresult = await this.$confirm(
        "此操作将永久删除该条信息, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmresult !== "confirm")
        return this.$message.info("已取消删除操作");
      const { data: res } = await this.$http.delete("users/" + id, id);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getuserlist();
    },
    // 分配角色
    async showdialog(userinfo) {
      this.userinfo = userinfo;

      //获取所有角色列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.roleslist = res.data;
      this.fenpei_dialogVisible = true;
    },
    //提交角色分配
    async tijiao() {
      if (!this.selectedroleid) return this.$message.error("请选择角色");
      const { data: res } = await this.$http.put(
        `users/${this.userinfo.id}/role`,
        {
          rid: this.selectedroleid
        }
      );
      if (res.meta.status !== 200) return this.$message.error("更新失败");
      this.$message.success("更新成功");
      this.getuserlist();
      this.fenpei_dialogVisible = false;
    },
    //角色对话框的关闭时间
    roledialogclose(){
      this.selectedroleid = ''
      this.userinfo = ''
    }
  }
};
</script>

<style lang="less" scoped>
//导航
.el-breadcrumb {
  font-size: 14px;
}
//卡片式图
.box-card {
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
  .item {
    margin-bottom: 18px;
  }
  .text {
    font-size: 14px;
  }
}
</style>