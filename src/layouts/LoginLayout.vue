<template lang="pug">
q-layout
  q-page-container
    router-view
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginLayout'
})
</script>
