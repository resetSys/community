<template>
  <div id="thread">
    <title-bar>
      <span slot="title">当前访程</span>
      <span slot="control">
      </span>
    </title-bar>
    <search-bar>
      <span slot="control">
        
      </span>
    </search-bar>
    <el-scrollbar class="scrollbar">
      <el-table
        :data="threadData"
        style="width: 100%"
        :row-style="tableRowStyle"
        empty-text="暂无数据">
        <el-table-column
          prop="name"
          align="center"
          label="姓名"
          width="80">
        </el-table-column>
        <el-table-column
          prop="sex"
          align="center"
          label="性别"
          width="50px">
        </el-table-column>
        <el-table-column
          prop="tel"
          align="center"
          show-overflow-tooltip
          label="联系方式">
        </el-table-column>
        <el-table-column
          prop="startTime"
          align="center"
          :formatter="changeTime"
          show-overflow-tooltip
          label="起始时间">
        </el-table-column>
        <el-table-column
          prop="endTime"
          align="center"
          :formatter="changeTime"
          show-overflow-tooltip
          label="截至时间">
        </el-table-column>
        <el-table-column
          prop="surplus"
          align="center"
          :formatter="formatSurplus"
          show-overflow-tooltip
          label="剩余时间">
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          show-overflow-tooltip
          label="访问状态">
        </el-table-column>
        <el-table-column
          prop="des"
          align="center"
          show-overflow-tooltip
          label="备注">
        </el-table-column>
        <el-table-column
          align="center"
          width="70px"
          label="照片">
          <template slot-scope="scope">
            <el-image :src="scope.row.picture"
              @click.native="previewPicture(scope.row.picture)"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button style="color:#F56C6C;" type="text"
              @click="deleteInfo(scope.row.id)">结束访程</el-button>
            <el-button style="color:#409EFF;" type="text"
              @click="editThread(scope.row.id)">修改时间</el-button>
            <el-button style="color:#409EFF;" type="text"
              @click="editLimit(scope.row.id)">修改权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页组件 -->
    <pagination :pageSize="pageSize" :allPage="allPage" :currIndex="currPage"
      @hanSiChange="hanSiChange" @hanCurrChange="hanCurrChange"></pagination>
    <!-- 查看原图 -->
    <el-dialog :visible.sync="prePicDialog" width="30%"
      custom-class="limit-dialog"
      title="显示原图" top="50vh"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <img :src="previewImg" alt="图片预览" class="preImg">
    </el-dialog>
    <!-- 修改访程表单 -->
    <el-dialog :visible.sync="eTDialog" width="30%"
      custom-class="limit-dialog"
      title="修改结束时间" top="50vh"
      :show-close="false"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-date-picker
        v-model="endTime"
        type="datetime"
        value-format="timestamp"
        placeholder="选择日期时间">
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelThread">取 消</el-button>
        <el-button type="primary" @click="submitThread">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改访客权限 -->
    <el-dialog :visible.sync="eLDialog" width="50%"
      custom-class="limit-dialog"
      title="修改访客权限" top="50vh"
      :show-close="false"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-scrollbar style="max-height:50vh">
        <el-table :data="bindDevice" 
          style="width:100%;">
          <el-table-column
           prop="id"
           align="center"
           label="设备标识">
          </el-table-column>
          <el-table-column
           prop="name"
           align="center"
           label="设备名称">
          </el-table-column>
          <el-table-column
           align="center"
           label="操作">
           <template slot-scope="scope">
            <el-button type="text" style="color:#F56C6C;" 
              @click="delBingDevice(scope.row.id)">删除</el-button>
           </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eLDialog=false">取 消</el-button>
        <el-button type="primary" @click="getDevices">新 增</el-button>
      </span>
    </el-dialog>
    <!-- 新增访客权限 -->
    <el-dialog :visible.sync="addLDialog" width="50%"
      custom-class="limit-dialog"
      title="修改访客权限" top="50vh"
      :show-close="false"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-scrollbar style="max-height:50vh">
        <el-table :data="devices"
          style="width:100%;"
          @selection-change="handleCheck"
          empty-text="暂无数据">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
           prop="id"
           align="center"
           label="设备标识">
          </el-table-column>
          <el-table-column
           prop="name"
           align="center"
           label="设备名称">
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addLDialog=false">取 消</el-button>
        <el-button type="primary" @click="subCheckDevice">提 交</el-button>
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
import { handleRequest,formatTime } from "@/utils";
export default {
  name: 'thread',
  data() {
    return {
      //分页
      //访程数据
      threadData:[],
      pageSize:10,
      allPage:0,
      currPage:1,

      //修改访程时间
      eTDialog:false,
      endTime:null,
      visitorId:null,

      /**修改访客权限 */
      eLDialog:false,
      bindDevice:[],//已绑定设备

      //新增权限
      addLDialog:false,
      devices:[],//未绑定设备数据
      checkedDevice:[],//选中的设备

      //图片预览
      prePicDialog:false,
      previewImg:'',

      timer:null
    }
  },
  components: {
    titleBar,
    searchBar,
    pagination
  },
  mounted(){
    this.getThreadData();
    this.timer = window.setInterval(() => {
      this.getThreadData();
    }, 30000);
  },
  beforeDestroy(){
    window.clearInterval(this.timer);
  },
  methods:{
    //获取访程数据
    getThreadData() {
      this.$store.commit('handleLoding');
      request({
        url:"/visitCurrent/select",
        method:"post",
        data:{
          currentPage:this.currPage,
          pageSize:this.pageSize,
        }
      }).then((res) => {
        let { allCount,list } = handleRequest.call(this,res.data);
        this.allPage= allCount;
        this.threadData = [];
        list.forEach(ele => {
          this.threadData.push({
            id:ele.visitor_id,
            endTime:ele.end_time,
            startTime:ele.st_time,
            picture:ele.face_img,
            name:ele.name,
            sex:ele.sex,
            tel:ele.tel,
            des:ele.why,
            surplus:ele.surplus,
            status:ele.status
          })
        });
      }).catch((err) => {
        window.console.log(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      })
    },
    //分页请求
    hanSiChange(val){//分页条数改变
      this.pageSize = val;
      this.getThreadData();
    },
    hanCurrChange(val){//当前页改变
      this.currPage = val;
      this.getThreadData();
    },

    //表格数据操作
    changeTime(row,column,cellValue){//格式化表格数据
      return formatTime(cellValue,'Y年M月D日 h:m:s');
    },
    previewPicture(picture){//图片预览
      this.previewImg = picture;
      this.prePicDialog = true;
    },
    /**将毫秒转化为小时分钟 */
    formatSurplus(row, column, cellValue){
      if (cellValue<0) {
        return '已超时';
      }
      //计算小时
      let hour = Math.floor(cellValue/3600000);
      //计算分钟 小时的余数
      let rem = cellValue-(hour*3600000);
      let munites = Math.floor(rem/60000);
      return hour+'时'+munites+'分';
    },
    /**时间剩余 */
    tableRowStyle({row}){
      if (row.surplus <= 600000 && row.surplus > 0) {
        return {background:'rgba(230,162,60,0.3)'};
      } else if(row.surplus <= 0){
        return {background:'rgba(245, 108, 108, 0.3)'};
      }
      return '';
    },

    //修改访程时效
    editThread(id){
      this.eTDialog = true;
      this.visitorId = id;
    },
    /**提交访程时效信息 */
    submitThread(){
      if (this.endTime == null) {
        this.$message({
          message: '时效不能为空',
          type: 'error'
        });
        return;
      }
      this.$store.commit('handleLoding');
      request({
        url:"/visitCurrent/update",
        method:"post",
        data:{
          visitor_id:this.visitorId,
          end_time:this.endTime,
        }
      }).then((res) => {
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          this.$message({
            message: respond,
            type: 'success'
          });
        }
        //重置
        this.cancelThread();
        //刷新数据
        this.getThreadData();
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
    /**取消时效提交 */
    cancelThread(){
      this.endTime=null;
      this.eTDialog = false;
    },

    //修改访程权限
    editLimit(id){
      this.eLDialog = true;
      this.visitorId = id;
      this.getBingDevice();
    },
    getBingDevice(){//获取已绑定设备
      this.$store.commit('handleLoding');
      request({
        url:"/visitCurrent/selectOnPower",
        method:"post",
        data:{
          visitor_id:this.visitorId,
        }
      }).then((res) => {
        this.bindDevice = [];
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          respond.forEach(ele => {
            this.bindDevice.push({
              id:ele.device_id,
              name:ele.device_name
            });
          });
        }
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
    delBingDevice(deviceId){//删除已绑定权限
      this.$confirm("确定删除该条权限吗。", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('handleLoding');
        request({
          url:"/visitCurrent/delPower",
          method:"post",
          data:{
            visitor_id:this.visitorId,
            deviceIds:[deviceId]
          }
        }).then((res) => {
          let respond = handleRequest.call(this,res.data);
          if (respond !== false) {
            this.$message({
              message: respond,
              type: 'success'
            });
          }
          //重新获取已绑定的设备
          this.getBingDevice();
        }).catch((err) => {
          window.console.log(err)
        }).finally(()=>{
          this.$store.commit('handleLoding');
        });
      }).catch(() => {
      
      });
    },
    getDevices(){//获取未绑定设备
      this.addLDialog = true;
      this.$store.commit('handleLoding');
      request({
        url:"/visitCurrent/selectUnPower",
        method:"post",
        data:{
          visitor_id:this.visitorId,
        }
      }).then((res) => {
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
        window.console.log(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
    handleCheck(val){//选中设备监听回调
      this.checkedDevice = [];
      val.forEach(ele => {
        this.checkedDevice.push(ele.id);
      });
    },
    subCheckDevice(){//提交选中的设备
      this.$store.commit('handleLoding');
      request({
        url:"/visitCurrent/addPower",
        method:"post",
        data:{
          visitor_id:this.visitorId,
          deviceIds:this.checkedDevice
        }
      }).then((res) => {
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          this.$message({
            message: respond,
            type: 'success'
          });
        }
        //关闭当前dialog
        this.addLDialog = false;
        //刷新已绑定数据
        this.getBingDevice();
      }).catch((err) => {
        window.console.log(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },

    deleteInfo(id){//结束访程
      this.$confirm("确定删除该条访程吗?该人员将失去访问权限。", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        /*
          发送请求
          刷新人员数据
        */
        this.$store.commit('handleLoding');
        request({
          url:"/visitCurrent/delete",
          method:"post",
          data:{
            visitor_id:id
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
          this.getThreadData();
        }).catch(err =>{
          window.console.log(err);
        }).finally(()=>{
          this.$store.commit('handleLoding');
        })
      }).catch(() => {
      
      });
    },
  }
}
</script>

<style scoped>
#thread{
  width: 100%;
  height: 100%;
}
/* 滚动区域 */
.scrollbar{
  height: calc(100% - 150px);
}
/* 表单input宽度 */
.el-input{
  width: 100%;
  margin-left: 0;
}
.el-select,.el-cascader{
  width: 100%;
}
.el-select>>>.el-input{
  margin-left: 0;
}
.preImg{
  width: 100%;
  height: auto;
}


</style>
