<template>
  <div class="car-man">
    <title-bar>
      <span slot="title">环保车辆管理</span>
      <span slot="control">
        <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
      </span>
    </title-bar>
    <search-bar>
      <span slot="control">
        <el-input style="width:200px;" v-model="searchForm.num"
          placeholder="根据车牌搜索" clearable></el-input>
        <el-input style="width:200px;" v-model="searchForm.name"
         placeholder="根据车主姓名搜索" clearable></el-input>
        <el-input style="width:200px;" v-model="searchForm.tel"
         placeholder="根据联系方式搜索" clearable></el-input>
        <el-button size="small" type="primary" @click="getCarData">搜索</el-button>
      </span>
    </search-bar>
    <el-scrollbar class="scrollbar">
       <el-table
        :data="carData"
        style="width: 100%"
        size="small"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="num"
          align="center"
          show-overflow-tooltip
          label="车牌号码">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          show-overflow-tooltip
          label="使用者姓名">
        </el-table-column>
        <el-table-column
          prop="tel"
          align="center"
          show-overflow-tooltip
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="remarks"
          align="center"
          show-overflow-tooltip
          label="备注信息">
        </el-table-column>
        <el-table-column
          prop="isFull"
          align="center"
          show-overflow-tooltip
          :formatter="formatFull"
          label="是否完善">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isFull" type="text">详细信息</el-button>
            <el-button v-else type="text" @click="handleCom(scope.row)">完善信息</el-button>
            <el-button style="color:#409EFF;" type="text" @click="editMsg(scope.row)">编辑</el-button>
            <el-button style="color:#F56C6C;" type="text" @click="delMsg(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页组件 -->
    <pagination :pageSize="pageSize" :allPage="allPage" :currIndex="currPage"
      @hanSiChange="hanSiChange" @hanCurrChange="hanCurrChange"></pagination>
    <!-- 新增功能 -->
    <el-drawer :visible.sync="addDrawer" 
      :with-header="false"
      :wrapper-closable="false"
      :close-on-press-escape="false">
      <div class="drawer-title">
        新增车牌识别设备
      </div>
      <el-scrollbar style="height:calc(100vh - 100px);">
        <div class="drawer-con">
          <el-form :model="addForm" :rules="addFormRule" ref="addForm" 
            label-width="7vw" label-position="right">
            <el-form-item label="车牌号码" prop="num">
              <el-input v-model="addForm.num" :disabled="submitType == 2"></el-input>
            </el-form-item>
            <el-form-item label="车主" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="tel">
              <el-input v-model="addForm.tel"></el-input>
            </el-form-item>
            <el-form-item label="备注信息" prop="remarks">
              <el-input v-model="addForm.remarks"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <div class="drawer-bottom">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="closeDrawer('addForm','addDrawer')">取消</el-button>
      </div>
    </el-drawer>
    <!-- 完善信息 -->
    <el-dialog custom-class="limit-dialog" 
      :visible.sync="completeDialog" 
      width="35%" top="50vh"
      :show-close="false"
      title="完善信息"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-scrollbar style="height:400px">
        <el-form :model="completeForm" :rules="completeFormRule" ref="completeForm" 
          label-width="8vw" label-position="right">
          <el-form-item label="车牌号" prop="license">
            <el-input class="complete-input" v-model="completeForm.license" disabled></el-input>
          </el-form-item>
          <el-form-item label="车牌颜色" prop="licenseColor">
            <el-select class="complete-input" v-model="completeForm.licenseColor" placeholder="请选择"
              clearable filterable>
              <el-option
                v-for="item in palteColor"
                :key="item.num"
                :label="item.str"
                :value="item.num">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆类型" prop="vehicleType">
            <el-select class="complete-input" v-model="completeForm.vehicleType" placeholder="请选择"
              clearable filterable>
              <el-option
                v-for="item in vehicleType"
                :key="item.num"
                :label="item.str"
                :value="item.num">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆识别码" prop="vin">
            <el-input class="complete-input" v-model="completeForm.vin"></el-input>
          </el-form-item>
          <el-form-item label="使用性质" prop="useCharacter">
            <el-select class="complete-input" v-model="completeForm.useCharacter" placeholder="请选择"
              clearable filterable>
              <el-option
                v-for="item in useNature"
                :key="item.num"
                :label="item.str"
                :value="item.num">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发动机号码" prop="engineNo">
            <el-input class="complete-input" v-model="completeForm.engineNo"></el-input>
          </el-form-item>
          <el-form-item label="车主" prop="onwer">
            <el-input class="complete-input" v-model="completeForm.onwer" disabled></el-input>
          </el-form-item>
          <el-form-item label="住址" prop="address">
            <el-input class="complete-input" v-model="completeForm.address"></el-input>
          </el-form-item>
          <el-form-item label="品牌型号" prop="model">
            <el-input class="complete-input" v-model="completeForm.model"></el-input>
          </el-form-item>
          <el-form-item label="注册日期" prop="registerDate">
            <el-date-picker
              class="complete-input"
              v-model="completeForm.registerDate"
              type="date"
              value-format="yyyy-MM-dd"
              format="yyyy-M-d"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发证日期" prop="issueDate">
            <el-date-picker
              class="complete-input"
              v-model="completeForm.issueDate"
              type="date"
              value-format="yyyy-M-d"
              format="yyyy-M-d"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="排放阶段" prop="emissionStandard">
            <el-select class="complete-input" v-model="completeForm.emissionStandard" placeholder="请选择"
              clearable filterable>
              <el-option
                v-for="item in emissionType"
                :key="item.num"
                :label="item.str"
                :value="item.num">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行驶证图片" prop="drivingLicenseImg">
           <div class="box" @click="openBower">
              <el-image style="width: 100%; height: 100%"
                :src="completeForm.drivingLicenseImg"
                fit="contain">
                <div slot="error" class="image-slot">
                  <i class="el-icon-plus"></i>
                </div>
                </el-image>
              <input @change="selectImg" accept=".jpg, .jpeg, .png" class="selectImg" type="file">
            </div>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      
      <span slot="footer">
        <el-button type="primary" @click="submitCom">提交</el-button>
        <el-button @click="closeDrawer('completeForm','completeDialog')">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import titleBar from "components/common/titleBar/TitleBar";
