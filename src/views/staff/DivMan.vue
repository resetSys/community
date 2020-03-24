<template>
  <div class="div_man">
    <title-bar>
      <span slot="title">部门管理</span>
      <span slot="control">
        <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
      </span>
    </title-bar>
    <search-bar>
      <!-- <span slot="control">
        <el-input size="small" style="width:200px;"></el-input>
        <el-button size="small" type="primary">搜索</el-button>
      </span> -->
    </search-bar>
    <div class="main">
      <el-scrollbar class="scrollbar">
        <div class="tree_wrap">
          <el-tree
            :data="treeData"
            node-key="branch_id"
            empty-text="暂无数据"
            :props="defaultProps"
            @node-contextmenu="openMenu"
            @current-change="currChange">
          </el-tree>
        </div>
      </el-scrollbar>
      <div class="tree_content">
        <p style="font-size:18px;">部门备注:</p>
        <p style="padding-top:10px">{{clickBranchItem.remarks}}</p>
      </div>
    </div>
    <!-- 新增根节点 -->
    <el-drawer :visible.sync="addDrawer" 
      :with-header="false"
      :wrapper-closable="false"
      :close-on-press-escape="false">
      <div class="drawer-title">
        新增部门
      </div>
      <div style="height:calc(100vh - 100px);">
        <div class="drawer-con">
          <el-form :model="branchForm" :rules="branchFormRule" ref="branchForm"
            label-width="7vw" label-position="right">
            <el-form-item label="部门名称" prop="branch_name">
              <el-input v-model="branchForm.branch_name"></el-input>
            </el-form-item>
            <el-form-item label="部门备注" prop="remarks">
              <el-input v-model="branchForm.remarks"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="drawer-bottom">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="close('branchForm','addDrawer')">取消</el-button>
      </div>
    </el-drawer>
    <!-- 自定义右键菜单 -->
    <div id="context_menu" @mouseleave="closeMenu">
      <p @click="handleAddSub()">添加</p>
      <p @click="deleteRow(currMenuItem)">删除</p>
      <p @click="edit(currMenuItem,'branchForm','addDrawer')">编辑</p>
    </div>
    <!-- 新增子部门 -->
    <el-dialog :visible.sync="addSubDialog" width="30%"
      title="新增子部门" custom-class="limit-dialog"
      :top="$store.state.dialogTop"
      style="overflow:hidden">
      <el-form :model="branchForm" :rules="branchFormRule" ref="branchForm"
        label-width="7vw" label-position="right">
        <el-form-item label="部门名称" prop="branch_name">
          <el-input v-model="branchForm.branch_name"></el-input>
        </el-form-item>
        <el-form-item label="部门备注" prop="remarks">
          <el-input v-model="branchForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div class="look-team-bottom">
        <el-button type="primary" @click="submitSub(currMenuItem)">提交</el-button>
        <el-button @click="close('branchForm','addSubDialog')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import titleBar from "components/common/titleBar/TitleBar"
