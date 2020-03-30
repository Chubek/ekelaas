<template lang="pug">
include ../../assets/locale/FA.pug
div
  v-progress-circular(color="blue" :size="100" indeterminate class="loader" v-if="!isReady")
  div(v-if="isReady")
    h2.pageTitle
      v-icon.icon
        |mdi-chair-school
      |#{STR_courseClassHeader}   
    v-col(cols="8" md="5" sm="3")
      v-card(class="ml-2 pa-3 courseCard" color="blue")
        v-card-title
          |{{courseData.subject}}
          br/
          |{{courseData.description}}
        v-card-actions
          v-btn(:href="courseURL" color="yellow")=STR_connectURL
            v-icon(right).icon
              |mdi-adobe
          v-btn(:to="'/profile-course/' + courseId" color="yellow")=STR_toCoursePage
            v-icon(right).icon
              |mdi-adobe
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
                  v-date-picker(v-model="dates[index]" :min="minDate" scrollable no-title locale="fa" first-day-of-week="6" class="datePicker")
                    v-spacer/
                    v-btn(color="primary" @click="menu[index] = false")=STR_cancel
                    v-btn(color="primary" @click="$refs.menuDateRef[index].save(dates[index]); convertToJalali(index)")=STR_ok
            td
              v-col(cols="14" sm="14")
                v-menu(ref="menuTimeRef" v-model="menuTime[index]" :close-on-content-click="false" :return-value.sync="times[index]" transition="scale-transition offset-y"  max-width="290px" min-width="290px")
                  template(v-slot:activator="{ on }")
                    v-text-field(v-model="times[index]", label=STR_classTime append-icon="mdi-clock-outline" readonly v-on="on")
                  v-time-picker(v-model="times[index]" format="24hr" class="timePicker")
                    v-spacer/
                    v-btn(color="primary" @click="menu[index] = false")=STR_cancel
                    v-btn(color="primary" @click="$refs.menuTimeRef[index].save(times[index])")=STR_ok

            td
              v-autocomplete(v-model="participants[index]" append-icon="mdi-face-outline" label=STR_students multiple small-chips chips dense :items="autoCompleteUsers")
            td
              v-textarea(v-model="notes[index]"   label=STR_notes append-icon="mdi-note-multiple-outline")
            td
              v-btn(color="red" dark large v-if="!isSubmitted[index]" @click="onAddClass(index)")=STR_sendInfo
                v-icon(:class="showIcon[index]")
                  |mdi-check-all
                v-progress-circular(color="white" indeterminate :class="showCircle[index]")

              v-btn(color="lime" large v-if="isSubmitted[index]" dark @click="onEditInfo(index)")=STR_editInfo
                v-icon(:class="showIcon[index]")
                  |mdi-check-all
                v-progress-circular(color="white" indeterminate :class="showCircle[index]")
              v-btn(color="red" dark v-if="!isSubmitted[index]" icon @click="onRemoveSession(index)")
                v-icon.icon
                  |mdi-delete
              v-btn(color="lime" dark v-if="isSubmitted[index]" icon @click="onPopSession(index)")
                v-icon.icon
                  |mdi-delete

            v-snackbar(v-model="snackBar")
              |{{snackBarText}} #[v-btn(color="pink" @click="snackBar = false")=STR_ok]






