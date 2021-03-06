<template>
  <div class="header">
    <a href="#/">
      <img class="logo" src="@/assets/logo.png">
      <span class="company">会员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-setting" command="a">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-close" command="b">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import {logout} from '@/api/login'

export default {
  methods: {
    handleCommand(command){
      switch(command){
        case 'a':
          break;
        case 'b':
          logout(localStorage.getItem('msm-token')).then(response =>{
            const resp = response.data
            if(resp.flag){
              localStorage.removeItem('msm-token')
              localStorage.removeItem('msm-user')
              this.$router.push('/login')
            }else{
              this.$message({
                message: resp.message,
                type: 'warning',
                duration: 500
              });
            }
          })
          break;
        default:
          break;
      }
    }
  }
}
</script>

<style scoped>
.logo{
  padding-left: 40px;
  padding-right: 10px;
  vertical-align: middle;
  width: 30px;
}
.company{
  position: absolute;
  color: white;
}
.el-dropdown{
  float: right;
  margin-right: 40px;
}
.el-dropdown-link{
  color: white;
  cursor: pointer;
}
</style>