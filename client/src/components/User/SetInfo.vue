<template lang="pug">
include ../../assets/locale/FA.pug

div
    h2.pageTitle
        v-icon.icon
          |mdi-id-card
        |#{STR_infoHeader}
    v-card.inputHolder.d-flex.justify-center.text-end(class="d-flex pa-10 ma-10")
        v-alert(v-model="alert" border="right" :color="alertColor" dark dismissible)="{{alertText}}"
        v-col(cols="12" sm="6" md="3")
            v-text-field(v-model="firstName" append-icon="mdi-human-child" label=STR_firstName :placeholder="info.firstName" outlined)
            v-text-field(v-model="lastName" append-icon="mdi-human-male-child" label=STR_lastName :placeholder="info.lastName" outlined)            
            h5.labelTitle
              v-icon.icon
                |mdi-calendar
              |#{STR_dateOfBirth}
            p.dOBTitle="{{ dateOB }}"
            v-date-picker(v-model="dateOfBirth" :value="info.dateOfBirth" :show-current="false" first-day-of-week="6" locale="fa" class="datePicker")            
            v-btn(color="primary" large :disabled="filled" dark @click="onSendInfo")=STR_sendInfo
              v-icon(:class="showIcon")
                |mdi-check-all
              v-progress-circular(color="white" indeterminate :class="showCircle")
            br/
            p(v-if="filled")
              |#{STR_fillFurther}

</template>
<script>
import moment from "jalali-moment";
import _ from "lodash";
export default {
  name: "SetInfo",
  data: () => ({
    firstName: null,
    lastName: null,
    dateOfBirth: null,
    referral: null,
    filled: false,
    alert: false,
    alertColor: null,
    alertText: null,
    showIcon: "showClass",
    showCircle: "hideClass"
  }),
  methods: {
    onSendInfo: function() {
      this.showIcon = "hideClass";
      this.showCircle = "showClass";
      this.$store
        .dispatch("setUserInfo", {
          firstName: this.firstName,
          lastName: this.lastName,
          dateOfBirth: this.dateOfBirth,
          referralCode: this.referral
        })
        .then(res => {
          this.showIcon = "showClass";
          this.showCircle = "hideClass";
          this.alert = true;
          this.alertColor = "blue";
          this.alertText = res;
          this.filled = true;
          this.$emit("clicked");
        })
        .catch(e => {
          this.alert = true;
          this.alertColor = "red";
          this.alertText = e;
        });
    }
  },
  computed: {
    info: function() {
      return this.$store.getters.getUserInfo;
    },
    dateOB: function() {
      let dOB = this.info.dateOfBirth;
      console.log("dOB", dOB);
      dOB = _.replace(dOB, /-/g, "/");
      console.log("dob", dOB);
      return moment(dOB, "YYYY/MM/DD")
        .locale("fa")
        .format("YYYY/MM/DD");
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

.dOBTitle
  margin-left: 6.5rem
  margin-bottom: 1rem


.datePicker
  margin-bottom: 2rem
  
  
.showClass
  display: inline

.hideClass
  display: none


</style>
