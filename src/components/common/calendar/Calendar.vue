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
      <span class="day-item" 
      v-for="(item,index) in days" :key="index+'c'"
      @click="saveTime(item,$event)">{{item}}</span>
      <span class="over" 
      v-for="(item,index) in end" :key="index+'n'"
      @click="nextMonth">{{item}}</span>
    </div>
    {{timestampArr}}
  </div>
</template>

<script>
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
    }
  },
  methods:{
    preMonth(){
      this.clearDayStyle();
      if (this.month<1) {
        this.year--
        this.month = 11;
      } else {
        this.month--;
      }
    },
    nextMonth(){
      this.clearDayStyle();
      if (this.month>=11) {
        this.year++
        this.month = 0
      } else {
        this.month++;
      }
    },
    updata(){
      //获取2月1号是周几
      this.begin = new Date(this.year,this.month,1).getDay();
      //计算出这一月多少天
      this.days = new Date(this.year,this.month+1,0).getDate();
      // window.console.log(this.year,this.month,this.days)
      //计算出末尾添加几个
      this.end = 42-this.begin-this.days;
    },
    saveTime(day,event){//保存时间戳
      let timestamp = new Date(this.year,this.month,day).getTime()/1000;
      let isSave = this.timestampArr.indexOf(timestamp)
      // window.console.log(timestamp,isSave)
      // window.console.log(event)
      if (isSave==-1) {
        this.timestampArr.push(timestamp)
        event.target.style.backgroundColor = "var(--brand-color)";
      } else {
        this.timestampArr.splice(isSave,1);
        event.target.style.backgroundColor = "";
      }
    },
    clearDayStyle(){//清除日历格上的样式
      if (this.timestampArr.length != 0) {
        let items = document.getElementsByClassName("day-item");
        for (let i of items) {
          i.style.backgroundColor = ""
        }
        this.timestampArr = [];
      }
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
}
.header{
  display: flex;
  height: 40px;
  width: 100%;
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
}
.over{
  color: #909399;
}
</style>
