<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card shadow="hover"
             style="line-height: 35px;text-align: left">
      <!--添加分类对话框-->
      <el-dialog title="添加分类"
                 :visible.sync="addsortVisible"
                 width="50%"
                 @close="addsortclosed">
        <el-form ref="addsortformref"
                 label-width="80px"
                 :model="addrolesform"
                 :rules="sortsrules"
                 label-position="left">
          <el-form-item label="分类名称"
                        prop="cat_name">
            <el-input v-model="addrolesform.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader :options="toselectedgoodlist"
                         clearable
                         v-model="seletedsortid"
                         :props="cateprops"
                         @change="changeseletedstage">
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addsortVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="comitaddsort">确 定</el-button>
        </span>
      </el-dialog>
      <!--修改分类对话框-->
      <el-dialog title="修改分类"
                 :visible.sync="editsortVisible"
                 width="50%"
                 @close="editsortclosed">
        <el-form ref="edisortform"
                 label-width="80px"
                 :model="edisortform"
                 :rules="sortsrules"
                 label-position="left">
          <el-form-item label="分类名称"
                        prop="cat_name">
            <el-input v-model="edisortform.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="editsortVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="comiteditsort">确 定</el-button>
        </span>
      </el-dialog>
      <!--添加分类按钮-->
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="getparentcatelist">添加分类</el-button>
        </el-col>
      </el-row>
      <!--信息区域-->
      <!--false为bool值，需要:实现绑定-->
      <tree-table :data="goodlist"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  style="margin-top: 15px"
                  show-index>
        <template slot="isok"
                  slot-scope="scope">
          <i class="el-icon-success"
             v-if="!scope.row.cat_deleted"
             style="color: lightgreen"></i>
          <i class="el-icon-error"
             v-else-if="scope.row.cat_deleted"></i>
        </template>
        <template slot="level"
                  slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1"
                  type="success">二级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===2"
                  type="warning">三级</el-tag>
        </template>
        <template slot="action"
                  slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     @click="getsortbyid(scope.row)">编辑</el-button>
          <el-button type="danger"
                     icon="el-icon-delete-solid"
                     @click="deletedsortbyid(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <!--页面跳转区域-->
      <!--@.sync双向绑定，不需要this-->
      <el-pagination @size-change="getallsort"
                     @current-change="getallsort"
                     :current-page.sync="getcategories.pagenum"
                     :page-sizes="[2, 5, 10, 15]"
                     :page-size.sync="getcategories.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totallistnumber">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'categories',
  data () {
    return {
      // 添加分类对话框显示与否
      addsortVisible: false,
      // 添加分类信息
      addrolesform: {
        cat_name: '',
        // 分类父 ID
        cat_pid: 0,
        // 分类层级
        cat_level: 0
      },
      // 添加分类约束
      sortsrules: {
        cat_name: { required: true, message: '请输入名称', trigger: 'blur' }
      },
      // 查询商品分类
      getcategories: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 所有商品分类
      goodlist: [],
      // 总数据条数
      totallistnumber: 1,
      // 为table指定列的定义
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        {          prop: 'cat_deleted',
          label: '是否有效',
          // 当前列定义为模板列
          type: 'template',
          // 对应的作用域插槽名称
          template: 'isok'        },
        {          prop: 'cat_level',
          label: '排序',
          type: 'template',
          template: 'level'
        },
        {          label: '操作',
          type: 'template',
          template: 'action'        }
      ],
      // 修改分类对话框
      editsortVisible: false,
      // 修改分类名称
      edisortform: {
        cat_name: '',
        id: 1
      },
      // 添加分类选择的菜单
      toselectedgoodlist: [],
      // 选定的id
      seletedsortid: [],
      // 用来指定对象
      cateprops: {
        // 需要双引号,文档的类型
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      }
    }
  },
  methods: {
    // 添加分类对话框关闭
    addsortclosed () {
      this.$refs.addsortformref.resetFields()
      this.addrolesform.cat_pid = 0
      this.addrolesform.cat_level = 0
      this.seletedsortid = []
    },
    // 修改分类对话框关闭
    editsortclosed () {
      this.$refs.edisortform.resetFields()
    },
    // 添加分类提交
    comitaddsort () {
      this.$refs.addsortformref.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post(`categories`, this.addrolesform)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        else {
          this.$message.success(res.meta.msg)
          this.addsortVisible = false
          this.getallsort()
        }
      })
    },
    // 提交分类
    comiteditsort () {
      this.$refs.edisortform.validate(async valid => {
        if (!valid) return false
        // console.log(this.edisortform.id)
        const { data: res } = await this.$http.put(`categories/${this.edisortform.id}`, { cat_name: this.edisortform.cat_name })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        else {
          // 注意返回的参数
          this.editsortVisible = false
          this.getallsort()
        }
      })
    },
    // 获取所有商品分类
    async getallsort () {
      // param() 方法创建数组或对象的序列化表示形式。在需要页脚的时候使用
      const { data: res } = await this.$http.get('categories', { params: this.getcategories })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      else {
        // 注意返回的参数
        console.log(res)
        this.goodlist = res.data.result
        this.totallistnumber = res.data.total
      }
    },
    // 使用id获取分类
    getsortbyid (sort) {
      this.editsortVisible = true
      // 保存信息
      this.edisortform.cat_name = sort.cat_name
      this.edisortform.id = sort.cat_id
    },
    // 删除分类
    async deletedsortbyid (sort) {
      const confirms = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // @deleted路径错误，没注意文档
      if (confirms !== 'confirm') return this.$message.error('取消删除')
      const { data: res } = await this.$http.delete(`categories/${sort.cat_id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      else {
        this.$message.success(res.meta.msg)
        this.getallsort()
      }
    },
    // 获取父级分类的数据列表
    async getparentcatelist () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // console.log(res.data)
      this.toselectedgoodlist = res.data
      this.addsortVisible = true
    },
    // 选择父级分类菜单变化
    changeseletedstage () {
      if (this.seletedsortid.length > 0) {
        this.addrolesform.cat_pid = this.seletedsortid[this.seletedsortid.length - 1]
        this.addrolesform.cat_level = this.seletedsortid.length
      } else {
        this.addrolesform.cat_pid = 0
        this.addrolesform.cat_level = 0
      }
    }
  },
  created () {
    this.getallsort()
  }
}
</script>

<style scoped>
</style>
