<template>
  <div id="thread">
    <title-bar>
      <span slot="title">当前访程</span>
      <span slot="control">
        <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
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
        stripe
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
          <template>
            <el-button style="color:#F56C6C;" type="text"
              @click="deleteInfo">删除</el-button>
            <el-button style="color:#409EFF;" type="text"
              @click="editThread">编辑</el-button>
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
    <!-- 创建访程表单 -->
    <el-dialog :visible.sync="eTDialog" width="30%"
      custom-class="limit-dialog"
      title="创建访程" top="50vh"
      :show-close="false"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-form style="width:90%" :rules="threadFormRule" :model="threadForm" ref="threadForm"
        label-width="7vw" label-position="right">
        <el-form-item label="起始时间" prop="startTime">
          <el-date-picker
            v-model="threadForm.startTime"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="threadForm.endTime"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="des">
          <el-input v-model="threadForm.des"></el-input>
        </el-form-item>
        <el-form-item label="授权设备" prop="deviceIds">
          <el-checkbox-group v-model="threadForm.deviceIds">
            <el-checkbox v-for="(item,index) in devices" :key="index"
              :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelThread">取 消</el-button>
        <el-button type="primary" @click="submitThread">确 定</el-button>
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
      pageSize:10,
      allPage:0,
      currPage:1,
      //修改访程
      eTDialog:false,
      devices:[],
      threadForm:{/*访程表单*/
        id:null,
        startTime:null,
        endTime:null,
        des:'',
        deviceIds:[]
      },
      threadFormRule:{
        startTime:[
          {required: true, message: '请选择开始时间', trigger: 'change'},
        ],
        endTime:[
          {required: true, message: '请选择结束时间', trigger: 'change'},
        ],
        des:[
          {validator:(rule,val,callback)=> {
            if (val.length > 50) {
              callback(new Error('不能超过50个字符'));
            } else {
              callback();
            }
          },trigger:'change'}
        ],
        deviceIds:[]
      },
      //访程数据
      threadData:[],
      //图片预览
      prePicDialog:false,
      previewImg:'',
    }
  },
  components: {
    titleBar,
    searchBar,
    pagination
  },
  mounted(){
    this.getThreadData();
  },
  methods:{
    // 新增账户
    handleAdd(){
      this.addDrawer = true
    },
    close(formName,dialog){//关闭注册抽屉
      /*
        首先清空表单，然后关闭drawer
      */
      // this.$refs[formName].resetFields()
      for (let key in this[formName]) {
        this[formName][key] = null;
      }
      this[dialog] = false;
    },
    submit(){//提交访程
    
    },
    deleteInfo(){//删除访程
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
          url:"/staff/delete",
          method:"post",
        }).then((res) =>{
          let respond = handleRequest.call(this,res.data);
          if (respond !== false) {
            this.$message({
              message: respond,
              type: 'success'
            });
          }
          //刷新数据
        }).catch(err =>{
          window.console.log(err)
        }).finally(()=>{
          this.$store.commit('handleLoding')
        })
      }).catch(() => {
      
      });
    },
    edit(row,formName,dialog){//编辑表格信息
      /*
        将表格中的信息循环赋值到表单中
      */
      for (const key in this[formName]) {
        if (this[formName].hasOwnProperty(key)) {
          this[formName][key] = row[key];
        }
      }
      this[dialog] = true;
    },

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
        window.console.log(res);
        let { allCount,list } = handleRequest.call(this,res.data);
        this.allPage= allCount;
        this.threadData = [];
        list.forEach(ele => {
          this.threadData.push({
            endTime:ele.end_time,
            startTime:ele.st_time,
            picture:ele.face_img,
            name:ele.name,
            sex:ele.sex,
            tel:ele.tel,
            des:ele.why
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
    //修改访程
    editThread(id){
      this.eTDialog = true;
      this.threadForm.id = id;
    },
    /**提交访程信息 */
    submitThread(){
      this.$refs['threadForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('handleLoding');
          request({
            url:"/visitCurrent/insert",
            method:"post",
            data:{
              visitor_id:this.threadForm.id,
              st_time:this.threadForm.startTime,
              end_time:this.threadForm.endTime,
              why:this.threadForm.des,
              deviceIds:this.threadForm.deviceIds
            }
          }).then((res) => {
            let respond = handleRequest.call(this,res.data);
            if (respond !== false) {
              this.$message({
                message: respond,
                type: 'success'
              });
            }
            this.cancelThread();
          }).catch((err) => {
            window.console.log(err)
          }).finally(()=>{
            this.$store.commit('handleLoding');
          });
        }
      });
    },
    /**取消提交 */
    cancelThread(){
      this.threadForm.id=null;
      this.threadForm.startTime=null;
      this.threadForm.endTime=null;
      this.threadForm.des='';
      this.threadForm.deviceIds=[];
      this.$refs['threadForm'].resetFields();
      this.eTDialog = false;
    }
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
