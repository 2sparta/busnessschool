export const courses = [
  {
    id: "under-16",
    title: "Фінансова грамотність: до 16 років",
    shortTitle: "До 16 років",
    category: "ПЕРШІ КРОКИ",
    description:
      "Що таке гроші і як вони працюють, чому важлива гривня, які є валюти світу, можливості інвестування та картки з рахунками.",
    duration: "1,5 року",
    image: "/images/course-finance.jpg",
    lessons: 7,
    mentor: "Команда FinEd",
  },
  {
    id: "age-16-30",
    title: "Фінансова грамотність: 16–30 років",
    shortTitle: "16–30 років",
    category: "ПЕРШІ ГРОШІ ТА БІЗНЕС",
    description:
      "Від бази до кредитів, іпотеки й перших заробітків. Далі: як відкрити бізнес, податки, інвестиції, крипта та блог.",
    duration: "2 роки",
    image: "/images/course-founder.jpg",
    lessons: 9,
    mentor: "Команда FinEd",
  },
  {
    id: "age-30-60",
    title: "Фінансова грамотність: 30–60+ років",
    shortTitle: "30–60+ років",
    category: "ПЕНСІЯ ТА НЕЗАЛЕЖНІСТЬ",
    description:
      "Інвестиції, порівняння крипти з інвестиціями, пенсійні фонди, блог і шлях до фінансової незалежності.",
    duration: "2 роки",
    image: "/images/course-leadership.jpg",
    lessons: 8,
    mentor: "Команда FinEd",
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
    description: "Самостійне навчання у форматі відеоуроків з усіма матеріалами.",
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
    description: "Структура, зворотний зв’язок і куратор поруч на кожному етапі.",
    benefits: [
      "Усе, що входить у тариф «Старт»",
      "Щотижнева жива зустріч із куратором",
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
    description: "Індивідуальний маршрут і прямий доступ до куратора.",
    benefits: [
      "Усе, що входить у тариф «Менторство»",
      "4 особисті консультації з куратором",
      "Персональний розбір вашого фінансового плану",
      "Персональний фінансовий план на 90 днів",
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
