<template lang="pug">
include ../../assets/locale/FA.pug
div
    h2.pageTitle
        |#{STR_courseClassHeader}    
    v-card.inputHolder.d-flex.justify-center.text-end(class="d-flex pa-10 ma-10")
        v-card(elevation="11").counter
        v-btn(color="red" dark icon @click="onAddCounter")
            v-icon.icon
                |mdi-plus
        p="{{counter}}"
        v-btn(color="red" dark icon @click="onSubtractCounter")
            v-icon.icon
                |mdi-minus
        v-simple-table                
        
                tbody
                tr
                    th=STR_session
                    th=STR_classDate
                    th=STR_classHour
                    th=STR_classParticipants
                    th=STR_classNotes
                    tr(v-for="(n, index) in numbersList")
                        td
                            p="{{index + 1}}"
                        td
                            v-date-picker(v-model="dates[n]" locale="fa" class="datePicker")
                        td
                            v-time-picker(v-model="times[n]" format="24hr" class="timePicker")
                        td
                            v-textarea(v-model="participants[n]" label=STR_students hint=STR_participantsHint)
                        td
                            v-textarea(v-model="notes[n]" label=STR_notes)
                        td
                            v-btn(color="red" dark large @click="onAddClass(n)")=STR_sendInfo
                            v-btn(color="red" dark icon @click="onRemoveSession(n)")
                                v-icon.icon
                                    |mdi-delete

                        
            


   
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "SetClass",
  data: () => ({
    numbersList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    counter: 11,
    dates: [],
    times: [],
    participants: [],
    notes: []
  }),
  methods: {
    onAddCounter: function() {
      const lastIndexNumbers = this.numbersList.length - 1;
      const lastItemNumbers = this.numbersList[lastIndexNumbers];

      this.counter += 1;

      this.numbersList.push(lastItemNumbers + 1);
    },

    onSubtractCounter: function() {
      if (this.counter > 0) {
        this.counter -= 1;
      }
      this.numbersList.pop();
    },

    onRemoveSession: function(index) {
      this.numbersList.splice(index, 1);
      if (this.counter > 0) {
        this.counter -= 1;
      }
    },

    onAddClass: function(index) {
      this.$store.dispatch("pushCourseClasses", {
        //courseId: this.courseId,
        classDate: this.dates[index],
        classHour: this.times[index],
        classParticipants: this.participants[index],
        classNotes: this.notes[index]
      });
      this.numbersList.splice(index, 1);
      if (this.counter > 0) {
        this.counter -= 1;
      }
    }
  }
});
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', '../../assets/fonts/Yekan')

body, .pageTitle, .inputHolder
    font-family: 'Yekan', Tahoma, sans-serif

.inputHolder
    font-weight: 1000

.counter
    display: flex
    
  
</style>