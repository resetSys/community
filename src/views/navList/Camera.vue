<template>
  <div class="camera">
    <el-menu :default-openeds="['1']">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-caret-bottom"></i>
          <span>基础管理</span>
        </template>
        <el-menu-item-group>
          <!-- <router-link to="/home/preview">
            <el-menu-item index="1-1">监控预览</el-menu-item>
          </router-link> -->
          <a href="./video.html" target="_blank">
            <el-menu-item index="1-1">监控预览</el-menu-item>
          </a>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'camera',
  data() {
    return {
    }
  },
}
</script>

<style scoped>
</style>
