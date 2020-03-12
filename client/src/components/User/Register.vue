<template lang="pug">
include ../../assets/locale/FA.pug
div
    h2.pageTitle
        |#{STR_registerHeader}
    v-card.inputHolder.d-flex.justify-start.text-end(class="d-flex pa-10 ma-10")
        v-col(cols="12" sm="6" md="3")
            v-text-field(v-model="displayName" label=STR_displayName placeholder=STR_displayName outlined)
            v-text-field(v-model="email" id="input" label=STR_email placeholder="ایمیل" type="email" outlined)
            v-text-field(v-model="phoneNumber" id="input" label=STR_phoneNumber placeholder=STR_phoneNumber type="tell" outlined)
            v-text-field(v-model="password" id="input" label=STR_password placeholder=STR_password type="password" outlined)
            v-btn(color="purple" large dark @click="onRegister")=STR_registerButton
                 


</template>

<script>
export default {
  name: "Register",
  data: () => ({
    displayName: null,
    email: null,
    phoneNumber: null,
    password: null
  }),
  methods: {
    onRegister: function() {
      this.$store.dispatch("register", {
        displayName: this.displayName,
        email: this.email,
        phoneNumber: this.phoneNumber,
        password: this.password
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
