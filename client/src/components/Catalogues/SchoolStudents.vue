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

</template>
<script>
export default {
  name: "SchoolStudents",
  data: () => ({}),
  computed: {
    schoolStudents: function() {
      return this.$store.getters.getSchoolStudents;
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
