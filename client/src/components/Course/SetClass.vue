<template lang="pug">
include ../../assets/locale/FA.pug
div
    h2.pageTitle
        |#{STR_courseClassHeader}    
    v-card.inputHolder.d-flex.justify-center.text-end(class="d-sm-flex pa-10 ma-10")
        v-card(elevation="11").counter
        v-btn(color="red" dark icon @click="onAddCounter")
            v-icon.icon
                |mdi-plus
        p="{{counter}}"
        v-btn(color="red" dark icon @click="onSubtractCounter")
            v-icon.icon
                |mdi-minus
        v-simple-table(dense)        
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
                          v-col(cols="14" sm="14")
                            v-menu(ref="menuDateRef" v-model="menuDate[index]" :close-on-content-click="false" :return-value.sync="dates[index]" transition="scale-transition offset-y"  max-width="290px" min-width="290px")
                              template(v-slot:activator="{ on }")
                                v-text-field(v-model="jalaliDates[index]", label=STR_classDate append-icon="mdi-calendar" readonly v-on="on")
                              v-date-picker(v-model="dates[index]" scrollable no-title locale="fa" first-day-of-week="6" class="datePicker")
                                v-spacer/
                                v-btn(color="primary" @click="menu[index] = false")=STR_cancel
                                v-btn(color="primary" @click="$refs.menuDateRef[index].save(dates[index]); convertToJalali(index)")=STR_ok
                        td
                          v-col(cols="14" sm="14")
                            v-menu(ref="menuTimeRef" v-model="menuTime[index]" :close-on-content-click="false" :return-value.sync="dates[index]" transition="scale-transition offset-y"  max-width="290px" min-width="290px")
                              template(v-slot:activator="{ on }")
                                v-text-field(v-model="times[index]", label=STR_classTime append-icon="mdi-clock-outline" readonly v-on="on")
                              v-time-picker(v-model="times[n]" format="24hr" class="timePicker")
                                v-spacer/
                                v-btn(color="primary" @click="menu[index] = false")=STR_cancel
                                v-btn(color="primary" @click="$refs.menuTimeRef[index].save(times[index])")=STR_ok
                            
                        td
                            v-autocomplete(v-model="participants[n]" append-icon="mdi-face-outline" label=STR_students multiple small-chips chips dense :items="autoCompleteUsers")
                        td
                            v-textarea(v-model="notes[n]"   label=STR_notes append-icon="mdi-note-multiple-outline")
                        td
                            v-btn(color="red" dark large @click="onAddClass(n)")=STR_sendInfo
                            v-btn(color="red" dark icon @click="onRemoveSession(n)")
                                v-icon.icon
                                    |mdi-delete

                        
            


   
</template>
<script lang="ts">
import Vue from "vue";
import moment from "jalali-moment";
import _ from "lodash";
export default Vue.extend({
  name: "SetClass",
  data: () => ({
    numbersList: [],
    counter: 10,
    dates: [],
    jalaliDates: [],
    times: [],
    participants: [],
    notes: [],
    menuDate: [],
    menuTime: []
  }),
  created: function() {
    this.$store.dispatch("loadAutoCompleteUsers");
    for (let i = 0; i < this.counter; i++) {
      this.jalaliDates.push(null);
      this.dates.push(new Date().toISOString().substr(0, 10));
      this.times.push("00:00");
      this.numbersList.push(i);
      this.menuDate.push(false);
      this.menuTime.push(false);
    }
    for (let i = 0; i < this.counter; i++) {
      this.convertToJalali(i);
    }
  },
  watch: {
    counter: function(newCounter, oldCounter) {
      if (newCounter > oldCounter) {
        this.dates.push(new Date().toISOString().substr(0, 10));
        this.times.push("00:00");
        this.jalaliDates.push(null);
        this.convertToJalali(newCounter - 1)
      } else if (oldCounter > newCounter) {
        this.dates.pop();
        this.menuDate.pop();
        this.menuTime.pop();
        this.jalaliDates.pop();
      }
    }
  },
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
        courseId: this.$route.params.courseId,
        classDate: this.dates[index],
        classHour: this.times[index],
        classParticipants: this.participants[index],
        classNotes: this.notes[index]
      });
      this.numbersList.splice(index, 1);
      if (this.counter > 0) {
        this.counter -= 1;
      }
    },
    onAddDate: function(index) {
      console.log(index);
      this.modal = false;
    },
    convertToJalali: function(index) {
      let date = this.dates[index];
      console.log("newDate", date);
      date = _.replace(date, /-/g, "/");
      this.jalaliDates[index] = moment(date, "YYYY/MM/DD")
        .locale("fa")
        .format("YYYY/MM/DD");
    }
  },
  computed: {
    autoCompleteUsers: function() {
      return this.$store.getters.getAutoCompleteUsers;
    }
  }
});
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', '../../assets/fonts/Yekan')

body, .pageTitle, .inputHolder, .datePicker, .timePicker
  font-family: 'Yekan', Tahoma, sans-serif

.inputHolder
  font-weight: 1000

.counter
  display: flex

</style>
