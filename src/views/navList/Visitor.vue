<template>
  <div class="visitor">
    <el-menu :default-openeds="['1']">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-caret-bottom"></i>
          <span>访客管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/home/visitList">
            <el-menu-item index="1-1">访客列表</el-menu-item>
          </router-link>
          <router-link to="/home/visitRecord">
            <el-menu-item index="1-2">访客记录</el-menu-item>
          </router-link>
          <router-link to="/home/visitThread">
            <el-menu-item index="1-3">当前访程</el-menu-item>
          </router-link>
          <router-link to="/home/visitConfig">
            <el-menu-item index="1-4">访客配置</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'visitor',
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
