<template>
  <div class="profile-section">
    <slot name="user-avatar">
      <UserAvatar :username="user.username" :size="150" class="profile-section__avatar" />
    </slot>

    <div class="profile-section__user-info">

      <div class="profile-settings">
        <h2 class="profile-section__username">{{ user.username }}</h2>
        <slot name="username-section"></slot>
      </div>

      <div>
        <ul class="profile-stats">
          <li><span class="profile-stats__count">{{ user.posts }}</span> публикаций</li>
          <li><span class="profile-stats__count">{{ user.subscribers.length }}</span> подписчиков</li>
          <li><span class="profile-stats__count">0</span> подписки</li>
        </ul>
      </div>

      <slot name="description-section">
        <div v-if="user.profile_description" class="profile-description">
          <textarea
            readonly
            class="default"
            style="width: 100%;"
            v-model="user.profile_description">
          </textarea>
        </div>
      </slot>

    </div>
  </div>
</template>

<script>
import UserAvatar from '~/components/Avatar/UserAvatar'

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  components: {
    UserAvatar
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/components/UserProfile.scss';
</style>
