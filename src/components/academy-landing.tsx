import { Link, useNavigate } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";
import { createLocalPurchase } from "@/lib/demo-store";
import {
  courses,
  coursePrice,
  formatMoney,
  getCourse,
  benefitsByCourse,
  readings,
  YEAR_COST,
  type CourseId,
} from "@/lib/school";

type OrderDetails = {
  courseId: CourseId;
};

const benefits = [
  {
    icon: "school" as const,
    title: "Програми за віком",
    text: "Окремий маршрут до 16, для 16–30 і для 30–60+. Не один курс «для всіх».",
  },
  {
    icon: "users" as const,
    title: "Куратор у чаті",
    text: "Письмовий фідбек на завдання і зв’язок у Telegram. Занять наживо немає — тільки відео.",
  },
  {
    icon: "briefcase" as const,
    title: "Практика",
    text: "Картки, кредити, ФОП, пенсія, крипта — теми, з якими стикаються в житті, а не в підручнику.",
  },
  {
    icon: "network" as const,
    title: "Спільнота",
    text: "Закрита група студентів: можна поставити запитання і почути чужий досвід.",
  },
  {
    icon: "rocket" as const,
    title: "Свій темп",
    text: "Відеоуроки лишаються з тобою. Повертайся до семестру, коли тема стане актуальною.",
  },
];

const questions = [
  {
    question: "Чим відрізняються три програми?",
    answer:
      "До 16 років — 1,5 року: гроші, валюти, перші інвестиції, картки й рахунки. 16–30 — 2 роки: база, кредити, іпотека, перший дохід, бізнес і ФОП, інвестиції, крипта та блог. 30–60+ — 2 роки: база, інвестиції проти крипти, пенсія, блог і фінансова незалежність.",
  },
  {
    question: "Чи потрібні знання, щоб почати?",
    answer: "Ні. Кожна програма починається з бази під свій вік, навіть якщо фінанси досі здаються чужою мовою.",
  },
  {
    question: "Як проходить навчання?",
    answer:
      "Тільки онлайн і тільки відео. Уроки відкриваються в особистому кабінеті за семестрами, у своєму темпі. Куратор відповідає письмово і в Telegram, без очних занять і прямих ефірів.",
  },
  {
    question: "Чи можна змінити вікову програму під час запису?",
    answer: "Так. Вік обирається на сайті і ще раз у формі. Ціна прив’язана до програми, окремих тарифів немає.",
  },
  {
    question: "Чи списуються гроші на сайті?",
    answer: "Ні. Запис демонстраційний: після заявки одразу відкривається кабінет з маршрутом програми. Оплата не підключена.",
  },
];

