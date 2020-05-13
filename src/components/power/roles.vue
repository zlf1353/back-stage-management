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
                    :class="['bdbutton',i1 === 0 ? 'bdtop':'']"
                    style="display: flex;align-items: center">
              <!--一级-->
              <el-col :span="6">
                <el-tag closable @close="deletedright(scope.row,item1.id)">
                  {{item1.authName}}
                </el-tag>
                <!--i用class-->
                <i class="el-icon-caret-right"></i>
              </el-col >
              <!--二级和三级-->
              <el-col :span="18">
                <!--二级-->
                <el-row v-for="(item2,i2) in item1.children"
                        :key="item2.id"
                        :class="[i2 === 0 ? '':'bdtop']"
                        style="display: flex;align-items: center">
                  <el-col :span="6">
                    <el-tag closable type="success"
                            @close="deletedright(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                      <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--每一个row都可以分为24块-->
                  <el-col :span="18">
                    <!--三级-->
                    <el-col :span="6"
                            v-for="(item3,i3) in item2.children"
                            :key="item3.id">
                      <el-tag closable type="warning"
                              @close="deletedright(scope.row,item3.id)">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-col>
                </el-row>
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
                <el-button type="primary" @click="comitalterroles">确 定</el-button>
              </span>
            </el-dialog>
            <!--分配角色权限框-->
            <el-dialog title="分配权限" :visible.sync="alterVisible"
                       width="50%"
                       @close="setrightdiaclosed">
              <!--树形组件渲染所有权限 prop需要动态绑定-->
              <!--node-key每个树节点用来作为唯一标识的属性，整棵树应该是唯一的-->
              <!--default-expand-all是否默认展开所有节点-->
              <!----><el-tree :data="userright"
                              show-checkbox
                              node-key="id"
                              ref="treeref"
                              :props="altertightProps"
                              :default-checked-keys="defkeys"
                              default-expand-all>
            </el-tree>
              <span slot="footer">
                <el-button @click="alterVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitrolerightbyid">确 定</el-button>
              </span>
            </el-dialog>
            <el-button type="primary" icon="el-icon-edit" @click="alterroleswindow(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deletedrole(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-s-tools" @click="alterright(scope.row)">分配权限</el-button>
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
      alterrolesform: [],
      // 修改角色对话框显示与否
      alterVisible: false,
      // 所有权限
      userright: [],
      // 分配权限绑定的字段
      altertightProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认展开的节点
      defkeys: [],
      // 将要修改的角色的id
      tobeelertroleid: ''
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
    },
    // 通过id删除权限
    async deletedright (role, key) {
      const confirms = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirms !== 'confirm') return this.$message.error('取消删除')
      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${key}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      else {
        // 响应数据说明
        // 返回的data, 是当前角色下最新的权限数据
        this.$message.success(res.meta.msg)
        // 防止expand收缩，所以引用scope.row
        role.children = res.data
      }
    },
    // 分配角色权限信息
    async alterright (role) {
      // 获取所有权限数据
      this.tobeelertroleid = role.id
      const {data: res} = await this.$http.get(`rights/tree`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      else {
        this.userright = res.data
        this.alterVisible = true
        this.getleafkey(role, this.defkeys)
      }
    },
    // 通过递归的形式，获取角色下所有三级权限的id，保存到defkeys中
    // node 判断是否是三级节点，arr保存路径
    getleafkey (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item =>
        this.getleafkey(item, arr)
      )
    },
    // 提交修改的权限
    async submitrolerightbyid () {
      // 所有id
      const treenode = [
        // ...展开运算符
        ...this.$refs.treeref.getCheckedKeys(),
        ...this.$refs.treeref.getHalfCheckedKeys()
      ]
      const idstr = treenode.join(',')
      const {data: res} = await this.$http.post(`roles/${this.tobeelertroleid}/rights`, {rids: idstr})
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      else {
        this.$message.success(res.meta.msg)
        this.getrolerights()
        this.alterVisible = false
      }
    },
    // 分配角色对话框关闭
    setrightdiaclosed () {
      this.defkeys = []
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
