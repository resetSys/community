<template>
  <div class="tab-control">
   <slot/>
  </div>
</template>

<script>
export default {
  name: 'tabControl',
}
</script>

<style scoped>
.tab-control{
  width: 100%;
  display: inline-block;
  height: 100%;
  background-color: #545c64;
}
</style>
