<template>
  <v-app id="page">
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({})
};
</script>

<style>
.centered {
  text-align: center;
  margin: 0 auto;
  width: 80%;
}
</style>
