// 导入Vue库和App组件
import Vue from 'vue';
import App from './App.vue';
// 导入 Vue Router 实例
import router from './router/index.js';
// 导入Element UI样式文件
import 'element-ui/lib/theme-chalk/index.css';


// 导入Element UI库
import ElementUI from 'element-ui';
// 导入Vuex store实例
import store from './store';
// 导入axios库
import axios from 'axios';

import api from './api/index.js';

Vue.prototype.$api = api; 

// 关闭生产提示
Vue.config.productionTip = false;
// 使用Element UI库
Vue.use(ElementUI);

// 创建Vue实例
new Vue({
  // 将axios添加到Vue原型中，使得在组件中可以通过this.$axios使用
  axios,
  // 注入Vue Router实例
  router,
  // 注入Vuex store实例
  store,
  // 渲染根组件
  render: h => h(App),
}).$mount('#app'); // 将Vue实例挂载到id为app的DOM元素上
