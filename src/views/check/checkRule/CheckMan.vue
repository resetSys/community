<template>
  <div class="check-man">
    <title-bar>
      <span slot="title">常规考勤</span>
      <span slot="control">
        <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
      </span>
    </title-bar>
    <search-bar>
      <span slot="control">
        <!-- <el-input size="small" style="width:200px;"></el-input>
        <el-button size="small" type="primary">搜索</el-button> -->
      </span>
    </search-bar>
    <el-scrollbar class="scrollbar">
      <el-table
        :data="fileData"
        style="width: 100%"
        size="small"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="id"
          align="center"
          show-overflow-tooltip
          label="ID">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          show-overflow-tooltip
          label="名称">
        </el-table-column>
        <el-table-column
          prop="des"
          align="center"
          show-overflow-tooltip
          label="备注">
        </el-table-column>
        
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="checkFile(scope.row)">编辑班段规则</el-button>
            <el-button type="text" @click="edit(scope.row,'addForm','addDrawer')">编辑</el-button>
            <el-button type="text" style="color:var(--delete-color)" @click="deleteFile(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页组件 -->
    <pagination :pageSize="pageSize" :allPage="allPage" :currIndex="currPage"
      @hanSiChange="hanSiChange" @hanCurrChange="hanCurrChange"></pagination>
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
            ref="addForm" label-width="7vw" label-position="right">
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="des">
              <el-input v-model="addForm.des"></el-input>
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
      width="90%" title="编辑班段规则" :top="$store.state.dialogTop"
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
            prop="start"
            align="center"
            show-overflow-tooltip
            label="上班打卡开始">
          </el-table-column>
          <el-table-column
            prop="end"
            align="center"
            label="打卡结束">
          </el-table-column>
          <el-table-column
            prop="isMorrow"
            align="center"
            label="是否跨天">
          </el-table-column>
          <el-table-column
            prop="lateTime"
            align="center"
            label="可迟到">
          </el-table-column>
          <el-table-column
            prop="lateTimeMax"
            align="center"
            label="最大迟到">
          </el-table-column>
          <el-table-column
            prop="printStart"
            align="center"
            label="下班打卡开始">
          </el-table-column>
          <el-table-column
            prop="pSIsMorrow"
            align="center"
            label="打卡开始是否跨天">
          </el-table-column>
          <el-table-column
            prop="printEnd"
            align="center"
            label="下班打卡结束">
          </el-table-column>
          <el-table-column
            prop="pSIsMorrow"
            align="center"
            label="打卡结束是否跨天">
          </el-table-column>
          <el-table-column
            prop="earlyPrintStart"
            align="center"
            label="可早退时长">
          </el-table-column>
          <el-table-column
            prop="earlyPrintStartMax"
            align="center"
            label="最大早退时长">
          </el-table-column>
          <el-table-column
            prop="manHour"
            align="center"
            label="工时">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button style="color:var(--brand-color);" type="text" 
                @click="handleMove(scope.row,1)">↑</el-button>
              <el-button style="color:var(--brand-color);" type="text"
                @click="handleMove(scope.row,2)">↓</el-button>
              <el-button style="color:var(--brand-color);" type="text" 
                @click="getDevice(scope.row)">绑定设备</el-button>
              <el-button style="color:var(--brand-color);" type="text"
                @click="edit(scope.row,'addRuleForm','addRuleDialog')">编辑</el-button>
              <el-button style="color:var(--delete-color);" type="text"
                @click="deleteRule(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <div class="look-file-bottom">
        <el-button type="primary" @click="handleAddRule">添加班段规则</el-button>
      </div>
    </el-dialog>
    <!-- 新增、编辑子集 -->
    <el-dialog custom-class="limit-dialog" 
      :visible.sync="addRuleDialog" 
      width="40%" :top="$store.state.dialogTop"
      style="overflow:hidden"
      :show-close="false"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <el-scrollbar style="height:40vh;">
        <el-form :model="addRuleForm" :rules="addRuleFormRule"
          ref="addRuleForm" label-width="5vw" label-position="top">

          <el-form-item label="名称" prop="name">
            <el-input class="rule-input" v-model="addRuleForm.name"></el-input>
          </el-form-item>

          <el-form-item label="上班打卡时间" prop="start">
             <el-time-picker
                class="rule-input"
                placeholder="打卡开始时间"
                value-format="H:m"
                v-model="addRuleForm.start">
              </el-time-picker>

              <el-input class="rule-input" v-model="addRuleForm.end"
              placeholder="提前打卡时长(分)"></el-input>

              <el-select class="rule-select" v-model="addRuleForm.isMorrow" placeholder="是否跨天">
                <el-option :value="false" label="当日"></el-option>
                <el-option :value="true" label="次日"></el-option>
              </el-select>
          </el-form-item>

          <el-form-item prop="lateTime">
            <el-input class="rule-input" v-model="addRuleForm.end"
              placeholder="打卡结束时长(分)"></el-input>
            <el-input class="rule-input" v-model="addRuleForm.lateTimeMax"
              placeholder="迟到宽容时长(分)"></el-input>
          </el-form-item>

          <el-form-item label="下班打卡时间" prop="printStart">
             <el-time-picker
                class="rule-input"
                placeholder="打卡开始时间"
                value-format="H:m"
                v-model="addRuleForm.printStart">
              </el-time-picker>
              <el-input class="rule-input" v-model="addRuleForm.earlyPrintStart"
                placeholder="提前打卡时长(分)"></el-input>
              <el-select class="rule-select" v-model="addRuleForm.pSIsMorrow" placeholder="是否跨天">
                <el-option :value="false" label="当日"></el-option>
                <el-option :value="true" label="次日"></el-option>
              </el-select>
          </el-form-item>

          <el-form-item prop="printEnd">
            <!-- <el-time-picker
              class="rule-input"
              placeholder="早退宽容时间"
              value-format="H:m"
              v-model="addRuleForm.earlyPrintStart">
            </el-time-picker> -->
            <el-input class="rule-input" v-model="addRuleForm.printEnd"
              placeholder="结束打卡时长(分)"></el-input>
            <!-- <el-time-picker
              class="rule-input"
              placeholder="最大早退时间"
              value-format="H:m"
              v-model="addRuleForm.earlyPrintStartMax">
            </el-time-picker> -->
            <el-input class="rule-input" v-model="addRuleForm.earlyPrintStartMax"
              placeholder="早退打卡时长(分)"></el-input>
          </el-form-item>

        </el-form>
      </el-scrollbar>
      <div class="add-rule-buttom">
        <el-button type="primary" @click="submitRule">确定</el-button>
        <el-button @click="close('addRuleForm','addRuleDialog')">取消</el-button>
      </div>
    </el-dialog>
    <!-- 绑定设备 -->
    <el-dialog custom-class="limit-dialog"
      :visible.sync="bindEquiDialog" width="30%"
      title="绑定设备" :top="$store.state.dialogTop"
      :close-on-press-escape="$store.state.closeOnPresEscape"
      :close-on-click-modal="$store.state.closeOnClickModal">
      <!-- 
        绑定设备思路
        签到和签退需要分别绑定，绑定的设备可以公用，但是绑定的不能共用
        还需要提示已经绑定的设备
       -->
      <p class="bind-title">人员签到设备:</p>
      <el-checkbox-group
        v-model="checkedDevice.signIn">
        <el-checkbox v-for="(item,index) in deviceData" :label="item.device_id" :key="index">{{item.device_name}}</el-checkbox>
      </el-checkbox-group>
      <p class="bind-title">人员签退设备:</p>
      <el-checkbox-group
        v-model="checkedDevice.signOut">
        <el-checkbox v-for="(item,index) in deviceData" :label="item.device_id" :key="index">{{item.device_name}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bindEquiDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitBindDevice">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//组件
import titleBar from "components/common/titleBar/TitleBar"
import searchBar from "components/common/searchBar/SearchBar"
import pagination from "components/common/pagination/Pagination"
//网络请求
import { request } from "@/network/request";
//工具
import { handleRequest,formatMinutes,formatHS } from "@/utils";

export default {
  name: 'checkMan',
  data() {
    return {
      fileData:[],
      addForm:{
        id:null,
        name:"",
        des:""
      },
      addFormRule:{
        name:[
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min:0, max:40, message:"长度限制40位", trigger:'blur'}
        ],
        des:[
          {min:0, max:400, message:"长度限制40位", trigger:'blur'}
        ]
      },
      addDrawer:false,
      ruleTable:[],
      addRuleForm:{
        parentId:null,
        id:null,
        name:'',
        start:null,
        end:null,

        isMorrow:false,
        lateTime:null,
        lateTimeMax:null,
        printStart:null,
        printEnd:null,

        pSIsMorrow:false,
        pEIsMorrow:false,
        earlyPrintStart:null,
        earlyPrintStartMax:null,
        manHour:null,

      },
      parentId:null,//存储考勤id
      addRuleFormRule:{
        name:[
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        start:[],
        lateTime:[],
        printStart:[],
        printEnd:[],
        earlyPrintStart:[],
        manHour:[]
      },
      lookFileDialog:false,
      addRuleDialog:false,
      //分页
      pageSize:20,
      allPage:0,
      currPage:1,
      submitType:1,//记录是注册还是修改
      submitType2:1,
      //绑定设备
      bindEquiDialog:false,
      deviceData:[],
      checkedDevice:{
        signIn:[],
        signOut:[]
      },
      ruleId:null,//存储本行id
    }
  },
  components: {
    titleBar,
    searchBar,
    pagination
  },
  methods:{
    /*
      规则集合思路:
      新增 打开表单注册信息，提交后清空
      编辑 将本行数据赋值给表单，用户修改后提交，提交成功后清空表单
      删除 用户点击删除按钮，给予提示
    */
    // 新增账户
    handleAdd(){
      this.addDrawer = true
      this.submitType = 1
    },
    submit(){//提交规则集合
      // window.console.log(this.addForm)
      // 提交成功后应该关闭drawer，表单会自动清除
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('handleLoding')
          if (this.submitType === 1) {
            //执行注册
            request({
                url:"/cowa/insertRoutineCowa",
                method:"post",
                data:{
                  cowa_name:this.addForm.name,
                  remarks:!this.addForm.des? "": this.addForm.des
                }
              }).then(res => {
                this.$message({
                  message: res.data.respond,
                  type: 'success'
                });
              //成功后刷新
              this.getCheckFile.call(this)
              this.close.call(this,'addForm','addDrawer')
            }).catch(err =>{
              window.console.log(err)
            }).finally(()=>{
              this.$store.commit('handleLoding')
            })
          } else if(this.submitType === 2){
            //执行修改
            request({
              url:"/cowa/updateRoutineCowa",
              method:"post",
              data:{
                cowa_id:this.addForm.id,
                cowa_name:this.addForm.name,
                remarks:!this.addForm.des? "": this.addForm.des
              }
            }).then(res => {
              window.console.log(res)
              this.$message({
                message: res.data.respond,
                type: 'success'
              });
              //成功后刷新
              this.getCheckFile.call(this)
              this.close.call(this,'addForm','addDrawer')
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
    handleAddRule(){//新增子集
      this.addRuleDialog = true
      this.submitType2 = 1
    },
    submitRule(){//提交规则子集
      this.$refs['addRuleForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('handleLoding')
          if (this.submitType2 == 1) {
            request({
              url:"/cowa/insertCowaRules",
              method:"post",
              data:{
                cowa_id:this.parentId,
                cowa_rules_name:this.addRuleForm.name,
                begin_start:formatMinutes(this.addRuleForm.start),
                begin_end:formatMinutes(this.addRuleForm.end),
                begin_end_nextDay:this.addRuleForm.isMorrow? true:false,
                begin_late_allow:formatMinutes(this.addRuleForm.lateTime),
                begin_late_max:formatMinutes(this.addRuleForm.lateTimeMax),
                closed_start:formatMinutes(this.addRuleForm.printStart),
                closed_end:formatMinutes(this.addRuleForm.printEnd),
                closed_start_nextDay:this.addRuleForm.pSIsMorrow? true:false,
                closed_end_nextDay:this.addRuleForm.pEIsMorrow? true:false,
                closed_early_allow:formatMinutes(this.addRuleForm.earlyPrintStart),
                closed_early_max:formatMinutes(this.addRuleForm.earlyPrintStartMax),
                man_hour:formatMinutes(this.addRuleForm.manHour)
              },
            }).then(res =>{
              window.console.log(res)
              let data = handleRequest(res.data);
              this.$message({
                message:data,
                type:'success'
              })
              //成功后刷新
              this.checkFile.call(this,{id:this.parentId})
              this.close.call(this,'addRuleForm','addRuleDialog')
            }).catch(err =>{
              window.console.log(err)
            }).finally(()=>{
              this.$store.commit('handleLoding')
            })
          } else if(this.submitType2 == 2) {
            request({
              url:"/cowa/updateCowaRules",
              method:"post",
              data:{
                cowa_rules_id:this.addRuleForm.id,
                cowa_rules_name:this.addRuleForm.name,
                begin_start:formatMinutes(this.addRuleForm.start),
                begin_end:formatMinutes(this.addRuleForm.end),
                begin_end_nextDay:this.addRuleForm.isMorrow? true:false,
                begin_late_allow:formatMinutes(this.addRuleForm.lateTime),
                begin_late_max:formatMinutes(this.addRuleForm.lateTimeMax),
                closed_start:formatMinutes(this.addRuleForm.printStart),
                closed_end:formatMinutes(this.addRuleForm.printEnd),
                closed_start_nextDay:this.addRuleForm.pSIsMorrow? true:false,
                closed_end_nextDay:this.addRuleForm.pEIsMorrow? true:false,
                closed_early_allow:formatMinutes(this.addRuleForm.earlyPrintStart),
                closed_early_max:formatMinutes(this.addRuleForm.earlyPrintStartMax),
                man_hour:formatMinutes(this.addRuleForm.manHour)
              },
              
            }).then(res =>{
              let data = handleRequest(res.data);
              this.$message({
                message:data,
                type:'success'
              })
              //成功后刷新
              this.checkFile.call(this,{id:this.parentId})
              this.close.call(this,'addRuleForm','addRuleDialog')
            }).catch(err =>{
              window.console.log(err)
            }).finally(()=>{
              this.$store.commit('handleLoding')
            })
          }
          
        }
      })
    },
    deleteFile(row){//删除
       // window.console.log(row)
      this.$confirm('您确定要删除该考勤集合吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type:"warning"
      }).then(() => {
        this.$store.commit('handleLoding')
        request({
          url:"/cowa/deleteRoutineCowa",
          method:"post",
          data:{
            cowa_id:row.id
          }
        }).then((res) =>{
          this.$message({
            type: 'success',
            message: res.data.respond,
          });
          //刷新数据
          this.getCheckFile.call(this)
        }).catch(err =>{
          window.console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        });       
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    deleteRule(row){//删除子集
      //  window.console.log(row)
      this.$confirm('您确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type:"warning"
      }).then(() => {
        this.$store.commit('handleLoding')
        request({
          url:"/cowa/deleteCowaRules ",
          method:"post",
          data:{
            cowa_id:row.parentId,
            cowa_rules_id:row.id
          }
        }).then((res) =>{
          this.$message({
            type: 'success',
            message: res.data.respond,
          });
          //刷新数据
          this.checkFile.call(this,{id:this.parentId})
        }).catch(err =>{
          window.console.log(err)
        }).finally(()=>{
          this.$store.commit('handleLoding')
        })
      }).catch(() => {
            
      });
    },
    //绑定设备
    getDevice(row){//获取绑定设备
      this.bindEquiDialog = true
      this.ruleId = row.id
      // window.console.log(row.id)
      this.$store.commit('handleLoding')
      request({
        url:"/cowa/selDutyDevice",
        method:"post",
        data:{
          cowa_rules_id:row.id,
        }
      }).then((res) => {
        window.console.log(res)
        let { all,on_duty,un_duty } = handleRequest(res.data);
        this.deviceData = all;
        this.checkedDevice.signIn = on_duty
        this.checkedDevice.signOut = un_duty
      }).catch((err) => {
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    submitBindDevice(){//提交绑定设备
       this.$store.commit('handleLoding')
       request({
        url:"/cowa/updateDutyDevice",
        method:"post",
        data:{
          cowa_rules_id:this.ruleId,
          on_duty:this.checkedDevice.signIn,
          un_duty:this.checkedDevice.signOut
        }
      }).then(res => {
        window.console.log(res)
        let msg =  handleRequest(res.data);
        this.$message({
          message: msg,
          type: 'success'
        });
        this.bindEquiDialog = false
      }).catch(e => {
        window.console.log(e)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    
    edit(row,formName,dialog){//编辑表格信息
      /*
        将表格中的信息循环赋值到表单中
      */
      this.submitType = 2;
      this.submitType2 = 2;
      for (const key in this[formName]) {
        if (this[formName].hasOwnProperty(key)) {
          this[formName][key] = row[key]
        }
      }
      this[dialog] = true
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
    //数据操作
    getCheckFile(){//获取考勤集合
      this.$store.commit('handleLoding')
      request({
        url:"/cowa/selectRoutineCowa",
        method:"post",
        data:{
          currentPage:1,
          pageSize:20
        }
      }).then(res =>{
        // window.console.log(res)
        let data = handleRequest(res.data);
        if (data !== false) {
          this.allPage = data.allCount;
          this.fileData = [];
          data.list.forEach(ele => {
            this.fileData.push({id:ele.cowa_id,name:ele.cowa_name,type:ele.cowa_type,des:ele.remarks})
          });
        }
      }).catch(err =>{
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    checkFile(row){//查看规则子集
      // window.console.log(row)
      this.parentId = row.id;
      this.lookFileDialog = true
      this.$store.commit('handleLoding')
      request({
        url:"/cowa/selectCowaRules",
        method:"post",
        data:{
          cowa_id:row.id
        }
      }).then(res =>{
        // window.console.log(res)
        this.ruleTable = []
        res.data.respond.forEach(ele => {
          this.ruleTable.push({
            parentId:ele.cowa_id,
            id:ele.cowa_rules_id,
            name:ele.cowa_rules_name,
            start:formatHS(ele.begin_start),
            end:formatHS(ele.begin_end),
            isMorrow:ele.begin_end_nextDay? '是': '否',
            lateTime:formatHS(ele.begin_late_allow),
            lateTimeMax:formatHS(ele.begin_late_max),
            printStart:formatHS(ele.closed_start),
            printEnd:formatHS(ele.closed_end),
            pSIsMorrow:ele.closed_start_nextDay? '是': '否',
            pEIsMorrow:ele.closed_end_nextDay? '是': '否',
            earlyPrintStart:formatHS(ele.closed_early_allow),
            earlyPrintStartMax:formatHS(ele.closed_early_max),
            manHour:formatHS(ele.man_hour)
          })
        });
        
      }).catch(err =>{
        window.console.log(err)
      }).finally(()=>{
        this.$store.commit('handleLoding')
      })
    },
    hanSiChange(val){//分页条数改变
      // window.console.log(`每页 ${val} 条`);
      this.pageSize = val
      // this.getAccData.call(this)
    },
    hanCurrChange(val){//当前页改变
      // window.console.log(`当前页: ${val}`);
      this.currPage = val
      // this.getAccData.call(this)
    },
    handleMove(row,key){//上移下移
      request({
        url:"/cowa/cowaRulesMove",
        method:"post",
        data:{
          moveType:key,
          cowa_id:row.parentId,
          cowa_rules_id:row.id
        }
      }).then((res) => {
        // window.console.log(res);
        let data = handleRequest.call(this,res.data)
        if (data !== false) {
          this.$message({
            type: 'success',
            message: data,
          });
        }
        this.checkFile.call(this,{id:row.parentId})
      }).catch((err) => {
        window.console.log(err)
      });
    },
  },
  mounted(){
    this.getCheckFile.call(this)
  },
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
/* 滚动区域 */
.scrollbar{
  height: calc(100% - 150px);
}
/* 新增规则表单样式 */
.rule-input{
  width: 200px;
}
.rule-select{
  width: 100px;
}
/* 绑定设备title */
.bind-title{
  padding:2px 0;
  font-size:14px;
  color: #303133;
}
</style>
