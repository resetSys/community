<template>
  <div class="check-man">
    <title-bar>
      <span slot="title">常规考勤</span>
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
    <el-scrollbar style="height:height: calc(100% - 100px);">
      <el-table
        :data="fileData"
        style="width: 100%"
        size="small"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="id"
          align="center"
          label="id"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="名称"
          width="80">
        </el-table-column>
        
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="checkFile(scope.row)">查看班次</el-button>
            <el-button type="text" @click="edit(scope.row,'addForm','addDrawer')">编辑</el-button>
            <el-button type="text" style="color:var(--delete-color)" @click="deleteFile">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 新增集合 -->
    <el-drawer :visible.sync="addDrawer" 
      :with-header="false"
      :wrapper-closable="false"
      :close-on-press-escape="false">
      <div class="drawer-title">
        新增规则
      </div>
      <div style="height:calc(100vh - 100px);">
        <div class="drawer-con">
          <el-form :model="addForm" :rules="addFormRule" 
            ref="addForm" label-width="5vw" label-position="right">
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="drawer-bottom">
        <el-button type="primary" @click="submit('addForm','addDrawer')">提交</el-button>
        <el-button @click="close('addForm','addDrawer')">取消</el-button>
      </div>
    </el-drawer>
    <!-- 查看子集 -->
    <el-dialog custom-class="limit-dialog" 
      :visible.sync="lookFileDialog" 
      width="70%" title="查看子集" :top="$store.state.dialogTop"
      style="overflow:hidden"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-scrollbar style="height:40vh">
         <el-table
          :data="ruleTable"
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
              <el-button style="color:var(--brand-color);" type="text"
                @click="edit(scope.row,'addRuleForm','addRuleDialog')">编辑</el-button>
              <el-button style="color:var(--delete-color);" type="text"
                @click="deleteFile(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <div class="look-file-bottom">
        <el-button type="primary" @click="addRuleDialog = true">新增</el-button>
      </div>
    </el-dialog>
    <!-- 新增、编辑子集 -->
    <el-dialog custom-class="limit-dialog" 
      :visible.sync="addRuleDialog" 
      width="30%" :top="$store.state.dialogTop"
      style="overflow:hidden"
      :show-close="false"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-scrollbar style="height:40vh;">
        <el-form :model="addRuleForm" :rules="addRuleFormRule" 
          ref="addRuleForm" label-width="5vw" label-position="top">
          <el-form-item label="名称" prop="name">
            <el-input style="width:calc(100% - 10px);" v-model="addRuleForm.name"></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="add-rule-buttom">
        <el-button type="primary" @click="submit('addRuleForm','addRuleDialog')">确定</el-button>
        <el-button @click="close('addRuleForm','addRuleDialog')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import titleBar from "components/common/titleBar/TitleBar"
import searchBar from "components/common/searchBar/SearchBar"

export default {
  name: 'checkMan',
  data() {
    return {
      fileData:[{
        id:1,
        name:"规则一"
      },{
        id:2,
        name:"规则二"
      }],
      addForm:{
        name:""
      },
      addFormRule:{
        name:[
          {required: true, message: '请输入名称', trigger: 'blur'}
        ]
      },
      addDrawer:false,
      ruleTable:[{
        name:"子集1"
      },],
      addRuleForm:{
        name:''
      },
      addRuleFormRule:{
        name:[
          {required: true, message: '请输入名称', trigger: 'blur'}
        ]
      },
      lookFileDialog:false,
      addRuleDialog:false
    }
  },
  components: {
    titleBar,
    searchBar,
  },
  methods:{
    /*
      规则集合思路:
      新增 打开表单注册信息，提交后清空
      编辑 将本行数据赋值给表单，用户修改后提交，提交成功后清空表单
      删除 用户点击删除按钮，给予提示
    */
    submit(formName,dialog){
      //提交表单
      // 提交成功后应该关闭drawer，表单会自动清除
      this.$refs[formName].validate((valid) => {
        if (valid) {
          window.alert('submit!');
          this.close.call(this,[formName,dialog])
        } else {
          return false;
        }
      });
    },
    deleteFile(){//删除
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        
      }).catch(() => {});
    },
    checkFile(){//查看规则子集
      // window.console.log(row)
      this.lookFileDialog = true
    },

    edit(row,formName,dialog){
      for (const key in this[formName]) {
        if (this[formName].hasOwnProperty(key)) {
          this[formName][key] = row[key]
        }
      }
      this[dialog] = true
    },
    close(formName,dialog){//关闭注册抽屉
      // 首先清空表单，然后关闭drawer
      this.$refs[formName].resetFields()
      for (let key in this[formName]) {
        this[formName][key] = null
      }
      this[dialog] = false
    },



  }
}
</script>

<style scoped>
.check-man{
  width: 100%;
  height: 100%;
}
.look-file-bottom{
  width: 100%;
  height: auto;
  text-align: center;
}
.add-rule-buttom{
  width: 100%;
  height: auto;
  text-align: center;
}
</style>
