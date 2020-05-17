<template>
  <div style="line-height: 35px;text-align: left">
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card shadow="hover"  >
      <!--警告区域-->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!--选择商品分类区域-->
      <p>选择商品分类：
        <el-cascader :options="toselectedgoodlist" clearable
                     v-model="seletedsortid"
                     :props="cateprops"
                     @change="changeseletedstage">
        </el-cascader>
      </p>
      <!--选项卡区域-->
      <el-tabs v-model="activeName" @tab-click="handtabclick">
        <el-tab-pane label="动态参数" name="many">
          <!--添加参数按钮-->
          <el-button type="primary" @click="adddialogVisible=true" :disabled=!this.seletedsortid.length>添加参数</el-button>
          <!--动态参数列表区-->
          <el-table :data="manyattributeget">
            <!--expand展开-->
            <el-table-column width="60px" type="expand">
              <template v-slot="scope">
                <!--循环展示标签-->
                <!--@item不需要[i1]-->
                <el-tag closable  v-for="(item1,i) in scope.row.attr_vals"
                        :key="i"
                        style="margin-left: 7px"
                        @close="taghandleClose(i,scope.row)">
                  {{item1}}
                </el-tag>
                <!--输入文本框-->
                <!--keyup-键盘输入，enter回车,native修饰符触发事件（第三方标签绑定事件不生效）-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  type="small"
                  ref="TagInput"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!--添加按钮-->
                <el-button  v-else @click="showInput(scope.row)" type="small">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" width="60px" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" @click="alterattributewindow(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click=deletedarritube(scope.row)>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" @click="adddialogVisible=true" :disabled=!this.seletedsortid.length>添加属性</el-button>
          <!--静态属性列表区-->
          <el-table :data="onlyattributeget">
            <!--expand展开-->
            <!--expand展开-->
            <el-table-column width="60px" type="expand">
              <template v-slot="scope">
                <!--循环展示标签-->
                <!--@item不需要[i1]-->
                <el-tag closable  v-for="(item1,i) in scope.row.attr_vals"
                        :key="i"
                        style="margin-left: 7px"
                        @close="taghandleClose(i,scope.row)">
                  {{item1}}
                </el-tag>
                <!--输入文本框-->
                <!--keyup-键盘输入，enter回车,native修饰符触发事件（第三方标签绑定事件不生效）-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  type="small"
                  ref="TagInput"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!--添加按钮-->
                <el-button  v-else @click="showInput(scope.row)" type="small">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" width="60px" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" @click="alterattributewindow(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click=deletedarritube(scope.row)>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--添加参数对话框，合并两个参数-->
    <!--计算属性不能有（）-->
    <el-dialog :title="'添加'+titletext" :visible.sync="adddialogVisible"
               width="50%"
               @close="addattributeclosed">
      <el-form ref="addattributeref" label-width="80px"
               :model="addattributeform"
               :rules="attributerules"
               label-position="left">
        <el-form-item :label="titletext" prop="attr_name">
          <el-input v-model="addattributeform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comitattribute">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改属性对话框-->
    <el-dialog :title="'修改'+titletext" :visible.sync="alterattributeVisible"
               width="50%" @close="alterattributeclosed">
      <el-form ref="alterattributeformref" label-width="80px"
               :model="alterattributeform"
               :rules="attributerules"
               label-position="left">
        <el-form-item :label="titletext" prop="attr_name">
          <el-input v-model="alterattributeform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="alterattributeVisible = false">取 消</el-button>
        <el-button type="primary" @click="editform">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'params',
  data () {
    return {
      //  激活的选项卡名称
      activeName: 'many',
      // 所有的商品分类数据
      toselectedgoodlist: [],
      // 用来指定对象
      cateprops: {
        // 需要双引号,文档的类型
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 选定的分类数据
      seletedsortid: [],
      // 添加参数对话框显示与否
      adddialogVisible: false,
      // 添加属性
      addattributeform: {
        attr_name: '',
        attr_vals: ''
      },
      // 添加属性约束
      attributerules: {
        attr_name: {required: true, message: '请输入名称', trigger: 'blur'}
      },
      // many获取到的参数
      manyattributeget: [],
      // only获取到的参数
      onlyattributeget: [],
      // 修改参数对话框
      alterattributeVisible: false,
      // 修改的名字
      alterattributeform: {
        attr_name: '',
        attr_id: '',
        attr_vals: ''
      }
    }
  },
  methods: {
    // 获取分类的数据列表
    async getcatelist () {
      const {data: res} = await this.$http.get('categories', {params: {type: 3}})
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.toselectedgoodlist = res.data
    },
    // 修改对话框关闭
    alterattributeclosed () {
      this.$refs.alterattributeformref.resetFields()
    },
    // 添加属性参数
    addattributeclosed () {
      this.$refs.addattributeref.resetFields()
    },
    // 提交增加的参数
    comitattribute () {
      this.$refs.addattributeref.validate(async valid => {
        if (!valid) return false
        const {data: res} = await this.$http.post(`categories/${this.seletedsortid[2]}/attributes`,
          {
            attr_name: this.addattributeform.attr_name,
            attr_sel: this.activeName
          })
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.adddialogVisible = false
        this.getparmesdata()
      })
    },
    // 选择的商品分类发生变化的时候，查询相应的参数
    changeseletedstage () {
      this.getparmesdata()
    },
    // 标签页变化
    handtabclick () {
      this.getparmesdata()
    },
    // 获取参数
    async getparmesdata () {
      if (this.seletedsortid.length) {
        const {data: res} = await this.$http.get(`categories/${this.seletedsortid[2]}/attributes`, {params: {sel: this.activeName}})
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // forEach 大写
        res.data.forEach(item => {
          // ' '.split(' ')产生空数组,一个空格
          item.attr_vals = item.attr_vals ? (item.attr_vals).split(' ') : []
          // 为每行定义属性，控制对话框的显示与否
          item.inputVisible = false
          // 文本框内容
          item.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.manyattributeget = res.data
        } else {
          this.onlyattributeget = res.data
        }
      } else {
        this.manyattributeget = []
        this.onlyattributeget = []
      }
    },
    // 修改参数对话框
    alterattributewindow (attribute) {
      this.alterattributeVisible = true
      this.alterattributeform.attr_name = attribute.attr_name
      this.alterattributeform.attr_id = attribute.attr_id
    },
    // 提交修改的属性名称
    editform () {
      this.$refs.alterattributeformref.validate(async valid => {
        if (!valid) return false
        // @{}包裹所有参数，逗号隔开
        const {data: res} = await this.$http.put(`categories/${this.seletedsortid[2]}/attributes/${this.alterattributeform.attr_id}`,
          {attr_name: this.alterattributeform.attr_name, attr_sel: this.activeName, attr_vals: this.alterattributeform.attr_vals})
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        else {
          this.$message.success(res.meta.msg)
          this.alterattributeVisible = false
          this.getparmesdata()
        }
      })
    },
    // 删除属性
    async  deletedarritube (attribute) {
      const confirms = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirms !== 'confirm') return this.$message.error('取消删除')
      const {data: res} = await this.$http.delete(`categories/${this.seletedsortid[2]}/attributes/${attribute.attr_id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      else {
        this.$message.success(res.meta.msg)
        this.getparmesdata()
      }
    },
    // 标签显示框的显示与否
    showInput (row) {
      row.inputVisible = true
      // 自动将焦点聚集到文本框
      // $nexttick 作用：当页面上元素被重新渲染之后，才会指定回调函数的代码
      // 先生成input
      this.$nextTick(_ => {
        this.$refs.TagInput.$refs.input.focus()
      })
    },
    // 标签页输入确定的时候
    async handleInputConfirm (row) {
      // !!row.inputValue 不能剔除全部是空格的情况
      if (row.inputValue.trim().length === 0) {
        // 隐藏文本输入框
        row.inputVisible = false
        row.inputValue = ''
        return false
      }
      // @先清空、
      // 传递参数需要加空格，注意格式
      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
      row.inputValue = ''
      this.saveattrcalue(row)
    },
    // 函数删除参数
    async saveattrcalue (row) {
      const {data: res} = await this.$http.put(`categories/${this.seletedsortid[2]}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name, attr_sel: this.activeName, attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
    // 删除标签
    async taghandleClose (i, row) {
      // @splice名字写错
      // @使用的应该是put而不是deleted
      row.attr_vals.splice(i, 1)
      this.saveattrcalue(row)
    }
  },
  created () {
    this.getcatelist()
  },
  computed: {
    // 动态计算标题文本
    titletext () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style scoped>
  .input-new-tag {
    width: 90px;
    margin-left: 15px;
  }
</style>
