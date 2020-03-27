<template lang="pug">
include ../../assets/locale/FA.pug

div.mainDiv
    h2.pageTitle
        v-icon.icon
            |mdi-bus-school
        |#{STR_teacherCatHeader}
    v-sheet(elevation="2" class="d-flex align-content-start flex-wrap")
        v-card(v-for="teacher in schoolTeachers" :key="teacher.teacherId")
            v-card-title
                |{{ teacher.firstName }} {{ teacher.lastName}}            
            v-card-actions
                v-btn(color="primary" medium :to="'/redirect/to/profile/' + teacher.userId ")=STR_toTeacherProfile
                    v-icon.icon
                        |mdi-card-account-details

                v-btn(color="red" medium v-if="onIsSchool(course.schoolId)" @click="onDeleteTeacher(teacher.teacherId)")=STR_delete
                    v-icon.icon
                        |mdi-delete

    v-snackbar(v-model="snackBar")
        |{{snackBarText}} #[v-btn(color="pink" @click="snackBar = false")=STR_ok]

</template>
<script>
import axios from "axios";
import FA from "../../assets/locale/FA";

export default {
  name: "TeacherStudents",
  title: FA.titles.viewTeachers,
  data: () => ({}),
  computed: {
    schoolTeachers: function() {
      return this.$store.getters.getSchoolTeachers;
    },
    schoolId: function() {
      return this.$store.getters.getSchoolId;
    }
  },
  methods: {
    onDeleteCourse: function(teacherId) {
      axios
        .delete(
          `/school/delete/teacher/${teacherId}`,
          { blank: "blank" },
          {
            headers: {
              "x-auth-token-school": localStorage.getItem("schoolToken")
            }
          }
        )
        .then(() => {
          this.snackBar = true;
          this.snackBarText = FA.teacherDeleted;
        })
        .catch(e => {
          this.snackBar = true;
          this.snackBarText = e;
        });
    },
    onIsSchool: function(teacherSchoolId) {
      return this.schoolId === teacherSchoolId;
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
