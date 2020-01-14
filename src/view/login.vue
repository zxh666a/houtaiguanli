<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/timg.png" alt />
      </div>
      <!-- 登陆表单 -->
      <el-form
        label-width="80px"
        class="login_form"
        :model="loginform"
        :rules="login_rules"
        ref="login_form_ref"
      >
        <el-form-item label="UserName: " prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginform.username" class="username"></el-input>
        </el-form-item>
        <el-form-item label="PassWord: " prop="password">
          <el-input
            prefix-icon="el-icon-s-ticket"
            v-model="loginform.password"
            type="password"
            class="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetloginform">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      //登录表单的数据绑定对象
      loginform: {
        username: "admin",
        password: "123456"
      },
      //表单验证
      login_rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 13, message: "长度必须在6到13位之间", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 13,
            message: "密码长度必须在6到13位之间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //重置表单
    resetloginform() {
      this.$refs.login_form_ref.resetFields();
    },
    //表单的预校验并发送请求
    login() {
      this.$refs.login_form_ref.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginform);
        if (res.meta.status !== 200) return this.$message.error("登陆失败");
        this.$message.success("登陆成功");
        //token保存到session中
        window.sessionStorage.setItem('token',res.data.token);
        this.$router.push('/home')
      });
    }
  }
};
</script>

<style lang="less" scoped>
//容器
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
//包裹区和头像
.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -225px;
  margin-top: -159px;
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  .avatar_box {
    position: absolute;
    left: 50%;
    top: -65px;
    margin-left: -65px;
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    overflow: hidden;
    padding: 10px;
    box-shadow: 0 0 10px #eee;
    background-color: #fff;
    img {
      width: 100%;
      width: 100%;
      border-radius: 50%;
    }
  }
}
//两个按钮
.btns {
  display: flex;
  justify-content: flex-end;
}
//表单区域
.login_form {
  position: absolute;
  bottom: 0;
  width: 90%;
  padding: 0 20px;
  box-sizing: border-box;
  .username,
  .password {
    margin-left: 10px;
  }
}
</style>