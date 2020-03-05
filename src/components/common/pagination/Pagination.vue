<template>
  <div class="pagination">
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currIndex"
      :page-sizes="[20, 50, 100, 200]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allPage">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'pagination',
  props:{
    /*
      接收父组件传过来的当前页，总页数
    */
    allPage:{
      type:Number,
      default:0,
      required:true
    },
  },
  data() {
    return {
      pageSize:20,
      currIndex:1
    }
  },
  components: {

  },
  methods:{
    /*
      将currindex和每页的条数传递给父组件
    */
    handleSizeChange(val) {
      // window.console.log(`每页 ${val} 条`);
      this.$emit('hanSiChange',val)
    },
    handleCurrentChange(val) {
      // window.console.log(`当前页: ${val}`);
      this.$emit('hanCurrChange',val)

    }
  }
}
</script>

<style scoped>
.pagination{
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  border-top: .5px solid var(--border-color);
  box-sizing: border-box;
}
.el-pagination{
  width: 100%;
  text-align: center;
}
.el-pagination>>>.el-pagination__sizes{
  float: left;
}
.el-pagination>>>.el-pagination__total{
  float: left;
}
.el-pagination>>>.el-pagination__jump{
  float: right;
}
</style>