export function AcademyLanding() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<CourseId>(courses[1].id);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const selectedCourse = getCourse(selectedCourseId) ?? courses[1];
  const orderCourse = order ? getCourse(order.courseId) : undefined;

  useEffect(() => {
    if (!order) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) setOrder(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [order, isSubmitting]);

  const selectAge = (courseId: CourseId, scrollTo: "syllabus" | "pricing" = "syllabus") => {
    setSelectedCourseId(courseId);
    setMobileMenuOpen(false);
    document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" });
  };

  const openOrder = (courseId: CourseId = selectedCourseId) => {
    setFormError("");
    setSelectedCourseId(courseId);
    setOrder({ courseId });
    setMobileMenuOpen(false);
  };

  const handlePurchase = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!order) return;
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    setFormError("");
    setIsSubmitting(true);
    try {
      const local = createLocalPurchase({
        courseId: order.courseId,
        planId: "start",
        buyerName: name,
        buyerEmail: email.toLowerCase(),
      });
      void navigate({ to: "/cabinet/$purchaseId", params: { purchaseId: local.id } });
    } catch {
      setFormError("Не вдалося створити кабінет у цьому браузері. Спробуйте ще раз.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-frame">
      <header className="site-header" id="home">
        <div className="container header-inner">
          <a className="brand" href="#home" onClick={() => setMobileMenuOpen(false)} aria-label="FinEd — на головну">
            <Logo />
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-label={mobileMenuOpen ? "Закрити меню" : "Відкрити меню"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} size={23} />
          </button>

          <nav className={`main-nav${mobileMenuOpen ? " is-open" : ""}`} aria-label="Основна навігація">
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>
              Головна
            </a>
            <a href="#programs" onClick={() => setMobileMenuOpen(false)}>
              Програми
            </a>
            <a href="#syllabus" onClick={() => setMobileMenuOpen(false)}>
              Маршрут
            </a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>
              Про нас
            </a>
            <a href="#library" onClick={() => setMobileMenuOpen(false)}>
              Література
            </a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>
              Вартість
            </a>
            <button
              className="button button-gold nav-mobile-cta"
              type="button"
              onClick={() => openOrder()}
            >
              Записатися <Icon name="arrow" size={16} />
            </button>
          </nav>

          <button className="button button-gold header-cta" type="button" onClick={() => openOrder()}>
            Записатися <Icon name="arrow" size={16} />
          </button>
        </div>
      </header>

      <section className="hero-section" aria-labelledby="hero-title">
        <img className="hero-photo" src="/images/hero-mentor.jpg" alt="Викладач FinEd під час заняття" />
        <div className="hero-shade" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" /> Онлайн-школа фінансової грамотності
            </p>
            <h1 id="hero-title">
              КЕРУЙ СВОЇМИ
              <br />
              <span>ГРОШИМА</span>
            </h1>
            <p className="hero-description">
              FinEd — фінансова освіта за віком. Від першої гривні до пенсії й незалежності. Обери категорію — і побачиш маршрут саме для неї.
            </p>
            <div className="age-switch" role="radiogroup" aria-label="Вікова категорія">
              {courses.map((course) => (
                <button
                  key={course.id}
                  type="button"
                  role="radio"
                  aria-checked={selectedCourseId === course.id}
                  className={`age-pill${selectedCourseId === course.id ? " is-active" : ""}`}
                  onClick={() => selectAge(course.id)}
                >
                  <strong>{course.ageLabel}</strong>
                  <span>{course.duration}</span>
                </button>
              ))}
            </div>
            <div className="hero-highlights">
              <div>
                <Icon name="trend" size={24} />
                <span>
                  Практичні
                  <br />
                  завдання
                </span>
              </div>
              <div>
                <Icon name="users" size={24} />
                <span>
                  Відеоуроки
                  <br />
                  тільки онлайн
                </span>
              </div>
              <div>
                <Icon name="shield" size={24} />
                <span>
                  Навчання
                  <br />у власному темпі
                </span>
              </div>
              <div>
                <Icon name="school" size={24} />
                <span>
                  Три програми
                  <br />за віком
                </span>
              </div>
            </div>
            <button className="button button-gold hero-cta" type="button" onClick={() => selectAge(selectedCourseId)}>
              Дивитися маршрут <Icon name="arrow" size={17} />
            </button>
          </div>
          <aside className="hero-quote">
            <Icon name="quote" size={26} />
            <p>Гроші — це не мета. Це інструмент свободи, якщо розумієш, як вони працюють.</p>
            <span>FinEd</span>
            <small>Фінансова освіта</small>
          </aside>
          <div className="hero-index">
            <span>01</span>
            <i /> 03 — ОБЕРИ ВІК
          </div>
        </div>
      </section>

      <section className="stats-band" aria-label="Програми FinEd">
        <div className="container stats-grid">
          <div className="stat-item">
            <strong>3</strong>
            <span>вікові програми</span>
          </div>
          <div className="stat-item">
            <strong>1,5</strong>
            <span>року для курсу до 16</span>
          </div>
          <div className="stat-item">
            <strong>2</strong>
            <span>роки для програм 16+</span>
          </div>
          <div className="stat-item">
            <strong>4</strong>
            <span>семестри у дорослих курсів</span>
          </div>
        </div>
      </section>

      <section className="programs-section section-dark" id="programs" aria-labelledby="programs-title">
        <div className="container">
          <div className="section-heading section-heading-dark">
            <div>
              <p className="eyebrow">
                <span className="eyebrow-line" /> Наші програми
              </p>
              <h2 id="programs-title">ОБЕРИ СВІЙ ВІК</h2>
            </div>
            <p className="section-heading-note">
              Три категорії.
              <br />
              Один клік — і маршрут розкривається нижче.
            </p>
          </div>

          <div className="course-grid">
            {courses.map((course, index) => {
              const selected = course.id === selectedCourseId;
              return (
                <button
                  className={`course-card${selected ? " is-selected" : ""}`}
                  key={course.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => selectAge(course.id)}
                >
                  <div className="course-image-wrap">
                    <img src={course.image} alt="" />
                    <span className="course-number">0{index + 1}</span>
                    {selected && <span className="course-picked">Обрано</span>}
                  </div>
                  <div className="course-card-content">
                    <p className="course-category">{course.category}</p>
                    <h3>{course.ageLabel}</h3>
                    <p className="course-description">{course.description}</p>
                    <div className="course-meta">
                      <span>
                        <Icon name="clock" size={15} /> {course.duration}
                      </span>
                      <i />
                      <span>{course.pace}</span>
                      <i />
                      <span>Онлайн</span>
                    </div>
                    <span className="round-arrow" aria-hidden="true">
                      <Icon name="arrow" size={18} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="syllabus" id="syllabus">
            <div className="syllabus-head">
              <div>
                <p className="eyebrow">
                  <span className="eyebrow-line" /> Маршрут програми
                </p>
                <h3>{selectedCourse.ageLabel}</h3>
                <p>{selectedCourse.audience}</p>
              </div>
              <div className="syllabus-facts">
                <span>
                  <strong>{selectedCourse.duration}</strong>
                  тривалість
                </span>
                <span>
                  <strong>{selectedCourse.semesters.length}</strong>
                  {selectedCourse.semesters.length === 3 ? "семестри" : "семестри"}
                </span>
                <button className="button button-gold" type="button" onClick={() => selectAge(selectedCourse.id, "pricing")}>
                  Вартість для цього віку <Icon name="arrow" size={16} />
                </button>
              </div>
            </div>
            <ol className="semester-list">
              {selectedCourse.semesters.map((semester, index) => (
                <li className="semester" key={semester.label}>
                  <div className="semester-when">
                    <span>0{index + 1}</span>
                    <strong>{semester.period}</strong>
                    <em>{semester.label}</em>
                  </div>
                  <div>
                    <h4>{semester.title}</h4>
                    <ul>
                      {semester.topics.map((topic) => (
                        <li key={topic.title}>
                          <strong>{topic.title}</strong>
                          <span>{topic.detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="programs-footer">
            <span>01 — 03</span>
            <span className="programs-footer-line" />
            <span>ВІК ВИЗНАЧАЄ МАРШРУТ</span>
          </div>
        </div>
      </section>

      <section className="about-section" id="about" aria-labelledby="about-title">
        <div className="container about-grid">
          <div className="about-copy">
            <p className="eyebrow eyebrow-dark">
              <span className="eyebrow-line" /> Про нас
            </p>
            <h2 id="about-title">
              ОНЛАЙН-ШКОЛА
              <br />
              <span>ФІНАНСОВОЇ ОСВІТИ</span>
            </h2>
            <p>
              FinEd вчить керувати грошима свідомо: від перших заощаджень і картки до кредитів, бізнесу, пенсії та фінансової незалежності. Програми розділені за віком, бо в 15, у 24 і в 45 різні завдання.
            </p>
            <p>
              До 16 ми не говоримо про ФОП. У 16–30 не починаємо з пенсійного фонду. Після 30 не витрачаємо рік на те, що таке гривня. Кожен семестр — наступний дорослий крок.
            </p>
            <p className="about-note">
              <Icon name="spark" size={18} /> Кожен модуль — маленький крок до великої мети.
            </p>
            <a className="button button-outline" href="#benefits">
              Дізнатися більше <Icon name="arrow" size={16} />
            </a>
          </div>
          <div className="about-photo-wrap">
            <img src="/images/masterclass.jpg" alt="Заняття з фінансової грамотності" width={880} height={640} />
            <div className="about-photo-caption">
              <span className="caption-mark">
                <Icon name="school" size={22} />
              </span>
              <span>
                <strong>Практика в центрі.</strong>
                <small>Вік, семестр, наступний крок.</small>
              </span>
            </div>
            <span className="about-photo-number">FINED / 2026</span>
          </div>
        </div>
      </section>

      <section className="benefits-section section-dark" id="benefits" aria-labelledby="benefits-title">
        <div className="container">
          <div className="section-heading section-heading-dark benefits-heading">
            <div>
              <p className="eyebrow">
                <span className="eyebrow-line" /> Переваги навчання
              </p>
              <h2 id="benefits-title">ЧОМУ ОБИРАЮТЬ FINED</h2>
            </div>
            <span className="section-count">01 / ВІК · СЕМЕСТР · ПРАКТИКА</span>
          </div>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <article className="benefit-card" key={benefit.title}>
                <span className="benefit-index">0{index + 1}</span>
                <Icon name={benefit.icon} size={31} />
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-section section-dark" id="pricing" aria-labelledby="pricing-title">
        <div className="pricing-glow" />
        <div className="container pricing-inner">
          <div className="section-heading section-heading-dark pricing-heading">
            <div>
              <p className="eyebrow">
                <span className="eyebrow-line" /> Інвестиція у себе
              </p>
              <h2 id="pricing-title">ОБЕРИ СВІЙ ВІК</h2>
              <p className="pricing-lead">
                Один формат для всіх: онлайн-відеокурс.
                <br className="desktop-break" /> Ціна залежить лише від вікової програми.
              </p>
            </div>
          </div>

          <div className="pricing-grid">
            {courses.map((course) => {
              const price = coursePrice(course.id);
              const featured = course.id === "age-16-30";
              return (
                <article className={`price-card${featured ? " price-card-featured" : ""}`} key={course.id}>
                  <div className="price-card-top">
                    <span className="price-label">{course.duration} · тільки відео</span>
                    <h3>{course.ageLabel}</h3>
                    <p>{course.description}</p>
                  </div>
                  <ul className="plan-benefits">
                    {benefitsByCourse[course.id].map((benefit) => (
                      <li key={benefit}>
                        <span className="check-mark">
                          <Icon name="check" size={13} />
                        </span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="price-card-bottom">
                    <div className="price-value">
                      <strong>
                        {formatMoney(price)} <small>₴</small>
                      </strong>
                    </div>
                    <button className={`button ${featured ? "button-gold" : "button-dark-outline"} price-button`} type="button" onClick={() => openOrder(course.id)}>
                      Обрати програму <Icon name="arrow" size={16} />
                    </button>
                    <span className="price-note">
                      Демо-запис без оплати <span>·</span> кабінет одразу
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="pricing-footnote">
            <Icon name="shield" size={17} />
            <span>
              Ціна за всю програму: рік коштує {formatMoney(YEAR_COST)} ₴, до 16 це 1,5 року, програми 16+ — 2 роки. Оплата на сайті не списується.
            </span>
          </div>
          <div className="demo-cabinets">
            <span className="demo-cabinets-label">Хочете одразу зазирнути всередину?</span>
            <div className="demo-cabinets-links">
              <Link to="/cabinet/$purchaseId" params={{ purchaseId: "demo-mentorship" }}>
                Демо: до 16
              </Link>
              <span>·</span>
              <Link to="/cabinet/$purchaseId" params={{ purchaseId: "demo-start" }}>
                Демо: 16–30
              </Link>
              <span>·</span>
              <Link to="/cabinet/$purchaseId" params={{ purchaseId: "demo-vip" }}>
                Демо: 30–60+
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="reading-section" id="library" aria-labelledby="library-title">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow eyebrow-dark">
                <span className="eyebrow-line" /> Що читати поруч із курсом
              </p>
              <h2 id="library-title">ЛІТЕРАТУРА І ДЖЕРЕЛА</h2>
            </div>
            <p className="section-heading-note reading-note">
              Офіційні матеріали й дві книжки, на які спираємося в програмах. Посилання відкриваються в новій вкладці.
            </p>
          </div>
          <div className="reading-grid">
            {readings.map((item) => (
              <a className="reading-card" key={item.href} href={item.href} target="_blank" rel="noreferrer">
                <span>{item.source}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <em>
                  Відкрити <Icon name="external" size={14} />
                </em>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section" aria-labelledby="faq-title">
        <div className="container faq-grid">
          <div className="faq-intro">
            <p className="eyebrow eyebrow-dark">
              <span className="eyebrow-line" /> Залишилися питання?
            </p>
            <h2 id="faq-title">
              ПОЧНИ З<br />
              ВПЕВНЕНОГО КРОКУ
            </h2>
            <p>Коротко про вік, семестри і те, як відкривається кабінет.</p>
            <button className="button button-outline" type="button" onClick={() => openOrder()}>
              Записатися <Icon name="arrow" size={16} />
            </button>
          </div>
          <div className="faq-list">
            {questions.map((item, index) => (
              <details className="faq-item" key={item.question} open={index === 0}>
                <summary>
                  <span>{item.question}</span>
                  <span className="faq-toggle">
                    <Icon name="chevron" size={17} />
                  </span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta" id="contacts">
        <img src="/images/masterclass.jpg" alt="" />
        <div className="final-cta-shade" />
        <div className="container final-cta-inner">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-line" /> Твій наступний крок
            </p>
            <h2>
              ТВОЯ ФІНАНСОВА СВОБОДА
              <br />
              ПОЧИНАЄТЬСЯ ТУТ
            </h2>
          </div>
          <p>
            Зараз обрано: {selectedCourse.ageLabel}.
            <br />
            Можна змінити вік у формі запису.
          </p>
          <button className="button button-gold" type="button" onClick={() => openOrder()}>
            Записатися на програму <Icon name="arrow" size={16} />
          </button>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand-wrap">
            <a className="brand-plate" href="#home">
              <Logo />
            </a>
            <p>Фінансова освіта. Три віки. Один принцип — практика.</p>
          </div>
          <nav className="footer-nav" aria-label="Навігація внизу сторінки">
            <a href="#home">Головна</a>
            <a href="#programs">Програми</a>
            <a href="#syllabus">Маршрут</a>
            <a href="#library">Література</a>
            <a href="#pricing">Вартість</a>
            <a href="#contacts">Контакти</a>
          </nav>
          <div className="footer-socials" aria-label="Соціальні мережі">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              ig
            </a>
            <a href="https://t.me/SERSTRU" target="_blank" rel="noreferrer" aria-label="Telegram">
              tg
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
              ▶
            </a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 FinEd · Фінансова освіта</span>
          <span>Створено для тих, хто діє.</span>
          <a href="#home">На початок ↑</a>
        </div>
      </footer>

      {order && orderCourse && (
        <div
          className="modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              if (!isSubmitting) setOrder(null);
            }
          }}
        >
          <section className="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-title">
            <button className="modal-close" type="button" aria-label="Закрити форму" onClick={() => !isSubmitting && setOrder(null)} disabled={isSubmitting}>
              <Icon name="close" size={20} />
            </button>
            <div className="modal-emblem">
              <Logo className="logo-emblem" />
            </div>
            <p className="eyebrow eyebrow-dark">
              <span className="eyebrow-line" /> Демонстраційний запис
            </p>
            <h2 id="order-title">
              ТВІЙ НАСТУПНИЙ
              <br />
              КРОК — СЮДИ
            </h2>
            <fieldset className="modal-ages">
              <legend>Вікова програма</legend>
              <div className="age-switch age-switch-light">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    className={`age-pill${order.courseId === course.id ? " is-active" : ""}`}
                    onClick={() => setOrder({ courseId: course.id })}
                  >
                    <strong>{course.ageLabel}</strong>
                    <span>{course.duration}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="order-summary">
              <span>
                {orderCourse.ageLabel}
                <small>
                  Відеокурс · {formatMoney(coursePrice(order.courseId))} ₴ · {orderCourse.duration}
                </small>
              </span>
              <span>
                <Icon name="check" size={18} />
              </span>
            </div>
            <p className="modal-note">Залиш контакти — відкриємо навчальний кабінет з маршрутом цієї програми. Оплата не списується.</p>
            <form className="order-form" onSubmit={handlePurchase}>
              <label htmlFor="buyer-name">Ім’я</label>
              <input
                id="buyer-name"
                name="name"
                autoComplete="name"
                placeholder={order.courseId === "under-16" ? "Ім’я студента або батьків" : "Наприклад, Олександр"}
                minLength={2}
                maxLength={100}
                required
              />
              <label htmlFor="buyer-email">Електронна пошта</label>
              <input
                id="buyer-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                maxLength={180}
                required
              />
              {formError && (
                <p className="form-error" role="alert">
                  {formError}
                </p>
              )}
              <button className="button button-gold modal-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Готуємо кабінет…" : "Створити кабінет"}
                {!isSubmitting && <Icon name="arrow" size={16} />}
              </button>
              <span className="form-privacy">
                <Icon name="shield" size={14} /> Дані потрібні лише для демонстраційного кабінету в цьому браузері.
              </span>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
