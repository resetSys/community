<template>
  <div class="wechat">
    <el-menu
      :default-openeds="['1']">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-caret-bottom"></i>
          <span>基础管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/home/infopush">
            <el-menu-item index="1-1">微信推送</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'wechat',
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
