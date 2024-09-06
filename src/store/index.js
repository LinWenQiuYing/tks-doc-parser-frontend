import { createStore } from "vuex";

const copyText = {
  namespaced: true,
  state: {
    text:"",
  },
  mutations: {
     copy(state,value){
       state.text = value;
     }
  },
}

export default createStore({
  modules: {
    copyText,
  },
});