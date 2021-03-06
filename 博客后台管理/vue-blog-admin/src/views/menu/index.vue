<template>
    <div class="app-container">
        <!-- 条件查询 -->
            <el-form :inline="true" :model="query" size="mini">
            <el-form-item label="菜单名称:">
                <el-input v-model.trim="query.name" clearable></el-input>
                <!-- .trim去掉输入框前后空格 -->
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="fetchData">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
                <el-button icon="el-icon-circle-plus-outline" type="primary" @click="handleAdd(0)">新增</el-button>
            </el-form-item>
            </el-form>
        <!-- 表格 -->
        <!-- row-key="id"指定唯一标识的属性名。其中数据要包含children才会被渲染为树状 -->
            <el-table
                :data="list"
                row-key="id"
                border
                stripe
                style="width: 100%">
            <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
            <el-table-column align="center" prop="name" label="名称" width="120px"></el-table-column>
            <el-table-column align="center" prop="url" label="请求地址"></el-table-column>
            <el-table-column align="center" prop="code" label="权限标识"></el-table-column>
            <el-table-column align="center" prop="type" label="类型">
                <template slot-scope="scope">
                <!-- 类型(1目录，2菜单，3按钮) -->
                <span v-if="scope.row.type === 1">目录</span>
                <span v-if="scope.row.type === 2">菜单</span>
                <span v-if="scope.row.type === 3">按钮</span>
            </template>
            </el-table-column>

            <el-table-column align="center" prop="icon" label="图标">
                <template slot-scope="scope">
                <i :class="scope.row.icon"></i>
            </template>
            </el-table-column>
            
            <el-table-column align="center" prop="sort" label="排序"></el-table-column>
            <el-table-column align="center" label="操作" width="210px">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleAdd(scope.row.id)" type="info">新增</el-button>
                    <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" @click="handleDelete(scope.row.id)" type="danger">删除</el-button>
                </template>
            </el-table-column>
            </el-table>
            <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :remoteClose="remoteClose"/>
    </div>
</template>
<script>
import api from '@/api/menu'
import edit from './edit'

export default {
    name: 'Menu',  //  和对应路由表中配置的name值一致
    components: {edit},
    data() {
        return{
            list: [],   //列表数据
            query: {},   //查询条件
            edit: {
                title: '',
                visible: false,
                formData: {}
            }
        }
    },

    created(){
        this.fetchData()
    },

    methods: {
        async fetchData(){
            const {data} = await api.getList(this.query)
            this.list = data
        },
        handleAdd(id){
            // id=0 是新增一级菜单，其他值是新增到此id下的作为子菜单
            this.edit.formData.parentId = id
            this.edit.title = '新增'
            this.edit.visible = true
        },
        async handleEdit(id){
            const response = await api.getById(this.id)
            if(response.code = 20000) {
                this.edit.formData = response.data
                this.edit.title = '编辑'
                this.edit.visible = true
            }
        },
        handleDelete(id){
            this.$confirm('此操作将永久删除此节点与子节点, 是否继续?', '提示', {
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
        // 重置
        reload(){
            this.query = {}
            this.fetchData()
        },
        //子组件会触发此事件来关闭窗口
        remoteClose(){
            this.edit.visible = false
            this.fetchData()
        }
    },
}
</script>