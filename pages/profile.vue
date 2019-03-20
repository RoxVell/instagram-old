<template>
  <section class="profile container" :class="{ edit: editMode }">

    <div class="profile-section">
      <img :src="user.profile_picture" class="profile-section__avatar" alt="User Avatar">

      <div class="profile-section__user-info">

        <div class="profile-settings">
          <h2 class="profile-section__username">{{ user.username }}</h2>

          <button
            class="btn btn-edit"
            @click="switchEditMode">
            {{ editMode ? "Сохранить" : "Редактировать профиль" }}
          </button>
          
          <button class="btn" @click="signOut">Выйти</button>
        </div>

        <div>
          <ul class="profile-stats">
            <li><span class="profile-stats__count">{{ user.posts }}</span> публикаций</li>
            <li><span class="profile-stats__count">{{ user.subscribers.length }}</span> подписчиков</li>
            <li><span class="profile-stats__count">0</span> подписки</li>
          </ul>
        </div>

        <div v-if="user.profile_description" class="profile-description">
          <textarea
            :readonly="!editMode" class="default" style="width: 100%;" v-model="user.profile_description">
          </textarea>
        </div>
      </div>
      
    </div>

    <Gallery class="posts-section">
      <ProfilePost class="gallery-item" v-for="(post, index) in posts" :key="index" :post="post"/>
    </Gallery>

    <!-- <div class="posts-section">
      <ProfilePost class="post" v-for="(post, index) in posts" :key="index" :post="post"/>
    </div> -->

  </section>
</template>

<script>
import { mapState } from 'vuex'
import ProfilePost from '~/components/ProfilePost'
import Gallery from '~/components/Gallery'

export default {
  components: {
    ProfilePost,
    Gallery
  },
  data() {
    return {
      posts: [],
      editMode: false
    }
  },
  watch: {
    user(updatedUser) {
      if (updatedUser.posts.length !== this.user.posts.length) this.getPosts()
    }
  },
  methods: {
    getPosts() {
      this.$store.dispatch('user/getMyPosts')
        .then(posts => {
          this.posts = posts
        })
    },
    switchEditMode() {
      if (this.editMode) {
        this.saveProfileSettings()
      }
      else {
        this.editMode = true
      }
    },
    saveProfileSettings() {
      console.log(`Сохранить настройки`)
      this.editMode = false
    },
    signOut() {
      this.$store.dispatch('user/signOut')
        .then(() => {
          this.$router.replace('/')
        })
        .catch(console.log)
    }
  },
  computed: mapState({
    user: state => state.user.user
  }),
  created() {
    this.getPosts()
  }
}
</script>


<style lang="scss">
@import '~/assets/scss/components/profile.scss';
</style>

