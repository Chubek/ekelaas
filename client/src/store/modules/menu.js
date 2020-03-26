import FA from "../../assets/locale/FA";

const MenuModule = {
  state: {
    guestLinks: {
      home: {
        text: FA.STR_home,
        link: "/",
        icon: "mdi-home"
      },
      login: {
        text: FA.STR_logIn,
        link: "/login",
        icon: "mdi-login"
      },
      loginSchool: {
        text: FA.STR_logInSchool,
        link: "/school/login",
        icon: "mdi-bus-school"
      },
      about: {
        text: FA.STR_about,
        link: "/about",
        icon: "mdi-information"
      },
      contact: {
        text: FA.STR_contact,
        link: "/contact",
        icon: "mdi-email"
      }
    },
    userLinks: {
      home: {
        text: FA.STR_home,
        link: "/",
        icon: "mdi-home"
      },
      profile: {
        text: FA.STR_profile,
        link: null,
        icon: "mdi-card-account-details"
      },
      students: {
        text: FA.STR_students,
        link: "/view/students",
        icon: "mdi-alarm-bell"
      },
      teachers: {
        text: FA.STR_teachers,
        link: "/view/teachers",
        icon: "mdi-hail"
      },
      courses: {
        text: FA.STR_courses,
        link: "/view/courses",
        icon: "mdi-chair-school"
      },
      about: {
        text: FA.STR_about,
        link: "/about",
        icon: "mdi-information"
      },
      contact: {
        text: FA.STR_contact,
        link: "/contact",
        icon: "mdi-email"
      },
      logOut: {
        text: FA.STR_logOut,
        link: "/logout",
        icon: "mdi-logout"
      }
    },
    schoolLinks: {
      home: {
        text: FA.STR_home,
        link: "/",
        icon: "mdi-home"
      },
      profile: {
        text: FA.STR_profileSchool,
        link: "/school/profile",
        icon: "mdi-card-account-details"
      },
      students: {
        text: FA.STR_students,
        link: "/view/students",
        icon: "mdi-alarm-bell"
      },
      teachers: {
        text: FA.STR_teachers,
        link: "/view/teachers",
        icon: "mdi-hail"
      },
      courses: {
        text: FA.STR_courses,
        link: "/view/courses",
        icon: "mdi-chair-school"
      },
      about: {
        text: FA.STR_about,
        link: "/about",
        icon: "mdi-information"
      },
      contact: {
        text: FA.STR_contact,
        link: "/contact",
        icon: "mdi-email"
      },
      logOut: {
        text: FA.STR_logOut,
        link: "/school-logout",
        icon: "mdi-logout"
      }
    }
  },
  mutations: {
    SET_PROFILE_ID(state, payload) {
      state.userLinks.profile.link = `/redirect/to/profile/${payload}`;
    }
  },
  actions: {
    setProfileId({ commit }, payload) {
      commit("SET_PROFILE_ID", payload);
    }
  },
  getters: {
    getGuestLinks: state => {
      return state.guestLinks;
    },
    getUserLinks: state => {
      return state.userLinks;
    },
    getSchoolLinks: state => {
      return state.schoolLinks;
    }
  }
};

export default MenuModule;
