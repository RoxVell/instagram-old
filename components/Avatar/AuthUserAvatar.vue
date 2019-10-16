<template>
  <UserAvatar
    :image="avatar"
    :username="user.username"
    :alt="`${user.username} user avatar`"
    v-bind="$attrs"
  />
</template>

<script>
/**
 * Wrapper over UserAvatar component
 * Is used for display auth user avatar
 */

import { mapState } from 'vuex'
import UserAvatar from '~/components/Avatar/UserAvatar'

export default {
  components: { UserAvatar },
  computed: mapState({
    user: (state) => state.account.user,
    avatar: (state) => state.account.avatar
  })
}
</script>