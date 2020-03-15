<template lang="pug">
include ../../assets/locale/FA.pug

div
    h2.pageTitle
        |#{STR_infoHeader}
    v-card.inputHolder.d-flex.justify-center.text-end(class="d-flex pa-10 ma-10")
        v-alert(v-model="alert" border="right" :color="alertColor" dark dismissible)="{{alertText}}"
        v-col(cols="12" sm="6" md="3")
            v-text-field(v-model="firstName" label=STR_firstName placeholder=STR_firstName outlined)
            v-text-field(v-model="lastName" label=STR_lastName placeholder=STR_lastName outlined)            
            h5.labelTitle=STR_dateOfBirth
            v-date-picker(v-model="dateOfBirth" title=STR_dateOfBirth locale="fa" class="datePicker")
            v-text-field(v-model="referral" label=STR_referral placeholder=STR_referral outlined)
            v-btn(color="purple" large dark @click="onSendInfo")=STR_sendInfo

</template>
<script>
export default {
  name: "SetInfo",
  data: () => ({
    firstName: null,
    lastName: null,
    dateOfBirth: null,
    referral: null,

    alert: false,
    alertColor: null,
    alertText: null
  }),
  methods: {
    onSendInfo: function() {
      this.$store
        .dispatch("setUserInfo", {
          firstName: this.firstName,
          lastName: this.lastName,
          dateOfBirth: this.dateOfBirth,
          referralCode: this.referral
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

.labelTitle
  margin-left: 8rem
  margin-bottom: 1rem

.datePicker
  margin-bottom: 2rem
</style>