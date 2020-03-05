<template>
  <div class="hide" @click="hideClick">
    <img src="~assets/imgs/toggle/hide.png" alt="">
  </div>
</template>

<script>
export default {
  name: 'hide',
  data() {
    return {

    }
  },
  methods:{
    hideClick(){
      this.$emit("hideClick",false)
    }
  }
}
</script>

<style scoped>
.hide{
  position: absolute;
  right: 0;
  top: 20px;
  width: 15px;
  height: 30px;
  z-index: 100;
  border-radius: 5px 0 0 5px;
  background-color: #c2c2c2;
}
.hide>img{
  width: 100%;
  height: 100%;
}
</style>
