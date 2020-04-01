<template lang="pug">
include assets/locale/FA.pug
v-app  
  v-app-bar(app color="primary" dark)    
    v-app-bar-nav-icon(class="hamburgerIcon ml-2" @click="hamburgerMenu = !hamburgerMenu")
    v-menu(v-model="hamburgerMenu" nudge-right="200")
      v-list(class="menuList")
        v-list-item(v-for="(link, index) in stateLinks" :key="keys[index]" :href="link.link")
          v-list-item-icon
            v-icon(left)
              |{{link.icon}}
          v-list-item-content
            v-list-item-title(v-text="link.text")    
    v-menu(v-model="hamburgerMenu" nudge-right="600")
      v-list(class="menuListTablet")
        v-list-item(v-for="(link, index) in stateLinks" :key="keys[index]" :href="link.link")
          v-list-item-icon
            v-icon(left)
              |{{link.icon}}
          v-list-item-content
            v-list-item-title(v-text="link.text")

    div(class="siteTitle ml-3")=STR_siteName    
     
    v-container(fluid class="normalMenu")      
      v-row
        v-col(cols="12")
          v-row
            span(:v-if="isUserState" v-for="(link, index) in stateLinks" :key="keys[index]" class="menu pa-1")      
              v-btn(color="green" @click="onTo(link.link)")="{{ link.text }}"      
                v-icon(right).icon
                  |{{ link.icon }}
                v-spacer

    

    div(class="name")="{{ welcomeName }}"




  v-content
    router-view


</template>  
<script>
import _ from "lodash";
import FA from "./assets/locale/FA";
export default {
  name: "App",

  components: {},

  data: () => ({
    isGuest: false,
    isUser: false,
    isSchool: false,
    stateLinks: null,
    isUserState: null,
    keys: [],
    welcomeName: null,
    schoolInfoData: null,
    userInfoData: null,
    isNameState: false,
    dataIsReady: false,
    hamburgerMenu: false
  }),
  computed: {
    userInfo: function() {
      return this.$store.getters.getUserInfo;
    },
    loggedIn: function() {
      return this.$store.getters.getLoggedIn;
    },
    schoolLoggedIn: function() {
      return this.$store.getters.getSchoolIsLoggedIn;
    },
    guestLinks: function() {
      return this.$store.getters.getGuestLinks;
    },
    userLinks: function() {
      return this.$store.getters.getUserLinks;
    },
    schoolLinks: function() {
      return this.$store.getters.getSchoolLinks;
    },
    schoolInfo: function() {
      return this.$store.getters.getSchoolInfo;
    }
  },
  mounted: function() {
    if (
      !this.loggedIn ||
      !this.schoolLoggedIn ||
      this.loggedIn == undefined ||
      this.schoolLoggedIn == undefined
    ) {
      this.isGuest = true;
      this.isUser = false;
      this.stateLinks = this.guestLinks;
      this.welcomeName = FA.STR_guest;
      this.isNameState = true;
    }
    if (this.loggedIn) {
      this.isUser = true;
      this.isGuest = false;
      this.stateLinks = this.userLinks;
      this.welcomeName = this.userInfo.firstName;
      this.isNameState = true;
    }
    if (this.schoolLoggedIn) {
      console.log("nick");
      this.isSchool = true;
      this.stateLinks = this.schoolLinks;
      this.isGuest = false;
      this.welcomeName = this.schoolInfo.name;
      this.isNameState = true;
    }
  },
  watch: {
    loggedIn: function(newLoggedIn) {
      if (newLoggedIn == true) {
        this.isUser = true;
        this.isGuest = false;
        this.stateLinks = this.userLinks;
        this.welcomeName = this.userInfo.firstName;
      } else if (newLoggedIn == false) {
        this.isGuest = true;
        this.isUser = false;
        this.stateLinks = this.guestLinks;
        this.isNameState = true;
        this.welcomeName = FA.STR_guest;
      }
    },
    schoolLoggedIn: function(newSchoolLoggedIn) {
      console.log("SchoolloggedInChanged");
      if (newSchoolLoggedIn == true) {
        this.isSchool = true;
        this.stateLinks = this.schoolLinks;
        this.welcomeName = this.schoolInfo.name;
      } else if (newSchoolLoggedIn == false) {
        this.isGuest = true;
        this.isSchool = false;
        this.stateLinks = this.guestLinks;
        this.isNameState = true;
        this.welcomeName = FA.STR_guest;
      }
    },
    isGuest: function(newIsGuest) {
      if (newIsGuest == true) {
        this.welcomeName = FA.STR_guest;
        this.isNameState = true;
      }
    }
  },
  created: function() {
    for (let i = 0; i < 30; i++) {
      this.keys.push(_.random(10, 100));
    }
  },
  methods: {
    onTo: function(link) {
      this.$router.push({ path: link });
      this.keys = _.shuffle(this.keys);
      this.$forceUpdate();
    },
    fetchUserData: function(newUserData) {
      this.userInfoData = newUserData;
      this.dataIsReady = true;
      this.welcomeName = this.userInfo.firstName;
      this.isNameState = this.isUser && this.dataIsReady;
    },
    fetchSchoolData: function(newSchoolData) {
      this.schoolInfoData = newSchoolData;
      this.dataIsReady = true;
      this.welcomeName = this.schoolInfo.name;
      this.isNameState = this.isSchool && this.dataIsReady;
    }
  }
};
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', 'assets/fonts/Yekan')

body, .menu, .name, .menuList, .menuListTablet, .siteTitle
  font-family: 'Yekan', Tahoma, sans-serif

.hamburgerIcon
  display: none

.name
  margin-left: 1rem
  border-left: 0.4rem solid black
  padding-right: 1.5rem
  padding-bottom: 0.5rem
  padding-top: 0.5rem
  border-radius: 2rem
  background-color: purple
  display: flex
  text-align: center
  width: 100px

@media (min-width: 768px) and (max-width: 979px)
  .hamburgerIcon
    display: inline

  .normalMenu
    display: none

  .name
    margin-right: 70%

  .menuList
    display: none

@media (max-width: 767px)
  .hamburgerIcon
    display: inline

  .normalMenu
    display: none

  .name
    margin-right: 40%

  .menuListTablet
    display: none
</style>
