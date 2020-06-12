<template>
  <div id="visitConfig">
    <title-bar>
      <span slot="title">访客配置</span>
      <span slot="control">
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
        empty-text="暂无数据">
        <el-table-column
          prop="name"
          align="center"
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="location"
          align="center"
          show-overflow-tooltip
          label="设备位置">
        </el-table-column>
        <el-table-column
          prop="des"
          align="center"
          show-overflow-tooltip
          label="设备描述">
        </el-table-column>
        <el-table-column
          prop="type"
          align="center"
          :formatter="formateType"
          label="进出类型">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button style="color:#409EFF;" type="text"
              @click="handleSetting(scope.row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页组件 -->
    <pagination :pageSize="pageSize" :allPage="allPage" :currIndex="currPage"
      @hanSiChange="hanSiChange" @hanCurrChange="hanCurrChange"></pagination>
    <!-- 设置进或出类型 -->
    <el-dialog :visible.sync="setDialog" width="30%"
      custom-class="limit-dialog"
      title="设置进出类型" top="50vh"
      :show-close="false"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-radio-group class="radio-type" v-model="deviceType">
        <el-radio :label="1">进</el-radio>
        <el-radio :label="0">不设置</el-radio>
        <el-radio :label="2">出</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialog=false">取 消</el-button>
        <el-button type="primary" @click="submitSetting">保 存</el-button>
      </span>
    </el-dialog>
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
import { handleRequest } from "@/utils";
export default {
  name: 'visitConfig',
  data() {
    return {
      //分页
      //访程数据
      deviceData:[
        {
          id:1,
          name:'一号',
          type:'进'
        },{
          id:1,
          name:'二号',
          type:'出'
        }
      ],
      pageSize:10,
      allPage:0,
      currPage:1,

      //设置进出类型
      setDialog:false,
      deviceType:null,//保存单选框val
      deviceId:null,//保存选择设备id
    }
  },
  components: {
    titleBar,
    searchBar,
    pagination
  },
  mounted(){
    this.getDeviceData();
  },
  methods:{
    //获取访程数据
    getDeviceData() {
      this.$store.commit('handleLoding');
      request({
        url:"/visitorConfig/select",
        method:"post",
        data:{
          currentPage:this.currPage,
          pageSize:this.pageSize,
        }
      }).then((res) => {
        let { allCount,list } = handleRequest.call(this,res.data);
        this.allPage = allCount;
        this.deviceData = [];
        list.forEach(ele => {
          this.deviceData.push({
            id:ele.device_id,
            name:ele.device_name,
            location:ele.location,
            des:ele.remarks,
            type:ele.type
          });
        });
      //  window.console.log(res);
      }).catch((err) => {
        window.console.log(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
    //分页请求
    hanSiChange(val){//分页条数改变
      this.pageSize = val;
      this.getDeviceData();
    },
    hanCurrChange(val){//当前页改变
      this.currPage = val;
      this.getDeviceData();
    },

    //设置权限
    handleSetting(row){
      this.setDialog = true;
      this.deviceType = row.type;
      this.deviceId = row.id;
    },
    formateType(row,column,cell){
      switch (cell) {
        case 1:
          return '进';
        case 2:
          return '出';
        default:
          return '未设置';
      }
    },
    submitSetting(){
      this.$store.commit('handleLoding');
      request({
        url:"/visitorConfig/setType",
        method:"post",
        data:{
          device_id:this.deviceId,
          type:this.deviceType
        }
      }).then((res) => {
      //  window.console.log(res);
        let respond = handleRequest.call(this,res.data);
        if (respond !=false) {
          this.$message({
            message: respond,
            type: 'success'
          });
          this.getDeviceData();
          this.setDialog = false;
        }

      }).catch((err) => {
        window.console.log(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
  }
}
</script>

<style scoped>
#visitConfig{
  width: 100%;
  height: 100%;
}
/* 滚动区域 */
.scrollbar{
  height: calc(100% - 150px);
}

</style>
