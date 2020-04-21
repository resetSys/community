<template>
  <div class="car">
    <el-menu :default-openeds="['1']">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-caret-bottom"></i>
          <span>考勤报表</span>
        </template>
        <el-menu-item-group>
          <router-link to="/home/carMan">
            <el-menu-item index="1-1">环保车辆管理</el-menu-item>
          </router-link>
          <router-link to="/home/carMan2">
            <el-menu-item index="1-2">员工车辆管理</el-menu-item>
          </router-link>
          <router-link to="/home/carRecord">
            <el-menu-item index="1-3">出入记录</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {

    }
  },
  components: {

  }
}
</script>

<style scoped>
</style>
