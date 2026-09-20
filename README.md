# Magyar tanulás 匈牙利学习

给 13 岁孩子复习学校课程用的匈牙利语 / 历史学习网站。
纯静态 HTML + CSS + JavaScript，无数据库、无后端、无框架，可直接放在 GitHub Pages 上。

## 目录结构

```
index.html            首页（两个分类：匈牙利历史 / 匈牙利语）
lesson.html           课程页（用 ?course=history&lesson=01 打开不同课）
404.html              GitHub Pages 找不到页面时显示
data/courses.js       ★ 所有课程内容都在这里（唯一需要经常修改的文件）
assets/css/style.css  样式（手机优先，宽屏自动变成横向时间线）
assets/js/app.js      渲染和交互逻辑（一般不需要改）
.nojekyll             让 GitHub Pages 不做 Jekyll 处理
```

## 怎么增加新的一课

只需要编辑 `data/courses.js`，在对应分类的 `lessons: [ ... ]` 里追加一个新对象，
然后把文件保存为 **UTF-8** 编码即可。不需要改 HTML 或 CSS。

```js
{
  id: "02",                 // 网址里用的编号，不能和别的课重复
  code: "2.",               // 卡片上显示的编号
  title: {
    hu: "课程匈牙利语标题",
    en: "English title",
    zh: "中文标题"
  },
  keyline: { hu: "…", en: "…", zh: "…" },   // 可选：一句话重点
  timeline: [               // 时间线阶段，可以任意个数
    {
      id: "stage1",
      label: "阶段名称",
      period: { hu: "Kr. u. 6. század", en: "6th century AD", zh: "公元6世纪" },
      points: [
        { hu: "匈牙利语原文", en: "English", zh: "中文" }
      ],
      toolkitCards: {       // 可选：一组可以逐个揭示的记忆卡
        button: { hu: "7 törzs", en: "Seven Tribes", zh: "七个部落" },
        title:  { hu: "7 törzs", en: "Seven Tribes", zh: "七个部落" },
        hint:   { hu: "Kattints a kártyákra!", en: "Tap a card.", zh: "点击卡片。" },
        names: ["Nyék", "Megyer", "Tarján"]
      }
    }
  ],
  quiz: [                   // 自测题
    { prompt: { hu: "线索", en: "Clue", zh: "线索" },
      answer: { hu: "答案", en: "Answer", zh: "答案" } },
    { type: "list",         // 答案是多个名称时用这种
      prompt: { hu: "Mondd el a 7 törzset!", en: "Say the 7 tribes!", zh: "说出七个部落！" },
      answerList: ["Nyék", "Megyer", "Tarján"] }
  ]
}
```

新增分类（例如 Numbers / Grammar）时，在 `window.COURSES = [ ... ]` 里增加一个对象，
设置 `id`、`label`、`tagline`、`icon` 和空的 `lessons: []` 即可。

## 内容规则

历史内容来自孩子的课堂笔记。请保持老师的原始表述，不要自行改写、
不要添加课堂笔记里没有的年代或事件。

## 本地预览

在本文件夹里执行：

```
python -m http.server 8123
```

然后浏览器打开 http://127.0.0.1:8123/

## 学习模式 / 自测模式

- 学习模式：显示辅助翻译，时间线默认展开，记忆卡直接显示名称。
- 自测模式：隐藏英语和中文，时间线默认收起，记忆卡只显示“Kártya 1…”，
  自测题和随机题的答案都要点击后才出现。

模式选择会存在浏览器本地（localStorage），下次打开还是上次的模式。

## 部署

仓库名建议 `hungarian-study`，GitHub Pages 从 `main` 分支根目录发布，
公开网址形如 `https://<用户名>.github.io/hungarian-study/`。
