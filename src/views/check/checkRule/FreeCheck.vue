<template>
  <div class="free-check">
    <title-bar>
      <span slot="title">自由考勤</span>
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
          prop="timeFrame"
          align="center"
          label="时段"
          :formatter="format">
        </el-table-column>
        
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row,'addForm','addDrawer')">编辑</el-button>
            <el-button type="text" style="color:var(--delete-color)" @click="deleteFile">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 新增规则 -->
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
            <el-form-item label="时间范围" prop="timeFrame">
              <el-time-picker
                is-range
                v-model="addForm.timeFrame"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="drawer-bottom">
        <el-button type="primary" @click="submit('addForm','addDrawer')">提交</el-button>
        <el-button @click="close('addForm','addDrawer')">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import titleBar from "components/common/titleBar/TitleBar"
import searchBar from "components/common/searchBar/SearchBar"

import {formatTime} from "@/utils"
export default {
  name: '',
  data() {
    return {
      fileData:[{
        id:1,
        name:"规则一",
        timeFrame:[1572048779952,1572048979952]
      },{
        id:2,
        name:"规则二",
        timeFrame:[1472048771092,1472348771092]
      }],
      addForm:{
        name:"",
        timeFrame:[new Date(),new Date()]
      },
      addFormRule:{
        name:[
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        timeFrame:[
          {required: true, message: '请输入名称', trigger: 'blur'}
        ]
      },
      addDrawer:false,
    }
  },
  components: {
    titleBar,
    searchBar,
  },
  methods:{
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
    deleteFile(){//删除
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        
      }).catch(() => {});
    },
    format(row){
      let time = ""
      time = formatTime(row.timeFrame[0],'h:m:s')
      for (let i = 1; i < row.timeFrame.length; i++) {
        time += "-" + formatTime(row.timeFrame[i],'h:m:s')
      }
      return time
    }
  }
}
</script>

<style scoped>
.free-check{
  width: 100%;
  height: 100%;
}
.el-date-editor{
  margin: 0 5px;
}
</style>
