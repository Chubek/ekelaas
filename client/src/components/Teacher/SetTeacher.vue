<template lang="pug">
include ../../assets/locale/FA.pug
div
    SetInfo(@clicked="onClickSetInfo")
    h2.pageTitle
        v-icon.icon
          |mdi-feather
        |#{STR_teacherHeader}    
    v-card.inputHolder.d-flex.justify-center.text-ed(class="d-flex pa-10 ma-10")
        v-alert(v-model="alert" border="right" :color="alertColor" dark dismissible)="{{alertText}}"
        v-col(cols="12" sm="6" md="3")
            ul.list
                li(v-for="(n, index) in numbersCredits" class="creditsLi")
                    v-text-field(v-model="credits[index]" label=STR_credits append-icon="mdi-show-print" :placeholder="teacherInfo.credits[index]" outlined)
                    v-btn(color="black" dark icon @click="onDeleteCredit(index)")
                        v-icon.icon-minus
                            |mdi-minus
                v-btn(color="black" dark icon @click="onAddCredit")
                    v-icon.icon
                        |mdi-plus
            ul.list
                li(v-for="(n, index) in numbersDegrees" class="degreesLi")
                    v-text-field(v-model="degrees[index]" append-icon="mdi-math-compass" label=STR_degrees :placeholder="teacherInfo.degrees[index]" outlined)
                    v-btn(color="black" dark icon @click="onDeleteDegree(index)") 
                        v-icon.icon-minus
                            |mdi-minus

                v-btn(color="black" dark icon @click="onAddDegree")
                    v-icon.icon
                        |mdi-plus
            v-btn(color="primary" large dark :disabled="disabledButton" @click="onSubmitInfo")=STR_sendInfo
              v-icon(:class="showIcon")
                |mdi-check-all
              v-progress-circular(color="white" indeterminate :class="showCircle")
            p(v-if="disabledButton")
              |#{STR_fillInfo}
</template>
<script>
import SetInfo from "../User/SetInfo";
export default {
  name: "SetTeacher",
  components: {
    SetInfo
  },
  data: () => ({
    numbersCredits: [0, 1, 2, 3, 4],
    numbersDegrees: [0, 1],
    credits: [],
    degrees: [],
    disabledButton: true,
    alert: false,
    alertColor: null,
    alertText: null,
    showIcon: "showClass",
    showCircle: "hideClass"
  }),
  computed: {
    userId: function() {
      return this.$store.getters.getUserId;
    },
    teacherInfo: function() {
      return this.$store.getters.getTeacherInfo;
    }
  },
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
      this.showIcon = "hideClass";
      this.showCircle = "showClass";
      let degreesFiltered = this.degrees.filter(degree => {
        return degree != null;
      });
      let creditsFiltered = this.credits.filter(credit => {
        return credit != null;
      });
      this.$store
        .dispatch("setUpTeacher", {
          credits: creditsFiltered,
          degrees: degreesFiltered
        })
        .then(res => {
          this.showIcon = "showClass";
          this.showCircle = "hideClass"
          this.alert = true;
          this.alertColor = "blue";
          this.alertText = res;
          this.$router.push({ path: `/redirect/to/profile/${this.userId}` });
        })
        .catch(e => {
          this.alert = true;
          this.alertColor = "red";
          this.alertText = e;
        });
    },

    onDeleteCredit: function(index) {
      this.numbersCredits.splice(index, 1);
      this.credits.splice(index, 1);
    },

    onDeleteDegree: function(index) {
      this.numbersDegrees.splice(index, 1);
      this.degrees.splice(index, 1);
    },
    onClickSetInfo: function() {
      this.disabledButton = false;
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

.showClass
  display: inline

.hideClass
  display: none

</style>
