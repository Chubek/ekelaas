import store from "../store";
const isTeacher = store.getters.getUserType === "Teacher";
export default (to, from, next) => {
  if (store.getters.getLoggedIn && isTeacher) {
    next();
  } else {
    next("/");
  }
};
