<template>
  <div class="car-man">
    <title-bar>
      <span slot="title">员工车辆管理</span>
      <span slot="control">
        <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
      </span>
    </title-bar>
    <search-bar>
      <span slot="control">
        <el-input style="width:200px;" v-model="searchForm.num"
          placeholder="根据车牌搜索" clearable></el-input>
        <el-input style="width:200px;" v-model="searchForm.name"
         placeholder="根据车主姓名搜索" clearable></el-input>
        <el-input style="width:200px;" v-model="searchForm.tel"
         placeholder="根据联系方式搜索" clearable></el-input>
        <el-button size="small" type="primary" @click="getCarData">搜索</el-button>
      </span>
    </search-bar>
    <el-scrollbar class="scrollbar">
       <el-table
        :data="carData"
        style="width: 100%"
        size="small"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="num"
          align="center"
          show-overflow-tooltip
          label="车牌号码">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          show-overflow-tooltip
          label="使用者姓名">
        </el-table-column>
        <el-table-column
          prop="tel"
          align="center"
          show-overflow-tooltip
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="remarks"
          align="center"
          show-overflow-tooltip
          label="备注信息">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope"> 
            <el-button style="color:#409EFF;" type="text" @click="handleLimit(scope.row)">权限</el-button>
            <el-button style="color:#409EFF;" type="text" @click="editMsg(scope.row)">编辑</el-button>
            <el-button style="color:#F56C6C;" type="text" @click="delMsg(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页组件 -->
    <pagination :pageSize="pageSize" :allPage="allPage" :currIndex="currPage"
      @hanSiChange="hanSiChange" @hanCurrChange="hanCurrChange"></pagination>
    <!-- 新增功能 -->
    <el-drawer :visible.sync="addDrawer" 
      :with-header="false"
      :wrapper-closable="false"
      :close-on-press-escape="false">
      <div class="drawer-title">
        新增车牌识别设备
      </div>
      <el-scrollbar style="height:calc(100vh - 100px);">
        <div class="drawer-con">
          <el-form :model="addForm" :rules="addFormRule" ref="addForm" 
            label-width="7vw" label-position="right">
            <el-form-item label="车牌号码" prop="num">
              <el-input v-model="addForm.num" :disabled="submitType == 2"></el-input>
            </el-form-item>
            <el-form-item label="车主" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="tel">
              <el-input v-model="addForm.tel"></el-input>
            </el-form-item>
            <el-form-item label="备注信息">
              <el-input v-model="addForm.remarks"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <div class="drawer-bottom">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="close('addForm','addDrawer')">取消</el-button>
      </div>
    </el-drawer>
    <!-- 权限管理 -->
    <el-dialog :visible.sync="limitDialog" width="70%"
      title="授权管理" custom-class="limit-dialog"
      :top="$store.state.dialogTop"
      style="overflow:hidden"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-scrollbar style="height:40vh;">
        <el-table :data="limited" style="width:100%;" stripe
          @selection-change="handleReSelChange">
          <el-table-column
            type="selection"
            align="center"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name" 
            label="名称" 
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="type" 
            label="类型" 
            show-overflow-tooltip
            align="center">
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <div style="text-align:center;">
        <el-button type="danger" v-if="reBindIds.length !== 0"
          @click="handleLimits('/platePower/delete','limitDialog','reBindIds')">删除</el-button>
        <el-button type="primary" @click="handleAddLimit">添加</el-button>
      </div>
    </el-dialog>
    <!-- 添加权限 -->
    <el-dialog custom-class="limit-dialog" 
      :visible.sync="setLimitDialog" 
      width="70%" :top="$store.state.dialogTop"
      :show-close="false"
      title="添加权限"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-scrollbar style="height:40vh;">
        <el-table :data="limits" style="width:100%;" stripe
          @selection-change="handleBiSelChange">
          <el-table-column
            type="selection"
            align="center"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name" 
            label="名称" 
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="type" 
            label="类型" 
            show-overflow-tooltip
            align="center">
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <div style="text-align:center;">
        <el-button type="primary" v-if="bindIds.length != 0"
          @click="handleLimits('/platePower/insert','setLimitDialog','bindIds')">提交</el-button>
        <el-button @click="cancleLimits('setLimitDialog')">取消</el-button>
      </div>
    </el-dialog>
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
//混入
import { mixin } from "@/mixins";
export default {
  name: '',
  mixins:[mixin],
  data() {
    return {
      carData:[],
      //分页
      pageSize:10,
      allPage:0,
      currPage:1,
      submitType:1,
      //新增表单
      addDrawer:false,
      addForm:{
        id:null,
        num:null,
        name:null,
        tel:null,
        remarks:null,
        isFull:null
      },
      addFormRule:{
        num:[
          {required: true, message: '请输入车牌号', trigger: 'blur'},
          {validator:(rule,val,callback)=> {
            if (val != null) {
              if (val.length > 8) {
                callback(new Error('长度不能超过8位'));
              } else {
                callback();
              }
            }
          },trigger:'blur'}
        ],
        name:[
          {required: true, message: '请输入车主姓名', trigger: 'blur'},
          {validator:(rule,val,callback)=> {
            if (val != null) {
              if (val.length > 10) {
                callback(new Error('长度不能超过10位'));
              } else {
                callback();
              }
            }
          },trigger:'blur'}
        ],
        tel:[
          {validator:(rule,val,callback)=> {
            if (val != null) {
              if (val.length > 15) {
                callback(new Error('长度不能超过15位'));
              } else {
                callback();
              }
            }
          },trigger:'blur'}
        ],
      },
      //搜索表单
      searchForm:{
        num:null,
        name:null,
        tel:null
      },
      //权限设置
      limitDialog:false,
      setLimitDialog:false,
      limited:[],//存放已授权设备
      limits:[],//存放未授权设备
      license:null,//存放要提交的车牌
      bindIds:[],
      reBindIds:[]
    }
  },
  components: {
    titleBar,
    searchBar,
    pagination
  },
  methods:{
    //获取车牌数据
    getCarData(){
      this.$store.commit('handleLoding');
      request({
        url:"/plate/select",
        method:"post",
        data:{
          currentPage:this.currPage,
          pageSize:this.pageSize,
          license:this.searchForm.num,
          use_name:this.searchForm.name,
          tel:this.searchForm.tel
        }
      }).then((res) => {
        // print(res);
        this.carData = [];
        let {list,allCount} = handleRequest.call(this,res.data);
        this.allPage = allCount;
        list.forEach(ele => {
          this.carData.push({
            num:ele.license,
            name:ele.use_name,
            tel:ele.tel,
            remarks:ele.remarks
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
      this.getCarData.call(this);
    },
    hanCurrChange(val){//当前页改变
      this.currPage = val;
      this.getCarData.call(this);
    },

    /*
      表单操作
    */
    
    handleAdd(){//点击新增按钮
      this.addDrawer = true;
      this.submitType = 1;
    },
    submit(){//新增车牌识别设备
      // 提交成功后应该关闭drawer，表单会自动清除
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('handleLoding');
          if (this.submitType === 1) {
            //执行注册
            request({
                url:"/plate/insert",
                method:"post",
                data:{
                  license:this.addForm.num,
                  use_name:this.addForm.name,
                  remarks:this.addForm.remarks,
                  tel:this.addForm.tel
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
              this.getCarData.call(this);
              this.close.call(this,'addForm','addDrawer');
            }).catch(err =>{
              print(err);
            }).finally(()=>{
              this.$store.commit('handleLoding');
            });
          } else if(this.submitType === 2){
            //执行修改
            request({
                url:"/plate/update",
                method:"post",
                data:{  
                  license:this.addForm.num,
                  use_name:this.addForm.name,
                  remarks:this.addForm.remarks,
                  tel:this.addForm.tel
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
              this.getCarData.call(this);
              this.closeDrawer.call(this,'addForm','addDrawer');
            }).catch(err =>{
              print(err);
            }).finally(()=>{
              this.$store.commit('handleLoding');
            })
          }
        } else {
          return false;
        }
      });
    },

    /*
      表格操作
    */
    editMsg(row){//修改设备信息
      /*
        将值赋值给注册表单
        将drawer打开
      */
      this.submitType = 2;
      for (const key in this.addForm) {
        if (this.addForm.hasOwnProperty(key)) {
          this.addForm[key] = row[key]
        }
      }
      this.addDrawer = true;
    },
    delMsg(row){//删除车牌
      // print(row);
      this.$confirm('确定删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('handleLoding');
        request({
          url:"/plate/delete",
          method:"post",
          data:{
            license:row.num
          }
        }).then((res) => {
          let respond = handleRequest.call(this,res.data);
          if (respond !== false) {
            this.$message({
              message: respond,
              type: 'success'
            });
          }
          this.getCarData.call(this);
        }).catch((err) => {
          print(err);        
        }).finally(()=>{
          this.$store.commit('handleLoding');
        });
      }).catch(() => {
        
      });
    },
    handleLimit(row){//点击权限按钮
      this.reBindIds = [];
      this.limitDialog = true;
      this.license = row.num;
      this.getLimitedData.call(this,row);
    },

    /*
      权限操作
    */
    getLimitedData(row){//获取已绑定的权限
      this.$store.commit('handleLoding');
      request({
        url:"/platePower/selectOnBind",
        method:"post",
        data:{
          license:row.num,
        }
      }).then((res) => {
        this.limited = [];
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          respond.forEach(ele => {
            this.limited.push({
              name:ele.device_name,
              id:ele.id,
              type:ele.typeStr
            });
          });
        }
      }).catch((err) => {
        print(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
    handleAddLimit(){//点击添加按钮
      this.bindIds = [];
      this.setLimitDialog = true;
      this.$store.commit('handleLoding');
      request({
        url:"/platePower/selectUnBind",
        method:"post",
        data:{
          license:this.license,
        }
      }).then((res) => {
        // print(res);
        this.limits = [];
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          respond.forEach(ele => {
            this.limits.push({
              name:ele.device_name,
              id:ele.id,
              type:ele.typeStr
            });
          });
        }
      }).catch((err) => {
        print(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
    handleReSelChange(val){//已绑定设备表格
      this.reBindIds = [];
      val.forEach(ele => {
        this.reBindIds.push(ele.id)
      });
    },
    handleBiSelChange(val){//未绑定设备表格
      this.bindIds = [];
      val.forEach(ele => {
        this.bindIds.push(ele.id)
      });
    },
    handleLimits(url,dialog,deviceArr){//添加和删除权限
      this.$store.commit('handleLoding');
      request({
        url:url,
        method:"post",
        data:{
          id:this.license,
          power:this[deviceArr]
        }
      }).then((res) => {
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          this.$message({
            message: respond,
            type: 'success'
          });
        }
        this[dialog] = false;
        this.getLimitedData.call(this,{num:this.license});
      }).catch((err) => {
        print(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
    
    cancleLimits(dialog){//取消授权
      this[dialog] = false;
    }
  },
  mounted(){
    this.getCarData.call(this);
  }
}
</script>

<style scoped>
.car-man{
  width: 100%;
  height: 100%;
}
.scrollbar{
  width: 100%;
  height: calc(100% - 150px);
}
.complete-input{
  width: 250px;
}
/* 选择上传照片 */
.box{
  display: inline-block;
  width: 100px;
  height: 100px;
  background-color: #fff;
  position: absolute;
  overflow: hidden;
  margin-left: 5px;
}
</style>
