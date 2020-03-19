<template>
  <div class="infopush">
    <title-bar>
      <span slot="title">微信推送</span>
      <span slot="control">
        <!-- <el-button type="primary" size="small" @click="handleAdd">新增</el-button> -->
      </span>
    </title-bar>
    <search-bar>
      <!-- <span slot="control">
        <el-input size="small" style="width:200px;"></el-input>
        <el-button size="small" type="primary">搜索</el-button>
      </span> -->
    </search-bar>
    <div class="setting">
      <el-form :model="addForm" ref="addForm" :rules="formRule"
        label-width="10vw" label-position="left">
        <el-form-item label="是否开启微信服务:" prop="startup">
          <el-radio-group v-model="addForm.startup">
            <el-radio :label="true">开启</el-radio>
            <el-radio :label="false">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="企业ID:" prop="corpid">
          <el-input v-model="addForm.corpid" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="企业密钥:" prop="corpsecret">
          <el-input v-model="addForm.corpsecret" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="企业应用ID:" prop="agentid">
          <el-input v-model="addForm.agentid" placeholder=""></el-input>
        </el-form-item>

        <div style="text-align:center">
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="clearForm">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
//组件
import titleBar from "components/common/titleBar/TitleBar"
import searchBar from "components/common/searchBar/SearchBar"
//请求
import {request} from "@/network/request"
//工具
import { handleRequest } from "@/utils";

export default {
  name: 'infopush',
  data() {
    return {
      addForm:{
        startup:false,
        corpid:null,
        corpsecret:null,
        agentid:null
      },
      formRule:{
        startup:[
          {required: true, message: '请选择是否开启', trigger: 'blur'},
        ],
        corpid:[
          {required: true, message: '请输入企业ID', trigger: 'blur'},
        ],
        corpsecret:[
          {required: true, message: '请输入企业密钥', trigger: 'blur'},
        ],
        agentid:[
          {required: true, message: '请输入企业应用ID', trigger: 'blur'},
        ],
      }
    }
  },
  components: {
    titleBar,
    searchBar,
  },
  methods:{
    submit(){//提交配置信息
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('handleLoding')
          request({
              url:"/weiXin/set",
              method:"post",
              data:{
                startup:this.addForm.startup,
                corpid:this.addForm.corpid,
                corpsecret:this.addForm.corpsecret,
                agentid:this.addForm.agentid
              }
          }).then(res => {
            let respond = handleRequest.call(this,res.data)
            if (respond!== false) {
              this.$message({
                message: res.data.respond,
                type: 'success'
              });
            }
          }).catch(err =>{
            window.console.log(err)
          }).finally(()=>{
            this.$store.commit('handleLoding')
          })
        }
      });
    },
    clearForm() {//清除表单
      this.$refs['addForm'].resetFields()
      for (const key in this.addForm) {
        this.addForm[key] = null
      }
    },

    getSetting(){//获取之前的配置
      this.$store.commit('handleLoding')
      request({
          url:"/weiXin/sel",
          method:"post",
      }).then(res => {
        window.console.log(res)
        for (const key in this.addForm) {
          this.addForm[key] = res.data.respond[key]
        }
      }).catch(err =>{
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    }
  },
  mounted(){
    this.getSetting.call(this)
  }
}
</script>

<style scoped>
.infopush{
  width: 100%;
  height: 100%;
  position: relative;
}
.setting{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 500px;
  height: 240px;
  padding: 20px;
  background-color: #dcdcdc;
  border-radius: 5px;
}
.el-input{
  margin: 0;
}
</style>
