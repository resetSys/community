<template>
  <div class="div_man">
    <title-bar>
      <span slot="title">部门管理</span>
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
    <div class="main">
      <div class="tree_wrap">
        <el-tree
          :data="treeData"
          node-key="id"
          empty-text="暂无数据"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="[5]"
          :props="defaultProps"
          @node-contextmenu="openMenu"
          @current-change="currChange">
        </el-tree>
      </div>
      <div class="tree_content">
      
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
          
        </div>
      </div>
      <div class="drawer-bottom">
        <el-button type="primary">提交</el-button>
        <el-button @click="addDrawer = false">取消</el-button>
      </div>
    </el-drawer>
    <!-- 自定义右键菜单 -->
    <div id="context_menu" @mouseleave="closeMenu">
      <p @click="alertPromise('add')">添加</p>
      <p @click="alertPromise('delete')">删除</p>
      <p @click="alertPromise('edit')">编辑</p>
    </div>
  </div>
</template>

<script>
import titleBar from "components/common/titleBar/TitleBar"
import searchBar from "components/common/searchBar/SearchBar"

export default {
  name: 'divMan',
  data() {
    return {
      addDrawer:false,
      contextMenu:null,
      currMenuItem:{},
      treeData:[{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
    }
  },
  components: {
    titleBar,
    searchBar,
  },
  methods:{
    openMenu(event,data){//右键触发
      //event,data,node,value
      this.currMenuItem = data
      /*
        获取界面中右键菜单，将位置设置为鼠标的event 中x和y，display设置为block
      */
      if (this.contextMenu == null) {
        this.contextMenu = window.document.getElementById("context_menu")
      }
      if (event.x <= 270) {
        this.contextMenu.style.left = (event.x - 80)+"px"
        window.console.log("x <= 70")
      } else {
        this.contextMenu.style.left = (event.x - 280)+"px"
      }
      this.contextMenu.style.top = (event.y - 60)+"px"
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
    currChange(value,node){//当前选中节点时触发
      window.console.log(value,node)
      window.console.log("选中当前")
    },
    getTreeData(){//获取部门数据
      
    }
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
  background-color: rgba(0, 89, 255, 0.473);
}
.tree_wrap{
  width: 30%;
  height: 100%;
  background-color: antiquewhite;
}
.tree_content{
  width: 70%;
  height: 100%;
  background-color: aqua;
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
</style>
