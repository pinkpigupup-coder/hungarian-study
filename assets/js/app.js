/* =========================================================================
   Magyar tanulás – 匈牙利学习  |  app.js
   纯原生 JavaScript，无框架、无后端。
   首页和课程页都由 data/courses.js 里的数据自动生成，
   所以以后增加课程只需要改数据文件。
   ========================================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "magyar-tanulas-prefs";

  /* ---------------------------------------------------------------------
     小工具
     --------------------------------------------------------------------- */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function esc(s) {
    return String(s === undefined || s === null ? "" : s);
  }

  /* 生成三层语言文本块：匈牙利语 / 英语 / 中文 */
  function tri(parent, obj, huClass, enClass, zhClass) {
    var huText = obj && obj.hu ? esc(obj.hu).trim() : "";
    var enText = obj && obj.en ? esc(obj.en).trim() : "";
    var zhText = obj && obj.zh ? esc(obj.zh).trim() : "";

    if (huText) {
      var hu = el("div", huClass || "hu", huText);
      hu.setAttribute("lang", "hu");
      parent.appendChild(hu);
    }
    if (enText) {
      var en = el("div", enClass || "en", enText);
      en.setAttribute("lang", "en");
      parent.appendChild(en);
    }
    if (zhText && zhText !== huText) {
      var zh = el("div", zhClass || "zh", zhText);
      zh.setAttribute("lang", "zh-Hans");
      parent.appendChild(zh);
    }
    return parent;
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
     偏好设置（学习模式 / 自测模式、辅助翻译显示）
     --------------------------------------------------------------------- */
  var prefs = {
    mode: "study",      // "study" 学习模式 | "test" 自测模式
    showTrans: true     // 是否显示英语 / 中文辅助
  };

  try {
    var saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      var parsed = JSON.parse(saved);
      if (parsed && (parsed.mode === "study" || parsed.mode === "test")) prefs.mode = parsed.mode;
      if (parsed && typeof parsed.showTrans === "boolean") prefs.showTrans = parsed.showTrans;
    }
  } catch (e) { /* 隐私模式下忽略 */ }

  function savePrefs() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) { /* 忽略 */ }
  }

  function applyPrefs() {
    document.body.classList.toggle("mode-study", prefs.mode === "study");
    document.body.classList.toggle("mode-test", prefs.mode === "test");
    document.body.classList.toggle("hide-trans", !prefs.showTrans);

    var btns = document.querySelectorAll("[data-mode]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-pressed", btns[i].getAttribute("data-mode") === prefs.mode ? "true" : "false");
    }
    var tBtn = document.getElementById("transToggle");
    if (tBtn) {
      tBtn.setAttribute("aria-pressed", prefs.showTrans ? "true" : "false");
      tBtn.textContent = prefs.showTrans ? "辅助翻译：显示" : "辅助翻译：隐藏";
    }
  }

  function setMode(mode) {
    prefs.mode = mode;
    /* 学习模式默认显示辅助翻译，自测模式默认隐藏 */
    prefs.showTrans = mode === "study";
    savePrefs();
    applyPrefs();
  }

  function toggleTrans() {
    prefs.showTrans = !prefs.showTrans;
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

      var hgroup = el("div", "course-titles");
      var h2 = el("h2", "hu", course.label.hu);
      h2.setAttribute("lang", "hu");
      hgroup.appendChild(h2);
      tri(hgroup, {
        en: course.label.en,
        zh: course.label.zh
      });
      tri(hgroup, course.tagline, "hu tagline-hu", "en tagline-en", "zh tagline-zh");
      head.appendChild(hgroup);
      card.appendChild(head);

      if (course.lessons && course.lessons.length) {
        var list = el("ul", "lesson-list");
        course.lessons.forEach(function (lesson) {
          var li = el("li");
          var a = el("a", "lesson-link");
          a.href = lessonHref(course.id, lesson.id);
          a.appendChild(el("span", "lesson-code", lesson.code || ""));

          var text = el("span", "lesson-text");
          var hu = el("div", "hu", lesson.title.hu);
          hu.setAttribute("lang", "hu");
          text.appendChild(hu);
          tri(text, { en: lesson.title.en, zh: lesson.title.zh });
          a.appendChild(text);
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
    head.appendChild(el("p", "eyebrow", (lesson.code ? lesson.code + " · " : "") +
      course.label.hu));
    var h1 = el("h1", "hu", lesson.title.hu);
    h1.setAttribute("lang", "hu");
    head.appendChild(h1);
    tri(head, { en: lesson.title.en, zh: lesson.title.zh });
    if (lesson.keyline) {
      var key = el("div", "keyline");
      tri(key, lesson.keyline, "hu keyline-hu", "en keyline-en", "zh keyline-zh");
      head.appendChild(key);
    }
    root.appendChild(head);

    /* --- 模式控制 --- */
    var controls = el("div", "controls");
    var seg = el("div", "seg");
    seg.setAttribute("role", "group");
    seg.setAttribute("aria-label", "学习模式 / 自测模式");

    [
      { mode: "study", label: "学习模式" },
      { mode: "test", label: "自测模式" }
    ].forEach(function (m) {
      var b = el("button", "btn", m.label);
      b.type = "button";
      b.setAttribute("data-mode", m.mode);
      b.addEventListener("click", function () { setMode(m.mode); });
      seg.appendChild(b);
    });
    controls.appendChild(seg);

    var transBtn = el("button", "btn btn-sm", "辅助翻译：显示");
    transBtn.type = "button";
    transBtn.id = "transToggle";
    transBtn.addEventListener("click", toggleTrans);
    controls.appendChild(transBtn);

    controls.appendChild(el("span", "spacer"));

    var randomJump = el("button", "btn btn-sm", "随机复习");
    randomJump.type = "button";
    randomJump.addEventListener("click", function () {
      var box = document.getElementById("randomBox");
      if (box) {
        box.scrollIntoView({ behavior: "smooth", block: "center" });
        drawRandom();
      }
    });
    controls.appendChild(randomJump);

    root.appendChild(controls);

    /* --- 时间线 --- */
    var tlSection = el("section", "section");
    var tlHead = el("div", "section-head");
    var tlH2 = el("h2", "hu", "Az út / 迁徙路线");
    tlHead.appendChild(tlH2);
    tri(tlHead, { en: "The Route", zh: "路线" });
    tlSection.appendChild(tlHead);

    var timeline = el("div", "timeline");

    (lesson.timeline || []).forEach(function (stage, idx) {
      var wrap = el("div", "stage");
      wrap.setAttribute("data-stage", stage.id);

      wrap.appendChild(el("span", "stage-dot"));

      var btn = el("button", "stage-btn");
      btn.type = "button";
      btn.setAttribute("aria-expanded", "false");

      var label = el("span", "stage-label", stage.label);
      label.setAttribute("lang", "hu");
      btn.appendChild(label);

      if (stage.period && (stage.period.hu || stage.period.en)) {
        btn.appendChild(el("span", "stage-period", stage.period.hu || stage.period.en));
      }
      btn.appendChild(el("span", "chev", "›"));

      var panel = el("div", "stage-panel");
      var list = el("ul", "point-list");

      (stage.points || []).forEach(function (p) {
        var li = el("li");
        tri(li, p, "hu", "en", "zh");
        list.appendChild(li);
      });
      panel.appendChild(list);

      /* 记忆卡（7 törzs / 7 vezér） */
      if (stage.toolkitCards) {
        panel.appendChild(buildToolkit(stage.toolkitCards));
      }

      var openIt = function () {
        var isOpen = wrap.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      };

      /* 自测模式下默认全部收起；学习模式默认打开第一阶段 */
      if (prefs.mode === "study" && idx === 0) {
        wrap.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }

      btn.addEventListener("click", openIt);
      wrap.appendChild(btn);
      wrap.appendChild(panel);
      timeline.appendChild(wrap);
    });

    tlSection.appendChild(timeline);
    root.appendChild(tlSection);

    /* --- 自测 --- */
    var quizSection = el("section", "section");
    quizSection.id = "selfTest";
    var qHead = el("div", "section-head");
    var qH2 = el("h2", "hu", "Önellenőrzés");
    qHead.appendChild(qH2);
    tri(qHead, { en: "Self-test", zh: "自测" });
    quizSection.appendChild(qHead);

    var qList = el("div", "quiz-list");
    (lesson.quiz || []).forEach(function (q, i) {
      qList.appendChild(buildQuizCard(q, i));
    });
    quizSection.appendChild(qList);
    root.appendChild(quizSection);

    /* --- 随机复习 --- */
    var rSection = el("section", "section");
    var rHead = el("div", "section-head");
    var rH2 = el("h2", "hu", "Random Quiz");
    rHead.appendChild(rH2);
    tri(rHead, { en: "Random review", zh: "随机复习" });
    rSection.appendChild(rHead);

    var rBox = el("div", "random-box");
    rBox.id = "randomBox";

    var rPrompt = el("div", "random-prompt");
    rPrompt.id = "randomPrompt";
    rPrompt.appendChild(el("div", "placeholder", "Nyomd meg a gombot! / 点下面的按钮开始"));
    rBox.appendChild(rPrompt);

    var rAnswer = el("div", "random-answer");
    rAnswer.id = "randomAnswer";
    rBox.appendChild(rAnswer);

    var rActions = el("div", "random-actions");
    var rNew = el("button", "btn btn-accent", "Új kérdés / 换一题");
    rNew.type = "button";
    rNew.addEventListener("click", drawRandom);
    rActions.appendChild(rNew);

    var rShow = el("button", "btn", "答案 / Válasz");
    rShow.type = "button";
    rShow.id = "randomShowBtn";
    rShow.addEventListener("click", function () {
      if (!rAnswer.firstChild) return;
      rAnswer.classList.add("is-open");
    });
    rActions.appendChild(rShow);
    rBox.appendChild(rActions);

    rSection.appendChild(rBox);
    root.appendChild(rSection);
  }

  /* 记忆卡组件 */
  function buildToolkit(cfg) {
    var box = el("div", "toolkit");

    var head = el("div", "toolkit-head");
    var title = el("span", "toolkit-title", cfg.title.hu);
    title.setAttribute("lang", "hu");
    head.appendChild(title);

    var titleEn = el("span", "en", cfg.title.en);
    titleEn.setAttribute("lang", "en");
    head.appendChild(titleEn);

    var toggle = el("button", "btn btn-sm", "");
    toggle.type = "button";
    /* 按钮同时显示三层语言：7 törzs / Seven Tribes / 七个部落 */
    toggle.textContent = cfg.button.hu + " · " + cfg.button.en + " · " + cfg.button.zh;
    toggle.setAttribute("lang", "hu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.classList.add("toolkit-open-btn");
    head.appendChild(toggle);
    box.appendChild(head);

    var body = el("div", "toolkit-body");
    if (cfg.hint) {
      var hint = el("p", "toolkit-hint", cfg.hint.hu);
      hint.setAttribute("lang", "hu");
      body.appendChild(hint);
    }

    var grid = el("div", "card-grid");
    var cards = [];

    cfg.names.forEach(function (name, i) {
      var card = el("button", "mcard");
      card.type = "button";
      card.setAttribute("aria-pressed", "false");

      var placeholder = el("span", "mplaceholder", "Kártya " + (i + 1));
      var nm = el("span", "mname", name);
      nm.setAttribute("lang", "hu");

      card.appendChild(placeholder);
      card.appendChild(nm);

      card.addEventListener("click", function () {
        var shown = card.classList.toggle("is-shown");
        card.setAttribute("aria-pressed", shown ? "true" : "false");
      });

      cards.push(card);
      grid.appendChild(card);
    });
    body.appendChild(grid);

    var actions = el("div", "toolkit-actions");
    var hideAll = el("button", "btn btn-sm", "全部隐藏");
    hideAll.type = "button";
    hideAll.addEventListener("click", function () {
      cards.forEach(function (c) {
        c.classList.remove("is-shown");
        c.setAttribute("aria-pressed", "false");
      });
    });
    var showAll = el("button", "btn btn-sm", "全部显示");
    showAll.type = "button";
    showAll.addEventListener("click", function () {
      cards.forEach(function (c) {
        c.classList.add("is-shown");
        c.setAttribute("aria-pressed", "true");
      });
    });
    actions.appendChild(hideAll);
    actions.appendChild(showAll);
    body.appendChild(actions);

    toggle.addEventListener("click", function () {
      var open = body.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    box.appendChild(body);
    return box;
  }

  /* 自测题卡片 */
  function buildQuizCard(q, index) {
    var card = el("div", "qcard");

    var head = el("div", "qhead");
    head.appendChild(el("span", "qnum", String(index + 1)));
    var prompt = el("div", "qprompt");
    tri(prompt, q.prompt, "hu", "en", "zh");
    head.appendChild(prompt);
    card.appendChild(head);

    var answer = el("div", "qanswer");
    answer.appendChild(el("div", "answer-label", "Válasz / Answer / 答案"));

    if (q.answerList && q.answerList.length) {
      var chips = el("div", "answer-chips");
      q.answerList.forEach(function (name) {
        var s = el("span", null, name);
        s.setAttribute("lang", "hu");
        chips.appendChild(s);
      });
      answer.appendChild(chips);
    } else if (q.answer) {
      tri(answer, q.answer, "hu", "en", "zh");
    }
    card.appendChild(answer);

    var actions = el("div", "qactions");
    var show = el("button", "btn btn-sm btn-accent", "答案 / Válasz");
    show.type = "button";
    show.addEventListener("click", function () {
      card.classList.add("is-open");
    });
    var hide = el("button", "btn btn-sm", "隐藏");
    hide.type = "button";
    hide.addEventListener("click", function () {
      card.classList.remove("is-open");
    });
    actions.appendChild(show);
    actions.appendChild(hide);
    card.appendChild(actions);

    return card;
  }

  /* ---------------------------------------------------------------------
     随机复习
     --------------------------------------------------------------------- */
  var currentLesson = null;
  var lastIndex = -1;

  function drawRandom() {
    if (!currentLesson || !currentLesson.quiz || !currentLesson.quiz.length) return;
    var quiz = currentLesson.quiz;
    var i = lastIndex;
    if (quiz.length > 1) {
      while (i === lastIndex) {
        i = Math.floor(Math.random() * quiz.length);
      }
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

    tri(promptBox, q.prompt, "hu", "en", "zh");

    if (q.answerList && q.answerList.length) {
      var chips = el("div", "answer-chips");
      q.answerList.forEach(function (name) {
        var s = el("span", null, name);
        s.setAttribute("lang", "hu");
        chips.appendChild(s);
      });
      answerBox.appendChild(chips);
    } else if (q.answer) {
      tri(answerBox, q.answer, "hu", "en", "zh");
    }
  }

  /* ---------------------------------------------------------------------
     启动
     --------------------------------------------------------------------- */
  function init() {
    var root = document.getElementById("app");
    if (!root) return;

    var page = root.getAttribute("data-page");

    if (page === "home") {
      renderHome(root);
      return;
    }

    /* 课程页：?course=history&lesson=01 */
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