import searchBar from "components/common/searchBar/SearchBar"
//网络请求
import { request } from "@/network/request";
//工具
import { handleRequest } from "@/utils"
export default {
  name: 'divMan',
  data() {
    return {
      addDrawer:false,
      addSubDialog:false,
      contextMenu:null,
      currMenuItem:{},//保存右键点击的选项
      clickBranchItem:{remarks:""},//保存点击的部门
      treeData:null,
      defaultProps: {
        children: 'children',
        label: 'branch_name'
      },
      branchForm:{
        branch_id:null,
        branch_name:"",
        remarks:""
      },
      branchFormRule:{
        branch_name:[
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min:1,max:40, message: '名称不能超过40', trigger: 'blur'}
        ],
        remarks:[
          {max:40, message: '备注不能超过400', trigger: 'blur'}
        ]
      },
      submitType:1,
    }
  },
  components: {
    titleBar,
    searchBar,
  },
  methods:{
    //右键菜单展示
    openMenu(event,data){//右键触发
      //event,data,node,value
      // window.console.log(event)
      this.currMenuItem = data
      /*
        获取界面中右键菜单，将位置设置为鼠标的event 中x和y，display设置为block
      */
      if (this.contextMenu == null) {
        this.contextMenu = window.document.getElementById("context_menu")
      }
      if (event.pageX <= 270) {
        this.contextMenu.style.left = (event.pageX - 80)+"px"
        window.console.log("x <= 70")
      } else {
        this.contextMenu.style.left = (event.pageX - 280)+"px"
      }
      this.contextMenu.style.top = (event.pageY - 60)+"px"
      /*
        contextMenu是相对于当前容器的，所以需要将header的高度和导航菜单的宽度减去
      */
      this.contextMenu.style.display = "block"
    },
    closeMenu(){
      this.contextMenu.style.display = 'none'
    },
    alertPromise(msg){//执行右键操作
      // window.alert(msg)
      // window.console.log(this.currMenuItem)
      switch (msg) {
        case 'add':
          this.$prompt('请输入部门名称', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[\u4e00-\u9fa5A-Za-z0-9-]{1,10}$/,
            inputErrorMessage: '不能为空,最长10个字符'
          }).then(({value}) => {
            window.console.log(value)
            //向后端发送请求修改
            //修改成功后刷新数据
          }).catch(err =>{
            window.console.log(err)
          })
          break;
        case 'delete':
          this.$confirm('此操作将会啥删除该节点, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
                    
          });
          break;
        case 'edit':
          this.$prompt('请输入部门名称', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[\u4e00-\u9fa5A-Za-z0-9-]{1,10}$/,
            inputErrorMessage: '不能为空,最长10个字符'
          }).then(({value}) => {
            window.console.log(value)
            //向后端发送请求修改
            //修改成功后刷新数据
          }).catch(err =>{
            window.console.log(err)
          })
          break;
        default:
          break;
      }

    },
    currChange(value){//当前选中节点时触发
      // window.console.log(value,node)
      this.clickBranchItem = value
    },

    getTreeData(){//获取部门数据
      this.$store.commit('handleLoding')
      request({
        url:"/branch/select",
        method:"post",

      }).then((res) => {
        // window.console.log(res)
        let respond = handleRequest.call(this,res.data)
        if (respond !== false) {
          this.treeData = respond
          
        }
      }).catch((err) => {
        window.console.log(err)
        
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },

    //部门管理
    handleAdd(){
      this.addDrawer = true
      this.submitType = 1
    },
    submit(){//提交新增根部门
      this.$refs['branchForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('handleLoding')
          if (this.submitType == 1) {
            request({
              url:"/branch/insertRoot",
              method:"post",
              data:{
                branch_name:this.branchForm.branch_name,
                remarks:this.branchForm.remarks
              }
            }).then((res) => {
              window.console.log(res)
              /*
                注册成功后关闭注册框
                刷新界面数据
                清空表单
              */
              this.$message({
                message: res.data.respond,
                type: 'success'
              });
              this.getTreeData.call(this)
              this.close.call(this,'branchForm','addDrawer')
            }).catch((err) => {
              window.console.log(err)
              
            }).finally(()=> {
              this.$store.commit('handleLoding')
            })
          } else if(this.submitType == 2){
            request({
              url:"/branch/update",
              method:"post",
              data:{
                branch_id:this.branchForm.branch_id,
                branch_name:this.branchForm.branch_name,
                remarks:this.branchForm.remarks
              }
            }).then((res) => {
              // window.console.log(res)
              /*
                注册成功后关闭注册框
                刷新界面数据
                清空表单
              */
              this.$message({
                message: res.data.respond,
                type: 'success'
              });
              this.getTreeData.call(this)
              this.close.call(this,'branchForm','addDrawer')
            }).catch((err) => {
              window.console.log(err)
              
            }).finally(()=> {
              this.$store.commit('handleLoding')
            })
          }
        }
      });
    },
    close(formName,dialog){//关闭注册抽屉
      /*
        首先清空表单，然后关闭drawer
      */
      this.$refs[formName].resetFields()
      for (let key in this[formName]) {
        this[formName][key] = null
      }
      this[dialog] = false
    },
    edit(row,formName,dialog){//修改
      /*
        将表格中的信息循环赋值到表单中
      */
      this.submitType = 2;
      for (const key in this[formName]) {
        if (this[formName].hasOwnProperty(key)) {
          this[formName][key] = row[key]
        }
      }
      this[dialog] = true
    },
    deleteRow(row){
      this.$confirm('此操作将会删除该部门以及子部门', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.$store.commit('handleLoding')
        request({
          url:"/branch/delete",
          method:"post",
          data:{
            branch_id:row.branch_id
          }
        }).then((res) => {
          // window.console.log(res)
          this.$message({
            message: res.data.respond,
            type: 'success'
          });
          this.getTreeData.call(this)
        }).catch((err) => {
          window.console.log(err)
          
        }).finally(()=> {
          this.$store.commit('handleLoding')
        })
        
      }).catch(() => {});
    },
    
    //子部门编辑
    handleAddSub(){
      this.addSubDialog = true
    },
    submitSub(row){
      this.$refs['branchForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('handleLoding')
          request({
            url:"/branch/insertSon",
            method:"post",
            data:{
              superior_id:row.branch_id,
              branch_name:this.branchForm.branch_name,
              remarks:this.branchForm.remarks
            }
          }).then((res) => {
            // window.console.log(res)
            /*
              注册成功后关闭注册框
              刷新界面数据
              清空表单
            */
            this.$message({
              message: res.data.respond,
              type: 'success'
            });
            this.getTreeData.call(this)
            this.close.call(this,'branchForm','addSubDialog')
          }).catch((err) => {
            window.console.log(err)
            
          }).finally(()=> {
            this.$store.commit('handleLoding')
          })
        }
      });
    }
  },
  mounted(){
    this.getTreeData.call(this)
  }
}
</script>

<style scoped>
.div_man{
  width: 100%;
  height: 100%;
}
.main{
  display: flex;
  width: 100%;
  height: calc(100% - 100px);
}
.scrollbar{
  height: 100%;
  width: 30%;
  box-sizing: border-box;
  border-right: 1px solid #dcdcdc;
}
.tree_wrap{
  width: 100%;
  height: 100%;
}
.tree_content{
  padding: 10px;
  box-sizing: border-box;
  width: 70%;
  height: 100%;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

/* 自定义右键菜单 */
#context_menu{
  position: absolute;
  width: 100px;
  height: 90px;
  background-color: #fff;
  top: 0;
  left: 0;
  z-index: 5;
  border: 1px solid #dcdcdc;
  box-shadow: 2px 2px 5px #dcdcdc;
  display: none;
}
#context_menu>p{
  line-height: 30px;
  cursor: pointer;
  padding-left: 20px;
  box-sizing: border-box;
}
#context_menu>p:hover{
  background-color: #dcdcdc;
}
/* 新增子部门表单底部 */
.look-team-bottom{
  width: 100%;
  height: auto;
  padding-top: 10px; 
  text-align: center;
}
</style>
