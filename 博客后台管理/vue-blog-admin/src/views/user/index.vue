<template>
    <div class="app-container">
        <!-- 条件查询 -->
            <el-form :inline="true" :model="query" size="mini">
            <el-form-item label="用户名:">
                <el-input v-model.trim="query.username" clearable></el-input>
                <!-- .trim去掉输入框前后空格 -->
            </el-form-item>
            <el-form-item label="手机号:">
                <el-input v-model.trim="query.mobile" clearable></el-input>
                <!-- .trim去掉输入框前后空格 -->
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
            <el-table-column align="center" prop="username" label="用户名"></el-table-column>
            <el-table-column align="center" prop="nickName" label="昵称"></el-table-column>
            <el-table-column align="center" prop="mobile" label="手机号"></el-table-column>
            <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
            <el-table-column align="center" prop="isAccountNonExpired" label="账号过期">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.isAccountNonExpired | isAccountNonExpiredFilter">
                        {{ scope.row.isAccountNonExpired ?'正常':'过期'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="isAccountNonLocked" label="账号锁定">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.isAccountNonLocked | isAccountNonLockedFilter">
                        {{ scope.row.isAccountNonLocked ?'正常':'锁定'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="isCredentialsNonExpired" label="密码过期">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.isCredentialsNonExpired | isCredentialsNonExpiredFilter">
                        {{ scope.row.isCredentialsNonExpired ?'正常':'过期'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="isEnabled" label="是否可用">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.isEnabled | isEnabledFilter">
                        {{ scope.row.isEnabled ?'可用':'已删除'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="330px">
                <template slot-scope="scope" v-if="scope.row.isEnabled === 1">
                    <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" @click="handleDelete(scope.row.id)" type="danger">删除</el-button>
                    <el-button size="mini" @click="handleRole(scope.row.id)">设置角色</el-button>
                    <el-button size="mini" @click="handlePwd(scope.row.id)">修改密码</el-button>
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

            <el-dialog title="设置角色" :visible.sync="role.visible" width="75%">
                <!-- roleId是当前用户所拥有的角色id，saveUserRole事件是子组件进行触发提交选择的角色id -->
                <role :roleIds="role.roleIds" @saveUserRole="saveUserRole"/>
            </el-dialog>

            <password :title="pwd.title" :visible="pwd.visible" :userId="pwd.userId" :remoteClose="remotePwdClose"/>
    </div>
</template>
<script>
import * as api from '@/api/user'  //* as导出方法下全部方法名
import edit from './edit'
import role from '../role/index'
import password from './password'

export default {
    name: 'User',
    components: {edit , role, password}, // edit:edit
    data() {
        return{
            list: [],
            page: {
                current: 1,
                size: 20,
                total: 0
            },
            query: {},
            edit: {
                title: '',
                visible: false,
                formData: {}
            },
            role: {
                userId: null,
                // 传递到子组件中时，至少会传递一个空数组[]，子组件判断是都有roleIds值
                roleIds: [],    //封装当前用户所拥有的角色id
                visible: false,

            },
            pwd: {
                title: '',
                userId: null,
                visible: false,
            }
        }
    },

    filters: {
        isAccountNonExpiredFilter(isAccountNonExpired){
            const isAccountNonExpiredMap = {0 :'danger' , 1 :'success'}  //0禁用，1正常
            return isAccountNonExpiredMap[isAccountNonExpired]
        },
        isAccountNonLockedFilter(isAccountNonLocked){
            const isAccountNonLockedMap = {0 :'danger' , 1 :'success'}  //0禁用，1正常
            return isAccountNonLockedMap[isAccountNonLocked]
        },
        isCredentialsNonExpiredFilter(isCredentialsNonExpired){
            const isCredentialsNonExpiredMap = {0 :'danger' , 1 :'success'}  //0禁用，1正常
            return isCredentialsNonExpiredMap[isCredentialsNonExpired]
        },
        isEnabledFilter(isEnabled){
            const isEnabledMap = {0 :'danger' , 1 :'success'}  //0禁用，1正常
            return isEnabledMap[isEnabled]
        }
    },

    created(){
        this.fetchData()
    },

    methods: {
        async fetchData(){
            const {data} = await api.getList(this.query, this.page.current, this.page.size)
            this.list = data.records
            this.page.total = data.total
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
        //打开新增窗口
        openAdd(){
            this.edit.visible = true
            this.edit.title = '新增--默认用户名与密码一致'
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
        async handleRole(id){
            this.role.userId = id
            const {data} = await api.getRoleIdsByUserId(id)
            this.role.roleIds = data
            this.role.visible = true
        },
        handlePwd(id){
            this.pwd.userId = id
            this.pwd.visible = true
            this.pwd.title = '修改密码' 
        },
        remotePwdClose(){
            this.pwd.userId = null
            this.pwd.visible = false
            this.fetchData()
        },
        //子组件会触发此事件来关闭窗口
        remoteClose(){
            this.edit.formData = {}
            this.edit.visible = false
            this.fetchData()
        },
        // 角色列表子组件会触发此方法来保存当前用户选择的角色id
        async saveUserRole(checkedRolesIds){
            const response = await api.saveUserRole(this.role.userId, checkedRolesIds)
            if(response.code === 20000){
                this.$message({message:'分配角色成功', type:'success'})
                this.role.visible = false
            }else{
                this.$message({message:'分配角色失败', type:'error'})
            }
        }
    }
}
</script>