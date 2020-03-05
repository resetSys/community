<template>
  <div class="perMan">
    <title-bar>
      <span slot="title">员工管理</span>
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
        :data="perData"
        style="width: 100%"
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
          prop="tel"
          align="center"
          show-overflow-tooltip
          label="电话号码">
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
          label="企业微信id">
        </el-table-column>
        <el-table-column
          prop="job"
          align="center"
          show-overflow-tooltip
          label="职位">
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
          label="入职日期">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button style="color:#F56C6C;" type="text" 
            @click.native.prevent="deleteInfo(scope.row)">删除</el-button>
            <el-button style="color:#409EFF;" type="text" 
            @click.native.prevent="editInfo(scope.row)">编辑</el-button>
            <el-button style="color:#409EFF;" type="text" 
            @click.native.prevent="setAccess(scope.row)">权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 查看原图 -->
    <el-dialog :visible.sync="prePicDialog" width="30%" title="显示原图">
      <img :src="previewImg" alt="图片预览" class="preImg">
    </el-dialog>
    <!-- 显示权限信息 -->
    <el-dialog :visible.sync="setAccessDialog" width="70%"
      title="授权管理" custom-class="limit-dialog" :top="$store.state.dialogTop">
      <el-table :data="accessData" style="width:100%;" stripe>
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="timeFrame" label="时段" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.timeFrame.join()}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click.native.prevent="addTime(scope.row)">设置时段</el-button>
            <el-button type="text" style="color:#F56C6C;">删除权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 选择时段 -->
    <el-dialog :visible.sync="timeSelectDialog" width="390px"
      title="设置时段" custom-class="limit-dialog" :top="$store.state.dialogTop">
      <p class="time-select-title">*最多可设置三个时段</p>
      <el-time-picker
        is-range
        v-model="timeFrame1"
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
        v-model="timeFrame2"
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
        v-model="timeFrame3"
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
      :wrapper-closable="false"
      :close-on-press-escape="false">
      <div class="drawer-title">
        新增人员
      </div>
      <el-scrollbar style="height:calc(100vh - 100px);">
        <div class="drawer-con">
          <el-form :model="perForm" :rules="perFormRules" ref="perForm" label-width="5vw" label-position="right">
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
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="电话号码" prop="tel">
              <el-input v-model="perForm.tel"></el-input>
            </el-form-item>
            <el-form-item label="住址" prop="address">
                <distpicker @selected="onSelected" />
            </el-form-item>
            <el-form-item label="职位" prop="job">
              <el-input v-model="perForm.job"></el-input>
            </el-form-item>
            <el-form-item label="照片" prop="picture" style="position:relative;height:250px;">
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
        <el-button @click="closeDrawer">取消</el-button>
      </div>
    </el-drawer>
    <!-- 
    编辑人员信息使用注册时的drawer，限制某些信息无法修改 
    首先将该人员的信息赋值给注册的表单，将表单的某些选项设置为disabled
    -->
  </div>
</template>

<script>
import titleBar from "components/common/titleBar/TitleBar"
import searchBar from "components/common/searchBar/SearchBar"

import distpicker from "v-distpicker"

