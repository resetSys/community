<template>
  <div class="visitRecord">
    <title-bar>
      <span slot="title">访客列表</span>
      <span slot="control">
        <el-button type="primary" size="small">登记</el-button>
      </span>
    </title-bar>
    <search-bar>
      <span slot="control">
        <el-input size="small" style="width:200px;" placeholder="根据访客姓名和或手机号搜索"></el-input>
        <el-button size="small" type="primary">搜索</el-button>
      </span>
    </search-bar>
    <el-scrollbar class="scrollbar">
      <el-table
        :data="records"
        style="width: 100%"
        stripe
        empty-text="暂无数据">
        <el-table-column
          prop="name"
          align="center"
          label="访客姓名">
        </el-table-column>
        <el-table-column
          prop="sex"
          align="center"
          label="访客性别">
        </el-table-column>
        <el-table-column
          prop="phone"
          align="center"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="obj"
          align="center"
          label="访客对象">
        </el-table-column>
        <el-table-column
          prop="device"
          align="center"
          label="设备">
        </el-table-column>
        <el-table-column
          prop="photo"
          align="center"
          label="人脸抓拍">
        </el-table-column>
      </el-table>
    </el-scrollbar>
  </div>
</template>

<script>
//组件
import titleBar from "components/common/titleBar/TitleBar"
import searchBar from "components/common/searchBar/SearchBar"
export default {
  name: 'visitRecord',
  data() {
    return {
      records:[]
    }
  },
  components: {
    titleBar,
    searchBar,
  }
}
</script>

<style scoped>
</style>
