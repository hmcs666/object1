<template>
  <div class="login-conter">
    <el-form ref="form" :model="form" label-width="55px" class="login-form" :rules="rules">
        <h2 class="login-title">会员管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {login, getUserInfo} from '@/api/login'

  export default {
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
        rules: {
        username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
        ]
    }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid =>{
          if(valid){
            login(this.form.username, this.form.password).then(response =>{
              const resp = response.data
              console.log(resp.data)
              if(resp.flag) {
                // 验证成功
                getUserInfo(resp.data.token).then(response=> {
                  const respUser = response.data
                  if(respUser.flag){
                    console.log(respUser.data)
                    // 保存token,用户信息
                    localStorage.setItem('msm-user',JSON.stringify(respUser.data))
                    localStorage.setItem('msm-token',resp.data.token)
                    // 前往首页
                    this.$router.push('/')
                  }else{
                    this.$message({
                      message: respUser.message,
                      type: 'warning'
                    });
                  }
                })
              }else{
                // alert(resp.message)
                this.$message({
                  message: resp.message,
                  type: 'warning'
                });
              }
            })
          }else{
            return false;
          }
        })
      }
    },
  }
</script>
<style scoped>
    .login-form{
        width: 350px;
        margin: 160px auto;
        background-color: rgb(255, 255, 255 ,0.8);
        padding: 28px;
        border-radius: 20px;
    }
    .login-conter{
        position: absolute;
        width: 100%;
        height: 100%;
        background: url('../../assets/login.jpg');
    }
    .login-title{
        color: #303133;
        text-align: center;
    }
</style>