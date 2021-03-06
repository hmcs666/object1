<template>
    <div>
        <el-dialog :title="title"
            :visible.sync="visible"
            width="500px"
            :before-close="handleClose">
            <el-form :rules="rules" ref="formData" :model="formData" label-width="100px" label-position="right" style="width: 400px" status-icon>
            <el-form-item label="新密码:" prop="newPassword">
                <el-input v-model="formData.newPassword"  placeholder="请输入新密码" maxlength="30" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="repPassword">
                <el-input v-model="formData.repPassword"  placeholder="请确认密码" maxlength="30" show-password></el-input>
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
import * as api from '@/api/user.js'  //* as导出方法下全部方法名

export default {
    props:{
        userId: null,
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
    data(){
        // 校验确认密码是否一致    
        const validateRepPassword = (rule, value, callback) => {        
            if(value === '') {            // 相等,则通过            
                callback(new Error('请再次输入密码')) 
            }else if(value !== this.formData.newPassword){            
                callback(new Error('两次输入的密码不一致'))   
            }else{
                callback()     
            }
        };
        return{
            formData: {},
            rules: {
                newPassword: [ //对应prop中的值
                    {required: true, message:'请输入新密码', trigger:'blur'}
                ],
                repPassword: [ //对应prop中的值
                    {required: true, message:'请再次输入密码', trigger:'blur'},
                    {validator: validateRepPassword, trigger: 'blur' }
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
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
          if (valid) {
              //校验通过，提交表单数据
              this.formData.userId = this.userId
              api.UpdatePassword(this.formData).then(response =>{
                  if(response.code === 20000){
                      this.$message({message: '保存成功',type: 'success'})
                      this.handleClose()
                  }else{
                      this.$message({message: response.message,type: 'error'})
                  }
              })
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
        },
    }
}
</script>