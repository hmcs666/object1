<template>
    <div class="app-container">
        <!-- 条件查询 -->
            <el-form :inline="true" :model="query" size="mini">
            <el-form-item label="分类名称:">
                <el-input v-model.trim="query.name" clearable></el-input>
                <!-- .trim去掉输入框前后空格 -->
            </el-form-item>
            <el-form-item label="状态:">
                <el-select v-model="query.status" clearable filterable style="width: 85px">
                    <el-option 
                        v-for="item in statusOptions" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
                <el-button icon="el-icon-circle-plus-outline" type="primary" @click="openAdd">新增</el-button>
            </el-form-item>
            </el-form>
            <!-- 表格 -->
            <el-table
                :data="list"
                border
                stripe
                style="width: 100%">
            <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
            <el-table-column align="center" prop="name" label="分类名称"></el-table-column>
            <el-table-column align="center" prop="sort" label="排序"></el-table-column>
            <el-table-column align="center" prop="remark" label="备注"> </el-table-column>
            <el-table-column align="center" prop="status" label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilter">
                        {{ scope.row.status ?'正常':'禁用'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" @click="handleDelete(scope.row.id)" type="danger">删除</el-button>
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

            <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :remoteClose="remoteClose"/>
        </div>
</template>
<script>

import api from '@/api/category'
import edit from './edit'

const statusOptions = [
    {code: 0,name: '禁用'},
    {code: 1,name: '正常'}
]

export default {
    name :'Category',  //  和对应路由表中配置的name值一致
    components: {edit}, // edit:edit
    data(){
        return{
            list: [],   //列表数据
            page: {     //分页对象
                current: 1, //当前页码
                size: 20,   //每页显示多少条
                total: 0    //总共记录数
                },
            query: {},  //查询条件
            statusOptions ,  //状态下拉框数组
            edit: {
                title: '',
                visible: false,
                formData: {}
            }
            }
         },
    filters: {
        statusFilter(status){
            const statusMap = {0 :'danger' , 1 :'success'}  //0禁用，1正常
            return statusMap[status]
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData(){
            api.getlist(this.query, this.page.current, this.page.size).then(response => {
                console.log('response',response)
                this.list = response.data.records   //列表数据
                this.page.total = response.data.total
            })
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

        async handleEdit(id){
            //通过ID查询详情
            let response = await api.getById(id)
            if(response.code === 20000){
                // 将查询的详情传递
                this.edit.formData = response.data
                this.edit.title = '编辑'
                this.edit.visible = true
            }
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
        //打开新增窗口
        openAdd(){
            this.edit.visible = true
            this.edit.title = '新增'
        },
        //子组件会触发此事件来关闭窗口
        remoteClose(){
            this.edit.formData = {}
            this.edit.visible = false
            this.fetchData()
        }
    },
}
</script>