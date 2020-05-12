<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区-->
    <el-card style="line-height: 35px;text-align: left">
      <!--添加角色对话框-->
      <el-dialog title="添加角色" :visible.sync="addrolesVisible"
                 width="50%"
                 @close="addrolesclosed">
        <el-form ref="addrolesformref" label-width="80px"
                 :model="addrolesform"
                 :rules="rolesrules"
                 label-position="left">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addrolesform.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addrolesform.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addrolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="comitaddroles">确 定</el-button>
        </span>
      </el-dialog>
      <!--添加角色按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addrolesVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表区-->
      <el-table :data="rolerights">
        <!--expand展开-->
        <el-table-column width="60px" type="expand">
          <template v-slot="scope">
            <!--class动态绑定,i1序号-->
            <el-row v-for="(item1,i1) in scope.row.children"
            :key="item1.id"
            :class="['bdbutton',i1 === 0 ? 'bdtop':'']">
              <!--一级-->
              <el-col :span="5">
                <el-tag closable>
                  {{item1.authName}}
                </el-tag>
                <!--i用class-->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--二级和三级-->
              <el-col >
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" width="60px" type="index">
        </el-table-column>
        <el-table-column label="角色名称" width="120px" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!--修改角色对话框-->
            <el-dialog title="修改角色" :visible.sync="alterrolesVisible"
                       width="50%"
                       @close="alterrolesclosed">
              <el-form ref="alterrolesformref" label-width="80px"
                       :model="alterrolesform"
                       :rules="rolesrules"
                       label-position="left">
                <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="alterrolesform.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                  <el-input v-model="alterrolesform.roleDesc"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer">
                <el-button @click="alterrolesVisible = false">取 消</el-button>
                <el-button type="primary" @click="comitalterroles(scope.row.id)">确 定</el-button>
              </span>
            </el-dialog>
            <!--删除角色提醒框-->
            <el-button type="primary" icon="el-icon-edit" @click="alterroleswindow(scope.row.id)">\ 编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deletedrole(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-s-tools">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'roles',
  data () {
    return {
      rolerights: [],
      // 添加角色对话框
      addrolesVisible: false,
      // 添加角色数据
      addrolesform: {
        roleName: '',
        roleDesc: ''
      },
      // 角色约束
      rolesrules: {
        roleName: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '请输入描述', trigger: 'blur'}
        ]
      },
      // 修改用户
      alterrolesVisible: false,
      // 添加角色数据
      alterrolesform: []
    }
  },
  methods: {
    // 获取所有角色
    async getrolerights () {
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      else {
        this.rolerights = res.data
      }
    },
    // 添加角色对话框关闭
    addrolesclosed () {
      this.$refs.addrolesformref.resetFields()
    },
    // 提交新创建的角色
    comitaddroles () {
      this.$refs.addrolesformref.validate(async valid => {
        if (!valid) {
          return false
        }
        const {data: res} = await this.$http.post('roles', this.addrolesform)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        else {
          this.$message.success(res.meta.msg)
          this.addrolesVisible = false
          this.getrolerights()
        }
      })
    },
    // 修改角色对话框关闭
    alterrolesclosed () {
      this.$refs.alterrolesformref.resetFields()
    },
    // 点击修改角色信息,根据id查询角色，渲染表单
    async alterroleswindow (id) {
      this.alterrolesVisible = true
      const {data: res} = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      else {
        this.alterrolesform = res.data
      }
    },
    // 提交修改的信息
    comitalterroles (id) {
      this.$refs.alterrolesformref.validate(async valid => {
        if (!valid) {
          return false
        }
        const {data: res} = await this.$http.put(`roles/${id}`, this.alterrolesform)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        else {
          this.$message.success(res.meta.msg)
          this.alterrolesVisible = false
          this.getrolerights()
        }
      })
    },
    // 删除角色信息功能
    async deletedrole (id) {
      const confirms = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // @deleted路径错误，没注意文档
      if (confirms !== 'confirm') return this.$message.error('取消删除')
      const {data: res} = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      else {
        this.$message.success(res.meta.msg)
        this.getrolerights()
      }
    }
  },
  // 注意生命周期函数不要包括到method里
  created () {
    this.getrolerights()
  }
}
</script>

<style scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbutton{
  border-bottom: 1px solid #eee;
}
</style>
