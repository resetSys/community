<template>
  <div class="car">
    <title-bar>
      <span slot="title">车牌识别设备管理</span>
      <span slot="control">
        <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
      </span>
    </title-bar>
    <search-bar>
      <!-- <span slot="control">
        <el-input size="small" style="width:200px;"></el-input>
        <el-button size="small" type="primary">搜索</el-button>
      </span> -->
    </search-bar>
    <el-scrollbar class="scrollbar">
       <el-table
        :data="deviceData"
        style="width: 100%"
        size="small"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="name"
          align="center"
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="ip"
          align="center"
          label="设备IP">
        </el-table-column>
        <el-table-column
          prop="typeStr"
          align="center"
          label="设备类型">
        </el-table-column>
        <el-table-column
          prop="location"
          align="center"
          label="设备位置">
        </el-table-column>
        <el-table-column
          prop="remarks"
          align="center"
          label="备注">
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
    <pagination :pageSize="pageSize" :allPage="allPage" :currIndex="currPage"
      @hanSiChange="hanSiChange" @hanCurrChange="hanCurrChange"></pagination>
    <!-- 新增功能 -->
    <el-drawer :visible.sync="addDrawer" 
      :with-header="false"
      :wrapper-closable="false"
      :close-on-press-escape="false">
      <div class="drawer-title">
        新增车牌识别设备
      </div>
      <el-scrollbar style="height:calc(100vh - 100px);">
        <div class="drawer-con">
          <el-form :model="addForm" :rules="addFormRule" ref="addForm" label-width="5vw" label-position="right">
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="IP" prop="ip">
              <el-input v-model="addForm.ip"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="addForm.type" placeholder="请选择" style="width:100%;"
                clearable>
                <el-option
                  v-for="item in deviceType"
                  :key="item.type"
                  :label="item.typeStr"
                  :value="item.type">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="位置" prop="location">
              <el-input v-model="addForm.location"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="addForm.remarks"></el-input>
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
import titleBar from "components/common/titleBar/TitleBar";
import searchBar from "components/common/searchBar/SearchBar";
import pagination from "components/common/pagination/Pagination";

//网络请求
import { request } from "@/network/request";
//工具方法
import { print,handleRequest } from "@/utils";
export default {
  name: 'car',
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
        id:"",
        ip:"",
        name:"",
        type:"",
        location:"",
        remarks:""
      },
      addFormRule:{
        name:[
          {required: true, message: '请输入名称', trigger: 'blur'},
          {validator:(rule,val,callback)=> {
            if (val !== null) {
              if (val.length > 40) {
                callback(new Error('长度不能超过40'));
              } else {
                callback();
              }
            }
          },trigger:'blur'}
        ],
        ip:[
          {required: true, message: '请输入ip地址', trigger: 'blur'},
          {validator:ipCheck,trigger:'blur'}
        ],
        type:[
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
      },
      deviceData:[],
      deviceType:[],
      //分页
      pageSize:10,
      allPage:0,
      currPage:1,
      submitType:1
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
          this.$store.commit('handleLoding');
          if (this.submitType === 1) {
            //执行注册
            request({
                url:"/plateDevice/insert",
                method:"post",
                data:{
                  ip:this.addForm.ip,
                  type:this.addForm.type,
                  device_name:this.addForm.name,
                  location:this.addForm.location,
                  remarks:this.addForm.remarks
                }
              }).then(res => {
              let respond = handleRequest.call(this,res.data);
              if (respond !== false) {
                this.$message({
                  message: respond,
                  type: 'success'
                });
              }
              //成功后刷新
              this.getDeviceData.call(this);
              this.closeDrawer.call(this);
            }).catch(err =>{
              window.console.log(err);
            }).finally(()=>{
              this.$store.commit('handleLoding');
            });
          } else if(this.submitType === 2){
            //执行修改
            request({
                url:"/plateDevice/update",
                method:"post",
                data:{  
                  id:this.addForm.id,
                  ip:this.addForm.ip,
                  type:this.addForm.type,
                  device_name:this.addForm.name,
                  location:this.addForm.location,
                  remarks:this.addForm.remarks
                }
              }).then(res => {
              let respond = handleRequest.call(this,res.data);
              if (respond !== false) {
                this.$message({
                  message: respond,
                  type: 'success'
                });
              }
              //成功后刷新
              this.getDeviceData.call(this)
              this.closeDrawer.call(this)
            }).catch(err =>{
              window.console.log(err)
            }).finally(()=>{
              this.$store.commit('handleLoding')
            })
          }
        } else {
          return false;
        }
      });
    },
    closeDrawer(){
      // 首先清空表单，然后关闭drawer
      this.$refs['addForm'].resetFields();
      for (const key in this.addForm) {
        this.addForm[key] = null;
      }
      this.addDrawer = false;
    },
    //获取设备数据
    getDeviceData(){
      this.$store.commit('handleLoding');
      request({
        url:"/plateDevice/select",
        method:"post",
        data:{
          currentPage:this.currPage,
          pageSize:this.pageSize
        }
      }).then((res) => {
        this.deviceData = [];
        let {allCount,list} = handleRequest.call(this,res.data);
        this.allPage = allCount;
        list.forEach(val => {
          this.deviceData.push({
            id:val.id,
            ip:val.ip,
            name:val.device_name,
            type:val.type,
            typeStr:val.typeStr,
            location:val.location,
            remarks:val.remarks
          });
        });
      }).catch((err) => {
        print(err);        
      }).finally(()=>{
        this.$store.commit('handleLoding')
      });
    },
    // 表单操作
    getTypeData(){//获取类型数据
      this.$store.commit('handleLoding');
      request({
        url:"/plateDevice/selectType",
        method:"get",
      }).then((res) => {
        // print(res);
        this.deviceType = [];
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          respond.forEach(val => {
            this.deviceType.push({type:val.type,typeStr:val.typeStr});
          });
        }
      }).catch((err) => {
        print(err);        
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
    delMsg(row){//删除账户
      // print(row);
      this.$confirm('确定删除该账户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('handleLoding');
        request({
          url:"/plateDevice/delete ",
          method:"post",
          data:{
            id:row.id
          }
        }).then((res) => {
          let respond = handleRequest.call(this,res.data);
          if (respond !== false) {
            this.$message({
              message: respond,
              type: 'success'
            });
          }
          this.getDeviceData.call(this);
        }).catch((err) => {
          print(err);        
        }).finally(()=>{
          this.$store.commit('handleLoding');
        });
      }).catch(() => {
        
      });
    },
    editMsg(row){//修改设备信息
      /*
        将值赋值给注册表单
        将drawer打开
      */
      this.submitType = 2;
      for (const key in this.addForm) {
        if (this.addForm.hasOwnProperty(key)) {
          this.addForm[key] = row[key]
        }
      }
      this.addDrawer = true;
    },
    handleAdd(){//点击新增按钮
      this.addDrawer = true;
      this.submitType = 1;
    },

    //分页请求
    hanSiChange(val){//分页条数改变
      // window.console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getDeviceData.call(this);
    },
    hanCurrChange(val){//当前页改变
      // window.console.log(`当前页: ${val}`);
      this.currPage = val;
      this.getDeviceData.call(this);
    },
  },
  mounted(){
    this.getTypeData.call(this);
    this.getDeviceData.call(this);
  }
}
</script>

<style scoped>
.car{
  width: 100%;
  height: 100%
}
/* 滚动区域 */
.scrollbar{
  height: calc(100% - 150px);
}
</style>
