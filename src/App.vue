<template>
  <div id="app">
    <base-view/>
  </div>
</template>

<script>
import baseView from "views/base/BaseView"

export default {
  name: 'app',
  components: {
    baseView
  }
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
