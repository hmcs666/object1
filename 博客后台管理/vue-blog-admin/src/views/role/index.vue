<template>
    <div class="app-container">
        <!-- 条件查询 -->
            <el-form :inline="true" :model="query" size="mini">
            <el-form-item label="角色名称:">
                <el-input v-model.trim="query.name" clearable></el-input>
                <!-- .trim去掉输入框前后空格 -->
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
                <el-button v-if="!roleIds" icon="el-icon-circle-plus-outline" type="primary" @click="openAdd">新增</el-button>
                <el-button v-if="roleIds" icon="el-icon-circle-plus-outline" type="primary" @click="handleUserRole">设置角色</el-button>
            </el-form-item>
            </el-form>
        <!-- 表格 -->
        <el-table
                row-key="id"
                ref="dataTable"
                :data="list"
                border
                stripe
                @selection-change="handleSelectionChange"
                style="width: 100%">
                <!-- reserve-selection必须配合上面的row-key使用，这样可以在切换页码后保留前面选中的行 -->
                <!-- 多选 -->
                <el-table-column align="center"  reserve-selection type="selection" width="55"></el-table-column>
            <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
            <el-table-column align="center" prop="name" label="角色名称"></el-table-column>
            <el-table-column align="center" prop="remark" label="备注"> </el-table-column>
            <!-- roleIds如果有值，则是用户管理组件传递过来的，则把操作列隐藏 -->
            <el-table-column v-if="!roleIds" align="center" label="操作" width="260px">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handlePermission(scope.row.id)">分配权限</el-button>
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
            <permission :title="per.title" :visible="per.visible" :remoteClose="remotePerClose" :roleId="per.roleId"/>
    </div>
</template>
<script>
import api from '@/api/role'
import edit from './edit'
import permission from './permission'

export default {
    name :'Role',  //  和对应路由表中配置的name值一致
    components: {edit,permission}, // edit:edit
    //当用户管理模块时，将当前这个组件文件作为子组件时，进行接受父组件传递过来的属性
    props:{
        roleIds: null
    },
    data(){
        return{
            list:[],
            page:{
                current: 1,
                size: 20,
                total: 0
            },
            query:{},
            edit: {
                title: '',
                visible: false,
                formData: {}
            },
            per: {
                visible: false,
                roleId: null    //角色ID
            },
            checkedRoleList:[]  //存储选中的对象
        }
    },
    watch: { // 监听 roleIds 变化 +++      
    roleIds() {        
        this.query = [] // 清空查询框数据        
        this.queryData() // 重新获取数据      
        }  
    },

    created(){
        this.fetchData()
    },
    methods:{
        async fetchData(){
            const {data} = await api.getList(this.query, this.current, this.size)
            this.list = data.records
            this.page.total = data.total
            // 列表有数据后勾选角色
            this.chekedRoles()
        },
        chekedRoles(){
            this.$refs.dataTable.clearSelection()
            if(this .roleIds){
                // 循环出查询到的每个角色数据,判断父组件的roleIds的每个角色对象
                this.list.forEach(item =>{
                    // 匹配到了则选中
                    if(this.roleIds.indexOf(item.id)!== -1){
                        // 选中对应传递的是角色对象
                        this.$refs.dataTable.toggleRowSelection(item, true);
                    }
                })
            }
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
        async handlePermission(id){
            let response = await api.getById(id)
            if(response.code === 20000){
                // 将查询的详情传递
                this.per.title = '分配权限'
                this.per.visible = true
                this.per.roleId = id
                // 将点击的那个角色ID传递给子组件，进行查询当前角色已经拥有的菜单ID
            }
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
        //子组件会触发此事件来关闭窗口
        remoteClose(){
            this.edit.formData = {}
            this.edit.visible = false
            this.fetchData()
        },
        openAdd(){
            this.edit.visible = true
            this.edit.title = '新增'
        },
        remotePerClose(){
            this.per.visible = false
            this.per.roleId = null
            this.fetchData()
        },
        // 收集被选中的角色
        handleSelectionChange(val){
            // val是选中的每个对象，将选中的每一个对象封装到这个val数组中
            this.checkedRoleList = val
        },
        // 点击设置角色按钮
        handleUserRole(){
            // 存放选中的角色id
            const checkedRolesIds = []
            // 获取每个元素中的角色id，调用保存用户角色接口，只需要选中的角色id
            this.checkedRoleList.forEach(item =>{
                checkedRolesIds.push(item.id)
            })
            // 触发父组件的事件函数
            this.$emit('saveUserRole',checkedRolesIds)
        }
    }
}
</script>