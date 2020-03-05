<template>
  <div class="face">
    <title-bar>
      <span slot="title">人脸识别设备</span>
      <span slot="control">
        <el-button type="primary" size="small" @click="addDrawer = true">新增</el-button>
      </span>
    </title-bar>
    <search-bar>
      <span slot="control">
        <el-input size="small" style="width:200px;"></el-input>
        <el-button size="small" type="primary">搜索</el-button>
      </span>
    </search-bar>
    <el-scrollbar class="scrollbar">
       <el-table
        :data="deviceData"
        style="width: 100%"
        size="small"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="device_id"
          align="center"
          label="设备id"
          width="100">
        </el-table-column>
        <el-table-column
          prop="device_name"
          align="center"
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="ip"
          align="center"
          label="设备IP">
        </el-table-column>
        <el-table-column
          prop="location"
          align="center"
          label="设备位置">
        </el-table-column>
        <el-table-column
          prop="time"
          align="center"
          label="时间">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button style="color:#409EFF;" type="text" @click="editMsg(scope.row)">编辑</el-button>
            <el-button style="color:#F56C6C;" type="text" @click="delMsg(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页组件 -->
    <pagination :pageSize="pageSize" :allPage="allPage"
      @hanSiChange="hanSiChange" @hanCurrChange="hanCurrChange"></pagination>
    <!-- 新增功能 -->
    <el-drawer :visible.sync="addDrawer" 
      :with-header="false"
      :wrapper-closable="false"
      :close-on-press-escape="false">
      <div class="drawer-title">
        新增人脸识别设备
      </div>
      <el-scrollbar style="height:calc(100vh - 100px);">
        <div class="drawer-con">
          <el-form :model="addForm" :rules="addFormRule" ref="addForm" label-width="5vw" label-position="right">
            <el-form-item label="设备名称" prop="device_name">
              <el-input v-model="addForm.device_name"></el-input>
            </el-form-item>
            <el-form-item label="设备IP" prop="ip">
              <el-input v-model="addForm.ip"></el-input>
            </el-form-item>
            <el-form-item label="设备位置" prop="location">
              <el-input v-model="addForm.location"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <div class="drawer-bottom">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="closeDrawer">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import titleBar from "components/common/titleBar/TitleBar"
import searchBar from "components/common/searchBar/SearchBar"
import pagination from "components/common/pagination/Pagination"

//请求
import {request} from "@/network/request"

export default {
  name: 'face',
  data() {
    return {
      addDrawer:false,
      addForm:{
        device_name:"",
        ip:"",
        location:""
      },
      addFormRule:{
        device_name:[
          {required: true, message: '请输入设备名称', trigger: 'blur'}
        ],
        ip:[
          {required: true, message: '请输入设备IP', trigger: 'blur'}
        ],
        location:[
          {required: true, message: '请输入设备位置', trigger: 'blur'}
        ]
      },
      deviceData:[],
      //分页内容
      pageSize:20,
      allPage:100,
      currPage:1
    }
  },
  components: {
    titleBar,
    searchBar,
    pagination
  },
  methods:{
    submit(){
      //提交表单
      // 提交成功后应该关闭drawer，表单会自动清除
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          window.alert('submit!');
          //提交成功后清空表单
          this.closeDrawer.call(this)
        } else {
          return false;
        }
      });
    },
    closeDrawer(){
      // 首先清空表单，然后关闭drawer
      this.$refs['addForm'].resetFields()
      for (const key in this.addForm) {
        this.addForm[key] = null
      }
      this.addDrawer = false
    },
    delMsg(row){//删除账户
      window.console.log(row)
      this.$confirm('确定删除该账户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.alert("发送请求，删除该人员")
      }).catch(() => {
        window.alert("取消删除")
      });
    },
    editMsg(row){//修改设备信息
      /*
        将值赋值给注册表单
        将drawer打开
      */
      for (const key in this.addForm) {
        // if (this.addForm.hasOwnProperty(key)) {
          
        // }
        this.addForm[key] = row[key]
      }
      this.addDrawer = true
    },
    getDeviceData(){//请求设备数据
      window.console.log(this.pageSize)
      window.console.log(this.currPage)
      request({
        url:"http://192.168.1.215:8080/wisdom_factorys/device/select",
        method:"post",
        data:{
          currentPage:this.currPage,
          pageSize:this.pageSize
        }
      }).then(res => {
        window.console.log(res)
        //将数据循环放进数组中
        this.deviceData = []
        let {allCount,list} = res.data.respond
        list.forEach((value) => {
          this.deviceData.push(value)
        });
        this.allPage = allCount
      }).catch(e => {
        window.console.log(e)
      })
    },
    hanSiChange(val){
      window.console.log(`每页 ${val} 条`);
      this.pageSize = val
    },
    hanCurrChange(val){
      window.console.log(`当前页: ${val}`);
      this.currPage = val
    }
  },
  created(){
    this.getDeviceData.call(this)
  },
}
</script>

<style scoped>
.face{
  width: 100%;
  height: 100%;
}
.scrollbar{
  height: calc(100% - 150px);
}
</style>
