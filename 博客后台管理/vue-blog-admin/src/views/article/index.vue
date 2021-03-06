<template>
    <div class="app-container">
        <!-- 条件查询 -->
            <el-form :inline="true" :model="query" size="mini">
            <el-form-item label="文章标题:">
                <el-input v-model.trim="query.name" clearable></el-input>
                <!-- .trim去掉输入框前后空格 -->
            </el-form-item>
            <el-form-item label="状态:">
                <el-select v-model="query.status" clearable filterable style="width: 130px">
                    <el-option 
                        v-for="item in statusOptions" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
            </el-form-item>
            </el-form>
        <!-- 表格 -->
        <el-table
                :data="list"
                border
                stripe
                style="width: 100%">
            <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
            <el-table-column align="center" prop="title" label="文章标题"></el-table-column>
            <el-table-column align="center" prop="viewCount" label="浏览量"></el-table-column>
            <el-table-column align="center" prop="thumhup" label="点赞数"></el-table-column>
            <el-table-column align="center" prop="ispublic" label="是否公开">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.ispublic | ispublicFilter">
                        {{ scope.row.ispublic ?'公开':'不公开'}}
                        <!-- ....?'1':'0' -->
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="status" label="状态">
                <template slot-scope="scope">
                        <!-- 0: 已删除, 1:未审核，2:已审核,3: 审核未通过 -->
                        <el-tag v-if="scope.row.status === 0" type="info">已删除</el-tag>
                        <el-tag v-if="scope.row.status === 1" type="primary">未审核</el-tag>
                        <el-tag v-if="scope.row.status === 2" type="success">已审核</el-tag>
                        <el-tag v-if="scope.row.status === 3" type="warning">审核未通过</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="updateDate" label="最后更新时间" width="100px">
                <template slot-scope="scope">
                    {{ getFormat(scope.row.updateDate) }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="210px">
                <template slot-scope="scope">
                    <div align="left">
                    <el-button v-permission="'article:search'" @click="openView(scope.row.id)" size="mini">查看</el-button>

                    <!-- 审核：只有status===1 才显示，其他不显示。删除：只有status !==0 才显示，其他不显示-->
                    <el-button v-permission="'article:audit'" v-if="scope.row.status === 1" type="primary" 
                        @click="openAudit(scope.row.id)" size="mini">审核</el-button>

                    <el-button v-permission="'article:delete'" v-if="scope.row.status !== 0" type="danger"  
                        @click="handleDelete(scope.row.id)"  size="mini">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
            <el-pagination  
                align="center"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.current"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="page.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total">
            </el-pagination>
            <audit :title="audit.title" :visible="audit.visible" :remoteClose="remoteClose"
            :id="audit.id"  :isAudit="audit.isAudit"/>
    </div>
</template>
<script>

import api from '@/api/article'
import {format} from '@/utils/date' //格式化日期
import audit from './audit'

const statusOptions = [
    {code: 0,name: '已删除'},
    {code: 1,name: '未审核'},
    {code: 2,name: '已审核'},
    {code: 3,name: '审核未通过'}

    // 0: 已删除, 1:未审核，2:已审核,3: 审核未通过
]

export default {
    name :'Article',  //  和对应路由表中配置的name值一致
    components: {audit},
    data() {
        return {
            list: [],
            page: {
                current: 1,
                size: 20,
                total: 0
            },
            query: {},  //查询条件
            statusOptions ,  //状态下拉框数组
            audit: {    //审核子组件传递的对象属性
                title: '',
                visible: false,
                id: null,   //文章ID
                isAudit: true   //是否打开审核页面，true为审核，false为查看
            }
        }
    },
    filters: {
        ispublicFilter(ispublic){
            const ispublicMap = {0 :'danger' , 1 :'info'}  //0不公开，1公开
            return ispublicMap[ispublic]
        },
    },
    created(){
        this.fetchData()
    },
    methods: {
        // 分页条件查询文章列表
        async fetchData(){
            const {data} = await api.getList(this.query, this.page.current, this.page.size)   //response.data = {data}
            this.list = data.records
            this.page.total = data.total
        },
        // 组件模板中调用此方法格式化日期
        getFormat(date){
            return format(date)
        },
        //val每页显示条数 
        handleSizeChange(val){
            this.page.size = val
            this.fetchData()
        },
        // 当页码改变后触发此方法，val为当前点击页码或输入的页码
        handleCurrentChange(val){
            this.page.current = val
            this.fetchData()
        },
        // 条件查询
        queryData(){
            // 将页码变为1，第一页
            this.page.current = 1
            this.fetchData()
        },
        // 重置
        reload(){
            this.query = {}
            this.fetchData()
        },
        // 审核文章
        openAudit(id){
            // 文章ID
            this.audit.id = id
            // 表示为审核页面
            this.audit.isAudit = true
            this.audit.title = '审核文章'
            this.audit.visible = true
        },
        handleDelete(id){
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {

            // 发送删除请求
            api.deleteById(id).then(response =>{
                //处理响应结果提示
                this.$message({
                    type: response.code === 20000 ? 'success': 'error',
                    message: response.message
                })
            })
            // 刷新列表数据
            this.fetchData()
        }).catch(() => {
            //  取消删除
          }); 
        },
        //子组件会触发此事件来关闭窗口
        remoteClose(){
            this.audit.visible = false
            this.fetchData()
        },
        // 查看详情页
        openView(id){
            // 文章ID
            this.audit.id = id
            // 表示为查看页面
            this.audit.isAudit = false
            this.audit.title = '查看文章'
            this.audit.visible = true
        }
    }
}
</script>