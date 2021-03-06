<template>
    <div>
        <el-dialog :title="title"
            :visible.sync="visible"
            width="500px"
            :before-close="handleClose">
            <!-- v-loading 值为 true 显示加载中  -->
            <el-form ref="formData" label-width="100px" v-loading="loading" label-position="right" style="width: 400px" status-icon>
                 <!--             
                     data 数据集合，default-checked-keys 默认勾选             
                     props   配置相应数据中对应展示的属性名
                     children 子菜单属性名
                     label  显示的菜单名属性名         
                     node-key 每个树节点用来作为唯一标识的属性            
                     show-checkbox 显示勾选框            
                     accordion 每次只打开一个同级树节点展开            
                     highlight-current 高亮当前选中节点          
                     -->
                <el-tree
                    ref="tree"
                    :data="menuList"
                    show-checkbox
                    node-key="id"
                    accordion
                    :default-checked-keys="menuIds"
                    :props="defaultProps">
                </el-tree>
                <el-form-item>
                    <div align="right">
                    <el-button size="mini" @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import menuApi from '@/api/menu'
import roleApi from '@/api/role'

export default {
    props:{
        title:{ //弹窗标题
            type: String,
            default: ''
        },
        visible: {  //弹出窗口，ture弹出
            type: Boolean,
            default: false
        },
        remoteClose: Function,   //用于关闭窗口
        roleId: null    //角色ID
    },

    data() {
      return {
        menuList: [], //存储所有菜单
        loading: false,  //值为 true 显示加载中 
        menuIds: [],    //默认选中的菜单ids
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      };
    },

    watch: {
        visible(val){
            if(val)(
                this.getMenuList()
            )
        }
    },

    methods: {
        async getMenuList(){  //获取所有菜单
        this.loading = true
            const response = await menuApi.getList({})
            this.menuList = response.data
            this.loading = false
            this.getMenuIdsByRoleId()
        },
        
        handleClose(done){  //关闭窗口
            this.menuList = []  //将表单清空
            this.menuIds = []
            //注意不可以通过 this.visible = false来关闭，因为踏实父组件的属性
            this.remoteClose()
        },
        submitForm(formName){
             // 1. 获取所有选中节点的菜单 id
            const checkedMenuIds = this.$refs.tree.getCheckedKeys()
            roleApi.saveRoleMenu(this.roleId,checkedMenuIds).then(response =>{
                if(response.code = 20000){
                    this.$message({message: '分配权限成功', type:'success'})
                    this.handleClose()
                }else{
                    this.$message({message: '分配权限失败', type:'error'})
                }
            })
        },
        // 获取指定角色id所拥有的权限菜单ids
        async getMenuIdsByRoleId(roleId) {
            const response = await roleApi.getMenuIdsByRoleId(this.roleId)
            this.menuIds = response.data
        }
    }
}
</script>