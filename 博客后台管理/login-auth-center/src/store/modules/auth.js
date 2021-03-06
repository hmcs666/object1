import {login,logout,refreshToken} from '@/api/auth'
import {PcCookie, Key} from '@/utils/cookie'

const state = {
    userInfo: PcCookie.get(Key.userInfoKey) ? JSON.parse(PcCookie.get(Key.userInfoKey)): null,  //用户基本信息
    accessToken: PcCookie.get(Key.accessTokenKey),  //访问令牌
    refreshToken: PcCookie.get(Key.refreshTokenKey),    //刷新令牌，当访问令牌过期了，则通过刷新令牌获取新令牌
}

// 改变状态值
const mutations = {
    // 赋予用户状态
    SET_USER_STATE(state, data){
        // 解构对象属性
        const {userInfo, access_token, refresh_token} = data
        // 状态赋值
        state.userInfo = userInfo
        state.accessToken = access_token
        state.refreshToken = refresh_token
        // 将数值保存到cookie中
        PcCookie.set(Key.userInfoKey, userInfo)
        PcCookie.set(Key.accessTokenKey, access_token)
        PcCookie.set(Key.refreshTokenKey, refresh_token)
    },

    // 重置用户状态
    RESET_USER_STATE(state){
        // 状态重置
        state.userInfo = null
        state.accessToken = null
        state.refreshToken = null
        // 移除cookie中的数据
        PcCookie.remove((Key.userInfoKey))
        PcCookie.remove((Key.accessTokenKey))
        PcCookie.remove((Key.refreshTokenKey))
    }
}


// 定义行为
const actions ={
    UserLogin({commit}, userData){
        const {username , password} = userData

        return new Promise((resolve, reject) => {
            login({username: username.trim(), paaword: password}).then(response =>{
                const {code , data} = response
                if(code === 20000){
                    // 状态赋值
                    commit('SET_USER_STATE', data)
                }
                resolve(response)   //正常响应
            }).catch(error =>{
                // 重置状态
                commit('RESET_USER_STATE')
                reject(error)   //异常响应
            })
        })
        
    },

    UserLogout({state, commit}, redirectURL){
        logout(state.accessToken).then(response =>{
            // 重置状态
            commit('RESET_USER_STATE')
            // 重定向回来源地址，如果没有指定则重定向到登录页
            window.location.href = redirectURL || '/'
        }).catch(error => {
            // 重置状态
            commit('RESET_USER_STATE')
            // 重定向回来源地址，如果没有指定则重定向到登录页
            window.location.href = redirectURL || '/'
        })
    },

    SendRefreshToken({state, commit}){
        return new Promise((resolve, reject) =>{
            // 判断是否刷新令牌
            if( !state.refreshToken){
            commit('RESET_USER_STATE')
            reject('没有刷新令牌')
            return
            }
            // 发送请求
            refreshToken(state.refreshToken).then(response =>{
                commit('SET_USER_STATE', response.data)
                resolve()
            }).catch(error =>{
                // 重置状态
            commit('RESET_USER_STATE')
            reject(error)
            })
        })
    }
}

export default {
    state,
    mutations,
    actions
}