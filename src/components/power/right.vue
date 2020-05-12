<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <!--stripe卡片样式-->
    <el-card shadow="hover" style="line-height: 35px" >
      <!--数据表格区域-->
      <el-table stripe style="width: 100%" :data="userright">
        <!--data绑定在表格，@绑定位置错误-->
        <!--序号列-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称" ></el-table-column>
        <el-table-column prop="path" label="路径" ></el-table-column>
        <el-table-column label="权限等级">
          <template v-slot="scope">
            <!--effect="plain"白底-->
            <!--条件渲染,0需要双引号,因为scope.row.level是个string而不是number-->
            <el-tag v-if="scope.row.level==='0'" effect="plain">一级权限</el-tag>
            <el-tag v-else-if="scope.row.level==='1'" type="success" effect="plain">二级权限</el-tag>
            <el-tag v-else-if="scope.row.level==='2'" type="warning" effect="plain">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'right',
  data () {
    return {
      // 所有的用户的权限
      userright: [],
      // 请求的用户列表的形式
      list: 'list'
    }
  },
  methods: {
    // 获取用户权限
    async getuserright () {
      const {data: res} = await this.$http.get(`rights/${this.list}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      else {
        this.userright = res.data
      }
    }
  },
  // 生命周期函数，在页面创建的时候执行，必须使用this.
  created () {
    this.getuserright()
  }
}
</script>

<style scoped>

</style>
