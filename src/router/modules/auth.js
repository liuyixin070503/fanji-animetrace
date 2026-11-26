/**
 * 登录 / 注册（A 负责）
 * 两页都用整屏布局（meta.layout='blank'，不渲染 Header / TabBar / Footer）
 */
export const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../../views/auth/LoginView.vue'),
    meta: { title: '登录', guestOnly: true, layout: 'blank' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../../views/auth/RegisterView.vue'),
    meta: { title: '注册', guestOnly: true, layout: 'blank' },
  },
]
