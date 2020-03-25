import axios from "axios";
import FA from "../../assets/locale/FA";
const StudentModule = {
  state: {
    studentId: String,
    schoolId: String,
    info: {
      grade: FA.STR_grade,
      province: FA.STR_province,
      city: FA.STR_city,
      school: FA.STR_school
    },
    favoriteCourses: [Object],
    takenCourses: [Object],
    engagedTeachers: [Object],
    favoriteTeachers: [Object]
  },
  mutations: {
    SET_STUDENT_ID(state, payload) {
      state.studentId = payload;
    },

    SET_STUDENT_SCHOOL_ID(state, payload) {
      state.schoolId = payload;
    },

    SET_STUDENT_INFO(state, payload) {
      state.info = payload;
    },

    SET_FAVORITE_COURSES(state, payload) {
      state.favoriteCourses = payload;
    },

    PUSH_FAVORITE_COURSES(state, payload) {
      state.favoriteCourses.push(payload);
    },

    SET_TAKEN_COURSES(state, payload) {
      state.takenCourses = payload;
    },

    PUSH_TAKEN_COURSES(state, payload) {
      state.takenCourses.push(payload);
    },

    SET_ENGAGED_TEACHERS(state, payload) {
      state.engagedTeachers = payload;
    },

    PUSH_ENGAGED_TEACHERS(state, payload) {
      state.engagedTeachers.push(payload);
    },

    SET_FAVORITE_TEACHERS(state, payload) {
      state.favoriteTeachers = payload;
    },

    PUSH_FAVORITE_TEACHERS(state, payload) {
      state.favoriteTeachers.push(payload);
    }
  },
  actions: {
    setUpStudent({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            "/student/setup",
            {
              grade: payload.grade,
              province: payload.province,
              city: payload.city,
              school: payload.school,
              schoolId: payload.schoolId
            },
            { headers: { "x-auth-token": localStorage.getItem("token") } }
          )
          .then(res => {
            resolve(FA.STR_infoEntered);
            commit("SET_STUDENT_ID", res.data.studentDoc._id);
            commit("SET_STUDENT_INFO", res.data.studentDoc.info);
            commit("SET_STUDENT_SCHOOL_ID", res.data.studentDoc.schoolId);
          })
          .catch(e => {
            if (e.response.status == 401) {
              reject(FA.STR_infoNotEntered);
            }
            console.log(e);
          });
      });
    },
    editStudent({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .put(
            `/student/set/info/${state.studentId}`,
            {
              grade: payload.grade,
              province: payload.province,
              city: payload.city,
              school: payload.school,
              schoolId: schoolId
            },
            { headers: { "x-auth-token": localStorage.getItem("token") } }
          )
          .then(res => {
            resolve("Ok");
            commit("SET_STUDENT_ID", res.data.studentDoc._id);
            commit("SET_STUDENT_INFO", res.data.studentDoc.info);
            ommit("SET_STUDENT_SCHOOL_ID", res.data.studentDoc.schoolId);
          })
          .catch(e => {
            reject(e);
            console.log(e);
          });
      });
    },
    loadStudent({ dispatch, commit }, payload) {
      axios
        .get(`/student/single/${payload}`)
        .then(res => {
          commit("SET_STUDENT_ID", res.data.studentDoc._id);
          commit("SET_STUDENT_INFO", res.data.studentDoc.info);
          if (res.data.studentDoc.favoriteCourses.length > 0) {
            dispatch("setFavoriteCourses", res.data.studentDoc.favoriteCourses);
          }
          if (res.data.studentDoc.favoriteTeachers.length > 0) {
            dispatch(
              "setFavoriteTeachers",
              res.data.studentDoc.favoriteTeachers
            );
          }
          if (res.data.studentDoc.takenCoursesId.length > 0) {
            dispatch("setTakenCourses", res.data.studentDoc.taken_courses);
          }

          if (res.data.studentDoc.engagedTeachersId.length > 0) {
            dispatch("setEngagedTeachers", res.data.studentDoc.engaged_courses);
          }
        })
        .catch(e => console.log(e));
    },

    setFavoriteCourses({ commit }, payload) {
      axios
        .get(`/course/multiple/get?courses=${payload}`)
        .then(res => {
          commit("SET_FAVORITE_COURSES", res.data.courseDocs);
        })
        .catch(e => console.log(e));
    },

    setFavoriteTeachers({ commit }, payload) {
      axios
        .get(`/teacher/multiple/get?teachers=${payload}`)
        .then(res => {
          commit("SET_FAVORITE_TEACHERS", res.data.courseDocs);
        })
        .catch(e => console.log(e));
    },
    setTakenCourses({ commit }, payload) {
      axios
        .get(`/course/multiple/get?courses=${payload}`)
        .then(res => {
          commit("SET_TAKEN_COURSES", res.data.courseDocs);
        })
        .catch(e => console.log(e));
    },

    setEngagedTeachers({ commit }, payload) {
      axios
        .get(`/teacher/multiple/get?teachers=${payload}`)
        .then(res => {
          commit("SET_ENGAGED_TEACHERS", res.data.courseDocs);
        })
        .catch(e => console.log(e));
    },

    pushFavoriteCourses({ commit }, payload) {
      axios
        .put(
          `/student/set/favorite/courses/${payload.studentId}`,
          {
            favoriteCourses: payload.favoriteCourses
          },
          {
            headers: { "x-auth-token": localStorage.getItem("token") }
          }
        )
        .then(() => {
          axios
            .get(`/course/multiple/get?courses=${payload.favoriteCourses}`)
            .then(res => commit("PUSH_FAVORITE_COURSES", res.data.courseDocs))
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    },

    pushFavoriteTeachers({ commit }, payload) {
      axios
        .put(
          `/student/set/favorite/teachers/${payload.studentId}`,
          {
            favoriteTeachers: payload.favoriteTeachers
          },
          {
            headers: { "x-auth-token": localStorage.getItem("token") }
          }
        )
        .then(() => {
          axios
            .get(`/teacher/multiple/get?teachers=${payload.favoriteTeachers}`)
            .then(res => commit("PUSH_FAVORITE_TEACHERS", res.data.teacherDocs))
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    },

    pushTakenCourses({ commit }, payload) {
      axios
        .get(
          `/student/set/taken/courses/${payload.studentId}`,
          {
            takenCourses: payload.takenCourses
          },
          {
            headers: { "x-auth-token": localStorage.getItem("token") }
          }
        )
        .then(() => {
          axios
            .get(`/course/multiple/get?courses=${payload.takenCourses}`)
            .then(res => commit("PUSH_TAKEN_COURSES", res.data.courseDocs))
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    },

    pushEngagedTeachers({ commit }, payload) {
      axios
        .get(
          `/student/set/engaged/teachers/${payload.studentId}`,
          {
            engagedTeachers: payload.engagedTeachers
          },
          {
            headers: { "x-auth-token": localStorage.getItem("token") }
          }
        )
        .then(() => {
          axios
            .get(`/teacher/multiple/get?teachers=${payload.engagedTeachers}`)
            .then(res => commit("PUSH_ENGAGED_TEACHERS", res.data.teacherDocs))
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    }
  },
  getters: {
    getStudentInfo: state => {
      return state.info;
    },

    getFavoriteTeachers: state => {
      return state.favoriteTeachers;
    },
    getEngagedTeachers: state => {
      return state.engagedTeachers;
    },
    getStudentId: state => {
      return state.studentId;
    }
  }
};

export default StudentModule;
