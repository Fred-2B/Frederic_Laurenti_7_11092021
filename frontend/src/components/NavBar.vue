<template>
  <nav id="nav-bar">
    <span v-if="user.isLogged">
      <router-link class="router-link" to="/">Accueil</router-link>
      <router-link class="router-link" to="/profil">{{ user.username }}</router-link>
      <a class="logout-button router-link" @click="logout">Déconnexion</a>
    </span>
    <span v-else>
      <router-link class="router-link" to="/register">S'inscrire</router-link>
      <router-link class="router-link" to="/login">Se connecter</router-link>
    </span>
  </nav>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "NavBar",
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    logout() {
      this.$store.state.user.isLogged = false;
      if (localStorage.getItem("data")) {
        localStorage.removeItem("data");
      }
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss">
#nav-bar {
  display: flex;
  justify-content: center;
  font-size: 1rem;
  text-transform: uppercase;
}

.router-link {
  padding: 0 15px;
  text-decoration: none;
  color: #2c3e50;
  font-weight: bold;
}

.logout-button {
  cursor: pointer;
}

.router-link-exact-active {
  color: #f80606;
  font-weight: bold;
}
</style>