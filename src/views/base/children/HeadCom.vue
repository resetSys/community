<template>
  <div class="head-com">
    <div class="head-title">考勤管理系统</div>
    <div class="head-control">控制系统</div>
  </div>
</template>

<script>
export default {
  name: 'head-com',
  data() {
    return {

    }
  },
  components: {

  }
}
</script>

<style scoped>
.head-com{
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  line-height: 50px;
}
.head-com>div{
  flex-grow: 1;
}
.head-title{
  font-size: 20px;
  color: #000000;
}
.head-control{
  text-align: right;
}
</style>
