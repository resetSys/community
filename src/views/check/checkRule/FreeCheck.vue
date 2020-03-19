<template>
  <div class="free-check">
    <title-bar>
      <span slot="title">自由考勤</span>
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
        :data="fileData"
        style="width: 100%"
        size="small"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="id"
          align="center"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="manTime"
          align="center"
          label="工时">
        </el-table-column>
        <el-table-column
          prop="des"
          align="center"
          label="描述">
        </el-table-column>

        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="getDevice(scope.row)">绑定设备</el-button>
            <el-button type="text" @click="edit(scope.row,'addForm','addDrawer')">编辑</el-button>
            <el-button type="text" style="color:var(--delete-color)" 
              @click="deleteFile(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页组件 -->
    <pagination :pageSize="pageSize" :allPage="allPage" :currIndex="currPage"
      @hanSiChange="hanSiChange" @hanCurrChange="hanCurrChange"></pagination>
    <!-- 新增规则 -->
    <el-drawer :visible.sync="addDrawer" 
      :with-header="false"
      :wrapper-closable="false"
      :close-on-press-escape="false">
      <div class="drawer-title">
        新增规则
      </div>
      <div style="height:calc(100vh - 100px);">
        <div class="drawer-con">
          <el-form :model="addForm" :rules="addFormRule" 
            ref="addForm" label-width="7vw" label-position="right">
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="时间范围" prop="manTime">
              <el-time-picker
                style="width:100%"
                placeholder="选择工作时长"
                value-format="H:m"
                v-model="addForm.manTime">
              </el-time-picker>
            </el-form-item>
            <el-form-item label="描述" prop="des">
              <el-input v-model="addForm.des"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="drawer-bottom">
        <el-button type="primary" @click="submit()">提交</el-button>
        <el-button @click="close('addForm','addDrawer')">取消</el-button>
      </div>
    </el-drawer>
    <!-- 绑定设备 -->
    <el-dialog custom-class="limit-dialog"
      :visible.sync="bindEquiDialog" width="30%"
      title="绑定设备" :top="$store.state.dialogTop"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">

      <p class="bind-title">选择考勤设备:</p>
      <el-checkbox-group
        v-model="checkedDevice">
        <el-checkbox v-for="(item,index) in deviceData" :label="item.id" :key="index">{{item.label}}</el-checkbox>
      </el-checkbox-group>

      <span slot="footer" class="dialog-footer">
        <el-button @click="bindEquiDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitBindDevice">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//组件
