<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="头像" title="头像">
      </div>
      <!--登录表单-->
      <el-form ref="loginformref" label-width="0px" class="login_form" :model="loginform" :rules="loginrules">
        <!--:model表示绑定 名字要注意，前面修改后，后面也要修改-->
        <!--rules="rules"绑定校验对象-->
        <!--ref 被用来给DOM元素或子组件注册引用信息-->
        <!--用户名-->
        <el-form-item prop="username"><!--label表头,label-width="80px"占位--><!--prop指定规则--><!--prop绑定规则 el-form-item-->
          <el-input  prefix-icon="el-icon-user-solid" v-model="loginform.username"></el-input><!--v-model对象上具体属性-->
          <!--v-model对象上具体属性-->
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password"><!--用户名-->
          <el-input prefix-icon="el-icon-key" v-model="loginform.password" type="password"></el-input><!--加密-->
        </el-form-item>
        <!--登录按钮-->
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
  name: 'login',
  data () {
    return {
      // 表单绑定对象
      loginform: {
        // 要用username而不是name，注意接口的数据，参数名一致
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginrules: {// 验证规则
        username: [
          // trigger触发验证时机
          {required: true, message: '请输入正确用户名', trigger: 'blur'},
          {min: 2, max: 10, message: '请输入正确用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入正确密码', trigger: 'blur'},
          {min: 5, max: 20, message: '请输入正确密码', trigger: 'blur'}
        ]
      }
    }
  },
  // 函数定义
  methods: {
    // 重置表单的函数
    resetloginform () {
      this.$refs.loginformref.resetFields()
      // resetFields对整个表单进行重置，将所有字段值重置为初始值并移除校验结果,ui自带函数
    },
    login () {
      // 对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
      this.$refs.loginformref.validate(async valid => {
        // console.log(valid);
        if (!valid) return false
        // 发起登录请求
        // const result=this.$http.post('login',this.loginform) 返回promise
        const {data: result} = await this.$http.post('login', this.loginform)
        // login 请求地址
        // await简化promise参数 async封装
        // data：res解构,返回参数有很多，取其中的data
        // console.log(result)
        if (result.meta.status !== 200) {
          return this.$message.error('登录失败')
          // message组件使用，Element 注册了一个$message方法用于调用
        } else {
          this.$message.success('登录成功')
          // console.log(result.data.token)
          // 保存token到sessionstore中
          window.sessionStorage.setItem('token', result.data.token)
          // 页面跳转
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>
<style scoped>
  .login_container{
    background-color: #2b4b6b;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items:center;
  }
  .login_box{
    width: 450px;
    height: 400px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
  }
  /* css语法嵌套*/
  .login_box .avatar_box{
    border-radius: 50%;
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    box-shadow: 0 0 10px #ddd;/* 边框阴影，水平距离，垂直距离，模糊距离*/
    position: absolute; /*绝对定位，脱离文档流，不占位置*/
    margin-left: 160px;
    margin-top: -65px;
    background-color: #eee;
    padding: 5px;
  }
  .avatar_box img{
    width: 100%;
    height: 100%;
    border-radius: 50%;/*图片也要定义边框弯曲*/
  }
  .login_box .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;/*login_box position: absolute; 才能相对于父元素定位*/
    padding: 0 25px;
    box-sizing: border-box;/*防止超出*/
  }
  .login_box .btns{
    display: flex;
    justify-content: flex-end;
  }
</style>
