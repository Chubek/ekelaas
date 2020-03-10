import axios from "axios";

const StudentModule = {
  state: {
    studentId: String,
    info: {
      grade: String,
      province: String,
      city: String,
      school: String
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
    setUpStudent({ dispatch, commit }, payload) {
      axios
        .post(
          "/student/setup",
          {
            grade: payload.grade,
            province: payload.province,
            city: payload.city,
            school: payload.school
          },
          { headers: { "x-auth-token": localStorage.getItem("token") } }
        )
        .then(res => {
          commit("SET_STUDENT_ID", res.studentDoc._id);
          dispatch("setFavoriteCourses", res.studentDoc.favorite_courses);
          dispatch("setFavoriteTeachers", res.studentDoc.favorite_teachers);
          dispatch("setTakenCourses", res.studentDoc.taken_courses);
          dispatch("setEngagedTeachers", res.studentDoc.engaged_courses);
        })
        .catch(e => console.log(e));
    },
    loadStudent({ dispatch, commit }, payload) {
      axios
        .get(`/student/single/${payload}`)
        .then(res => {
          commit("SET_STUDENT_ID", res.studentDoc._id);
          dispatch("setFavoriteCourses", res.studentDoc.favorite_courses);
          dispatch("setFavoriteTeachers", res.studentDoc.favorite_teachers);
          dispatch("setTakenCourses", res.studentDoc.taken_courses);
          dispatch("setEngagedTeachers", res.studentDoc.engaged_courses);
        })
        .catch(e => console.log(e));
    },

    setFavoriteCourses({ commit }, payload) {
      axios
        .get(`/course/multiple/get?courses=${payload}`)
        .then(res => {
          commit("SET_FAVORITE_COURSES", res.courseDocs);
        })
        .catch(e => console.log(e));
    },

    setFavoriteTeachers({ commit }, payload) {
      axios
        .get(`/teacher/multiple/get?teachers=${payload}`)
        .then(res => {
          commit("SET_FAVORITE_TEACHERS", res.courseDocs);
        })
        .catch(e => console.log(e));
    },
    setTakenCourses({ commit }, payload) {
      axios
        .get(`/course/multiple/get?courses=${payload}`)
        .then(res => {
          commit("SET_TAKEN_COURSES", res.courseDocs);
        })
        .catch(e => console.log(e));
    },

    setEngagedTeachers({ commit }, payload) {
      axios
        .get(`/teacher/multiple/get?teachers=${payload}`)
        .then(res => {
          commit("SET_ENGAGED_TEACHERS", res.courseDocs);
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
            .then(res => commit("PUSH_FAVORITE_COURSES", res.courseDocs))
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
            .then(res => commit("PUSH_FAVORITE_TEACHERS", res.teacherDocs))
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
            .then(res => commit("PUSH_TAKEN_COURSES", res.courseDocs))
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
            .then(res => commit("PUSH_ENGAGED_TEACHERS", res.teacherDocs))
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    }
  },
  getters: {}
};

export default StudentModule;
