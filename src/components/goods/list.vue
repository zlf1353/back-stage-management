<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!--to路由跳转对象，同 vue-router 的 to-->
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card shadow="hover" style="line-height: 35px">
      <!--查询区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <!--clearable是否可清空-->
          <el-input placeholder="请输入内容查询" v-model="quaryinfo.query" clearable @clear="getgoodlist">
            <el-button slot="append" icon="el-icon-search" @click="searchgood"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6" >
          <el-button type="primary" @click="goaddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!--绑定数据，生成卡片-->
      <!--数据表格区域-->
      <el-table :data="goodlist" stripe style="width: 100%">
        <!--序号列-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="400"></el-table-column>
        <el-table-column prop="goods_price" label="价格" width="100"></el-table-column>
        <el-table-column prop="goods_weight" label="重量" width="100"></el-table-column>
        <el-table-column prop="add_time" label="时间" width="170">
          <template v-slot="scope">
            {{scope.row.add_time|dataformat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!--修改用户对话框
            <el-dialog title="修改用户信息"
                       :visible.sync="modifyuserdialogVisible"
                       width="50%" @close="modifydilogclosed">
              <el-form label-position="left" label-width="80px"
                       ref="modifyuseraddref"
                       :model="modifyuserlist"
                       :rules="addnewuserrules">
                <el-form-item label="用户名称">
                  <el-input v-model="modifyuserlist.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="modifyuserlist.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                  <el-input v-model="modifyuserlist.mobile"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer">
                <el-button @click="modifyuserdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifynewuser">确 定</el-button>
              </span>
            </el-dialog>-->
            <el-button type="primary" icon="el-icon-edit" @click="modifyuser(scope.row.goods_id)" size="mini"> </el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deletegood(scope.row.goods_id)" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--页面跳转区域-->
      <!--使用了size-change和current-change事件来处理页码大小和当前页变动时候触发的事件-->
      <!--page-sizes接受一个整型数组，数组元素为展示的选择每页显示个数的选项-->
      <!--:-v;bind-d单项绑定，数据到视图-->
      <el-pagination
        @size-change="searchgood"
        @current-change="getgoodlist"
        :current-page.sync="quaryinfo.pagenum"
        :page-sizes="[2, 5, 10,15]"
        :page-size.sync="quaryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total.sync="totalpage">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'list',
  data () {
    return {
      quaryinfo: {
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 5
      },
      // 商品列表
      goodlist: [],
      // 总页数
      totalpage: 0
    }
  },
  methods: {
    // 获取商品列表
    async getgoodlist () {
      // params指定
      const {data: res} = await this.$http.get('goods', {params: this.quaryinfo})
      if (res.meta.status !== 200) this.$message.error(res.data.msg)
      else {
        this.totalpage = res.data.total
        this.goodlist = res.data.goods
        this.quaryinfo.pagenum = res.data.pagenum
      }
    },
    // 查询操作
    searchgood () {
      this.quaryinfo.pagenum = 1
      this.getgoodlist()
    },
    // 删除数据
    async deletegood (id) {
      const confiemres = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confiemres !== 'confirm') return this.$message.info('取消删除')
      // @多了一个}
      const {data: res} = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getgoodlist()
    },
    // 跳转到添加商品页面
    goaddpage () {
      this.$router.push('/goods/add')
    }
  },
  created () {
    this.getgoodlist()
  },
  computed: {
  }
}
</script>

<style scoped>

</style>
