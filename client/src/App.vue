<template lang="pug">
v-app
  v-app-bar(app color="primary" dark)
    v-span(:v-if="isUserState" v-for="(link, index) in stateLinks" :key="index" class="menu pa-1")      
      v-btn(color="green" :to="link.link")="{{ link.text }}"      
        v-icon(right).icon
          |{{ link.icon }}
        v-spacer
      

    
  
  v-content
    transition
      keep-alive
        router-view
</template>  
<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    isGuest: false,
    isUser: false,
    isSchool: false,
    stateLinks: null,
    isUserState: null
  }),
  computed: {
    userInfo: function() {
      return this.$store.getters.getUserInfo;
    },
    loggedIn: function() {
      return this.$store.getters.getLoggedIn;
    },
    schoolLoggedIn: function() {
      return this.$store.getters.getSchoolLoggedIn;
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
    if (!this.loggedIn || !this.schoolLoggedIn || this.loggedIn == undefined || this.schoolLoggedIn == undefined) {
      this.isGuest = true;
      this.stateLinks = this.guestLinks;
    }
    if (this.loggedIn) {
      this.isUser = true;
      this.stateLinks = this.userLinks;
    }
    if (this.schoolLoggedIn) {
      this.isSchool = true;
      this.stateLinks = this.schoolLinks;
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
