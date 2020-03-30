<template lang="pug">
include ../../assets/locale/FA.pug
div
  h2.pageTitle
    v-icon.icon
      |mdi-feather
    |#{STR_editTeacherHeader}    
  v-card.inputHolder.d-flex.justify-center.text-ed(class="d-flex pa-10 ma-10")
    v-alert(v-model="alert" border="right" :color="alertColor" dark dismissible)="{{alertText}}"
    v-col(cols="12" sm="6" md="3")
      ul.list
        li(v-for="(n, index) in numbersCredits" class="creditsLi")
          v-text-field(v-model="credits[index]" label=STR_credits append-icon="mdi-show-print" :placeholder="teacherInfo.credits[index]" outlined)
          v-btn(color="black" dark icon @click="onDeleteCredit(index)")
            v-icon.icon-minus
              |mdi-minus
        v-btn(color="black" dark icon @click="onAddCredit")
          v-icon.icon
            |mdi-plus
      ul.list
        li(v-for="(n, index) in numbersDegrees" class="degreesLi")
          v-text-field(v-model="degrees[index]" label=STR_degrees append-icon="mdi-math-compass" :placeholder="teacherInfo.degrees[index]" outlined)
          v-btn(color="black" dark icon @click="onDeleteDegree(index)") 
            v-icon.icon-minus
              |mdi-minus

        v-btn(color="black" dark icon @click="onAddDegree")
          v-icon.icon
            |mdi-plus
      v-autocomplete(v-model="school" label=STR_school append-icon="mdi-bus-school" :placeholder="teacherInfo.school" small-chips chips dense :items="autoCompData" outlined)
      v-btn(color="primary" large dark @click="onSubmitInfo")=STR_sendInfo
        v-icon(:class="showIcon")
          |mdi-check-all
        v-progress-circular(color="white" indeterminate :class="showCircle")

</template>
<script>
import FA from "../../assets/locale/FA";
export default {
  name: "EditTeacherInfo",
  title: FA.titles.editTeacher,
  data: () => ({
    numbersCredits: null,
    numbersDegrees: null,
    credits: [],
    degrees: [],
    school: null,
    disabledButton: true,
    alert: false,
    alertColor: null,
    alertText: null,
    showIcon: "showClass",
    showCircle: "hideClass",
    autoCompData: null,
    schoolName: null
  }),
  created: function() {
    this.numbersCredits = this.computeNumbersCredits();
    this.numbersDegrees = this.computeNumbersDegrees();
    this.$store.dispatch("loadAutoCompleteSchools");
  },
  watch: {
    autoCompData: function(newAutoComp) {
      this.fetchSchoolTitles(newAutoComp);
    }
  },
  mounted: function() {
    this.credits = this.teacherInfo.credits;
    this.degrees = this.teacherInfo.degrees;
    this.school = { name: this.teacherInfo.school, id: this.teacherSchoolId };
    this.autoCompData = this.autoCompleteSchools;
  },
  computed: {
    userId: function() {
      return this.$store.getters.getUserId;
    },
    teacherInfo: function() {
      return this.$store.getters.getTeacherInfo;
    },
    autoCompleteSchools: function() {
      return this.$store.getters.getAutoCompleteSchools;
    },
    teacherSchoolId: function() {
      return this.$store.getters.getTeacheSchoolId;
    }
  },
  methods: {
    onAddCredit: function() {
      const lastIndex = this.numbersCredits.length - 1;
      const lastItem = this.numbersCredits[lastIndex];
      this.numbersCredits.push(lastItem + 1);
    },

    onAddDegree: function() {
      const lastIndex = this.numbersDegrees.length - 1;
      const lastItem = this.numbersDegrees[lastIndex];
      this.numbersDegrees.push(lastItem + 1);
    },

    onSubmitInfo: function() {
      this.getSchoolName();
      this.showIcon = "hideClass";
      this.showCircle = "showClass";
      let degreesFiltered = this.degrees.filter(degree => {
        return degree != null;
      });
      let creditsFiltered = this.credits.filter(credit => {
        return credit != null;
      });
      this.$store
        .dispatch("editTeacher", {
          credits: creditsFiltered,
          degrees: degreesFiltered,
          school: this.schoolName,
          schoolId: this.school
        })
        .then(res => {
          this.showIcon = "showClass";
          this.showCircle = "hideClass";
          this.alert = true;
          this.alertColor = "blue";
          this.alertText = res;
          this.$router.push({ path: `/redirect/to/profile/${this.userId}` });
        })
        .catch(e => {
          this.alert = true;
          this.alertColor = "red";
          this.alertText = e;
        });
    },

    onDeleteCredit: function(index) {
      this.numbersCredits.splice(index, 1);
      this.credits.splice(index, 1);
    },

    onDeleteDegree: function(index) {
      this.numbersDegrees.splice(index, 1);
      this.degrees.splice(index, 1);
    },
    onClickSetInfo: function() {
      this.disabledButton = false;
    },
    computeNumbersCredits: function() {
      let creditsLength = this.teacherInfo.credits.length;
      let ret = [];
      for (let i = 0; i < creditsLength; i++) {
        ret.push(i);
      }
      return ret;
    },
    computeNumbersDegrees: function() {
      let creditsLength = this.teacherInfo.degrees.length;
      let ret = [];
      for (let i = 0; i < creditsLength; i++) {
        ret.push(i);
      }
      return ret;
    },
    fetchSchoolTitles: function(autoComps) {
      this.autoCompData = autoComps;
    },
    getSchoolName: function() {
      this.autoCompleteSchools.forEach(school => {
        if (school.value === this.school) {
          this.schoolName = school.text;
        }
      });
    }
  }
};
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', '../../assets/fonts/Yekan')

.pageTitle, .inputHolder
  font-family: 'Yekan', Tahoma, sans-serif


.inputHolder
  font-weight: 1000

.list
  list-style-type: none

.degreesLi, .creditsLi
  display: flex

.icon
  margin-bottom: 1.5rem

.icon-minus
  margin-top: 50%

.showClass
  display: inline

.hideClass
  display: none

.pageTitle
  display: flex
  margin-right: 1rem

.icon
  margin-left: 0.5rem
</style>
