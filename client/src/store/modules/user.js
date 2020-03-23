import axios from "axios";
import FA from "../../assets/locale/FA";

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
      firstName: FA.STR_firstName,
      lastName: FA.STR_lastName,
      dateOfBirth: new Date().toISOString().substr(0, 10)
    },
    referralCode: String,
    type: String,
    typeId: String,

    loadedUser: {
      loadedUserId: String,
      loadedUserStudentId: String,
      loadedUserTeacherId: String,
      loadedUserType: String,
      loadedUserEmail: String,
      loadedUserPhoneNumber: Number,
      loadedUserInfo: Object,
      loadedUserStudentInfo: Object,
      loadedUserTeacherInfo: Object
    },
    autoCompleteUsers: []
  },
  mutations: {
    SET_LOADED_USER(state, payload) {
      console.log("LOADED USER CALLED");
      state.loadedUser.loadedUserId = payload.loadedUserId;
      state.loadedUser.loadedUserEmail = payload.loadedUserEmail;
      state.loadedUser.loadedUserPhoneNumber = payload.loadedUserPhoneNumber;
      state.loadedUser.loadedUserStudentId = payload.loadedUserStudentId;
      state.loadedUser.loadedUserTeacherId = payload.loadedUserTeacherId;
      state.loadedUser.loadedUserInfo = payload.loadedUserInfo;
      state.loadedUser.loadedUserStudentInfo = payload.loadedUserStudentInfo;
      state.loadedUser.loadedUserTeacherInfo = payload.loadedUserTeacherInfo;
      state.loadedUser.loadedUserType = payload.loadedUserType;
    },

    SET_USER_DATA(state, payload) {
      state.userData = payload;
    },

    SET_USER_INFO(state, payload) {
      state.info = payload;
    },

    SET_REFERRAL_CODE(state, payload) {
      state.referralCode = payload;
    },

    SET_TYPE(state, payload) {
      state.type = payload.type;
    },

    SET_TYPE_ID(state, payload) {
      console.log("pld_type", payload.type);
      if (payload.type === "Student") {
        state.typeId = payload.studentId;
      } else if (payload.type === "Teacher") {
        state.typeId = payload.teacherId;
      } else if (state.type === "Not Set") {
        state.typeId = "None";
      }
    },

    SET_AUTO_COMPLETE_USERS(state, payload) {
      payload.forEach(user => {
        if (user.types.type === "Student") {
          if (user.info.firstName || user.info.lastName) {
            state.autoCompleteUsers.push(
              user.displayName +
                " " +
                "(" +
                user.info.firstName +
                " " +
                user.info.lastName +
                ")"
            );
          } else {
            state.autoCompleteUsers.push(user.displayName);
          }
        }
      });
    }
  },
  actions: {
    logIn({ dispatch, commit, state }, payload) {
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
            state.loggedIn = true;
            commit("SET_USER_DATA", {
              userId: res.data.docUser._id,
              displayName: res.data.docUser.displayName,
              email: res.data.docUser.email,
              phoneNumber: res.data.docUser.phoneNumber,
              verified: res.data.docUser.verified
            });

            if (!res.data.docUser.justCreated) {
              commit("SET_USER_INFO", {
                firstName: res.data.docUser.info.firstName,
                lastName: res.data.docUser.info.lastName,
                dateOfBirth: res.data.docUser.info.dateOfBirth
              });
            }

            commit("SET_TYPE", {
              type: res.data.docUser.types.type
            });
            commit("SET_TYPE_ID", {
              type: res.data.docUser.types.type,
              studentId: res.data.docUser.types.studentId,
              teacherId: res.data.docUser.types.teacherId
            });
            dispatch("loadType");
          })
          .catch(e => {
            if (e.response.status == 403) {
              reject(FA.STR_enterPassword);
            } else if (e.response.status == 400) {
              reject(FA.STR_enterPDE);
            } else if (e.response.status == 404) {
              reject(FA.STR_noUser);
            } else if (e.response.status == 401) {
              reject(FA.STR_incorrectPassword);
            }
            console.log(e);
          });
      });
    },

    logInOnCreate({ dispatch, commit, state }) {
      axios
        .post("/user/auth/on/create", {
          jwt: localStorage.getItem("token")
        })
        .then(res => {
          console.log("loginres", res);
          state.loggedIn = true;
          commit("SET_USER_DATA", {
            userId: res.data.docUser._id,
            displayName: res.data.docUser.displayName,
            email: res.data.docUser.email,
            phoneNumber: res.data.docUser.phoneNumber,
            verified: res.data.docUser.verified
          });
          if (!res.data.docUser.justCreated) {
            commit("SET_USER_INFO", {
              firstName: res.data.docUser.info.firstName,
              lastName: res.data.docUser.info.lastName,
              dateOfBirth: res.data.docUser.info.dateOfBirth
            });
          }
          commit("SET_TYPE", {
            type: res.data.docUser.types.type
          });
          commit("SET_TYPE_ID", {
            type: res.data.docUser.types.type,
            studentId: res.data.docUser.types.studentId,
            teacherId: res.data.docUser.types.teacherId
          });
          dispatch("loadType");
        });
    },

    logInOnRegister({ dispatch, commit, state }, payload) {
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
          state.loggedIn = true;
          commit("SET_USER_DATA", {
            userId: res.data.docUser._id,
            displayName: res.data.docUser.displayName,
            email: res.data.docUser.email,
            phoneNumber: res.data.docUser.phoneNumber,
            verified: res.data.docUser.verified
          });
          commit("SET_TYPE", {
            type: res.data.docUser.types.type,
            studentId: res.data.docUser.types.studentId,
            teacherId: res.data.docUser.types.teacherId
          });
          commit("SET_TYPE_ID", {
            type: res.data.docUser.types.type,
            studentId: res.data.docUser.types.studentId,
            teacherId: res.data.docUser.types.teacherId
          });
          dispatch("loadType");
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
              resolve({
                message: FA.STR_userCreated,
                id: res.data.docUser._id
              });
            }
            dispatch("logInOnRegister", payload);
          })
          .catch(e => {
            if (e.response.status == 401 && e.response.data.isSame === "user") {
              reject(FA.STR_userExists);
            } else if (e.response.status == 403) {
              reject(FA.STR_pleaseEnterInfo);
            } else if (
              e.response.status == 401 &&
              e.response.data.isSame === "displayName"
            ) {
              reject(FA.STR_displayNameExists);
            } else if (
              e.response.status == 401 &&
              e.response.data.isSame === "email"
            ) {
              reject(FA.STR_emailExists);
            } else if (
              e.response.status == 401 &&
              e.response.data.isSame === "phoneNumber"
            ) {
              reject(FA.STR_phoneNumberExists);
            }
            console.log(e);
          });
      });
    },

    loadType({ dispatch, state }) {
      console.log("typeId", state.typeId);
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
              resolve(FA.STR_infoEntered);
            }
          })
          .catch(e => {
            if (e.response.status == 401) {
              reject(FA.STR_pleaseEnterInfo);
              console.log("No data entered.");
            }
            console.log(e);
          });
      });
    },

    loadUser({ commit }, payload) {
      console.log("action", "ACTIONED");
      axios.get(`/user/single/${payload}`).then(resUser => {
        console.log("resUser", resUser);
        if (resUser.data.userDoc.types.type === "Student") {
          console.log("studnt check");
          axios
            .get(`/student/single/${resUser.data.userDoc.types.studentId}`)
            .then(resStudent => {
              console.log("resStudent", resStudent);
              commit("SET_LOADED_USER", {
                loadedUserId: resUser.data.userDoc._id,
                loadedUserEmail: resUser.data.userDoc.email,
                loadedUserType: resUser.data.userDoc.types.type,
                loadedUserPhoneNumber: resUser.data.userDoc.phoneNumber,
                loadedUserInfo: resUser.data.userDoc.info,
                loadedUserStudentId: resUser.data.userDoc.types.studentId,
                loadedUserStudentInfo: resStudent.data.studentDoc.info
              });
            })
            .catch(e => console.log(e));
        } else if (resUser.data.userDoc.types.type === "Teacher") {
          //const teacherId = resUser.data.userDoc.types.teacherId;
          axios
            .get(`/teacher/single/${resUser.data.userDoc.types.teacherId}`)
            .then(resTeacher => {
              console.log("resTeacher", resTeacher);
              commit("SET_LOADED_USER", {
                loadedUserId: resUser.data.userDoc._id,
                loadedUserEmail: resUser.data.userDoc.email,
                loadedUserPhoneNumber: resUser.data.userDoc.phoneNumber,
                loadedUserType: resUser.data.userDoc.types.type,
                loadedUserInfo: resUser.data.userDoc.info,
                loadedUserTeacherId: resUser.data.userDoc.types.teacherId,
                loadedUserTeacherInfo: resTeacher.data.teacherDoc.info
              });
            });
        } else if (resUser.data.userDoc.types.type === "Not Set") {
          console.log("hell", "hell");
          commit("SET_LOADED_USER", {
            loadedUserId: resUser.data.userDoc._id,
            loadedUserEmail: resUser.data.userDoc.email,
            loadedUserType: resUser.data.userDoc.types.type,
            loadedUserPhoneNumber: resUser.data.userDoc.phoneNumber,
            loadedUserInfo: {
              firstName: FA.STR_notEntered,
              lastName: FA.STR_notEntered,
              referralCode: FA.STR_notEntered,
              dateOfBirth: new Date().toISOString().substr(0, 10)
            }
          });
        }
      });
    },

    logOut({ commit, state }) {
      localStorage.removeItem("token");
      state.loggedIn = false;
      commit("SET_USER_DATA", null);
      commit("SET_USER_INFO", null);
    },

    loadAutoCompleteUsers({ commit }) {
      axios.get("/user/all").then(res => {
        console.log("docuSers", res);
        commit("SET_AUTO_COMPLETE_USERS", res.data.docUsers);
      });
    }
  },
  getters: {
    getLoggedIn: state => {
      return state.loggedIn;
    },
    getUserInfo: state => {
      return state.info;
    },
    getLoadedUser: state => {
      return state.loadedUser;
    },
    getUserId: state => {
      return state.userData.userId;
    },
    getUserType: state => {
      return state.type;
    },
    getAutoCompleteUsers: state => {
      return state.autoCompleteUsers;
    }
  }
};

export default UserModule;
