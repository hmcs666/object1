<template>

<!-- 为ECharts准备一个具有宽高的dom -->
  <div id="main" ref="main" style="width: 600px;height:400px;"></div> 
</template>

<script>
import echarts from 'echarts' //导入ECharts

// 导入 import echarts from 'echarts'
 
export default {  
  name: 'Dashboard',
 
  mounted() {
    this.$nextTick(() => {
      this.showMain();
    });
  },

  methods: {
     async showMain() {        
       // 基于准备好的dom，初始化echarts实例        
       // var myChart = echarts.init(document.getElementById('main'))        
       // 或者 this.$refs.main        
       var myChart = echarts.init(this.$refs.main)                
       // 指定图表的配置项和数据        
       var option = {            
         title: { // 标题                
         text: 'ECharts 入门示例'            
         },            
         tooltip: { // 提示框组件，鼠标放上柱上显示的提示              
         // show: false // 是否显示            
         },             
         legend: { // 图例组件。点击图例控制哪些系列不显示                
         data:['销量']            
         },            
         xAxis: { // x轴                
         data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]            
         },            
         yAxis: {}, // y轴，会根据 series.data数据自动生成             
         series: [{ // 序列，展示数据                
         name: '销量',                
         type: 'bar', // 图表类型，bar柱状图                
         data: [5, 20, 36, 10, 10, 20] // 数据            
         }]        
         };
        // 使用刚指定的配置项和数据显示图表。        
        myChart.setOption(option);    
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
