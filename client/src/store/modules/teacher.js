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
        studentId: String,
        notes: String,
        overallScore: Number
      }
    ],
    coursesId: [String]
  },
  mutations: {
    [SET_TEACHER_ID](state, payload) {
      state.teacherId = payload;
    },

    [SET_INFO](state, payload) {
      state.info = payload;
    },

    [SET_STUDENTS](state, payload) {
      state.students = payload;
    },

    [PUSH_STUDENTS](state, payload) {
      state.students.push(payload);
    },

    [SET_COURSES_ID](state, payload) {
      state.coursesId = payload;
    },

    [PUSH_COURSES_ID](state, payload) {
      state.coursesId.push(payload);
    }
  },
  actions: {},
  getters: {}
};
