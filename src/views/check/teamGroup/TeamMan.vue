<template>
  <div class="team-man">
    <title-bar>
      <span slot="title">考勤组管理</span>
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
        :data="teamData"
        style="width: 100%"
        size="small"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="name"
          align="center"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="des"
          align="center"
          label="备注">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">

            <el-button style="color:var(--brand-color);" type="text" 
              @click="getRuleData(scope.row)">编辑周期考勤</el-button>
            <el-button style="color:var(--brand-color);" type="text" 
              @click="edit(scope.row,'addForm','addDrawer')">编辑</el-button>
            <el-button style="color:var(--delete-color);" type="text" 
            @click="delMsg(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页组件 -->
    <pagination :pageSize="pageSize" :allPage="allPage" :currIndex="currPage"
      @hanSiChange="hanSiChange" @hanCurrChange="hanCurrChange"></pagination>
    <!-- 新增班组 -->
    <el-drawer :visible.sync="addDrawer" 
      :with-header="false"
      :wrapper-closable="$store.state.closeOnClickModal"
      :close-on-press-escape="$store.state.closeOnPresEscape">
      <div class="drawer-title">
        新增班组
      </div>
      <el-scrollbar style="height:calc(100vh - 100px);">
        <div class="drawer-con">
          <el-form :model="addForm" :rules="addFormRule" ref="addForm" label-width="5vw" label-position="right">
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="addForm.des"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <div class="drawer-bottom">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="closeDrawer('addForm','addDrawer')">取消</el-button>
      </div>
    </el-drawer>

    <!-- 查看绑定规则 -->
    <el-dialog custom-class="limit-dialog" 
      :visible.sync="lookRuleDialog" 
      width="70%" title="编辑考勤组周期" :top="$store.state.dialogTop"
      style="overflow:hidden"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-scrollbar style="height:40vh">
         <el-table
          :data="temaRuleData"
          style="width: 100%"
          size="small"
          stripe
          empty-text="暂无数据">
          <el-table-column
            prop="name"
            align="center"
            label="名称">
          </el-table-column>
          <el-table-column
            prop="type"
            align="center"
            label="类型">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button style="color:var(--brand-color);" type="text" 
                @click="handleMove(scope.row,1)">↑</el-button>
              <el-button style="color:var(--brand-color);" type="text"
                @click="handleMove(scope.row,2)">↓</el-button>
              <el-button type="text" @click="handleData(scope.row)">工作日期</el-button>
              <el-button style="color:var(--delete-color);" type="text"
                @click="delRule(scope.row)">移出</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <div class="look-team-bottom">
        <el-button type="primary" @click="getAllRule">添加周期考勤</el-button>
      </div>
    </el-dialog>
    <!-- 添加绑定规则 -->
    <el-dialog custom-class="limit-dialog" 
      :visible.sync="addRuleDialog" 
      width="70%" :top="$store.state.dialogTop"
      :show-close="false"
      title="添加周期"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <!-- <div class="addPerSearch">
        <el-input placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div> -->
      <el-scrollbar style="height:40vh;">
        <el-table
          :data="ruleData"
          style="width: 100%"
          stripe
          @selection-change="handleSelectionChange"
          empty-text="暂无数据">
          <el-table-column
            type="selection"
            align="center"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            show-overflow-tooltip
            label="名称">
          </el-table-column>
          <el-table-column
            prop="type"
            align="center"
            show-overflow-tooltip
            label="类型">
          </el-table-column>
          <el-table-column
            prop="des"
            align="center"
            show-overflow-tooltip
            label="备注">
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <!-- <pagination></pagination> -->
      <div class="look-team-bottom">
        <el-button type="primary" @click="submitBindRule">提交</el-button>
        <el-button @click="addRuleDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 选择工作日期 -->
    <el-dialog custom-class="limit-dialog" 
      :visible.sync="choseDataDialog" 
      width="390px" :top="$store.state.dialogTop"
      style="overflow:hidden"
      :show-close="false"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <calendar ref="calendar" @choseData="choseData"/>
      <div class="look-team-bottom">
        <el-button type="primary" @click="submitData">确定</el-button>
        <el-button @click="choseDataDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//组件
