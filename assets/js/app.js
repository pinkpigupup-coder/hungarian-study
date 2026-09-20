/* =========================================================================
   Magyar tanulás – 匈牙利学习  |  app.js
   纯原生 JavaScript，无框架、无后端。
   首页和课程页都由 data/courses.js 自动生成，增加课程只改数据文件。

   语言层级：HU 始终显示（最大最黑）；EN / 中文可用顶部按钮关闭。
   ========================================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "magyar-tanulas-prefs";

  /* ---------------------------------------------------------------------
     基础工具
     --------------------------------------------------------------------- */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function txt(tag, className, value, lang) {
    var node = el(tag, className, value);
    if (lang) node.setAttribute("lang", lang);
    return node;
  }

  function clean(value) {
    return value === undefined || value === null ? "" : String(value).trim();
  }

  /* 三层语言的内容：返回 [hu, en, zh]，其中和匈牙利语重复的层自动省略 */
  function layers(obj) {
    var hu = clean(obj && obj.hu);
    var en = clean(obj && obj.en);
    var zh = clean(obj && obj.zh);
    if (en === hu) en = "";
    if (zh === hu || zh === en) zh = "";
    return { hu: hu, en: en, zh: zh };
  }

  /* 块状三层语言 */
  function triDiv(parent, obj, huClass, enClass, zhClass) {
    var t = layers(obj);
    if (t.hu) parent.appendChild(txt("div", huClass || "hu", t.hu, "hu"));
    if (t.en) parent.appendChild(txt("div", enClass || "en", t.en, "en"));
    if (t.zh) parent.appendChild(txt("div", zhClass || "zh", t.zh, "zh-Hans"));
    return parent;
  }

  /* 行内三层语言（按钮、时间标签用） */
  function triInline(parent, obj, huClass, enClass, zhClass) {
    var t = layers(obj);
    if (t.hu) parent.appendChild(txt("span", huClass || "hu", t.hu, "hu"));
    if (t.en) parent.appendChild(txt("span", enClass || "en", t.en, "en"));
    if (t.zh) parent.appendChild(txt("span", zhClass || "zh", t.zh, "zh-Hans"));
    return parent;
  }

  /* 清空按钮内容，写入三层语言标签 */
  function setBtnLabel(button, obj, iconText, extraClass) {
    while (button.firstChild) button.removeChild(button.firstChild);
    if (iconText) button.appendChild(el("span", "ic", iconText));
    triInline(button, obj);
    if (extraClass) button.classList.add(extraClass);
  }

  function sectionHead(parent, hu, en, zh) {
    var head = el("div", "section-head");
    var h2 = el("h2", "hu", hu);
    h2.setAttribute("lang", "hu");
    head.appendChild(h2);
    triDiv(head, { en: en, zh: zh }, "hu", "en", "zh");
    parent.appendChild(head);
    return head;
  }

  function courseById(id) {
    var courses = window.COURSES || [];
    for (var i = 0; i < courses.length; i++) {
      if (courses[i].id === id) return courses[i];
    }
    return null;
  }

  function lessonHref(courseId, lessonId) {
    return "lesson.html?course=" + encodeURIComponent(courseId) +
      "&lesson=" + encodeURIComponent(lessonId);
  }

  /* ---------------------------------------------------------------------
     偏好：学习 / 自测模式 + EN / 中文显示
     --------------------------------------------------------------------- */
  var prefs = { mode: "study", showEN: true, showZH: true };

  try {
    var saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      var parsed = JSON.parse(saved);
      if (parsed) {
        if (parsed.mode === "study" || parsed.mode === "test") prefs.mode = parsed.mode;
        if (typeof parsed.showEN === "boolean") prefs.showEN = parsed.showEN;
        if (typeof parsed.showZH === "boolean") prefs.showZH = parsed.showZH;
      }
    }
  } catch (e) { /* 忽略隐私模式错误 */ }

  function savePrefs() {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch (e) { /* 忽略 */ }
  }

  function applyPrefs() {
    document.body.classList.toggle("mode-study", prefs.mode === "study");
    document.body.classList.toggle("mode-test", prefs.mode === "test");
    document.body.classList.toggle("hide-en", !prefs.showEN);
    document.body.classList.toggle("hide-zh", !prefs.showZH);

    var modes = document.querySelectorAll("[data-mode]");
    for (var i = 0; i < modes.length; i++) {
      modes[i].setAttribute("aria-pressed",
        modes[i].getAttribute("data-mode") === prefs.mode ? "true" : "false");
    }
    var enBtn = document.querySelector('[data-lang="en"]');
    if (enBtn) {
      enBtn.classList.toggle("is-on", prefs.showEN);
      enBtn.setAttribute("aria-pressed", prefs.showEN ? "true" : "false");
    }
    var zhBtn = document.querySelector('[data-lang="zh"]');
    if (zhBtn) {
      zhBtn.classList.toggle("is-on", prefs.showZH);
      zhBtn.setAttribute("aria-pressed", prefs.showZH ? "true" : "false");
    }
  }

  function setMode(mode) {
    prefs.mode = mode;
    /* 学习模式：辅助语言默认打开；自测模式：默认只留匈牙利语 */
    prefs.showEN = mode === "study";
    prefs.showZH = mode === "study";
    savePrefs();
    applyPrefs();
  }

  function toggleLang(lang) {
    if (lang === "en") prefs.showEN = !prefs.showEN;
    if (lang === "zh") prefs.showZH = !prefs.showZH;
    savePrefs();
    applyPrefs();
  }

  /* ---------------------------------------------------------------------
     首页
     --------------------------------------------------------------------- */
  function renderHome(root) {
    var courses = window.COURSES || [];
    var grid = el("div", "course-grid");

    courses.forEach(function (course) {
      var card = el("section", "course-card");

      var head = el("div", "course-card-head");
      head.appendChild(el("div", "course-icon", course.icon || "📘"));

      var titles = el("div", "course-titles");
      var h2 = el("h2", "hu", course.label.hu);
      h2.setAttribute("lang", "hu");
      titles.appendChild(h2);
      triDiv(titles, { en: course.label.en, zh: course.label.zh }, "hu", "title-en", "title-zh");
      if (course.tagline && course.tagline.hu) {
        titles.appendChild(txt("div", "tagline-hu", course.tagline.hu, "hu"));
      }
      head.appendChild(titles);
      card.appendChild(head);

      if (course.lessons && course.lessons.length) {
        var list = el("ul", "lesson-list");
        course.lessons.forEach(function (lesson) {
          var li = el("li");
          var a = el("a", "lesson-link");
          a.href = lessonHref(course.id, lesson.id);
          a.appendChild(el("span", "lesson-code", lesson.code || ""));

          var text = el("span", "lesson-text");
          var hu = txt("span", "hu lesson-name", lesson.title.hu, "hu");
          text.appendChild(hu);
          var t = layers(lesson.title);
          if (t.en) text.appendChild(txt("span", "en lesson-name-en", t.en, "en"));
          if (t.zh) text.appendChild(txt("span", "zh lesson-name-zh", t.zh, "zh-Hans"));
          a.appendChild(text);

          /* 明确的「开始学习」入口，让人一眼看出可以点击 */
          var cta = el("span", "lesson-cta");
          triInline(cta, { hu: "Tanulás", en: "Start lesson", zh: "开始学习" });
          cta.appendChild(el("span", "arrow", "→"));
          a.appendChild(cta);

          li.appendChild(a);
          list.appendChild(li);
        });
        card.appendChild(list);
      } else {
        card.appendChild(el("p", "empty-note", "Hamarosan… 即将上线 / Coming soon"));
      }

      grid.appendChild(card);
    });

    root.appendChild(grid);
  }

  /* ---------------------------------------------------------------------
     课程页
     --------------------------------------------------------------------- */
  function renderLesson(root, course, lesson) {
    /* --- 标题 --- */
    var head = el("header", "page-head");
    head.appendChild(el("p", "eyebrow",
      (lesson.code ? lesson.code + " · " : "") + course.label.hu));
    var h1 = txt("h1", "hu", lesson.title.hu, "hu");
    head.appendChild(h1);
    triDiv(head, { en: lesson.title.en, zh: lesson.title.zh }, "hu", "title-en", "title-zh");
    root.appendChild(head);

    /* --- 模式 + 语言开关 --- */
    root.appendChild(buildControls(lesson));

    /* --- 纵向迁徙主线 --- */
    var stages = lesson.timeline || [];
    if (stages.length) {
      var tlSection = el("section", "section");
      sectionHead(tlSection, "A vándorlás útja", "The Migration Route", "迁徙路线");

      var timeline = el("div", "timeline");
      stages.forEach(function (stage, i) {
        timeline.appendChild(buildStage(stage, i));
        if (i < stages.length - 1) {
          var arrow = el("div", "stage-arrow", "↓");
          arrow.setAttribute("aria-hidden", "true");
          timeline.appendChild(arrow);
        }
      });
      tlSection.appendChild(timeline);
      root.appendChild(tlSection);
    }

    /* --- 自测 --- */
    var quiz = lesson.quiz || [];
    if (quiz.length) {
      var quizSection = el("section", "section");
      quizSection.id = "selfTest";
      sectionHead(quizSection, "Önellenőrzés", "Self-test", "自测");
      var qList = el("div", "quiz-list");
      quiz.forEach(function (q, i) { qList.appendChild(buildQuizCard(q, i)); });
      quizSection.appendChild(qList);
      root.appendChild(quizSection);
    }

    /* --- 随机测试 --- */
    if (quiz.length) {
      var rSection = el("section", "section");
      sectionHead(rSection, "Véletlen kérdés", "Random Quiz", "随机测试");

      var box = el("div", "random-box");
      box.id = "randomBox";

      var promptBox = el("div", "random-prompt");
      promptBox.id = "randomPrompt";
      promptBox.appendChild(el("div", "placeholder", "Nyomd meg a gombot! / 点下面的按钮开始"));
      box.appendChild(promptBox);

      var answerBox = el("div", "random-answer");
      answerBox.id = "randomAnswer";
      box.appendChild(answerBox);

      var actions = el("div", "random-actions");

      var newBtn = el("button", "btn btn-accent");
      newBtn.type = "button";
      setBtnLabel(newBtn, { hu: "Új kérdés", en: "New question", zh: "换一题" });
      newBtn.addEventListener("click", drawRandom);
      actions.appendChild(newBtn);

      var showBtn = el("button", "btn");
      showBtn.type = "button";
      showBtn.id = "randomShowBtn";
      setBtnLabel(showBtn, { hu: "Mutasd a választ", en: "Show answer", zh: "显示答案" });
      showBtn.addEventListener("click", function () {
        if (!answerBox.firstChild) return;
        answerBox.classList.add("is-open");
      });
      actions.appendChild(showBtn);

      box.appendChild(actions);
      rSection.appendChild(box);
      root.appendChild(rSection);
    }
  }

  /* 控制条：学习 / 自测 + HU / EN / 中文 + 随机测试 */
  function buildControls(lesson) {
    var box = el("div", "controls");

    var seg = el("div", "seg");
    seg.setAttribute("role", "group");
    seg.setAttribute("aria-label", "Tanulás / Önellenőrzés");
    [
      { mode: "study", label: { hu: "Tanulás", en: "Study mode", zh: "学习模式" } },
      { mode: "test", label: { hu: "Önellenőrzés", en: "Self-test mode", zh: "自测模式" } }
    ].forEach(function (m) {
      var b = el("button", "btn");
      b.type = "button";
      b.setAttribute("data-mode", m.mode);
      setBtnLabel(b, m.label);
      b.addEventListener("click", function () { setMode(m.mode); });
      seg.appendChild(b);
    });
    box.appendChild(seg);

    var langRow = el("div", "lang-row");
    langRow.appendChild(el("span", "lang-label", "Nyelv"));

    var huChip = el("span", "lang-chip is-on is-locked", "HU");
    huChip.title = "Magyar mindig látszik / 匈牙利语始终显示";
    langRow.appendChild(huChip);

    [
      { id: "en", text: "EN" },
      { id: "zh", text: "中文" }
    ].forEach(function (l) {
      var b = el("button", "lang-chip is-on", l.text);
      b.type = "button";
      b.setAttribute("data-lang", l.id);
      b.setAttribute("aria-pressed", "true");
      b.addEventListener("click", function () { toggleLang(l.id); });
      langRow.appendChild(b);
    });
    box.appendChild(langRow);

    box.appendChild(el("span", "spacer"));

    if (lesson && lesson.quiz && lesson.quiz.length) {
      var jump = el("button", "btn btn-sm");
      jump.type = "button";
      setBtnLabel(jump, { hu: "Véletlen kérdés", en: "Random Quiz", zh: "随机测试" });
      jump.addEventListener("click", function () {
        var target = document.getElementById("randomBox");
        if (!target) return;
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        drawRandom();
      });
      box.appendChild(jump);
    }

    return box;
  }

  /* 主线里的一个阶段 */
  function buildStage(stage, index) {
    var wrap = el("div", "stage");
    if (stage.id) wrap.setAttribute("data-stage", stage.id);

    var hasPoints = stage.points && stage.points.length;
    var hasToolkit = !!stage.toolkit;
    var hasBody = hasPoints || hasToolkit;

    var titles = el("span", "stage-titles");
    if (stage.period && clean(stage.period.hu)) {
      var period = el("span", "stage-period");
      triInline(period, stage.period, "hu", "en", "zh");
      titles.appendChild(period);
    }
    titles.appendChild(txt("span", "stage-name", stage.name.hu, "hu"));
    var nameLayers = layers(stage.name);
    if (nameLayers.en) titles.appendChild(txt("span", "stage-name-en en", nameLayers.en, "en"));
    if (nameLayers.zh) titles.appendChild(txt("span", "stage-name-zh zh", nameLayers.zh, "zh-Hans"));

    var num = el("span", "stage-num", stage.num || (index + 1) + ".");

    if (!hasBody) {
      var staticRow = el("div", "stage-btn is-static");
      staticRow.appendChild(num);
      staticRow.appendChild(titles);
      wrap.appendChild(staticRow);
      return wrap;
    }

    var btn = el("button", "stage-btn");
    btn.type = "button";
    btn.setAttribute("aria-expanded", "false");
    btn.appendChild(num);
    btn.appendChild(titles);
    btn.appendChild(el("span", "chev", "›"));

    var panel = el("div", "stage-panel");
    if (hasPoints) {
      var ul = el("ul", "point-list");
      stage.points.forEach(function (p) {
        var li = el("li");
        triDiv(li, p);
        ul.appendChild(li);
      });
      panel.appendChild(ul);
    }
    if (hasToolkit) panel.appendChild(buildToolkit(stage.toolkit));

    /* 学习模式默认展开第一个阶段；自测模式全部收起 */
    if (prefs.mode === "study" && index === 0) {
      wrap.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }

    btn.addEventListener("click", function () {
      var open = wrap.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    wrap.appendChild(btn);
    wrap.appendChild(panel);
    return wrap;
  }

  /* 七个部落 / 七位首领记忆卡 */
  function buildToolkit(cfg) {
    var box = el("div", "toolkit");

    var head = el("div", "toolkit-head");
    var toggle = el("button", "btn btn-sm toolkit-open-btn");
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    setBtnLabel(toggle, cfg.button, "▸");
    head.appendChild(toggle);
    box.appendChild(head);

    var body = el("div", "toolkit-body");

    if (cfg.hint) {
      var hint = el("p", "toolkit-hint");
      triInline(hint, cfg.hint, "hu", "en", "zh");
      body.appendChild(hint);
    }

    var grid = el("div", "card-grid");
    var cards = [];

    cfg.names.forEach(function (name, i) {
      var card = el("button", "mcard");
      card.type = "button";
      card.setAttribute("aria-pressed", "false");
      card.appendChild(el("span", "mplaceholder", String(i + 1)));
      card.appendChild(txt("span", "mname", name, "hu"));
      card.addEventListener("click", function () {
        var shown = card.classList.toggle("is-shown");
        card.setAttribute("aria-pressed", shown ? "true" : "false");
      });
      cards.push(card);
      grid.appendChild(card);
    });
    body.appendChild(grid);

    var actions = el("div", "toolkit-actions");

    var showAll = el("button", "btn btn-sm");
    showAll.type = "button";
    setBtnLabel(showAll, cfg.showAll || { hu: "Mutasd mindet", en: "Show all", zh: "全部显示" });
    showAll.addEventListener("click", function () {
      cards.forEach(function (c) {
        c.classList.add("is-shown");
        c.setAttribute("aria-pressed", "true");
      });
    });
    actions.appendChild(showAll);

    var hideAll = el("button", "btn btn-sm");
    hideAll.type = "button";
    setBtnLabel(hideAll, cfg.hideAll || { hu: "Rejtsd el", en: "Hide all", zh: "全部隐藏" });
    hideAll.addEventListener("click", function () {
      cards.forEach(function (c) {
        c.classList.remove("is-shown");
        c.setAttribute("aria-pressed", "false");
      });
    });
    actions.appendChild(hideAll);
    body.appendChild(actions);

    toggle.addEventListener("click", function () {
      var open = body.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      var icon = toggle.querySelector(".ic");
      if (icon) icon.textContent = open ? "▾" : "▸";
    });

    box.appendChild(body);
    return box;
  }

  /* 自测题目：默认只显示题目 */
  function buildQuizCard(q, index) {
    var card = el("div", "qcard");

    var head = el("div", "qhead");
    head.appendChild(el("span", "qnum", String(index + 1)));
    var prompt = el("div", "qprompt");
    triDiv(prompt, q.prompt);
    head.appendChild(prompt);
    card.appendChild(head);

    var answer = el("div", "qanswer");
    var label = el("div", "answer-label");
    triInline(label, { hu: "Válasz", en: "Answer", zh: "答案" });
    answer.appendChild(label);

    if (q.answerList && q.answerList.length) {
      answer.appendChild(buildChips(q.answerList));
    } else if (q.answer) {
      triDiv(answer, q.answer);
    }
    card.appendChild(answer);

    var actions = el("div", "qactions");

    var show = el("button", "btn btn-sm btn-accent");
    show.type = "button";
    setBtnLabel(show, { hu: "Mutasd a választ", en: "Show answer", zh: "显示答案" });
    show.addEventListener("click", function () { card.classList.add("is-open"); });
    actions.appendChild(show);

    var hide = el("button", "btn btn-sm");
    hide.type = "button";
    setBtnLabel(hide, { hu: "Elrejt", en: "Hide", zh: "隐藏" });
    hide.addEventListener("click", function () { card.classList.remove("is-open"); });
    actions.appendChild(hide);

    card.appendChild(actions);
    return card;
  }

  function buildChips(names) {
    var chips = el("div", "answer-chips");
    names.forEach(function (name) {
      chips.appendChild(txt("span", null, name, "hu"));
    });
    return chips;
  }

  /* ---------------------------------------------------------------------
     随机测试
     --------------------------------------------------------------------- */
  var currentLesson = null;
  var lastIndex = -1;

  function drawRandom() {
    var quiz = currentLesson && currentLesson.quiz;
    if (!quiz || !quiz.length) return;

    var i = lastIndex;
    if (quiz.length > 1) {
      while (i === lastIndex) i = Math.floor(Math.random() * quiz.length);
    } else {
      i = 0;
    }
    lastIndex = i;
    var q = quiz[i];

    var promptBox = document.getElementById("randomPrompt");
    var answerBox = document.getElementById("randomAnswer");
    if (!promptBox || !answerBox) return;

    while (promptBox.firstChild) promptBox.removeChild(promptBox.firstChild);
    while (answerBox.firstChild) answerBox.removeChild(answerBox.firstChild);
    answerBox.classList.remove("is-open");

    triDiv(promptBox, q.prompt);
    if (q.answerList && q.answerList.length) {
      answerBox.appendChild(buildChips(q.answerList));
    } else if (q.answer) {
      triDiv(answerBox, q.answer);
    }
  }

  /* ---------------------------------------------------------------------
     启动
     --------------------------------------------------------------------- */
  function init() {
    var root = document.getElementById("app");
    if (!root) return;

    if (root.getAttribute("data-page") === "home") {
      renderHome(root);
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var courseId = params.get("course") || "history";
    var lessonId = params.get("lesson") || "01";

    var course = courseById(courseId) || courseById("history");
    var lesson = null;

    if (course) {
      for (var i = 0; i < course.lessons.length; i++) {
        if (course.lessons[i].id === lessonId) lesson = course.lessons[i];
      }
      if (!lesson && course.lessons.length) lesson = course.lessons[0];
    }

    if (!course || !lesson) {
      root.appendChild(el("p", "empty-note", "A lecke nem található. / 找不到这一课。"));
      return;
    }

    document.title = lesson.title.hu + " · Magyar tanulás";
    currentLesson = lesson;
    renderLesson(root, course, lesson);
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyPrefs();
    init();
    applyPrefs();
  });
})();
