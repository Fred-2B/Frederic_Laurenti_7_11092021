<template>
  <!-- tous les posts en boucle, auront un identifiant unique 'post-id_XX' -->
  <div :id="'post-id_' + thisPost.id" class="post-block">
    <div class="setting">
      <button
        type="button"
        @click="boxPost.value = 'new-comment_' + thisPost.id">
        Commenter
      </button>
      <span v-if="user.isAdmin === 1 || thisPost.userId == user.id">
        <button type="button" @click="boxPost.value = 'edit-post_' + thisPost.id">
          Modifier
        </button>
      </span>
      <span v-if="user.isAdmin === 1 || thisPost.userId == user.id">
        <button type="button" @click="boxPost.value = 'delete-post_' + thisPost.id">
          Supprimer
        </button>
      </span>
    </div>
    <p class="author">
      Ajouter par
      <span>{{ thisPost.username }}</span>
      le
      {{
        new Date(thisPost.createdAt).toLocaleDateString("fr-FR") +
        " à " +
        new Date(thisPost.createdAt).toLocaleTimeString("fr-FR")
      }}
    </p>
    <h2 class="title">{{ thisPost.title }}</h2>
    <p class="description">{{ thisPost.desc }}</p>
    <section class="post">
      <div class="picture-block">
        <img
          :src="thisPost.imgURL"
          :alt="thisPost.title + ' by ' + thisPost.username" />
      </div>
      <div class="comment-block">
        <h3>Commentaire(s)</h3>
        <hr />
        <div
          v-for="(thisComment, index) in allComments[0]"
          :key="(thisComment[0], index)">
          <div>
            <div v-if="thisPost.id === thisComment.postId" class="comment">
              <div class="buttons">
                <button v-if="user.isAdmin || thisComment.authorId === user.id"
                  @click="boxPost.value = 'delete-comment_' + thisComment.id">
                  Supprimer
                </button>
                <button v-if="user.isAdmin || thisComment.authorId === user.id"
                  @click="boxPost.value = 'edit-comment_' + thisComment.id">
                  Modifier
                </button>
              </div>
              <cite
                :title="
                  'Posté le ' +
                  new Date(thisComment.createdAt).toLocaleDateString('fr-FR') +
                  ' à ' +
                  new Date(thisComment.createdAt).toLocaleTimeString('fr-FR')
                "
                ><span class="comment-author">{{ thisComment.author }} : </span>
                <span :id="'commantary_' + thisComment.id">{{
                  thisComment.comment
                }}</span></cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "PostBlock",
  // récupère les messages et les commentaires
  props: {
    thisPost: {
      type: Object,
    },
    allComments: {
      type: Array,
    },
  },
  computed: {
    ...mapState(["user", "boxPost"]),
  },
};
</script>

<style scoped lang="scss">
.post-block {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 1024px;
  margin: 10px auto 60px;
  width: 80%;
  background-color: #8c8d8fe9;
  border-radius: 5px;
  padding: 20px;
  border: solid #ae2833 2px;
  box-shadow: rgba(0, 0, 0, 0.90) 0px 2px 25px 6px;

  .description {
    padding: 6px 0 0;
    text-align: left;
    color: #2c3e50;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .title {
    margin: 0;
    text-align: left;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .author {
    padding: 0 0 5px;
    color: #2c3e50;
    font-size: 0.9rem;
    text-align: left;
      span {
        color: #ae2833;
        font-size: 1.2rem;
        font-weight: bold;
        text-transform: uppercase;
      }
  }

  .setting {
    text-align: center;
      button {
      margin: 10px 5px 40px;
    }
  }

  .post {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    .picture-block {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
      width: 100%;
      /*background-color: #2c3e50;*/
      overflow: hidden;
      padding: 20px 5px;
      margin: 20px 0;

      img {
        max-width: 100%;
        height: 100%;
        border: 2px solid #ae2833;
      }
    }

    .comment-block {
      overflow: hidden;
      width: 100%;
      height: 200px;
      bottom: 0;
      transition: all 500ms ease-in-out;
      
      h3 {
        font-size: 1rem;
        color: #2c3e50;
        margin: 0;
        margin: 15px auto 10px;
        text-align: center;
      }

      hr {
        border: #ae2833;
        margin-bottom: 20px;
        padding-bottom: 2px;
        width: 40%;
        background-color: #ae2833;
        border-radius: 5px;
      }

      .comment-author {
        padding-right: 5px;
        font-weight: bold;
        font-style: initial;
        text-transform: uppercase;
      }

      .comment {
        position: relative;
        padding: 0 150px 0 10px;
        margin: 10px;
        font-style: normal;
        font-size: 1rem;
        color: #2c3e50;
        overflow: hidden;
        
        cite {
          font-size: 1rem;
          margin-bottom: 20px;
        }

        .buttons {
          position: absolute;
          right: 10px;
          top: 0;
          text-align: center;
          overflow: hidden;
          
          button {
            font-size: .9rem;
            font-weight: bold;
            color: #f5fffab9;   
            background-color: transparent;
            border: none;
            transition: .3s all ease-in-out;
            &:hover {
              color:#ae2833;
            }
          }
        }
      }
    }
  }
}
</style>
