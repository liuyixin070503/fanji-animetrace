<script setup>
/**
 * 注册页（A 负责）
 * 字段：昵称 / 用户名 / 密码，只校验"必填"，登录靠用户名唯一性在 db.register 里保证。
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthShell from '../../components/layout/AuthShell.vue'
import BaseInput from '../../components/ui/BaseInput.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import { required, useForm } from '../../composables/useForm.js'
import { useSessionStore } from '../../stores/session.js'
import { useToast } from '../../composables/useToast.js'

const router = useRouter()
const session = useSessionStore()
const toast = useToast()

const form = useForm(
  { nickname: '', username: '', password: '' },
  {
    nickname: [required('请填写昵称')],
    username: [required('请填写用户名')],
    password: [required('请设置密码')],
  },
)

const failMessage = ref('')

async function onSubmit() {
  failMessage.value = ''
  const { ok, result } = await form.handleSubmit((values) =>
    session.signUp({
      nickname: values.nickname.trim(),
      username: values.username.trim(),
      password: values.password,
    }),
  )
  if (!ok) return

  if (!result.ok) {
    if (result.field && result.field in form.values) form.setError(result.field, result.message)
    else failMessage.value = result.message
    return
  }

  toast.success(`注册成功，欢迎你，${result.user.nickname}`)
  router.replace('/library')
}
</script>

<template>
  <AuthShell mode="register">
    <h2 class="auth-title">创建你的手帐</h2>

    <p v-if="failMessage" class="auth-alert" role="alert">{{ failMessage }}</p>

    <form class="auth-form" novalidate @submit.prevent="onSubmit">
      <BaseInput
        id="reg-nickname"
        v-model="form.values.nickname"
        label="昵称"
        placeholder="你的昵称"
        required
        :error="form.touched.nickname ? form.errors.nickname : ''"
        @blur="form.blur('nickname')"
      />

      <BaseInput
        id="reg-username"
        v-model="form.values.username"
        label="用户名"
        placeholder="用于登录的用户名"
        autocomplete="username"
        required
        :error="form.touched.username ? form.errors.username : ''"
        @blur="form.blur('username')"
      />

      <BaseInput
        id="reg-password"
        v-model="form.values.password"
        type="password"
        label="密码"
        placeholder="密码"
        autocomplete="new-password"
        required
        :error="form.touched.password ? form.errors.password : ''"
        @blur="form.blur('password')"
        @enter="onSubmit"
      />

      <BaseButton type="submit" variant="coral" size="lg" block :loading="form.submitting.value">
        {{ form.submitting.value ? '创建中…' : '注册并进入' }}
      </BaseButton>
    </form>

    <p class="auth-switch">
      已经有账号了？
      <RouterLink to="/login" class="auth-link">去登录</RouterLink>
    </p>
  </AuthShell>
</template>

<style scoped>
.auth-title {
  font-family: var(--font-display);
  font-size: var(--fs-xl);
}

.auth-alert {
  margin-top: var(--sp-3);
  padding: 8px 10px;
  border: 2px solid var(--danger);
  background: rgba(224, 75, 63, 0.08);
  color: var(--danger);
  font-size: var(--fs-xs);
  border-radius: var(--r-xs);
}

.auth-form {
  margin-top: var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.auth-link {
  color: var(--coral-deep);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.auth-switch {
  margin-top: var(--sp-3);
  font-size: var(--fs-xs);
  color: var(--ink-3);
  text-align: center;
}
</style>
