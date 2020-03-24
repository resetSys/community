<template>
  <div id="login" ref="login">
    <div class="login-title">考勤管理系统</div>
    <div class="form-wrap">
      <div class="f-w-content">
        <el-form :model="loginForm" :rules="loginFormRules" ref="loginForm">
          <el-form-item prop="user">
            <el-input v-model="loginForm.user" 
              placeholder="请输入用户名" 
              clearable 
              autofocus
              prefix-icon="el-icon-user">
            </el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input placeholder="请输入用户密码" 
              v-model="loginForm.pwd" 
              show-password 
              clearable
              prefix-icon="el-icon-lock">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submit" type="primary">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <footer class="footer"><a href="javascript:void(0)">郑州和光电子科技有限公司</a></footer>
  </div>
</template>

<script>
import { request } from "@/network/request";
import { handleRequest } from "@/utils";
export default {
  name: 'login',
  data() {
    return {
      loginForm:{
        user:"",
        pwd:""
      },
      loginFormRules:{
        user:[
          {required: true, message: '请输入名称', trigger: 'blur'},
          {max:40,min:2,message:"长度为2-40位",trigger:'blur'},
        ],
        pwd:[
          {required: true, message: '请输入密码', trigger: 'blur'},
          {max:16,min:8,message:"长度为8-16位",trigger:'blur'},
          {validator:(rule, value, callback)=>{
            let reg = /[0-9A-Za-z]$/
            if (!reg.test(value)) {
              callback(new Error("密码为字母数字组成"))
            } else {
              callback()
            }
          }}
        ]
      }
    }
  },
  components: {

  },
  methods:{
    submit:function(){
      // this.$router.replace('/home')
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          request({
          url:"account/logon",
          method:"post",
          data:{
            user:this.loginForm.user,
            pass_md5:this.$md5(this.loginForm.pwd)
          }
        }).then((result) => {
          // window.console.log(result)
          handleRequest.call(this,result.data)
        }).catch((err) => {
          window.console.log(err)
        }).finally(()=> {
          loading.close();
        })
        }
      })
    }
  },
  created(){
  },
  mounted(){
    //获取节点
    let time = setTimeout(() => {
      // this.$refs.login.style.backgroundSize = "auto"+" "+170+"%"
      this.$refs.login.style.backgroundSize = "110% 110%"
      window.clearTimeout(time)
    }, 100);
  }
}
</script>

<style scoped>
#login{
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  /* background-color: #fff; */
  background: url("~@/assets/imgs/login/cloud1.jpg") no-repeat center;
  background-size: 100% 100%;
  transition: background-size 5s ease-in-out;
}
.login-title{
  font-size: 30px;
  color: rgb(2, 2, 2);
}
.form-wrap::before{
  content: "";
  display: block;
  margin: 0 auto;
  width: 1px;
  margin-top: -30px;
  border: 15px solid transparent;
  border-right-width: 10px;
  border-left-width: 10px;
  border-bottom-color: rgb(255, 255, 255, .5);
}
.form-wrap{
  width: 430px;
  height: 320px;
  margin-top: 20px;
  border-radius: 10px;
  background-color: rgb(255, 255, 255, .5);
}
.f-w-content{
  width: 100%;
  height: 100%;
  padding: 20px 80px;
  box-sizing: border-box;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: center;
}
.el-form-item>>>.el-form-item__content{
  text-align: center;
}
.el-form-item__content{
  text-align: center;
}
.el-button{
  padding: 10px 80px;
  text-align: center;
}
/*自定义input样式*/
.input{
 width: 200px;
 height: 25px;
 line-height: 25px;
 /* border-radius: 5px; */
 
}
.input:focus{
  /* border-radius: 5px; */
  /* color: red; */
  /* border: 1px solid red; */
  transition: border .3s;
  transition: color .3s;
}

/* footer */
.footer{
  /* align-self: stretch; */
  position: absolute;
  bottom: 30px;
  bottom: 30px;
}
.footer>a{
  font-size: 12px;
  color: #000;
}
.footer>a:hover{
  color: #409EFF;
}
</style>
