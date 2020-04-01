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
      price: String,
      school: String
    },
    schoolId: String,
    connectURL: FA.STR_notEntered,
    classes: [
      {
        classDate: FA.STR_notEntered,
        classHour: FA.STR_notEntered,
        classParticipants: [FA.STR_notEntered],
        classNotes: FA.STR_notEntered
      }
    ]
  },
  mutations: {
    SET_COURSE_ID(state, payload) {
      state.courseId = payload;
    },
    SET_COURSE_SCHOOL_ID(state, payload) {
      state.schoolId = payload;
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

    SET_CONNECT_URL(state, payload) {
      state.connectURL = payload;
    },

    SET_COURSE_CLASSES(state, payload) {
      state.classes = payload;
    },

    PUSH_COURSE_CLASSES(state, payload) {
      if (state.classes[0].classDate === FA.STR_notEntered) {
        state.classes.splice(0, 1);
      }
      state.classes.push(payload);
    },

    EDIT_COURSE_CLASSES(state, payload) {
      state.classes[payload.classIndex].classDate = payload.classDate;
      state.classes[payload.classIndex].classHour = payload.classHour;
      state.classes[payload.classIndex].classParticipants =
        payload.classParticipants;
      state.classes[payload.classIndex].classNotes = payload.classNotes;
    },

    REMOVE_COURSE_CLASSES(state, payload) {
      state.classes.splice(payload, 1);
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
              price: payload.price,
              school: payload.school,
              schoolId: payload.schoolId,
              connectURL: payload.connectURL
            },
            { headers: { "x-auth-token": localStorage.getItem("token") } }
          )
          .then(res => {
            resolve({
              message: FA.STR_infoEntered,
              id: res.data.courseDoc._id
            });
            commit("SET_COURSE_ID", res.data.courseDoc._id);
            commit("SET_COURSE_TEACHER", res.data.courseDoc.teacherId);
            commit("SET_COURSE_SCHOOL_ID", res.data.courseDoc.schoolId);
            commit("SET_CONNECT_URL", res.data.courseDoc.connectURL);
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
            price: payload.price,
            school: payload.school,
            schoolId: payload.schoolId,
            connectURL: payload.connectURL
          })
          .then(res => {
            resolve("Ok");
            commit("SET_COURSE_ID", res.data.courseDoc._id);
            commit("SET_COURSE_SCHOOL_ID", res.data.courseDoc.schoolId);
            commit("SET_COURSE_TEACHER", res.data.courseDoc.teacherId);
            commit("SET_CONNECT_URL", res.data.courseDoc.connectURL);
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
      return new Promise((resolve, reject) => {
        axios
          .get(`/course/single/${payload}`)
          .then(res => {
            resolve(res);
            commit("SET_COURSE_ID", res.data.courseDoc._id);
            commit("SET_COURSE_SCHOOL_ID", res.data.courseDoc.schoolId);
            commit("SET_CONNECT_URL", res.data.courseDoc.connectURL);
            commit("SET_COURSE_TEACHER", res.data.courseDoc.teacherId);
            dispatch("setCourseTeacher", res.data.courseDoc.teacherId);
            if (res.data.courseDoc.students.length > 0) {
              dispatch("setCourseStudents", res.data.courseDoc.students);
            }
            commit("SET_COURSE_INFO", res.data.courseDoc.info);
            if (res.data.courseDoc.classes.length > 0) {
              commit("SET_COURSE_CLASSES", res.data.courseDoc.classes);
            }
          })
          .catch(e => reject(e));
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
      console.log(payload.classDate);
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
          .then(res => {
            console.log("courseRes", res);
            resolve("Ok");
            commit("PUSH_COURSE_CLASSES", {
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
          .then(res => {
            console.log(res);
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
    },
    removeCourseClass({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .put(
            `/course/remove/class/${payload.courseId}/${payload.classIndex}`,
            {
              headers: { "x-auth-token": localStorage.getItem("token") }
            }
          )
          .then(res => {
            console.log(res);
            resolve(FA.STR_classRemoved);
            commit("REMOVE_COURSE_CLASSES", payload.classIndex);
          })
          .catch(e => {
            reject(e);
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
    },
    getCourseTeacher: state => {
      return state.teacher;
    },
    getCourseURL: state => {
      return state.connectURL;
    },
    getCourseId: state => {
      return state.courseId;
    }
  }
};

export default CourseModule;
