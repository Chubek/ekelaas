import axios from "axios";

const UserModule = {
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
    SET_USER_DATA(state, payload) {
      state.userData = payload;
    },

    SET_USER_INFO(state, payload) {
      state.info = payload;
    },

    SET_REFERRAL_CODE(state, payload) {
      state.referralCode = payload;
    },

    SET_CONNECTIONS(state, payload) {
      state.connections = payload;
    },

    SET_TYPE(state, payload) {
      state.type = payload.type;

      if (payload.type == "Student") {
        state.typeId = payload.studentId;
      } else {
        state.typeId = payload.teacherId;
      }
    }
  },
  actions: {
    logIn({ dispatch, commit }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post("/user/auth", {
            displayName: payload.displayName,
            email: payload.email,
            phoneNumber: payload.phoneNumber,
            password: payload.password
          })
          .then(res => {
            resolve("شما وارد شدید.");
            localStorage.setItem("token", res.data.token);
            commit("SET_USER_DATA", {
              userId: res.data.docUser._id,
              displayName: res.data.docUser.display_name,
              email: res.data.docUser.email,
              phoneNumber: res.data.docUser.phone_number,
              verified: res.data.docUser.verified
            });
            commit("SET_USER_INFO", {
              firstName: res.data.docUser.info.first_name,
              lastName: res.data.docUser.info.last_name,
              dateOfBirth: res.data.docUser.info.date_of_birth
            });
            commit("SET_CONNECTIONS", {
              adobeConnectionId:
                res.data.docUser.connections.adobe_connection_id,
              ekigaId: res.data.docUser.connections.ekiga_id,
              vSeeId: res.data.docUser.connections.vsee_id,
              mikogoId: res.data.docUser.connections.mikogo_id
            });
            commit("SET_TYPE", {
              type: res.data.docUser.priviledges.type,
              studentId: res.data.docUser.priviledges.student_id,
              teacherId: res.data.docUser.priviledges.teacherId
            });
            dispatch("loadType");
          })
          .catch(e => {
            if (e.response.status == 401) {
              reject("لطفا پسوورد را وارد کنید.");
            } else if (e.response.status == 403) {
              reject("لطفا نام کاربری، ایمیل یا موبایل را وارد کنید.");
            } else if (e.response.status == 404) {
              reject("کاربری با این مشخصات وجود ندارد.");
            } else if (e.response.status == 407) {
              reject("پسوورد وارد شده اشتباه است.");
            }
            console.log(e);
          });
      });
    },

    logInOnCreate({ dispatch, commit }) {
      axios
        .post("/user/auth/on/create", {
          jwt: localStorage.getItem("token")
        })
        .then(res => {
          commit("SET_USER_DATA", {
            userId: res.data.docUser._id,
            displayName: res.data.docUser.display_name,
            email: res.data.docUser.email,
            phoneNumber: res.data.docUser.phone_number,
            verified: res.data.docUser.verified
          });
          commit("SET_USER_INFO", {
            firstName: res.data.docUser.info.first_name,
            lastName: res.data.docUser.info.last_name,
            dateOfBirth: res.data.docUser.info.date_of_birth
          });
          commit("SET_CONNECTIONS", {
            adobeConnectionId: res.data.docUser.connections.adobe_connection_id,
            ekigaId: res.data.docUser.connections.ekiga_id,
            vSeeId: res.data.docUser.connections.vsee_id,
            mikogoId: res.data.docUser.connections.mikogo_id
          });
          commit("SET_TYPE", {
            type: res.data.docUser.priviledges.type,
            studentId: res.data.docUser.priviledges.student_id,
            teacherId: res.data.docUser.priviledges.teacherId
          });
          dispatch("loadType");
        });
    },

    logInOnRegister({ commit }, payload) {
      axios
        .post("/user/auth", {
          displayName: payload.displayName,
          email: payload.email,
          phoneNumber: payload.phoneNumber,
          password: payload.password
        })
        .then(res => {
          console.log("res", res);
          localStorage.setItem("token", res.data.token);
          commit("SET_USER_DATA", {
            userId: res.data.docUser._id,
            displayName: res.data.docUser.display_name,
            email: res.data.docUser.email,
            phoneNumber: res.data.docUser.phone_number,
            verified: res.data.docUser.verified
          });
        });
    },

    register({ dispatch }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post("/user/register", {
            displayName: payload.displayName,
            email: payload.email,
            phoneNumber: payload.phoneNumber,
            password: payload.password
          })
          .then(res => {
            console.log("res", res);
            if (res.status == 200) {
              resolve("کاربر ساخته شد.");
            }
            dispatch("logInOnRegister", payload);
          })
          .catch(e => {
            if (e.response.status == 401) {
              reject("نام کاربری، ایمیل یا موبایل در پایگاه داده وجود دارد.");
            } else if (e.response.status == 403) {
              reject("لطفا اطلاعات را وارد کنید.");
            }
            console.log(e);
          });
      });
    },

    loadType({ dispatch, state }) {
      if (state.type == "Student") {
        dispatch("loadStudent", state.typeId);
      } else if (state.type == "Teacher") {
        dispatch("loadTeacher", state.typeId);
      }
    },

    setUserInfo({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .put(
            "/user/set/info",
            {
              firstName: payload.firstName,
              lastName: payload.lastName,
              dateOfBirth: payload.dateOfBirth,
              referralCode: payload.referralCode
            },
            { headers: { "x-auth-token": localStorage.getItem("token") } }
          )
          .then(res => {
            if (res.status == 200) {
              commit("SET_USER_INFO", payload);
              resolve("اطلاعات با موفقیت وارد شد.");
            }
          })
          .catch(e => {
            if (e.response.status == 401) {
              reject("لطفا اطلاعات را وارد کنید.");
              console.log("No data entered.");
            }
            console.log(e);
          });
      });
    }
  },
  getters: {
    getLoggedIn: state => {
      return state.loggedIn;
    },
    getUserInfo: state => {
      return state.info;
    }
  }
};

export default UserModule;
