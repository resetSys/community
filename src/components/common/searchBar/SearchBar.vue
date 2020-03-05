<template>
  <div class="searchBar">
    <slot name="control"></slot>
  </div>
</template>

<script>
export default {
  name: 'searchBar',
  data() {
    return {

    }
  },
}
</script>

<style scoped>
.searchBar{
  width: 100%;
  height: 50px;
  padding: 0 5px;
  line-height: 50px;
  text-align: right;
  box-sizing: border-box;
  background-color: #ffffff;
  border-bottom: .5px solid #dcdcdc;
}
</style>
