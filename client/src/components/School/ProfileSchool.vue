<template lang="pug">
include ../../assets/locale/FA.pug
div.mainDiv(v-if="dataIsLoaded")
    h2.pageTitle
        v-icon.icon
            |mdi-bus-school
        |#{STR_profileSchoolHeader}
    v-card.flex-column.text-start(class="d-flex pa-10 ma-10")
        h3
            |#[v-icon="mdi-account"] #{STR_schoolInfoTitle}
        v-card-title
            |#{STR_schoolName}: {{ name }}
            br/
            |#{STR_schoolGrade}: {{ grade }}
            br/
            |#{STR_schoolLandline}: {{ landlineNumber }}
            br/
            |#{STR_schoolAddress}: {{address }}

        v-btn(to="/set/info-school" color="primary" v-if="schoolIsLoaded" large fab)
          v-icon.icon
            |mdi-circle-edit-outline
</template>
<script>
import axios from "axios";
import FA from "../../assets/locale/FA";
export default {
  name: "ProfileSchool",
  title: FA.titles.profileSchool,
  data: () => ({
    schoolIsLoaded: false,
    dataIsLoaded: false,
    name: "",
    grade: "",
    landlineNumber: "",
    address: "",
    schoolInfo: null
  }),
  computed: {
    info: function() {
      return this.$store.getters.getSchoolInfo;
    },
    schoolId: function() {
      return this.$store.getters.getSchoolId;
    }
  },
  mounted: function() {
    this.schoolInfo = this.info;
  },
  methods: {
    loadData: function(newInfo) {
      axios
        .get("/school/decode", {
          headers: {
            "x-auth-token-school": localStorage.getItem("schoolToken")
          }
        })
        .then(id => {
          console.log(id);
          if (id.data.schoolId === this.schoolId) {
            this.schoolIsLoaded = true;
          }
        })
        .catch(e => {
          console.log(e.response);
        });

      this.name = newInfo.name;
      this.grade = newInfo.grade;
      this.landlineNumber = newInfo.landlineNumber;
      this.address = newInfo.address;
      this.dataIsLoaded = true;
    }
  },
  watch: {
    schoolInfo: function(newInfo) {
      this.loadData(newInfo);
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
