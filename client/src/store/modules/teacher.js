import axios from "axios";
import FA from "../../assets/locale/FA";
const TeacherModule = {
  state: {
    teacherId: String,
    info: {
      credits: [
        FA.STR_credit,
        FA.STR_credit,
        FA.STR_credit,
        FA.STR_credit,
        FA.STR_credit
      ],
      degrees: [FA.STR_degree, FA.STR_degree]
    },
    students: [
      {
        student: Object,
        notes: String,
        overallScore: Number
      }
    ],
    courses: [Object]
  },
  mutations: {
    SET_TEACHER_ID(state, payload) {
      state.teacherId = payload;
    },

    SET_TEACHER_INFO(state, payload) {
      state.info = payload;
    },

    SET_TEACHER_STUDENTS(state, payload) {
      state.students = payload;
    },

    PUSH_TEACHER_STUDENTS(state, payload) {
      state.students.push(payload);
    },

    SET_TEACHER_COURSES(state, payload) {
      state.coursesId = payload;
    },

    PUSH_TEACHER_COURSES(state, payload) {
      state.coursesId.push(payload);
    }
  },
  actions: {
    setUpTeacher({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            "/teacher/setup",
            {
              credits: payload.credits,
              degrees: payload.degrees
            },
            { headers: { "x-auth-token": localStorage.getItem("token") } }
          )
          .then(res => {
            resolve(FA.STR_infoEntered);
            commit("SET_TEACHER_ID", res.data.teacherDoc._id);
            commit("SET_TEACHER_INFO", {
              credits: res.data.teacherDoc.info.credits,
              degrees: res.data.teacherDoc.info.degrees
            });
          })
          .catch(e => {
            if (e.response.status == 401) {
              reject(FA.STR_pleaseEnterInfo);
            }
            console.log(e);
          });
      });
    },

    loadTeacher({ dispatch, commit }, payload) {
      axios.get(`/teacher/single/${payload}`).then(res => {
        console.log("resss", res);
        commit("SET_TEACHER_ID", res.data.teacherDoc._id);
        commit("SET_TEACHER_INFO", {
          credits: res.data.teacherDoc.info.credits,
          degrees: res.data.teacherDoc.info.degrees
        });
        if (res.data.teacherDoc.students.length > 0) {
          dispatch("setTeacherStudents", res.data.teacherDoc.students);
        }
        if (res.data.teacherDoc.coursesId.length > 0) {
          dispatch("setTeacherCourses", res.data.teacherDoc.coursesId);
        }
      });
    },

    setTeacherStudents({ commit }, payload) {
      let ids = [];
      let notes = [];
      let overallScore = [];
      payload.forEach(student => {
        ids.push(student.studentId);
        notes.push(student.notes);
        overallScore.push(student.overallScore);
      });
      axios
        .get(`/student/multiple/get?students=${ids}`)
        .then(res => {
          let student = res.data.studentDocs;
          const concat = student.concat(notes, overallScore);
          commit("SET_TEACHER_STUDENTS", concat);
        })
        .catch(e => console.log(e));
    },

    setTeacherCourses({ commit }, payload) {
      axios
        .get(`/course/multiple/get?courses=${payload}`)
        .then(res => {
          commit("SET_TEACHER_COURSES", res.data.courseDocs);
        })
        .catch(e => console.log(e));
    },

    pushTeacherStudents({ commit }, payload) {
      axios
        .put(
          `/teacher/set/student/${payload.teacherId}`,
          {
            studentId: payload.studentId,
            notes: payload.notes,
            score: payload.score
          },
          {
            headers: { "x-auth-token": localStorage.getItem("token") }
          }
        )
        .then(res => {
          axios
            .get(`/student/single/${res.data.studentDoc.studentId}`)
            .then(res => {
              const student = res.data.studentDoc;
              const obj = student.concat(payload.notes, payload.score);
              commit("PUSH_TEACHER_STUDENTS", obj);
            });
        })
        .catch(e => console.log(e));
    },

    pushTeacherCourses({ commit }, payload) {
      axios
        .put(
          `/teacher/set/courses/${payload.teacherId}`,
          {
            coursesId: payload.coursesId
          },
          { headers: { "x-auth-token": localStorage.get("token") } }
        )
        .then(res => {
          axios
            .get(`/course/multiple/get?courses=${res.data.coursesId}`)
            .then(res => commit("PUSH_TEACHER_COURSES", res.data.courseDocs))
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    }
  },
  getters: {
    getTeacherInfo: state => {
      return state.info;
    },
    getTeacherId: state => {
      return state.teacherId;
    }
  }
};

export default TeacherModule;
