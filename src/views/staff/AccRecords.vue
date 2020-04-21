<template>
  <div class="acc-records">
    <title-bar>
      <span slot="title">员工出入记录</span>
      <span slot="control">
        <!-- <el-button type="primary" size="small" @click="handleAdd">新增</el-button> -->
      </span>
    </title-bar>
    <search-bar>
      <span slot="control">
        <el-input v-model="searchForm.id"
          style="width:200px;"
          clearable
          placeholder="输入工号进行查询">
        </el-input>
        <el-select v-model="searchForm.deviceId" 
          placeholder="请选择设备"
          clearable
          style="width:200px;margin-right:10px;">
          <el-option
            v-for="item in devices"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            <!-- <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
          </el-option>
        </el-select>
        <el-date-picker
          v-model="searchForm.beginTime"
          style="width:200px"
          type="datetime"
          value-format="timestamp"
          placeholder="选择开始时间">
        </el-date-picker>
        <el-date-picker
          v-model="searchForm.endTime"
          style="width:200px"
          type="datetime"
          value-format="timestamp"
          placeholder="选择结束时间">
        </el-date-picker>
        <el-button type="primary" @click="search">搜索</el-button>
      </span>
    </search-bar>
    <el-scrollbar class="scrollbar">
      <el-table
        :data="records"
        style="width: 100%"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="id"
          align="center"
          label="工号">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="deviceName"
          align="center"
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="sex"
          align="center"
          label="性别">
        </el-table-column>
        <el-table-column
          prop="tel"
          align="center"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="time"
          align="center"
          label="日期"
          :formatter="changeTime">
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页组件 -->
    <pagination :pageSize="pageSize" :allPage="allPage" :currIndex="currPage"
      @hanSiChange="hanSiChange" @hanCurrChange="hanCurrChange"></pagination>
  </div>
</template>

<script>
//组件
import titleBar from "components/common/titleBar/TitleBar"
import searchBar from "components/common/searchBar/SearchBar"
import pagination from "components/common/pagination/Pagination"
//网络请求
import { request } from "@/network/request";
//工具
import { formatTime,handleRequest,print } from "@/utils"
export default {
  name: 'acc-records',
  data() {
    return {
      //表格数据
      records:[],
      //分页
      pageSize:30,
      allPage:0,
      currPage:1,
      //搜索
      searchForm:{
        id:'',
        diviceId:null,
        beginTime:null,
        endTime:null
      },
      //设备选择
      devices:[]
    }
  },
  components: {
    titleBar,
    searchBar,
    pagination

  },
  methods:{
    //获取数据
    getRecords(){
      this.$store.commit('handleLoding')
      request({
        url:"/staffRecords/select",
        method:"post",
        data:{
          currentPage:this.currPage,
          pageSize:this.pageSize,
          job_number:this.searchForm.id,
          device_id:this.searchForm.deviceId,
          st_time:this.searchForm.beginTime,
          end_time:this.searchForm.endTime
        }
      }).then((res) => {
        // print(res);
        let { list,allCount } = handleRequest.call(this,res.data);
        this.allPage = allCount;
        this.records = [];
        if (list !== false) {
          list.forEach(ele => {
            this.records.push({
              id:ele.job_number,
              name:ele.staff_name,
              deviceName:ele.device_name,
              sex:ele.sex,
              tel:ele.tel,
              time:ele.record_time
            });
          });
        }
      }).catch((err) => {
        print(err);
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },

    //分页请求
    hanSiChange(val){//分页条数改变
      // window.console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getRecords.call(this)
    },
    hanCurrChange(val){//当前页改变
      // window.console.log(`当前页: ${val}`);
      this.currPage = val
      this.getRecords.call(this)
    },

    //搜索功能
    search(){
      // window.console.log(this.searchForm)
      this.currPage = 1;
      this.getRecords.call(this);
    },
    getBranchs(){//获取设备
      this.$store.commit('handleLoding');
      request({
        url:"/staffRecords/selectFaceDevice",
        method:"post",
      }).then((res) => {
        // print(res);
        this.devices = [];
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          respond.forEach(ele => {
            this.devices.push({
              id:ele.device_id,
              name:ele.device_name
            });
          });
        }
      }).catch((err) => {
        print(err);
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },

    //表格数据处理
    changeTime(row){
      // window.console.log(row)
      return formatTime(row.time,'Y年M月D日 h:m:s')
    },
  },
  mounted(){
    this.getRecords.call(this)
    this.getBranchs.call(this)
  }
}
</script>

<style scoped>
.acc-records{
  width: 100%;
  height: 100%;
}
.scrollbar{
  height: calc(100% - 150px);
}
</style>
