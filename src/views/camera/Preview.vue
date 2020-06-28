<template>
  <div id="preview">
    <title-bar>
      <span slot="title">监控预览</span>
      <span slot="control"></span>
    </title-bar>
    <search-bar>
      <span slot="control"></span>
    </search-bar>
    <!-- 插入监控iframe -->
  </div>
</template>

<script>
//组件
import titleBar from "components/common/titleBar/TitleBar";
import searchBar from "components/common/searchBar/SearchBar";

export default {
  name: "preview",
  data() {
    return {
     
    };
  },
  components: {
    titleBar,
    searchBar
  },

};
</script>

<style scoped>
#preview {
  width: 100%;
  height: 100%;
}
#pre-iframe{
  width: 100%;
  height: 100%;
}
</style>
