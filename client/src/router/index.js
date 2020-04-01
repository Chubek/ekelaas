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
import CoursePage from "../components/Course/CoursePage.vue";
import SchoolTeachers from "../components/Catalogues/SchoolTeachers.vue";
import SchoolStudents from "../components/Catalogues/SchoolStudents.vue";
import SchoolCourses from "../components/Catalogues/SchoolCourses.vue";
import LogoutSchool from "../components/School/LogoutSchool.vue";
import ProfileSchool from "../components/School/ProfileSchool.vue";
import RegisterSchool from "../components/School/RegisterSchool";
import LoginSchool from "../components/School/LoginSchool.vue";
import RedirectToProfile from "../components/Utils/RedirectToProfile.vue";
import EditCourseInfo from "../components/Course/EditCourseInfo.vue";
import OurSchools from "../components/OurSchools.vue";
import EditSchoolInfo from "../components/School/EditSchoolInfo.vue";
import authGuard from "./Guards/authGuard";
import authSchoolGuard from "./Guards/authSchoolGuard";
import registerGuard from "./Guards/registerGuard";
import registerSchoolGuard from "./Guards/registerSchoolGuard";
import teacherGuard from "./Guards/teacherGuard";
import studentGuard from "./Guards/studentGuard";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    beforeEnter: registerGuard
  },
  {
    path: "/register-school",
    name: "RegisterSchool",
    component: RegisterSchool,
    beforeEnter: registerSchoolGuard
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/login-school",
    name: "LoginSchool",
    component: LoginSchool
  },
  {
    path: "/set/info",
    name: "SetInfo",
    component: SetInfo,
    beforeEnter: authGuard
  },
  {
    path: "/set/info-school",
    name: "EditSchoolInfo",
    component: EditSchoolInfo
  },
  {
    path: "/set/info-student",
    name: "SetStudent",
    component: SetStudent,
    beforeEnter: authGuard
  },
  {
    path: "/set/info-teacher",
    name: "SetTeacher",
    component: SetTeacher,
    beforeEnter: authGuard
  },
  {
    path: "/edit/info-student",
    name: "EditStudentInfo",
    component: EditStudentInfo,
    beforeEnter: studentGuard
  },
  {
    path: "/edit/info-teacher",
    name: "EditTeacherInfo",
    component: EditTeacherInfo,
    beforeEnter: teacherGuard
  },
  {
    path: "/set/info-course",
    name: "SetCourse",
    component: SetCourse,
    beforeEnter: teacherGuard
  },
  {
    path: "/edit/info-course/:courseId",
    name: "EditCourseInfo",
    component: EditCourseInfo,
    beforeEnter: teacherGuard
  },
  {
    path: "/set/class/:courseId",
    name: "SetClass",
    component: SetClass,
    beforeEnter: teacherGuard
  },
  {
    path: "/profile/:userId",
    name: "Profile",
    component: Profile
  },
  {
    path: "/profile-school",
    name: "ProfileSchool",
    component: ProfileSchool
  },
  {
    path: "/profile-course/:courseId",
    name: "CoursePage",
    component: CoursePage
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
    beforeEnter: authGuard,   
  },
  {
    path: "/logout-school",
    name: "LogoutSchool",
    component: LogoutSchool,
    beforeEnter: authSchoolGuard
    
  },
  {
    path: "/redirect/to/profile/:userId",
    name: "ًRedirectToProfile",
    component: RedirectToProfile,
   
  },
  {
    path: "/view-students",
    name: "ًSchoolStudents",
    component: SchoolStudents
  },
  {
    path: "/view-teachers",
    name: "ًSchoolTeachers",
    component: SchoolTeachers   
  },
  {
    path: "/view-courses",
    name: "ًSchoolCourses",
    component: SchoolCourses    
  },
  {
    path: "/our-schools",
    name: "ًOurSchools",
    component: OurSchools   
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
