/**
 * =========================================================
 * seed.js —— 演示数据（10 部番 / 3 个用户 / 10 条手帐 / 8 帖 / 14 条评论）
 * =========================================================
 * 番剧目录是"静态常量"，不进 localStorage（见项目说明 6.3）；
 * 用户/手帐/帖子/评论每次 resetAll() 从这里重新生成。
 *
 * 海报暂时是占位图（public/covers/a001.jpg ~ a010.jpg，400×560）。
 * B 拿到真海报后直接替换同名文件即可，不用改代码。
 */
import { hashPassword } from '../utils/hash.js'
import { STATUS, defaultJournalEntry, defaultPost, defaultComment } from '../types/db.js'

const DAY = 86400000
const HOUR = 3600000

/**
 * 番剧目录：id / 中文名 / 日文名 / 年份 / 类型 / 总集数 / 制作公司 / 标签 / 简介 / 海报 / 强调色 / 站外评分 / 热度
 * @type {import('../types/db.js').Anime[]}
 */
export const ANIME = [
  {
    id: 'a001',
    title: '孤独摇滚！',
    titleJp: 'ぼっち・ざ・ろっく！',
    year: 2022,
    type: 'TV',
    episodes: 12,
    studio: 'CloverWorks',
    tags: ['音乐', '日常', '青春'],
    summary:
      '社恐少女后藤一里抱着吉他躲进衣柜，却被拉进了一支只有三个人的乐队。练琴是为了不和人说话，站上舞台却是为了把话说出来。',
    cover: { src: './covers/a001.jpg', source: '占位图', credit: '课程演示用' },
    accent: '#FF6F61',
    externalScore: 9.1,
    popularity: 96,
  },
  {
    id: 'a002',
    title: '葬送的芙莉莲',
    titleJp: '葬送のフリーレン',
    year: 2023,
    type: 'TV',
    episodes: 28,
    studio: 'MADHOUSE',
    tags: ['奇幻', '治愈', '公路'],
    summary:
      '勇者一行打倒魔王之后，精灵魔法使芙莉莲才开始学着理解「人」。一场迟到八十年的告别，慢慢走成了新的旅程。',
    cover: { src: './covers/a002.jpg', source: '占位图', credit: '课程演示用' },
    accent: '#7FD9C4',
    externalScore: 9.4,
    popularity: 99,
  },
  {
    id: 'a003',
    title: '进击的巨人',
    titleJp: '進撃の巨人',
    year: 2013,
    type: 'TV',
    episodes: 25,
    studio: 'WIT STUDIO',
    tags: ['热血', '战斗', '剧情'],
    summary:
      '城墙之内是人类最后的土地。当超大型巨人踏破城门，艾伦失去了一切，也第一次看清了「自由」的形状。',
    cover: { src: './covers/a003.jpg', source: '占位图', credit: '课程演示用' },
    accent: '#E8503F',
    externalScore: 9.4,
    popularity: 98,
  },
  {
    id: 'a004',
    title: '你的名字。',
    titleJp: '君の名は。',
    year: 2016,
    type: '剧场版',
    episodes: 1,
    studio: 'CoMix Wave Films',
    tags: ['恋爱', '奇幻', '青春'],
    summary:
      '住在山间小镇的三叶和东京少年泷，在梦里交换了身体。等到想见面时，才发现隔着的不只是距离。',
    cover: { src: './covers/a004.jpg', source: '占位图', credit: '课程演示用' },
    accent: '#9FD3F2',
    externalScore: 9.1,
    popularity: 95,
  },
  {
    id: 'a005',
    title: '命运石之门',
    titleJp: 'STEINS;GATE',
    year: 2011,
    type: 'TV',
    episodes: 24,
    studio: 'White Fox',
    tags: ['悬疑', '科幻', '剧情'],
    summary:
      '自称疯狂科学家的冈部伦太郎，把香蕉送进了微波炉。从那天起，每一条世界线都开始收取代价。',
    cover: { src: './covers/a005.jpg', source: '占位图', credit: '课程演示用' },
    accent: '#C7B4F2',
    externalScore: 9.6,
    popularity: 97,
  },
  {
    id: 'a006',
    title: '紫罗兰永恒花园',
    titleJp: 'ヴァイオレット・エヴァーガーデン',
    year: 2018,
    type: 'TV',
    episodes: 13,
    studio: '京都动画',
    tags: ['治愈', '剧情', '恋爱'],
    summary: '战争结束了，少女却还留在战场上。她开始替别人写信，也在别人的话里找「我爱你」的意思。',
    cover: { src: './covers/a006.jpg', source: '占位图', credit: '课程演示用' },
    accent: '#FFB3C7',
    externalScore: 9.2,
    popularity: 93,
  },
  {
    id: 'a007',
    title: '咒术回战',
    titleJp: '呪術廻戦',
    year: 2020,
    type: 'TV',
    episodes: 24,
    studio: 'MAPPA',
    tags: ['热血', '战斗', '奇幻'],
    summary:
      '吞下特级咒物后，虎杖悠仁成了诅咒本身。他给自己定了一个期限：死之前，要让所有人都得到正确的死亡。',
    cover: { src: './covers/a007.jpg', source: '占位图', credit: '课程演示用' },
    accent: '#FFD84D',
    externalScore: 8.6,
    popularity: 94,
  },
  {
    id: 'a008',
    title: '间谍过家家',
    titleJp: 'SPY×FAMILY',
    year: 2022,
    type: 'TV',
    episodes: 25,
    studio: 'WIT STUDIO × CloverWorks',
    tags: ['日常', '搞笑', '家庭'],
    summary:
      '间谍、杀手、读心少女，三个人各自藏着一个秘密，凑成了一个家。任务代号：梟。',
    cover: { src: './covers/a008.jpg', source: '占位图', credit: '课程演示用' },
    accent: '#D8D2C4',
    externalScore: 8.6,
    popularity: 92,
  },
  {
    id: 'a009',
    title: '来自深渊',
    titleJp: 'メイドインアビス',
    year: 2017,
    type: 'TV',
    episodes: 13,
    studio: 'Kinema Citrus',
    tags: ['奇幻', '猎奇', '剧情'],
    summary:
      '巨洞「深渊」里埋着全世界的谜。少女莉可和机器人雷古往下走，每下一层，回来的代价就更高一点。',
    cover: { src: './covers/a009.jpg', source: '占位图', credit: '课程演示用' },
    accent: '#8FD1B5',
    externalScore: 9.0,
    popularity: 88,
  },
  {
    id: 'a010',
    title: '新世纪福音战士',
    titleJp: '新世紀エヴァンゲリオン',
    year: 1995,
    type: 'TV',
    episodes: 26,
    studio: 'GAINAX',
    tags: ['科幻', '剧情', '猎奇'],
    summary:
      '第三次冲击之后，十四岁的碇真嗣被叫来驾驶EVA。他不想战斗，也不知道除了战斗还能怎么被需要。',
    cover: { src: './covers/a010.jpg', source: '占位图', credit: '课程演示用' },
    accent: '#B9A8E8',
    externalScore: 9.3,
    popularity: 91,
  },
]

