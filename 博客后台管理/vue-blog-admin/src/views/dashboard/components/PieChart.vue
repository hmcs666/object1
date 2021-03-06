<template>
    <!-- 为ECharts准备一个具有宽高的dom -->
    <div ref="main" :class="className" :style="{height: height, width: width}"></div>
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
        legendData: {   //左侧组件接收的数据
            type: Array,
            default: () => ['前端','Java','移动端','大数据']
        },
        seriesData: {   //饼状图中接收的数据
            type: Array,
            default: () => [
                {value: 100, name: '前端'},
                {value: 200, name: 'Java'},
                {value: 500, name: '移动端'},
                {value: 300, name: '大数据'}
            ]
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
        // 关于图标的初始化配置
        initChart(){
            // 初始化实例时，指定主题
            this.chart = echarts.init(this.$refs.main, 'macarons')
            // 图标配置项
            this.chart.setOption({
                title: {
                    text: '各技术频道文章统计',
                    subtext: 'MOCK模拟数据',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: this.legendData
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',    //饼状图
                        radius: '55%',  //饼图大小
                        center: ['50%', '60%'], //位置[左，上]
                        data: this.seriesData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10, //图形的阴影大小
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            })
        }
    }
}
</script>