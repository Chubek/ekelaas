<template lang="pug">
include ../../assets/locale/FA.pug

div    
    h2.pageTitle
        |#{STR_studentHeader}
    v-card.inputHolder.d-flex.justify-center.text-end(class="d-flex pa-10 ma-10")
        v-alert(v-model="alert" border="right" :color="alertColor" dark dismissible)="{{alertText}}"
        v-col(cols="12" sm="6" md="3")
            v-select(v-model="grade" label=STR_grade append-icon="mdi-id-card" :items="gradeItems" :placeholder="studentInfo.grade" outlined)
            v-select(v-model="province" label=STR_province append-icon="mdi-map-marker" :items="provinceItems" :placeholder="studentInfo.province" outlined)
            v-text-field(v-model="city" label=STR_city append-icon="mdi-map-marker" :placeholder="studentInfo.city" outlined)
            v-text-field(v-model="school" append-icon="mdi-bus-school" label=STR_school :placeholder="studentInfo.school" outlined)
            v-btn(color="primary" x-large dark @click="onSetStudent")=STR_sendInfo
              v-icon(:class="showIcon")
                |mdi-check-all
              v-progress-circular(color="white" indeterminate :class="showCircle")
              
              

</template>
<script>
import FA from "../../assets/locale/FA";
import SetInfo from "../User/SetInfo";
export default {
  name: "SetStudent",
  components: {
    SetInfo
  },
  data: () => ({
    grade: null,
    province: null,
    city: null,
    school: null,
    gradeItems: FA.STR_gradeItems,
    provinceItems: FA.STR_provinces,
    alert: false,
    alertColor: null,
    alertText: null,
    disabledButton: true,
    showIcon: "showClass",
    showCircle: "hideClass"
  }),
  created: function() {
    this.grade = this.studentInfo.grade;
    this.province = this.studentInfo.province;
    this.city = this.studentInfo.city;
    this.school = this.studentInfo.school;
  },
  methods: {
    onSetStudent: function() {
      this.$store
        .dispatch("editStudent", {
          grade: this.grade,
          province: this.province,
          city: this.city,
          school: this.school
        })
        .then(res => {
          this.showIcon = "hideClass";
          this.showCircle = "showClass";
          this.alert = true;
          this.alertColor = "blue";
          this.alertText = res;
          this.$router.push({ path: `/profile/${this.userId}` });
        })
        .catch(e => {
          this.alert = true;
          this.alertColor = "red";
          this.alertText = e;
        });
    },
    onClickSetInfo: function() {
      this.disabledButton = false;
    }
  },
  computed: {
    userId: function() {
      return this.$store.getters.getUserId;
    },
    studentInfo: function() {
      return this.$store.getters.getStudentInfo;
    }
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

.showClass
  display: inline

.hideClass
  display: none
</style>
