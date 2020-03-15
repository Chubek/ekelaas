<template lang="pug">
include ../../assets/locale/FA.pug
div
    h2.pageTitle
        |#{STR_profileHeader}
    v-cardinputHolder.d-flex.justify-center.text-end(class="d-flex pa-10 ma-10")
        v-btn(color="blue" dark x-large @click="onMakeStudent")=STR_makeStudent
        v-btn(color="blue" dark x-large @click="onMakeTeacher" :class="displayMakeTeacher")=STR_makeTeacher
        h3.pageSubTitle
            |#{STR_infoTitle}
        v-card-title
            |#{STR_firstName} "{{ info.firstName }}"
            |#{STR_firstName} "{{ info.lastName }}"
        v-card-subtitle(:class="displayPhoneNumber")
            |#{STR_phoneNumber} "{{ info.phoneNumber }}"
    v-cardinputHolder.d-flex.justify-center.text-end.pa-10.ma-10(:class="displayStudent")
        h3.pageSubTitle
            |#{STR_studentTitle}
        v-card-title
            |#{STR_grade} "{{ studentInfo.grade }}"
            |#{STR_province} "{{ studentInfo.province }}"
            |#{STR_city} "{{ studentInfo.city }}"
            |#{STR_school} "{{ studentInfo.school }}"
    v-cardinputHolder.d-flex.justify-center.text-end.pa-10.ma-10(:class="displayTeacher")
        h3.pageSubTitle
            |#{STR_teacherTitle}
        v-card-title
            div(v-for="(credit, index) in teacherInfo.credits" :key="index")
                |"{{ credit }}"
            div(v-for="(degree, index) in teacherInfo.degrees" :key="index")
                |"{{ degree }}"

</template>
<script>
export default {
  name: "Profile",
  data: () => ({
    displayMakeTeacher: "hideClass",
    displayPhoneNumber: "hideClass",
    displayStudent: "hideClass",
    displayTeacher: "hideClass"
  }),
  computed: {
    isTeacher: function() {
      return this.$store.getters.getTeacherStatus;
    },
    isStudent: function() {
      return this.$store.getters.getStudentStatus;
    },
    info: function() {
      return this.$store.getters.getUserInfo;
    },
    studentInfo: function() {
      return this.$store.getters.getStudentInfo;
    },
    teacherInfo: function() {
      return this.$store.getters.getTeacherInfo;
    }
  },
  mounted: function() {
    if (isTeacher) {
      this.displayPhoneNumber = "displayClass";
      this.displayTeacher = "displayClass";
      this.displayStudent = "displayClass";
    }
  }
};
</script>