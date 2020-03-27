<template lang="pug">
include ../../assets/locale/FA.pug
div.mainDiv
    h2.pageTitle
        v-icon.icon
            |mdi-bus-school
        |#{STR_profileSchoolHeader}
    v-card.flex-column.text-start(class="d-flex pa-10 ma-10")
        h3
            |#[v-icon="mdi-account"] #{STR_schoolInfoTitle}
        v-card-title
            |#{STR_schoolName}: {{ info.name }}
            |#{STR_schoolGrade}: {{ info.grade }}
            |#{STR_schoolLandline}: {{ info.landlineNumber }}
            |#{STR_schoolAddress}: {{ info.address }}

        v-btn(to="/set/info-school" color="primary" v-if="userIsLoaded" large fab)
          v-icon.icon
            |mdi-circle-edit-outline
</template>
<script>
import FA from "../../assets/locale/FA"
export default {
  name: "ProfileSchool",
  title: FA.titles.profileSchool,
  data: () => ({}),
  computed: {
    info: function() {
      return this.$store.getters.getSchoolInfo;
    }
  }
};
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', '../../assets/fonts/Yekan')

body, .pageTitle, .mainDiv
    font-family: 'Yekan', Tahoma, sans-serif

.pageTitle
    display: flex
    margin-right: 1rem

.icon
    margin-left: 0.5rem
</style>
