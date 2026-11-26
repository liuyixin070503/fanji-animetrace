<script setup>
/**
 * 登录页（A 负责）
 * 验收：用户名/密码必填、错误显示在字段下、提交中禁止重复点击、
 * 登录成功回跳 ?redirect=、失败给出明确提示。
 */
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthShell from '../../components/layout/AuthShell.vue'
import BaseInput from '../../components/ui/BaseInput.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import { required, useForm } from '../../composables/useForm.js'
import { useSessionStore } from '../../stores/session.js'
import { useToast } from '../../composables/useToast.js'

const route = useRoute()
const router = useRouter()
const session = useSessionStore()
const toast = useToast()

const form = useForm(
  { username: '', password: '', remember: true },
  {
    username: [required('请输入用户名')],
    password: [required('请输入密码')],
  },
)

const showPassword = ref(false)
const failMessage = ref('')

async function onSubmit() {
  failMessage.value = ''
  const { ok, result } = await form.handleSubmit((values) =>
    session.signIn({
      username: values.username.trim(),
      password: values.password,
      remember: values.remember,
    }),
  )
  if (!ok) return

  if (!result.ok) {
    if (result.field) form.setError(result.field, result.message)
    else failMessage.value = result.message
    return
  }

  toast.success(`欢迎回来，${result.user.nickname}`)
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/library'
  router.replace(redirect)
}
</script>

<template>
  <AuthShell mode="login">
    <h2 class="auth-title">欢迎回来</h2>

    <p v-if="failMessage" class="auth-alert" role="alert">{{ failMessage }}</p>

    <form class="auth-form" novalidate @submit.prevent="onSubmit">
      <BaseInput
        id="login-username"
        v-model="form.values.username"
        label="用户名"
        placeholder="你的用户名"
        autocomplete="username"
        required
        :error="form.touched.username ? form.errors.username : ''"
        @blur="form.blur('username')"
        @enter="onSubmit"
      />

      <BaseInput
        id="login-password"
        v-model="form.values.password"
        :type="showPassword ? 'text' : 'password'"
        label="密码"
        placeholder="密码"
        autocomplete="current-password"
        required
        :error="form.touched.password ? form.errors.password : ''"
        @blur="form.blur('password')"
        @enter="onSubmit"
      />

      <div class="auth-row">
        <label class="auth-check">
          <input v-model="form.values.remember" type="checkbox" />
          <span>记住我（7 天内免登录）</span>
        </label>
        <button type="button" class="auth-link" @click="showPassword = !showPassword">
          {{ showPassword ? '隐藏密码' : '显示密码' }}
        </button>
      </div>

      <BaseButton type="submit" variant="solid" size="lg" block :loading="form.submitting.value">
        {{ form.submitting.value ? '登录中…' : '登录' }}
      </BaseButton>
    </form>

    <p class="auth-switch">
      还没有账号？
      <RouterLink to="/register" class="auth-link">立即注册</RouterLink>
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

.auth-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  font-size: var(--fs-xs);
}

.auth-check {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ink-2);
  cursor: pointer;
}

.auth-check input {
  width: 15px;
  height: 15px;
  accent-color: var(--coral);
}

.auth-link {
  border: none;
  background: none;
  padding: 0;
  color: var(--coral-deep);
  font-size: inherit;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.auth-switch {
  margin-top: var(--sp-3);
  font-size: var(--fs-xs);
  color: var(--ink-3);
  text-align: center;
}
</style>
