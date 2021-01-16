<template>
  <UserAvatar
    :image="avatar"
    :username="user.username"
    :alt="`${user.username} user avatar`"
    v-bind="$attrs"
  />
</template>

<script lang="ts">
/**
 * Wrapper over UserAvatar component
 * Is used for display auth user avatar
 */

import { Vue, Component, Prop, Ref } from 'nuxt-property-decorator'

import UserAvatar from '~/components/Avatar/UserAvatar.vue'

import { getUserAvatar, getDefaultUserAvatar } from '~/utils/firebaseUtils'

import { accountStore } from '~/store'

@Component({
  components: {
    UserAvatar,
  },
})
export default class DefaultUserProfile extends Vue {
  get user() {
    return accountStore.user
  }

  get avatar() {
    return accountStore.avatar
  }
}
</script>