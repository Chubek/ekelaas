<template lang="pug">
v-app
  v-app-bar(app color="primary" dark)
    span(:v-if="isUserState" v-for="(link, index) in stateLinks" :key="keys[index]" class="menu pa-1")      
      v-btn(color="green" @click="onTo(link.link)")="{{ link.text }}"      
        v-icon(right).icon
          |{{ link.icon }}
        v-spacer
      

    
  
  v-content
    transition
      keep-alive
        router-view
</template>  
<script>
import _ from "lodash";
export default {
  name: "App",

  components: {},

  data: () => ({
    isGuest: false,
    isUser: false,
    isSchool: false,
    stateLinks: null,
    isUserState: null,
    keys: []
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
    }
    if (this.loggedIn) {
      this.isUser = true;
      this.isGuest = false;
      this.stateLinks = this.userLinks;
    }
    if (this.schoolLoggedIn) {
      this.isSchool = true;
      this.stateLinks = this.schoolLinks;
    }
  },
  watch: {
    loggedIn: function(newLoggedIn) {
      if (newLoggedIn == true) {
        this.isUser = true;
        this.isGuest = false;
        this.stateLinks = this.userLinks;
      } else if (newLoggedIn == false) {
        this.isGuest = true;
        this.isUser = false;
        this.stateLinks = this.guestLinks;
      }
    },
    schoolLoggedIn: function(newSchoolLoggedIn) {
      console.log("SchoolloggedInChanged");
      if (newSchoolLoggedIn == true) {
        this.isSchool = true;
        this.stateLinks = this.schoolLinks;
      } else if (newSchoolLoggedIn == false) {
        this.isGuest = true;
        this.isSchool = false;
        this.stateLinks = this.guestLinks;
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
    }
  }
};
</script>
<style lang="sass" scoped>
@import '@/assets/sass/_colors', '@/assets/sass/_font'
@include font('Yekan', 'assets/fonts/Yekan')

body, .menu

  font-family: 'Yekan', Tahoma, sans-serif
</style>
