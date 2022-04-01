<template lang='pug'>
q-drawer(v-model='value' show-if-above bordered)
  q-list
    q-item-label(header)
      | Essential Links
    EssentialLink(v-for="link in essentialLinks" :key="link.title" v-bind="link")
</template>

<script>
import { defineComponent, computed } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

export default defineComponent({
  name: 'MainDrawer',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  components: { EssentialLink },
  setup (props, ctx) {
    const { emit } = ctx
    const value = computed({
      // getter
      get () {
        return props.modelValue
      },
      set (newValue) {
        emit('update:modelValue', newValue)
      }
    })

    return {
      essentialLinks: linksList,
      value
    }
  }
})
</script>

<style lang='scss' scoped>
</style>
