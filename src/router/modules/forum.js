/**
 * 论坛（D 负责）
 * 板块/排序/分页也走 query：board / sort / page
 */
export const routes = [
  {
    path: '/forum',
    name: 'forum',
    component: () => import('../../views/forum/ForumListView.vue'),
    meta: { title: '论坛', requiresAuth: true },
  },
  {
    path: '/forum/new',
    name: 'forum-new',
    component: () => import('../../views/forum/PostCreateView.vue'),
    meta: { title: '发新帖', requiresAuth: true },
  },
  {
    path: '/forum/:id',
    name: 'forum-detail',
    component: () => import('../../views/forum/PostDetailView.vue'),
    meta: { title: '帖子', requiresAuth: true },
  },
]
