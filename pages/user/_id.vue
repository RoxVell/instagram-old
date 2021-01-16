<template>
  <section class="profile container">
    <component :is="accountPageType" :user="user" />

    <div class="tabs-wrapper">
      <Tabs :tabs="tabs" v-model="currentTab" @changeTab="changeTab($event)"></Tabs>
    </div>

    <Gallery class="posts-section" v-show="currentTab === tabs[0]">
      <ProfilePost
        class="gallery-item"
        v-for="(post, index) in posts"
        :key="index"
        :post="post"
        @click="showPost(post)"
        @postCreated="observeLazyImage"
      />
    </Gallery>

    <Gallery class="posts-section" v-show="currentTab === tabs[1]">
      <ProfilePost
        class="gallery-item"
        v-for="(post, index) in favoritePosts"
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
import { ProfilePageMixin } from '~/mixins/ProfilePageMixin.ts'
import { lazyLoadImageObserver } from '~/utils/index.js'
// import Modal from '~/components/Modal'

export default {
  mixins: [ProfilePageMixin],
  components: {
    AuthUserProfile: () => import('~/components/UserProfile/AuthProfile'),
    UserNotFound: () => import('~/components/UserProfile/UserNotFoundProfile'),
    OtherUserProfile: () => import('~/components/UserProfile/OtherProfile'),
    Post: () => import('~/components/Post'),
    Modal: () => import('~/components/Modal'),
    Tabs: () => import('~/components/Tabs'),
  },
  data() {
    return {
      currentPost: null,
      isPostShow: false,
      isMyProfile: null,
      lazyImageObserver: null,
      tabs: [
        {
          value: 1,
          title: 'Посты',
          icon: 'ri-grid-fill',
        },
        {
          value: 2,
          title: 'Избранное',
          icon: 'ri-bookmark-line',
        },
      ],
      currentTab: null,
    }
  },
  methods: {
    changeTab(tab) {
      this.currentTab = tab

      switch (this.currentTab) {
        case this.tabs[0]:
          // this.getFavoritePosts();
          break
        case this.tabs[1]:
          this.getFavoritePosts()
          break
      }
    },
    showPost(post) {
      this.isPostShow = true
      this.currentPost = post
    },
    observeLazyImage(image) {
      this.lazyImageObserver.observe(image)
    },
    initLazyImageObserver() {
      this.lazyImageObserver = lazyLoadImageObserver()
    },
  },
  created() {
    this.currentTab = this.tabs[0]
    this.initLazyImageObserver()
  },
}
</script>

<style lang="scss">
.posts-section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
}

.post-modal .modal-content {
  padding: 0 !important;
  border: none !important;
}

.tabs-wrapper {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>
