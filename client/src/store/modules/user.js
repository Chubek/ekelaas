import axios from "axios";

export default UserModule = {
  state: {
    loggedIn: !!localStorage.getItem("token"),
    userData: {
      userId: String,
      displayName: String,
      email: String,
      phoneNumber: String,
      verified: Boolean
    },
    info: {
      firstName: String,
      lastName: String,
      dateOfBirth: String
    },
    referralCode: String,
    connections: {
      adobeConnectId: String,
      ekigaId: String,
      vSeeId: String,
      openMeetingsId: String,
      mikogoId: String
    },
    type: String,
    typeId: String
  },
  mutations: {
    [SET_USER_DATA](state, payload) {
      state.userData = payload;
    },

    [SET_USER_INFO](state, payload) {
      state.info = payload;
    },

    [SET_REFERRAL_CODE](state, payload) {
      state.referralCode = payload;
    },

    [SET_CONNECTIONS](state, payload) {
      state.connections = payload;
    },

    [SET_TYPE](state, payload) {
      state.type = payload.type;

      if (payload.type == "Student") {
        state.typeId = payload.studentId;
      } else {
        state.typeId = payload.teacherId;
      }
    }
  },
  actions: {
    logIn({ commit }, payload) {
      axios
        .post("/user/auth", {
          displayName: payload.displayName,
          email: payload.email,
          phoneNumber: payload.phoneNumber,
          password: payload.password
        })
        .then(res => {
          localStorage.setItem("token", res.token);
          commit("SET_USER_DATA", {
            userId: res.docUser._id,
            displayName: res.docUser.display_name,
            email: res.docUser.email,
            phoneNumber: res.docUser.phone_number,
            verified: res.docUser.verified
          });
          commit("SET_USER_INFO", {
            firstName: res.docUser.info.first_name,
            lastName: res.docUser.info.last_name,
            dateOfBirth: res.docUser.info.date_of_birth
          });
          commit("SET_CONNECTIONS", {
            adobeConnectionId: res.docUser.connections.adobe_connection_id,
            ekigaId: res.docUser.connections.ekiga_id,
            vSeeId: res.docUser.connections.vsee_id,
            mikogoId: res.docUser.connections.mikogo_id
          });
          commit("SET_TYPE", {
            type: res.docUser.priviledges.type,
            studentId: res.docUser.priviledges.student_id,
            teacherId: res.docUser.priviledges.teacherId
          });
        });
    },

    logInOnCreate({ commit }) {
      axios
        .post("/user/auth/on/create", {
          jwt: localStorage.getItem("token")
        })
        .then(res => {
          commit("SET_USER_DATA", {
            userId: res.docUser._id,
            displayName: res.docUser.display_name,
            email: res.docUser.email,
            phoneNumber: res.docUser.phone_number,
            verified: res.docUser.verified
          });
          commit("SET_USER_INFO", {
            firstName: res.docUser.info.first_name,
            lastName: res.docUser.info.last_name,
            dateOfBirth: res.docUser.info.date_of_birth
          });
          commit("SET_CONNECTIONS", {
            adobeConnectionId: res.docUser.connections.adobe_connection_id,
            ekigaId: res.docUser.connections.ekiga_id,
            vSeeId: res.docUser.connections.vsee_id,
            mikogoId: res.docUser.connections.mikogo_id
          });
          commit("SET_TYPE", {
            type: res.docUser.priviledges.type,
            studentId: res.docUser.priviledges.student_id,
            teacherId: res.docUser.priviledges.teacherId
          });
        });
    },

    register({ dispatch }, payload) {
      axios
        .post("/user/register", {
          displayName: payload.displayName,
          email: payload.email,
          phoneNumber: payload.phoneNumber,
          password: payload.password
        })
        .then(res => dispatch("logIn", payload))
        .catch(e => console.log(e));
    }
  },
  getters: {}
};
