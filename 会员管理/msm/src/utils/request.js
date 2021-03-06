import axios from 'axios'

const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000,  //5000MS
})

request.interceptors.request.use(config =>{
    // 请求拦截
    return config
},error =>{
    // 出现异常
    return Promise.reject(error)
})

request.interceptors.request.use(request =>{
    return request
},error=>{
    // 出现异常
    return Promise.reject(error)
})

export default request  //导出自定义创建的axios对象