<template>
  <div class="face">
    <title-bar>
      <span slot="title">人脸识别设备</span>
      <span slot="control">
        <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
      </span>
    </title-bar>
    <search-bar>
      <span slot="control">
        
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
          label="设备ID"
          show-overflow-tooltip
          width="100">
        </el-table-column>
        <el-table-column
          prop="device_name"
          align="center"
          show-overflow-tooltip
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="ip"
          align="center"
          show-overflow-tooltip
          label="设备IP">
        </el-table-column>
        <el-table-column
          prop="location"
          align="center"
          show-overflow-tooltip
          label="设备位置">
        </el-table-column>
        <el-table-column
          prop="time"
          align="center"
          :formatter="formatTime"
          show-overflow-tooltip
          label="时间">
        </el-table-column>
        <el-table-column
          prop="type"
          align="center"
          show-overflow-tooltip
          :formatter="formatType"
          label="类型">
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
            <el-form-item label="设备类型" prop="type">
               <el-select v-model="addForm.type" placeholder="请选择" style="width:100%;"
                clearable>
                <el-option
                  v-for="item in deviceType"
                  :key="item.typeNum"
                  :label="item.typeStr"
                  :value="item.typeNum">
                </el-option>
              </el-select>
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
//工具方法
import { formatTime } from "@/utils";

export default {
  name: 'face',
  data() {
    let ipCheck = (rule, value, callback) =>{
      let reg = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/
      if (!reg.test(value)) {
        callback(new Error('格式不正确'))
      } else {
        callback()
      }
    }
    return {
      addDrawer:false,
      addForm:{
        device_name:"",
        ip:"",
        location:"",
        type:null,
        device_id:null
      },
      addFormRule:{
        device_name:[
          {required: true, message: '请输入设备名称', trigger: 'blur'},
          {validator:(rule, value, callback)=>{
            if (value.length > 40) {
              callback(new Error ('长度限制40'))
            } else {
              callback()
            }
          },trigger: 'blur'}
        ],
        ip:[
          {required: true, message: '请输入设备IP', trigger: 'blur'},
          {validator:ipCheck,trigger:'blur'}
        ],
        location:[
          {validator:(rule, value, callback)=>{
            if (typeof value === 'string' && value.length > 200) {
              callback(new Error ('长度限制200'))
            } else {
              callback()
            }
          },trigger: 'blur'}
        ],
        type:[
          {required: true, message: '请输入设备位置', trigger: 'blur'}
        ]
      },
      deviceType:[],
      deviceData:[],
      //分页内容
      pageSize:20,
      allPage:0,
      currPage:1,
      submitType:1,//记录是注册还是修改
    }
  },
  components: {
    titleBar,
    searchBar,
    pagination
  },
  methods:{
    handleAdd(){
      this.addDrawer = true
      this.submitType = 1
    },
    submit(){
      //提交表单
      /*
        当新增的时候使用新增的接口和数据
        当修改的时候调用修改的接口和数据
      */
      // 提交成功后应该关闭drawer，表单会自动清除
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if (this.submitType === 1) {
            //执行注册
            request({
                url:"/device/insert",
                method:"post",
                data:{
                  device_name:this.addForm.device_name,
                  location:this.addForm.location,
                  type:this.addForm.type,
                  ip:this.addForm.ip
                }
              }).then(res => {
              // window.console.log(res)
              this.$message({
                message: res.data.respond,
                type: 'success'
              });
              //成功后刷新
              this.getDeviceData.call(this)
              this.closeDrawer.call(this)
            }).catch(err =>{
              window.console.log(err)
            })
          } else if(this.submitType === 2){
            //执行修改
            request({
                url:"/device/update",
                method:"post",
                data:{
                  device_name:this.addForm.device_name,
                  device_id:this.addForm.device_id,
                  location:this.addForm.location,
                  type:this.addForm.type,
                  ip:this.addForm.ip,
                }
              }).then(res => {
              // window.console.log(res)
              this.$message({
                message: res.data.respond,
                type: 'success'
              });
              //成功后刷新
              this.getDeviceData.call(this)
              this.closeDrawer.call(this)
            }).catch(err =>{
              window.console.log(err)
            })
          }
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
      this.$prompt('您确定要删除该设备吗?删除设备的同时将会删除设备的相关的考勤和人员出入的记录，输入“确定”删除该设备', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator:(value)=>{
          if (value === "确定") {
            return true
          } else {
            return "输入“确定”删除该设备"
          }
        }
      }).then(() => {
        request({
          url:"/device/delete",
          method:"post",
          data:{
            device_id:row.device_id
          }
        }).then((res) =>{
          this.$message({
            type: 'success',
            message: res.data.respond,
          });
          //刷新数据
          this.getDeviceData.call(this)
        }).catch(err =>{
          window.console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        });       
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
      this.submitType = 2
    },
    getDeviceData(){//请求设备数据
      request({
        url:"/device/select",
        method:"post",
        data:{
          currentPage:this.currPage,
          pageSize:this.pageSize
        }
      }).then(res => {
        // window.console.log(res)
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
    getDeviceType(){//获取设备类型
      request({
        url:"/device/type",
        method:"get",
      }).then(res =>{
        this.deviceType = res.data.respond.deviceTypes
      }).catch(err =>{
        window.console.log(err)
      })
    },
    hanSiChange(val){
      // window.console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getDeviceData.call(this)
    },
    hanCurrChange(val){
      // window.console.log(`当前页: ${val}`);
      this.currPage = val
      this.getDeviceData.call(this)

    },
    //转换表格数据格式
    formatTime(row){
      // window.console.log(row, column, cellValue, index)
      return formatTime(row.time,'Y年M月D日 h:m:s')
    },
    formatType(row){//转换type
      switch (row.type) {
        case 1:
          return "人脸识别设备进"
        case 2:
          return "人脸识别设备出"
        case 3:
          return "人脸识别设备 出&入"
        case 4:
          return "员工注册设备"
        case 5:
          return "访客注册设备"
        default:
          break;
      }
    }
  },
  created(){
    this.getDeviceData.call(this)
    this.getDeviceType.call(this)
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
