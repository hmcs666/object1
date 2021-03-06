<template>
  <div>
      <el-form ref="seachForm" :inline="true" :model="searchMap" style="margin-top : 20px">
        <el-form-item prop="cardNum">
          <el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="searchMap.name" placeholder="会员名称"></el-input>
        </el-form-item>
        <el-form-item prop="payType">
          <el-select v-model="searchMap.payType" placeholder="支付类型" style="width : 120px">
            <el-option v-for="option in payTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="birthday">
          <el-date-picker
            v-model="searchMap.birthday"
            type="date"
            placeholder="出生日期"
            value-format="yyyy-MM-dd"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData" class="el-icon-search"> 查询</el-button>
          <el-button type="primary" class="el-icon-edit" @click="handleAdd"> 添加</el-button>
          <el-button @click="restFrom('seachForm')">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="list"
        height="380"
        border
        style="width: 100%">
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column prop="cardNum" label="会员卡号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="birthday" label="会员生日"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="integral" label="可用积分"></el-table-column>
        <el-table-column prop="money" label="余额"></el-table-column>
        <el-table-column prop="payType" label="支付类型">
          <template slot-scope="scope">
            <span>{{scope.row.payType | payTypeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="会员地址"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row.id)" type="primary" size="mini">编辑</el-button>
            <el-button @click="handleDlet(scope.row.id)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.total">
          </el-pagination>
    </div>

    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="pojo" ref="pojoForm" label-width="100px" label-position="right" style="width: 400px" :rules="rules"  >
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
            v-model="pojo.birthday"
            type="date"
            placeholder="出生日期"
            value-format="yyyy-MM-dd"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral"></el-input>
        </el-form-item>
        <el-form-item prop="payType" label="支付类型">
          <el-select v-model="pojo.payType" placeholder="点击选择" style="width : 120px">
            <el-option v-for="option in payTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input type="textarea" :rows="2" v-model="pojo.address" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="pojo.id === null ? addData('pojoForm') : updateData('pojoForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import membrApi from '@/api/member'

const payTypeOptions =[
  {type: '1', name: '现金'},
  {type: '2', name: '银行卡'},
  {type: '3', name: '微信'},
  {type: '4', name: '支付宝'}
]

export default {
  data() {
    return{
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示条数
      searchMap: {
        cardNum: '',
        name: '',
        payType: '',
        birthday: ''
      },  //条件查询
      payTypeOptions,
      dialogFormVisible: false,
      pojo: {
        id: null,
        cardNum: '',
        name: '',
        phone: '',
        payType: '',
        money: 0,
        birthday: '',
        integral: 0,
        address: ''
      },
      
      rules: {
        cardNum: [
          {required: true, message: '请输入会员卡号', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入会员姓名', trigger: 'blur'}
        ],
        payType: [
          {required: true, message: '请选择支付类型', trigger: 'change'}
        ]
      }
    }
  },
  created(){
    this.fetchData()
  },
  methods: {
    fetchData(){
      membrApi.search(this.currentPage, this.pageSize, this.searchMap).then(response =>{
        const resp = response.data
        this.list = resp.data.rows
        this.total = resp.data.total
      })
    },
    handleAdd(){
      this.dialogFormVisible = true
      this.$nextTick(() =>{
        this.$refs['pojoForm'].resetFields()
      })
    },
    handleEdit(id){
      this.handleAdd()
      membrApi.getById(id).then(response =>{
        const resp = response.data
        if(resp.flag){
          this.pojo = resp.data
        }
      })
    },
    updateData(formName){
      this.$refs[formName].validate(valid =>{
        if(valid){
          membrApi.updata(this.pojo).then(response =>{
            const resp = response.data
            if(resp.flag){
              this.fetchData()
              this.dialogFormVisible = false
            }else{
              this.$message({
                message: resp.message,
                type: 'warning'
              })
            }
          })
        }else{
          return false
        }
      })
    },
    handleDlet(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          membrApi.deleteById(id).then(response =>{
            const resp = response.data
            this.$message({
              message: resp.message,
              type: resp.flag ? 'success' : 'error'
            })
            if(resp.flag){
              this.fetchData()
            }
          });
        }).catch(() => {
        });
    },
    handleSizeChange(val) {
        this.pageSize = val
        this.fetchData()
    },
    handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData()
    },
    restFrom(formName){
      this.$refs[formName].resetFields()
    },
    addData(formName){
      this.$refs[formName].validate(valid =>{
        if(valid){
          membrApi.add(this.pojo).then(response =>{
            const resp = response.data
            if(resp.flag){
              this.fetchData()
              this.dialogFormVisible = false
            }else{
              this.$message({
                message: resp.message,
                type: 'warning'
              })
            }
          })
        }else{
          return false
        }
      })
    }
  },

  filters: {
    payTypeFilter (type){
      const payObj = payTypeOptions.find(obj => obj.type === type)
      return payObj ? payObj.name : null
    }
  },

}
</script>

<style scoped>

</style>