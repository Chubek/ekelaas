import axios from "axios";

export default TeacherModule = {
  state: {
    teacherId: String,
    info: {
      credits: Array,
      degrees: Array
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
    [SET_TEACHER_ID](state, payload) {
      state.teacherId = payload;
    },

    [SET_TEACHER_INFO](state, payload) {
      state.info = payload;
    },

    [SET_TEACHER_STUDENTS](state, payload) {
      state.students = payload;
    },

    [PUSH_TEACHER_STUDENTS](state, payload) {
      state.students.push(payload);
    },

    [SET_TEACHER_COURSES](state, payload) {
      state.coursesId = payload;
    },

    [PUSH_TEACHER_COURSES](state, payload) {
      state.coursesId.push(payload);
    }
  },
  actions: {
    setUpTeacher({ dispatch, commit }, payload) {
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
          commit("SET_TEACHER_ID", res.teacherDoc._id);
          commit("SET_TEACHER_INFO", {
            credits: res.teacherDoc.info.credits,
            degrees: res.teacherDoc.info.degrees
          });
          dispatch("setTeacherStudents", res.teacherDoc.students);
          dispatch("setTeacherCourses", res.teacherDoc.courses_id);
        })
        .catch(e => console.log(e));
    },

    loadTeacher({ commit }, payload) {
      axios.get(`/teacher/single/${payload}`).then(res => {
        commit("SET_TEACHER_ID", res.teacherDoc._id);
        commit("SET_TEACHER_INFO", {
          credits: res.teacherDoc.info.credits,
          degrees: res.teacherDoc.info.degrees
        });
        dispatch("setTeacherStudents", res.teacherDoc.students);
        dispatch("setTeacherCourses", res.teacherDoc.courses_id);
      });
    },

    setTeacherStudents({ commit }, payload) {
      ids = [];
      notes = [];
      overallScore = [];
      payload.forEach(student => {
        ids.push(student.student_id);
        notes.push(student.notes);
        overallScore.push(student.overall_score);
      });
      axios
        .get(`/student/multiple/get?students=${ids}`)
        .then(res => {
          const student = res.studentDocs;
          const concat = student.concat(notes, overallScore);
          commit("SET_TEACHER_STUDENTS", concat);
        })
        .catch(e => console.log(e));
    },

    setTeacherCourses({ commit }, payload) {
      axios
        .get(`/course/multiple/get?students=${payload}`)
        .then(res => {
          commit("SET_TEACHER_COURSES", res.courseDocs);
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
            .get(`/student/single/${res.studentDoc.student_id}`)
            .then(res => {
              const student = res.studentDoc;
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
            .get(`/course/multiple/get?courses=${res.courses_id}`)
            .then(res => commit("PUSH_TEACHER_COURSES", res.courseDocs))
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    }
  },
  getters: {}
};
