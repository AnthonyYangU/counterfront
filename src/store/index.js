import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    registerState:true,
    device:'',
    warningTable:[],
    tableData:[],
  },
  mutations: {
    updateRegisterState(state,data){
      state.registerState = data;
    },
    updateDevice(state,data){
      state.device = data
    },
    updateWarningTable(state,data){
      state.warningTable = data
    },
    updateTableData(state,data){
      state.tableData = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
