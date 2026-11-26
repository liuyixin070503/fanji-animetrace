/**
 * 手帐（C 负责）
 * /journal/new 必须排在 /journal/:id 前面（虽然 Vue Router 会按静态优先匹配，
 * 但排前面读起来不容易误会）
 */
export const routes = [
  {
    path: '/journal',
    name: 'journal',
    component: () => import('../../views/journal/JournalView.vue'),
    meta: { title: '我的手帐', requiresAuth: true },
  },
  {
    path: '/journal/new',
    name: 'journal-new',
    component: () => import('../../views/journal/JournalEditView.vue'),
    meta: { title: '新建手帐', requiresAuth: true, mode: 'create' },
  },
  {
    path: '/journal/:id',
    name: 'journal-detail',
    component: () => import('../../views/journal/JournalDetailView.vue'),
    meta: { title: '手帐详情', requiresAuth: true },
  },
  {
    path: '/journal/:id/edit',
    name: 'journal-edit',
    component: () => import('../../views/journal/JournalEditView.vue'),
    meta: { title: '编辑手帐', requiresAuth: true, mode: 'edit' },
  },
]
