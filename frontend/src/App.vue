<template>
  <div id="app">
    <HeaderBlock />
    <main>
      <router-view />
    </main>
    <FooterBlock />
  </div>
</template>

<script>
import HeaderBlock from "./components/HeaderBlock.vue";
import FooterBlock from "./components/FooterBlock.vue";

import { mapState } from "vuex";

export default {
  name: "App",
  components: {
    HeaderBlock,
    FooterBlock,
  },
  computed: {
    ...mapState(["boxPost"]),
  },
};
</script>

<style lang="scss">

* {
  font-family: 'Noto Sans', sans-serif;
}

body {
  margin: 0;
}
a {
  color: #f8f8f8;
  &:hover {
    color: #c8d0d0;
  }
}

p {
  padding: 0;
  margin: 0;
}

button {
  cursor: pointer;
}

h1 {
  color: #2c3e50;
  text-transform: capitalize;
  margin: 100px 0 40px;
}

h2 {
  text-align: center;
  color: #2c3e50;
  text-transform: capitalize;
  margin-top: 20px;
}

#app {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  background-image: url("./assets/reseau-group.png");
}

main {
  padding-top: 100px;
  flex: 1;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.30);
}
</style>
