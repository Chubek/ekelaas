<template lang="pug">
include ../assets/locale/FA.pug

div.mainDiv
    h2.ma-12
        v-icon(right).icon
            |mdi-chair-school
        |#{STR_ourSchools}
    v-card(class="d-flex ma-5 pa-5")
        v-img(src="../assets/img/logo.png")
        v-simple-table.mainTable
            tr(v-for="school in ourSchools" :key="school.value")
                td
                    |{{ school.text }}
</template>
<script>
import FA from "../assets/locale/FA";
export default {
  name: "OurSchools",
  title: FA.titles.ourSchools,
  data: () => ({
    ourSchools: null
  }),
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.$store.dispatch("loadAutoCompleteSchools");
    });
  },
  mounted: function() {
    this.ourSchools = this.$store.getters.getAutoCompleteSchools;
  }
};
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', '../assets/fonts/Yekan')

body, .mainDiv
  font-family: 'Yekan', Tahoma, sans-serif


.mainTable
    border: 2px solid
    border-radius: 2rem



</style>
