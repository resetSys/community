<template>
  <div class="carRecord">
    <title-bar>
      <span slot="title">出入记录</span>
      <span slot="control"></span>
    </title-bar>
    <search-bar>
      <span slot="control">
        <el-input class="searchForm" v-model="searchForm.license"
         placeholder="根据车牌搜索" clearable></el-input>
        <el-select v-model="searchForm.deviceId" filterable clearable
          class="searchForm" style="margin-right:10px" placeholder="请选择">
          <el-option
            v-for="item in devices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker
          class="searchForm"
          v-model="searchForm.start"
          type="datetime"
          value-format="timestamp"
          placeholder="选择日期时间">
        </el-date-picker>
        <el-date-picker
          class="searchForm"
          v-model="searchForm.end"
          type="datetime"
          value-format="timestamp"
          placeholder="选择日期时间">
        </el-date-picker>
        <el-button size="small" type="primary" @click="getRecordData">搜索</el-button>
      </span>
    </search-bar>
    <el-scrollbar class="scrollbar">
       <el-table
        :data="recordData"
        style="width: 100%"
        size="small"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="deviceName"
          align="center"
          show-overflow-tooltip
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="type"
          align="center"
          show-overflow-tooltip
          label="出入类型">
        </el-table-column>
        <el-table-column
          prop="license"
          align="center"
          show-overflow-tooltip
          label="车牌号">
        </el-table-column>
        <el-table-column
          prop="time"
          align="center"
          show-overflow-tooltip
          label="时间">
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页组件 -->
    <pagination :pageSize="pageSize" :allPage="allPage" :currIndex="currPage"
      @hanSiChange="hanSiChange" @hanCurrChange="hanCurrChange"></pagination>
  </div>
</template>

<script>
import titleBar from "components/common/titleBar/TitleBar";
import searchBar from "components/common/searchBar/SearchBar";
import pagination from "components/common/pagination/Pagination";
//工具方法
import { print,handleRequest } from "@/utils";
//网络请求
import { request } from "@/network/request";

export default {
  name: '',
  data() {
    return {
      recordData:[],
      //分页
      pageSize:10,
      allPage:0,
      currPage:1,
      //搜索
      searchForm:{
        deviceId:null,
        license:null,
        start:null,
        end:null
      },
      devices:[]
    }
  },
  components: {
    titleBar,
    searchBar,
    pagination
  },
  methods:{
    /*
      获取记录数据
    */
    getRecordData(){
      this.$store.commit('handleLoding');
      request({
        url:"/plateRecords/select",
        method:"post",
        data:{
          currentPage:this.currPage,
          pageSize:this.pageSize,
          id:this.searchForm.deviceId,
          license:this.searchForm.license,
          st_time:this.searchForm.start,
          end_time:this.searchForm.end
        }
      }).then((res) => {
        // print(res);
        this.recordData = [];
        let {list,allCount} = handleRequest.call(this,res.data);
        this.allPage = allCount;
        list.forEach(ele => {
          this.recordData.push({
            deviceName:ele.device_name,
            type:ele.typeStr,
            license:ele.license,
            time:ele.time
          });
        });
      }).catch((err) => {
        print(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
    //分页请求
    hanSiChange(val){//分页条数改变
      this.pageSize = val;
      this.getRecordData.call(this);
    },
    hanCurrChange(val){//当前页改变
      this.currPage = val;
      this.getRecordData.call(this);
    },

    /*
      搜索数据
    */
    getDeviceData(){//获取设备数据
      this.$store.commit('handleLoding');
      request({
        url:"/plateRecords/selectDeviceSimp",
        method:"post",
      }).then((res) => {
        this.devices = [];
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          respond.forEach(ele => {
            this.devices.push({
              value:ele.id,
              label:ele.device_name
            })
          });
        }
       
      }).catch((err) => {
        print(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    }
  },
  mounted(){
    this.getRecordData.call(this);
    this.getDeviceData.call(this);
  }
}
</script>

<style scoped>
.carRecord{
  width: 100%;
  height: 100%;
}
.scrollbar{
  width: 100%;
  height: calc(100% - 150px);
}
/* 条件搜索表单 */
.searchForm{
  width: 200px;
}
</style>
