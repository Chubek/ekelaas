<template lang="pug">
include ../../assets/locale/FA.pug

div.mainDiv
  h2.pageTitle
    v-icon.icon
      |mdi-alpha-c-circle-outline
    |#{STR_coursePageHeader}


  v-col(cols="8" md="5" sm="3")
    v-card(class="ml-2 pa-3 courseCard" color="blue")
      v-card-title
        |{{courseInfo.subject}}
        br/
        |{{courseInfo.description}}
      v-card-actions
        v-btn(:href="courseURL" color="yellow")=STR_connectURL
          v-icon(right).icon
            |mdi-adobe
        v-btn(@click="onDeleteCourse" color="red")=STR_delete
          v-icon(right).icon
            |mdi-delete

  hr
  v-card.inputHolder.d-flex.justify-center.text-end(class="d-flex pa-10 ma-10")
    v-card-actions(v-if="teacherIsCreator" class="ml-12")            
      v-btn(color="primary" large fab :to="'/set/class/' + courseId")
        v-icon.icon
          |mdi-circle-edit-outline
    v-simple-table(dense)        
      tbody
      tr
        th=STR_session
        th=STR_classDate
        th=STR_classHour
        th=STR_classParticipants
        th=STR_classNotes
        tr(v-for="(courseClass, index) in courseClasses" :key="index")
          td
            p="{{index + 1}}"
          td
            |{{ courseClass.classDate }}
          td
            |{{ courseClass.classHour }}                            
          td            
            v-btn(color="green" dark medium @click.stop="dialogModel = true; indexClassParticipants = courseClass.classParticipants")=STR_view
                  v-icon(right).icon
                    |mdi-eye
            
          td
            |{{ courseClass.classNotes }}

    v-dialog(v-model="dialogModel" light overlay-opacity=0)                
              v-simple-table.studentTable
                tr(v-for="(student, index) in indexClassParticipants")
                  td
                    |{{ index + 1}}
                  td
                    |{{ student }}
              v-btn(color="primary" small @click.stop="dialogModel = false" dark)=STR_close
                v-icon(right).icon
                  |mdi-close-thick

</template>
<script>
import FA from "../../assets/locale/FA";
import axios from "axios";
export default {
  name: "CoursePage",
  title: FA.titles.viewCourse,
  data: () => ({
    courseData: null,
    classData: null,
    dataIsReady: false,
    dialogModel: false,
    indexClassParticipants: null
  }),
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.$store.dispatch("loadCourse", vm.$route.params.courseId);
    });
  },
  methods: {
    onDeleteCourse: function() {
      axios
        .delete(`/school/delete/course/${this.courseId}`, {
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
    openDialog: function(index) {
      console.log(this.dialogModel[index]);
      this.dialogModel[index] = true;
    },
    closeDialog: function(index) {
      console.log(this.dialogModel[index]);
      this.dialogModel[index] = false;
    }
  },
  computed: {
    courseInfo: function() {
      return this.$store.getters.getCourseInfo;
    },
    courseClasses: function() {
      return this.$store.getters.getCourseClasses;
    },
    courseId: function() {
      return this.$store.getters.getCourseId;
    },
    teacherId: function() {
      return this.$store.getters.getTeacherId;
    },
    courseTeacherId: function() {
      return this.$store.getters.getCourseTeacher._id;
    },
    teacherIsCreator: function() {
      return this.teacherId === this.courseTeacherId;
    },
    courseURL: function() {
      return this.$store.getters.getCourseURL;
    }
  }
};
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', '../../assets/fonts/Yekan')

body, .mainDiv, .studentTable
  font-family: 'Yekan', Tahoma, sans-serif


.pageTitle, .pageSubTitle
  display: flex
  margin-right: 1rem

.icon
  margin-left: 0.5rem

</style>
