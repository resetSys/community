<template>
  <div class="visitList">
    <title-bar>
      <span slot="title">访客列表</span>
      <span slot="control">
        <el-button type="primary" size="small" @click="handleAdd">登记</el-button>
      </span>
    </title-bar>
    <search-bar>
      <span slot="control">
        <el-input size="small" v-model="searchForm.name" clearable
          style="width:200px;" placeholder="根据访客姓名搜索"></el-input>
        <el-input size="small" v-model="searchForm.tel"  clearable
          style="width:200px;" placeholder="根据访客手机号搜索"></el-input>
        <el-select v-model="searchForm.sex" placeholder="根据性别检索" clearable
          style="width:200px;margin-right:5px;">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
        <el-input size="small" v-model="searchForm.idCard" clearable
          style="width:200px;" placeholder="根据访客身份证号搜索"></el-input>
        <el-button size="small" type="primary" @click="getPersonData()">搜索</el-button>
      </span>
    </search-bar>
    <el-scrollbar class="scrollbar">
      <el-table
        :data="records"
        style="width: 100%"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="name"
          align="center"
          label="访客姓名">
        </el-table-column>
        <el-table-column
          prop="sex"
          align="center"
          label="访客性别">
        </el-table-column>
        <el-table-column
          prop="birth"
          align="center"
          label="出生日期">
        </el-table-column>
        <el-table-column
          prop="idCard"
          align="center"
          label="身份证号">
        </el-table-column>
        <el-table-column
          prop="tel"
          align="center"
          label="联系方式">
        </el-table-column>
        <el-table-column
          align="center"
          label="人脸照片">
          <template slot-scope="scope">
            <el-image style="height:50px;" fit="contain" :src="scope.row.picture"
              @click.native="previewPicture(scope.row.picture)"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button style="color:#F56C6C;" type="text" 
              @click.native.prevent="deletePerson(scope.row)">删除</el-button>
            <el-button style="color:#409EFF;" type="text" 
              @click.native.prevent="edit(scope.row,'perForm','addDrawer')">编辑</el-button>
            <el-button style="color:#409EFF;" type="text"
              @click="addThread(scope.row.id)">创建访程</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页组件 -->
    <pagination :pageSize="pageSize" :allPage="allPage" :currIndex="currPage"
      @hanSiChange="hanSiChange" @hanCurrChange="hanCurrChange"></pagination>
    <!-- 访客登记 -->
    <el-drawer :visible.sync="addDrawer" 
      :with-header="false"
      :wrapper-closable="$store.state.closeOnClickModal"
      :close-on-press-escape="$store.state.closeOnPresEscape">
      <div class="drawer-title">
        访客登记
      </div>
      <el-scrollbar style="height:calc(100vh - 100px);">
        <div class="drawer-con">
          <el-form :model="perForm" :rules="perFormRules" ref="perForm"
            label-width="7vw" label-position="right">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="perForm.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select v-model="perForm.sex" placeholder="请选择">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出生年月" prop="birth">
              <el-date-picker
                v-model="perForm.birth"
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="perForm.idCard"></el-input>
            </el-form-item>
            <el-form-item label="电话号码" prop="tel">
              <el-input v-model="perForm.tel"></el-input>
            </el-form-item>
            <el-form-item label="照片" prop="picture" style="position:relative;height:80px;">
              <div class="box" @click="openBower">
                <el-image style="width: 100%; height: 100%"
                  :src="perForm.picture"
                  fit="contain">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-plus"></i>
                  </div>
                  </el-image>
                <input @change="selectImg" accept=".jpg, .jpeg, .png" class="selectImg" type="file">
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <div class="drawer-bottom">
        <el-button type="primary" @click="submit()">提交</el-button>
        <el-button @click="close('perForm','addDrawer')">取消</el-button>
      </div>
    </el-drawer>
    <!-- 查看原图 -->
    <el-dialog :visible.sync="prePicDialog" width="30%"
      custom-class="limit-dialog"
      title="显示原图" top="50vh"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <img :src="previewImg" alt="图片预览" class="preImg">
    </el-dialog>
    <!-- 创建访程表单 -->
    <el-dialog :visible.sync="cTDialog" width="30%"
      custom-class="limit-dialog"
      title="创建访程" top="50vh"
      :show-close="false"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-form style="width:90%" :rules="threadFormRule" :model="threadForm" ref="threadForm"
        label-width="7vw" label-position="right">
        <el-form-item label="起始时间" prop="startTime">
          <el-date-picker
            v-model="threadForm.startTime"
            type="datetime"
            value-format="timestamp"
            disabled
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="threadForm.endTime"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="des">
          <el-input v-model="threadForm.des"></el-input>
        </el-form-item>
        <el-form-item label="授权设备" prop="deviceIds">
          <el-checkbox-group v-model="threadForm.deviceIds">
            <el-checkbox v-for="(item,index) in devices" :key="index"
              :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelThread">取 消</el-button>
        <el-button type="primary" @click="submitThread">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//组件
