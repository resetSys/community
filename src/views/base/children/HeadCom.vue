<template>
  <div class="head-com">
    <div class="head-title">考勤管理系统</div>
    <div class="head-control">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link" style="cursor: pointer;padding:0 5px">
          个人中心<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
          <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <img style="width:30px;height:30px" src="~assets/imgs/home/user.png" alt="">
    </div>

    <el-dialog custom-class="limit-dialog" :visible.sync="changeDialog" 
      width="30%"
      title="修改密码" :top="$store.state.dialogTop"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">

      <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdForm" label-position="top">
        <el-form-item label="请输入旧密码" prop="oldPwd">
          <el-input v-model="pwdForm.oldPwd" type="password" show-password
            placeholder="不能包含中文和特殊符号"></el-input>
        </el-form-item>
        <el-form-item label="请输入新密码" prop="newPwd">
          <el-input v-model="pwdForm.newPwd" type="password" show-password
            placeholder="不能包含中文和特殊符号"></el-input>
        </el-form-item>
        <el-form-item label="请确认新密码" prop="againPwd">
          <el-input v-model="pwdForm.againPwd" type="password" show-password
            placeholder="不能包含中文和特殊符号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDrawer">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//请求
import { request } from "@/network/request";

export default {
  name: 'head-com',
  data() {
    let pwdValidator = (rule, value, callback)=>{
      window.console.log(value)
      let reg = /[0-9A-Za-z]$/
      if (!reg.test(value)) {
        callback(new Error("密码为字母数字组成"))
      } else {
        callback()
      }
    }
    return {
      changeDialog:false,
      pwdForm:{
        oldPwd:null,
        newPwd:null,
        againPwd:null
      },
      pwdFormRules:{
        oldPwd:[
          {required: true, message: '请输入密码', trigger: 'blur'},
          {max:16,min:8,message:"长度为8-16位",trigger:'blur'},
          {validator:pwdValidator,trigger:blur}
        ],
        newPwd:[
          {required: true, message: '请输入密码', trigger: 'blur'},
          {max:16,min:8,message:"长度为8-16位",trigger:'blur'},
          {validator:pwdValidator,trigger:blur}
        ],
        againPwd:[
          {required: true, message: '请再次输入密码', trigger: 'blur'},
          {validator:(rule, value, callback) =>{
            if (value !== this.pwdForm.newPwd) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
          },trigger: 'blur'}
        ]
      }
    }
  },
  components: {

  },
  methods:{
    handleCommand(command){
      switch (command) {
        case "loginOut":
          this.$msgbox({
            title: '确认登出',
            message: '是否确定登出',
            type:"warning",
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '返回',
          }).then(() => {
            request({
              url:"/account/exitLogon",
              method:"post"
            }).then(() => {
              // window.console.log(res,this.$router);
              this.$router.replace("/login")
            }).catch((err) => {
              window.console.log(err);
            });
          }).catch(err =>{
            window.console.log(err)
          })
          break;
        case "changePwd":
          this.changeDialog = true
          break;
        default:
          break;
      }
    },

    //表单操作
    closeDrawer(){//清空表单
      // 首先清空表单，然后关闭drawer
      this.$refs['pwdForm'].resetFields()
      for (const key in this.pwdForm) {
        this.pwdForm[key] = null
      }
      this.changeDialog = false
    },
    submit(){//提交表单
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('handleLoding')
          request({
            url:"",
            method:"post",
            data:{
              user:this.addForm.user,
              pass:this.addForm.pass,
              pass_md5:this.$md5(this.addForm.pass),
            }
          }).then(res => {
          this.$message({
            message: res.data.respond,
            type: 'success'
          });
          //成功后刷新
          this.closeDrawer.call(this)
        }).catch(err =>{
          window.console.log(err)
        }).finally(()=>{
          this.$store.commit('handleLoding')
        })
        }
      })
    }
  }
}
</script>

<style scoped>
.head-com{
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  line-height: 50px;
}
.head-com>div{
  flex-grow: 1;
}
.head-title{
  font-size: 20px;
  color: #000000;
}
.head-control{
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
}
/* 输入框样式 */
.el-input{
  margin:0;
}
</style>
