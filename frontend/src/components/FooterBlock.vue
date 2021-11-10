<template>
  <footer>
    <a href="#">CONTACT</a>
    <a href="#">FAQ</a>
    <a href="#">CGU</a>
  </footer>
</template>

<script>
export default {
  name: "FooterBlock",
};
</script>

<style lang="scss">

footer {
  height: 50px;
  background-color: #8c8d8fe9;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 2px solid #ae2833;
  
  a {
    margin: 0 10px;
    text-decoration: none;
    color: #2c3e50;
    font-size: 20px;
  }
}
</style>