import titleBar from "components/common/titleBar/TitleBar"
import searchBar from "components/common/searchBar/SearchBar"
import pagination from "components/common/pagination/Pagination"
import calendar from "components/common/calendar/Calendar";
//网络请求
import { request } from "@/network/request";
//工具类
import { handleRequest } from "@/utils"
export default {
  name: 'teamMan',
  data() {
    return {
      addDrawer:false,
      addForm:{
        id:"",
        name:"",
        des:""
      },
      addFormRule:{
        name:[
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min: 2, max: 40, message:"长度为2-40之间", trigger: 'blur'}
        ],
        des:[
          {min: 0, max: 200, message:"长度在400个字符之内", trigger: 'blur'}
        ]
      },
      teamData:[],
      addPerDialog:false,
      teamPersonData:[],
      personData:[{
        name:"员工1",
        sex:"男"
      }],
      lookRuleDialog:false,
      addRuleDialog:false,
      temaRuleData:[],//绑定规则
      ruleData:[],
      isSelectedRule:[],//存储已选择规则
      choseDataDialog:false,//选择日期dialog
      submitType:1,//班组提交类型
      parentId:null,//用于存储规则id
      teamId:null,//用于存储班组id
      //分页
      pageSize:20,
      allPage:0,
      currPage:1,
      //日期
      timestampArr:""
    }
  },
  components: {
    titleBar,
    searchBar,
    pagination,
    calendar
  },
  methods:{
    //班组增删改
    handleAdd(){//新增自由考勤
      this.addDrawer = true;
      this.submitType = 1
    },
    submit(){//提交表单
      // 提交成功后应该关闭drawer，表单会自动清除
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('handleLoding')
          if (this.submitType === 1) {
            //执行注册
            request({
              url:"/cowa/insertCowaGroup",
              method:"post",
              data:{
                cowa_group_name:this.addForm.name,
                remark:this.addForm.des
              }
            }).then(res => {
              // window.console.log(res)
              this.$message({
                message: res.data.respond,
                type: 'success'
              });
              //成功后刷新
              this.getTeam.call(this)
              this.closeDrawer.call(this,'addForm','addDrawer')
            }).catch(err =>{
              window.console.log(err)
            }).finally(()=>{
              this.$store.commit('handleLoding')
            })
          } else if (this.submitType === 2) {
            request({
              url:"/cowa/updateCowaGroup",
              method:"post",
              data:{
                cowa_group_name:this.addForm.name,
                remark:this.addForm.des,
                cowa_group_id:this.addForm.id
              }
            }).then(res => {
              window.console.log(res)
              this.$message({
                message: res.data.respond,
                type: 'success'
              });
              //成功后刷新
              this.getTeam.call(this)
              this.closeDrawer.call(this,'addForm','addDrawer')
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
    closeDrawer(formName,dialog){
      // 首先清空表单，然后关闭drawer
      this.$refs[formName].resetFields()
      for (let key in this[formName]) {
        this[formName][key] = null
      }
      this[dialog] = false
    },
    delMsg(row){
      // window.console.log(row)
      this.$confirm("确定要删除该班组吗?", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('handleLoding')
        request({
          url:"/cowa/deleteCowaGroup",
          method:"post",
          data:{
            cowa_group_id:row.id
          }
        }).then((res) =>{
          this.$message({
            type: 'success',
            message: res.data.respond,
          });
          //刷新数据
          this.getTeam.call(this)
        }).catch(err =>{
          window.console.log(err)
        }).finally(()=>{
          this.$store.commit('handleLoding')
        })

      }).catch(() => {

      });
    },
    edit(row,formName,dialog){//编辑
      this.submitType = 2;
      for (const key in this[formName]) {
        if (this[formName].hasOwnProperty(key)) {
          this[formName][key] = row[key]
        }
      }
      this[dialog] = true
    },

    //获取班组数据
    getTeam(){
      this.$store.commit('handleLoding')
      request({
        url:"/cowa/selectCowaGroup",
        method:"post",
        data:{
          currentPage:this.currPage,
          pageSize:this.pageSize,
        }
      }).then((res) => {
        // window.console.log(res)
        let {allCount,list} = handleRequest.call(this,res.data);
        this.allPage = allCount;
        this.teamData = []
        list.forEach(ele => {
          this.teamData.push({
            id:ele.cowa_group_id,
            name:ele.cowa_group_name,
            des:ele.remark
          })
        });
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    getRuleData(row){//获取绑定规则
      // window.console.log(row)
      this.teamId = row.id;
      this.lookRuleDialog = true
      //获取规则
      this.$store.commit('handleLoding')
      request({
        url:"/cowa/selectGroupOnbind",
        method:"post",
        data:{
          cowa_group_id:row.id
        }
      }).then((res) => {
        // window.console.log(res)
        let {respond} = res.data;
        this.temaRuleData = []
        respond.forEach(ele => {
          this.temaRuleData.push({
            id:ele.cowa_group_period_id,
            name:ele.cowa_name,
            type:ele.cowa_type
          })
        });
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    getAllRule(){//获取所有规则
      this.addRuleDialog = true
      this.$store.commit('handleLoding')
      request({
        url:"/cowa/selectGroupUnbind",
        method:"post",
        data:{
          cowa_group_id:this.teamId
        }
      }).then((res) => {
        // window.console.log(res)
        this.ruleData = []
        let {respond} = res.data
        respond.forEach(ele => {
          this.ruleData.push({
            id:ele.cowa_id,
            name:ele.cowa_name,
            type:ele.cowa_type,
            des:ele.remarks
          })
        });
        
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    handleSelectionChange(val){//用户选择checkbox
      // window.console.log(val)
      this.isSelectedRule = []
      val.forEach(ele => {
        this.isSelectedRule.push(ele.id)
      });
    },
    submitBindRule(){//提交绑定的设备
      if (!this.isSelectedRule.length == 0) {
        
        this.$store.commit('handleLoding')
        request({
          url:"/cowa/insertCowaGroupBind",
          method:"post",
          data:{
             id:this.teamId,
             list:this.isSelectedRule
          }
        }).then((res) => {
          // window.console.log(res)
          /*
            提交成功后刷新绑定设备数据，关闭dialog
          */
          this.$message({
            type: 'success',
            message: res.data.respond,
          });
          this.addRuleDialog = false;
          this.getRuleData.call(this,{id:this.teamId})
        }).catch((err) => {
          window.console.log(err)
        }).finally(()=>{
          this.$store.commit('handleLoding')
        })
      } else {
        this.$message({
          message: '请选择考勤规则',
          type: 'warning'
        });
      }
    },

    //分页
    hanSiChange(val){//分页条数改变
      // window.console.log(val)
      this.currPage = val
      // this.getAccData.call(this)
    },
    hanCurrChange(val){//当前页改变
      this.currPage = val
      // this.getAccData.call(this)
    },

    /*
      绑定规则操作
    */
    handleData(row){
      this.parentId= row.id
      this.choseDataDialog = true
      /*
        应该获取已绑定的时间，发送给日期组件，显示已绑定
      */
      request({
        url:"/cowa/selectScheduleTime",
        method:"post",
        data:{
          cowa_group_period_id:row.id,
        }
      }).then((res) => {
        window.console.log(res)
        let { dates } = res.data.respond;
        /*
          将字符串转换为数字类型数组
          空字符串要转换一下
        */
        if (dates == "") {
          this.$refs.calendar.timestampArr = []
        } else {
          this.$refs.calendar.timestampArr = dates.split(',').map(Number)
        }
      }).catch((err) => {
        window.console.log(err)
      });
    },
    choseData(val){//接收所选日期
      this.timestampArr = val.join()
    },
    submitData(){//提交所选日期
      /*
        提交成功后要将日期选择器清空
        本地时间戳数组也要清空
      */
      // window.console.log(this.parentId,this.timestampArr)
      this.$store.commit('handleLoding')
      request({
        url:"/cowa/setScheduleTime",
        method:"post",
        data:{
          cowa_group_period_id:this.parentId,
          dates:this.timestampArr
        }
      }).then((res) => {
        this.$message({
          type: 'success',
          message: res.data.respond,
        });
        /*
          时间戳发送成功后要将时间选择器的组件已选数据清空
          将timestampArr也清空
          关闭dialog
        */
        this.$refs.calendar.timestampArr = []
        this.timestampArr = ""
        this.choseDataDialog = false
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    handleMove(row,key){//上移下移
      // window.console.log(row.id,key)
      this.$store.commit('handleLoding')
      request({
        url:"/cowa/groupBindMove",
        method:"post",
        data:{
          move_type:key,
          cowa_group_period_id:row.id
        }
      }).then((res) => {
        // window.console.log(res);
        let data = handleRequest.call(this,res.data)
        if (data !== false) {
          this.$message({
            type: 'success',
            message: data,
          });
        }
        /*
          刷新绑定规则数据
        */
        // window.console.log(this.teamId)
        this.getRuleData.call(this,{id:this.teamId})
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    delRule(row){
      this.$store.commit('handleLoding')
      request({
        url:"/cowa/deleteCowaGroupBind",
        method:"post",
        data:{
          cowa_group_period_id:row.id
        }
      }).then((res) => {
        // window.console.log(res);
          this.$message({
            type: 'success',
            message: res.data.respond,
          });
        /*
          刷新绑定规则数据
        */
        this.getRuleData.call(this,{id:this.teamId})
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    }
  },
  mounted(){
    this.getTeam.call(this);
  }
}
</script>

<style scoped>
.team-man{
  width: 100%;
  height: 100%;
}
/* 滚动区域 */
.scrollbar{
  height: calc(100% - 150px);
}
/* 添加人员搜索框 */
.addPerSearch{
  width: 100%;
  padding-left: 70%;
  padding-right: 5px;
  box-sizing: border-box;
}
.look-team-bottom{
  width: 100%;
  height: auto;
  padding-top: 10px; 
  text-align: center;
}
</style>
