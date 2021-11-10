<template>
  <div>
    <!-- pour un nouveau post -->
    <div v-if="boxPost.value == 'new-post_0'" class="dialog-box-post">
      <form @change="validateForm" @keyup="validateForm" id="formPost">
        <div class="header-box">
          <h2>Nouveau</h2>
        </div>
        <div v-if="image != ''" class="image-block">
          <img :src="image" />
        </div>
        <div class="inputs">
          <label for="title">Titre*</label>
          <input v-model="title" name="title" id="title" type="text" />
          <label for="desc">Description*</label>
          <input v-model="desc" name="desc" id="desc" type="text" />
          <div>
            <input
              name="image"
              type="file"
              id="input-image"
              @change="updatePicture"
              accept="image/png, image/jpg, image/jpeg, image/gif" />
            <input
              type="button"
              value="Choisir une image*"
              onclick="document.getElementById('input-image').click();" />
            <button
              @click="submitData"
              :disabled="formIsNotValid"
              type="button">
              Valider
            </button>
            <button type="button" @click="boxPost.value = 'closed'">
              Annuler
            </button>
          </div>
          <p classe="alert"><br />* champs requis</p>
        </div>
      </form>
    </div>
    <!-- pour éditer le message -->
    <div v-else-if="boxPost.value.split('_')[0] === 'edit-post'"
      class="dialog-box-post">
      <form @keyup="validateForm" id="formPost">
        <div class="header-box">
          <h2>Modifier</h2>
        </div>
        <div class="image-block">
          <img :src="image" />
        </div>
        <div class="inputs">
          <label for="title">Titre*</label>
          <input v-model="title" name="title" id="title" type="text" />
          <label for="desc">Description*</label>
          <input v-model="desc" name="desc" id="desc" type="text" />
          <div>
            <input name="image" type="file" id="input-image"
              @change="updatePicture"
              accept="image/png, image/jpg, image/jpeg, image/gif" />
            <input type="button" value="Choisir une image"
              onclick="document.getElementById('input-image').click();" />
            <button @click="submitData" name="submit"
              :disabled="formIsNotValid"
              type="button">
              Valider
            </button>
            <button type="button" @click="boxPost.value = 'closed'">
              Annuler
            </button>
          </div>
          <p classe="alert"><br />* champs requis</p>
        </div>
      </form>
    </div>
    <!-- pour supprimer le message -->
    <div
      v-else-if="boxPost.value.split('_')[0] == 'delete-post'"
      class="dialog-box-post">
      <form id="formPost">
        <h2>Supprimer</h2>
        <div>
          <button @click="submitData" name="submit" type="button">
            Valider
          </button>
          <button type="button" @click="boxPost.value = 'closed'">
            Annuler
          </button>
        </div>
      </form>
    </div>
    <!-- pour un nouveau commentaire -->
    <div
      v-else-if="boxPost.value.split('_')[0] == 'new-comment'"
      class="dialog-box-post">
      <form @keyup="validateForm" id="formPost">
        <div class="header-box">
          <h2>Commenter</h2>
        </div>
        <div class="inputs">
          <label for="comment">Commentaire*</label>
          <input v-model="comment" name="comment" id="comment" type="text" />
          <div>
            <button
              @click="submitData"
              name="submit"
              :disabled="formIsNotValid"
              type="button" >
              Valider
            </button>
            <button type="button" @click="boxPost.value = 'closed'">
              Annuler
            </button>
          </div>
          <p classe="alert"><br />* champ requis</p>
        </div>
      </form>
    </div>
    <!-- pour modifier le commentaire -->
    <div
      v-else-if="boxPost.value.split('_')[0] == 'edit-comment'"
      class="dialog-box-post">
      <form @keyup="validateForm" id="formPost">
        <div class="header-box">
          <h2>Modifier</h2>
        </div>
        <div class="inputs">
          <label for="comment">Commentaire*</label>
          <input v-model="comment" name="comment" id="comment" type="text" />
          <div>
            <button
              @click="submitData"
              name="submit"
              :disabled="formIsNotValid"
              type="button">
              Valider
            </button>
            <button type="button" @click="boxPost.value = 'closed'">
              Annuler
            </button>
          </div>
          <p classe="alert"><br />* champ requis</p>
        </div>
      </form>
    </div>
    <!-- pour supprimer le commentaire -->
    <div
      v-else-if="boxPost.value.split('_')[0] == 'delete-comment'"
      class="dialog-box-post">
      <form id="formPost">
        <h2>Supprimer</h2>
        <div>
          <button @click="submitData" name="submit" type="button">
            Valider
          </button>
          <button type="button" @click="boxPost.value = 'closed'">
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "DialogBoxPost",
  computed: {
    ...mapState(["api", "user", "boxPost"]),
  },
  data() {
    return {
      image: "",
      title: "",
      desc: "",
      comment: "",
      apiRoute: "init",
      apiMethod: "init",
      eltId: null, // l'identifiant de l'élément sélectionné
      formIsNotValid: false,
    };
  },
  // préparer la boîte de dialogue avant d'être envoye au DOM
  beforeMount() {
    const action = this.boxPost.value.split("_")[0];
    const eltId = this.boxPost.value.split("_")[1];
    this.eltId = parseInt(eltId, 10);
    switch (action) {
      case "new-post":
        this.apiMethod = "POST";
        this.apiRoute = "/post" + "/";
        break;
      case "edit-post":
        var eltImage = document.querySelector("#post-id_" + eltId + " img");
        this.title = document.querySelector(
          "#post-id_" + eltId + " h2"
        ).textContent;
        eltImage.removeAttribute("value");
        this.image = eltImage.getAttribute("src");
        this.desc = document.querySelector(
          "#post-id_" + eltId + " .description"
        ).textContent;
        this.apiMethod = "PUT";
        this.apiRoute = "/post" + "/" + eltId;
        break;
      case "delete-post":
        this.apiMethod = "DELETE";
        this.apiRoute = "/post" + "/" + eltId;
        break;
      case "new-comment":
        this.apiMethod = "POST";
        this.apiRoute = "/comment" + "/" + eltId;
        break;
      case "edit-comment":
        this.comment = document.getElementById(
          "commantary_" + eltId
        ).textContent;
        this.apiMethod = "PUT";
        this.apiRoute = "/comment" + "/" + eltId;
        break;
      case "delete-comment":
        this.apiMethod = "DELETE";
        this.apiRoute = "/comment" + "/" + eltId;
        break;
    }
    this.validateForm();
  },
  methods: {
    // activer ou désactiver le bouton "valider" selon le modèle de box utilisé
    validateForm() {
      const action = this.boxPost.value.split("_")[0];
      switch (action) {
        case "new-post":
          // requis "img, desc, titre"
          this.image != "" &&
          /^(.{1,64})$/.test(this.title) &&
          /^(.{1,255})$/.test(this.desc)
            ? (this.formIsNotValid = false)
            : (this.formIsNotValid = true);
          break;
        case "edit-post":
          // requis "desc, titre"
          /^(.{1,64})$/.test(this.title) && /^(.{1,255})$/.test(this.desc)
            ? (this.formIsNotValid = false)
            : (this.formIsNotValid = true);
          break;
        case "new-comment":
          // requis "comment"
          /^(.{1,255})$/.test(this.comment)
            ? (this.formIsNotValid = false)
            : (this.formIsNotValid = true);
          break;
        case "edit-comment":
          // requis "commenter aussi"
          /^(.{1,255})$/.test(this.comment)
            ? (this.formIsNotValid = false)
            : (this.formIsNotValid = true);
          break;
      }
    },

    // pour générer l'image sélectionnée par l'utilisateur
    createImage(file) {
      const reader = new FileReader();
      const vm = this;
      reader.onload = (e) => {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    updatePicture(e) {
      const file = e.target.files || e.dataTransfer.files;
      if (!file.length) {
        return;
      }
      this.image = file[0];
      this.createImage(file[0]);
    },

    // Soumettre
    submitData() {
      if (this.submitDisabled) {return}
      let headers = { Authorization: "Bearer " + this.user.token };
      const action = this.boxPost.value.split("_")[0];
      let formData = {};
      if (action === "new-post" || action === "edit-post") {
        formData = new FormData(document.getElementById("formPost"));
        formData.append("userId", parseInt(this.user.id, 10));
      } else {
        formData["userId"] = parseInt(this.user.id, 10);
        if (action === "edit-comment" || action === "new-comment") {
          formData["comment"] = this.comment;
        }
        formData = JSON.stringify(formData);
        headers["Accept"] = "application/json, text/plain, */*";
        headers["Content-Type"] = "application/json";
      }
      fetch(this.api.url + this.apiRoute, {
        method: this.apiMethod,
        headers: headers,
        body: formData,
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw res.status;
        })
        .then(() => {
          this.boxPost.value = "closed";
          this.$parent.updateWallPosts();
        })
        .catch((err) => {
          console.log('Erreur: '+ err);
          if (err === 401){
            alert('Error: ' + err + ' unauthorized')
          }
        });
    },
  },
};
</script>

<style scoped lang="scss">
.dialog-box-post {
  // z-index + avant : empêche les clics indésirables sur le DOM
  z-index: 100;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1290px;
  left: 50%;
  top: 25%;
  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    opacity: 0.4;
  }

  .header-box {
    width: 100%;
  }

  form {
    z-index: 999;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px 30px 20px;
    background-color: #8c8d8f;
    border-width: 2px;
    border-radius: 5px;
    border:  2px solid #ae2833;
    box-shadow: rgba(0, 0, 0, 0.90) 0px 4px 20px 8px;

    .image-block {
      display: flex;
      background-color: #e6e6e6;
      text-align: center;
      height: 200px;
      width: 350px;
      border: solid #fff;
      border-width: 2px;
      overflow: hidden;

      img {
        width: 100%;
        max-height: 100%;
      }
    }

    .inputs {
      width: max-content;
      display: flex;
      flex-direction: column;
      text-align: center;
      padding: 20px;
      color: #f8f8f8;

      #input-image {
        display: none;
      }

      button {
        margin: 20px 3px;
      }
    }
  }
}
</style>