import searchBar from "components/common/searchBar/SearchBar";
import pagination from "components/common/pagination/Pagination";
//工具方法
import { print,handleRequest,transform } from "@/utils";
//网络请求
import { request } from "@/network/request";
export default {
  name: '',
  data() {
    let maxLen = (rule,val,callback)=> {
      if (val !== null) {
        if (val.length > 40) {
          callback(new Error('长度不能超过40'));
        } else {
          callback();
        }
      }
    }
    return {
      carData:[],
      //分页
      pageSize:10,
      allPage:0,
      currPage:1,
      submitType:1,
      //新增表单
      addDrawer:false,
      addForm:{
        id:null,
        num:null,
        name:null,
        tel:null,
        remarks:null,
        isFull:null
      },
      addFormRule:{
        num:[
          {required: true, message: '请输入车牌号', trigger: 'blur'},
          {validator:(rule,val,callback)=> {
            if (val != null) {
              if (val.length > 8) {
                callback(new Error('长度不能超过8位'));
              } else {
                callback();
              }
            }
          },trigger:'blur'}
        ],
        name:[
          {required: true, message: '请输入车主姓名', trigger: 'blur'},
          {validator:(rule,val,callback)=> {
            if (val != null) {
              if (val.length > 10) {
                callback(new Error('长度不能超过10位'));
              } else {
                callback();
              }
            }
          },trigger:'blur'}
        ],
        tel:[
          {validator:(rule,val,callback)=> {
            if (val != null) {
              if (val.length > 15) {
                callback(new Error('长度不能超过15位'));
              } else {
                callback();
              }
            }
          },trigger:'blur'}
        ],
      },
      //搜索表单
      searchForm:{
        num:null,
        name:null,
        tel:null
      },
      //完善信息dialog
      completeDialog:false,
      completeForm:{
        license:null,
        licenseColor:null,
        vehicleType:null,
        vin:null,
        useCharacter:null,
        engineNo:null,
        onwer:null,
        address:null,
        model:null,
        registerDate:null,
        issueDate:null,
        emissionStandard:null,
        drivingLicenseImg:null
      },
      completeFormRule:{
        license:[
          {required: true, message: '', trigger: 'blur'},
        ],
        licenseColor:[
          {required: true, message: '请选择车牌颜色', trigger: 'blur'},
        ],
        vehicleType:[
          {required: true, message: '请选择车辆类型', trigger: 'blur'},
        ],
        vin:[
          {required: true, message: '请输入汽车识别码', trigger: 'blur'},
          {validator:maxLen,trigger:'blur'}
        ],
        useCharacter:[
          {required: true, message: '请选择使用性质', trigger: 'blur'},
        ],
        engineNo:[
          {required: true, message: '请输入发动机号', trigger: 'blur'},
          {validator:maxLen,trigger:'blur'}
        ],
        onwer:[
          {required: true, message: '', trigger: 'blur'},
        ],
        address:[
          {required: true, message: '请输入住址', trigger: 'blur'},
          {validator:maxLen,trigger:'blur'}
        ],
        model:[
          {required: true, message: '请输入品牌型号', trigger: 'blur'},
          {validator:maxLen,trigger:'blur'}
        ],
        registerDate:[
          {required: true, message: '请选择注册日期', trigger: 'blur'},
        ],
        issueDate:[
          {required: true, message: '请选择发证日期', trigger: 'blur'},
        ],
        emissionStandard:[
          {required: true, message: '请选择排放阶段', trigger: 'blur'},
        ],
        drivingLicenseImg:[
          {required: true, message: '请上传行驶证图片', trigger: 'blur'},
        ]
      },
      emissionType:[],
      useNature:[],
      palteColor:[],
      vehicleType:[]
    }
  },
  components: {
    titleBar,
    searchBar,
    pagination
  },
  methods:{
    //获取车牌数据
    getCarData(){
      this.$store.commit('handleLoding');
      request({
        url:"/ysgkPlate/select",
        method:"post",
        data:{
          currentPage:this.currPage,
          pageSize:this.pageSize,
          license:this.searchForm.num,
          use_name:this.searchForm.name,
          tel:this.searchForm.tel
        }
      }).then((res) => {
        // print(res);
        this.carData = [];
        let {list,allCount} = handleRequest.call(this,res.data);
        this.allPage = allCount;
        list.forEach(ele => {
          this.carData.push({
            num:ele.license,
            name:ele.use_name,
            tel:ele.tel,
            isFull:ele.is_complete,
            remarks:ele.remarks
          });
        });
      }).catch((err) => {
        print(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
    //分页请求
    hanSiChange(val){//分页条数改变
      this.pageSize = val;
      this.getCarData.call(this);
    },
    hanCurrChange(val){//当前页改变
      this.currPage = val;
      this.getCarData.call(this);
    },

    /*
      表单操作
    */
    closeDrawer(form,dialog){
      // 首先清空表单，然后关闭drawer
      this.$refs[form].resetFields();
      for (const key in this[form]) {
        this[form][key] = null;
      }
      this[dialog] = false;
    },
    handleAdd(){//点击新增按钮
      this.addDrawer = true;
      this.submitType = 1;
    },
    submit(){
      //提交表单
      // 提交成功后应该关闭drawer，表单会自动清除
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('handleLoding');
          if (this.submitType === 1) {
            //执行注册
            request({
                url:"/ysgkPlate/insert",
                method:"post",
                data:{
                  license:this.addForm.num,
                  use_name:this.addForm.name,
                  remarks:this.addForm.remarks,
                  tel:this.addForm.tel
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
              this.getCarData.call(this);
              this.closeDrawer.call(this,'addForm','addDrawer');
            }).catch(err =>{
              print(err);
            }).finally(()=>{
              this.$store.commit('handleLoding');
            });
          } else if(this.submitType === 2){
            //执行修改
            request({
                url:"/ysgkPlate/update",
                method:"post",
                data:{  
                  license:this.addForm.num,
                  use_name:this.addForm.name,
                  remarks:this.addForm.remarks,
                  tel:this.addForm.tel
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
              this.getCarData.call(this);
              this.closeDrawer.call(this,'addForm','addDrawer');
            }).catch(err =>{
              print(err);
            }).finally(()=>{
              this.$store.commit('handleLoding');
            })
          }
        } else {
          return false;
        }
      });
    },

    /*
      表格操作
    */
    editMsg(row){//修改设备信息
      /*
        将值赋值给注册表单
        将drawer打开
      */
      this.submitType = 2;
      for (const key in this.addForm) {
        if (this.addForm.hasOwnProperty(key)) {
          this.addForm[key] = row[key]
        }
      }
      this.addDrawer = true;
    },
    delMsg(row){//删除车牌
      // print(row);
      this.$confirm('确定删除该账户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('handleLoding');
        request({
          url:"/ysgkPlate/delete ",
          method:"post",
          data:{
            license:row.num
          }
        }).then((res) => {
          let respond = handleRequest.call(this,res.data);
          if (respond !== false) {
            this.$message({
              message: respond,
              type: 'success'
            });
          }
          this.getCarData.call(this);
        }).catch((err) => {
          print(err);        
        }).finally(()=>{
          this.$store.commit('handleLoding');
        });
      }).catch(() => {
        
      });
    },
    formatFull(row){
      return row.isFull? '是' :'否';
    },

    /*
      完善车辆信息
    */
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
      transform(e.target.files[0],3072).then(res =>{
        this.completeForm.drivingLicenseImg = res;
      }).catch(err =>{
        this.$alert(err, '提示', {
          confirmButtonText: '确定',
        });
      })
    },
    getEmissionType(){//获取排放类型
      this.$store.commit('handleLoding');
      request({
        url:"/ysgkPlate/selectEmissionType",
        method:"post",
      }).then((res) => {
        // print(res);
        this.emissionType = [];
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          respond.forEach(ele => {
            this.emissionType.push({
              num:ele.typeNum,
              str:ele.typeStr
            });
          });
        }
      }).catch((err) => {
        print(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
    getUseNature(){//查询使用性质类型
      this.$store.commit('handleLoding');
      request({
        url:"/ysgkPlate/selectUseNature",
        method:"post",
      }).then((res) => {
        // print(res);
        this.useNature = [];
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          respond.forEach(ele => {
            this.useNature.push({
              num:ele.typeNum,
              str:ele.typeStr
            });
          });
        }
      }).catch((err) => {
        print(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
    getPalteColor(){//查询车辆颜色
      this.$store.commit('handleLoding');
      request({
        url:"/ysgkPlate/selectPalteColor",
        method:"post",
      }).then((res) => {
        // print(res);
        this.palteColor = [];
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          respond.forEach(ele => {
            this.palteColor.push({
              num:ele.typeNum,
              str:ele.typeStr
            });
          });
        }
      }).catch((err) => {
        print(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
    getVehicleType(){//查询车辆类型
      this.$store.commit('handleLoding');
      request({
        url:"/ysgkPlate/selectVehicleType",
        method:"post",
      }).then((res) => {
        // print(res);
        this.vehicleType = [];
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          respond.forEach(ele => {
            this.vehicleType.push({
              num:ele.typeNum,
              str:ele.typeStr
            });
          });
        }
      }).catch((err) => {
        print(err);
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    },
    handleCom(row){//点击补全信息
      this.completeForm.license = row.num;
      this.completeForm.onwer = row.name;
      this.completeDialog = true;
    },
    submitCom(){//提交信息
      this.$store.commit('handleLoding');
      request({
        url:"/ysgkPlate/supplement",
        method:"post",
        data:{
          license:this.completeForm.license,
          licenseColor:this.completeForm.licenseColor,
          vehicleType:this.completeForm.vehicleType,
          vin:this.completeForm.vin,
          useCharacter:this.completeForm.useCharacter,
          engineNo:this.completeForm.engineNo,
          onwer:this.completeForm.onwer,
          address:this.completeForm.address,
          model:this.completeForm.model,
          registerDate:this.completeForm.registerDate,
          issueDate:this.completeForm.issueDate,
          emissionStandard:this.completeForm.emissionStandard,
          drivingLicenseImg:this.completeForm.drivingLicenseImg
        }
      }).then((res) => {
        let respond = handleRequest.call(this,res.data);
        if (respond !== false) {
          this.$message({
            message: respond,
            type: 'success'
          });
        }
      }).catch((err) => {
        print(err);
        this.closeDrawer('completeForm','completeDialog');
      }).finally(()=>{
        this.$store.commit('handleLoding');
      });
    }
  },
  mounted(){
    this.getCarData.call(this);
    this.getEmissionType.call(this);
    this.getUseNature.call(this);
    this.getPalteColor.call(this);
    this.getVehicleType.call(this);
  }
}
</script>

<style scoped>
.car-man{
  width: 100%;
  height: 100%;
}
.scrollbar{
  width: 100%;
  height: calc(100% - 150px);
}
.complete-input{
  width: 250px;
}
/* 选择上传照片 */
.box{
  display: inline-block;
  width: 100px;
  height: 100px;
  background-color: #fff;
  position: absolute;
  overflow: hidden;
  margin-left: 5px;
}
</style>