/** 演示账号：都是"本地模拟"，密码明文写在 README 里方便老师验收 */
export const DEMO_ACCOUNTS = [
  { username: 'demo', password: 'demo1234', nickname: '煌' },
  { username: 'azhe', password: 'azhe1234', nickname: '阿哲' },
  { username: 'xiaoman', password: 'xiaoman1234', nickname: '小满' },
]

const AVATAR_SEEDS = ['#FFB3C7', '#9FD3F2', '#C7B4F2', '#FFD84D', '#7FD9C4', '#FF6F61']

const USERS = [
  {
    id: 'u001',
    username: 'demo',
    nickname: '煌',
    avatarSeed: '#C7B4F2',
    bio: '看过 300+ 部，偏爱公路片和会发刀子的治愈番。',
    joinedAt: Date.UTC(2025, 2, 11),
    passwordDigest: hashPassword('demo1234'),
  },
  {
    id: 'u002',
    username: 'azhe',
    nickname: '阿哲',
    avatarSeed: '#C7B4F2',
    bio: '下饭番鉴赏家，拒绝一切需要动脑子的剧情。',
    joinedAt: Date.UTC(2025, 5, 2),
    passwordDigest: hashPassword('azhe1234'),
  },
  {
    id: 'u003',
    username: 'xiaoman',
    nickname: '小满',
    avatarSeed: '#FFB3C7',
    bio: '台词截图收藏癖，看番必记金句。',
    joinedAt: Date.UTC(2025, 7, 19),
    passwordDigest: hashPassword('xiaoman1234'),
  },
]

