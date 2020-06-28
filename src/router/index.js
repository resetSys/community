//导入基本的依赖
import Vue from "vue";
import vueRouter from "vue-router";

//导入页面组件
/*login*/
const Login = () => import("views/base/Login.vue")
/*home*/
const Home = () => import("views/base/Home.vue");
//职工管理
const PerMan = () => import("views/staff/PerMan");
const DivMan = () => import("views/staff/DivMan");
const PosMan = () => import("views/staff/PosMan");
const AccRecords = () => import("views/staff/AccRecords");
//访客管理
const VisitList = () => import("views/visit/VisitList");
const VisitRecord = () => import("views/visit/VisitRecord");
const VisitThread = () => import("views/visit/Thread");
const VisitConfig = () => import("views/visit/VisitConfig");
//考勤管理
const CommonCheck = () => import("../views/check/checkRule/CheckMan.vue");
const FreeCheck = () => import("../views/check/checkRule/FreeCheck.vue");
const Single = () => import("../views/check/reportForms/Single.vue");
const Department = () => import("../views/check/reportForms/Department.vue");
const TeamMan = () => import("../views/check/teamGroup/TeamMan.vue");
//账户管理
const AccountMan = () => import("../views/account/AccountMan.vue");
//设备管理
const FaceDevice = () => import("../views/device/Face.vue");
const CarDevice = () => import("../views/device/Car.vue");
//微信服务
const Infopush = () => import("../views/extend/Infopush.vue");
//车辆管理
const CarMan = () => import("../views/car/CarMan.vue");
const CarMan2 = () => import("../views/car/CarMan2.vue");
const CarRecord = () => import("../views/car/CarRecord.vue");
//视频监控
const Preview = () => import("../views/camera/Preview.vue");

Vue.use(vueRouter);

let routes = [{
  path:"/",
  redirect:"/login"
},{
  path:"/login",
  component:Login
},{
  path:"/home",
  component:Home,
  children:[
    {
      path:"/",
      redirect:"/home/perMan"
    },
    {
      path:"/home/perMan",
      component:PerMan
    },{
      path:"/home/divMan",
      component:DivMan
    },{
      path:"/home/posMan",
      component:PosMan
    },{
      path:"/home/accRecords",
      component:AccRecords
    },{
      path:"/home/commonCheck",
      component:CommonCheck
    },{
      path:"/home/freeCheck",
      component:FreeCheck
    },{
      path:"/home/single",
      component:Single
    },{
      path:"/home/department",
      component:Department
    },{
      path:"/home/teamMan",
      component:TeamMan
    },{
      path:"/home/accountMan",
      component:AccountMan
    },{
      path:"/home/faceDevice",
      component:FaceDevice
    },{
      path:"/home/carDevice",
      component:CarDevice
    },{
      path:"/home/infopush",
      component:Infopush
    },{
      path:"/home/carMan",
      component:CarMan
    },{
      path:"/home/carMan2",
      component:CarMan2
    },{
      path:"/home/carRecord",
      component:CarRecord
    },
    {
      path:"/home/visitRecord",
      component:VisitRecord
    },
    {
      path:"/home/visitList",
      component:VisitList
    },
    {
      path:"/home/visitThread",
      component:VisitThread
    },
    {
      path:"/home/visitConfig",
      component:VisitConfig
    },
    {
      path:"/home/preview",
      component:Preview
    }
  ]
}]

const router = new vueRouter({
  routes,
  mode:"hash"
})

export default router