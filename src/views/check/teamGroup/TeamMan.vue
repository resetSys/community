<template>
  <div class="team-man">
    <title-bar>
      <span slot="title">班组管理</span>
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
        :data="teamData"
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
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button style="color:var(--brand-color);" type="text" @click="lookTeamDialog = true">人员</el-button>
            <el-button style="color:var(--brand-color);" type="text" @click="lookRuleDialog = true">规则</el-button>
            <el-button style="color:var(--brand-color);" type="text" @click="editMsg(scope.row)">编辑</el-button>
            <el-button style="color:var(--delete-color);" type="text" 
            @click="delMsg(scope.row,'确定删除该班组吗?')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页组件 -->
    <pagination></pagination>
    <!-- 新增班组 -->
    <el-drawer :visible.sync="addDrawer" 
      :with-header="false"
      :wrapper-closable="$store.state.closeOnClickModal"
      :close-on-press-escape="$store.state.closeOnPresEscape">
      <div class="drawer-title">
        新增班组
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
    <!-- 查看班组人员 -->
    <el-dialog custom-class="limit-dialog" 
      :visible.sync="lookTeamDialog" 
      width="70%" title="班组人员" :top="$store.state.dialogTop"
      style="overflow:hidden"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-scrollbar style="height:40vh">
         <el-table
          :data="teamPersonData"
          style="width: 100%"
          size="small"
          stripe
          empty-text="暂无数据">
          <el-table-column
            prop="name"
            align="center"
            label="名称">
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button style="color:var(--delete-color);" type="text" 
              @click="delMsg(scope.row,'确定删除该人员吗?')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <div class="look-team-bottom">
        <el-button type="primary" @click="addPerDialog = true">新增</el-button>
      </div>
    </el-dialog>
    <!-- 
      新增班组人员:
      思路:
      可以使用表格，也可以使用自定义
      分页展示，数据是会被替换掉，如果想要显示是否选中，可能要绑定一个事件，用来判断该段数据中是否有该条信息
     -->
    <el-dialog custom-class="limit-dialog" 
      :visible.sync="addPerDialog" 
      width="70%" :top="$store.state.dialogTop"
      style="overflow:hidden"
      :show-close="false"
      title="添加人员"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <div class="addPerSearch">
        <el-input placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <el-scrollbar style="height:40vh;">
        <el-table
          :data="personData"
          style="width: 100%"
          stripe
          empty-text="暂无数据">
          <el-table-column
            type="selection"
            align="center"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="sex"
            align="center"
            label="性别">
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <pagination></pagination>
      <div class="look-team-bottom">
        <el-button type="primary">确定</el-button>
        <el-button @click="addPerDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 查看绑定规则 -->
    <el-dialog custom-class="limit-dialog" 
      :visible.sync="lookRuleDialog" 
      width="70%" title="绑定规则" :top="$store.state.dialogTop"
      style="overflow:hidden"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-scrollbar style="height:40vh">
         <el-table
          :data="temaRuleData"
          style="width: 100%"
          size="small"
          stripe
          empty-text="暂无数据">
          <el-table-column
            prop="name"
            align="center"
            label="名称">
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button style="color:var(--delete-color);" type="text" 
              @click="delMsg(scope.row,'确定删除该人员吗?')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <div class="look-team-bottom">
        <el-button type="primary" @click="addRuleDialog = true">新增</el-button>
      </div>
    </el-dialog>
    <!-- 添加绑定规则 -->
    <el-dialog custom-class="limit-dialog" 
      :visible.sync="addRuleDialog" 
      width="70%" :top="$store.state.dialogTop"
      style="overflow:hidden"
      :show-close="false"
      title="添加规则"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <div class="addPerSearch">
        <el-input placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <el-scrollbar style="height:40vh;">
        <el-table
          :data="ruleData"
          style="width: 100%"
          stripe
          empty-text="暂无数据">
          <el-table-column
            type="selection"
            align="center"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="名称">
          </el-table-column>
          <el-table-column
            prop="type"
            align="center"
            label="类型">
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <pagination></pagination>
      <div class="look-team-bottom">
        <el-button type="primary">确定</el-button>
        <el-button @click="addRuleDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import titleBar from "components/common/titleBar/TitleBar"
import searchBar from "components/common/searchBar/SearchBar"
import pagination from "components/common/pagination/Pagination"
export default {
  name: 'teamMan',
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
      teamData:[{
        name:"班组1"
      }],
      lookTeamDialog:false,
      addPerDialog:false,
      teamPersonData:[{
        name:"小张"
      }],
      personData:[{
        name:"员工1",
        sex:"男"
      }],
      lookRuleDialog:false,
      addRuleDialog:false,
      temaRuleData:[{
        name:"规则1"
      }],
      ruleData:[{
        name:"考勤二",
        type:"自由考勤"
      },{
        name:"考勤三",
        type:"固定考勤"
      }]
    }
  },
  components: {
    titleBar,
    searchBar,
    pagination
  },
  methods:{
    //获取班组数据
    getTeam(){
      //参数:当前页、请求条数
    },
    //获取该班组中的人员
    getTeamPerson(){
      //参数：班组标识、当前页、请求条数
    },
    //添加绑定人员，获取所有人员
    getPerson(){
      //参数：当前班组标识、当前页、size条数
    },
    //提交表单
    submit(){
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
    delMsg(row,info){
      // window.console.log(row)
      this.$confirm(info, '提示', {
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
  }
}
</script>

<style scoped>
.team-man{
  width: 100%;
  height: 100%;
}
/* 滚动区域 */
.scrollbar{
  height: calc(100% - 150px);
}
/* 添加人员搜索框 */
.addPerSearch{
  width: 100%;
  padding-left: 70%;
  padding-right: 5px;
  box-sizing: border-box;
}
.look-team-bottom{
  width: 100%;
  height: auto;
  padding-top: 10px; 
  text-align: center;
}
</style>