/** 手帐：分数合计 91.3 → 平均 9.13，和静态稿的统计卡对齐 */
const JOURNAL_SPEC = [
  {
    id: 'j001',
    animeId: 'a002',
    status: STATUS.WATCHING,
    progress: 14,
    score: 9.4,
    favorite: true,
    daysAgo: 0,
    mood: ['治愈', '泪目'],
    tags: ['奇幻', '治愈', '公路'],
    review:
      '前四集是纪录片，后面每集都在教你告别。第 12 集那片雪我截了图，现在还是桌面。',
    quote: '我又不是非要你记住我。',
  },
  {
    id: 'j002',
    animeId: 'a001',
    status: STATUS.WATCHED,
    progress: 12,
    score: 9.1,
    favorite: true,
    daysAgo: 2,
    mood: ['上头', '燃'],
    tags: ['音乐', '日常', '青春'],
    review: '社恐人看哭了。第八集那段独奏循环了五遍，耳机音量开到最大，值。',
    quote: '就算只有一个人听，也要弹完。',
  },
  {
    id: 'j003',
    animeId: 'a005',
    status: STATUS.WATCHED,
    progress: 24,
    score: 9.6,
    favorite: true,
    daysAgo: 5,
    mood: ['封神', '意难平'],
    tags: ['悬疑', '科幻', '剧情'],
    review: '前十集差点弃，坚持到第十二集，之后就再也没停下来过。伏笔回收得像钟表。',
    quote: '这一切都是命运石之门的选择。',
  },
  {
    id: 'j004',
    animeId: 'a003',
    status: STATUS.WATCHED,
    progress: 25,
    score: 9.2,
    favorite: false,
    daysAgo: 9,
    mood: ['燃', '致郁'],
    tags: ['热血', '战斗', '剧情'],
    review: '第一次看只记得立体机动有多帅，二刷才发现第一集就已经把结局摆在那儿了。',
    quote: '献出心脏。',
  },
  {
    id: 'j005',
    animeId: 'a006',
    status: STATUS.WATCHED,
    progress: 13,
    score: 9.0,
    favorite: true,
    daysAgo: 16,
    mood: ['泪目', '治愈'],
    tags: ['治愈', '剧情', '恋爱'],
    review: '第十集那封信，我暂停了三次才看完。作画像水彩，情绪却是钝刀子。',
    quote: '我爱你，这句话我到现在才懂。',
  },
  {
    id: 'j006',
    animeId: 'a007',
    status: STATUS.WATCHING,
    progress: 9,
    score: 8.6,
    favorite: false,
    daysAgo: 24,
    mood: ['燃'],
    tags: ['热血', '战斗', '奇幻'],
    review: '打戏是真的爽，但每次刚喜欢上一个角色就开始担惊受怕，看得很分裂。',
    quote: '我不想再看到有人死在我面前。',
  },
  {
    id: 'j007',
    animeId: 'a009',
    status: STATUS.WATCHED,
    progress: 13,
    score: 8.8,
    favorite: false,
    daysAgo: 40,
    mood: ['致郁', '上头'],
    tags: ['奇幻', '猎奇', '剧情'],
    review: '画风骗人。越往下走越不敢看，又忍不住往下走，这就是深渊的意思吧。',
    quote: '往下走的人，都是有理由的。',
  },
  {
    id: 'j008',
    animeId: 'a004',
    status: STATUS.WATCHED,
    progress: 1,
    score: 8.9,
    favorite: false,
    daysAgo: 68,
    mood: ['泪目'],
    tags: ['恋爱', '奇幻', '青春'],
    review: '在电影院哭到不敢抬头，散场灯亮之前把眼泪擦干净了。黄昏那场戏值一张票。',
    quote: '你的名字，我记住了。',
  },
  {
    id: 'j009',
    animeId: 'a010',
    status: STATUS.HOLD,
    progress: 11,
    score: 9.3,
    favorite: true,
    daysAgo: 96,
    mood: ['意难平', '致郁'],
    tags: ['科幻', '剧情', '猎奇'],
    review: '看到第十一集停下来了。不是不好看，是需要一点心理准备再继续。',
    quote: '不能逃避，不能逃避，不能逃避。',
  },
  {
    id: 'j010',
    animeId: 'a008',
    status: STATUS.WANT,
    progress: 0,
    score: 9.4,
    favorite: false,
    daysAgo: 130,
    mood: ['治愈', '下饭'],
    tags: ['日常', '搞笑', '家庭'],
    review: '下饭神器。阿尼亚的表情包我已经存了一整个相册，剧还没看完。',
    quote: '哇酷哇酷。',
  },
]

