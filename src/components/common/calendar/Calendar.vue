<template>
  <div class="calendar">
    <header class="header">
      <span class="pre" @click="preMonth">《</span>
      <span class="year">{{year}}年{{formatMonth}}月</span>
      <span class="next" @click="nextMonth">》</span>
    </header>
    <div class="week">
      <span>日</span>
      <span>一</span>
      <span>二</span>
      <span>三</span>
      <span>四</span>
      <span>五</span>
      <span>六</span>
    </div>
    <div class="day">
      <span class="over" 
      v-for="(item,index) in begin" :key="index+'p'"
      @click="preMonth">{{31-begin+item}}</span>
      <span v-for="(item,index) in days" :key="index+'c'"
      :class="{'day-item':true,'is-active':isActive(item)}"
      @click="saveTime(item,$event)">{{item}}</span>
      <span class="over" 
      v-for="(item,index) in end" :key="index+'n'"
      @click="nextMonth">{{item}}</span>
    </div>
    <el-scrollbar class="scrollbar">
      <span class="ischeck" v-for="item in timestampArr" :key="item">
        {{item | changeTime(item)}}
        <span class="ischeck_clear" @click="deleteTime(item)">×</span>
      </span>
      <p v-if="timestampArr.length==  0">暂无数据...</p>
    </el-scrollbar>
  </div>

</template>

<script>
//工具
import { formatTime } from "@/utils";
export default {
  name: 'calendar',
  data() {
    return {
      year:null,
      month:null,
      days:null,//计算出这一月多少天
      begin:null,//获取1号的是周几
      end:null,
      timestampArr:[],//存储时间戳
    }
  },
  computed:{
    formatMonth(){
      return (this.month+1)>=10?this.month+1:"0"+(this.month+1);
    },
    isActive(){//判断时间戳数组中是否包含改时间戳
      /*
        如果包含则返回true，不包含则返回false
      */
      return (day)=> {
        // window.console.log("执行")
        let timestamp = new Date(this.year,this.month,day).valueOf();
        let index = this.timestampArr.findIndex((val)=> val===timestamp)
        if (index === -1) {
          return false
        }
        return true
      }
    }
  },
  methods:{
    preMonth(){//上一个月
      // this.clearDayStyle();用于单月选择清空数据
      if (this.month<1) {
        this.year--
        this.month = 11;
      } else {
        this.month--;
      }
    },
    nextMonth(){//下一个月
      // this.clearDayStyle();用于单月选择清空数据
      if (this.month>=11) {
        this.year++
        this.month = 0
      } else {
        this.month++;
      }
    },
    updata(){//获取初始日期
      //获取2月1号是周几
      this.begin = new Date(this.year,this.month,1).getDay();
      //计算出这一月多少天
      this.days = new Date(this.year,this.month+1,0).getDate();
      // window.console.log(this.year,this.month,this.days)
      //计算出末尾添加几个
      this.end = 42-this.begin-this.days;
    },
    saveTime(day){//保存时间戳
      /*
        思路:
        如果点击后数组中存在该数据，则提示已存在，如果不存在就添加
        动态绑定class
      */
      //这种可能出现问题
      // let timestamp = new Date(this.year,this.month,day).getTime();
      let timestamp = new Date(this.year,this.month,day).valueOf();
      //对长度进行限制
      if (this.timestampArr.length > 360) {
        this.$message({
          message:"所选不能超过一年",
          type:"warning"
        })
        return
      }
      let isSave = this.timestampArr.indexOf(timestamp)
      // window.console.log(timestamp,isSave)
      // window.console.log(event)
      if (isSave==-1) {
        this.timestampArr.push(timestamp)
        //排序
        this.timestampArr.sort((a,b) =>{
          return a- b;
        })
      } else {
        this.timestampArr.splice(isSave,1);
        // this.$message("已删除该日期");
      }
      /*
        日期更新后将数据发送到父组件
      */
      this.$emit('choseData',this.timestampArr);
    },
    clearDayStyle(){//清除所选日期及样式
      if (this.timestampArr.length != 0) {
        let items = document.getElementsByClassName("day-item");
        for (let i of items) {
          i.style.backgroundColor = ""
        }
        this.timestampArr = [];
      }
    },
    deleteTime(timestamp){//删除某一项
      /*
        参数:
        tiemstamp:要删除的时间戳
      */
      //找到tiemstamp下标进行截取
      let index = this.timestampArr.indexOf(timestamp)
      if (index!== -1) {
        this.timestampArr.splice(index,1);
      }
    },
  },
  filters:{
    changeTime(timestamp){//显示的时候转换格式
      return formatTime(timestamp,'Y/M/D')
    }
  },
  created(){
    //创建对象获取年月
    let dateObj = new Date();
    this.year = dateObj.getFullYear();
    this.month = dateObj.getMonth();
    this.updata.call(this)
  },
  updated(){
    this.updata.call(this)
  },
}
</script>

<style scoped>
.calendar{
  width: 350px;
  height:auto;
  display: inline-block;
  border: 1px solid var(--border-color);
  -webkit-user-select:none ;
  -moz-user-select:none;
  user-select: none;
}
.header{
  display: flex;
  height: 40px;
  width: 100%;
  color: #ffffff;
  align-items: center;
  background-color: var(--brand-color);
}
.header>span{
  flex-grow: 1;
  text-align: center;
  cursor: pointer;
}
.week{
  display: flex;
  height: 30px;
  align-items: center;
}
.week>span{
  flex-grow: 1;
  text-align: center;
}
.day{
  width: 100%;
  height: auto;
  display: inline-block;
}
.day>span{
  display: inline-block;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  cursor: pointer;
  background-color: #ffffff;
  transition: background-color .2s;
}
/*表示当前日期已经选择*/
.is-active{
  background-color:var(--brand-color) !important;
}
.over{
  color: #909399;
}
/* 显示已选中内容 */
.scrollbar{
  border-top: 1px solid var(--border-color);
  width: 100%;
  height: 50px;
}
.ischeck{
  position: relative;
  display: inline-block;
  width: 96px;
  height: 15px;
  line-height: 15px;
  text-align: center;
  background-color: var(--brand-color);
  color: #ffffff;
  border-radius: 5px;padding: 5px;
  overflow: hidden;
  white-space: nowrap;
  margin: 0 5px;
}
.ischeck_clear{
  position: absolute;
  right: 4px;
  font-weight: bold;
  transition: color .2s;
}
.ischeck_clear:hover{
  color: var(--delete-color);
}
</style>
