<template>
  <di>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>

      <div id="main"
           style="width: 800px;height:400px;"></div>
    </el-card>
  </di>
</template>

<script>
import echarts from 'echarts'
// 对象合并 深拷贝
import _ from 'lodash'
export default {
  name: 'reports',
  data () {
    return {
      // 指定图表的配置项和数据
      option: {
        title: {
          // 标题
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {},
  // dom 创建成功后
  async mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1', { params: { type: 3 } })
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    // 合并
    const result = _.merge(res.data, this.option)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  },
  created () { }
}
</script>

<style scoped>
</style>
