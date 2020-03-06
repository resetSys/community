<template>
  <div class="car">
    <title-bar>
      <span slot="title">人脸识别设备管理</span>
      <span slot="control">
        <el-button type="primary" size="small" @click="addDrawer = true">新增</el-button>
      </span>
    </title-bar>
    <search-bar>
      <span slot="control">
        <el-input size="small" style="width:200px;"></el-input>
        <el-button size="small" type="primary">搜索</el-button>
      </span>
    </search-bar>
    <el-scrollbar class="scrollbar">
       <el-table
        :data="deviceData"
        style="width: 100%"
        size="small"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="id"
          align="center"
          label="设备id"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="location"
          align="center"
          label="设备位置">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button style="color:#409EFF;" type="text" @click="editMsg(scope.row)">编辑</el-button>
            <el-button style="color:#F56C6C;" type="text" @click="delMsg(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 新增功能 -->
    <el-drawer :visible.sync="addDrawer" 
      :with-header="false"
      :wrapper-closable="false"
      :close-on-press-escape="false">
      <div class="drawer-title">
        新增人脸识别设备
      </div>
      <el-scrollbar style="height:calc(100vh - 100px);">
        <div class="drawer-con">
          <el-form :model="addForm" :rules="addFormRule" ref="addForm" label-width="5vw" label-position="right">
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <div class="drawer-bottom">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="closeDrawer">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import titleBar from "components/common/titleBar/TitleBar"
import searchBar from "components/common/searchBar/SearchBar"

export default {
  name: 'car',
  data() {
    return {
      addDrawer:false,
      addForm:{
        name:"",
      },
      addFormRule:{
        name:[
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
      },
      deviceData:[
        {
          name:"财务部",
          id:"1",
          location:"财务部东边"
        }
      ],
    }
  },
  components: {
    titleBar,
    searchBar
  },
  methods:{
    submit(){
      //提交表单
      // 提交成功后应该关闭drawer，表单会自动清除
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          window.alert('submit!');
          this.$refs['addForm'].resetFields()
        } else {
          return false;
        }
      });
    },
    closeDrawer(){
      // 首先清空表单，然后关闭drawer
      this.$refs['addForm'].resetFields()
      this.addDrawer = false
    },
    //删除账户
    delMsg(row){
      window.console.log(row)
      this.$confirm('确定删除该账户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.alert("发送请求，删除该人员")
      }).catch(() => {
        window.alert("取消删除")
      });
    },
    editMsg(row){//修改设备信息
      /*
        将值赋值给注册表单
        将drawer打开
      */
      for (const key in this.addForm) {
        // if (this.addForm.hasOwnProperty(key)) {
          
        // }
        this.addForm[key] = row[key]
      }
      this.addDrawer = true
    },
  }
}
</script>

<style scoped>
.car{
  width: 100%;
  height: 100%
}
</style>
