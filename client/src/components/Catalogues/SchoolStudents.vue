<template lang="pug">
include ../../assets/locale/FA.pug

div.mainDiv
    h2.pageTitle
        v-icon.icon
            |mdi-bus-school
        |#{STR_studentCatHeader}
    v-sheet(elevation="2" class="d-flex align-content-start flex-wrap")
        v-card(v-for="student in schoolStudents" :key="student.studentId")
            v-card-title
                |{{ student.firstName }} {{ student.lastName}}
            v-card-subtitle
                |{{ student.grade }}
            v-card-actions
                v-btn(color="primary" medium :to="'/redirect/to/profile/' + student.userId ")=STR_toStudentProfile
                    v-icon.icon
                        |mdi-card-account-details
                v-btn(color="red" medium v-if="onIsSchool(course.schoolId)" @click="onDeleteStudent(student.studentId)")=STR_delete
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
  title: FA.titles.viewStudents,
  data: () => ({}),
  computed: {
    schoolStudents: function() {
      return this.$store.getters.getSchoolStudents;
    },
    schoolId: function() {
      return this.$store.getters.getSchoolId;
    }
  },
  methods: {
    onDeleteStudent: function(studentId) {
      axios
        .delete(
          `/school/delete/student/${schoolId}`,
          { blank: "blank" },
          {
            headers: {
              "x-auth-token-school": localStorage.getItem("schoolToken")
            }
          }
        )
        .then(() => {
          this.snackBar = true;
          this.snackBarText = FA.studentDeleted;
        })
        .catch(e => {
          this.snackBar = true;
          this.snackBarText = e;
        });
    },
    onIsSchool: function(studentSchoolId) {
      return this.schoolId === studentSchoolId;
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
