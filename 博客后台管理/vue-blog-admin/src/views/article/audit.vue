<template>
    <div>
        <el-dialog :title="title"
            :visible.sync="visible"
            width="70%"
            :before-close="handleClose">
            <el-form ref="formData" :model="formData" label-width="100px" style="width: 90%" label-position="right">
            <el-form-item label="标题:">
                <el-input v-model="formData.title" readonly></el-input>
            </el-form-item>
            <el-form-item label="标签:">
                <el-cascader
                    disabled
                    :options="labelOptions"
                    style="display: block"
                    v-model="formData.labelIds"
                    :props="{multiple: true, emitPath:false, children:'labelList',value:'id', label:'name'}"
                    clearable>
                </el-cascader>
            </el-form-item>
            <el-form-item label="主图:">
                <img :src="formData.imageUrl" style="180px; height:180px; display:block"/>
            </el-form-item>
            <el-form-item label="是否公开:">
                <el-radio-group v-model="formData.ispublic" disabled>
                <el-radio :label="0">不公开</el-radio>
                <el-radio :label="1">公开</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="简介:">
                <el-input type="textarea" v-model="formData.summary" readonly></el-input>
            </el-form-item>
            <el-form-item label="内容:">
                <mavonEditor v-model="formData.mdContent" :editable="false"/>
            </el-form-item>
            <el-form-item>
                <div align="center" v-if="isAudit">
                <el-button @click="auditFail()">审核不通过</el-button>
                <el-button type="primary" @click="auditSuccess()">审核通过</el-button>
                </div>
            </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>

import api from '@/api/article'
import categoryApi from '@/api/category'

// 1. 引入 mavon-editor 组件与样式 
import { mavonEditor } from 'mavon-editor' 
import 'mavon-editor/dist/css/index.css'


export default {
    props:{
        id: null,   //文章ID
        isAudit: true,  //是否为审核页面
        title:{ //弹窗标题
            type: String,
            default: ''
        },
        visible: {  //弹出窗口，ture弹出
            type: Boolean,
            default: false
        },
        remoteClose: Function   //用于关闭窗口
    },
    components:{
        mavonEditor //注册为子组件
    },
    data(){
        return {
            formData: {},   //查询到的文章详情
            labelOptions: []    //渲染分类标签下拉框
        }
    },
    watch: {
        visible(val){  //监听visible的变化,将该改变之后的值作为参数传入
            if(val){    //val为true,则打开窗口，打开时候查询文章详情
                this.getLabelOptions() // 获取所有分类下的标签
                this.getArticleById()
            }
        }
    },
    methods: {
        handleClose(done){  //关闭窗口
            //注意不可以通过 this.visible = false来关闭，因为踏实父组件的属性
            this.remoteClose()
        },
        // 审核未通过触发的方法
        auditFail(){
            this.$confirm('确认审核未通过吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            // 发送审核未通过请求
            api.auditFail(this.id).then(response =>{
                //处理响应结果提示
                this.$message({
                    type: 'warning',           
                    message: '审核未通过提交成功'
                })
            })
            // 关闭窗口
            this.remoteClose()
        }).catch(() => {
            //  取消审核通过请求
          })
        },
        //审核通过触发的方法
        auditSuccess(){
            this.$confirm('确认审核通过吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            // 发送审核通过请求
            api.auditSuccess(this.id).then(response =>{
                //处理响应结果提示
                this.$message({
                    type: 'success',           
                    message: '审核通过提交成功'
                })
            })
            // 关闭窗口
            this.remoteClose()
        }).catch(() => {
            //  取消审核通过请求
          })
        },
        async getArticleById(){
            //通过ID查询详情
            let {data} = await api.getById(this.id)
                // 将查询的详情传递
                this.formData = data
        },
        async getLabelOptions(){
            let {data} = await categoryApi.getCategoryAndLabel()
            this.labelOptions = data
        }
    }
}
</script>