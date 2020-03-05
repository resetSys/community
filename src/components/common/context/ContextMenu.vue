<template>
  <div id="context_menu">
    <p>添加</p>
    <p>删除</p>
    <p>编辑</p>
  </div>
</template>

<script>
export default {
  name: 'context_menu',
  data() {
    return {

    }
  },
}
</script>

<style scoped>
/* 自定义右键菜单 */
#context_menu{
  position: absolute;
  width: 100px;
  height: 90px;
  background-color: #fff;
  top: 0;
  left: 0;
  z-index: 5;
  border: 1px solid #dcdcdc;
  box-shadow: 2px 2px 5px #dcdcdc;
  /* display: none; */
}
#context_menu>p{
  line-height: 30px;
  cursor: pointer;
  padding-left: 20px;
  box-sizing: border-box;
}
#context_menu>p:hover{
  background-color: #dcdcdc;
}
</style>
