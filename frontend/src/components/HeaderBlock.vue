<template>
  <header class="header">
    <div class="container">
      <div id="logo">
        <img src="../assets/icon-left-font-monochrome-white.svg"
            alt="Logo Groupomania" />
      </div>
    </div>
    <div class="banner-line-bottom">
      <NavBar />
    </div>
  </header>
</template>

<script>
import NavBar from "./NavBar.vue";
export default {
  name: "HeaderBloc",
  components: {
    NavBar,
  },
};
</script>

<style scoped lang="scss">

.header {
  top: 0;
  position: fixed;
  z-index: 99;
  width: 100vw;
  max-width: 1920px;
  overflow: hidden;
  background-color: #8c8d8f;
  border-top: solid #ae2833 3px;

  .banner-line-bottom {
    height: 30px;
    border-bottom: solid #ae2833 2px;
  }

  #logo img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    padding: 10px 0;
  }
}
</style>