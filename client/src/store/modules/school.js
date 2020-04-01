import axios from "axios";
import FA from "../../assets/locale/FA";

const SchoolModule = {
  state: {
    schooLoggedIn: !!localStorage.getItem("schoolToken"),
    schoolData: {
      schoolId: String,
      idName: String,
      email: String,
      mobileNumber: Number
    },
    info: {
      name: FA.STR_notEntered,
      grade: FA.STR_notEntered,
      landlineNumber: FA.STR_notEntered,
      address: FA.STR_notEntered
    },
    courses: new Set(),
    teachers: new Set(),
    students: new Set(),
    autoCompleteSchools: []
  },
  mutations: {
    SET_SCHOOL_DATA(state, payload) {
      console.log("SET SCHOOL DATA CALLED");
      state.schoolData = payload;
    },
    SET_SCHOOL_INFO(state, payload) {
      state.info = payload;
    },
    SET_SCHOOL_LOGGED_IN(state, payload) {
      console.log(state.schoolLoggedIn);
      state.schooLoggedIn = payload;
    },
    SET_AUTO_COMPLETE_SCHOOLS(state, payload) {
      payload.forEach(school => {
        state.autoCompleteSchools.push({
          text: school.info.name + " (" + school.info.grade + ")",
          value: school._id
        });
      });
    },
    PUSH_SCHOOL_COURSES(state, payload) {
      state.courses.add(payload);
    },
    PUSH_SCHOOL_TEACHERS(state, payload) {
      state.teachers.add(payload);
    },
    SET_SCHOOL_TEACHERS(state, payload) {
      console.log("payload", payload);
      payload.data.teacherDocs.forEach((teacher, index) => {
        state.teachers.add({
          teacherId: teacher._id,
          userId: payload.data.userDocs[index]._id,
          schoolId: teacher.schoolId,
          firstName: payload.data.userDocs[index].info.firstName,
          lastName: payload.data.userDocs[index].info.lastName
        });
      });
    },
    SET_SCHOOL_STUDENTS(state, payload) {
      payload.data.studentDocs.forEach((student, index) => {
        state.students.add({
          studentId: student._id,
          schoolId: student.schoolId,
          userId: payload.data.userDocs[index]._id,
          firstName: payload.data.userDocs[index].info.firstName,
          lastName: payload.data.userDocs[index].info.firstName,
          grade: student.info.grade
        });
      });
    },
    SET_SCHOOL_COURSES(state, payload) {
      payload.data.courseDocs.forEach(course => {
        state.courses.add({
          courseId: course._id,
          schoolId: course.schoolId,
          subject: course.info.subject,
          description: course.info.description,
          price: course.info.price,
          url: course.connectURL
        });
      });
    }
  },
  REMOVE_FROM_TEACHERS(state, payload) {
    state.teachers.delete(payload);
  },
  REMOVE_FROM_STUDENTS(state, payload) {
    state.students.delete(payload);
  },
  REMOVE_FROM_COURSES(state, payload) {
    state.courses.delete(payload);
  },
  actions: {
    schoolLogIn({ dispatch, commit }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post("/school/auth", {
            idName: payload.idName,
            email: payload.email,
            mobileNumber: payload.mobileNumber,
            password: payload.password
          })
          .then(res => {
            resolve(FA.STR_loggedIn);
            localStorage.setItem("schoolToken", res.data.token);
            commit("SET_SCHOOL_LOGGED_IN", true);
            commit("SET_SCHOOL_DATA", {
              schoolId: res.data.docSchool._id,
              idName: res.data.docSchool.idName,
              email: res.data.docSchool.email,
              mobileNumber: res.data.docSchool.mobileNumber
            });
            commit("SET_SCHOOL_INFO", res.data.docSchool.info);
            dispatch("setSchoolStudents");
            dispatch("setSchoolTeachers");
            dispatch("setSchoolCourses");
          })
          .catch(e => {
            if (e.response.status == 400) {
              reject(FA.STR_infoNotEntered);
            }
            if (e.response.status == 401) {
              reject(FA.STR_passwordsDontMatch);
            }
            if (e.response.status == 404) {
              reject(FA.STR_noUser);
            }
            reject(e);
            console.log(e);
          });
      });
    },
    schoolLogInOnCreate({ dispatch, commit }) {
      axios
        .post("/school/auth/on/create", {
          jwt: localStorage.getItem("schoolToken")
        })
        .then(res => {
          commit("SET_SCHOOL_LOGGED_IN", true);
          commit("SET_SCHOOL_DATA", {
            schoolId: res.data.docSchool._id,
            idName: res.data.docSchool.idName,
            email: res.data.docSchool.email,
            mobileNumber: res.data.docSchool.mobileNumber
          });
          commit("SET_SCHOOL_INFO", res.data.docSchool.info);
          dispatch("setSchoolStudents");
          dispatch("setSchoolTeachers");
          dispatch("setSchoolCourses");
        });
    },

    schoolLogInOnRegister({ commit }, payload) {
      axios
        .post("/school/auth", {
          idName: payload.idName,
          email: payload.email,
          mobileNumber: payload.mobileNumber,
          password: payload.password
        })
        .then(res => {
          localStorage.setItem("schoolToken", res.data.token);
          commit("SET_SCHOOL_LOGGED_IN", true);
          commit("SET_SCHOOL_DATA", {
            schoolId: res.data.docSchool._id,
            idName: res.data.docSchool.idName,
            email: res.data.docSchool.email,
            mobileNumber: res.data.docSchool.mobileNumber
          });
          commit("SET_SCHOOL_INFO", res.data.docSchool.info);
        });
    },

    schoolRegister({ dispatch }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post("/school/register", {
            idName: payload.idName,
            email: payload.email,
            mobileNumber: payload.mobileNumber,
            password: payload.password,
            info: payload.info
          })
          .then(res => {
            console.log("res", res);
            if (res.status == 200) {
              resolve({
                message: FA.STR_userCreated,
                id: res.data.docSchool._id
              });
            }
            dispatch("schoolLogInOnRegister", payload);
          })
          .catch(e => {
            console.log("e", e);
            if (
              e.response.status == 403 &&
              e.response.data.isSame === "school"
            ) {
              reject(FA.STR_userExists);
            }
            if (e.response.status == 401) {
              reject(FA.STR_pleaseEnterInfo);
            }
            if (
              e.response.status == 403 &&
              e.response.data.isSame === "idName"
            ) {
              reject(FA.STR_displayNameExists);
            }
            if (
              e.response.status == 403 &&
              e.response.data.isSame === "email"
            ) {
              reject(FA.STR_emailExists);
            }
            if (
              e.response.status == 403 &&
              e.response.data.isSame === "mobileNumber"
            ) {
              reject(FA.STR_phoneNumberExists);
            }
            reject(e);
            console.log(e);
          });
      });
    },
    editSchool({ dispatch, commit }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .put(
            "/school/set/info",
            {
              name: payload.name,
              grade: payload.grade,
              landlineNumber: payload.landlineNumber,
              address: payload.address
            },
            {
              headers: {
                "x-auth-token-school": localStorage.get("schoolToken")
              }
            }
          )
          .then(res => {
            resolve(FA.STR_schoolUpdated);
            commit("SET_SCHOOL_DATA", {
              schoolId: res.data.docSchool._id,
              idName: res.data.docSchool.idName,
              email: res.data.docSchool.email,
              mobileNumber: res.data.docSchool.mobileNumber
            });
            commit("SET_SCHOOL_INFO", res.data.docSchool.info);
            dispatch("setSchoolStudents");
            dispatch("setSchoolTeachers");
            dispatch("setSchoolCourses");
          })
          .catch(e => {
            reject(e);
            console.log(e);
          });
      });
    },
    setSchoolTeachers({ commit, state }) {
      console.log("SET SCHOOL TEACHER CALLED");
      axios
        .get(`/school/all/teachers/${state.schoolData.schoolId}`)
        .then(res => {
          commit("SET_SCHOOL_TEACHERS", res);
        })
        .catch(e => console.log(e.response));
    },
    setSchoolStudents({ commit, state }) {
      console.log("SET SCHOOL STUDENTS CALLED");
      axios
        .get(`/school/all/students/${state.schoolData.schoolId}`)
        .then(res => {
          commit("SET_SCHOOL_STUDENTS", res);
        })
        .catch(e => console.log(e.response));
    },
    setSchoolCourses({ commit, state }) {
      console.log("SET SCHOOL COURSES CALLED");
      axios
        .get(`/school/all/courses/${state.schoolData.schoolId}`)
        .then(res => {
          commit("SET_SCHOOL_COURSES", res);
        })
        .catch(e => console.log(e.response));
    },
    loadSchool({ dispatch, commit }, payload) {
      axios.get(`/school/single/${payload}`).then(res => {
        commit("SET_SCHOOL_INFO", res.data.docSchool.info);
        commit("SET_SCHOOL_DATA", {
          schoolId: res.data.docSchool._id,
          idName: res.data.docSchool.idName,
          email: res.data.docSchool.email,
          mobileNumber: res.data.docSchool.mobileNumber
        });
        dispatch("setSchoolStudents");
        dispatch("setSchoolTeachers");
        dispatch("setSchoolCourses");
      });
    },
    loadAutoCompleteSchools({ commit }) {
      axios.get("/school/all").then(res => {
        commit("SET_AUTO_COMPLETE_SCHOOLS", res.data.docSchools);
      });
    },
    schoolLogOut({ commit }) {
      localStorage.removeItem("schoolToken");
      commit("SET_SCHOOL_LOGGED_IN", false);
      commit("SET_SCHOOL_DATA", null);
      commit("SET_SCHOOL_INFO", null);
    },
    removeFromCourses({ commit }, payload) {
      commit("REMOVE_FROM_COURSES", payload);
    },
    removeFromStudents({ commit }, payload) {
      commit("REMOVE_FROM_STUDENTS", payload);
    }
  },
  getters: {
    getAutoCompleteSchools: state => {
      return state.autoCompleteSchools;
    },
    getSchoolIsLoggedIn: state => {
      return state.schooLoggedIn;
    },
    getSchoolId: state => {
      return state.schoolData.schoolId;
    },
    getSchoolInfo: state => {
      return state.info;
    },
    getSchoolTeachers: state => {
      return state.teachers;
    },
    getSchoolStudents: state => {
      return state.students;
    },
    getSchoolCourses: state => {
      return state.courses;
    },
    getSchoolName: state => {
      return state.info.name;
    }
  }
};

export default SchoolModule;
