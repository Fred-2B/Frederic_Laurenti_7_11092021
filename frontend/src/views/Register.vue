<template>
  <div class="register">
    <form @keyup="validForm"  @keyup.enter="register" id="form">
      
      <div>
        <div class="input">
          <label for="username">Nom d'utilisateur</label>
          <input id="username" type="text" v-model="registerForm.username"  required />
        </div>
        <div class="input">
          <label for="email">E-mail</label>
          <input id="email" type="email" v-model="registerForm.email"  required />
        </div>
        <div class="input">
          <label for="password">Mot de Passe</label>
          <input id="password" type="password" v-model="registerForm.password" required />
        </div>
        <button @click="register" type="button" :disabled="submitDisabled">
          INSCRIPTION
        </button>
        <p v-if="alertError" id="alert"><br />{{ alertMsg }}</p>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Register",
  data() {
    return {
      registerForm: {
        username: "",
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
      const regexUsername =
        /^([a-zA-Z.,'\-àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]{3,32})$/;
      const regexEmail =
        /^[a-z0-9!#$ %& '*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&' * +/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
      const regexPassword =
        /(^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64}$)/;
      if (
        regexUsername.test(this.registerForm.username) &&
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
          this.registerForm.username &&
          !regexUsername.test(this.registerForm.username)
        ) {
          this.alertMsg += "Nom d'utilisateur incorrect\n";
        }
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
    //récupérer 'onClick login'
    register() {
      if (this.submitDisabled) {return}
      // déclaration des données de la demande, pour éviter la répétition, (s'inscrire et se connecter)
      const reqData = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.registerForm),
      };
      if (!this.user.isLogged) {
        // S'inscrire
        fetch(this.api.url + "/auth/register", reqData)
          .then(function (res) {
            if (res.ok) {
              return res.json();
            }
            throw res.status;
          })
          .then(() => {
            // login (si la réponse est ok)
            fetch(this.api.url + "/auth/login", reqData)
              .then(function (res) {
                if (res.ok) {
                  return res.json();
                }
                throw res.status;
              })
              .then((res) => {
                // mettre à jour Vuex et localstorage et rediriger vers la page d'accueil
                this.$store.state.user.isLogged = true;
                this.$store.state.user.id = res.id;
                this.$store.state.user.username = res.username;
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
              });
          })
          .catch((err) => {
            console.log('Error :' + err);
            if (err === 409) {
              this.alertMsg = "E-mail déja utilisé !";
            } else if (err === 429) {
              this.alertMsg = "Trop de tentatives! Réessayez plus tard!";
            } else {
              this.alertMsg = 'Erreur :' + err;
            }
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
