export type Topic = {
  title: string;
  detail: string;
};

export type Semester = {
  label: string;
  period: string;
  title: string;
  topics: Topic[];
};

export const courses = [
  {
    id: "under-16",
    ageLabel: "До 16 років",
    ageShort: "до 16",
    title: "Фінансова грамотність: до 16 років",
    category: "ПЕРШІ КРОКИ",
    description:
      "Курс на півтора року який дозволить дитині зрозуміти як працюють гроші, їхню цінність та способи інвестування.",
    audience: "Для підлітків, які вчаться розпоряджатися грошима ще до першої зарплати.",
    duration: "1,5 року",
    pace: "3 семестри",
    image: "/images/course-finance.jpg",
    mentor: "Куратор програми",
    semesters: [
      {
        label: "Семестр 1",
        period: "Перші 6 місяців",
        title: "Гроші та валюти",
        topics: [
          {
            title: "Що таке гроші і як вони працюють",
            detail: "Звідки беруться гроші, навіщо вони потрібні і як рухаються між людьми, магазинами й банками.",
          },
          {
            title: "Гривня та інші валюти світу",
            detail: "Чому важлива гривня, які валюти є у світі, які з них найстабільніші і в що в принципі можна вкладатися.",
          },
        ],
      },
      {
        label: "Семестр 2",
        period: "Наступні 6 місяців",
        title: "Інвестиції та власні гроші",
        topics: [
          {
            title: "Можливості інвестування у 14–16 років",
            detail: "Що реально доступно підлітку: заощадження, прості інструменти і правила ризику без дорослих схем.",
          },
          {
            title: "Що робити з грошима",
            detail: "Як правильно роспоряджаться заробленими грошима і не ростринькать їх за декілька годин.",
          },
        ],
      },
      {
        label: "Семестр 3",
        period: "Завершальні 6 місяців",
        title: "Картки і рахунки",
        topics: [
          {
            title: "Картки, рахунки і як вони працюють",
            detail: "Як працює банківська система, звідки на карті беруться грощі та багато іншого.",
          },
        ],
      },
    ],
  },
  {
    id: "age-16-30",
    ageLabel: "16–30 років",
    ageShort: "16–30",
    title: "Фінансова грамотність: 16–30 років",
    category: "ПЕРШІ ГРОШІ ТА БІЗНЕС",
    description:
      "Два роки впродовж яких ви дізнаетесь про те як керувати грошима, ФОП, інвестицій і крипту.",
    audience: "Для тих, хто заробляє перші гроші, думає про кредит, справу або власний бізнес.",
    duration: "2 роки",
    pace: "4 семестри",
    image: "/images/course-founder.jpg",
    mentor: "Куратор програми",
    semesters: [
      {
        label: "Семестр 1",
        period: "Перші 6 місяців",
        title: "Абсолютна база для того що б розвиватися далі",
        topics: [
          {
            title: "База: скорочений курс до 16 років",
            detail: "Гроші, валюти й базові рішення — стисло, щоб вирівняти старт перед дорослими інструментами.",
          },
          {
            title: "Кредити: як використовувати їх на свою користь",
            detail: "Коли борг допомагає, а коли заганяє у боргову залежність.",
          },
          {
            title: "Іпотека",
            detail: "Як влаштований іпотечний кредит, з чого складається платіж і на що дивитися до підпису договору.",
          },
        ],
      },
      {
        label: "Семестр 2",
        period: "Наступні 6 місяців",
        title: "Перший бізнес",
        topics: [
          {
            title: "Найпопулярніші способи заробітку",
            detail: "16-30 років це початок ващої кар'єри, тому важливо знати усе важливе для її успішного розвитку.",
          },
          {
            title: "Перші гроші",
            detail: "Що робити з першим доходом: що відкласти, в що реінвестувати і чого не робити.",
          },
        ],
      },
      {
        label: "Семестр 3",
        period: "Перша половина другого року",
        title: "Бізнес та інвестиції",
        topics: [
          {
            title: "Як зробити бізнес і його тонкощі",
            detail: "З чого починається справа, як зібрати команду та звідки взяти грощі на розвиток бізнесу.",
          },
          {
            title: "ФОП, податки і військовий збір",
            detail: "Як оформити ФОП, які є податки і які є тонкощі щодо цього.",
          },
          {
            title: "Інвестиції",
            detail: "У що вкладати далі, що б зберегти свій прибуток.",
          },
        ],
      },
      {
        label: "Семестр 4",
        period: "Друга половина другого року",
        title: "Крипта і блог",
        topics: [
          {
            title: "Крипта",
            detail: "Як, нащо і чому вона працює? Як на ній заробляти.",
          },
          {
            title: "Криптосистеми",
            detail: "Як влаштований крипто гаманець, що таке фармінг і як аналізувати ринок (також буде корисно і для тих хто в майбутньому буде торгувати на класичній біржі, а також для розуміння як працює ринок).",
          },
          {
            title: "Акції",
            detail: "Що таке акції компаній? Як вони працюють і як знаходити перспективні варіанти для інвестицій.",
          },
        ],
      },
    ],
  },
  {
    id: "age-30-60",
    ageLabel: "30–60+ років",
    ageShort: "30–60+",
    title: "Фінансова грамотність: 30–60+ років",
    category: "ПЕНСІЯ ТА НЕЗАЛЕЖНІСТЬ",
    description:
      "Два роки: мінімальна база, як влаштований світ і як прокласти шлях до фінансової незалежності.",
    audience: "Для тих, хто хоче навести лад у грошах.",
    duration: "2 роки",
    pace: "4 семестри",
    image: "/images/course-leadership.jpg",
    mentor: "Куратор програми",
    semesters: [
      {
        label: "Семестр 1",
        period: "Перші 6 місяців",
        title: "База та інвестиції",
        topics: [
          {
            title: "Мінімальна база",
            detail: "База яку ви мабуть і так знаете, але всеодно повторим для розуміння того що буде далі.",
          },
          {
            title: "Інвестиції",
            detail: "Як і куди інвестувати, як аналізувати переспективи інвестиції та як зважувати ризики.",
          },
        ],
      },
      {
        label: "Семестр 2",
        period: "Наступні 6 місяців",
        title: "Крипта проти інвестицій",
        topics: [
          {
            title: "Крипта",
            detail: "Що це за вертуальні грощі, які не підкріплені нічим матеріальним?.",
          },
          {
            title: "Інвестиції проти крипти: порівняння",
            detail: "S&P 500 а також інші перспективи інвестування.",
          },
        ],
      },
      {
        label: "Семестр 3",
        period: "Перша половина другого року",
        title: "Пенсійні фонди",
        topics: [
          {
            title: "Як працює пенсія",
            detail: "Як на старості років не потрапить у бідність, повірте, про це краще турбуватися заздалегідь.",
          },
        ],
      },
      {
        label: "Семестр 4",
        period: "Друга половина другого року",
        title: "Фнансова незалежність",
        topics: [
          {
            title: "Фінансова незалежність",
            detail: "Як вийти зі стану фінансової залежності та як не попасти в борги.",
          },
        ],
      },
    ],
  },
] as const;

