<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div @click="back" class="avator">
        <img src="../assets/timg.png" alt />
        <span>熊猫电商管理系统</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggle_collapse">
          <i class="el-icon-s-fold icon"></i>
        </div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="iscollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activepath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconlist[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="savenavstate('/'+subitem.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{subitem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getmenulist();
    this.activepath = window.sessionStorage.getItem('activepath')
  },
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconlist: {
        "125": "el-icon-user-solid",
        "103": "el-icon-warning",
        "101": "el-icon-s-goods",
        "102": "el-icon-s-order",
        "145": "el-icon-s-platform"
      },
      iscollapse: false,
      activepath:''
    };
  },
  name: "home",
  methods: {
    //回到首页
    back() {
      this.$router.push("/home");
    },
    //保存连接激活状态
    savenavstate(activepath){
      window.sessionStorage.setItem('activepath',activepath);
      this.activepath = activepath
    },
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取左侧菜单
    async getmenulist() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
    },
    //折叠菜单
    toggle_collapse() {
      this.iscollapse = !this.iscollapse;
    }
  }
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    cursor: pointer;
    span {
      margin-left: 40px;
    }
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf4;
}
.toggle-button {
  background-color: #4a5064;
  .icon {
    margin-left: 50%;
    transform: translate3d(-50%, 0, 0);
    color: #fff;
    cursor: pointer;
  }
}
</style>