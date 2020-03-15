<template lang="pug">
include ../../assets/locale/FA.pug

div
    h2.pageTitle
        |#{STR_studentHeader}
    v-card.inputHolder.d-flex.justify-center.text-end(class="d-flex pa-10 ma-10")
        v-alert(v-model="alert" border="right" :color="alertColor" dark dismissible)="{{alertText}}"
        v-col(cols="12" sm="6" md="3")
            v-text-field(v-model="grade" label=STR_grade placeholder=STR_grade outlined)
            v-text-field(v-model="province" label=STR_province placeholder=STR_province outlined)
            v-text-field(v-model="city" label=STR_city placeholder=STR_city outlined)
            v-text-field(v-model="school" label=STR_school placeholder=STR_school outlined)
            v-btn(color="purple" large dark @click="onSetStudent")=STR_sendInfo

</template>
<script>
export default {
  name: "SetStudent",
  data: () => ({
    grade: null,
    province: null,
    city: null,
    school: null,

    alert: false,
    alertColor: null,
    alertText: null
  }),
  methods: {
    onSetStudent: function() {
      this.$store
        .dispatch("setUpStudent", {
          grade: this.grade,
          province: this.province,
          city: this.city,
          school: this.school
        })
        .then(res => {
          this.alert = true;
          this.alertColor = "blue";
          this.alertText = res;
        })
        .catch(e => {
          this.alert = true;
          this.alertColor = "red";
          this.alertText = e;
        });
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
</style>
