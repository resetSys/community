<template>
  <div class="account-man">
    <title-bar>
      <span slot="title">账户管理</span>
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
        :data="accData"
        style="width: 100%"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="id"
          align="center"
          show-overflow-tooltip
          label="ID">
        </el-table-column>
        <el-table-column
          prop="user"
          align="center"
          show-overflow-tooltip
          label="账户名称">
        </el-table-column>
        <el-table-column
          prop="pass"
          align="center"
          show-overflow-tooltip
          label="账户密码">
        </el-table-column>
        <el-table-column
          prop="des"
          align="center"
          show-overflow-tooltip
          label="备注">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <!-- <el-button style="color:var(--brand-color);" type="text" @click="getLimitData(scope.row)">权限</el-button> -->
            <el-button style="color:var(--brand-color);" type="text"
              @click="editMsg(scope.row)">编辑</el-button>
            <el-button style="color:var(--delete-color);" type="text"
              @click="delMsg(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页组件 -->
    <pagination :pageSize="pageSize" :allPage="allPage" :currIndex="currPage"
      @hanSiChange="hanSiChange" @hanCurrChange="hanCurrChange"></pagination>
    <!-- 新增账户 -->
    <el-drawer :visible.sync="addDrawer" 
      :with-header="false"
      :wrapper-closable="$store.state.closeOnClickModal"
      :close-on-press-escape="$store.state.closeOnPresEscape">
      <div class="drawer-title">
        新增账户
      </div>
      <el-scrollbar style="height:calc(100vh - 100px);">
        <div class="drawer-con">
          <el-form :model="addForm" :rules="addFormRule" ref="addForm" label-width="7vw" label-position="right">
            <el-form-item label="名称" prop="user">
              <el-input v-model="addForm.user" placeholder="中英文长度不超过40"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input v-model="addForm.pass" type="password" show-password
                placeholder="不能包含中文和特殊符号"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPass">
              <el-input v-model="addForm.confirmPass" type="password" show-password
                placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="addForm.des" type="text"
                placeholder="备注信息"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <div class="drawer-bottom">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="closeDrawer">取消</el-button>
      </div>
    </el-drawer>
    <!-- 显示权限 -->
    <el-dialog custom-class="limit-dialog" :visible.sync="limitDialog" 
      width="30%"
      title="权限设置" :top="$store.state.dialogTop"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
      @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedLimits" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="(limit,index) in limitsOptions" :label="limit"
        :key="index">{{limit}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="limitDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitLimit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//组件
import titleBar from "components/common/titleBar/TitleBar";
import searchBar from "components/common/searchBar/SearchBar";
import pagination from "components/common/pagination/Pagination";
//请求
import {request} from "@/network/request";
//工具
import { handleRequest } from "@/utils";
export default {
  name: 'accountMan',
  data() {
    return {
      // 新增dialog
      addDrawer:false,

      //权限
      limitDialog:false,
      checkAll: false,
      checkedLimits: [],
      limitsOptions: [],
      limitsObj:[],//存放所有的权限
      limitId:null,//用于权限提交
      isIndeterminate: true,

      //添加表单
      addForm:{
        id:null,
        user:null,
        pass:null,
        confirmPass:null,
        des:null
      },
      addFormRule:{
        user:[
          {required: true, message: '请输入名称', trigger: 'blur'},
          {max:40,min:2,message:"长度为2-40位",trigger:'blur'},
        ],
        pass:[
          {required: true, message: '请输入密码', trigger: 'blur'},
          {max:16,min:8,message:"长度为8-16位",trigger:'blur'},
          {validator:(rule, value, callback)=>{
            let reg = /[0-9A-Za-z]$/
            if (!reg.test(value)) {
              callback(new Error("密码为字母数字组成"))
            } else {
              callback()
            }
          },trigger:'blur'}
        ],
        confirmPass:[
          {required: true, message: '请再次输入密码', trigger: 'blur'},
          {validator:(rule, value, callback) =>{
            if (value !== this.addForm.pass) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
          },trigger: 'blur'}
        ]
      },

      //账号数据
      accData:[],

      //分页
      pageSize:30,
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
    // 新增账户
    handleAdd(){
      this.addDrawer = true
      this.submitType = 1
    },
    //编辑账户
    editMsg(row){
      //将本行数据赋值给表单
      for (const key in this.addForm) {
        if (this.addForm.hasOwnProperty(key)) {
          this.addForm[key] = row[key];
        }
      }
      this.addDrawer = true;
      this.submitType = 2
    },
    submit(){//提交表单
      // window.console.log(this.addForm)
      // 提交成功后应该关闭drawer，表单会自动清除
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('handleLoding')
          if (this.submitType === 1) {
            //执行注册
            request({
                url:"/account/insert",
                method:"post",
                data:{
                  user:this.addForm.user,
                  pass:this.addForm.pass,
                  pass_md5:this.$md5(this.addForm.pass),
                  remarks:this.addForm.des
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
              this.getAccData();
              this.closeDrawer();
            }).catch(err =>{
              window.console.log(err)
            }).finally(()=>{
              this.$store.commit('handleLoding')
            })
          } else if(this.submitType === 2){
            //执行修改
            request({
                url:"/account/update",
                method:"post",
                data:{
                  account_id:this.addForm.id,
                  user:this.addForm.user,
                  pass:this.addForm.pass,
                  pass_md5:this.$md5(this.addForm.pass),
                  remarks:this.addForm.des
                }
              }).then(res => {
              // window.console.log(res)
              let respond = handleRequest.call(this,res.data);
              if (respond !== false) {
                this.$message({
                  message: respond,
                  type: 'success'
                });
              }
              //成功后刷新
              this.getAccData();
              this.closeDrawer();
            }).catch(err =>{
              window.console.log(err)
            }).finally(()=>{
              this.$store.commit('handleLoding');
            })
          }
        } else {
          return false;
        }
      });
    },
    delMsg(row){//删除账户
      // window.console.log(row)
      this.$prompt('您确定要删除该账号吗?输入“确定”删除该账号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator:(value) =>{
          if (value === "确定") {
            return true
          } else {
            return "输入“确定”删除该设备"
          }
        }
      }).then(() => {
        this.$store.commit('handleLoding');
        request({
          url:"/account/delete",
          method:"post",
          data:{
            account_id:row.id
          }
        }).then((res) =>{
          let respond = handleRequest.call(this,res.data);
          if (respond !== false) {
            this.$message({
              message: respond,
              type: 'success'
            });
          }
          //刷新数据
          this.getAccData();
        }).catch(err =>{
          window.console.log(err);
        }).finally(()=>{
          this.$store.commit('handleLoding');
        })
      }).catch(() => {
       
      });
    },
    closeDrawer(){
      // 首先清空表单，然后关闭drawer
      this.$refs['addForm'].resetFields();
      for (const key in this.addForm) {
        this.addForm[key] = null
      }
      this.addDrawer = false;
    },
    
    //权限操作
    getLimitData(row){//获取权限信息
      this.limitDialog = true;
      //存储id，用于权限提交
      this.limitId = row.id;
      this.$store.commit('handleLoding');
      request({
        url:"/account/selectPower",
        method:"post",
        data:{
          account_id:row.id
        }
      }).then(res => {
        // window.console.log(res)
        let { bind,all } = res.data.respond
        this.limitsOptions = []
        this.checkedLimits = []
        this.limitsObj = all
        all.forEach(element => {
          this.limitsOptions.push(element.name)
        });
        bind.forEach(element => {
          this.checkedLimits.push(element.name)
        });
      }).catch(e => {
        window.console.log(e)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      }) 
    },
    getDevice(row){//获取绑定设备
      this.bindEquiDialog = true
      this.limitId = row.account_id
      this.$store.commit('handleLoding')
      request({
        url:"/account/selectBindDevice",
        method:"post",
        data:{
          account_id:row.account_id
        }
      }).then(res => {
        let data = handleRequest(res.data);
        this.deviceData = data.all;
        // window.console.log(data)
        /*
          将已绑定的数据存储
          如果绑定的设备中没有数据，那么就将本地数组清空
        */
        if (!data.bind) {
          //如果为空，将本地的清空
          for (const key in this.checkedDevice) {
            if (this.checkedDevice.hasOwnProperty(key)) {
              this.checkedDevice[key] = [];
            }
          }
          // window.console.log("清空原数组")
        } else {
          for (const key in data.bind) {
            if (data.bind.hasOwnProperty(key)) {
              this.checkedDevice[key] = [];
              // window.console.log(key)
              this.checkedDevice[key].push(data.bind[key])
            }
          }
          // window.console.log("循环复制")
        }
      }).catch(e => {
        window.console.log(e)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    submitLimit(){//提交选中权限
      //遍历对象，将number取出来
      let powerArr = []
      this.limitsObj.forEach(ele1 => {
        this.checkedLimits.forEach(ele2 => {
          if (ele1.name === ele2) {
            powerArr.push(ele1.number)
          }
        });
      });
      // window.console.log("powerArr："+powerArr)
      this.$store.commit('handleLoding')
      request({
        url:"/account/updatePower",
        method:"post",
        data:{
          account_id:this.limitId,
          power_id:powerArr
        }
      }).then(res => {
        this.$message({
          message: res.data.respond,
          type: 'success'
        });
        this.limitDialog = false
      }).catch(e => {
        window.console.log(e)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    submitBindDevice(){//提交绑定的设备
      this.$store.commit('handleLoding')
      request({
        url:"/account/updateBindDevice",
        method:"post",
        data:{
          account_id:this.limitId,
          person_login:!this.checkedDevice.person_login ? null :this.checkedDevice.person_login[0],
          plate_discern:!this.checkedDevice.visitor_login ? null :this.checkedDevice.visitor_login[0],
          visitor_login:!this.checkedDevice.visitor_login ? null :this.checkedDevice.visitor_login[0],
        }
      }).then(res => {
        // window.console.log(res)
        let msg =  handleRequest(res.data);
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
    },
    handleCheckAllChange(val) {//全选权限
      this.checkedLimits = val ? this.limitsOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      // window.console.log(value)
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.limitsOptions.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.limitsOptions.length;
    },

    /**
      表格数据检索
    */
    getAccData(){//获取账号数据
      this.$store.commit('handleLoding');
      request({
        url:"/account/select",
        method:"post",
        data:{
          currentPage:this.currPage,
          pageSize:this.pageSize
        }
      }).then(res => {
        // window.console.log(res);
        let {list,allCount} = handleRequest.call(this,res.data);
        this.allPage = allCount;
        this.accData = [];
        list.forEach(ele => {
          this.accData.push({
            id:ele.account_id,
            pass:ele.pass,
            passMd5:ele.pass_md5,
            power:ele.power,
            user:ele.user,
            des:ele.remarks
          });
        });
      }).catch((e) => {
        window.console.log(e);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      })
    },
    hanSiChange(val){//分页条数改变
      this.pageSize = val
      this.getAccData();
    },
    hanCurrChange(val){//当前页改变
      this.currPage = val
      this.getAccData();
    },
  },

  mounted(){
    this.getAccData.call(this);
  },
  
}
</script>

<style scoped>
.account-man{
  width: 100%;
  height: 100%;
}
/* 滚动区域 */
.scrollbar{
  height: calc(100% - 150px);
}
/* 绑定设备title */
.bind-title{
  padding:2px 0;
  font-size:14px;
  color: #303133;
}
</style>
