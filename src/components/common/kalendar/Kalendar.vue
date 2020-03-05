<template>
  <div class="kalender">
    <!-- 
    封装一个日期选择器
    根据 年 月 获取日
    选择年 选择月 根据年月生成日 遍历出来
    选择好后，调用转换时间戳的方法发送给后台
     -->
    <div class="left">
      <p class="title">选择年份</p>
      <el-select v-model="year" filterable placeholder="请选择年"
        @change="timeChange">
        <el-option
          v-for="(item,index) in yearArr"
          :key="index"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>

      <p class="title">选择月份</p>
      <el-select v-model="month" filterable placeholder="请选择月"
        @change="timeChange">
        <el-option
          v-for="(item,index) in monthArr"
          :key="index"
          :label="item"
          :value="item">
        </el-option>
      </el-select>

    </div>
    <div class="center">
      <p class="title">选择天</p>
        <el-checkbox v-model="checkAll" @change="checkAllClick">全选</el-checkbox>
      <el-scrollbar style="height:120px;">
        <el-checkbox-group v-model="dayArr">
          <el-checkbox :label="item" v-for="item in days" :key="item"/>
        </el-checkbox-group>
      </el-scrollbar>
    </div>
    <div class="rigth">
      <el-button size="small" @click="formatTime">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      year:2020,
      yearArr:[{
        value:2020
      },{
        value:2021
      },{
        value:2022
      },{
        value:2023
      },{
        value:2024
      },{
        value:2025
      },{
        value:2026
      },{
        value:2027
      },{
        value:2028
      },{
        value:2029
      },],
      month:1,
      monthArr:12,
      dayArr:[],
      checkAll:false,
      format:[]
    }
  },
  computed:{
    days(){//获取月份的天数
      let dateObj = new Date(this.year,this.month,0)
      return dateObj.getDate()
    }
  },
  methods:{
    timeChange(){//当年和月发生变化
      this.dayArr = []
      this.checkAll = false
    },
    formatTime(){//对选择的日期进行转化
      this.format = [];
      for (let item of this.dayArr) {
        let dateObj = new Date(this.year,this.month-1,item);
        this.format.push(dateObj.getTime()/1000)
      }
      window.console.log(this.format)
    },
    checkAllClick(){//选择全部
      if (this.checkAll) {
        for (let i = 1; i <= this.days; i++) {
          this.dayArr.push(i)
        }
      } else {
        this.dayArr = []
      }
    }
  },
}
</script>

<style scoped>
.kalender{
  height: 180px;
  width: 400px;
  background-color: #dcdcdc;
}
.kalender>div{
  display: inline-block;
  height: 100%;
  vertical-align: top;
}
.left{
  width: 250px;
}
.center{
  width: 80px;
}
.rigth{
  width: 70px;
  line-height: 180px;
}
.title{
  padding: 3px 5px;
  font-size: 16px;
}
/* 设置selectbottom的padding */
.el-select-dropdown__list{
  padding-bottom:20px; 
}
/* 设置多选框中的选项 */
.el-checkbox-group>label{
  display: block;
}
</style>
