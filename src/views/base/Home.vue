<template>
  <div class="base-view">
    <el-container class="container">
      <el-aside width="70px" style="overflow:hidden;">
        <tab-control>
          <tab-control-item @click.native="tabConClick('staff')" 
            :class="{'tabConActive':navName == 'staff','is-disabled':isDisabled('staff')}">
            <img slot="img" src="~assets/imgs/tabControl/staff.png" alt="">
            <p slot="title">职工管理</p>
          </tab-control-item>
          <tab-control-item @click.native="tabConClick('check')" 
            :class="{'tabConActive':navName == 'check','is-disabled':isDisabled('check')}">
            <img slot="img" src="~assets/imgs/tabControl/check.png" alt="">
            <p slot="title">考勤管理</p>
          </tab-control-item>
          <tab-control-item @click.native="tabConClick('account')" 
            :class="{'tabConActive':navName == 'account','is-disabled':isDisabled('account')}">
            <img slot="img" src="~assets/imgs/tabControl/acc.png" alt="">
            <p slot="title">账户管理</p>
          </tab-control-item>
          <tab-control-item @click.native="tabConClick('device')"
            :class="{'tabConActive':navName == 'device','is-disabled':isDisabled('device')}">
            <img slot="img" src="~assets/imgs/tabControl/equi.png" alt="">
            <p slot="title">设备管理</p>
          </tab-control-item>
          <tab-control-item @click.native="tabConClick('wechat')"
            :class="{'tabConActive':navName == 'wechat','is-disabled':isDisabled('wechat')}">
            <img slot="img" src="~assets/imgs/tabControl/weiCart.png" alt="">
            <p slot="title">微信服务</p>
          </tab-control-item>
        </tab-control>
      </el-aside>
      <el-container>
        <el-header height="50px">
          <head-com/>
        </el-header>
        <el-container class="main-container">
          <el-aside width="200px" class="main-aside" :style="{width:navWidth+'px'}">
            <hide @hideClick="hideClick" v-show="navAside"/>
            <el-scrollbar style="height:100%;">
              <component :is="navName"></component>
            </el-scrollbar>
          </el-aside>
          <el-main class="main">
            <show @showClick="showClick" v-show="!navAside"/>
            <router-view/>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
    <!-- 自定义右键菜单 -->
    
  </div>
</template>

<script>
import tabControl from "@/components/common/tabControl/TabControl"
import tabControlItem from "@/components/common/tabControl/TabControlItem"
import staff from "views/navList/Staff"
import check from "views/navList/Check"
import account from "views/navList/Account"
import wechat from "views/navList/Wechat"
import device from "views/navList/Device"

import hide from "components/common/toggle/Hide"
import show from "components/common/toggle/Show"

import headCom from "./children/HeadCom"
export default {
  name: 'baseView',
  data() {
    return {
      navName:'staff',
      navAside:true,
      navWidth:200,
      limits:['staff','check','account','device','wechat'],
    }
  },
  components: {
    tabControl,
    tabControlItem,
    headCom,
    check,
    staff,
    account,
    wechat,
    device,
    hide,
    show
  },
  computed:{
    // isDisabled(){
    //   return (value)=>{
    //     this.limits.indexOf(value) === -1
    //     window.console.log(value,this.limits.indexOf(value))
    //   }
    // }
  },
  methods:{
    isDisabled(value){
      // window.console.log(value,this.limits.indexOf(value))
      return this.limits.indexOf(value) === -1
    },
    tabConClick(comName){
      this.navName = comName;
    },
    hideClick(boo){
      this.navAside = boo;
      this.navWidth = 0;
    },
    showClick(boo){
      this.navAside = boo;
      this.navWidth = 200;
    }
    /*
      设置按钮不可点击思路:
      判断后台发送的权限数组中是否有该条权限信息
      :class="{disabled:判断该数组中是否存在自己的值}"
      :class="{disabled:arr.indexOf('staff')==-1}"
      封装一个计算属性
      如果有的话就将这个按钮disabled掉，如果没有的话正常显示
      后端也必须做一些限制，不发送该用户没有的权限
    */
  },
}
</script>

<style scoped>
.base-view{
  width: 100%;
  height: 100%;
  position: relative;
}
.container{
  width: 100%;
  height: 100%;
  min-width: 1200px;
}

/* 设置头部标签的样式 */
.el-header{
  border-bottom: .5px solid #dcdcdc;
}
.main-aside{
  border-right: .5px solid #dcdcdc;
  overflow-x: hidden;
  position: relative;
  transition: width .5s;
}

.main-container{
  height: calc(100% - 50px) !important;
}
.main{
  padding: 0;
  position: relative;
}
.tabConActive{
  background-color: #495057;
}

.is-disabled{
  display: none;
}


</style>
