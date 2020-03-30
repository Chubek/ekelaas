<template lang="pug">
include ../../assets/locale/FA.pug

div.mainDiv(v-if="dataIsLoaded")
    h2.pageTitle
        v-icon.icon
            |mdi-bus-school
        |#{STR_courseCatHeader}
    v-btn(to="/set/info-course" large color="green" class="addButton" v-if="isTeacher" x-small fab)
      v-icon(x-large dark).iconButton
        |mdi-plus
    v-lazy(v-model="lazyActive" class="mt-12" :options="{ threshold: .5 }" min-height="200" transition="fade-transition")
      v-sheet(elevation="2" class="d-flex align-content-start flex-wrap")
          h4(v-if="noCourse")=STR_noCourse
          v-card(v-for="course in courseData" :key="course.courseId" :color="onGenerateCardColor()" class="ma-3 pa-3")
              v-card-title
                  |{{ course.subject }}
              v-card-subtitle
                  |{{ course.description }}
                  hr
                  v-btn(:color="onGenerateConnectButtonColor()" :href="course.url" class="mt-2")=STR_connectURL
                    v-icon(right).icon
                      |mdi-adobe
              hr
              v-card-actions
                  v-btn(:color="onGenerateCPColor()" medium :to="'/profile-course/' + course.courseId ")=STR_toCoursePage
                      v-icon(right).icon
                          |mdi-chair-school
                  v-btn(:color="onGenerateRMColor()" medium v-if="onIsSchool(course.schoolId)" @click="onDeleteCourse(course.courseId)")=STR_delete
                      v-icon(right).icon
                          |mdi-delete


    v-snackbar(v-model="snackBar")
        |{{snackBarText}} #[v-btn(color="pink" @click="snackBar = false")=STR_ok]
</template>
<script>
import axios from "axios";
import FA from "../../assets/locale/FA";
import _ from "lodash";
export default {
  name: "SchoolStudents",
  title: FA.titles.viewCourse,
  data: () => ({
    snackBar: false,
    snackBarText: null,
    lazyActive: false,
    noCourse: true,
    courseData: null,
    dataIsLoaded: false
  }),
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.fetchCourseData(vm.$store.getters.getSchoolCourses);
    });
  },
  computed: {
    schoolCourses: function() {
      return this.$store.getters.getSchoolCourses;
    },
    schoolId: function() {
      return this.$store.getters.getSchoolId;
    },
    isTeacher: function() {
      return this.$store.getters.getUserType === "Teacher";
    },
    isSchool: function() {
      return this.$store.getters.getSchoolIsLoggedIn;
    }
  },
  methods: {
    onDeleteCourse: function(courseId) {
      axios
        .delete(`/school/delete/course/${courseId}`, {
          headers: {
            "x-auth-token-school": localStorage.getItem("schoolToken")
          }
        })
        .then(() => {
          this.snackBar = true;
          this.snackBarText = FA.courseDeleted;
        })
        .catch(e => {
          this.snackBar = true;
          this.snackBarText = e;
        });
    },
    onIsSchool: function(courseSchoolId) {
      return this.schoolId === courseSchoolId && this.isSchool;
    },
    fetchCourseData: function(courseData) {
      this.courseData = courseData;
      this.dataIsLoaded = true;
    },
    onGenerateCardColor: function() {
      return `teal lighten-${_.random(0, 5)}`;
    },
    onGenerateConnectButtonColor: function() {
      return `cyan lighten-${_.random(0, 5)}`;
    },
    onGenerateCPColor: function() {
      return `indigo lighten-${_.random(0, 5)}`;
    },
    onGenerateRMColor: function() {
      return `light-blue lighten-${_.random(0, 5)}`;
    }
  },
  watch: {
    courseData: function(newCD) {
      if (newCD.length > 0) {
        this.noCourse = false;
      }
    }
  }
};
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', '../../assets/fonts/Yekan')

body, .mainDiv
  font-family: 'Yekan', Tahoma, sans-serif


.pageTitle
  display: flex
  margin-right: 1rem

.icon
  margin-left: 0.5rem

.addButton
  position: absolute
  left: 2%
  bottom: 5%
  margin-right: 20px













































































































</style>
