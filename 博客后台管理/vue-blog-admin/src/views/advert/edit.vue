<template>
    <div>
        <el-dialog :title="title"
            :visible.sync="visible"
            width="600px"
            :before-close="handleClose">
            <el-form :rules="rules" ref="formData" :model="formData" label-width="100px" label-position="right" style="width: 500px" status-icon>
            <el-form-item label="广告图片:" prop="imageUrl">
                <el-upload
                    class="avatar-uploader"
                    action=""
                    :show-file-list="false"
                    :http-request="uploadMainImg">
                    <img v-if="formData.imageUrl" :src="formData.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="广告标题:" prop="title">
                <el-input v-model="formData.title"></el-input>
            </el-form-item>
            <el-form-item label="广告链接:" prop="advertUrl">
                <el-input v-model="formData.advertUrl"></el-input>
            </el-form-item>
            <el-form-item label="跳转方式:" prop="advertTarget">
                    <!-- "_blank", "_self" -->
                    <el-select v-model="formData.advertTarget" clearable style="width: 185px">
                        <el-option label="新窗口打开" value="_blank"></el-option>
                        <el-option label="当前窗口打开" value="_self"></el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label="状态:" prop="status">
                <el-radio-group v-model="formData.status">
                <el-radio :label="0">禁用</el-radio>
                <el-radio :label="1">正常</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="广告位置:" prop="position">
                <el-input-number v-model="formData.position" :min="1" :max="1000" style="width: 300px"></el-input-number>
            </el-form-item>
            <el-form-item label="排序:" prop="sort">
                <el-input-number v-model="formData.sort" :min="1" :max="1000" style="width: 300px"></el-input-number>
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


<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<script>

import api from '@/api/advert'
import commonApi from '@/api/common'

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
                imageUrl: [
                    {required: true, message:'请选择广告图片', trigger:'blur'}
                ],
                title: [ //对应prop中的值
                    {required: true, message:'请输入广告标题', trigger:'blur'}
                ],
                advertUrl: [
                    {required: true, message:'请输入广告链接', trigger:'blur'}
                ],
                advertTarget: [
                    {required: true, message:'请选择跳转方式', trigger:'change'}
                ],
                status: [
                    {required: true, message:'请选择状态', trigger:'change'}
                ],
                position:[
                    {required: true, message:'请选择广告位置', trigger:'blur'}
                ],
                sort: [
                    {required: true, message:'请输入排序号', trigger:'blur'}
                ]
            }
        }
    },

    methods:{
        handleClose(done){  //关闭窗口
            this.$refs['formData'].resetFields()   //将表单清空
            //注意不可以通过 this.visible = false来关闭，因为踏实父组件的属性
            this.remoteClose()
        },
        submitForm(formName){   //提交表单数据
            this.$refs[formName].validate((valid) => {
          if (valid) {
              //校验通过，提交表单数据
              this.submitData()
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
        },
        async submitData(){
            let response = null
            if(this.formData.id){
                response = await api.update(this.formData)
            }else{
                response = await api.add(this.formData) // 新增
            }
            
            if(response.code === 20000){
                this.$message({
                message: '保存成功',
                type: 'success'
            })
            // 关闭窗口
            this.handleClose()
            }else{
                this.$message({
                message: '保存失败',
                type: 'error'
            })
            }
        },
        // 上传图片,flie上传的图片对象
        uploadMainImg(file){
            const data = new FormData()
            data.append('file',file.file)
            commonApi.uploadImg(data).then(response =>{
                // 将之前的图片删除
                this.deleteImg()
                this.formData.imageUrl = response.data  //回显图片
            }).catch(error =>{
                this.$message({
                    type: 'error',
                    message: '上传失败'
                })
            })
        },
        deleteImg(){
            // 如果之前有图片，则删除之前的图片
            if(this.formData.imageUrl && this.formData.imageUrl!== this.oldImageUrl){
                // 发送请求删除
                commonApi.deleteImg(this.formData.imageUrl)
            }
        }
    }
}
</script>