export type CourseId = (typeof courses)[number]["id"];
export type Course = (typeof courses)[number];

/** Мінімальна ціна одного року. До 16 множиться на 1,5; програми 16+ лишаються на цій сумі. */
export const YEAR_COST = 7_820;
/** 5% єдиного податку + 1% військового збору від виручки. */
export const TAX_RATE = 0.06;
export const PROFIT_RATE = 0.2;

export function courseBase(courseId: CourseId) {
  return courseId === "under-16" ? YEAR_COST * 1.5 : YEAR_COST;
}

/** База + 20% прибутку, потім ціна піднімається так, щоб 6% податку не з’їли цей прибуток. */
export function coursePrice(courseId: CourseId) {
  const withProfit = courseBase(courseId) * (1 + PROFIT_RATE);
  return Math.round(withProfit / (1 - TAX_RATE) / 10) * 10;
}

export const programBenefits = [
  "Усі відеоуроки програми, семестр за семестром",
  "Конспекти до кожної теми",
  "Практичні завдання з орієнтиром, як перевірити себе",
  "Письмовий фідбек куратора на завдання",
  "Добірка літератури і офіційних матеріалів",
  "Доступ на весь строк програми",
  "Закрита спільнота студентів вашого віку",
  "Пріоритет у навчальному чаті",
  "Нагадування, на якому семестрі ви зараз",
  "Зв’язок із куратором у Telegram",
  "Оновлення уроків, поки діє доступ",
] as const;

export const plans = [
  {
    id: "start",
    name: "Старт",
    meetingAccess: false,
    benefits: programBenefits,
  },
] as const;

export type PlanId = "start" | "mentorship" | "vip";

export function isCourseId(value: unknown): value is CourseId {
  return typeof value === "string" && courses.some((course) => course.id === value);
}

export function isPlanId(value: unknown): value is PlanId {
  return value === "start" || value === "mentorship" || value === "vip";
}

export function getCourse(courseId: string) {
  return courses.find((course) => course.id === courseId);
}

export function getPlan(planId: string) {
  if (!isPlanId(planId)) return undefined;
  return plans[0];
}

export function lessonsFor(courseId: CourseId) {
  const course = getCourse(courseId);
  if (!course) return [];
  return course.semesters.flatMap((semester) =>
    semester.topics.map((topic) => ({
      title: topic.title,
      detail: `${semester.label} · ${semester.period}`,
    })),
  );
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("uk-UA").format(amount);
}

export const curators = [
  "Данило Сергійович",
  "Серафім Багратіонович",
  "Артем Олександрович",
  "Максим Юстініанович",
] as const;

export function curatorFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return curators[hash % curators.length] ?? curators[0];
}

export const readings = [
  {
    title: "Гаразд",
    source: "Національний банк України",
    detail: "Безкоштовні розділи: гроші, бюджет, депозити, кредити, шахрайство і страхування.",
    href: "https://harazd.bank.gov.ua/",
  },
  {
    title: "Центр «Талан»",
    source: "НБУ",
    detail: "Матеріали з фінансової грамотності для школярів, родин і викладачів.",
    href: "https://talan.bank.gov.ua/",
  },
  {
    title: "Пенсійний фонд України",
    source: "Офіційний портал",
    detail: "Як влаштована державна пенсія і де перевірити свої дані. Для програми 30–60+.",
    href: "https://www.pfu.gov.ua/",
  },
  {
    title: "Дія",
    source: "Портал державних послуг",
    detail: "ФОП, податки й документи, про які говоримо на програмі 16–30.",
    href: "https://diia.gov.ua/",
  },
  {
    title: "Найбагатший чоловік у Вавилоні",
    source: "Джордж Клейсон · англ. Вікіпедія",
    detail: "Чудова книжка, рекомендуємо до читання в будь-якому віці.",
    href: "https://en.wikipedia.org/wiki/The_Richest_Man_in_Babylon",
  },
  {
    title: "Психологія грошей",
    source: "Морган Гаузел · англ. Вікіпедія",
    detail: "Чому люди з однаковим доходом приходять до різних результатів?",
    href: "https://en.wikipedia.org/wiki/The_Psychology_of_Money",
  },
] as const;
