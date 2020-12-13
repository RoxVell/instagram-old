<template>
  <UserProfile :user="user">
    <template #user-avatar>
      <div class="user-avatar__change" @click="changeAvatarShow = true">
        <AuthUserAvatar class="profile-section__avatar" :size="150" />
        <div class="change-avatar-hint">Сменить аватар</div>
      </div>
    </template>

    <template #username-section>
      <button class="btn btn_blue btn-edit" @click="switchEditMode">
        {{ editMode ? 'Сохранить' : 'Редактировать профиль' }}
      </button>
    </template>

    <template #description-section>
      <div class="profile-description" v-if="user.profile_description">
        <textarea
          :readonly="!editMode"
          class="default"
          style="width: 100%"
          v-model="user.profile_description"
        ></textarea>
      </div>
    </template>

    <AvatarChangeModal
      v-model="changeAvatarShow"
      @close="changeAvatarShow = false"
      :transition="{ name: 'appear-top' }"
    ></AvatarChangeModal>
  </UserProfile>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

import UserProfile from '~/components/UserProfile/DefaultProfile.vue'
import AvatarChangeModal from '~/components/Modals/AvatarChangeModal.vue'
import AuthUserAvatar from '~/components/Avatar/AuthUserAvatar.vue'

import User from '~/types/User'

@Component({
  components: {
    UserProfile,
    AvatarChangeModal,
    AuthUserAvatar,
  },
})
export default class AuthUserProfile extends Vue {
  @Prop({ type: Object, required: true }) user: User

  editMode: boolean = false
  changeAvatarShow: boolean = false

  switchEditMode() {
    if (this.editMode) {
      this.saveProfileSettings()
    } else {
      this.editMode = true
    }
  }

  private saveProfileSettings() {
    this.editMode = false
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/components/UserProfile/Auth.scss';
</style>