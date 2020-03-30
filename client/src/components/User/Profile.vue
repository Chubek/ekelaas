<template lang="pug">
include ../../assets/locale/FA.pug
div.mainDiv
    h2.pageTitle
        v-icon.icon
          |mdi-card-account-details-outline
        |#{STR_profileHeader}
    v-card.flex-column.text-start(class="d-flex pa-10 ma-10" v-if="userDataIsReady")
        v-btn(color="blue" dark x-large @click="onMakeStudent" class="flex-nowrap" :disabled="!loadedIsNone" v-if="userIsLoaded && loadedIsNone")=STR_makeStudent
        br/
        v-btn(color="blue" dark x-large @click="onMakeTeacher" class="flex-nowrap" :disabled="!loadedIsNone" v-if="userIsLoaded && loadedIsNone")=STR_makeTeacher
        br/
        h3
            |#[v-icon="mdi-account"] #{STR_infoTitle} 
        v-card-title
            |#{STR_firstName}: {{ userData.firstName }}
            br/
            |#{STR_lastName}: {{ userData.lastName}}
            br/
            |#{STR_dateOfBirth}: {{ dateOfBirth }}
        v-card-subtitle(v-if="isTeacher || isSchool || userIsLoaded")
            |#{STR_phoneNumber}: {{phoneNumber}}
            br/
            |#{STR_email}: {{email}}
        v-btn(to="/set/info" color="primary" class="editButton" v-if="userIsLoaded" medium fab)
          v-icon.icon
            |mdi-circle-edit-outline
    v-card.flex-column.text-start(class="d-flex pa-10 ma-10" v-if="loadedIsStudent && studentDataIsReady")        
        h3.pageSubTitle
            |#[v-icon="mdi-bus-school"] #{STR_studentTitle}
        v-card-title
            |#{STR_grade}: {{ studentData.grade }}
            br/
            |#{STR_province}: {{ studentData.province }}
            br/            
            |#{STR_city}: {{ studentData.city }}
            br/
            |#{STR_school}: {{ studentInfo.school }}
        v-btn(to="/edit/info-student" color="primary" class="editButton" v-if="isStudent && userIsLoaded" medium fab)
          v-icon.icon
            |mdi-circle-edit-outline
    v-card.inputHolder.flex-column.text-start(class="d-flex pa-10 ma-10" v-if="loadedIsTeacher && teacherDataIsReady")
        
        br/
        h3.pageSubTitle
            |#[v-icon="mdi-feather"] #{STR_teacherTitle}
        br/
        h5 
          |#{STR_credits}: #[br/]
        v-card(v-for="(credit, index) in teacherData.credits" :key="(index * 5) + 1" style='white-space:pre;')
           v-card-title
            |{{ credit }} 
        br/           
        h5
          |#{STR_degrees}:            
        v-card(v-for="(degree, index) in teacherData.degrees" style='white-space:pre;' :key="(index * 10) + 2")
          v-card-title
            |{{ degree }}
        v-btn(to="/edit/info-teacher" color="primary" class="editButton" v-if="isTeacher && userIsLoaded" medium fab)
          v-icon.icon
            |mdi-circle-edit-outline


