<template>
  <div id="login">
    <div>aaaaaaaaaaaaaaa</div>
    <div class="form-wrap">
    
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {

    }
  },
  components: {

  }
}
</script>

<style scoped>
#login{
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgb(232, 240, 240);
}
.form-wrap::before{
  content: "";
  display: block;
  margin: 0 auto;
  width: 1px;
  margin-top: -30px;
  border: 15px solid transparent;
  border-right-width: 10px;
  border-left-width: 10px;
  border-bottom-color: rgb(0, 132, 255);
}
.form-wrap{
  width: 430px;
  height: 320px;
  margin-top: 20px;
  border-radius: 10px;
  background-color: rgb(0, 132, 255);
}
</style>
