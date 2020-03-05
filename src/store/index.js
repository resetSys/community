import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    closeOnClickModal:false,
    closeOnPresEscape:false,
    dialogShowClose:false,
    dialogTop:"45vh"
  }
})
export default store