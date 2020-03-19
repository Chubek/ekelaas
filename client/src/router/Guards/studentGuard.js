import store from "../../store";
const isStudent = store.getters.getUserType === "Student";
export default (to, from, next) => {
  if (store.getters.getLoggedIn && isStudent) {
    next();
  } else {
    next("/");
  }
};
