import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Register from "../components/User/Register.vue";
import Login from "../components/User/Login.vue";
import SetInfo from "../components/User/SetInfo.vue";
import SetStudent from "../components/Student/SetStudent.vue";
import SetTeacher from "../components/Teacher/SetTeacher.vue";
import SetCourse from "../components/Course/SetCourse.vue";
import SetClass from "../components/Course/SetClass.vue";
import Profile from "../components/User/Profile.vue";
import Logout from "../components/User/Logout.vue";
//import authGuard from "./authGuard"
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/register",
    name: "ثبت نام",
    component: Register
  },
  {
    path: "/login",
    name: "ورود",
    component: Login
  },
  {
    path: "/set/info",
    name: "ثبت اطلاعات",
    component: SetInfo
  },
  {
    path: "/set/info-student",
    name: " ثبت اطلاعات دانش آموزی",
    component: SetStudent
  },
  {
    path: "/set/info-teacher",
    name: " ثبت اطلاعات معلمی",
    component: SetTeacher
  },
  {
    path: "/set/info-course",
    name: " ثبت اطلاعات دوره",
    component: SetCourse
  },
  {
    path: "/set/class",
    name: " ثبت اطلاعات کلاس",
    component: SetClass
  },
  {
    path: "/profile/:userId",
    name: " پروفایل کاربر",
    component: Profile
  },
  {
    path: "/logout",
    name: " خروج کاربر",
    component: Logout
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
