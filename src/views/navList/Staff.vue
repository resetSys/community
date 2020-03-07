<template>
  <div class="staff">
    <el-menu
      :default-openeds="['1']">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-caret-bottom"></i>
          <span>基础管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/home/perMan">
            <el-menu-item index="1-1">员工管理</el-menu-item>
          </router-link>
          <router-link to="/home/divMan">
            <el-menu-item index="1-2">部门管理</el-menu-item>
          </router-link>
          <router-link to="/home/posMan">
            <el-menu-item index="1-3">职位管理</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'staff',
  data() {
    return {

    }
  },
}
</script>

<style scoped>
.el-menu{
  border: none;
}
.staff{
  width: 100%;
  height: 100%;
}
</style>
