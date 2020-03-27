<template lang="pug">
include ../assets/locale/FA.pug

v-container.mainContainer
  div.mainDiv.d-lg-flex.d-md-none.d-sm-none.d-xs-none
    v-img.mainImage(src="../assets/img/front-page-students.jpg" gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)")
    p.mainParagraph
        |#[v-icon(x-large).icon="mdi-chevron-left-circle-outline"]گروه ‌ای‌کلاس با نوین‌ترین تکنولوژی‌های نرم‌افزاری روز دنیا، اقدام به برگزاری
        |کلاس‌های آنلاین و آموزش مجازی مطابق با استانداردهای بین المللی نموده‌است. کلاس‌های آنلاین به استادان و دبیران مدارس فرصت برنامه ریزی کلاس ها را به صورت مجازی
        |داده و تمام ویژگی‌های یک کلاس واقعی را در یک محیط مجازی فراهم می‌سازد .

  div.mainDivTextOnly.d-lg-none    
    p.mainParagraph
        |#[v-icon(x-large).icon="mdi-chevron-left-circle-outline"]گروه ‌ای‌کلاس با نوین‌ترین تکنولوژی‌های نرم‌افزاری روز دنیا، اقدام به برگزاری
        |کلاس‌های آنلاین و آموزش مجازی مطابق با استانداردهای بین المللی نموده‌است. کلاس‌های آنلاین به استادان و دبیران مدارس فرصت برنامه ریزی کلاس ها را به صورت مجازی
        |داده و تمام ویژگی‌های یک کلاس واقعی را در یک محیط مجازی فراهم می‌سازد .


</template>

<script>
import FA from "../assets/locale/FA";
export default {
  name: "Home",
  title: FA.titles.home,
  data: () => ({})
};
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', '../assets/fonts/Yekan')

body, .mainDiv, .mainDivTextOnly
  font-family: 'Yekan', Tahoma, sans-serif

.mainDiv, .mainDivTextOnly
  display: flex
  margin-top: 1rem

.mainImage
  -webkit-clip-path: polygon(49% 7%, 100% 38%, 74% 88%, 8% 81%, 10% 41%)
  clip-path: polygon(49% 7%, 100% 38%, 74% 88%, 8% 81%, 10% 41%)

.mainParagraph
  max-width: 600px
  font-size: 2rem
  border: 1px solid
  border-radius: 2rem
  padding: 2rem
  text-align: justify

.icon
  margin-left: 1rem
</style>
