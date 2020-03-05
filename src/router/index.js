//导入基本的依赖
import Vue from "vue"
import vueRouter from "vue-router"

//导入页面组件
//职工管理
const PerMan = () => import("views/staff/PerMan")
const DivMan = () => import("views/staff/DivMan")
const PosMan = () => import("views/staff/PosMan")
// 考勤管理
const CommonCheck = () => import("../views/check/checkRule/CheckMan.vue")
const FreeCheck = () => import("../views/check/checkRule/FreeCheck.vue")
const Single = () => import("../views/check/reportForms/Single.vue")
const Department = () => import("../views/check/reportForms/Department.vue")
const TeamMan = () => import("../views/check/teamGroup/TeamMan.vue")
//账户管理
const AccountMan = () => import("../views/account/AccountMan.vue")
//设备管理
const FaceDevice = () => import("../views/device/Face.vue")
const CarDevice = () => import("../views/device/Car.vue")

Vue.use(vueRouter)

let routes = [{
  path:"/",
  redirect:"/perMan"
},{
  path:"/perMan",
  component:PerMan
},{
  path:"/divMan",
  component:DivMan
},{
  path:"/posMan",
  component:PosMan
},{
  path:"/commonCheck",
  component:CommonCheck
},{
  path:"/freeCheck",
  component:FreeCheck
},{
  path:"/single",
  component:Single
},{
  path:"/department",
  component:Department
},{
  path:"/teamMan",
  component:TeamMan
},{
  path:"/accountMan",
  component:AccountMan
},{
  path:"/faceDevice",
  component:FaceDevice
},{
  path:"/carDevice",
  component:CarDevice
}]

const router = new vueRouter({
  routes,
  mode:"hash"
})

export default router