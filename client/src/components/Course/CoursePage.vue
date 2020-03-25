<template lang="pug">
include ../../assets/locale/FA.pug

div.mainDiv
    h2.pageTitle
        v-icon.icon
            |mdi-alpha-c-circle-outline
        |#{STR_coursePageHeader}
    v-card.inputHolder.d-flex.justify-center.text-end(class="d-flex pa-10 ma-10")
        h3.pageSubTitle
            v-icon.icon
                |mdi-checkbox-multiple-blank-circle
            |#{STR_courseInfo}
        v-card-title
            |#{STR_subject}: {{ courseInfo.subject }}
        v-card-subtitle
            |#{STR_description}: {{ courseInfo.STR_description }}
            br/
            |#{STR_price}: {{ courseInfo.price }}
        v-card-actions(v-if="teacherIsCreator")
            v-btn(color="primary" large fab to="'/edit/info-course/' + courseId")
                v-icon.icon 
                    |mdi-circle-edit-outline

    hr
    v-card.inputHolder.d-flex.justify-center.text-end(class="d-flex pa-10 ma-10")
        v-card-actions(v-if="teacherIsCreator")            
            v-btn(color="primary" large fab to="'/set/class/' + courseId")
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
                      tr(v-for="(class, index) in courseClasses" :key="index")
                          td
                             p="{{index + 1}}"
                          td
                            class.classDate
                          td
                            class.STR_classHour                            
                          td
                            class.classParticipants
                          td
                            class.classNotes
                         


</template>
<script>
export default {
  name: "CoursePage",
  data: () => ({}),
  computed: {
    courseInfo: function() {
      return this.$store.getters.getCourseInfo;
    },
    courseClasses: function() {
      return this.$store.getters.getCourseClasses;
    },
    teacherId: function() {
      return this.$store.getters.getTeacherId;
    },
    courseTeacherId: function() {
      return this.$store.getters.getCourseTeacher;
    },
    teacherIsCreator: function() {
      return this.teacherId === this.courseTeacherId;
    }
  }
};
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', '../../assets/fonts/Yekan')

body, .mainDiv
    font-family: 'Yekan', Tahoma, sans-serif


.pageTitle, .pageSubTitle
    display: flex
    margin-right: 1rem

.icon
    margin-left: 0.5rem

</style>
