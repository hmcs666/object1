<template>

<!-- 为ECharts准备一个具有宽高的dom -->
  <div class="dashboard-container">
    <panelgroup :userTotal="userTotal" :articleTotal="articleTotal" :questionTotal="questionTotal"/>

    <el-row :gutter="40">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card>
        <piechart v-if="flag" :legendData="categoryTotal.nameList" :seriesData="categoryTotal.nameAndValueList"/>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card>
        <barchart v-if="flag" :xAxisData="monthArticleTotal.yearMonthList" :seriesData="monthArticleTotal.aritcleTotalList"/>
        </el-card>
      </el-col>
      
    </el-row>

        </div> 
</template>

<script>
import piechart from './components/PieChart' //导入ECharts
import barchart from './components/BarChart'
import panelgroup from './components/PanelGroup'
import api from '@/api/home'

// 导入 import echarts from 'echarts'
 
export default {  
  name: 'Dashboard',
  components: {piechart,barchart,panelgroup},
  data() {
    return{
      userTotal: 0,  //用户
      articleTotal: 0,  //文章
      questionTotal: 0,  //提问

      flag: false,
      categoryTotal: {},
      monthArticleTotal: {}
    }
  },
  mounted() {
    this.getTotal() //查询面板中相关的总记录数
    this.getArticleTotal()
  },
  methods: {
    async getTotal(){
      // data取别名userTotal
      const {data: userTotal} = await api.getUserTotal()
      this.userTotal = userTotal

      const {data: articleTotal} = await api.getArticleTotal()
      this.articleTotal = articleTotal

      const {data: questionTotal} = await api.getQuestionTotal()
      this.questionTotal = questionTotal
    },
    async getArticleTotal(){
      const {data: categoryTotal} = await api.getCategoryTotal()
      this.categoryTotal = categoryTotal

      const {data: monthArticleTotal} = await api.getMonthAritcleTotal()
      this.monthArticleTotal = monthArticleTotal
      // 数据加载完成，显示子组件
      this.flag = true
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
