/* =========================================================================
   Magyar tanulás – 匈牙利学习
   -------------------------------------------------------------------------
   所有课程内容都在这个文件里。文件必须保存为 UTF-8 编码。
   以后要增加新的一课，只要在对应分类的 lessons: [ ... ] 里追加一个新对象，
   HTML 和 CSS 都不用改。

   内容规则：历史内容来自孩子的课堂笔记，严格使用原文，
   不要改写、不要自己增加人物 / 年代 / 地点 / 事件。

   lesson 对象字段：
     id, code, title { hu, en, zh }
     timeline: 纵向迁徙主线，每个阶段：
        num      阶段编号（显示成 1. 2. 3. 4.）
        period   时间（可省略），三层语言
        name     阶段名称（匈牙利语为主），三层语言
        points   具体内容，每条 { hu, en, zh }
        toolkit  可选：一组记忆卡
     quiz: 自测题
        { prompt { hu, en, zh }, answer { hu, en, zh } }
        { type: "list", prompt {...}, answerList: [...] }

   提示：某一层语言如果和匈牙利语完全一样（例如专有名词），
   留空即可，页面会自动只显示一次，不做无意义的重复。
   ========================================================================= */

window.COURSES = [
  {
    id: "history",
    label: { hu: "Magyar történelem", en: "Hungarian History", zh: "匈牙利历史" },
    tagline: { hu: "A magyar nép útja és történelme" },
    icon: "🏛️",
    lessons: [
      {
        id: "01",
        code: "1.",
        title: {
          hu: "A magyar nép vándorlása",
          en: "Migration of the Hungarian People",
          zh: "匈牙利民族的迁徙"
        },
        timeline: [
          {
            id: "ural",
            num: "1.",
            period: null,
            name: { hu: "Ural", en: "", zh: "" },
            points: [
              {
                hu: "hegység déli része",
                en: "southern part of the Ural Mountains",
                zh: "乌拉尔山脉南部"
              },
              {
                hu: "Hungária – Volga és Káma folyók",
                en: "Hungaria – Volga and Kama rivers",
                zh: "Hungaria——伏尔加河和卡马河一带"
              }
            ]
          },
          {
            id: "levedin",
            num: "2.",
            period: { hu: "Kr. u. 6. század", en: "6th century AD", zh: "公元6世纪" },
            name: { hu: "Levedin", en: "", zh: "" },
            points: [
              {
                hu: "Don folyó vidéke",
                en: "region of the Don River",
                zh: "顿河一带"
              },
              {
                hu: "a Kazár Birodalomban éltünk",
                en: "we lived in the Khazar Empire",
                zh: "我们生活在可萨帝国"
              },
              {
                hu: "kialakult a törzsszervezet (7)",
                en: "the tribal organization was formed (7)",
                zh: "形成了部落组织（7）"
              }
            ],
            toolkit: {
              button: { hu: "7 törzs", en: "7 tribes", zh: "7个部落" },
              hint: {
                hu: "Kattints a kártyára, és mondd ki a nevet!",
                en: "Tap a card to reveal the name.",
                zh: "点击卡片显示名称。"
              },
              names: ["Nyék", "Megyer", "Tarján", "Jenő", "Kér", "Keszi", "Kürtgyarmat"],
              showAll: { hu: "Mutasd mindet", en: "Show all", zh: "全部显示" },
              hideAll: { hu: "Rejtsd el", en: "Hide all", zh: "全部隐藏" }
            }
          },
          {
            id: "etelkoz",
            num: "3.",
            period: { hu: "Kr. u. 9. század", en: "9th century AD", zh: "公元9世纪" },
            name: { hu: "Etelköz", en: "", zh: "" },
            points: [
              {
                hu: "Dnyeper és Dnyeszter = folyók vidéke",
                en: "region of the Dnieper and Dniester rivers",
                zh: "第聂伯河和德涅斯特河一带"
              },
              {
                hu: "a vérszerződés",
                en: "the blood oath",
                zh: "血盟"
              }
            ],
            toolkit: {
              button: { hu: "7 vezér", en: "7 leaders", zh: "7位首领" },
              hint: {
                hu: "Kattints a kártyára, és mondd ki a nevet!",
                en: "Tap a card to reveal the name.",
                zh: "点击卡片显示名称。"
              },
              names: ["Álmos", "Előd", "Ond", "Kond", "Tas", "Huba", "Töhötöm"],
              showAll: { hu: "Mutasd mindet", en: "Show all", zh: "全部显示" },
              hideAll: { hu: "Rejtsd el", en: "Hide all", zh: "全部隐藏" }
            }
          },
          {
            id: "karpát-medence",
            num: "4.",
            period: { hu: "895", en: "", zh: "895年" },
            name: { hu: "Kárpát-medence", en: "Carpathian Basin", zh: "喀尔巴阡盆地" },
            points: []
          }
        ],
        quiz: [
          {
            prompt: { hu: "Kr. u. 6. század → ?", en: "6th century AD → ?", zh: "公元6世纪 → ?" },
            answer: { hu: "Levedin", en: "", zh: "" }
          },
          {
            prompt: { hu: "Levedin → melyik folyó?", en: "Levedin → which river?", zh: "Levedin → 哪条河？" },
            answer: { hu: "Don folyó", en: "the Don River", zh: "顿河" }
          },
          {
            prompt: { hu: "Etelköz → melyik két folyó?", en: "Etelköz → which two rivers?", zh: "Etelköz → 哪两条河？" },
            answer: { hu: "Dnyeper és Dnyeszter", en: "the Dnieper and the Dniester", zh: "第聂伯河和德涅斯特河" }
          },
          {
            prompt: { hu: "Etelköz → mi történt?", en: "Etelköz → what happened?", zh: "Etelköz → 发生了什么？" },
            answer: { hu: "a vérszerződés", en: "the blood oath", zh: "血盟" }
          },
          {
            prompt: { hu: "895 → ?", en: "895 → ?", zh: "895年 → ?" },
            answer: { hu: "Kárpát-medence", en: "Carpathian Basin", zh: "喀尔巴阡盆地" }
          },
          {
            type: "list",
            prompt: { hu: "Sorold fel a 7 törzset!", en: "List the 7 tribes!", zh: "列出七个部落！" },
            answerList: ["Nyék", "Megyer", "Tarján", "Jenő", "Kér", "Keszi", "Kürtgyarmat"]
          },
          {
            type: "list",
            prompt: { hu: "Sorold fel a 7 vezért!", en: "List the 7 leaders!", zh: "列出七位首领！" },
            answerList: ["Álmos", "Előd", "Ond", "Kond", "Tas", "Huba", "Töhötöm"]
          }
        ]
      }
    ]
  },
  {
    id: "language",
    label: { hu: "Magyar nyelv", en: "Hungarian Language", zh: "匈牙利语" },
    tagline: { hu: "Szókincs, számok, nyelvtan" },
    icon: "🗣️",
    lessons: []
  }
];