const POST_SPEC = [
  {
    id: 'p001',
    authorId: 'u002',
    animeId: 'a002',
    board: '求推荐',
    hoursAgo: 5,
    likedBy: ['u001', 'u003'],
    title: '求推荐一部适合下饭的治愈番，别太刀',
    content:
      '最近在补《葬送的芙莉莲》，好看但每集都要缓一下。想找一部能配饭的，节奏慢一点、别突然发刀子的那种。',
  },
  {
    id: 'p002',
    authorId: 'u003',
    animeId: 'a002',
    board: '讨论',
    hoursAgo: 9,
    likedBy: ['u001', 'u002'],
    title: '芙莉莲第 28 集那句「我又不是非要你记住我」，你们怎么理解？',
    content:
      '我不觉得是在赌气。她活了上千年，早就习惯被人忘记，这句话更像是在替对方卸下负担。但辛美尔听懂了没有，我到现在也没想明白。',
  },
  {
    id: 'p003',
    authorId: 'u001',
    animeId: 'a005',
    board: '讨论',
    hoursAgo: 30,
    likedBy: ['u002', 'u003'],
    title: '《命运石之门》前十集到底该不该跳过？',
    content:
      '第三次安利朋友失败了，他看到第七集说「这不就是个中二病日常吗」。前十集真的劝退，但跳了又接不上后面的伏笔。',
  },
  {
    id: 'p004',
    authorId: 'u002',
    animeId: 'a001',
    board: '求推荐',
    hoursAgo: 52,
    likedBy: ['u001'],
    title: '想找一部像《孤独摇滚》一样讲乐队的番',
    content: '不一定要社恐主角，重点是排练、live、成员之间那种笨拙的磨合。音乐番看得少，求老哥带路。',
  },
  {
    id: 'p005',
    authorId: 'u001',
    animeId: 'a007',
    board: '吐槽',
    hoursAgo: 74,
    likedBy: ['u003'],
    title: '咒术回战的节奏是不是有点赶',
    content: '打戏没得说，但文戏经常一集塞三件事，刚进入状态就切走了。是不是原作进度逼得太紧？',
  },
  {
    id: 'p006',
    authorId: 'u003',
    animeId: 'a010',
    board: '讨论',
    hoursAgo: 100,
    likedBy: ['u001', 'u002'],
    title: 'EVA 放到今天看还成立吗？',
    content: '重看了一遍 TV 版。作画和节奏确实老了，但那种「不知道为什么而战」的少年感，现在反而更常见了。',
  },
  {
    id: 'p007',
    authorId: 'u002',
    animeId: 'a008',
    board: '吐槽',
    hoursAgo: 128,
    likedBy: [],
    title: '间谍过家家第二季是不是有点疲',
    content: '还是很好看，但那种「每一集都在推进」的感觉弱了，更像单元剧。是不是原作的锅？',
  },
  {
    id: 'p008',
    authorId: 'u001',
    animeId: 'a009',
    board: '讨论',
    hoursAgo: 150,
    likedBy: ['u002'],
    title: '《来自深渊》的设定集值得买吗',
    content: '主要是想看看阿比斯各层的设定草图。买过的说说印刷质量，值不值这个价。',
  },
]

