<template>
  <div class="account">
    <el-menu :default-openeds="['1']">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-caret-bottom"></i>
          <span>基础管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/accountMan">
            <el-menu-item index="1-1">账户管理</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'account',
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
