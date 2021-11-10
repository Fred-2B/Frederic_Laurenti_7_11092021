<template>
  <div class="home">
    <div v-if="boxPost.value != 'closed'"><DialogBoxPost /></div>
    
    <div class="not-logged" v-if="!user.isLogged">
      <p>Vous êtes déconnecté</p>
      <router-link to="/login">→ Page de connexion ←</router-link>
    </div>
    <div v-else>
      <div class="intro-text">Espace interne du reseau social <i>Groupomania</i><br /> Partager et commenter vos photos <i>&</i> vidéos
      </div>
      <div class="buttons">
        <button type="button" @click="boxPost.value = 'new-post_0'">
          Ajouter un Post
        </button>
        <!--<button type="button" @click="updateWallPosts">Rafraichir</button>-->
      </div>
      <div class="all-posts">
        <div v-for="(thisPost, index) in allPosts[0]" :key="index">
          <PostBlock :thisPost="thisPost" :allComments="allComments" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PostBlock from "../components/PostBlock.vue";
import DialogBoxPost from "../components/DialogBoxPost.vue";
export default {
  name: "Home",
  components: {
    PostBlock,
    DialogBoxPost,
  },
  computed: {
    ...mapState(["api", "user", "boxPost"]),
  },
  data() {
    return {
      allPosts: "",
      allComments: "",
    };
  },
  beforeMount() {
    // récupère les informations avant d'être monté
    this.updateWallPosts();
  },
  methods: {
    // récupére les informations des publications sur le serveur et envoye les informations au composant Post
    // est également appelé par le composant DialogBoxPost lorsqu'il est supprimé du DOM
    updateWallPosts() {
      fetch(this.api.url + "/post" + "/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + this.user.token,
        },
      })
        .then(function (res) {
          if (res.ok) {
            return res.json();
          }
          throw new Error(res.status);
        })
        .then((data) => {
          this.allPosts = [data.result.allPosts];
          this.allComments = [data.result.allComments];
        })
        .catch((error) => {
          this.$store.state.user.isLogged = false;
          console.log(error);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.intro-text {
  width: 80%;
  text-align: center;
  margin: 120px auto 50px;
  padding: 15px;
  max-width: 1024px;
  color: #2c3e50;
  font-weight: bold;
  font-size: 20px;
  border:  2px solid #ae2833;
  box-shadow: rgba(0, 0, 0, 0.90) 0px 2px 25px 6px;
  background-color:#8c8d8fe9;
  border-radius: 5px;
}

.buttons {
    text-align: center;
      button {
      color: #2c3e50;
      background-color: #8c8d8fe9;
      margin: 10px 10px 40px;
      width: 400px;
      padding: 15px 0;
      font-weight: bold;
      font-size: 1.1em;
      border:  2px solid #ae2833;
      border-radius: 50px;
      transition: .3s all ease-in-out;
      &:hover {
        background-color: #2c3e50d9;
        color: white;
        box-shadow: rgba(0, 0, 0, 0.90) 0px 2px 25px 2px;
      }
    }
}

.not-logged {
  text-align: center;
  color: #ae2833;
}

.all-posts {
  display: flex;
  flex-direction: column-reverse;
}
</style>
