<template lang="pug">
.column.q-mx-auto.q-mt-xl.q-gutter-y-lg.q-px-xl(style='width:100%;max-width:560px;')
  h5.text-primary.q-mx-auto {{ description }} v. {{ version }}
  q-input(
    rounded
    outlined
    label='Пользователь'
    v-model='user.username'
    @keyup.esc='user.username=""'
    @keyup.enter='focusPassword'
    lazy-rules
    :rules='[val => !!val || "Поле ввода имени пользователя не должно быть пустым"]'
    clearable
    clear-icon='close'
    )
    template(#prepend)
      PersonIcon
  q-input(
    ref='password'
    rounded
    outlined
    label='Пароль'
    v-model='user.password'
    :type='typeInput'
    @keyup.esc='user.password=""'
    @keyup.enter='handleLogin'
    lazy-rules
    :rules='[val => !!val || "Поле ввода пароля не должно быть пустым"]'
    )
    template(#prepend)
      LockIcon
    template(#append)
      .cursor-pointer(@click='toggleShowPwd')
        EyeIcon(v-if='showPwd')
        EyeSlashIcon(v-else)
  q-btn(
    rounded
    unelevated
    :disable='disableButton'
    color='primary'
    padding='12px'
    @click='handleLogin'
    )
    LoginIcon.q-mr-md
    | Вход в систему
    q-tooltip Нажмите для входа в систему
</template>

<script>
import { description, version } from '../../package.json'
import { computed, defineComponent } from 'vue'
import { reactive, ref } from '@vue/reactivity'
import PersonIcon from '../components/Icons/PersonIcon.vue'
import LockIcon from '../components/Icons/LockIcon.vue'
import EyeIcon from '../components/Icons/EyeIcon.vue'
import EyeSlashIcon from '../components/Icons/EyeSlashIcon.vue'
import LoginIcon from '../components/Icons/LoginIcon.vue'
import User from 'src/models/User'
import Storage from 'src/helpers/Storage'

const userModel = new User()
const storage = new Storage()

export default defineComponent({
  name: 'LoginPage',
  components: { PersonIcon, LockIcon, EyeIcon, EyeSlashIcon, LoginIcon },
  setup () {
    const password = ref(null)
    const user = reactive({
      username: storage.getItem('username'),
      password: ''
    })
    const showPwd = ref(false)
    const typeInput = computed(() => showPwd.value ? 'text' : 'password')
    const disableButton = computed(() => !user.username || !user.password)
    const handleLogin = async () => await userModel.signIn(user.username, user.password)

    return {
      password,
      description,
      version,
      user,
      showPwd,
      typeInput,
      disableButton,
      toggleShowPwd: () => { showPwd.value = !showPwd.value },
      focusPassword: () => password.value.focus(),
      handleLogin
    }
  }
})
</script>
