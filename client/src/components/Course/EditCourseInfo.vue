<template lang="pug">
include ../../assets/locale/FA.pug
div
    h2.pageTitle
        v-icon.icon
          |mdi-clipboard-file-outline
        |#{STR_courseEditHeader}
    v-card.inputHolder.d-flex.justify-center.text-end(class="d-flex pa-10 ma-10")
        v-alert(v-model="alert" border="right" ::color="alertColor" dark dismissible)="{{alertText}}"
        v-col(cols="12" sm="6" md="3")
            v-text-field(v-model="subject" label=STR_subject placeholder=STR_subject outlined)
            v-text-field(v-model="description" label=STR_description placeholder=STR_description outlined)
            v-text-field(v-model="price" :rules="priceRules" label=STR_price placeholder=STR_price outlined)
            v-btn(color="primary" large dark @click="onSubmitInfo")=STR_sendInfo
              v-icon(:class="showIcon")
                |mdi-check-all
              v-progress-circular(color="white" indeterminate :class="showCircle")

</template>
<script>
import FA from "../../assets/locale/FA";
export default {
  name: "SetCourse",
  data: () => ({
    subject: null,
    description: null,
    price: null,
    priceRules: [
      v => {
        const pattern = /^[0-9]+$/;
        return pattern.test(v) || FA.STR_invalidPrice;
      }
    ],
    alert: false,
    alertColor: null,
    alertText: null,
    showIcon: "showClass",
    showCircle: "hideClass"
  }),
  created: function() {
    this.subject = this.courseInfo.subject;
    this.description = this.courseInfo.description;
    this.price = this.courseInfo.price;
  },
  computed: {
    courseInfo: function() {
      return this.$store.getters.getCourseInfo;
    }
  },
  methods: {
    onSubmitInfo: function() {
      this.$store
        .dispatch("editCourse", {
          courseId: this.$route.params.courseId,
          subject: this.subject,
          description: this.description,
          price: this.price
        })
        .then(res => {
          this.showIcon = "showClass";
          this.showCircle = "hideClass";
          this.alert = true;
          this.alertColor = "blue";
          this.alertText = res.message;
          this.$router.push({ path: "/view/created-courses" });
        })
        .catch(e => {
          this.alert = true;
          this.alertColor = "red";
          this.alertText = e;
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

.showClass
    display: inline

.hideClass
    display: none
</style>
