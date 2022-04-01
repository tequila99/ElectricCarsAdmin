<template lang='pug'>
q-header(elevated)
  q-toolbar
    q-btn(flat dense round aria-label="Menu" @click='$emit("toggle")')
      MainMenuIcon
    q-toolbar-title ElectroCar Admin Panel
    div Quasar v{{ $q.version }}
    SignOutButton
</template>

<script>
import { defineComponent } from 'vue'
import MainMenuIcon from 'src/components/Icons/MainMenuIcon.vue'
import SignOutButton from 'src/components/buttons/SignOutButton.vue'

export default defineComponent({
  name: 'MainHeader',
  props: {},
  components: { MainMenuIcon, SignOutButton },
  setup () {}
})
</script>

<style lang='scss' scoped>
</style>
