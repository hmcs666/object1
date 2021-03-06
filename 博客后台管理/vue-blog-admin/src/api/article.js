import request from '@/utils/request'

export default{
    getList(query, current = 1, size = 20){
        return request({
            url:`/article/article/search`,
            method: 'post',
            data: {
                ...query,
                current,
                size
            }
        })
    },
    getById(id){
        return request({
            url: `/article/article/${id}`,
            method: 'get',
        })
    },
    auditSuccess(id) {  //审核通过
        return request({
            url: `/article/article/audit/success/${id}`,
            method: 'get'
        })
    },
    auditFail(id) { //审核未通过
        return request({
            url: `/article/article/audit/fail/${id}`,
            method: 'get'
        })
    },
    deleteById(id){
        return request({
            url: `/article/article/${id}`,
            method: 'delete'
        })
    }
}