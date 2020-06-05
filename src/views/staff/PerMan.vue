<template>
  <div class="perMan">
    <title-bar>
      <span slot="title">员工管理</span>
      <span slot="control">
        <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
      </span>
    </title-bar>
    <search-bar>
      <span slot="control">
        <el-input v-model="searchForm.id"
          style="width:200px;"
          clearable
          placeholder="输入工号进行查询">
        </el-input>
        <el-input v-model="searchForm.name"
          style="width:200px;"
          clearable
          placeholder="输入姓名进行查询">
        </el-input>
        <el-input v-model="searchForm.idCard"
          style="width:200px;"
          clearable
          placeholder="输入身份证号进行查询">
        </el-input>
        <el-input v-model="searchForm.tel"
          style="width:200px;"
          clearable
          placeholder="输入手机号进行查询">
        </el-input>
        <!-- <el-input v-model="searchForm.branch"
          style="width:200px;"
          clearable
          placeholder="输入部门进行查询">
        </el-input> -->
        <el-cascader
          style="width:200px;margin-right:10px;"
          v-model="searchForm.branch"
          clearable 
          :options="branchs"
          placeholder="选择部门查询"
          :props="{
            value:'branch_id',
            label:'branch_name',
            checkStrictly: true
          }">
        </el-cascader>
        <el-button type="primary" @click="search">搜索</el-button>
      </span>
    </search-bar>
    <el-scrollbar class="scrollbar">
      <el-table
        :data="perData"
        style="width: 100%"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="jobNum"
          align="center"
          label="工号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="姓名"
          width="80">
        </el-table-column>
        <el-table-column
          prop="sex"
          align="center"
          label="性别"
          width="50px">
        </el-table-column>
        <el-table-column
          prop="birth"
          align="center"
          show-overflow-tooltip
          label="出生年月">
        </el-table-column>
        <el-table-column
          prop="nation"
          align="center"
          show-overflow-tooltip
          label="民族">
        </el-table-column>
        <el-table-column
          prop="tel"
          align="center"
          show-overflow-tooltip
          label="电话号码">
        </el-table-column>
        <el-table-column
          prop="idCard"
          align="center"
          show-overflow-tooltip
          label="身份证号">
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          show-overflow-tooltip
          label="住址">
        </el-table-column>
        <el-table-column
          prop="weChatId"
          align="center"
          show-overflow-tooltip
          label="消息推送ID">
        </el-table-column>
        <el-table-column
          prop="job"
          align="center"
          show-overflow-tooltip
          label="职位">
        </el-table-column>
        <el-table-column
          prop="branchName"
          align="center"
          show-overflow-tooltip
          label="部门">
        </el-table-column>
        <el-table-column
          align="center"
          width="70px"
          label="照片">
          <template slot-scope="scope">
            <el-image :src="scope.row.picture" 
              @click.native="previewPicture(scope.row.picture)"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="enterDate"
          align="center"
          show-overflow-tooltip
          :formatter="changeTime"
          label="入职日期">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button style="color:#F56C6C;" type="text" 
            @click.native.prevent="deleteInfo(scope.row)">删除</el-button>
            <el-button style="color:#409EFF;" type="text" 
            @click.native.prevent="edit(scope.row,'perForm','addDrawer')">编辑</el-button>
            <el-button style="color:#409EFF;" type="text" 
            @click.native.prevent="setAccess(scope.row)">权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页组件 -->
    <pagination :pageSize="pageSize" :allPage="allPage" :currIndex="currPage"
      @hanSiChange="hanSiChange" @hanCurrChange="hanCurrChange"></pagination>
    <!-- 查看原图 -->
    <el-dialog :visible.sync="prePicDialog" width="30%"
      custom-class="limit-dialog"
      title="显示原图" top="50vh"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <img :src="previewImg" alt="图片预览" class="preImg">
    </el-dialog>
    <!-- 显示权限信息 -->
    <el-dialog :visible.sync="setAccessDialog" width="70%"
      title="授权管理" custom-class="limit-dialog"
      :top="$store.state.dialogTop"
      style="overflow:hidden">
      <el-scrollbar style="height:40vh;">
        <el-table :data="accessData" style="width:100%;" stripe>
          <el-table-column
            prop="name" 
            label="名称" 
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="time" 
            label="时段" 
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="type" 
            label="类型" 
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="addTime(scope.row)">设置时段</el-button>
              <el-button type="text" style="color:#F56C6C;" 
                @click="deleteLimit(scope.row)">删除权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <div class="look-file-bottom">
        <el-button type="primary" @click="getLimitData">添加</el-button>
      </div>
    </el-dialog>
    <!-- 添加权限 -->
     <el-dialog custom-class="limit-dialog" 
      :visible.sync="bindLimitDialog" 
      width="70%" :top="$store.state.dialogTop"
      :show-close="false"
      title="添加权限"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <!-- <div class="addPerSearch">
        <el-input placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div> -->
      <el-scrollbar style="height:40vh;">
        <el-table
          :data="limitData"
          style="width: 100%"
          stripe
          @selection-change="handleSelectionChange"
          empty-text="暂无数据">
          <el-table-column
            type="selection"
            align="center"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            show-overflow-tooltip
            label="名称">
          </el-table-column>
          <el-table-column
            prop="type"
            align="center"
            show-overflow-tooltip
            label="类型">
          </el-table-column>
          <!-- <el-table-column
            prop="des"
            align="center"
            show-overflow-tooltip
            label="备注">
          </el-table-column> -->
        </el-table>
      </el-scrollbar>
      <!-- <pagination></pagination> -->
      <div class="look-team-bottom">
        <el-button type="primary" @click="submitLimit">提交</el-button>
        <el-button @click="bindLimitDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 选择时段 -->
    <el-dialog :visible.sync="timeSelectDialog" width="390px"
      title="设置时段" custom-class="limit-dialog"
      :top="$store.state.dialogTop">
      <p class="time-select-title">*最多可设置三个时段</p>
      <el-time-picker
        is-range
        v-model="timeFrame.timeFrame1"
        @change="timeChange"
        value-format="HH:mm:ss"
        format="HH:mm:ss"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围">
      </el-time-picker>
      <br/><br/>
      <el-time-picker
        is-range
        v-model="timeFrame.timeFrame2"
        @change="timeChange"
        value-format="HH:mm:ss"
        format="HH:mm:ss"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围">
      </el-time-picker>
      <br/><br/>
      <el-time-picker
        is-range
        v-model="timeFrame.timeFrame3"
        @change="timeChange"
        value-format="HH:mm:ss"
        format="HH:mm:ss"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围">
      </el-time-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="timeSelectDialog = false">取 消</el-button>
        <el-button type="primary" @click="sendTime">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增人员 -->
    <el-drawer :visible.sync="addDrawer" 
      :with-header="false"
      :wrapper-closable="$store.state.closeOnClickModal"
      :close-on-press-escape="$store.state.closeOnPresEscape">
      <div class="drawer-title">
        新增人员
      </div>
      <el-scrollbar style="height:calc(100vh - 100px);">
        <div class="drawer-con">
          <el-form :model="perForm" :rules="perFormRules" ref="perForm"
            label-width="7vw" label-position="right">
            <el-form-item label="工号" prop="jobNum">
              <el-input v-model="perForm.jobNum">
                <el-button slot="append" @click="getJobNum">生成</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="perForm.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select v-model="perForm.sex" placeholder="请选择">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="民族" prop="nation">
              <el-select v-model="perForm.nation" placeholder="请选择">
                <el-option v-for="(item,index) in nations" :key="index" 
                  :label="item" :value="item"/>
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
            <el-form-item label="入职日期" prop="birth">
              <el-date-picker
                v-model="perForm.enterDate"
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
            <el-form-item label="住址" prop="address">
              <!-- <distpicker @selected="onSelected" /> -->
              <!-- <el-cascader
                v-model="perForm.address"
                :options="citys"
                :props="{
                  value:'label',
                  label:'label'
                }">
              </el-cascader> -->
              <el-input v-model="perForm.address"></el-input>
            </el-form-item>
            <el-form-item label="职位" prop="job">
              <el-input v-model="perForm.job"></el-input>
            </el-form-item>
            <el-form-item label="部门">
              <!-- <el-input v-model="perForm.branchId"></el-input> -->
              <el-cascader
                v-model="perForm.branchId"
                :options="branchs"
                clearable
                :props="{
                  value:'branch_id',
                  label:'branch_name',
                  checkStrictly: true
                }">
              </el-cascader>
            </el-form-item>
            <el-form-item label="消息推送ID">
              <el-input v-model="perForm.weChatId"></el-input>
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
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="close('perForm','addDrawer')">取消</el-button>
      </div>
    </el-drawer>
    <!-- 
    编辑人员信息使用注册时的drawer，限制某些信息无法修改 
    首先将该人员的信息赋值给注册的表单，将表单的某些选项设置为disabled
    -->
  </div>
