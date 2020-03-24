<template>
  <div class="single">
    <title-bar>
      <span slot="title">考勤报表</span>
      <span slot="control">
        <!-- <el-button type="primary" size="small">新增</el-button> -->
      </span>
    </title-bar>
    <search-bar>
      <span slot="control">
        <el-input v-model="searchForm.id"
          style="width:200px;"
          clearable
          placeholder="输入工号进行查询">
        </el-input>
        <el-input v-model="searchForm.name"
          style="width:200px;"
          clearable
          placeholder="输入姓名进行查询">
        </el-input>
        <el-cascader
          v-model="searchForm.branchId"
          style="margin-right:10px"
          :options="branchs"
          placeholder="选择部门查询"
          clearable
          :props="{
            value:'branch_id',
            label:'branch_name',
            checkStrictly: true
          }">
        </el-cascader>
        <el-input v-model="searchForm.tel"
          style="width:200px;"
          clearable
          placeholder="输入手机号进行查询">
        </el-input>
        <el-button type="primary" @click="search">搜索</el-button>
      </span>
    </search-bar>
    <el-scrollbar class="scrollbar">
       <el-table
        :data="perData"
        style="width: 100%"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="id"
          align="center"
          show-overflow-tooltip
          width="100"
          label="工号">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          show-overflow-tooltip
          width="100"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="sex"
          align="center"
          show-overflow-tooltip
          width="100"
          label="性别">
        </el-table-column>
        <el-table-column
          prop="tel"
          align="center"
          show-overflow-tooltip
          label="电话">
        </el-table-column>
        <el-table-column
          prop="branchName"
          align="center"
          show-overflow-tooltip
          label="部门名称">
        </el-table-column>
        <el-table-column
          prop="group"
          align="center"
          show-overflow-tooltip
          label="考勤组">
        </el-table-column>

        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button style="color:var(--brand-color);" type="text" @click="handelGroup(scope.row)">关联考勤组</el-button>
            <!-- <el-link 
              :href="'http://192.168.1.215:8080/wisdom_factorys/cowaReportForms/down?personnel_id='+scope.row.id"
              target="_self" type="primary" icon="el-icon-download">下载日报表</el-link> -->
            <el-button style="color:var(--brand-color);" type="text" 
              @click="handleViewDatily(scope.row)" v-show="scope.row.groupId">查看报表</el-button>
            <!-- <el-button style="color:var(--brand-color);" type="text">周期报表</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页组件 -->
    <pagination :pageSize="pageSize" :allPage="allPage" :currIndex="currPage"
      @hanSiChange="hanSiChange" @hanCurrChange="hanCurrChange"></pagination>
    <!-- 关联考勤组 -->
    <el-dialog custom-class="limit-dialog" 
      :visible.sync="groupDialog" 
      width="30%" :top="$store.state.dialogTop"
      :show-close="false"
      title="关联考勤组"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">

        <el-checkbox-group v-model="isSelectGroup" :max="1">
          <el-checkbox v-for="(item,index) in groups" :label="item.value"
          :key="index">{{item.label}}</el-checkbox>
        </el-checkbox-group>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitGroup">提交</el-button>
        <el-button @click="groupDialog= false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 查看日报表 -->
    <el-dialog custom-class="limit-dialog" 
      :visible.sync="vWRDialog" 
      width="90%" top="50vh"
      :show-close="false"
      title="考勤日报"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-container style="height:70vh">
        <el-aside width="100px" style="overflow:hidden;">
          <ul class="control">
            <li v-for="(item,index) in dailyData.metre" :key="index+'t'">
              <el-button type="text" @click="choseForm(index)">{{item}}</el-button>
            </li>
          </ul>
        </el-aside>
        <el-main style="padding:0">
          <el-scrollbar style="height:100%;">
            <table border="1" cellpadding="10px" cellspacing="10px" bgcolor="#fff"
              align="center" style="border-collapse:collapse;">
              <!-- <caption>人物报表</caption> -->
              <!-- <tr>
                <th v-for="(item,index) in dailyData.metre" :key="index+'a'">{{item}}</th>
              </tr> -->
              <tr v-for="(group,index) in dailyData.data[formIndex]" :key="index+'b'">
                <td v-for="(item,index) in group" :key="index+'c'">{{item}}</td>
              </tr>
            </table>
          </el-scrollbar>
        </el-main>
      </el-container>
      <span slot="footer">
        <el-button type="primary" @click="download">一键导出</el-button>
        <el-button @click="vWRDialog = false">关闭</el-button>
      </span>
      
    </el-dialog>
  </div>
</template>

<script>
//组件
import titleBar from "components/common/titleBar/TitleBar"
import searchBar from "components/common/searchBar/SearchBar"
import pagination from "components/common/pagination/Pagination"

//网络
import { request } from "@/network/request"

