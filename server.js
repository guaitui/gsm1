const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// 帖子存储文件
const POST_FILE = path.join(__dirname, 'posts.txt');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// 初始化txt文件不存在则创建
if (!fs.existsSync(POST_FILE)) {
  fs.writeFileSync(POST_FILE, '[]', 'utf8');
}

// 获取所有帖子接口
app.get('/getPosts', (req, res) => {
  const raw = fs.readFileSync(POST_FILE, 'utf8');
  let list = [];
  try {
    list = JSON.parse(raw);
  } catch (e) {
    list = [];
  }
  res.json(list);
});

// 提交帖子接口
app.post('/submitPost', (req, res) => {
  const { title, content, timeText } = req.body;
  if (!title.trim() || !content.trim()) {
    return res.send('<script>alert("标题和内容不能为空");history.back()</script>');
  }

  // 读取现有帖子
  let posts = JSON.parse(fs.readFileSync(POST_FILE, 'utf8') || '[]');
  // 新帖子放最前面
  posts.unshift({ title, content, timeText });
  // 写入txt永久保存
  fs.writeFileSync(POST_FILE, JSON.stringify(posts, null, 2), 'utf8');

  res.send('<script>alert("发布成功！");location.reload()</script>');
});

// HTML转义防XSS
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.listen(port, () => {
  console.log(`运行地址：http://127.0.0.1:${port}`);
});
