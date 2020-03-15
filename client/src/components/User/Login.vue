<template lang="pug">
include ../../assets/locale/FA.pug

div
    h2.pageTitle
        |#{STR_loginHeader}
    v-card.inputHolder.d-flex.justify-center(class="d-flex pa-10 ma-10")
        v-alert(v-model="alert" border="right" :color="alertColor" dark dismissible)="{{alertText}}"
        v-col(cols="12" sm="6" md="3")
            v-text-field(v-model="loginString" label=STR_loginString placeholder=STR_loginString outlined)
            v-text-field(v-model="password" label=STR_password placeholder=STR_password type="password" outlined)
            v-btn(color="purple" large dark @click="onLogin")=STR_loginButton
</template>
<script>
export default {
  name: "Login",
  data: () => ({
    loginString: null,
    password: null,

    alert: false,
    alertColor: null,
    alertText: null
  }),
  methods: {
    onLogin: function() {
      this.$store
        .dispatch("logIn", {
          displayName: this.loginString,
          email: this.loginString,
          phoneNumber: this.loginString,
          password: this.password
        })
        .then(res => {
          this.alert = true;
          this.alertColor = "blue";
          this.alertText = res;
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
</style>