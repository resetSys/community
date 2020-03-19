<template>
  <div class="device">
    <el-menu :default-openeds="['1']">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-caret-bottom"></i>
          <span>基础管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/home/faceDevice">
            <el-menu-item index="1-1">人脸识别设备</el-menu-item>
          </router-link>
          <!-- <router-link to="/home/carDevice">
            <el-menu-item index="1-2">车牌识别设备</el-menu-item>
          </router-link> -->
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'device',
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
