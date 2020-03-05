<template>
   <!-- Title bar for each page -->
  <div class="titleBar">
    <div class="barTitle"><slot name="title">标题栏</slot></div>
    <div class="barControl"><slot name="control">操作按钮</slot></div>
  </div>
</template>

<script>
export default {
  name: 'titleBar',
  data() {
    return {

    }
  },
}
</script>

<style scoped>
.titleBar{
  width: 100%;
  height: 50px;
  display: flex;
  padding: 0 5px 0 20px;
  box-sizing: border-box;
  border-bottom: .5px solid #dcdcdc;
  background-color: #ffffff;
}
.barTitle,.barControl{
  flex-grow: 1;
  line-height: 50px;
}
.barTitle{
  font-size: 18px;
  color: #000000;
}
.barControl{
  text-align: right;
}
</style>
