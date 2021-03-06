import request from '@/utils/request'

export default{
    // 分页条件查询列表
    getlist(query, current = 1, size = 20){
        return request({
            url: `/article/category/search`,
            method: 'post',
            data: {
                ...query,
                current,
                size
            }
        })
    },
    add( data ){    //新增类别
        return request({
            url: `/article/category`,
            method: 'post',
            data
        })
    },
    getById( id ){  //通过类别 ID 查询数据接口
        return request({
            url:`/article/category/${id}`,
            method: 'get'
        })
    },
    updata(data){   //更新数据
        return request({
            url: `/article/category`,
            method: 'put',
            data
        })
    },
    deleteById( id ){
        return request({
            url: `/article/category/${id}`,
            method: 'delete'
        })
    },
    // 查询正常状态下的分类
    getNormalList(){
        return request({
            url: `/article/category/list`,
            method: 'get'
        })
    },
    getCategoryAndLabel(){
        return request({
            url: `/article/category/label/list`,
            method: 'get'
        })
    }
}