</template>
<script>
import moment from "jalali-moment";
import _ from "lodash";
import FA from "../../assets/locale/FA";
export default {
  name: "SetClass",
  title: FA.titles.setClass,
  data: () => ({
    numbersList: [],
    counter: 10,
    dates: [],
    jalaliDates: [],
    times: [],
    participants: [],
    notes: [],
    menuDate: [],
    menuTime: [],
    showIcon: [],
    showCircle: [],
    isSubmitted: [],
    snackBarText: null,
    snackBar: false,
    minDate: new Date().toISOString().substr(0, 10),
    classInfo: null,
    isReady: false,
    courseData: null,
    courseURL: null,
    cardIsLoaded: false,
    courseId: null
  }),
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      vm.$store.dispatch("loadCourse", vm.$route.params.courseId).then(res => {
        console.log(res);
        vm.classInfo = res.data.courseDoc.classes;
        if (vm.classInfo.length >= 0) {
          vm.isReady = true;
        }
      });
    });
  },
  created: function() {
    this.$store.dispatch("loadAutoCompleteUsers");
    this.$store.dispatch("loadCourse", this.$route.params.courseId);

    for (let i = 0; i < this.counter; i++) {
      this.jalaliDates.push(null);
      this.dates.push(new Date().toISOString().substr(0, 10));
      this.times.push("00:00");
      this.numbersList.push(i);
      this.menuDate.push(false);
      this.menuTime.push(false);
      this.showIcon.push("showClass");
      this.showCircle.push("hideClass");
      this.isSubmitted.push(false);
    }
    for (let i = 0; i < this.counter; i++) {
      this.convertToJalali(i);
    }
  },
  mounted: function() {
    this.fetchCourseInfo();
  },
  watch: {
    counter: function(newCounter, oldCounter) {
      if (newCounter > oldCounter) {
        this.dates.push(new Date().toISOString().substr(0, 10));
        this.times.push("00:00");
        this.jalaliDates.push(null);
        this.convertToJalali(newCounter - 1);
        this.showIcon.push("showClass");
        this.showCircle.push("hideClass");
        this.isSubmitted.push(false);
      }
    },
    classInfo: function(newInfo) {
      if (newInfo.length > 0) {
        this.classInfo.forEach((classs, index) => {
          console.log("array", this.classInfo[index]);
          console.log(classs);
          console.log("index", index);
          this.dates[index] = classs.classDate.substr(0, 10);
          this.convertToJalali(index);
          this.times[index] = classs.classHour;
          this.participants.push(classs.classParticipants);
          this.notes.push(classs.classNotes);
          this.isSubmitted[index] = true;
        });
        this.isReady = true;
      }
    },
    courseInfo: function() {
      this.fetchCourseInfo();
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
      console.log("removesession", "onRemoveSession");
      this.numbersList.splice(index, 1);
      if (this.counter > 0) {
        this.counter -= 1;
      }
    },
    setIsReady: function() {
      this.isReady = true;
    },
    onAddClass: function(index) {
      this.showIcon[index] = "hideClass";
      this.showCircle[index] = "showClass";
      this.$store
        .dispatch("pushCourseClasses", {
          courseId: this.$route.params.courseId,
          classDate: this.dates[index],
          classHour: this.times[index],
          classParticipants: this.participants[index],
          classNotes: this.notes[index]
        })
        .then(() => {
          this.snackBar = true;
          this.isSubmitted[index] = true;
          this.snackBarText = `جلسه‌ی ${index + 1} ذخیره گشت.`;
          this.showIcon[index] = "showClass";
          this.showCircle[index] = "hideClass";
          this.numbersList.splice(index, 1);
          if (this.counter > 0) {
            this.counter -= 1;
          }
          this.isSubmitted[index] = true;
          console.log(this.isSubmitted[index]);
        })
        .catch(e => {
          this.showIcon[index] = "showClass";
          this.showCircle[index] = "hideClass";
          this.snackBar = true;
          this.snackBarText = e;
        });
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
    },
    onEditInfo: function(index) {
      this.showIcon[index] = "hideClass";
      this.showCircle[index] = "showClass";
      this.$store
        .dispatch("editCourseClasses", {
          classIndex: index,
          courseId: this.$route.params.courseId,
          classDate: this.dates[index],
          classHour: this.times[index],
          classParticipants: this.participants[index],
          classNotes: this.notes[index]
        })
        .then(() => {
          this.snackBar = true;
          this.snackBarText = `جلسه‌ی ${index + 1} ذخیره گشت.`;
          this.showIcon[index] = "showClass";
          this.showCircle[index] = "hideClass";
        })
        .catch(e => {
          this.snackBar = true;
          this.snackBarText = e;
        });
    },
    onPopSession: function(index) {
      this.$store
        .dispatch("removeCourseClass", {
          classIndex: index,
          courseId: this.$route.params.courseId
        })
        .then(res => {
          this.dates[index] = new Date().toISOString().substr(0, 10);
          this.times[index] = "00:00";
          this.notes[index] = "";
          this.participants[index] = [];
          this.menuDate[index] = false;
          this.menuTime[index] = false;
          this.convertToJalali(index);
          this.showIcon[index] = "showClass";
          this.showCircle[index] = "hideClass";
          this.isSubmitted[index] = false;
          this.snackBar = true;
          this.snackBarText = res;
        })
        .catch(e => {
          this.snackBar = true;
          this.snackBarText = e;
        });
    },
    fetchCourseInfo: function() {
      this.courseData = this.$store.getters.getCourseInfo;
      this.courseURL = this.$store.getters.getCourseURL;
      this.courseId = this.$store.getters.getCourseId;
      this.cardIsLoaded = true;
    }
  },
  computed: {
    autoCompleteUsers: function() {
      return this.$store.getters.getAutoCompleteUsers;
    },
    courseInfo: function() {
      return this.$store.getters.getCourseInfo;
    }
  }
};
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', '../../assets/fonts/Yekan')

body, .pageTitle, .inputHolder, .datePicker, .timePicker, .courseCard
  font-family: 'Yekan', Tahoma, sans-serif

.inputHolder
  font-weight: 1000

.counter
  display: flex

.pageTitle
  display: flex
  margin-right: 1rem

.icon
  margin-left: 0.5rem

.showClass
  display: inline

.hideClass
  display: none

.loader
  position: absolute
  top: 50%
  left: 50%
  margin-right: -50%
  transform: translate(-50%, -50%)


</style>
