<template>
  <div class="check">
    <el-menu :default-openeds="['1','2','3']">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-caret-bottom"></i>
          <span>考勤规则</span>
        </template>
        <el-menu-item-group>
          <router-link to="/commonCheck">
            <el-menu-item index="1-1">常规考勤</el-menu-item>
          </router-link>
          <router-link to="/freeCheck">
            <el-menu-item index="1-2">自由考勤</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-caret-bottom"></i>
          <span>考勤报表</span>
        </template>
        <el-menu-item-group>
          <router-link to="/single">
            <el-menu-item index="2-1">单人报表</el-menu-item>
          </router-link>
          <router-link to="/department">
            <el-menu-item index="2-2">部门报表</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-caret-bottom"></i>
          <span>考勤班组</span>
        </template>
        <el-menu-item-group>
          <router-link to="/teamMan">
            <el-menu-item index="3-1">班组管理</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'check',
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
