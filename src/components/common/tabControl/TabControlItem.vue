<template>
  <div class="tab-control-item">
    <slot name="img"></slot>
    <slot name="title"></slot>
  </div>
</template>

<script>
export default {
  name: 'tabControlItem',
  data() {
    return {

    }
  },
}
</script>

<style scoped>
.tab-control-item{
  height: 60px;
  width: 100%;
  padding: 5px 0;
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;
  display: inline-block;
}
.tab-control-item>img{
  height: 30px;
  width: auto;
}
.tab-control-item>p{
  color: #ffffff;
  font-size: 12px;
  display: inline-block;
  width: 100%;
}
</style>
