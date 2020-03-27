<template lang="pug">
include ../../assets/locale/FA.pug

div
    h2.pageTitle
        v-icon.icon
          |mdi-account-key
        |#{STR_loginSchoolHeader}
    v-card.inputHolder.d-flex.justify-center(class="d-flex pa-10 ma-10")
        v-alert(v-model="alert" border="right" :color="alertColor" dark dismissible)="{{alertText}}"
        v-col(cols="12" sm="6" md="3")
            v-text-field(v-model="loginString" append-icon="mdi-login-variant" label=STR_loginString placeholder=STR_loginString outlined)
            v-text-field(v-model="password" label=STR_password placeholder=STR_password :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" outlined)
            v-btn(color="primary" large dark @click="onLogin")=STR_loginButton
</template>
<script>
import FA from "../../assets/locale/FA";
export default {
  name: "Login",
  title: FA.titles.loginSchool,
  data: () => ({
    loginString: null,
    password: null,
    showPassword: false,
    alert: false,
    alertColor: null,
    alertText: null
  }),
  methods: {
    onLogin: function() {
      this.$store
        .dispatch("schoolLogIn", {
          displayName: this.loginString,
          email: this.loginString,
          mobileNumber: this.loginString,
          password: this.password
        })
        .then(res => {
          this.alert = true;
          this.alertColor = "blue";
          this.alertText = res;
          this.$router.push({ path: "/" });
        })
        .catch(e => {
          this.alert = true;
          (this.alertColor = "red"), (this.alertText = e);
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

.pageTitle
    display: flex
    margin-right: 1rem

.icon
    margin-left: 0.5rem
</style>
