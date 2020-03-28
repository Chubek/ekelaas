import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VuePageTitle from "vue-page-title";

Vue.use(VuePageTitle, {
  // prefix: 'My App - ',
  suffix: "- ای‌کلاس "
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created: function() {
    if (localStorage.getItem("token") && this.$route.path != "/logout") {
      this.$store.dispatch("logInOnCreate");      
    } else if (
      localStorage.getItem("schoolToken") &&
      this.$route.path != "/logout-school"
    ) {
      this.$store.dispatch("schoolLogInOnCreate");      
    }
  }
}).$mount("#app");
