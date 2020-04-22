let mixin = {
  data:function () {
    return {
    
    }
  },
  methods:{
    close(formName,dialog){//关闭注册抽屉
      /*
        首先清空表单，然后关闭drawer
      */
      this.$refs[formName].resetFields();
      for (let key in this[formName]) {
        this[formName][key] = null;
      }
      this[dialog] = false;
    },
  }
}

export {
  mixin
}