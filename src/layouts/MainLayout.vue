<template lang="pug">
q-layout(view="lHh Lpr lFf")
  MainHeader(@toggle='toggleLeftDrawer')
  MainDrawer(v-model='leftDrawerOpen')
  q-page-container
    router-view
</template>

<script>
import MainHeader from './MainHeader.vue'
import MainDrawer from './MainDrawer.vue'

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    MainHeader, MainDrawer
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