import {transform} from "@/utils"
export default {
  name: 'perMan',
  data() {
    return {
      perData:[{
        id:1,
        name:"小张小张",
        sex:"男",
        birth:156789403824,
        tel:15993319192,
        address:"河南省开封市尉氏县",
        weChatId:0,
        job:"技术员",
        picture:"//img.alicdn.com/bao/uploaded/http://img.alicdn.com/bao/uploaded/i2/263817957/O1CN01p9Wxlt28eM4EkG6Va_!!0-item_pic.jpg_220x330Q90.jpg_.webp",
        enterDate:15689483728
      }],
      prePicDialog:false,
      previewImg:null,
      setAccessDialog:false,
      timeSelectDialog:false,
      timeFrame1:null,
      timeFrame2:null,
      timeFrame3:null,
      accessData:[{
        name:"权限一",
        timeFrame:["08:00-16:00","16:00-23:59","00:00-08:00"]
      },{
        name:"权限一",
        timeFrame:["08:00-16:00","16:00-23:59","00:00-08:00"]
      },{
        name:"权限一",
        timeFrame:["08:00-16:00","16:00-23:59","00:00-08:00"]
      },{
        name:"权限一",
        timeFrame:["08:00-16:00","16:00-23:59","00:00-08:00"]
      },{
        name:"权限一",
        timeFrame:["08:00-16:00","16:00-23:59","00:00-08:00"]
      },],
      sendTimeObj:{
        perId:null,
        deviceId:null,
        timeFrame:[]
      },
      addDrawer:false,
      perForm:{
        name:"",
        sex:"",
        birth:"",
        tel:"",
        address:"",
        job:"",
        picture:"",
        enterDate:null
      },
      perFormRules:{
        name:[
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        sex:[
          {required: true, message: '请选择性别', trigger: 'blur'}
        ],
        birth:[
          {required: true, message: '请选择出生日期', trigger: 'blur'}
        ],
        tel:[
          {required: true, message: '请输入手机号码', trigger: 'blur'}
        ],
        address:[
          {required: true, message: '请选择家庭住址', trigger: 'blur'}
        ],
        picture:[
          {required: true, message: '请选择照片', trigger: 'blur'}
        ]
      },
    }
  },
  components:{
    titleBar,
    searchBar,
    distpicker
  },
  methods:{
    deleteInfo(row){//删除
      window.console.log(row)
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        
      }).catch(() => {});
    },
    editInfo(row){//更改
      window.console.log(row)
      //将值赋值给注册表单
      for (let item in this.perForm) {
        this.perForm[item] = row[item]
      }
      this.addDrawer = true
    },
    setAccess(row){//授权
      window.console.log(row)
      this.setAccessDialog = true
      this.sendTimeObj.perId = row.id;
    },
    previewPicture(picture){//图片预览
      this.previewImg = picture;
      this.prePicDialog = true;
    },
    timeChange(){//当点击时间选择器确定按钮
      this.sendTimeObj.timeFrame = this.timeFrame1.concat(this.timeFrame2,this.timeFrame3);
    },
    sendTime(){//向后台发送人员id 设备id 限制时间
      window.console.log(this.sendTimeObj)
    },
    //添加时间段思路:
    /*
      1、点击表格中权限按钮，根据个人唯一标识触发请求，请求出个人的授权设备和授权时段
      2、点击添加时段，先判断时段是否等小于三个，否，则弹出时间选择器，选择时间后将时间数组保存
      3、选择完时间后，将该人员标识 设备标识 添加的时段发送给后台
      4、发送成功后执行第二步操作，刷新人员数据
    */
    addTime(row){//添加规则时段
      window.console.log(row)
      this.timeSelectDialog = true
      this.sendTimeObj.deviceId = row.name;
    },
    submit(){//提交表单
      // 提交成功后应该关闭drawer，表单会自动清除
      this.$refs['perForm'].validate((valid) => {
        if (valid) {
          window.alert('submit!');
          window.console.log(this.perForm)
          // 当提交成功后再清空表单
          // this.closeDrawer.call(this)
        } else {
          return false;
        }
      });
    },
    closeDrawer(){//关闭注册抽屉
      // 首先清空表单，然后关闭drawer
      this.$refs['perForm'].resetFields()
      for (let key in this.perForm) {
        this.perForm[key] = null
      }
      this.addDrawer = false
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
      transform(e.target.files[0],1024).then(res =>{
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
  },
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
  height: calc(100% - 100px);
}

.box{
  display: inline-block;
  width: 200px;
  height: 200px;
  background-color: #fff;
  position: absolute;
  top: 50px;
  left: -40px;
  overflow: hidden;
}

</style>
