<template>
  <div class="visitRecord">
    <title-bar>
      <span slot="title">访客记录</span>
      <span slot="control">
      </span>
    </title-bar>
    <search-bar>
      <span slot="control">
        <el-input v-model="search.name" style="width:200px;" 
          placeholder="根据访客姓名搜索" clearable></el-input>

        <el-select v-model="search.deviceId" style="margin-right:10px"
          placeholder="根据不同设备检索" clearable>
          <el-option
            v-for="(item,index) in devices"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>

        <el-date-picker
          v-model="search.startTime"
          type="datetime"
          value-format="timestamp"
          clearable
          placeholder="选择起始时间">
        </el-date-picker>

        <el-date-picker
          v-model="search.endTime"
          type="datetime"
          value-format="timestamp"
          clearable
          placeholder="选择结束时间">
        </el-date-picker>

        <el-button type="primary" @click="getRecordData">搜索</el-button>
      </span>
    </search-bar>
    <el-scrollbar class="scrollbar">
      <el-table
        :data="records"
        style="width: 100%"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="name"
          align="center"
          label="访客姓名">
        </el-table-column>
        <el-table-column
          prop="deviceName"
          align="center"
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="tel"
          align="center"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="time"
          align="center"
          :formatter="changeTime"
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
//组件
import titleBar from "components/common/titleBar/TitleBar";
import searchBar from "components/common/searchBar/SearchBar";
import pagination from "components/common/pagination/Pagination";

//网络请求
import { request } from "@/network/request";
//工具
import { handleRequest,formatTime } from "@/utils";
export default {
  name: 'visitRecord',
  data() {
    return {
      /**表格数据 */
      records:[],

      /**表格数据检索条件 */
      pageSize:30,
      allPage:0,
      currPage:1,
      search:{
        deviceId:null,
        startTime:null,
        endTime:null,
        name:null
      },
      devices:[],//设备数据
    }
  },
  components: {
    titleBar,
    searchBar,
    pagination
  },
  mounted(){
    this.getRecordData();
    this.getDevceData();
  },
  methods:{
    getRecordData(){
      this.$store.commit('handleLoding');
      request({
        url:"/visitorRecords/select",
        method:"post",
        data:{
          currentPage:this.currPage,
          pageSize:this.pageSize,
          device_id:this.search.deviceId,
          end_time:this.search.endTime,
          st_time:this.search.startTime,
          name:this.search.name
        }
      }).then((res) => {
        this.records = [];
        let { allCount,list } = handleRequest.call(this,res.data);
        this.allPage= allCount;
        list.forEach(ele => {
          this.records.push({
            name:ele.name,
            deviceName:ele.device_name,
            sex:ele.sex,
            tel:ele.tel,
            time:ele.time
          });
        });
      }).catch((err) => {
        window.console.log(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
    //分页请求
    hanSiChange(val){//分页条数改变
      this.pageSize = val;
      this.getRecordData();
    },
    hanCurrChange(val){//当前页改变
      this.currPage = val;
      this.getRecordData();
    },

    //获取设备数据
    getDevceData(){
      this.$store.commit('handleLoding');
      request({
        url:"visitorRecords/selectSimpDevice",
        method:"post",
      }).then((res) => {
        this.devices = [];
        let respond = handleRequest.call(this,res.data);
        respond.forEach(ele => {
          this.devices.push({
            id:ele.device_id,
            name:ele.device_name
          });
        });
      }).catch((err) => {
        window.console.log(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },

    //表格数据转化
    changeTime(row, column, cellValue){
      return formatTime(cellValue,'Y年M月D日 h:m:s');
    },
  }
}
</script>

<style scoped>
.visitRecord{
  width: 100%;
  height: 100%;
}
/* 滚动区域 */
.scrollbar{
  height: calc(100% - 150px);
}
</style>
