<template lang="pug">
include ../../assets/locale/FA.pug
div
    h2.pageTitle
        v-icon.icon
          |mdi-account-multiple-plus
        |#{STR_registerSchoolHeader}
    v-card.inputHolder.d-flex.justify-center.text-end(class="d-flex pa-10 ma-10")
      v-alert(v-model="alert" border="right" :color="alertColor" dark dismissible)="{{alertText}}"
      v-col(cols="12" sm="6" md="3")
          v-text-field(v-model="idName" :rules="displayNameRules" append-icon="mdi-account-outline" label=STR_displayName placeholder=STR_displayName outlined)
          v-text-field(v-model="email" :rules="emailRules" label=STR_email append-icon="mdi-email-outline" placeholder="ایمیل" type="email" outlined)
          v-text-field(v-model="mobileNumber" :rules="mobileRules" label=STR_phoneNumber append-icon="mdi-cellphone" placeholder=STR_phoneNumber type="tell" outlined)
          v-text-field(v-model="password" :rules="passwordRules" label=STR_password :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" placeholder=STR_password :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" outlined)
          v-text-field(v-model="confirmPassword" :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="[confirmPasswordRules]"  label=STR_confirmPassword :type="showConfirmPassword ? 'text' : 'password'" @click:append="showConfirmPassword = !showConfirmPassword" placeholder=STR_confirmPassword outlined)
          v-text-field(v-model="name" append-icon="mdi-office-building" label=STR_schoolName placeholder=STR_schoolName type="text" outlined)
          v-text-field(v-model="grade" append-icon="mdi-chair-school" label=STR_schoolGrade placeholder=STR_schoolGrade type="text" outlined)
          v-text-field(v-model="landlineNumber" :rules="landlineRules" append-icon="mdi-file-phone-outline" label=STR_schoolLandline placeholder=STR_schoolLandline type="tel" outlined)
          v-text-field(v-model="address" append-icon="mdi-bus-marker" label=STR_schoolAddress placeholder=STR_schoolAdress type="text" outlined)
          v-btn(color="primary" large dark @click="onRegister")=STR_registerButton
                 


</template>

<script>
import FA from "../../assets/locale/FA";
export default {
  name: "Register",
  data: () => ({
    idName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    name: "",
    grade: "",
    landlineNumber: "",
    address: "",
    displayNameRules: [
      v => {
        const pattern = /^[A-Za-z0-9]+$/;
        return pattern.test(v) || FA.STR_invalidDisplayName;
      }
    ],
    emailRules: [
      v => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(v) || FA.STR_invalidEmail;
      }
    ],
    passwordRules: [
      v => {
        const pattern = /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/;
        return pattern.test(v) || FA.STR_invalidPassword;
      }
    ],
    mobileRules: [
      v => {
        const pattern = /(\+989|9|09)(0[1-3]|1[0-9]|2[0-2]|3[0-9]|90|9[8-9])\d{7}/;
        return pattern.test(v) || FA.STR_invalidMobile;
      }
    ],
    landlineRules: [
      v => {
        const pattern = /^[0-9]+$/;
        return pattern.test(v) || FA.STR_landlineInvalid;
      }
    ],
    alert: false,
    alertText: null,
    alertColor: null
  }),
  computed: {
    confirmPasswordRules: function() {
      return (
        this.password === this.confirmPassword || FA.STR_passwordsDontMatch
      );
    }
  },
  methods: {
    onRegister: function() {
      this.$store
        .dispatch("schoolRegister", {
          idName: this.idName,
          email: this.email,
          mobileNumber: this.mobileNumber,
          password: this.password,
          info: {
            name: this.name,
            grade: this.grade,
            landlineNumber: this.landlineNumber,
            address: this.address
          }
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
