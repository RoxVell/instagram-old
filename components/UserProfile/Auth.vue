<template>
  <UserProfile :user="user">
    <template #user-avatar>
      <div class="user-avatar__change" @click="changeAvatarShow = true">
        <AuthUserAvatar class="profile-section__avatar" :size="150" />
        <div class="change-avatar-hint">Сменить аватар</div>
      </div>
    </template>
      
    <template #username-section>
      <button
        class="btn btn_blue btn-edit"
        @click="switchEditMode"
      >{{ editMode ? "Сохранить" : "Редактировать профиль" }}</button>
    </template>

    <template #description-section>
      <div class="profile-description" v-if="user.profile_description">
        <textarea
          :readonly="!editMode"
          class="default"
          style="width: 100%;"
          v-model="user.profile_description"
        ></textarea>
      </div>
    </template>
     
  </UserProfile>
</template>

<script>
import UserProfile from '~/components/UserProfile/Default'
import AuthUserAvatar from '~/components/Avatar/AuthUserAvatar'

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  components: {
    UserProfile,
    AuthUserAvatar
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
      } else {
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

