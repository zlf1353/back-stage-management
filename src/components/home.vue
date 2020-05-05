<template>
  <div class="home">
    <!--头部-->
    <el-container>
      <el-header>
        <span></span>
        <span>电商后台管理系统</span>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!--主体-->
      <el-container>
        <!--侧边栏-->
        <!--需要引号-->
        <el-aside :width="iscollapse ? '64px' : '200px'">
          <!--菜单-->
          <!--单个展开-->
          <div class="toggile-button" @click="toggleglass">|||</div>
          <!--bool值动态绑定-->
          <!--router是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
          <el-menu background-color="#D3DCE6" active-text-color="#6CA6CD" unique-opened :collapse='iscollapse'
                   :collapse-transition='false' router :default-active="activepath">
            <!--一级菜单-->
            <!--双层for循环建立菜单-->
            <!--:key动态 绑定唯一属性-->
            <!--+''转化为字符串-->
            <el-submenu :index="item.id +''" v-for="item in menulist" :key="item.id">
              <template slot="title">
                <!--图标-->
                <i :class=iconobj[item.id]></i>
                <!--文本-->
                <span>{{item.authName}}</span>
              </template>
              <!--二级-->
              <!--item.children-->
              <el-menu-item :index="'/'+children.path" v-for="children in item.children" :key="children.id"
              @click="activenavpath('/'+children.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{children.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <!--主页-->
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
      <!--页脚-->
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'home',
  // 生命周期函数
  created () {
    this.getmenulist()
    // 页面刚被刷新的时候更改绑定的值
    this.activepath = window.sessionStorage.getItem('navactivepath')
  },
  data () {
    return {
      menulist: [],
      iconobj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-custom',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-cooperation',
        '145': 'el-icon-s-marketing'
      },
      iscollapse: false,
      // 激活的链接，在下次刷新的时候使用
      activepath: ''
    }
  },
  methods: {
    // 退出功能
    logout () {
      // 清除session
      window.sessionStorage.clear()
      // 返回，push
      this.$router.push('/login')
    },
    // 获取侧边栏数据
    async getmenulist () {
      // await简化promise函数 需要async
      // {}把data结构为res
      const {data: res} = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      else this.menulist = res.data
      // console.log(res)
    },
    // 点击按钮，折叠菜单
    toggleglass () {
      if (!this.iscollapse) {
        this.iscollapse = true
      } else {
        this.iscollapse = false
      }
    },
    // 保存导航栏状态，下次不刷新
    activenavpath (path) {
      // 点击二级菜单，把对应index保存在session中
      window.sessionStorage.setItem('navactivepath', path)
      // 第一次点击时刷新
      this.activepath = path
    }
  }
}
</script>

<style scoped>
  .home{
    height: 100%;
  }
  .el-container{
    height: 100%;
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    line-height: 120px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  .i{
    margin-left: 10px;
  }
  .toggile-button{
    line-height: 24px;
    font-size: 12px;
    background-color: #E1FFFF;
    text-align: center;
    letter-spacing: 0.2em;
    /*间距*/
    cursor:pointer;
    /*鼠标移动到位置变小手*/
  }
</style>
