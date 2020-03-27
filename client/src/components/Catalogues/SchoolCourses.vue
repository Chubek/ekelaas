<template lang="pug">
include ../../assets/locale/FA.pug

div.mainDiv
    h2.pageTitle
        v-icon.icon
            |mdi-bus-school
        |#{STR_teacherCatHeader}
    v-sheet(elevation="2" class="d-flex align-content-start flex-wrap")
        v-card(v-for="course in schoolCourses" :key="course.courseId")
            v-card-title
                |{{ course.subject }}
            v-card-subtitle
                |{{ course.description }}
                hr
                |{{ course.price }} STR_tomans
            v-card-actions
                v-btn(color="primary" medium :to="'/view/info-course/' + course.userId ")=STR_toCoursePage
                    v-icon.icon
                        |mdi-card-chair-school
                v-btn(color="red" medium v-if="onIsSchool(course.schoolId)" @click="onDeleteCourse(course.courseId)")=STR_delete
                    v-icon.icon
                        |mdi-delete


    v-snackbar(v-model="snackBar")
        |{{snackBarText}} #[v-btn(color="pink" @click="snackBar = false")=STR_ok]
</template>
<script>
import axios from "axios";
import FA from "../../assets/locale/FA";
export default {
  name: "SchoolStudents",
  title: FA.titles.viewCourse,
  data: () => ({
    snackBar: false,
    snackBarText: null
  }),
  computed: {
    schoolCourses: function() {
      return this.$store.getters.getSchoolCourses;
    },
    schoolId: function() {
      return this.$store.getters.getSchoolId;
    }
  },
  methods: {
    onDeleteCourse: function(courseId) {
      axios
        .delete(
          `/school/delete/course/${courseId}`,
          { blank: "blank" },
          {
            headers: {
              "x-auth-token-school": localStorage.getItem("schoolToken")
            }
          }
        )
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
      return this.schoolId === courseSchoolId;
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
</style>
