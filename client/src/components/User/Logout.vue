<template lang="pug">
include ../../assets/locale/FA.pug
div.mainDiv
  v-card.inputHolder.d-flex.justify-start.text-end(class="d-flex pa-10 ma-10")
    p
      |#{STR_youLoggedOut}
      br/
      br/
      v-btn(to="/" large color="white")=STR_returnToHome
</template> 
<script>
export default {
  name: "Logout",
  created: function() {
    this.$store.dispatch("logOut");
  }
};
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', '../../assets/fonts/Yekan')

body, .mainDiv
  font-family: 'Yekan', Tahoma, sans-serif

.pageTitle
  display: flex

</style>