</template>

<script>
//组件
import titleBar from "components/common/titleBar/TitleBar";
import searchBar from "components/common/searchBar/SearchBar";
import pagination from "components/common/pagination/Pagination";

// import distpicker from "v-distpicker"
//工具
import { transform,handleRequest,formatTime,print } from "@/utils";
//网络请求
import { request } from "@/network/request";

export default {
  name: 'perMan',
  data() {
    return {
      perData:[],
      prePicDialog:false,//查看图片
      previewImg:null,
      setAccessDialog:false,
      timeSelectDialog:false,
      timeFrame:{
        timeFrame1:null,
        timeFrame2:null,
        timeFrame3:null,
      },
      accessData:[],//权限列表
      sendTimeObj:{
        perId:null,
        deviceId:null,
        timeFrame:null
      },
      addDrawer:false,//新增人员
      perForm:{
        id:null,
        idCard:"",
        weChatId:null,
        name:"",
        sex:"",
        birth:"",
        tel:"",
        address:"",
        jobNum:null,
        job:"",
        picture:"",
        enterDate:null,
        branchId:[],
        branchName:null,
      },
      perFormRules:{
        name:[
          {required: true, message: '请输入名称', trigger: 'blur'},
          {max:30,message: '请输入名称',trigger:'blur'}
        ],
        sex:[
          // {required: true, message: '请选择性别', trigger: 'blur'}
        ],
        birth:[
          // {required: true, message: '请选择出生日期', trigger: 'blur'}
        ],
        tel:[
          // {required: true, message: '请输入手机号码', trigger: 'blur'},
          {validator:(rule,val,callback)=> {
            let reg = /^1[3456789]\d{9}$/;
            if (!reg.test(val)) {
              callback(new Error('手机号格式不正确'))
            } else {
              callback();
            }
          },trigger:'blur'}
        ],
        idCard:[
          // {required: true, message: '请选择出生日期', trigger: 'blur'},
          {validator:(rule,val,callback)=> {
            let reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            if (!reg.test(val)) {
              callback(new Error('身份证号格式不正确'))
            } else {
              callback();
            }
          },trigger:'blur'}
        ],
        address:[
          // {required: true, message: '请选择家庭住址', trigger: 'blur'}
        ],
        picture:[
          {required: true, message: '请选择照片', trigger: 'blur'}
        ],
        jobNum:[
          {required: true, message: '请输入工号', trigger: 'blur'},
          {validator:(rule,val,callback)=> {
            let reg = /^[0-9]*$/;
            if (!reg.test(val)) {
              callback(new Error('只能是纯数字'));
            } else if(val.length > 20){
              callback(new Error('长度不能超过20'));
            } else {
              callback();
            }
          },trigger:'blur'}
        ]
      },
      citys:this.$store.state.citys,
      branchs:[],
      nations:this.$store.state.nations,
      //分页
      pageSize:10,
      allPage:0,
      currPage:1,
      submitType:1,//记录是编辑还是取消
      searchForm:{//搜索
        id:'',
        name:'',
        idCard:'',
        branch:'',
        tel:''
      },
      //添加权限
      bindLimitDialog:false,
      limitData:[],
      isSelectedLimit:[]//用户原则的id
    }
  },
  components:{
    titleBar,
    searchBar,
    // distpicker
    pagination
  },
  methods:{
    // 新增账户
    handleAdd(){
      this.addDrawer = true
      this.submitType = 1
    },
    getPersonData(){//获取人员数据
      this.$store.commit('handleLoding');
      let branchId = this.searchForm.branch.length== 0? null: this.searchForm.branch[this.searchForm.branch.length-1];
      // window.console.log(branchId)
      request({
        url:"/staff/select",
        method:"post",
        data:{
          currentPage:this.currPage,
          pageSize:this.pageSize,
          job_number:this.searchForm.id,
          staff_name:this.searchForm.name,
          id_card :this.searchForm.idCard,
          tel:this.searchForm.tel,
          branch_id:branchId
        }
      }).then((res) => {
        let { allCount,list } = handleRequest.call(this,res.data);
        this.allPage= allCount;
        this.perData = [];
        list.forEach(ele => {
          this.perData.push({
            id:ele.staff_id,
            name:ele.staff_name,
            sex:ele.sex,
            birth:ele.birth_date,
            tel:ele.tel,
            address:ele.address,
            weChatId:ele.send_id,
            job:ele.job,
            jobNum:ele.job_number,
            picture:ele.face,
            enterDate:ele.joined_date,
            idCard:ele.id_card,
            branchName:ele.branch_name,
            nation:ele.nation
          })
        });
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      });
    },
    getBrandData(){//获取所有的部门
      this.$store.commit('handleLoding')
      request({
        url:"/staff/selectBranch",
        method:"post",
      }).then((res) => {
        // print(res);
        this.branchs = res.data.respond;
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    deleteInfo(row){//删除
      // window.console.log(row)
      this.$confirm(`该操作将会删除人员信息以及人员出入记录，
      将会影响考勤的生成，请确保该人员无需生成考勤报表！该操作不会删除其在设备的权限，
      在删除人员前请确保删除其权限！`, '提示', {
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
          url:"/staff/delete",
          method:"post",
          data:{
            staff_id:row.id
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
    edit(row,formName,dialog){//编辑表格信息
      /*
        将表格中的信息循环赋值到表单中
      */
      this.submitType = 2;
      // this.submitType2 = 2;
      for (const key in this[formName]) {
        if (this[formName].hasOwnProperty(key)) {
          this[formName][key] = row[key]
        }
      }
      this[dialog] = true
    },
    submit(){//提交表单
      let branchId = null;
      if (this.perForm.branchId !== null && this.perForm.branchId !== undefined) {
        print(this.perForm.branchId);
        branchId = this.perForm.branchId.length== 0? null: this.perForm.branchId[this.perForm.branchId.length-1];
      }
      // 提交成功后应该关闭drawer，表单会自动清除
      this.$refs['perForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('handleLoding')
          if (this.submitType === 1) {
            //执行注册
            request({
                url:"/staff/insert",
                method:"post",
                data:{
                  job_number:this.perForm.jobNum,
                  staff_name:this.perForm.name,
                  sex:this.perForm.sex,
                  birth_date:this.perForm.birth,
                  tel:this.perForm.tel,
                  address:this.perForm.address,
                  send_id:this.perForm.weChatId,
                  job:this.perForm.job,
                  face:this.perForm.picture,
                  joined_date:this.perForm.enterDate,
                  id_card:this.perForm.idCard,
                  branch_id:branchId,
                  nation:this.perForm.nation,
                }
              }).then(res => {
                let respond = handleRequest.call(this,res.data);
                if (respond !== false) {
                  this.$message({
                    message: respond,
                    type: 'success'
                  });
                }
              //成功后刷新
              this.getPersonData.call(this)
              this.close.call(this,'perForm','addDrawer')
            }).catch(err =>{
              window.console.log(err)
            }).finally(()=>{
              this.$store.commit('handleLoding')
            })
          } else if(this.submitType === 2){
             request({
                url:"/staff/update",
                method:"post",
                data:{
                  staff_id:this.perForm.id,
                  job_number:this.perForm.jobNum,
                  staff_name:this.perForm.name,
                  sex:this.perForm.sex,
                  birth_date:this.perForm.birth,
                  tel:this.perForm.tel,
                  address:this.perForm.address,
                  send_id:this.perForm.weChatId,
                  job:this.perForm.job,
                  face:this.perForm.picture,
                  joined_date:this.perForm.enterDate,
                  id_card:this.perForm.idCard,
                  branch_id:branchId,
                  nation:this.perForm.nation,
                }
              }).then(res => {
                // print(res);
                let respond = handleRequest.call(this,res.data);
                if (respond !== false) {
                  this.$message({
                    message: respond,
                    type: 'success'
                  });
                }
                //成功后刷新
                this.getPersonData.call(this);
                this.close.call(this,'perForm','addDrawer');
            }).catch(err =>{
              window.console.log(err)
            }).finally(()=>{
              this.$store.commit('handleLoding')
            })
          }
        } else {
          return false;
        }
      });
    },
    getJobNum(){//自动生成工号
      this.$store.commit('handleLoding')
      request({
        url:"/staff/jobNumber",
        method:'get'
      }).then(res =>{
        let respond = handleRequest.call(this,res.data);
        this.perForm.jobNum = respond;
        // print(res);
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    previewPicture(picture){//图片预览
      this.previewImg = picture;
      this.prePicDialog = true;
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
    onSelected(data){//选择地址
      window.console.log(data)
      /**
        思路:
        当用户选择完地址后触发该事件，该对象循环添加到表单的属性中
        循环添加的时候需要判断时候又code属性，当为undefined的时候终止循环将值改为空
        每触发一次要将之前的值清空
      */ 
      this.perForm.address = ""
      for (const item in data) {
        // window.console.log(data[item])
        if (data[item].code == undefined) {
          //如果存在undefined的情况，就说明没有选择对
          this.perForm.address = ""
        } else {
          this.perForm.address+=(data[item].value)
        }
      }
      window.console.log(this.perForm.address)
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

    //分页请求
    hanSiChange(val){//分页条数改变
      // window.console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getPersonData.call(this)
    },
    hanCurrChange(val){//当前页改变
      // window.console.log(`当前页: ${val}`);
      this.currPage = val
      this.getPersonData.call(this)
    },
    /*
      根据条件查询
    */
    search(){
      this.currPage = 1
      this.getPersonData.call(this)
    },
    changeTime(row){//格式化表格数据
      return formatTime(row.enterDate,'Y-M-D')
    },
    /*
      设置时段操作
    */
    timeChange(){//当点击时间选择器确定按钮
      this.sendTimeObj.timeFrame = []
      //将不为空的数组进行拼接
      for (const key in this.timeFrame) {
        if (this.timeFrame.hasOwnProperty(key)) {
          if (this.timeFrame[key]) {
            // window.console.log(this.timeFrame[key])
            this.sendTimeObj.timeFrame = this.sendTimeObj.timeFrame.concat(this.timeFrame[key])
          }
        }
      }
    },
    sendTime(){//向后台发送人员id 设备id 限制时间
      // window.console.log(this.sendTimeObj)
      //对选择数据进行判断，如果为空不进行提交
      if (this.sendTimeObj.timeFrame) {
        this.$store.commit('handleLoding')
        request({
          url:"/staffPower/updatePower",
          method:"post",
          data:{
            staff_id:this.sendTimeObj.perId,
            device_id:this.sendTimeObj.deviceId,
            passtime:this.sendTimeObj.timeFrame.join()
          }
        }).then((res) => {
          // window.console.log(res)
          let respond = handleRequest.call(this,res.data)
          if (respond !== false) {
            this.$alert(respond, '提示', {
              confirmButtonText: '确定',
              dangerouslyUseHTMLString: true,
            });
          }
          //清空时间选择器
          for (const key in this.timeFrame) {
            if (this.timeFrame.hasOwnProperty(key)) {
              this.timeFrame[key] = null
            }
          }
          //关闭时间选择框，刷新绑定数据
          this.timeSelectDialog = false;
          this.setAccess.call(this,{id:this.sendTimeObj.perId});
        }).catch((err) => {
          print(err);
        }).finally(()=>{
          this.$store.commit('handleLoding')
        })
      } else {
        this.$message({
          message: '请选择时段',
          type: 'warning'
        });
      }
    },
    addTime(row){//添加规则时段
      // window.console.log(row)
      this.timeSelectDialog = true
      //将设备id存储用于编辑时段
      this.sendTimeObj.deviceId = row.id;
    },
    /*
      人员权限操作
    */
    setAccess(row){//点击权限按钮
      // window.console.log(row)
      this.setAccessDialog = true;
      //将人员id存储用于时段编辑
      this.sendTimeObj.perId = row.id;
      this.$store.commit('handleLoding');
      request({
        url:"/staffPower/selectOnPower",
        method:"post",
        data:{
          staff_id:row.id
        }
      }).then((res) => {
        print(res);
        let respond = handleRequest.call(this,res.data)
        this.accessData = [];
        if (respond !== false) {
          respond.forEach(ele => {
            this.accessData.push({
              id:ele.device_id,
              name:ele.device_name,
              time:ele.passtime,
              type:ele.type
            });
          });
        }
      }).catch((err) => {
        print(err);
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    getLimitData(){//获取该人员可以绑定的权限
      this.bindLimitDialog = true
      this.$store.commit('handleLoding')
      request({
        url:"/staffPower/selectUnPower",
        method:"post",
        data:{
          staff_id:this.sendTimeObj.perId
        }
      }).then((res) => {
        // print(res);
        this.limitData = [];
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          respond.forEach(ele => {
            this.limitData.push({
              id:ele.device_id,
              name:ele.device_name,
              type:ele.type
            });
          });
        }
      }).catch((err) => {
        print(err);
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    handleSelectionChange(val){//用户选择checkbox
      // window.console.log(val)
      this.isSelectedLimit = [];
      val.forEach(ele => {
        this.isSelectedLimit.push(ele.id)
      });
    },
    submitLimit(){//提交新增规则
      //对提交数据进行判断，如果为空则不提交
      // window.console.log(this.sendTimeObj.perId,this.isSelectedLimit)
      if (!this.isSelectedLimit.length == 0) {
        this.$store.commit('handleLoding')
        request({
          url:"/staffPower/insertPower",
          method:"post",
          data:{
             staff_id:this.sendTimeObj.perId,
             device_id:this.isSelectedLimit
          }
        }).then((res) => {
          /*
            提交成功后刷新绑定设备数据，关闭dialog
          */
          print(res);
          let respond = handleRequest.call(this,res.data);
          if (respond !== false) {
            this.$alert(res.data.respond, '提示', {
              confirmButtonText: '确定',
              dangerouslyUseHTMLString: true,
            });
          }
          //关闭时间选择框，刷新绑定数据
          this.bindLimitDialog = false;
          this.setAccess.call(this,{id:this.sendTimeObj.perId});
        }).catch((err) => {
          print(err);
        }).finally(()=>{
          this.$store.commit('handleLoding');
        })
      } else {
        this.$message({
          message: '请选择时段',
          type: 'warning'
        });
      }
    },
    deleteLimit(row){//删除绑定权限
      //  window.console.log(row)
      this.$confirm('您确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type:"warning"
      }).then(() => { 
        this.$store.commit('handleLoding');
        request({
          url:"/staffPower/deletePower",
          method:"post",
          data:{
            staff_id:this.sendTimeObj.perId,
            device_id:row.id,
          }
        }).then((res) =>{
          this.$alert(res.data.respond, '提示', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
          });
          this.bindLimitDialog = false;
          //刷新数据
          this.setAccess.call(this,{id:this.sendTimeObj.perId});
        }).catch(err =>{
          print(err);
        }).finally(()=>{
          this.$store.commit('handleLoding');
        })
      }).catch(() => {
      
      });
    },
  },
  mounted(){
    // this.getPersonData.call(this)
    this.getBrandData.call(this);
  }
}
</script>

<style scoped>
.perMan{
  width: 100%;
  height: 100%;
}
.preImg{
  width: 100%;
  height: auto;
}
.time-select-title{
  padding: 20px 0;
  text-align: center;
  color: #F56C6C;
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
}
/* 新增规则样式 */
.look-team-bottom,.look-file-bottom{
  width: 100%;
  height: auto;
  padding-top: 10px; 
  text-align: center;
}
</style>
