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
      name: String,
      grade: String,
      landlineNumber: Number,
      address: String
    },
    courses: [],
    teachers: [],
    students: [],
    autoCompleteSchools: []
  },
  mutations: {
    SET_SCHOOL_DATA(state, payload) {
      state.userData = payload;
    },
    SET_SCHOOL_INFO(state, payload) {
      state.info = payload;
    },
    SET_AUTO_COMPLETE_SCHOOLS(state, payload) {
      payload.forEach(school => {
        state.autoCompleteSchools.push({
          title: school.info.name + " (" + school.info.grade + ")",
          id: school._id
        });
      });
    },
    PUSH_SCHOOL_COURSES(state, payload) {
      state.courses.push(payload);
    },
    SET_SCHOOL_TEACHERS(state, payload) {
      state.teachers = payload;
    },
    PUSH_SCHOOL_TEACHERS(state, payload) {
      payload.data.teacherDocs.forEach((teacher, index) => {
        state.teachers.push({
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
        state.students.push({
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
        state.courses.push({
          courseId: course._id,
          schoolId: course.schoolId,
          subject: course.info.subject,
          description: course.info.description,
          price: course.info.price
        });
      });
    }
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
            commit("SET_SCHOOL_DATA", {
              schoolId: res.data.docSchool._id,
              idName: res.data.docSchool.idName,
              email: res.data.docSchool.email,
              mobileNumber: res.data.docSchool.mobileNumber
            });
            commit("SET_SCHOOL_INFO", res.data.docSchool.info);
            if (res.data.docSchool.studentsId.length > 0) {
              dispatch("setSchoolStudents");
            }
            if (res.data.docSchool.teachersId.length > 0) {
              dispatch("setSchoolTeachers");
            }
            if (res.data.docSchool.coursesId.length > 0) {
              dispatch("setSchoolCourses");
            }
          })
          .catch(e => {
            if (e.response.status == 401) {
              reject(FA.STR_infoNotEntered);
            }
            reject(e);
            console.log(e);
          });
      });
    },
    schoolLogInOnCreate({ dispatch, commit, state }) {
      axios
        .post("/school/auth/on/creare", {
          jwt: localStorage.getItem("schoolToken")
        })
        .then(res => {
          state.schoolLoggedIn = true;
          commit("SET_SCHOOL_DATA", {
            schoolId: res.data.docSchool._id,
            idName: res.data.docSchool.idName,
            email: res.data.docSchool.email,
            mobileNumber: res.data.docSchool.mobileNumber
          });
          commit("SET_SCHOOL_INFO", res.data.docSchool.info);
          if (res.data.docSchool.studentsId.length > 0) {
            dispatch("setSchoolStudents");
          }
          if (res.data.docSchool.teachersId.length > 0) {
            dispatch("setSchoolTeachers");
          }
          if (res.data.docSchool.coursesId.length > 0) {
            dispatch("setSchoolCourses");
          }
        });
    },

    schoolLogInOnRegister({ commit, state }, payload) {
      axios
        .post("/school/auth", {
          idName: payload.idName,
          email: payload.email,
          mobileNumber: payload.mobileNumber,
          password: payload.password
        })
        .then(res => {
          localStorage.setItem("schoolToken", res.data.token);
          state.schoolLoggedIn = true;
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
            idName: payload.displayName,
            email: payload.email,
            mobileNumber: payload.phoneNumber,
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
            if (
              e.response.status == 401 &&
              e.response.data.isSame === "school"
            ) {
              reject(FA.STR_userExists);
            } else if (e.response.status == 403) {
              reject(FA.STR_pleaseEnterInfo);
            } else if (
              e.response.status == 401 &&
              e.response.data.isSame === "idName"
            ) {
              reject(FA.STR_displayNameExists);
            } else if (
              e.response.status == 401 &&
              e.response.data.isSame === "email"
            ) {
              reject(FA.STR_emailExists);
            } else if (
              e.response.status == 401 &&
              e.response.data.isSame === "mobileNumber"
            ) {
              reject(FA.STR_phoneNumberExists);
            }
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
            if (res.data.docSchool.studentsId.length > 0) {
              dispatch("setSchoolStudents");
            }
            if (res.data.docSchool.teachersId.length > 0) {
              dispatch("setSchoolTeachers");
            }
            if (res.data.docSchool.coursesId.length > 0) {
              dispatch("setSchoolCourses");
            }
          })
          .catch(e => {
            reject(e);
            console.log(e);
          });
      });
    },
    setSchoolTeachers({ commit }) {
      axios
        .get(
          "/school/all/teachers",
          { blank: "blank" },
          { headers: { "x-auth-token": localStorage.getItem("schoolToken") } }
        )
        .then(res => {
          commit("SET_SCHOOL_TEACHERS", res);
        });
    },
    setSchoolStudents({ commit }) {
      axios
        .get(
          "/school/all/students",
          { blank: "blank" },
          { headers: { "x-auth-token": localStorage.getItem("schoolToken") } }
        )
        .then(res => {
          commit("SET_SCHOOL_STUDENTS", res);
        });
    },
    setSchoolCourses({ commit }) {
      axios
        .get(
          "/school/all/courses",
          { blank: "blank" },
          { headers: { "x-auth-token": localStorage.getItem("schoolToken") } }
        )
        .then(res => {
          commit("SET_SCHOOL_COURSES", res);
        });
    },
    loadSchool({ dispatch, commit }, payload) {
      axios.get(`/school/single/${payload}`).then(res => {
        commit("SET_SCHOOL_INFO", res.data.docSchool.info);
        if (res.data.docSchool.studentsId.length > 0) {
          dispatch("loadSchoolStudents");
        }
        if (res.data.docSchool.teachersId.length > 0) {
          dispatch("loadSchoolTeachers");
        }
        if (res.data.docSchool.coursesId.length > 0) {
          dispatch("loadSchoolCourses");
        }
      });
    },
    loadAutoCompleteSchools({ commit }) {
      axios.get("/school/all").then(res => {
        commit("SET_AUTO_COMPLETE_USERS", res.data.docSchools);
      });
    },
    schoolLogOut({ commit, state }) {
      localStorage.removeItem("schoolToken");
      state.loggedIn = false;
      commit("SET_SCHOOL_DATA", null);
      commit("SET_SCHOOL_INFO", null);
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
      return state.schoolId
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
    }
  }
};

export default SchoolModule;
