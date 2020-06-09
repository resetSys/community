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

    </el-scrollbar>
    <!-- 分页组件 -->
    <pagination :pageSize="pageSize" :allPage="allPage" :currIndex="currPage"
      @hanSiChange="hanSiChange" @hanCurrChange="hanCurrChange"></pagination>
    <!-- 创建访程 -->
    <el-drawer :visible.sync="addDrawer" 
      :with-header="false"
      :wrapper-closable="$store.state.closeOnClickModal"
      :close-on-press-escape="$store.state.closeOnPresEscape">
      <div class="drawer-title">
        新增访程
      </div>
      <el-scrollbar style="height:calc(100vh - 100px);">
        <div class="drawer-con">
          <el-form :model="threadForm" ref="threadForm"
            label-width="7vw" label-position="right">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="threadForm.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select v-model="threadForm.sex" placeholder="请选择">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="threadForm.idCard"></el-input>
            </el-form-item>
            <el-form-item label="电话号码" prop="tel">
              <el-input v-model="threadForm.tel"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <div class="drawer-bottom">
        <el-button type="primary">提交</el-button>
        <el-button @click="close('threadForm','addDrawer')">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
//组件
import titleBar from "components/common/titleBar/TitleBar";
import searchBar from "components/common/searchBar/SearchBar";
import pagination from "components/common/pagination/Pagination";
//网络请求
import { request } from "@/network/request";
export default {
  name: 'thread',
  data() {
    return {
      //分页
      pageSize:10,
      allPage:0,
      currPage:1,
      //新增访程
      addDrawer:false,
      threadForm:{
        id:null,
        idCard:"",
        weChatId:null,
        name:"",
        sex:"",
        birth:"",
        tel:"",
        address:"",
        jobNum:null,
        job:"",
        picture:"",
        enterDate:null,
        branchId:[],
        branchName:null,
      },
      //访程数据
      threadData:[]
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
    delete(){//删除访程
    
    },

    //获取访程数据
    getThreadData() {
      this.$store.commit('handleLoding');
      request({
        url:"",
        method:"post",
        
      }).then((res) => {
        window.console.log(res);
      }).catch((err) => {
        window.console.log(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      })
    },
    //分页请求
    hanSiChange(val){//分页条数改变
      this.pageSize = val
    },
    hanCurrChange(val){//当前页改变
      this.currPage = val
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
</style>