</template>
<script>
import moment from "jalali-moment";
import _ from "lodash";
import FA from "../../assets/locale/FA";
export default {
  name: "Profile",
  title: FA.titles.profile,
  data: () => ({
    userData: null,
    studentData: null,
    teacherData: null,
    userDataIsReady: false,
    studentDataIsReady: false,
    teacherDataIsReady: false,
    dateOfBirth: null
  }),
  computed: {
    isSchool: function() {
      return this.$store.getters.getSchoolIsLoggedIn;
    },
    isTeacher: function() {
      return this.$store.getters.getUserType === "Teacher";
    },
    isStudent: function() {
      return this.$store.getters.getUserType === "Student";
    },
    studentId: function() {
      let ret = null;
      if (this.isStudent) {
        ret = this.$store.getters.getStudentId;
      }
      return ret;
    },
    teacherId: function() {
      let ret = null;
      if (this.isTeacher) {
        ret = this.$store.getters.getTeacherId;
      }
      return ret;
    },
    email: function() {
      return this.$store.getters.getLoadedUser.loadedUserEmail;
    },
    phoneNumber: function() {
      return this.$store.getters.getLoadedUser.loadedUserPhoneNumber;
    },
    info: function() {
      return this.$store.getters.getLoadedUser.loadedUserInfo;
    },
    studentInfo: function() {
      return this.$store.getters.getLoadedUser.loadedUserStudentInfo;
    },
    teacherInfo: function() {
      return this.$store.getters.getLoadedUser.loadedUserTeacherInfo;
    },
    loadedIsTeacher: function() {
      const loadedType = this.$store.getters.getLoadedUser.loadedUserType;
      return loadedType === "Teacher";
    },
    loadedIsStudent: function() {
      const loadedType = this.$store.getters.getLoadedUser.loadedUserType;
      return loadedType === "Student";
    },
    loadedIsNone: function() {
      const loadedType = this.$store.getters.getLoadedUser.loadedUserType;
      return loadedType === "Not Set";
    },
    loadedTeacherId: function() {
      let ret = null;
      if (this.loadedIsTeacher) {
        ret = this.$store.getters.getLoadedUser.loadedUserTeacherId;
      }
      return ret;
    },
    loadedStudentId: function() {
      let ret = null;
      if (this.loadedIsStudent) {
        ret = this.$store.getters.getLoadedUser.loadedUserStudentId;
      }
      return ret;
    },
    loadedUserId: function() {
      return this.$store.getters.getLoadedUser.loadedUserId;
    },
    isFavorite: function() {
      let ret = false;
      console.log("loadedIsTeacher", this.loadedIsTeacher);
      const arr = this.$store.getters.getFavoriteTeachers;

      if (this.loadedIsTeacher && Array.isArray(arr) && arr.length > 0) {
        arr.forEach(teacher => {
          if (this.loadedTeacherId === teacher._id) {
            ret = true;
          }
        });
      }

      return ret;
    },
    isEngaged: function() {
      let ret = false;
      const arr = this.$store.getters.getFavoriteEngaged;

      if (this.loadedIsTeacher && Array.isArray(arr) && arr.length > 0) {
        arr.forEach(teacher => {
          if (this.loadedTeacherId === teacher._id) {
            ret = true;
          }
        });
      }

      return ret;
    },
    userIsLoaded: function() {
      return this.loadedUserId === this.$store.getters.getUserId;
    }
  },
  created: function() {
    this.$store.dispatch("loadUser", this.$route.params.userId);
    console.log(this.$route.params.userId);
  },
  mounted: function() {
    this.fetchUserData();
    this.fetchTeacherData();
    this.fetchStudentData();
    this.calculateDateOfBirth();
  },
  methods: {
    onAddTeacherFavorite: function() {
      this.$store.dispatch("pushFavoriteTeachers", {
        studentId: this.studentId,
        favoriteTeachers: [this.loadedTeacherId]
      });
      this.isFavorite = true;
    },
    onAddTeacherEngaged: function() {
      this.$store.dispatch("pushEngagedTeachers", {
        studentId: this.studentId,
        favoriteTeachers: [this.loadedTeacherId]
      });
      this.isEngaged = true;
    },
    onMakeStudent: function() {
      this.$router.push({ path: "/set/info-student" });
    },
    onMakeTeacher: function() {
      this.$router.push({ path: "/set/info-teacher" });
    },
    fetchUserData: function() {
      this.userData = this.$store.getters.getUserInfo;
      this.userDataIsReady = true;
    },
    fetchStudentData: function() {
      this.studentData = this.$store.getters.getStudentInfo;
      this.studentDataIsReady = true;
    },
    fetchTeacherData: function() {
      this.teacherData = this.$store.getters.getTeacherInfo;
      this.teacherDataIsReady = true;
    },
    calculateDateOfBirth: function() {
      let dOB = this.userData.dateOfBirth;
      dOB = _.replace(dOB, /-/g, "/");
      this.dateOfBirth = moment(dOB, "YYYY/MM/DD")
        .locale("fa")
        .format("YYYY/MM/DD");
    }
  },
  watch: {
    info: function(newUserData) {
      this.fetchUserData(newUserData);
    },
    studentInfo: function(newStudentData) {
      this.fetchStudentData(newStudentData);
    },
    teacherInfo: function(newTeacherData) {
      this.fetchTeacherData(newTeacherData);
    }
  }
};
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', '../../assets/fonts/Yekan')

body, .pageTitle, .mainDiv
  font-family: 'Yekan', Tahoma, sans-serif

.pageTitle
  display: flex
  margin-right: 1rem

.icon
  margin-left: 0.5rem

.editButton
  margin-top: 1rem
</style>