export default {
  name: 'single',
  data() {
    return {
      perData:[],
      //分页
      pageSize:30,
      allPage:0,
      currPage:1,
      //搜索
      searchForm:{
        id:'',
        name:null,
        tel:null,
        branchId:[]
      },
      branchs:[],//部门
      //关联考勤组
      groupDialog:false,
      groups:[],//考勤组
      isSelectGroup:[],
      personId:null,
      //查看周报
      vWRDialog:false,
      dailyData:{
        data:[],
        metre:[]
      },
      formIndex:0,
      formsData:null,
      personInfo:null
    }
  },
  components: {
    titleBar,
    searchBar,
    pagination
  },
  methods:{
    getPersons(){//获取人员数据
      let branchId = this.searchForm.branchId.length== 0? null: this.searchForm.branchId[this.searchForm.branchId.length-1];
      this.$store.commit('handleLoding')
      request({
        url:"/cowaReportForms/selectLimit",
        method:"post",
        data:{
          currentPage:this.currPage,
          pageSize:this.pageSize,
          personnel_id:this.searchForm.id,
          name:this.searchForm.name,
          sex:this.searchForm.sex,
          tel:this.searchForm.tel,
          branch_id:branchId
        }
      }).then(res => {
        // window.console.log(res)
        //将数据循环放进数组中
        this.perData = []
        let {allCount,list} = res.data.respond
        list.forEach((val) => {
          this.perData.push({
            branchName:val.branch_name,
            name:val.name,
            id:val.personnel_id,
            sex:val.sex,
            group:val.cowa_group_name,
            groupId:val.cowa_group_id,
            tel:val.tel
          })
        });
        this.allPage = allCount
      }).catch(e => {
        window.console.log(e)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    search(){//搜索功能
      // window.console.log(this.searchForm)
      this.currPage = 1
      this.getPersons.call(this)
    },
    getBranchs(){//获取部门
      this.$store.commit('handleLoding')
      request({
        url:"/cowaReportForms/selectBranch",
        method:"post",
      }).then((res) => {
        // window.console.log(res)
        this.branchs = res.data.respond
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    getGroups(){//获取班组
      this.$store.commit('handleLoding')
      request({
        url:"/cowaReportForms/selectCowaGroup",
        method:"post",
      }).then((res) => {
        // window.console.log(res)
        // this.branchs = res.data.respond
        this.groups = []
        res.data.respond.forEach(ele => {
          this.groups.push({
            value:ele.cowa_group_id,
            label:ele.cowa_group_name
          })
        });
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },

    //分页
    hanSiChange(val){//分页条数改变
      // window.console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getPersons.call(this)
    },
    hanCurrChange(val){//当前页改变
      // window.console.log(`当前页: ${val}`);
      this.currPage = val
      this.getPersons.call(this)
    },

    //表格中操作
    download(){//导出报表
      this.$store.commit('handleLoding')
      request({
        url:"cowaReportForms/exportTable",
        method:"post",
        data:{
          personnel_id:this.personInfo.id,
          name:this.personInfo.name,
          data:this.formsData
        }
      }).then(res => {
        // window.console.log(res)
        window.location.href = res.data;
      }).catch(e => {
        window.console.log(e);
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },

    //分页操作
    handelGroup(row){//关联考勤组
      this.groupDialog = true
      // window.console.log(row.groupId)
      this.personId = row.id
      this.isSelectGroup = []
      if (row.groupId!== undefined) {
        this.isSelectGroup.push(row.groupId)
      }
    },
    submitGroup(){
      if (this.isSelectGroup.length!== 0) {
        this.$store.commit('handleLoding')
        request({
          url:"/cowaReportForms/setCowaGroup",
          method:"post",
          data:{
            personnel_id:this.personId,
            cowa_group_id:this.isSelectGroup[0],
          }
        }).then((res) => {
          // window.console.log(res)
          this.$message({
            message: res.data.respond,
            type: 'success'
          });
          this.groupDialog = false;
          this.getPersons.call(this)
        }).catch((err) => {
          window.console.log(err)
        }).finally(()=>{
          this.$store.commit('handleLoding')
        })
      } else {
        this.$message({
          message: '请选择绑定班组',
          type: 'warning'
        });
      }
    },

    //查看日报
    handleViewDatily(row){//点击查看日报按钮
      if (row.groupId == 0 || row.groupId == undefined || row.groupId == null) {
        this.$message({
          message: '该人员未绑定考勤组',
          type: 'warning'
        });
      } else {
        this.vWRDialog = true;
        this.personInfo = row;//将该人员信息储存
        this.getDaily.call(this,row.id)
      }
    },
    getDaily(id){//获取报表数据
      this.$store.commit('handleLoding')
      request({
        url:"cowaReportForms/selectForms",
        method:"post",
        data:{
          personnel_id:id
        }
      }).then(res => {
        // window.console.log(res)
        /*
          思路:
          将数据进行处理
          title和data分开
          注意顺序
        */
        this.formsData = res.data;
        this.dailyData.metre = [];
        this.dailyData.data = [];
        this.formIndex = 0;
        for (const key in res.data) {
          if (res.data.hasOwnProperty(key)) {
            this.dailyData.metre.push(key);
            this.dailyData.data.push(res.data[key]);
          }
        }
      }).catch(e => {
        window.console.log(e);
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    choseForm(index){
      this.formIndex = index
    }
  },
  mounted(){
    this.getPersons.call(this)
    this.getBranchs.call(this)
    this.getGroups.call(this)
  }
}
</script>

<style scoped>
.single{
  width: 100%;
  height: 100%;
  /* background-color: aqua; */
}
/* 滚动区域 */
.scrollbar{
  height: calc(100% - 150px);
}

/* 报表样式 */
/* 报表选择 */
.control>li{
  text-align: center;
}
table{
  margin: 0 auto;
}
tr>th,tr>td{
  padding: 2px 5px;
  text-align: center;
}
</style>
