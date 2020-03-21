import axios from "axios";
import FA from "../../assets/locale/FA";
const CourseModule = {
  state: {
    courseId: String,
    teacher: Object,
    students: [Object],
    info: {
      subject: String,
      description: String,
      price: String
    },
    classes: [
      {
        classDate: Date,
        classHour: String,
        classParticipants: [Object],
        classNotes: String
      }
    ]
  },
  mutations: {
    SET_COURSE_ID(state, payload) {
      state.courseId = payload;
    },

    SET_COURSE_TEACHER(state, payload) {
      state.teacher = payload;
    },

    SET_COURSE_STUDENTS(state, payload) {
      state.students = payload;
    },

    PUSH_COURSE_STUDENTS(state, payload) {
      state.students.push(payload);
    },

    SET_COURSE_INFO(state, payload) {
      state.info = payload;
    },

    SET_COURSE_CLASSES(state, payload) {
      state.classes = payload;
    },

    PUSH_COURSE_CLASSES(state, payload) {
      state.classes.push(payload);
    },

    EDIT_COURSE_CLASSES(state, payload) {
      state.classes[payload.classIndex].classDate = payload.classDate;
      state.classes[payload.classIndex].classHour = payload.classHour;
      state.classes[payload.classIndex].classParticipants =
        payload.classParticipants;
      state.classes[payload.classIndex].classNotes = payload.classNotes;
    }
  },
  actions: {
    setUpCourse({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            "/course/setup",
            {
              subject: payload.subject,
              description: payload.description,
              price: payload.price
            },
            { headers: { "x-auth-token": localStorage.getItem("token") } }
          )
          .then(res => {
            resolve({
              message: FA.STR_infoEntered,
              id: res.data.courseDoc._id
            });
            commit("SET_COURSE_ID", res.data.courseDoc._id);
            commit("SET_COURSE_INFO", res.data.courseDoc.info);
          })
          .catch(e => {
            if (e.response.status == 401) {
              reject(FA.STR_infoNotEntered);
            }
            console.log(e);
          });
      });
    },
    editCourse({ dispatch, commit }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/course/set/info/${payload.courseId}`, {
            subject: payload.subject,
            description: payload.description,
            price: payload.price
          })
          .then(res => {
            resolve("Ok");
            commit("SET_COURSE_ID", res.data.courseDoc._id);
            dispatch("setCourseTeacher", res.data.courseDoc.teacherId);
            if (res.data.courseDoc.students.length > 0) {
              dispatch("setCourseStudents", res.data.courseDoc.students);
            }
            commit("SET_COURSE_INFO", res.data.courseDoc.info);
            if (res.data.courseDoc.classes.length > 0) {
              commit("SET_COURSE_CLASSES", res.data.courseDoc.classes);
            }
          })
          .catch(e => {
            reject(e);
            console.log(e);
          });
      });
    },
    loadCourse({ dispatch, commit }, payload) {
      axios.get(`/course/single/${payload}`).then(res => {
        commit("SET_COURSE_ID", res.data.courseDoc._id);
        dispatch("setCourseTeacher", res.data.courseDoc.teacherId);
        if (res.data.courseDoc.students.length > 0) {
          dispatch("setCourseStudents", res.data.courseDoc.students);
        }
        commit("SET_COURSE_INFO", res.data.courseDoc.info);
        if (res.data.courseDoc.classes.length > 0) {
          commit("SET_COURSE_CLASSES", res.data.courseDoc.classes);
        }
      });
    },

    setCourseTeacher({ commit }, payload) {
      axios
        .get(`/teacher/single/${payload}`)
        .then(res => commit("SET_COURSE_TEACHER", res.data.teacherDoc))
        .catch(e => console.log(e));
    },

    setCourseStudents({ commit }, payload) {
      axios
        .get(`/student/multiple/get?students=${payload}`)
        .then(res => commit("SET_COURSE_STUDENTS", res.data.studentDocs))
        .catch(e => console.log(e));
    },

    pushCourseStudents({ commit }, payload) {
      axios
        .put(
          `/course/add/student/${payload.courseId}`,
          {
            studentId: payload.studentId
          },
          { headers: { "x-auth-token": this.loadCourse.getItem("token") } }
        )
        .then(() => {
          axios
            .get(`/student/single/${payload.studentId}`)
            .then(res => {
              commit("PUSH_COURSE_STUDENTS", res.data.studentDocs);
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    },

    pushCourseClasses({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .put(
            `/course/add/class/${payload.courseId}`,
            {
              classDate: payload.classDate,
              classHour: payload.classHour,
              classParticipants: payload.classParticipants,
              classNotes: payload.classNotes
            },
            { headers: { "x-auth-token": localStorage.getItem("token") } }
          )
          .then(() => {
            resolve("Ok");
            commit("PUSH_COURSE_CLASSES", {
              classDate: payload.classDate,
              classHour: payload.classHour,
              classParticipants: payload.classParticipants,
              classNotes: payload.classNotes
            });
          })
          .catch(e => {
            reject(e);
            console.log(e);
          });
      });
    },
    editCourseClass({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .put(
            `/course/set/class/${payload.courseId}/${payload.classIndex}`,
            {
              classDate: payload.classDate,
              classHour: payload.classHour,
              classParticipants: payload.classParticipants,
              classNotes: payload.classNotes
            },
            { headers: { "x-auth-token": localStorage.getItem("token") } }
          )
          .then(() => {
            resolve("Ok");
            commit("EDIT_COURSE_CLASSES", {
              classIndex: payload.classIndex,
              classDate: payload.classDate,
              classHour: payload.classHour,
              classParticipants: payload.classParticipants,
              classNotes: payload.classNotes
            });
          })
          .catch(e => {
            if (e.response.status == 401) {
              reject(FA.STR_infoNotEntered);
            }
            console.log(e);
          });
      });
    }
  },
  getters: {
    getCourseInfo: state => {
      return state.info;
    },
    getCourseClasses: state => {
      return state.classes;
    }
  }
};

export default CourseModule;
