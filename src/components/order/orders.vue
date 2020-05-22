<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!--to路由跳转对象，同 vue-router 的 to-->
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card shadow="hover" style="line-height: 35px">
      <!--查询区域-->
      <el-row>
        <el-col :span="8">
          <!--clearable是否可清空-->
          <el-input placeholder="请输入内容查询" v-model="quaryinfo.query" clearable @clear="getorderlist">
            <el-button slot="append" icon="el-icon-search" @click="searchorder"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--绑定数据，生成卡片-->
      <!--数据表格区域-->
      <el-table :data="orserlist" stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="300"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="100">
          <template v-slot="scope">
            <el-tag type="danger" v-if="scope.row.pay_status==='0'">未付款</el-tag>
            <el-tag v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
        <el-table-column  label="下单时间" width="170">
          <template v-slot="scope">
            {{scope.row.create_time|dataformat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!--修改订单信息对话框-->
            <el-dialog
              title="修改地址"
              :visible.sync="editorderdialogVisible"
              width="50%"
              @close="editorderdialogClose">
              <el-form ref="editorderform" :model="editorderform" label-width="100px"
                       :rules="editorderrules">
                <el-form-item label="省市区/县" prop="address1">
                  <el-cascader
                    :options="cityOptions"
                    clearable
                    filterable
                    :props="cityprop"
                    v-model="editorderform.address1"
                    style="width: 100%"
                  >
                  </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                  <el-input v-model="editorderform.address2"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer">
                <el-button @click="editorderdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editorderdialogVisible = false">确 定</el-button>
              </span>
            </el-dialog>
            <!--展示物流信息对话框-->
            <el-dialog
              title="查看物流进度"
              :visible.sync="showorderdialogVisible"
              width="50%">
              <el-timeline :reverse="reverse">
                <el-timeline-item
                  v-for="(proress, index) in proressinfo"
                  :key="index"
                  :timestamp="proress.time">
                  {{proress.context}}
                </el-timeline-item>
              </el-timeline>
            </el-dialog>
            <el-button type="primary" icon="el-icon-edit" @click="editorder(scope.row)" size="mini"> </el-button>
            <el-button type="success" icon="el-icon-location-outline" @click="searchlogisticsprogress(scope.row)" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--页面跳转区域-->
      <!--使用了size-change和current-change事件来处理页码大小和当前页变动时候触发的事件-->
      <!--page-sizes接受一个整型数组，数组元素为展示的选择每页显示个数的选项-->
      <!--:-v;bind-d单项绑定，数据到视图-->
      <el-pagination
        @size-change="searchorder"
        @current-change="getorderlist"
        :current-page.sync="quaryinfo.pagenum"
        :page-sizes="[2,5,10,15]"
        :page-size.sync="quaryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total.sync="totalpage">
      </el-pagination>
    </el-card>
  </div>

</template>

<script>
import cityOptions from '@/assets/js/city_data2017_element.js'
export default {
  name: 'orders',
  data () {
    return {
      quaryinfo: {
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 5,
        // 用户ID可以为空
        user_id: 1,
        // 支付状态可以为空
        pay_status: '',
        // 是否发货可以为空
        is_send: '',
        // ['个人','公司']可以为空
        order_fapiao_title: '',
        // 公司名称
        order_fapiao_company: '',
        // 发票内容可以为空
        order_fapiao_content: '',
        // 发货地址可以为空
        consignee_addr: ''
      },
      // 商品列表
      orderlist: [],
      // 总页数
      totalpage: 0,
      // 修改地址对话框展示与否
      editorderdialogVisible: false,
      // 物流地址对话框展示与否
      showorderdialogVisible: false,
      // 修改地址的信息
      editorderform: {
        address1: '',
        address2: ''
      },
      // 导入选项城市
      cityOptions: cityOptions,
      // 修改地址验证规则
      editorderrules: {
        address1: [
          {required: true, message: '请输入地址', trigger: 'blur'}
        ],
        address2: [
          {required: true, message: '请输入地址', trigger: 'blur'}
        ]
      },
      // 修改地址级联选择器规则
      cityprop: {
        value: 'city',
        expandTrigger: 'hover'
      },
      // 修改地址级联选择器选中的值
      selctvalue: [],
      // 物流信息
      proressinfo: [
        {
          'time': '2018-05-10 09:39:00',
          'ftime': '2018-05-10 09:39:00',
          'context': '已签收,感谢使用顺丰,期待再次为您服务',
          'location': ''
        },
        {
          'time': '2018-05-10 08:23:00',
          'ftime': '2018-05-10 08:23:00',
          'context': '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          'location': ''
        },
        {
          'time': '2018-05-10 07:32:00',
          'ftime': '2018-05-10 07:32:00',
          'context': '快件到达 [北京海淀育新小区营业点]',
          'location': ''
        },
        {
          'time': '2018-05-10 02:03:00',
          'ftime': '2018-05-10 02:03:00',
          'context': '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          'location': ''
        },
        {
          'time': '2018-05-09 23:05:00',
          'ftime': '2018-05-09 23:05:00',
          'context': '快件到达 [北京顺义集散中心]',
          'location': ''
        },
        {
          'time': '2018-05-09 21:21:00',
          'ftime': '2018-05-09 21:21:00',
          'context': '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          'location': ''
        },
        {
          'time': '2018-05-09 13:07:00',
          'ftime': '2018-05-09 13:07:00',
          'context': '顺丰速运 已收取快件',
          'location': ''
        },
        {
          'time': '2018-05-09 12:25:03',
          'ftime': '2018-05-09 12:25:03',
          'context': '卖家发货',
          'location': ''
        },
        {
          'time': '2018-05-09 12:22:24',
          'ftime': '2018-05-09 12:22:24',
          'context': '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          'location': ''
        },
        {
          'time': '2018-05-08 21:36:04',
          'ftime': '2018-05-08 21:36:04',
          'context': '商品已经下单',
          'location': ''
        }
      ]
    }
  },
  methods: {
    // 获取商品列表
    async getorderlist () {
      const {data: res} = await this.$http.get('orders', {params: this.quaryinfo})
      if (res.meta.status !== 200) this.$message.error(res.data.msg)
      this.totalpage = res.data.total
      this.orserlist = res.data.goods
      this.quaryinfo.pagenum = res.data.pagenum
    },
    // 查询操作
    searchorder () {
      // 回到首页
      this.quaryinfo.pagenum = 1
      this.getorderlist()
    },
    // 退出修改对话框的操作
    editorderdialogClose () {
      this.$refs.editorderform.resetFields()
    },
    // 修改地址
    editorder (row) {
      this.editorderdialogVisible = true
    },
    // 查看物流进度消息窗口
    async searchlogisticsprogress (row) {
      this.showorderdialogVisible = true
      const {data: res} = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) this.$message.error(res.data.msg)
      // console.log(this.proressinfo)
      // this.proressinfo = res.data
    }
  },
  created () {
    this.getorderlist()
  }
}
</script>

<style scoped>

</style>
