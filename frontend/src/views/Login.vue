<template>
  <div class="login">
    <form @keyup="validForm" @keyup.enter="login" id="form">
      
      <div>
        <div class="input">
          <label for="email">E-mail</label>
          <input id="email" type="email" v-model="registerForm.email"  required />
        </div>
        <div class="input">
          <label for="password">Mot de Passe</label>
          <input id="password" type="password" v-model="registerForm.password" required />
        </div>
        <button @click="login" type="button" :disabled="submitDisabled">
          CONNEXION
        </button>
        <p v-if="alertError" id="alert"><br />{{ alertMsg }}</p>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      registerForm: {
        email: "",
        password: "",
      },
      submitDisabled: true,
      alertError: false,
      alertMsg: "",
    };
  },
  computed: {
    ...mapState(["api", "user"]),
  },
  components: {},
  methods: {
    // appelé à chaque modification du formulaire
    // activer ou désactiver le bouton valider
    validForm() {
      const regexEmail =
        /^[a-z0-9!#$ %& '*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&' * +/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
      const regexPassword =
        /(^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64}$)/;
      if (
        regexEmail.test(this.registerForm.email) &&
        regexPassword.test(this.registerForm.password)
      ) {
        this.submitDisabled = false;
        this.alertError = false;
      } else {
        this.submitDisabled = true;
        this.alertError = true;
        this.alertMsg = "";
        if (
          this.registerForm.email &&
          !regexEmail.test(this.registerForm.email)
        ) {
          this.alertMsg += "E-mail incorrect\n";
        }
        if (
          this.registerForm.password &&
          !regexPassword.test(this.registerForm.password)
        ) {
          this.alertMsg +=
            "Mot de Passe incorrect\nMin. 8 + [a-z] + [A-Z] + [0-9] + [!/?% ...]";
        }
      }
    },
    // récupére 'onClick login'
    login() {
      if (this.submitDisabled) {return}
      if (!this.user.isLogged ) {
        fetch(this.api.url + "/auth/login", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.registerForm),
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            throw res.status;
          })
          .then((res) => {
            // mettre à jour Vuex var et localstorage et rediriger vers la vue d'accueil
            this.$store.state.user.isLogged = true;
            this.$store.state.user.username = res.username;
            this.$store.state.user.id = res.id;
            this.$store.state.user.token = res.token;
            this.$store.state.user.isAdmin = res.isAdmin;
            let localStorageData = {
              token: res.token,
              username: res.username,
              id: res.id,
              isAdmin: res.isAdmin,
            };
            localStorage.setItem("data", JSON.stringify(localStorageData));
            this.$router.push("/");
          })
          .catch((err) => {
            console.log('Error : ' +err);
            if (err === 401) {
              this.alertMsg = "Mot de passe ou identifiant incorrect!";
            } else if (err === 429) {
              this.alertMsg = "Trop de tentatives! Réessayez plus tard!";
            } else {
              this.alertMsg = 'Erreur : ' + err;
            }
            this.submitDisabled = true;
            this.registerForm.email = "";
            this.registerForm.password = "";
            this.alertError = true;
          });
      } else {
        this.alertError = true;
        this.alertMsg = "Vous êtes déjà connecté";
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../sass/auth.scss";
</style>
