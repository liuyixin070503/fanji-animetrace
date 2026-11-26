/** 个人中心（E 负责） */
export const routes = [
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../../views/profile/ProfileView.vue'),
    meta: { title: '个人中心', requiresAuth: true },
  },
]
