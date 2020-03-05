<template>
  <div class="account-man">
    <title-bar>
      <span slot="title">账户管理</span>
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
        :data="accData"
        style="width: 100%"
        size="small"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="name"
          align="center"
          label="名称"
          width="100">
        </el-table-column>
        <el-table-column
          prop="pwd"
          align="center"
          label="密码">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button style="color:var(--brand-color);" type="text" @click="limitDialog = true">权限</el-button>
            <el-button style="color:var(--brand-color);" type="text" @click="bindEquiDialog=true">绑定设备</el-button>
            <el-button style="color:var(--brand-color);" type="text" @click="editMsg(scope.row)">编辑</el-button>
            <el-button style="color:var(--delete-color);" type="text" @click="delMsg(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 
    新增需要的功能 
      内部使用表单注册
      下次打开前表单内容必须清空，可以在打开前清空也可以在关闭前清空,使用关闭前回调清空表单
      如果内容较多的话应该让内容可以滚动
      不允许使用esc和点击modol关闭drawer
    编辑内容
      使用的还是新增的表单，设置某些信息不可更改
    删除信息
      使用confirm提示以下，确定就删除
    设置权限:
      使用element多选框
      页面加载后获取后台发送该人员已有的权限和全部权限
    -->
    <el-drawer :visible.sync="addDrawer" 
      :with-header="false"
      :wrapper-closable="$store.state.closeOnClickModal"
      :close-on-press-escape="$store.state.closeOnPresEscape">
      <div class="drawer-title">
        新增账户
      </div>
      <el-scrollbar style="height:calc(100vh - 100px);">
        <div class="drawer-con">
          <el-form :model="addForm" :rules="addFormRule" ref="addForm" label-width="5vw" label-position="right">
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
              <el-input v-model="addForm.pwd"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <div class="drawer-bottom">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="closeDrawer">取消</el-button>
      </div>
    </el-drawer>
    <!-- 显示权限 -->
    <el-dialog custom-class="limit-dialog" :visible.sync="limitDialog" 
      width="30%"
      title="权限设置" :top="$store.state.dialogTop"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedLimits" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="limit in limitsOptions" :label="limit" :key="limit">{{limit}}</el-checkbox>
      </el-checkbox-group>
    </el-dialog>
    <!-- 绑定设备 -->
    <el-dialog custom-class="limit-dialog"
      :visible.sync="bindEquiDialog" width="30%"
      title="绑定设备" :top="$store.state.dialogTop"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      绑定设备  
    </el-dialog>
  </div>
</template>

<script>
import titleBar from "components/common/titleBar/TitleBar"
import searchBar from "components/common/searchBar/SearchBar"

export default {
  name: 'accountMan',
  data() {
    return {
      addDrawer:false,
      limitDialog:false,
      bindEquiDialog:false,
      checkAll: false,
      checkedLimits: ['职工管理', '勤务管理'],
      limitsOptions: ['职工管理', '勤务管理', '账户管理', '设备管理','微信服务'],
      isIndeterminate: true,
      accData:[{
        name:"管理员1",
        pwd:"8888888888"
      }],
      addForm:{
        name:"",
        pwd:""
      },
      addFormRule:{
        name:[
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        pwd:[
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },
    }
  },
  components: {
    titleBar,
    searchBar
  },
  methods:{
    // 新增账户
    submit(){
      //提交表单
      // 提交成功后应该关闭drawer，表单会自动清除
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          window.alert('submit!');
          //提交成功后清空表单
          this.closeDrawer.call(this)
        } else {
          return false;
        }
      });
    },
    closeDrawer(){
      // 首先清空表单，然后关闭drawer
      this.$refs['addForm'].resetFields()
      for (const key in this.addForm) {
        this.addForm[key] = null
      }
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
    //编辑账户
    editMsg(row){
      //将本行数据赋值给表单
      for (const key in this.addForm) {
        if (this.addForm.hasOwnProperty(key)) {
          this.addForm[key] = row[key]
        }
      }
      this.addDrawer = true
    },
    handleCheckAllChange(val) {//全选权限
      this.checkedLimits = val ? this.limitsOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.limitsOptions.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.limitsOptions.length;
    }
  },
  mounted(){
   
  },
  
}
</script>

<style scoped>
.account-man{
  width: 100%;
  height: 100%;
}
/* 滚动区域 */
.scrollbar{
  height: calc(100% - 100px);
}

</style>
