import {getUserMenuList} from '@/api/user'
import {PcCookie, Key} from '@/utils/cookie'

// 定义状态
const state = {
    init: false,    //是否已加载用户授权信息
    menuList: [],   //用户所拥有的菜单权限
    buttonList: []  //用户所拥有的按钮权限
}

// 改变状态值
const mutations = {
    SET_SYSTEM_MENU: (state, data) =>{
        state.init = true   //已加载用户权限
        state.menuList = data.menuTreeList
        state.buttonList = data.buttonList
    }
}

const actions = {

    // 获取用户菜单和按钮权限
    GetUserMenu({commit}){
        return new Promise((resolve, rejrct) =>{
            // 获取用户ID
            const userId = PcCookie.get(Key.userInfoKey) 
            ? JSON.parse(PcCookie.get(Key.userInfoKey)).uid : null
            // 发送请求获取权限信息
            if(userId){
                getUserMenuList(userId).then(response =>{
                    // 获取到了，将菜单和按钮数据保存到vuex状态
                    commit('SET_SYSTEM_MENU', response.data)
                    resolve()
                }).catch(error =>{
                    rejrct(error)
                })
            }
        })
    }
}

export default{
    namespaced: true,   //引用黎需要指定模块名
    state,
    mutations,
    actions
}