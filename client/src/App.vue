<template lang="pug">
v-app
  v-app-bar(app color="primary" dark)
    span(v-if="isNameState" class="name")="{{welcomeName}}"
    span(:v-if="isUserState" v-for="(link, index) in stateLinks" :key="keys[index]" class="menu pa-1")      
      v-btn(color="green" @click="onTo(link.link)")="{{ link.text }}"      
        v-icon(right).icon
          |{{ link.icon }}
        v-spacer
      

    
  
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
    dataIsReady: false
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
        this.welcomeName = this.userInfoData.firstName;
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
        this.welcomeName = this.schoolInfoData.name;
      } else if (newSchoolLoggedIn == false) {
        this.isGuest = true;
        this.isSchool = false;
        this.stateLinks = this.guestLinks;
        this.isNameState = true;
        this.welcomeName = FA.STR_guest;
      }
    },
    userInfo: function(newUserData) {
      this.fetchUserData(newUserData);
    },
    schoolInfo: function(newSchoolData) {
      this.fetchSchoolData(newSchoolData);
    },
    isGuest: function(newIsGuest) {
      if (newIsGuest == false && this.isSchool == true) {
        this.welcomeName = this.schoolInfoData.name;
        this.isNameState = true;
      } else if (newIsGuest == false && this.isUser == true) {
        this.welcomeName = this.userInfoData.firstName;
        this.isNameState = true;
      } else if (newIsGuest == true) {
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
      this.welcomeName = this.userInfoData.firstName;
      this.isNameState = this.isUser && this.dataIsReady;
    },
    fetchSchoolData: function(newSchoolData) {
      this.schoolInfoData = newSchoolData;
      this.dataIsReady = true;
      this.welcomeName = this.schoolInfoData.name;
      this.isNameState = this.isSchool && this.dataIsReady;
    }
  }
};
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', 'assets/fonts/Yekan')

body, .menu, .name
  font-family: 'Yekan', Tahoma, sans-serif

.name
  margin-left: 0.5rem
  border: 0.5px solid
  padding: 0.5rem
  border-radius: 4rem
  background-color: purple
</style>
