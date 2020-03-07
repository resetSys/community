<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  // components: {
  //   home,
  //   login
  // },
}
</script>

<style>
@import "./assets/css/base.css";
#app{
  width:100%;
  height: 100%; 
  position: relative;
  background-color: #ffffff;
}
</style>