const COMMENT_SPEC = [
  { id: 'c001', postId: 'p001', authorId: 'u003', hoursAgo: 4, content: '《间谍过家家》，纯下饭，唯一风险是笑到呛到。' },
  { id: 'c002', postId: 'p001', authorId: 'u001', hoursAgo: 3, content: '《紫罗兰永恒花园》治愈但会哭，不算下饭。《轻音少女》更稳。' },
  { id: 'c003', postId: 'p002', authorId: 'u001', hoursAgo: 7, content: '我理解成"你不用为了记住我而活"，比赌气狠多了。' },
  { id: 'c004', postId: 'p002', authorId: 'u002', hoursAgo: 6, content: '辛美尔那句话是笑着说出来的，他其实听懂了。' },
  { id: 'c005', postId: 'p003', authorId: 'u002', hoursAgo: 26, content: '不能跳。前十集是在铺"日常有多值得救"，跳了后面就没重量了。' },
  { id: 'c006', postId: 'p003', authorId: 'u003', hoursAgo: 22, content: '可以先看第 1 集和第 12 集，中间用 1.5 倍速。' },
  { id: 'c007', postId: 'p004', authorId: 'u001', hoursAgo: 48, content: '《轻音少女》《吹响！上低音号》，后者排练细节多到离谱。' },
  { id: 'c008', postId: 'p004', authorId: 'u003', hoursAgo: 40, content: '《BanG Dream!》系列，live 段落是真的用心。' },
  { id: 'c009', postId: 'p005', authorId: 'u002', hoursAgo: 70, content: '同感，文戏像赶场。但打戏值回票价，我忍。' },
  { id: 'c010', postId: 'p006', authorId: 'u001', hoursAgo: 92, content: '成立。现在看真嗣的逃避，比我十五岁时理解得深多了。' },
  { id: 'c011', postId: 'p006', authorId: 'u002', hoursAgo: 88, content: 'TV 版结局我至今没消化，剧场版补完了一点。' },
  { id: 'c012', postId: 'p007', authorId: 'u001', hoursAgo: 120, content: '第二季更像日常小品，接受这个定位就还挺好。' },
  { id: 'c013', postId: 'p008', authorId: 'u002', hoursAgo: 144, content: '印刷很好，纸厚。但设定文字量不大，主要看图。' },
  { id: 'c014', postId: 'p008', authorId: 'u003', hoursAgo: 140, content: '值。阿比斯的层设定图值得单独裱起来。' },
]

/**
 * 生成一份全新的数据库快照（含 relative 时间，保证"刚刚/2 天前"永远新鲜）
 * @returns {{version:number, users:any[], journal:any[], posts:any[], comments:any[], session:null}}
 */
export function buildSeed() {
  const now = Date.now()

  const journal = JOURNAL_SPEC.map((spec) => {
    const at = now - spec.daysAgo * DAY
    const anime = ANIME.find((a) => a.id === spec.animeId)
    return defaultJournalEntry({
      id: spec.id,
      userId: 'u001',
      animeId: spec.animeId,
      status: spec.status,
      progress: spec.status === STATUS.WATCHED ? (anime ? anime.episodes : spec.progress) : spec.progress,
      score: spec.score,
      favorite: spec.favorite,
      review: spec.review,
      quote: spec.quote,
      mood: spec.mood,
      tags: spec.tags,
      startedAt: spec.progress > 0 ? at - 20 * DAY : null,
      finishedAt: spec.status === STATUS.WATCHED ? at : null,
      createdAt: at,
      updatedAt: at,
    })
  })

  const posts = POST_SPEC.map((spec) =>
    defaultPost({
      id: spec.id,
      authorId: spec.authorId,
      animeId: spec.animeId,
      board: spec.board,
      title: spec.title,
      content: spec.content,
      createdAt: now - spec.hoursAgo * HOUR,
      likedBy: [...spec.likedBy],
    }),
  )

  const comments = COMMENT_SPEC.map((spec) =>
    defaultComment({
      id: spec.id,
      postId: spec.postId,
      authorId: spec.authorId,
      content: spec.content,
      createdAt: now - spec.hoursAgo * HOUR,
    }),
  )

  return {
    version: 1,
    users: USERS.map((u) => ({ ...u })),
    journal,
    posts,
    comments,
    session: null,
  }
}

/** 头像底色：注册时按用户数轮换取色 */
export function pickAvatarSeed(index = 0) {
  return AVATAR_SEEDS[index % AVATAR_SEEDS.length]
}
