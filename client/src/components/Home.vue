<template lang="pug">
include ../assets/locale/FA.pug

v-container(fluid).mainContainer
  div.mainDiv
    v-img.mainImage(min-height="100" min-width="300" max-width="900" max-height="500" src="../assets/img/front-page-students.jpg" gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)")
    p.mainParagraph
        |#[v-icon(x-large).icon="mdi-chevron-left-circle-outline"]گروه ‌ای‌کلاس با نوین‌ترین تکنولوژی‌های نرم‌افزاری روز دنیا، اقدام به برگزاری
        |کلاس‌های آنلاین و آموزش مجازی مطابق با استانداردهای بین المللی نموده‌است. کلاس‌های آنلاین به استادان و دبیران مدارس فرصت برنامه ریزی کلاس ها را به صورت مجازی
        |داده و تمام ویژگی‌های یک کلاس واقعی را در یک محیط مجازی فراهم می‌سازد .

  div.mainDivTextOnly   
    p.mainParagraphTextOnly
        |#[v-icon(small).icon="mdi-chevron-left-circle-outline"]گروه ‌ای‌کلاس با نوین‌ترین تکنولوژی‌های نرم‌افزاری روز دنیا، اقدام به برگزاری
        |کلاس‌های آنلاین و آموزش مجازی مطابق با استانداردهای بین المللی نموده‌است. کلاس‌های آنلاین به استادان و دبیران مدارس فرصت برنامه ریزی کلاس ها را به صورت مجازی
        |داده و تمام ویژگی‌های یک کلاس واقعی را در یک محیط مجازی فراهم می‌سازد .

  div.buttonsMobile
    v-btn(color="primary" medium to="/register"  height="40" class="mr-10 mb-2" width="200")=STR_registerButton
      v-icon(right class="mr-2 ml-1" small).icon
        |mdi-account-multiple-plus

    v-btn(color="purple" dark medium to="/register-school"  class="mr-10" height="40" width="200")=STR_registerSchool
      v-icon(right class="mr-2 ml-1" small).icon
        |mdi-account-multiple-plus


  div.buttons
    v-btn(color="primary" medium to="/register"  height="60" class="mr-10 mb-2" width="200")=STR_registerButton
      v-icon(right class="mr-2 ml-1" small).icon
        |mdi-account-multiple-plus

    v-btn(color="purple" dark medium to="/register-school"  class="mr-10" height="60" width="200")=STR_registerSchool
      v-icon(right class="mr-2 ml-1" small).icon
        |mdi-account-multiple-plus


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

body, .mainDiv, .mainDivTextOnly, .buttonsMobile, .buttons
  font-family: 'Yekan', Tahoma, sans-serif

@media (min-width: 979px)
  .mainDiv, .mainDivTextOnly
    display: flex
    margin-top: 1rem

  .mainImage
    -webkit-clip-path: polygon(49% 7%, 100% 38%, 74% 88%, 8% 81%, 10% 41%)
    clip-path: polygon(49% 7%, 100% 38%, 74% 88%, 8% 81%, 10% 41%)

  .mainContainer
    margin-right: 10rem
    margin-top: 5rem

  .mainParagraph
    max-width: 600px
    font-size: 2rem
    border: 1px solid
    border-radius: 2rem
    padding: 2rem
    text-align: justify
    margin-right: 5rem

  .icon
    margin-left: 1rem

  .buttons
    margin-right: 55%
    margin-top: 3rem
    display: flex

  .mainParagraphTextOnly
    display: none

  .buttonsMobile
    display: none

@media (min-width: 979px) and (max-width: 1200px)
  .mainDiv, .mainDivTextOnly
    display: flex
    margin-top: 1rem

  .mainImage
    display: none

  .mainParagraph
    max-width: 600px
    font-size: 2rem
    border: 1px solid
    border-radius: 2rem
    padding: 2rem
    text-align: justify
    position: absolute
    left: 20%

  .icon
    margin-left: 1rem

  .buttons
    margin-right: 10%
    margin-top: 30rem
    display: flex

  .mainParagraphTextOnly
    display: none

  .buttonsMobile
    display: none

@media (min-width: 768px) and (max-width: 979px)
  .mainDiv, .mainDivTextOnly
    display: flex
    margin-top: 1rem

  .mainImage
    display: none


  .mainParagraph
    display: none

  .mainContainer
    margin-right: 10rem
    margin-top: 5rem

  .mainParagraphTextOnly
    max-width: 600px
    font-size: 2rem
    border: 1px solid
    border-radius: 2rem
    padding: 2rem
    text-align: justify
    position: relative
    left: 10%

  .icon
    margin-left: 1rem

  .buttons
    margin-left: 10%
    margin-top: 3rem
    display: flex

  .buttonsMobile
    display: none

@media (max-width: 767px)
  .buttonsMobile
    position: relative
    right: 2rem
    top: 1.3rem

  .buttons
    display: none

  .mainParagraphTextOnly
    font-size: 20px
    max-width: 300px
    text-align: justify
    position: relative
    top: 1rem
    border: 1px solid
    border-radius: 2rem
    padding: 2rem
    right: 5%

  .mainImage
    display: none

  .mainParagraph
    display: none
</style>
