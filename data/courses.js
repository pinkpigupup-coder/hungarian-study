/* =========================================================================
   Magyar tanulás – 匈牙利学习
   -------------------------------------------------------------------------
   所有课程内容都放在这个文件里。
   以后要增加新课程，只需要在下面对应的 lessons 数组里追加一个新对象即可，
   不需要改动 HTML 或 CSS。文件必须保存为 UTF-8 编码。

   每一课 lesson 对象的字段：
     id        课程编号，例如 "01"（用于网址 ?lesson=01）
     code      显示在卡片上的编号标签
     title     标题 { hu, en, zh }
     keyline   副标题 / 一句话重点 { hu, en, zh }
     timeline  时间线阶段数组（见下面 lesson 01 的写法）
     quiz      自测题数组

   时间线 stage 对象：
     id, label, period { hu, en, zh },
     points: [ { hu, en, zh } ]        ← 每个点是一行短语
     toolkitCards: {                    ← 可选：一组可逐个揭示的记忆卡
        title { hu, en, zh }, names: [...], hint { hu, en, zh }
     }

   自测题 quiz 对象：
     type: "reveal"   → 看到线索，自己想答案，再点击显示
     prompt { hu, en, zh }, answer { hu, en, zh },
     answerList: [...]                 ← 可选：答案是多个名称时使用

   注意：历史内容来自孩子课堂笔记，请保持原文，不要自行改写或增加年代事件。
   ========================================================================= */

window.COURSES = [
  {
    id: "history",
    label: { hu: "Magyar történelem", en: "Hungarian History", zh: "匈牙利历史" },
    tagline: {
      hu: "A magyar nép útja és történelme",
      en: "The journey and history of the Hungarian people",
      zh: "匈牙利民族的道路与历史"
    },
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
        keyline: {
          hu: "Négy állomás: Ural → Levedin → Etelköz → Kárpát-medence",
          en: "Four stations: Ural → Levedin → Etelköz → Carpathian Basin",
          zh: "四个阶段：乌拉尔 → Levedin → Etelköz → 喀尔巴阡盆地"
        },
        timeline: [
          {
            id: "ural",
            label: "Ural",
            period: { hu: "", en: "", zh: "" },
            points: [
              {
                hu: "hegység déli része Hungária – Volga és Káma folyók",
                en: "southern part of the Ural Mountains Hungaria – the Volga and Kama rivers",
                zh: "乌拉尔山脉南部 Hungaria——伏尔加河和卡马河一带"
              }
            ]
          },
          {
            id: "levedin",
            label: "Levedin",
            period: { hu: "Kr. u. 6. század", en: "6th century AD", zh: "公元6世纪" },
            points: [
              {
                hu: "Don folyó vidéke",
                en: "the region of the Don River",
                zh: "顿河流域"
              },
              {
                hu: "a Kazár Birodalomban éltünk",
                en: "we lived in the Khazar Empire",
                zh: "生活在可萨帝国"
              },
              {
                hu: "kialakult a törzsszervezet (7)",
                en: "the tribal organization of seven tribes developed",
                zh: "形成了由7个部落组成的部落组织"
              }
            ],
            toolkitCards: {
              button: { hu: "7 törzs", en: "Seven Tribes", zh: "七个部落" },
              title: { hu: "7 törzs", en: "Seven Tribes", zh: "七个部落" },
              hint: {
                hu: "Kattints a kártyákra, és mondd ki a neveket!",
                en: "Tap a card to reveal one name.",
                zh: "点击卡片，一次显示一个名称。"
              },
              names: ["Nyék", "Megyer", "Tarján", "Jenő", "Kér", "Keszi", "Kürtgyarmat"]
            }
          },
          {
            id: "etelkoz",
            label: "Etelköz",
            period: { hu: "Kr. u. 9. század", en: "9th century AD", zh: "公元9世纪" },
            points: [
              {
                hu: "Dnyeper és Dnyeszter = folyók vidéke",
                en: "the region of the Dnieper and Dniester rivers",
                zh: "第聂伯河和德涅斯特河流域"
              },
              {
                hu: "a vérszerződés",
                en: "the blood oath",
                zh: "血盟"
              }
            ],
            toolkitCards: {
              button: { hu: "7 vezér", en: "Seven Leaders", zh: "七位首领" },
              title: { hu: "7 vezér", en: "Seven Leaders", zh: "七位首领" },
              hint: {
                hu: "Kattints a kártyákra, és mondd ki a neveket!",
                en: "Tap a card to reveal one name.",
                zh: "点击卡片，一次显示一个名称。"
              },
              names: ["Álmos", "Előd", "Ond", "Kond", "Tas", "Huba", "Töhötöm"]
            }
          },
          {
            id: "karpát",
            label: "895 – Kárpát-medence",
            period: { hu: "", en: "", zh: "" },
            points: [
              {
                hu: "",
                en: "Carpathian Basin",
                zh: "喀尔巴阡盆地"
              }
            ]
          }
        ],
        quiz: [
          {
            prompt: { hu: "Kr. u. 6. század → ?", en: "6th century AD → ?", zh: "公元6世纪 → ?" },
            answer: { hu: "Levedin", en: "Levedin", zh: "Levedin" }
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
            prompt: { hu: "895 → ?", en: "895 → ?", zh: "895 → ?" },
            answer: { hu: "Kárpát-medence", en: "Carpathian Basin", zh: "喀尔巴阡盆地" }
          },
          {
            type: "list",
            prompt: { hu: "Mondd el a 7 törzset!", en: "Say the 7 tribes!", zh: "说出七个部落！" },
            answerList: ["Nyék", "Megyer", "Tarján", "Jenő", "Kér", "Keszi", "Kürtgyarmat"]
          },
          {
            type: "list",
            prompt: { hu: "Mondd el a 7 vezért!", en: "Say the 7 leaders!", zh: "说出七位首领！" },
            answerList: ["Álmos", "Előd", "Ond", "Kond", "Tas", "Huba", "Töhötöm"]
          }
        ]
      }
    ]
  },
  {
    id: "language",
    label: { hu: "Magyar nyelv", en: "Hungarian Language", zh: "匈牙利语" },
    tagline: {
      hu: "Szókincs, számok, nyelvtan",
      en: "Vocabulary, Numbers, Grammar",
      zh: "词汇、数字、语法"
    },
    icon: "🗣️",
    lessons: []
  }
];
