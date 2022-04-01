<template lang='pug'>
q-btn(round flat @click='handleSignOut')
  SignOutIcon
</template>

<script>
import { defineComponent } from 'vue'
import SignOutIcon from '../Icons/SignOutIcon.vue'
import User from 'src/models/User'
const userModel = new User()

export default defineComponent({
  name: 'SignOutButton',
  props: {},
  components: { SignOutIcon },
  setup () {
    const handleSignOut = async () => userModel.signOut()
    return {
      handleSignOut
    }
  }
})
</script>

<style lang='scss' scoped>
</style>
