<template lang="pug">
include ../../assets/locale/FA.pug

div.mainDiv
    h2
        |#{STR_redirectHeader}

</template>
<script>
import FA from "../../assets/locale/FA"
export default {
  name: "RedirectToProfile",
  title: FA.titles.redirectToProfile,
  computed: {
    userId: function() {
      return this.$route.params.userId;
    }
  },
  mounted: function() {
    this.$router.push({ path: `/profile/${this.userId}` });
  }
};
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', '../../assets/fonts/Yekan')

body, .mainDiv
    font-family: 'Yekan', Tahoma, sans-serif

</style>
