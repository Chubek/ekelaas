<template lang="pug">
include ../../assets/locale/FA.pug
div
    h2.pageTitle
        |#{STR_teacherHeader}
    v-card.inputHolder.d-flex.justify-center.text-ed(class="d-flex pa-10 ma-10")
        v-col(cols="12" sm="6" md="3")
            ul.list
                li(v-for="(n, index) in numbersCredits" class="creditsLi")
                    v-text-field(v-model="credits[n]" label=STR_credits placeholder=STR_credits outlined)
                    v-btn(color="black" dark icon @click="onDeleteCredit(index)")
                        v-icon.icon-minus
                            |mdi-minus
                v-btn(color="black" dark icon @click="onAddCredit")
                    v-icon.icon
                        |mdi-plus
            ul.list
                li(v-for="(n, index) in numbersDegrees" class="degreesLi")
                    v-text-field(v-model="degrees[n]" label=STR_degrees placeholder=STR_degrees outlined)
                    v-btn(color="black" dark icon @click="onDeleteDegree(index)") 
                        v-icon.icon-minus
                            |mdi-minus

                v-btn(color="black" dark icon @click="onAddDegree")
                    v-icon.icon
                        |mdi-plus
            v-btn(color="purple" large dark @click="onSubmitInfo")=STR_sendInfo
</template>
<script>
export default {
  name: "SetTeacher",
  data: () => ({
    numbersCredits: [0, 1, 2, 3, 4],
    numbersDegrees: [0, 1],
    credits: [],
    degrees: []
  }),
  methods: {
    onAddCredit: function() {
      const lastIndex = this.numbersCredits.length - 1;
      const lastItem = this.numbersCredits[lastIndex];
      this.numbersCredits.push(lastItem + 1);
    },

    onAddDegree: function() {
      const lastIndex = this.numbersDegrees.length - 1;
      const lastItem = this.numbersDegrees[lastIndex];
      this.numbersDegrees.push(lastItem + 1);
    },

    onSubmitInfo: function() {
      this.$store.dispatch("setUpTeacher", {
        credits: this.credits,
        degrees: this.degrees
      });
    },

    onDeleteCredit: function(index) {
      this.numbersCredits.splice(index, 1);
    },

    onDeleteDegree: function(index) {
      this.numbersDegrees.splice(index, 1);
    }
  }
};
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', '../../assets/fonts/Yekan')

.pageTitle, .inputHolder
  font-family: 'Yekan', Tahoma, sans-serif
    

.inputHolder
  font-weight: 1000

.list
  list-style-type: none
    
.degreesLi, .creditsLi    
  display: flex

.icon
  margin-bottom: 1.5rem

.icon-minus
  margin-top: 50%

</style>
