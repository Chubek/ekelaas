import store from "../../store";

export default (to, from, next) => {
  if (store.getters.getSchoolIsLoggedIn) {
    next();
  } else {
    next("/login");
  }
};
