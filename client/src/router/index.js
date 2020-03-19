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
import RedirectToProfile from "../components/Utils/RedirectToProfile.vue";
import authGuard from "./authGuard";
import registerGuard from "./registerGuard";
import teacherGuard from "./teacherGuard";
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
    component: Register,
    beforeEnter: registerGuard
  },
  {
    path: "/login",
    name: "ورود",
    component: Login
  },
  {
    path: "/set/info",
    name: "ثبت اطلاعات",
    component: SetInfo,
    beforeEnter: authGuard
  },
  {
    path: "/set/info-student",
    name: " ثبت اطلاعات دانش آموزی",
    component: SetStudent,
    beforeEnter: authGuard
  },
  {
    path: "/set/info-teacher",
    name: " ثبت اطلاعات معلمی",
    component: SetTeacher,
    beforeEnter: authGuard
  },
  {
    path: "/set/info-course",
    name: " ثبت اطلاعات دوره",
    component: SetCourse,
    beforeEnter: teacherGuard
  },
  {
    path: "/set/class/:courseId",
    name: " ثبت اطلاعات کلاس",
    component: SetClass,
    beforeEnter: teacherGuard
  },
  {
    path: "/profile/:userId",
    name: " پروفایل کاربر",
    component: Profile
  },
  {
    path: "/logout",
    name: " خروج کاربر",
    component: Logout,
    beforeEnter: authGuard
  },
  {
    path: "/redirect/to/profile/:userId",
    name: " انتقال به کاربر",
    component: RedirectToProfile
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
