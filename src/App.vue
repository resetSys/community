<template>
  <div id="app">
    <router-view></router-view>
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
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
