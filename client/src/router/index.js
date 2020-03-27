import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import Register from "../components/User/Register.vue";
import Login from "../components/User/Login.vue";
import SetInfo from "../components/User/SetInfo.vue";
import SetStudent from "../components/Student/SetStudent.vue";
import SetTeacher from "../components/Teacher/SetTeacher.vue";
import EditTeacherInfo from "../components/Teacher/EditTeacherInfo.vue";
import EditStudentInfo from "../components/Student/EditStudentInfo.vue";
import SetCourse from "../components/Course/SetCourse.vue";
import SetClass from "../components/Course/SetClass.vue";
import Profile from "../components/User/Profile.vue";
import Logout from "../components/User/Logout.vue";
import LogoutSchool from "../components/School/LogoutSchool.vue";
import ProfileSchool from "../components/School/ProfileSchool.vue";
import RegisterSchool from "../components/School/RegisterSchool";
import LoginSchool from "../components/School/LoginSchool.vue";
import RedirectToProfile from "../components/Utils/RedirectToProfile.vue";
import EditCourseInfo from "../components/Course/EditCourseInfo.vue";
import authGuard from "./Guards/authGuard";
import registerGuard from "./Guards/registerGuard";
//import teacherGuard from "./Guards/teacherGuard";
//import studentGuard from "./Guards/studentGuard";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "خانه"
    }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    beforeEnter: registerGuard,
    meta: {
      title: "ثبت نام"
    }
  },
  {
    path: "/register-school",
    name: "RegisterSchool",
    component: RegisterSchool,
    beforeEnter: registerGuard,
    meta: {
      title: "ثبت نام"
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "ورود"
    }
  },
  {
    path: "/login-school",
    name: "LoginSchool",
    component: LoginSchool,
    meta: {
      title: "ورود"
    }
  },
  {
    path: "/set/info",
    name: "SetInfo",
    component: SetInfo,
    beforeEnter: authGuard,
    meta: {
      title: "ثبت اطلاعات کاربری"
    }
  },
  {
    path: "/set/info-student",
    name: "SetStudent",
    component: SetStudent,
    beforeEnter: authGuard,
    meta: {
      title: " ثبت اطلاعات دانش آموزی"
    }
  },
  {
    path: "/set/info-teacher",
    name: "SetTeacher",
    component: SetTeacher,
    beforeEnter: authGuard,
    meta: {
      title: " ثبت اطلاعات معلمی"
    }
  },
  {
    path: "/edit/info-student",
    name: "EditStudentInfo",
    component: EditStudentInfo,
    //beforeEnter: studentGuard
    meta: {
      title: " ویرایش اطلاعات دانش‌اموزی"
    }
  },
  {
    path: "/edit/info-teacher",
    name: "EditTeacherInfo",
    component: EditTeacherInfo,
    //beforeEnter: teacherGuard
    meta: {
      title: "ویرایش اطلاعات معلمی"
    }
  },
  {
    path: "/set/info-course",
    name: "SetCourse",
    component: SetCourse,
    //beforeEnter: teacherGuard
    meta: {
      title: "ثبت اطلاعات دوره"
    }
  },
  {
    path: "/edit/info-course/:courseId",
    name: "EditCourseInfo",
    component: EditCourseInfo,
    //beforeEnter: teacherGuard
    meta: {
      title: "ویرایش اطلاعات دوره"
    }
  },
  {
    path: "/set/class/:courseId",
    name: "SetClass",
    component: SetClass,
    //beforeEnter: teacherGuard,
    meta: {
      title: " ثبت اطلاعات کلاس"
    }
  },
  {
    path: "/profile/:userId",
    name: "Profile",
    component: Profile,
    meta: {
      title: "پروفایل کاربر"
    }
  },
  {
    path: "/profile-school",
    name: "ProfileSchool",
    component: ProfileSchool,
    meta: {
      title: "پروفایل کاربر"
    }
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
    beforeEnter: authGuard,
    meta: {
      title: "خروج کاربر"
    }
  },
  {
    path: "/logout-school",
    name: "LogoutSchool",
    component: LogoutSchool,
    beforeEnter: authGuard,
    meta: {
      title: "خروج کاربر"
    }
  },
  {
    path: "/redirect/to/profile/:userId",
    name: "ًRedirectToProfile",
    component: RedirectToProfile,
    meta: {
      title: " انتقال به کاربر"
    }
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
