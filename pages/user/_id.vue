<template>
  <section class="profile container">
    <component :is="profileType" :user="user" />

    <Gallery class="posts-section">
      <ProfilePost
        class="gallery-item"
        v-for="(post, index) in posts"
        :key="index"
        :post="post"
        @click="showPost(post)"
        @postCreated="observeLazyImage"
      />
    </Gallery>

    <Modal class="post-modal" @close="isPostShow = false" v-model="isPostShow" :noBorder="true">
      <Post :postOwner="user" :post="currentPost"></Post>
    </Modal>
  </section>
</template>

<script>
import { ProfilePageMixin } from '~/mixins/ProfilePageMixin'
import { lazyLoadImageObserver } from '~/utils/index.js'
import Modal from '~/components/Modal'

export default {
  mixins: [ProfilePageMixin],
  components: {
    AuthUserProfile: () => import('~/components/UserProfile/Auth'),
    UserNotFound: () => import('~/components/UserProfile/UserNotFound'),
    OtherUserProfile: () => import('~/components/UserProfile/Other'),
    Post: () => import('~/components/Post/Post'),
    Modal: () => import('~/components/Modal')
  },
  data() {
    return {
      currentPost: null,
      isPostShow: false,
      isMyProfile: null,
      lazyImageObserver: null
    }
  },
  methods: {
    showPost(post) {
      this.isPostShow = true
      this.currentPost = post
    },
    observeLazyImage(image) {
      this.lazyImageObserver.observe(image)
    },
    initLazyImageObserver() {
      this.lazyImageObserver = lazyLoadImageObserver()
    }
  },
  created() {
    this.initLazyImageObserver()
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/components/profile.scss';
</style>
