import Vue from "vue";
import Vuex from "vuex";
import UserModule from "./modules/user";
import TeacherModule from "./modules/teacher";
import StudentModule from "./modules/student";
import CourseModule from "./modules/course";
import SchoolModule from "./modules/school";
import MenuModule from "./modules/menu";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user: UserModule,
    teacher: TeacherModule,
    student: StudentModule,
    course: CourseModule,
    school: SchoolModule,
    menu: MenuModule
  }
});
