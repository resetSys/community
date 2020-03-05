<template>
  <div class="hide" @click="showClick">
    <img src="~assets/imgs/toggle/show.png" alt="">
  </div>
</template>

<script>
export default {
  name: 'show',
  data() {
    return {

    }
  },
  methods:{
    showClick(){
      this.$emit("showClick",true)
    }
  }
}
</script>

<style scoped>
.hide{
  position: absolute;
  left: 0;
  top: 20px;
  width: 15px;
  height: 30px;
  z-index: 100;
  border-radius: 0 5px 5px 0;
  background-color: #c2c2c2;
}
.hide>img{
  width: 100%;
  height: 100%;
}
</style>
