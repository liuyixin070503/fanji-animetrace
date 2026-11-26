import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { parse, compileScript, compileTemplate, compileStyle } from '@vue/compiler-sfc'

const ROOT = process.cwd()
const SRC = join(ROOT, 'src')

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

const files = walk(SRC)
const vueFiles = files.filter((f) => f.endsWith('.vue'))
const problems = []

for (const file of vueFiles) {
  const source = readFileSync(file, 'utf8')
  const rel = relative(ROOT, file)
  const { descriptor, errors } = parse(source, { filename: rel })
  for (const e of errors) problems.push(rel + ' parse: ' + e.message)
  try {
    if (descriptor.script || descriptor.scriptSetup) {
      compileScript(descriptor, { id: 'verify' })
    }
  } catch (e) {
    problems.push(rel + ' script: ' + e.message)
  }
  if (descriptor.template) {
    const r = compileTemplate({
      source: descriptor.template.content,
      filename: rel,
      id: 'verify',
      compilerOptions: { mode: 'module' },
    })
    for (const e of r.errors) problems.push(rel + ' template: ' + (e.message || e))
  }
  for (const style of descriptor.styles) {
    const r = compileStyle({ source: style.content, filename: rel, id: 'verify', scoped: style.scoped })
    for (const e of r.errors) problems.push(rel + ' style: ' + (e.message || e))
  }
}

// ---- db smoke test：内存版 localStorage ----
const mem = new Map()
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
  clear: () => mem.clear(),
}

const db = await import('../src/data/db.js')
const checks = []
const ok = (name, cond, extra = '') => checks.push({ name, pass: !!cond, extra })

ok('listAnime 有 10 部', db.listAnime().length === 10, String(db.listAnime().length))
ok('getAnime 取到孤独摇滚', (db.getAnime('a001') || {}).title === '孤独摇滚！', JSON.stringify((db.getAnime('a001') || {}).title))

const reg = db.register({ username: 'tester_1', nickname: '测试', password: 'abc12345' })
ok('register 成功', reg && reg.ok !== false, JSON.stringify(reg && reg.field ? reg : ''))

const dup = db.register({ username: 'tester_1', nickname: '测试2', password: 'abc12345' })
ok('register 重名被拒', dup && dup.ok === false, JSON.stringify(dup))

const li = db.login('tester_1', 'abc12345')
ok('login 成功', li && li.ok !== false, JSON.stringify(li && li.field ? li : ''))
const bad = db.login('tester_1', 'wrong')
ok('login 错密码被拒', bad && bad.ok === false, JSON.stringify(bad))

const me = db.getSession()
ok('getSession 拿到用户', me && me.username === 'tester_1', JSON.stringify(me && me.username))
ok('session 不含 passwordDigest', me && !('passwordDigest' in me), Object.keys(me || {}).join(','))

const uid = me.id
const entry = db.saveJournal({ userId: uid, animeId: 'a002', status: '在看', progress: 12, score: 9, review: '测试短评', quote: '测试金句', mood: ['治愈'], tags: ['奇幻'] })
ok('saveJournal 新建', entry && entry.id, JSON.stringify(entry && entry.id))
const list = db.listJournal(uid)
ok('listJournal 1 条', list.length === 1, String(list.length))
const upd = db.saveJournal({ ...list[0], progress: 20 })
ok('saveJournal 更新不重复', db.listJournal(uid).length === 1 && upd.progress === 20, String(db.listJournal(uid).length))
ok('removeJournal 删除', db.removeJournal(list[0].id) && db.listJournal(uid).length === 0, '')

const post = db.savePost({ authorId: uid, animeId: 'a001', board: '讨论', title: '测试标题五个字', content: '这是一段超过十个字的测试正文内容。' })
ok('savePost 新建', post && post.id, JSON.stringify(post && post.id))
ok('listPosts 9 条(8 seed+1 新增)', db.listPosts().length === 9, String(db.listPosts().length))
db.toggleLike(post.id, 'u_lin')
db.toggleLike(post.id, 'u_lin')
ok('toggleLike 可点赞可取消', db.getPost(post.id).likedBy.length === 0, String(db.getPost(post.id).likedBy.length))

const cm = db.addComment({ postId: post.id, authorId: uid, content: '测试评论内容' })
ok('addComment', cm && cm.id && db.listComments(post.id).length === 1, String(db.listComments(post.id).length))

const fav = db.toggleFavorite('a003')
ok('toggleFavorite 返回布尔', typeof fav === 'boolean' || typeof fav === 'object', JSON.stringify(fav))

ok('resetAll 清空', db.resetAll() && db.listJournal(uid).length === 0 && db.getSession() === null, '')

// ---- utils ----
const fmt = await import('../src/utils/format.js')
ok('formatDate', fmt.formatDate('2026-11-26T10:00:00.000Z').length >= 8, fmt.formatDate('2026-11-26T10:00:00.000Z'))
ok('formatScore 一位小数', fmt.formatScore(9) === '9.0', fmt.formatScore(9))
ok('progressText 12/24', fmt.progressText(12, 24) === '第 12 / 24 集', fmt.progressText(12, 24))

const hash = await import('../src/utils/hash.js')
ok('hashPassword 稳定', hash.hashPassword('abc') === hash.hashPassword('abc') && hash.hashPassword('abc') !== 'abc', hash.hashPassword('abc'))

const failed = problems.concat(checks.filter((c) => !c.pass).map((c) => 'check failed: ' + c.name + ' ' + c.extra))
console.log('vue files compiled:', vueFiles.length)
console.log('checks:', checks.filter((c) => c.pass).length + '/' + checks.length)
for (const p of problems) console.log('SFC', p)
for (const c of checks.filter((c) => !c.pass)) console.log('FAIL', c.name, c.extra)
console.log(failed.length === 0 ? 'VERIFY OK' : 'VERIFY FAILED ' + failed.length)
process.exit(failed.length === 0 ? 0 : 1)