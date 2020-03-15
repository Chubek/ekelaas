<template lang="pug">
include ../../assets/locale/FA.pug
div
    h2.pageTitle
        |#{STR_courseHeader}
    v-card.inputHolder.d-flex.justify-center.text-end(class="d-flex pa-10 ma-10")
        v-alert(v-model="alert" border="right" ::color="alertColor" dark dismissible)="{{alertText}}"
        v-col(cols="12" sm="6" md="3")
            v-text-field(v-model="subject" label=STR_subject placeholder=STR_subject outlined)
            v-text-field(v-model="description" label=STR_description placeholder=STR_description outlined)
            v-text-field(v-model="price" label=STR_price placeholder=STR_price outlined)
            v-btn(color="purple" large dark @click="onSubmitInfo")=STR_sendInfo

</template>
<script>
export default {
  name: "SetCourse",
  data: () => ({
    subject: null,
    description: null,
    price: null,

    alert: false,
    alertColor: null,
    alertText: null
  }),
  methods: {
    onSubmitInfo: function() {
      this.$store
        .dispatch("setUpCourse", {
          subject: this.subject,
          description: this.description,
          price: this.price
        })
        .then(res => {
          this.alert = true;
          this.alertColor = "blue";
          this.alertText = res;
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
</style>