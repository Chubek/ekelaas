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

    PUSH_CLASS_PARTICIPANTS(state, payload) {
      state.classes.forEach(myClass => {
        if (myClass.classId == payload.classId) {
          myClass.classParticipants.push(payload.classParticipants);
        }
      });
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
            resolve(FA.STR_infoEntered);
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
    loadCourse({ dispatch, commit }, payload) {
      axios.get(`/course/single/${payload}`).then(res => {
        commit("SET_COURSE_ID", res.data.courseDoc._id);
        dispatch("setCourseTeacher", res.data.courseDoc.teacherId);
        dispatch("setCourseStudents", res.data.courseDoc.students);
        commit("SET_COURSE_INFO", res.data.courseDoc.info);
        commit("SET_COURSE_CLASSES", res.data.courseDoc.classes);
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
          commit("PUSH_COURSE_CLASSES", {
            classId: res.data.courseDoc.classes.classId,
            classDate: payload.classDate,
            classHour: payload.classHour,
            classParticipants: payload.classParticipants,
            classNotes: payload.classNotes
          });
        })
        .catch(e => console.log(e));
    }
  },
  getters: {}
};

export default CourseModule;
