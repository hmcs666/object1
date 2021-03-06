<template>
    <div>
        <el-dialog :title="title"
            :visible.sync="visible"
            width="500px"
            :before-close="handleClose">
            <el-form :rules="rules" ref="formData" :model="formData" label-width="100px" label-position="right" style="width: 400px" status-icon>
            <el-form-item label="用户名:" prop="username">
                <el-input v-model="formData.username" mexlength="50"></el-input>
            </el-form-item>
            <el-form-item label="昵称:" prop="nickName">
                <el-input v-model="formData.nickName" mexlength="50"></el-input>
            </el-form-item>
            <el-form-item label="手机号:" prop="mobile">
                <el-input v-model="formData.mobile" mexlength="11"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="email">
                <el-input v-model="formData.email" mexlength="30"></el-input>
            </el-form-item>
            <el-form-item label="账号过期:" prop="isAccountNonExpired">
                <el-radio-group v-model="formData.isAccountNonExpired">
                <el-radio :label="0" border>已过期</el-radio>
                <el-radio :label="1" border>未过期</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="密码过期:" prop="isCredentialsNonExpired">
                <el-radio-group v-model="formData.isCredentialsNonExpired">
                <el-radio :label="0" border>已过期</el-radio>
                <el-radio :label="1" border>未过期</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="账号锁定:" prop="isAccountNonLocked">
                <el-radio-group v-model="formData.isAccountNonLocked">
                <el-radio :label="0" border>已锁定</el-radio>
                <el-radio :label="1" border>未锁定</el-radio>
                </el-radio-group>
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
import * as api from '@/api/user'

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
        remoteClose: Function   //用于关闭窗口
    },
    data(){
        return{
            rules: {
                username: [ //对应prop中的值
                    {required: true, message:'请输入用户名', trigger:'blur'},
                    {min: 6,max: 30,message:'长度在6到30字符',trigger:'blur'}
                ],
                nickName: [
                    {required: true, message:'请输入昵称', trigger:'blur'}
                ],
                mobile: [
                    {required: true, message:'请输入手机号', trigger:'blur'}
                ],
                // email: [
                //     {required: true, message:'请输入邮箱', trigger:'blur'}
                // ],
                isAccountNonExpired: [
                    {required: true, message:'请选择', trigger:'change'}
                ],
                isCredentialsNonExpired: [
                    {required: true, message:'请选择', trigger:'change'}
                ],
                isAccountNonLocked: [
                    {required: true, message:'请选择', trigger:'change'}
                ],
            }
        }
    },
    methods: {
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
                // 编辑
                response = await api.update(this.formData)
            }else{
                // 新增
                this.formData.password = this.formData.username
                response = await api.add(this.formData)
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
        }
    }
}
</script>