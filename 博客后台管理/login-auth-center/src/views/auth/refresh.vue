<template>
    <div>
        <div v-show="visibale">
            <!-- 展示的内容层 -->
            <div class="content">
                <span v-html="message"></span>
            </div>
            <!-- 半透明背景 -->
            <div class="over">

            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            message: '请稍等，正在重新进行身份验证......',
            redirectURL: null,
            visibale: true
        }
    },

    created(){
        this.redirectURL = this.$route.query.redirectURL || '/'
        this.refreshLogin()
    },
    methods: {
        // 刷新令牌获取新的认真信息
        refreshLogin(){
            this.$store.dispatch('SendRefreshToken').then( () =>{
                // 刷新成功重定向回应用
                this.message = '刷新成功,重定向回应用'
                window.location.href = this.redirectURL
            }).catch(error =>{
                // 刷新失败，去登录页
                this.message = `您的身份已过期，请点击 <a href="/?redirectURL=${this.redirectURL}">重新登陆</a>`
            })
        }
    }
}
</script>

<style scoped>

.content {
  position: fixed;
  height: 120px;
  width: 500px;
  line-height: 120px;
  text-align: center;
  font-size: 19px;
  color: #303133;
  background-color: #fff;
  border-radius: 0.25rem;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
a {
  color: #345dc2;
  text-decoration: none;
}
a:hover {
  text-decoration: underline; 
}
.over {
  position: fixed;
  width: 100%;
  height: 100%;
  opacity: 0.5; /* 透明度为50% */
  filter: alpha(opacity=50);
  top: 0;
  left: 0;
  z-index: 999;
  background-color: #000;
}

</style>