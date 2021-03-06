import request from '@/utils/request'


// 数据格式 
const header = {
    'Content-Type': 'application/x-www-form-urlencoded'
}
// 请求头添加 Authorization: Basic client_id:client_secret 
const auth = {
    username: "biog-admin",
    password: "123456"
}
export function login(data){
    return request({
        header,
        auth,
        url: `/auth/login`,
        method: 'post',
        params: data
    })
}

export function getXieyi(){
    return request({
        url: `${window.location.href}/xieyi.html`,   // 访问到的是 public/xieyi.html
        method: 'get'
    })
}
export function getUserByUsername(username) {
    return request({
        url: `/system/api/user/username/${username}`,
        method: 'get'
    })
}
export function register(data) {
    return request({
        url: `/system/api/user/register`,
        method: 'post',
        data
    })
}

export function logout(accessToken) {
    return request({
        url: `/auth/logout`,
        method: 'get',
        params: {
            accessToken
        }
    })
}

export function refreshToken (refreshToken) {
    return request({
        url: `/auth/user/refreshToken`,
        method: 'get',
        params: {
            refreshToken
        }
    })
}