<template>
  <UserProfile :user="user">
    <template slot="username-section">
      <button
        class="btn btn-edit"
        @click="switchEditMode">
        {{ editMode ? "Сохранить" : "Редактировать профиль" }}
      </button>
      
      <button class="btn" @click="signOut">Выйти</button>
    </template>

    <template slot="description-section">
      <div class="profile-description" v-if="user.profile_description">
        <textarea
          :readonly="!editMode" class="default" style="width: 100%;" v-model="user.profile_description">
        </textarea>
      </div>
    </template>
     
  </UserProfile>
</template>

<script>
import UserProfile from '~/components/UserProfile/Default'

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  components: {
    UserProfile
  },
  data() {
    return {
      editMode: false
    }
  },
  methods: {
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
  }
}
</script>

