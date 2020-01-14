# houtaiguanli

## 1. 登录与退出功能  
    + 技术点
      - http是无状态的，保持登录状态使用两种方法
        - cookie session   如果不存在跨域，推荐使用这种方法
        - token            如果存在跨域问题 推荐使用这种方法
          - 页面进行登录，然后服务器验证通过之后会生成该用户的token并返回
          - 客户端储存token，后续所有请求都携带token
          - 服务器根据token验证是否通过，返回不同的数据
### 登录
    1. 创建login组件，配置路由,重定向到login
    2. 创建全局样式表，main中导入
    3. element-ui绘制页面
    4. 绑定表单数据 
    5. 表单验证
       1. 绑定 :rules
       2. 给item 添加 props
    6. 重置表单
       1. ref拿到表单元素，然后调用重置的方法。
    7. 表单的预校验
       1. 配置axios
       2. 调用方法，传入一个回调函数，在函数内进行判断并发送请求
       3. await 只能用在async的函数中
       4. 解构，值需要data数据就可
    8. 弹框提示
       1. 注意：弹框不需要 Vue.use 不然会一加载就弹框
    9. 登录后的行为
       1.  将成功后的token，保存到session中 
           1. 其他api接口必须在登录后才能访问，所以需要导航守卫
           2. token只应该在当前网站生效，localstorage 是持久化存储机制    session 是会话期间存储机制，所以存在session中
       2. 跳转
    10. 导航守卫
        1.  router.beforeEach((去哪，从哪来，放行的函数next)=>{]})
        2.  如果是去login页，直接放行
        3.  如果是去别的页面，就调一下token，如果没有token，返回到登录页
### 退出
    1. 销毁token
    2. 跳转到login页面

