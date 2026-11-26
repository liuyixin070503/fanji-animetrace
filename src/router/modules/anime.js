/**
 * 番剧库（B 负责）
 * 筛选条件全部写在 query 里：q / tags / status / year / sort / page / view
 * 这样刷新、分享链接都能复现同一屏（验收项 F09）
 */
export const routes = [
  {
    path: '/library',
    name: 'library',
    component: () => import('../../views/anime/AnimeLibraryView.vue'),
    meta: { title: '番剧库', requiresAuth: true },
  },
]
