<template lang="pug">
include ../../assets/locale/FA.pug

div.mainDiv(v-if="dataIsLoaded")
  h2.pageTitle
    v-icon.icon
      |mdi-bus-school
    |#{STR_courseCatHeader}    
  v-lazy(v-model="lazyActive" class="mt-12" :options="{ threshold: .5 }" min-height="200" transition="fade-transition")
    v-sheet(elevation="2" class="d-flex align-content-start flex-wrap")
      h4(v-if="noTeacher")=STR_noTeacher
      v-card(v-for="teacher in teacherData" :key="teacher.teacherId" :color="onGenerateCardColor()" class="ma-3 pa-3")
        v-card-title
          |{{ teacher.firstName }} {{ teacher.lastName }}                 
        hr
        v-card-actions
          v-btn(:color="onGenerateCPColor()" medium :to="'/profile/' + teacher.userId ")=STR_toTeacherProfile
            v-icon(right).icon
              |mdi-flask
          v-btn(:color="onGenerateRMColor()" medium v-if="onIsSchool(teacher.schoolId)" @click="onDeleteTeacher(teacher.teacherId)")=STR_delete
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
  name: "SchoolTeachers",
  title: FA.titles.viewTeachers,
  data: () => ({
    snackBar: false,
    snackBarText: null,
    lazyActive: false,
    noTeacher: true,
    teacherData: null,
    dataIsLoaded: false
  }),
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      console.log("vm", vm.$store.getters.getSchoolTeachers);
      vm.fetchTeacherData(vm.$store.getters.getSchoolTeachers);
    });
  },
  computed: {
    getSchoolTeachers: function() {
      return this.$store.getters.getSchoolTeachers;
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
    onDeleteTeacher: function(teacherId) {
      axios
        .delete(`/school/delete/teacher/${teacherId}`, {
          headers: {
            "x-auth-token-school": localStorage.getItem("schoolToken")
          }
        })
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
      return this.schoolId === teacherSchoolId && this.isSchool;
    },
    fetchTeacherData: function(teacherData) {
      this.teacherData = teacherData;
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
    teacherData: function(newCD) {
      if (newCD.length > 0) {
        this.noTeacher = false;
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
