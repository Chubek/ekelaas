<template lang="pug">
include ../../assets/locale/FA.pug

div.mainDiv(v-if="dataIsLoaded")
  h2.pageTitle
    v-icon.icon
      |mdi-bus-school
    |#{STR_studentCatHeader}    
  v-lazy(v-model="lazyActive" class="mt-12" :options="{ threshold: .5 }" min-height="200" transition="fade-transition")
    v-sheet(elevation="2" class="d-flex align-content-start flex-wrap")
      h4(v-if="noStudent")=STR_noStudent
      v-container(fluid)
        v-row
          v-col(cols="12")
            v-row
              v-card(v-for="(student, index) in studentData" :key="student.studentId" :color="onGenerateCardColor()" class="ma-3 pa-3")
                v-card-title
                  |{{ student.firstName }} {{ student.lastName }}                 
                hr
                v-card-actions
                  v-btn(:color="onGenerateCPColor()" medium :to="'/profile/' + student.userId ")=STR_toStudentProfile
                    v-icon(right).icon
                      |mdi-flask
                  v-btn(:color="onGenerateRMColor()" medium v-if="onIsSchool(student.schoolId)" @click="onDeleteStudent(student.studentId, index)")=STR_delete
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
  title: FA.titles.viewStudents,
  data: () => ({
    snackBar: false,
    snackBarText: null,
    lazyActive: false,
    noStudent: true,
    studentData: null,
    dataIsLoaded: false
  }),
  beforeRouteEnter: (to, from, next) => {
    console.log("before");
    next(vm => {
      console.log("vm", vm.$store.getters.getSchoolStudents);
      vm.fetchStudentData(vm.$store.getters.getSchoolStudents);
    });
  },
  computed: {
    getSchoolStudents: function() {
      return this.$store.getters.getSchoolStudents;
    },
    schoolId: function() {
      return this.$store.getters.getSchoolId;
    },
    isStudent: function() {
      return this.$store.getters.getUserType === "Student";
    },
    isSchool: function() {
      return this.$store.getters.getSchoolIsLoggedIn;
    }
  },
  methods: {
    onDeleteStudent: function(studentId, index) {
      axios
        .delete(`/school/delete/student/${studentId}`, {
          headers: {
            "x-auth-token-school": localStorage.getItem("schoolToken")
          }
        })
        .then(() => {
          this.snackBar = true;
          this.snackBarText = FA.studentDeleted;
          this.$store.dispatch("removeFromStudents", this.studentData[index]);
          this.studentData.delete(this.studentData[index]);
        })
        .catch(e => {
          this.snackBar = true;
          this.snackBarText = e;
        });
    },
    onIsSchool: function(studentSchoolId) {
      return this.schoolId === studentSchoolId && this.isSchool;
    },
    fetchStudentData: function(studentData) {
      this.studentData = studentData;
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
    studentData: function(newCD) {
      if (newCD.length > 0) {
        this.noStudent = false;
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
