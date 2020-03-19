<template lang="pug">
include ../../assets/locale/FA.pug
div
    h2.pageTitle
        |#{STR_registerHeader}
    v-card.inputHolder.d-flex.justify-center.text-end(class="d-flex pa-10 ma-10")
      v-alert(v-model="alert" border="right" :color="alertColor" dark dismissible)="{{alertText}}"
      v-col(cols="12" sm="6" md="3")
          v-text-field(v-model="displayName" :rules="displayNameRules" label=STR_displayName placeholder=STR_displayName outlined)
          v-text-field(v-model="email" :rules="emailRules" label=STR_email placeholder="ایمیل" type="email" outlined)
          v-text-field(v-model="phoneNumber" :rules="mobileRules" label=STR_phoneNumber placeholder=STR_phoneNumber type="tell" outlined)
          v-text-field(v-model="password" :rules="passwordRules" label=STR_password placeholder=STR_password type="password" outlined)
          v-text-field(v-model="confirmPassword" :rules="[confirmPasswordRules]"  label=STR_confirmPassword type="password" placeholder=STR_confirmPassword outlined)
          v-btn(color="purple" large dark @click="onRegister")=STR_registerButton
                 


</template>

<script>
import FA from "../../assets/locale/FA";
export default {
  name: "Register",
  data: () => ({
    displayName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
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
        .dispatch("register", {
          displayName: this.displayName,
          email: this.email,
          phoneNumber: this.phoneNumber,
          password: this.password
        })
        .then(res => {
          console.log("returnedRes", res.id);
          this.alert = true;
          this.alertText = res.message;
          this.alertColor = "blue";
          this.$router.push({ path: `/redirect/to/profile/${res.id}` });
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
</style>
