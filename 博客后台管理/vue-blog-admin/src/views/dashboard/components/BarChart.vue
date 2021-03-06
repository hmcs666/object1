<template>
    <div ref="main" :class="className" :style="{height: height, width: width}">
    </div>
</template>
<script>
import echarts from 'echarts' //导入ECharts
// 引入主题
require('echarts/theme/macarons')
// 自适应 
import resize from './mixins/resize'
 

export default {
    mixins: [resize], 
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        height: {
            type: String,
            default: '400px'
        },
        width: {
            type: String,
            default: '100%'
        },
        xAxisData: {   //X轴组件接收的数据
            type: Array,
            default: () => ['2077-01','2077-02','2077-03','2077-04','2077-05','2077-06']
        },
        seriesData: {   //Y轴中接收的数据
            type: Array,
            default: () => [10, 52, 200, 334, 390, 330]
        }
    },
    data(){
        return{
            chart: null //接受echarts实例的属性
        }
    },
    mounted(){
        //当加载dom后，会调用this.initChart()来进行初始化echarts实例
        this.$nextTick(() => {
            this.initChart()
        })
    },
    beforeDestroy(){
        if(!this.chart){
            return
        }
        this.chart.dispose()    //注销实例
        this.chart = null
    },
    methods: {
        initChart(){
            // 初始化实例时，指定主题
            this.chart = echarts.init(this.$refs.main, 'macarons')
            // 图标配置项
            this.chart.setOption({
                title: {
                    text: '近六个月发布的文章数',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                        type: 'category',
                        data: this.xAxisData,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '发布数',
                        type: 'bar',
                        barWidth: '60%',
                        data: this.seriesData
                    }
                ]
            })
        }
    }
}
</script>