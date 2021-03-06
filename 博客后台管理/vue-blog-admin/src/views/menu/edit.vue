<template>
    <div>
        <el-dialog :title="title"
            :visible.sync="visible"
            width="600px"
            :before-close="handleClose">
            <el-form :rules="rules" ref="formData" :model="formData" label-width="100px" label-position="right" style="width: 500px" status-icon>
            <el-form-item label="类型:" prop="type">
                <el-radio-group v-model="formData.type">
                <el-radio :label="1">目录</el-radio>
                <el-radio :label="2">菜单</el-radio>
                <el-radio :label="3" v-if="formData.parentId !==0">按钮</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="名称:" prop="name">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="权限标识:" prop="code">
                <el-input v-model="formData.code"></el-input>
            </el-form-item>
            <el-form-item label="请求地址:" prop="url" v-if="formData.type !==3">
                <el-input v-model="formData.url"></el-input>
            </el-form-item>
            <el-form-item label="图标:" prop="icon" v-if="formData.type !==3">
                <el-input v-model="formData.icon"></el-input>
            </el-form-item>
            <el-form-item label="排序:" prop="sort">
                <el-input-number v-model="formData.sort" :min="1" :max="10000" style="width: 300px"></el-input-number>
            </el-form-item>
            <el-form-item label="备注:" prop="remark">
                <el-input type="textarea" v-model="formData.remark" style="width: 300px"></el-input>
            </el-form-item>
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
import api from '@/api/menu'

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
        formData:{  //提交表单数据
            type: Object,
            default: {}
        },
        oldImageUrl: String,    //编辑时，查询出来的原始图片
        remoteClose: Function   //用于关闭窗口
    },

    data(){
        return{
            rules: {
                type: [
                    {required: true, message:'请选择类型', trigger:'change'}
                ],
                name: [ //对应prop中的值
                    {required: true, message:'请输入名称', trigger:'blur'}
                ],
                code: [
                    {required: true, message:'请输入权限标识', trigger:'blur'}
                ],
                url: [
                    {required: true, message:'请输入请求地址', trigger:'blur'}
                ],
                icon: [
                    {required: true, message:'请输入图标名称', trigger:'blur'}
                ],
                sort: [
                    {required: true, message:'请输入排序号', trigger:'blur'}
                ],
                
            }
        }
    },

    methods: {
        submitForm(formName){   //提交表单数据
            this.$refs[formName].validate((valid) => {
          if (valid) {
              //校验通过，提交表单数据
              //判断类型是否为按钮。按钮则不提交
              if(this.formData.type === 3){
                  this.formData.url = ''
                  this.formData.icon = ''
              }
                  this.submitData()
          } else {
            // console.log('error submit!!');
            return false;
          }
        })
        },
        async submitData(){
            let response = null
            
            if(this.formData.id){
                response = await api.update(this.formData)
            }else{
                response = await api.add(this.formData)
            }

            if(response.code = 20000){
                this.$message({message:'保存成功', type:'success'})
                this.handleClose()
            }else{
                this.$message({message:'保存失败', type:'error'})
            }
        },
        handleClose(){  //关闭窗口
            this.$refs['formData'].resetFields()   //将表单清空
            //注意不可以通过 this.visible = false来关闭，因为踏实父组件的属性
            this.remoteClose()
        },
    }
}
</script>