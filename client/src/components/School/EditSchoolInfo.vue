<template lang="pug">
include ../../assets/locale/FA.pug
div(v-if="dataIsReady")
    h2.pageTitle
        v-icon.icon
          |mdi-account-multiple-plus
        |#{STR_editSchoolHeader}
    v-card.inputHolder.d-flex.justify-center.text-end(class="d-flex pa-10 ma-10")
      v-alert(v-model="alert" border="right" :color="alertColor" dark dismissible)="{{alertText}}"
      v-col(cols="12" sm="6" md="3")
          v-text-field(v-model="name" append-icon="mdi-office-building" label=STR_schoolName placeholder=STR_schoolName type="text" outlined)
          v-select(v-model="grade" :items="gradeItems" append-icon="mdi-chair-school" label=STR_schoolGrade placeholder=STR_schoolGrade type="text" outlined)
          v-text-field(v-model="landlineNumber"  append-icon="mdi-file-phone-outline" label=STR_schoolLandline placeholder=STR_schoolLandline type="tel" outlined)
          v-text-field(v-model="address" append-icon="mdi-bus-marker" label=STR_schoolAddress placeholder="آدرس مدرسه" type="text" outlined)
          v-btn(color="primary" large dark @click="onEditInfo")=STR_editInfo
                 


</template>

<script>
import FA from "../../assets/locale/FA";
export default {
  name: "Register",
  title: FA.titles.editSchool,
  data: () => ({
    dataIsReady: false,
    gradeItems: FA.STR_schoolGrades,
    name: "",
    grade: "",
    landlineNumber: "",
    address: "",
    landlineRules: [
      v => {
        const pattern = /^[0-9]+$/;
        return pattern.test(v) || FA.STR_landlineInvalid;
      }
    ],
    alert: false,
    alertText: null,
    alertColor: null,
    schoolInfo: null
  }),
  methods: {
    loadData: function(thisSchoolInfo) {
      this.name = thisSchoolInfo.name;
      this.grade = thisSchoolInfo.grade;
      this.landlineNumber = thisSchoolInfo.landlineNumber;
      this.address = thisSchoolInfo.address;
      this.dataIsReady = true;
    },

    onEditInfo: function() {
      this.$store
        .dispatch("editSchool", {
          name: this.name,
          grade: this.grade,
          landlineNumber: this.landlineNumber,
          address: this.address
        })
        .then(res => {
          console.log("returnedRes", res.id);
          this.alert = true;
          this.alertText = res.message;
          this.alertColor = "blue";
          this.$router.push({ path: `/redirect/to/school-profile/${res.id}` });
        })
        .catch(e => {
          this.alert = true;
          this.alertText = e;
          this.alertColor = "red";
          console.log(e);
        });
    }
  },
  computed: {
    info: function() {
      return this.$store.getters.getSchoolInfo;
    }
  },
  watch: {
    schoolInfo: function(newSchoolInfo) {
      this.loadData(newSchoolInfo);
    }
  },
  mounted: function() {
    this.schoolInfo = this.info;
  }
};
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', '../../assets/fonts/Yekan')

body, .pageTitle, .inputHolder
  font-family: 'Yekan', Tahoma, sans-serif

.inputHolder
  font-weight: 1000
</style>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', '../../assets/fonts/Yekan')

body, .pageTitle, .inputHolder
  font-family: 'Yekan', Tahoma, sans-serif

.inputHolder
  font-weight: 1000

.pageTitle
  display: flex
  margin-right: 1rem

.icon
  margin-left: 0.5rem
</style>
