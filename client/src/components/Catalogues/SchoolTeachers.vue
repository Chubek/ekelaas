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

</template>
<script>
export default {
  name: "TeacherStudents",
  data: () => ({}),
  computed: {
    schoolTeachers: function() {
      return this.$store.getters.getSchoolTeachers;
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
