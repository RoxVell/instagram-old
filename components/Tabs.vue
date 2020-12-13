<template>
  <div class="tabs-component">
    <div
      class="tab"
      v-for="tab in tabs"
      :key="tab.value"
      @click="changeTab(tab)"
      :class="{ tab_selected: tab === value }"
    >
      <i class="tab__icon" :class="tab.icon"></i>
      <span class="tab__title">
        {{ tab.title }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'nuxt-property-decorator'

interface Tab {
  value: number
  title: string
  icon?: string
}

@Component({})
export default class Tabs extends Vue {
  @Prop() value: Tab
  @Prop({ default: [] }) tabs: Tab[]

  @Emit('changeTab')
  changeTab(tab: Tab) {}
}
</script>

<style lang="scss" scoped>
.tabs-component {
  display: flex;
}

.tab {
  width: 175px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  cursor: pointer;
  padding: 5px 0;
  display: flex;
  justify-content: center;
  color: rgba(0, 0, 0, 0.45);

  &_selected {
    font-weight: 500;
    border-bottom-color: #5458f7;
    color: #5458f7;
  }

  &__icon {
    font-size: 18px;
    margin-right: 5px;
  }
}
</style>