import titleBar from "components/common/titleBar/TitleBar"
import searchBar from "components/common/searchBar/SearchBar"
import pagination from "components/common/pagination/Pagination"
//工具类
import { handleRequest,formatMinutes,formatHS } from "@/utils"
//网络请求
import { request } from "@/network/request";
export default {
  name: '',
  data() {
    return {
      fileData:[],
      addForm:{
        id:null,
        name:"",
        manTime:null,
        des:""
      },
      addFormRule:{
        name:[
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min: 2, max: 40, message:"长度为2-40之间", trigger: 'blur'}
        ],
        manTime:[
          {required: true, message: '请选择工作时长', trigger: 'blur'}
        ],
        des:[
          {min: 0, max: 200, message:"长度在400个字符之内", trigger: 'blur'}
        ]
      },
      addDrawer:false,
      submitType:1,
      ruleId:null,
      //绑定设备
      bindEquiDialog:false,
      checkedDevice:[],
      deviceData:[],
      //分页
      pageSize:20,
      allPage:0,
      currPage:1,
    }
  },
  components: {
    titleBar,
    searchBar,
    pagination 
  },
  methods:{
    handleAdd(){//新增自由考勤
      this.addDrawer = true;
      this.submitType = 1
    },
    edit(row,formName,dialog){
      this.submitType = 2;
      this.ruleId = row.id;
      for (const key in this[formName]) {
        if (this[formName].hasOwnProperty(key)) {
          this[formName][key] = row[key]
        }
      }
      this[dialog] = true
    },
    close(formName,dialog){//关闭注册抽屉
      // 首先清空表单，然后关闭drawer
      this.$refs[formName].resetFields()
      for (let key in this[formName]) {
        this[formName][key] = null
      }
      this[dialog] = false
    },
    deleteFile(row){//删除
      // window.console.log(row)
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('handleLoding')
        request({
          url:"/cowa/deleteFreedomCowa",
          method:"post",
          data:{
            cowa_id:row.id
          }
        }).then((res) =>{
          this.$message({
            type: 'success',
            message: res.data.respond,
          });
          //刷新数据
          this.getRuleData.call(this)
        }).catch(err =>{
          window.console.log(err)
        }).finally(()=>{
          this.$store.commit('handleLoding')
        })
        
      }).catch(() => {});
    },
    submit(){//提交规则集合
      // window.console.log(this.addForm)
      // 提交成功后应该关闭drawer，表单会自动清除
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('handleLoding')
          if (this.submitType === 1) {
            //执行注册
            request({
                url:"/cowa/insertFreedomCowa",
                method:"post",
                data:{
                  cowa_name:this.addForm.name,
                  need_time:formatMinutes(this.addForm.manTime),
                  remarks:this.addForm.des
                }
              }).then(res => {
                // window.console.log(res)
                this.$message({
                  message: res.data.respond,
                  type: 'success'
                });
              //成功后刷新
              this.getRuleData.call(this)
              this.close.call(this,'addForm','addDrawer')
            }).catch(err =>{
              window.console.log(err)
            }).finally(()=>{
              this.$store.commit('handleLoding')
            })
          } else if(this.submitType === 2){
            //执行修改
             request({
                url:"/cowa/updateFreedomCowa",
                method:"post",
                data:{
                  cowa_id:this.ruleId,
                  cowa_name:this.addForm.name,
                  need_time:formatMinutes(this.addForm.manTime),
                  remarks:this.addForm.des
                }
              }).then(res => {
                window.console.log(res)
                this.$message({
                  message: res.data.respond,
                  type: 'success'
                });
              //成功后刷新
              this.getRuleData.call(this)
              this.close.call(this,'addForm','addDrawer')
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
    getRuleData(){//获取自由考勤数据
      this.$store.commit('handleLoding')
      request({
        url:"/cowa/selectFreedomCowa",
        method:"post",
        data:{
          currentPage:this.currPage,
          pageSize:this.pageSize
        }
      }).then((res) => {
        // window.console.log(res)
        let {allCount,list} = handleRequest(res.data);
        this.fileData = []
        this.allPage = allCount;
        list.forEach(ele => {
          this.fileData.push(
            {id:ele.cowa_id,
            name:ele.cowa_name,
            manTime:formatHS(ele.need_time),
            des:ele.remarks})
        });
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    hanSiChange(val){//分页条数改变
      // window.console.log(val)
      this.currPage = val
      this.getAccData.call(this)
    },
    hanCurrChange(val){//当前页改变
      this.currPage = val
      this.getAccData.call(this)
    },
    //绑定设备
    getDevice(row){//获取设备
      this.bindEquiDialog = true
      this.ruleId = row.id
      // window.console.log(row.id)
      this.$store.commit('handleLoding')
      request({
        url:"/cowa/selectFreedomDevice",
        method:"post",
        data:{
          cowa_id:row.id,
        }
      }).then((res) => {
        // window.console.log(res)
        let { all,bind } = res.data.respond;
        this.deviceData = [];
        all.forEach(ele => {
          this.deviceData.push({id:ele.device_id,label:ele.device_name})
        });
        this.checkedDevice = bind;
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    submitBindDevice() {//提交绑定设备
      this.$store.commit('handleLoding')
      request({
        url:"/cowa/updateFreedomDevice",
        method:"post",
        data:{
          id:this.ruleId,
          list:this.checkedDevice
        }
      }).then(res => {
        // window.console.log(res)
        let msg =  res.data.respond;
        this.$message({
          message: msg,
          type: 'success'
        });
        this.bindEquiDialog = false
      }).catch(e => {
        window.console.log(e)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    }
    
  },
  mounted(){
    this.getRuleData.call(this)
  },
}
</script>

<style scoped>
.free-check{
  width: 100%;
  height: 100%;
}
.el-date-editor{
  margin: 0 5px;
}
/* 滚动区域 */
.scrollbar{
  height: calc(100% - 150px);
}
</style>
