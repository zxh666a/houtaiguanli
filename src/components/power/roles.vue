<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card border>
      <el-row>
        <el-col>
          <el-button type="primary" @click="roleadddialogVisible = !roleadddialogVisible">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesuser" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              class="row1"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom',index1===0?'bdtop':'']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="tagremove(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  class="row1"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                  :class="[index2===0?'':'bdtop']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="tagremove(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3,index3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="tagremove(scope.row,item3.id)"
                    >
                      {{item3.authName}}
                      {{index3}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="roleedit(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleterole(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showdialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色 -->
      <el-dialog
        title="用户修改"
        :visible.sync="roleadddialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @close="rolesaddialogclose"
      >
        <span>
          <el-form
            :model="addrole"
            :rules="roleseditformrules"
            ref="roleaddformref"
            label-width="70px"
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addrole.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="addrole.roleDesc"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="roleadddialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addroles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户 -->
      <el-dialog
        title="用户修改"
        :visible.sync="roleeditdialogVisible"
        width="50%"
        :close-on-click-modal="false"
        @close="roleseditialogclose"
      >
        <span>
          <el-form
            :model="editrole"
            :rules="roleseditformrules"
            ref="roleeditformref"
            label-width="70px"
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="editrole.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="editrole.roleDesc"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="roleeditdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="edit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="fenpei_dialogVisible" width="30%" @close="close">
      <el-tree
        :data="rightslist"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeref"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fenpei_dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotrights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "roles",
  data() {
    return {
      rolesuser: [],
      //添加用户对话框
      roleadddialogVisible: false,
      //   修改用户的对话框
      roleeditdialogVisible: false,
      //添加用户的验证
      roleseditformrules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          { min: 3, max: 8, trigger: "blur" }
        ]
      },
      //添加用户列表
      addrole: {
        id: "",
        roleName: "",
        roleDesc: ""
      },
      //修改用户
      editrole: {},
      fenpei_dialogVisible: false,
      //权限数据
      rightslist: [],
      //树状图
      defaultProps: {
        label: "authName",
        children: "children"
      },
      //默认选中的节点数组
      defkeys: [],
      // 当前角色的id
      roleId: ""
    };
  },
  created() {
    this.getroles();
  },
  methods: {
    //获取角色列表
    async getroles() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message.error("获取失败");
      this.rolesuser = res.data;
    },
    //添加角色
    addroles() {
      this.$refs.roleaddformref.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addrole);
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.roleadddialogVisible = false;
        this.getroles();
      });
    },
    //重置添加表单
    rolesaddialogclose() {
      this.$refs.roleaddformref.resetFields();
    },
    //重置编辑表单
    roleseditialogclose() {
      this.$refs.roleeditformref.resetFields();
    },
    //编辑角色
    async roleedit(id) {
      console.log(id);
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) return this.$message.error("查询失败");
      this.editrole = res.data;
      this.roleeditdialogVisible = true;
    },
    //提交编辑的角色
    edit() {
      this.$refs.roleeditformref.validate(async valid => {
        if (!valid) return this.$message.error("提交失败");
        const { data: res } = await this.$http.put(
          "roles/" + this.editrole.roleId,
          { roleName: this.editrole.roleName },
          { roleDesc: this.editrole.roleDesc }
        );
        if (res.meta.status !== 200) return this.$message.error("更新失败");
        this.$message.success("更新成功");
        this.roleeditdialogVisible = false;
        this.getroles();
      });
    },
    //删除
    async deleterole(id) {
      const confirm = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirm !== "confirm") return this.$message.info("已取消该操作");
      const { data: res } = await this.$http.delete("roles/" + id, id);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getroles();
    },
    //根据id删除权限
    async tagremove(row, id) {
      const confirmtag = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmtag !== "confirm")
        return this.$message.info("已经取消删除操作");
      const { data: res } = await this.$http.delete(
        `roles/${row.id}/rights/${id}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      //调用函数会整个刷新表格，会合上 所以这里使用重新赋值
      row.children = res.data;
    },
    //展示分配权限对话框
    async showdialog(row) {
      this.roleId = row.id;
      //获取权限的数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限数据失败");
      this.rightslist = res.data;
      //递归获取三级权限的id
      this.getkeys(row, this.defkeys);
      this.fenpei_dialogVisible = true;
    },
    //递归的形式获取角色的三级权限的id
    getkeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getkeys(item, arr);
      });
    },
    //重置对话框
    close() {
      this.defkeys = [];
    },
    //分配权限
    async allotrights() {
      const keys = [
        //展开运算符
        ...this.$refs.treeref.getCheckedKeys(),
        ...this.$refs.treeref.getHalfCheckedKeys()
      ];
      const idstr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idstr }
      );
      if (res.meta.status !== 200) return this.$message.erroe("分配权限失败");
      this.$message.success("分配权限成功");
      this.getroles();
      this.fenpei_dialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.row1 {
  display: flex;
  align-items: center;
}
</style>