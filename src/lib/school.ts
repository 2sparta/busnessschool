export const courses = [
  {
    id: "entrepreneurship",
    title: "Підприємець з нуля",
    shortTitle: "Підприємництво",
    category: "СВІЙ БІЗНЕС",
    description:
      "Від першої ідеї до прибуткової системи: перевірте попит, запустіть продукт і побудуйте бізнес-процеси.",
    duration: "12 тижнів",
    image: "/images/course-founder.jpg",
    lessons: 24,
    mentor: "Андрій Мельник",
  },
  {
    id: "leadership",
    title: "Управління та лідерство",
    shortTitle: "Лідерство",
    category: "СИЛЬНА КОМАНДА",
    description:
      "Розвивайте лідерські навички, вчіться делегувати й надихайте команду на спільний результат.",
    duration: "8 тижнів",
    image: "/images/course-leadership.jpg",
    lessons: 18,
    mentor: "Олена Савчук",
  },
  {
    id: "marketing",
    title: "Маркетинг та продажі",
    shortTitle: "Маркетинг",
    category: "ЗРОСТАННЯ",
    description:
      "Побудуйте зрозумілу стратегію просування, знайдіть своїх клієнтів і збільшуйте продажі.",
    duration: "10 тижнів",
    image: "/images/course-marketing.jpg",
    lessons: 20,
    mentor: "Марія Бондар",
  },
  {
    id: "finance",
    title: "Фінанси та інвестиції",
    shortTitle: "Фінанси",
    category: "РОЗУМНИЙ КАПІТАЛ",
    description:
      "Керуйте грошима свідомо, читайте фінансові показники та інвестуйте зважено.",
    duration: "10 тижнів",
    image: "/images/course-finance.jpg",
    lessons: 20,
    mentor: "Тарас Коваль",
  },
] as const;

export type CourseId = (typeof courses)[number]["id"];

export const plans = [
  {
    id: "start",
    name: "Старт",
    subtitle: "У власному темпі",
    amount: 12_900,
    compareAt: 18_900,
    featured: false,
    meetingAccess: false,
    description: "Самостійне навчання з усім необхідним для першого результату.",
    benefits: [
      "Доступ до всіх відеоуроків програми",
      "Практичні завдання та робочі зошити",
      "Доступ до матеріалів на 12 місяців",
      "Закрита спільнота студентів",
      "Підтримка команди в навчальному чаті",
    ],
  },
  {
    id: "mentorship",
    name: "Менторство",
    subtitle: "Найчастіший вибір",
    amount: 24_900,
    compareAt: 34_900,
    featured: true,
    meetingAccess: true,
    description: "Структура, зворотний зв’язок і ментор поруч на кожному етапі.",
    benefits: [
      "Усе, що входить у тариф «Старт»",
      "Щотижнева жива зустріч із ментором",
      "Розбір запитань та практичних кейсів",
      "Персональний фідбек на домашні завдання",
      "Записи зустрічей та конспекти",
      "Пріоритетна підтримка куратора",
    ],
  },
  {
    id: "vip",
    name: "VIP",
    subtitle: "Максимум уваги до вас",
    amount: 42_900,
    compareAt: 59_900,
    featured: false,
    meetingAccess: true,
    description: "Індивідуальний маршрут і прямий доступ до досвіду практиків.",
    benefits: [
      "Усе, що входить у тариф «Менторство»",
      "4 особисті консультації з ментором",
      "Аудит вашого бізнес-проєкту",
      "Персональний план зростання на 90 днів",
      "Приватний чат із куратором",
      "Пріоритетний запис на живі зустрічі",
    ],
  },
] as const;

export type PlanId = (typeof plans)[number]["id"];

export function isCourseId(value: unknown): value is CourseId {
  return typeof value === "string" && courses.some((course) => course.id === value);
}

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && plans.some((plan) => plan.id === value);
}

export function getCourse(courseId: string) {
  return courses.find((course) => course.id === courseId);
}

export function getPlan(planId: string) {
  return plans.find((plan) => plan.id === planId);
}
