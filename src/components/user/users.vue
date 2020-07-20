<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!--to路由跳转对象，同 vue-router 的 to-->
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card shadow="hover"
             style="line-height: 35px">
      <!--查询区域-->
      <el-row :gutter="20">
        <el-col :span="12">
          <!--clearable是否可清空-->
          <el-input placeholder="请输入用户名查询"
                    v-model="quaryinfo.query"
                    clearable
                    @clear="getuserlist">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="searchuser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="adduserdialogVisible = true">添加用户</el-button>
          <!--添加用户对话框-->
          <!--close对话框关闭时触发-->
          <el-dialog title="添加用户"
                     :visible.sync="adduserdialogVisible"
                     width="50%"
                     @close="adddilogclosed">
            <el-form label-position="left"
                     label-width="80px"
                     :model="addnewuser"
                     ref="newuseraddref"
                     :rules="addnewuserrules">
              <el-form-item label="用户名称"
                            prop="username">
                <el-input v-model="addnewuser.username"></el-input>
              </el-form-item>
              <el-form-item label="用户密码"
                            prop="password">
                <el-input v-model="addnewuser.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱"
                            prop="email">
                <el-input v-model="addnewuser.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号"
                            prop="mobile">
                <el-input v-model="addnewuser.mobile"></el-input>
              </el-form-item>
            </el-form>
            <!--slot="footer"右下角显示-->
            <span slot="footer">
              <el-button @click="adduserdialogVisible = false">取 消</el-button>
              <el-button type="primary"
                         @click="subnewuser">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
      <!--绑定数据，生成卡片-->
      <!--数据表格区域-->
      <el-table :data="userlist"
                stripe
                style="width: 100%">
        <!--序号列-->
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column prop="username"
                         label="用户名"
                         width="140px"></el-table-column>
        <el-table-column prop="email"
                         label="邮箱"
                         width="140"></el-table-column>
        <el-table-column prop="role_name"
                         label="角色名称"
                         width="140"></el-table-column>
        <el-table-column prop="mobile"
                         label="电话"
                         width="140"></el-table-column>
        <el-table-column label="状态"
                         width="140">
          <!--作用域插槽 组件中可以使用template标签，加v-slot指令制定具名插槽-->
          <template v-slot="scope">
            <!--传递参数scope.row-->
            <el-switch v-model="scope.row.mg_state"
                       active-color="#13ce66"
                       inactive-color="#B0C4DE"
                       @change="changeuserstage(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!--修改用户对话框-->
            <el-dialog title="修改用户信息"
                       :visible.sync="modifyuserdialogVisible"
                       width="50%"
                       @close="modifydilogclosed">
              <el-form label-position="left"
                       label-width="80px"
                       ref="modifyuseraddref"
                       :model="modifyuserlist"
                       :rules="addnewuserrules">
                <el-form-item label="用户名称">
                  <el-input v-model="modifyuserlist.username"
                            disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱"
                              prop="email">
                  <el-input v-model="modifyuserlist.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号"
                              prop="mobile">
                  <el-input v-model="modifyuserlist.mobile"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer">
                <el-button @click="modifyuserdialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           @click="modifynewuser">确 定</el-button>
              </span>
            </el-dialog>
            <!--分配用户角色对话框-->
            <el-dialog title="分配角色"
                       :visible.sync="modifyrightdialogVisible"
                       width="50%"
                       @close="selectedrole = ''">
              <p>当前的用户：{{userinfo.username}}</p>
              <p>当前的角色：{{userinfo.role_name}}</p>
              <p>分配新角色：
                <el-select v-model="selectedrole"
                           placeholder="请选择">
                  <el-option v-for="role in rolelist"
                             :key="role.id"
                             :label="role.roleName"
                             :value="role.id">
                  </el-option>
                </el-select>
              </p>
              <span slot="footer">
                <el-button @click="modifyrightdialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           @click="modifyuserrole">确 定</el-button>
              </span>
            </el-dialog>
            <el-button type="primary"
                       icon="el-icon-edit"
                       @click="modifyuser(scope.row.id)"></el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       @click="deleteuser(scope.row.id)"></el-button>
            <el-tooltip effect="dark"
                        content="设置"
                        placement="top">
              <el-button type="warning"
                         icon="el-icon-s-tools"
                         @click="modifyuserright(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--页面跳转区域-->
      <!--使用了size-change和current-change事件来处理页码大小和当前页变动时候触发的事件-->
      <!--page-sizes接受一个整型数组，数组元素为展示的选择每页显示个数的选项-->
      <!--:-v;bind-d单项绑定，数据到视图-->
      <el-pagination @size-change="getuserlist"
                     @current-change="getuserlist"
                     :current-page.sync="quaryinfo.pagenum"
                     :page-sizes="[2, 4, 10,15]"
                     :page-size.sync="quaryinfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total.sync="totalpage">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'users',
  data () {
    // 自定义用户规则
    // 邮箱
    var checkemail = (rule, val, callback) => {
      const regemail = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
      if (regemail.test(val)) {
        // 合法
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 手机号
    var checkmobie = (rule, val, callback) => {
      const regemoble = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regemoble.test(val)) {
        // 合法
        return callback()
      }
      callback(new Error('请输入合法手机号码'))
    }
    return {
      quaryinfo: {
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 4
      },
      // 用户列表
      userlist: [],
      // 总页数
      totalpage: 0,
      // 控制添加用户对话框的显示与否
      adduserdialogVisible: false,
      // 控制修改用户对话框的显示与否
      modifyuserdialogVisible: false,
      deleted: false,
      // 新用户数据
      addnewuser: {
        // 用户名
        username: '',
        // 用户密码
        password: '',
        // 用户邮箱,
        email: '',
        // 手机号码
        mobile: ''
      },
      modifyuserlist: [],
      // 新用户验证规则
      addnewuserrules: {
        username: [
          { required: true, message: '请输入正确用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名长度在2-10字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入正确密码', trigger: 'blur' },
          { min: 5, max: 20, message: '请输入正确密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入正确邮箱', trigger: 'blur' },
          // validator自定义验证规则
          { validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入正确手机号', trigger: 'blur' },
          { validator: checkmobie, trigger: 'blur' }
        ]
      },
      // 分配用户角色对话框
      modifyrightdialogVisible: false,
      // 用户角色列表
      rolelist: [],
      // 选定的角色
      selectedrole: '',
      // 需要被分配的用户角色信息
      // v-model的值为当前被选中的el-option的 value 属性值
      userinfo: {}
    }
  },
  methods: {
    // 获取用户列表
    async getuserlist () {
      // params指定
      const { data: res } = await this.$http.get('users', { params: this.quaryinfo })
      if (res.meta.status !== 200) this.$message.error(res.data.msg)
      else {
        this.totalpage = res.data.total
        this.userlist = res.data.users
        // console.log(res.data.users)
        this.quaryinfo.pagenum = res.data.pagenum
      }
    },
    // 查询操作
    searchuser () {
      this.quaryinfo.pagenum = 1
      this.getuserlist()
    },
    // 监听stage状态改变
    // users/:uId/state/:type,使用url传递参数，使用``代替单引号
    async changeuserstage (info) {
      const { data: res } = await this.$http.put(`users/${info.id}/state/${info.mg_state}`)
      if (res.meta.status !== 200) {
        // 操作失败，不能改变状态值
        info.mg_state = !info.mg_state
        this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
        this.getuserlist()
      }
    },
    // 提交新用户
    subnewuser () {
      // 表单预校验
      // valid校验结果
      this.$refs.newuseraddref.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post('users', this.addnewuser)
        if (res.meta.status !== 201) {
          // 操作失败，不能改变状态值
          this.$message.error(res.meta.msg)
        } else {
          this.$message.success(res.meta.msg)
          // 隐藏对话框
          this.adduserdialogVisible = false
          this.getuserlist()
        }
      })
    },
    // 修改用户卡片的展示
    // 卡片是变化的组件，多个行公用，需要使用函数获取用户数据，不然只会显示最后一个
    async modifyuser (id) {
      this.modifyuserdialogVisible = true
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        // 操作失败，不能改变状态值
        return this.$message.error(res.meta.msg)
      } else {
        this.modifyuserlist = res.data
        // this.getuserlist()
      }
    },
    // 修改用户信息并提交
    modifynewuser () {
      this.$refs.modifyuseraddref.validate(async valid => {
        if (!valid) {
          return false
        }
        // 发起修改用户请求
        // 出错一，请求方法不对
        // 需要重命名
        const { data: res } = await this.$http.put(`users/${this.modifyuserlist.id}`,
          { email: this.modifyuserlist.email, mobile: this.modifyuserlist.mobile })
        if (res.meta.status !== 200) {
          // 操作失败，不能改变状态值
          this.$message.error(res.meta.msg)
        } else {
          this.$message.success(res.meta.msg)
          // 隐藏对话框
          this.modifyuserdialogVisible = false
          this.getuserlist()
        }
      })
    },
    // 删除用户
    async deleteuser (id) {
      // 因为不需要填写数据，所以只要提示框而不是对话框
      // this.$confirm返回值
      const confiemres = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除 confiemres=confirm ''string类型
      if (confiemres !== 'confirm') return this.$message.error('取消删除')
      // 可以使用多个await
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getuserlist()
    },
    // 添加用户对话框关闭时，重新刷新表单
    adddilogclosed () {
      this.$refs.newuseraddref.resetFields()
    },
    // 修改用户对话框关闭时，重新刷新表单
    modifydilogclosed () {
      this.$refs.modifyuseraddref.resetFields()
    },
    // 点击打开分配用户角色
    async modifyuserright (user) {
      this.userinfo = user
      this.modifyrightdialogVisible = true
      const { data: roleres } = await this.$http.get(`roles`)
      if (roleres.meta.status !== 200) {
        return this.$message.error(roleres.meta.msg)
      } else {
        this.rolelist = roleres.data
      }
    },
    // 分配用户角色提交
    async modifyuserrole () {
      // 进行判断，是否选择角色
      if (!this.selectedrole) return this.$message.error('请选择分配角色')
      const { data: res } = await this.$http.put(`users/${this.userinfo.id}/role`, { rid: this.selectedrole })
      if (res.meta.status !== 200) {
        return this.$message.error('当前角色为超级管理员则不能修改')
      }
      this.$message.success(res.meta.msg)
      this.modifyrightdialogVisible = false
      this.getuserlist()
    }
  },
  created () {
    this.getuserlist()
  }
}
</script>

<style scoped>
</style>
