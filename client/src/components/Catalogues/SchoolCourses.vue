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

</template>
<script>
export default {
  name: "SchoolStudents",
  data: () => ({}),
  computed: {
    schoolCourses: function() {
      return this.$store.getters.getSchoolCourses;
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