import titleBar from "components/common/titleBar/TitleBar";
import searchBar from "components/common/searchBar/SearchBar";
import pagination from "components/common/pagination/Pagination";
//工具
import { transform,handleRequest } from "@/utils";
//网络请求
import { request } from "@/network/request";

export default {
  name: 'visitList',
  data() {
    return {
      //访客数据
      records:[],
      //分页
      pageSize:10,//每页大小
      allPage:0,//总页数
      currPage:1,//当前页
      //搜索表单
      searchForm:{
        name:'',
        tel:'',
        sex:'',
        idCard:''
      },

      //人员登记
      addDrawer:false,
      //登记表单
      perForm:{
        id:null,
        name:"",
        sex:"",
        birth:null,
        idCard:"",
        tel:"",
        picture:"",
      },
      //登记表单规则
      perFormRules:{
        name:[
          {required: true, message: '请输入名称', trigger: 'change'},
          {max:30,message: '请输入名称',trigger:'change'}
        ],
        sex:[
          {required: true, message: '请选择性别', trigger: 'change'}
        ],
        tel:[
          {required: true, message: '请输入手机号码', trigger: 'cahnge'},
          {validator:(rule,val,callback)=> {
            let reg = /^1[3456789]\d{9}$/;
            if (!reg.test(val)) {
              callback(new Error('手机号格式不正确'))
            } else {
              callback();
            }
          },trigger:'change'}
        ],
        idCard:[
          {required: true, message: '请选择出生日期', trigger: 'change'},
          {validator:(rule,val,callback)=> {
            let reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            if (!reg.test(val)) {
              callback(new Error('身份证号格式不正确'))
            } else {
              callback();
            }
          },trigger:'change'}
        ],
        picture:[
          {required: true, message: '请选择照片', trigger: 'change'},
        ],
      },
      //提交类型
      submitType:1,
      
      //查看原图
      prePicDialog:false,
      previewImg:null,
      
      //创建访程
      cTDialog:false,
      devices:[],
      threadForm:{/*访程表单*/
        id:null,
        startTime:new Date().getTime(),
        endTime:null,
        des:'',
        deviceIds:[]
      },
      threadFormRule:{
        startTime:[
          {required: true, message: '请选择开始时间', trigger: 'change'},
        ],
        endTime:[
          {required: true, message: '请选择结束时间', trigger: 'change'},
        ],
        des:[
          {validator:(rule,val,callback)=> {
            if (val.length > 50) {
              callback(new Error('不能超过50个字符'));
            } else {
              callback();
            }
          },trigger:'change'}
        ],
        deviceIds:[]
      },
    }
  },
  components: {
    titleBar,
    searchBar,
    pagination
  },
  mounted(){
    this.getPersonData();
    this.getDevice();
  },
  methods:{
    //分页请求
    hanSiChange(val){//分页条数改变
      // window.console.log(`每页 ${val} 条`);
      this.pageSize = val
    },
    hanCurrChange(val){//当前页改变
      // window.console.log(`当前页: ${val}`);
      this.currPage = val
    },
    /**获取访客数据 */
    getPersonData(){
      this.$store.commit('handleLoding');
      request({
        url:"/visitor/select",
        method:"post",
        data:{
          currentPage:this.currPage,
          pageSize:this.pageSize,
          sex:this.searchForm.sex,
          name:this.searchForm.name,
          card_id:this.searchForm.idCard,
          tel:this.searchForm.tel
        }
      }).then((res) => {
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          this.records = [];
          this.allPage = respond.allCount;
          respond.list.forEach(ele => {
            this.records.push({
              id:ele.visitor_id,
              name:ele.name,
              sex:ele.sex,
              birth:ele.birth_day,
              idCard:ele.card_id,
              tel:ele.tel,
              picture:ele.face_img
            })
          });
        }
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      });
    },

    previewPicture(picture){//图片预览
      this.previewImg = picture;
      this.prePicDialog = true;
    },

    /**
      访客登记
     */
    //点击新增
    handleAdd(){
      this.submitType = 1;
      this.addDrawer = true;
    },
    openBower(){//伪触发file按钮
      let ie=navigator.appName=="Microsoft Internet Explorer" ? true : false; 
      if(!ie){ 
        document.getElementsByClassName("selectImg")[0].click(); 
      }else{
        let mouse=document.createEvent("MouseEvents");
        mouse.initEvent("click", true, true);  
        document.getElementsByClassName("selectImg")[0].dispatchEvent(mouse);
      } 
    },
    selectImg(e){//选择完成图片
      // window.console.log(e.target.files)
      transform(e.target.files[0],3072).then(res =>{
        // window.console.log(res)
        this.perForm.picture = res
      }).catch(err =>{
        this.$alert(err, '提示', {
          confirmButtonText: '确定',
          // callback: action => {
            
          // }
        });
      })
    },
    submit(){
      this.$refs['perForm'].validate((valid) => {
        if (valid) {
          if (this.submitType == 1) {
            //执行注册
            this.$store.commit('handleLoding');
            request({
              url:"/visitor/insert",
              method:"post",
              data:{
                name:this.perForm.name,
                sex:this.perForm.sex,
                birth_day:this.perForm.birth,
                card_id:this.perForm.idCard,
                tel:this.perForm.tel,
                face_img:this.perForm.picture
              }
            }).then((res) => {
              let respond = handleRequest.call(this,res.data);
              if (respond !== false) {
                this.$message({
                  message: respond,
                  type: 'success'
                });
                this.getPersonData.call(this);
                this.close.call(this,'perForm','addDrawer');
              }
            }).catch((err) => {
              window.console.log(err);
            }).finally(()=>{
              this.$store.commit('handleLoding');
            });
          } else {
            //执行更新
            this.$store.commit('handleLoding');
            request({
              url:"/visitor/update",
              method:"post",
              data:{
                visitor_id:this.perForm.id,
                name:this.perForm.name,
                sex:this.perForm.sex,
                birth_day:this.perForm.birth,
                card_id:this.perForm.idCard,
                tel:this.perForm.tel,
                face_img:this.perForm.picture
              }
            }).then((res) => {
              // window.console.log(res);
              let respond = handleRequest.call(this,res.data);
              if (respond !== false) {
                this.$message({
                  message: respond,
                  type: 'success'
                });
                this.getPersonData.call(this);
                this.close.call(this,'perForm','addDrawer');
              }
            }).catch((err) => {
              window.console.log(err);
            }).finally(()=>{
              this.$store.commit('handleLoding');
            });
          }
        }
      });
    },
    //关闭注册表单
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
    //删除人员
    deletePerson(row){//删除
      // window.console.log(row)
      this.$confirm("确定删除该人员吗?", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        /*
          发送请求
          刷新人员数据
        */
        this.$store.commit('handleLoding')
        request({
          url:"/visitor/delete",
          method:"post",
          data:{
            visitor_id:row.id
          }
        }).then((res) =>{
          let respond = handleRequest.call(this,res.data);
          if (respond !== false) {
            this.$message({
              message: respond,
              type: 'success'
            });
          }
          //刷新数据
          this.getPersonData.call(this)
        }).catch(err =>{
          window.console.log(err)
        }).finally(()=>{
          this.$store.commit('handleLoding')
        })
      }).catch(() => {
      
      });
    },
    //编辑信息
    edit(row,formName,dialog){//编辑表格信息
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

    //添加访程
    addThread(id){
      this.cTDialog = true;
      this.threadForm.id = id;
    },
    /**获取设备信息 */
    getDevice(){
      this.$store.commit('handleLoding');
      request({
        url:"/visitCurrent/selectSimpDevice",
        method:"post",
      }).then((res) => {
        this.devices = [];
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          respond.forEach(ele => {
            this.devices.push({
              id:ele.device_id,
              name:ele.device_name
            });
          });
        }
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
    /**提交访程信息 */
    submitThread(){
      this.$refs['threadForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('handleLoding');
          request({
            url:"/visitCurrent/insert",
            method:"post",
            data:{
              visitor_id:this.threadForm.id,
              st_time:this.threadForm.startTime,
              end_time:this.threadForm.endTime,
              why:this.threadForm.des,
              deviceIds:this.threadForm.deviceIds
            }
          }).then((res) => {
            // window.console.log(res);
            let respond = handleRequest.call(this,res.data);
            if (respond !== false) {
              this.$message({
                dangerouslyUseHTMLString:true,
                duration:0,
                showClose:true,
                message: respond,
                type: 'success'
              });
            }
            this.cancelThread();
          }).catch((err) => {
            window.console.log(err)
          }).finally(()=>{
            this.$store.commit('handleLoding');
          });
        }
      });
    },
    /**取消提交 */
    cancelThread(){
      this.threadForm.id=null;
      this.threadForm.startTime=null;
      this.threadForm.endTime=null;
      this.threadForm.des='';
      this.threadForm.deviceIds=[];
      this.$refs['threadForm'].resetFields();
      this.cTDialog = false;
    },
    /**获取默认可绑定的数据 */
    
  }
}
</script>

<style scoped>
.visitList{
  width: 100%;
  height: 100%;
}
/* 滚动区域 */
.scrollbar{
  height: calc(100% - 150px);
}
/* 表单input宽度 */
.el-input{
  width: 100%;
  margin-left: 0;
}
.el-select,.el-cascader{
  width: 100%;
}
.el-select>>>.el-input{
  margin-left: 0;
}
.el-cascader>>>.el-input{
  margin-left: 0;
  width: 100%;
}

.box{
  display: inline-block;
  width: 100px;
  height: 100px;
  background-color: #fff;
  position: absolute;
  overflow: hidden;
  margin-left: 5px;
  cursor: pointer;
}
/**图片预览 */
.preImg{
  width: 100%;
  height: auto;
}
</style>
