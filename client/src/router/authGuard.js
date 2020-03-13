import store from "../store";

export default (to, from, next) => {
  if (store.getters.getLoggedIn) {
    next();
  } else {
    next("/login");
  }
};
