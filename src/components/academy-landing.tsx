"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { withBasePath } from "@/lib/base-path";
import { createLocalPurchase } from "@/lib/demo-store";
import {
  courses,
  getCourse,
  getPlan,
  isCourseId,
  plans,
  type CourseId,
  type PlanId,
} from "@/lib/school";

type OrderDetails = {
  courseId: CourseId;
  planId: PlanId;
};

const benefits = [
  {
    icon: "school",
    title: "Програми за віком",
    text: "Окремий маршрут для дітей до 16 років, молоді 16–30 і дорослих 30–60+.",
  },
  {
    icon: "users",
    title: "Куратори",
    text: "У тарифах «Менторство» і «VIP» — живі зустрічі з кураторами та розбір запитань.",
  },
  {
    icon: "briefcase",
    title: "Практика",
    text: "Картки, рахунки, бюджет і кредити — відпрацьовуйте на реальних прикладах.",
  },
  {
    icon: "network",
    title: "Спільнота однодумців",
    text: "Закрита спільнота студентів, де можна ставити запитання й ділитися досвідом.",
  },
  {
    icon: "rocket",
    title: "Підтримка після навчання",
    text: "Зберігайте доступ до матеріалів і повертайтеся до них у потрібний момент.",
  },
] as const;

const questions = [
  {
    question: "Чи потрібні знання, щоб почати навчання?",
    answer:
      "Ні. Кожна програма починається з бази, тож вона підійде тим, хто ще не має фінансового досвіду.",
  },
  {
    question: "Як проходить навчання?",
    answer:
      "Усі основні уроки доступні онлайн у вашому кабінеті. У тарифах «Менторство» і «VIP» додаються живі зустрічі з куратором, розбір запитань і персональний зворотний зв’язок.",
  },
  {
    question: "Чи можна обрати різні тарифи для різних програм?",
    answer:
      "Так. Тариф обирається окремо для програми. У формі запису перед оформленням можна змінити програму або повернутися до переліку.",
  },
  {
    question: "Чи є оплата на сайті?",
    answer:
      "Ні. Це демонстраційне оформлення без списання коштів. Після заявки одразу відкривається особистий кабінет із навчальними матеріалами та інформацією відповідно до тарифу.",
  },
] as const;

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <a className="brand" href="#home" onClick={onClick} aria-label="Empire Business School — на головну">
      <span className="brand-mark">
        <Icon name="landmark" size={27} />
      </span>
      <span className="brand-wordmark">
        <strong>EMPIRE</strong>
        <span>BUSINESS SCHOOL</span>
      </span>
    </a>
  );
}

export default function AcademyLanding() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<CourseId>(courses[0].id);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const selectedCourse = getCourse(selectedCourseId) ?? courses[0];
  const orderCourse = order ? getCourse(order.courseId) : undefined;
  const orderPlan = order ? getPlan(order.planId) : undefined;

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

  const chooseCourse = (courseId: CourseId) => {
    setSelectedCourseId(courseId);
    setMobileMenuOpen(false);
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  const openOrder = (planId: PlanId, courseId: CourseId = selectedCourseId) => {
    setFormError("");
    setOrder({ planId, courseId });
  };

  const handlePurchase = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!order) return;

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    setFormError("");
    setIsSubmitting(true);

    const openLocalCabinet = () => {
      try {
        const local = createLocalPurchase({
          courseId: order.courseId,
          planId: order.planId,
          buyerName: name,
          buyerEmail: email.toLowerCase(),
        });
        router.push(`/cabinet/${local.id}`);
        router.refresh();
      } catch {
        setFormError("Не вдалося створити кабінет у цьому браузері. Спробуйте ще раз.");
        setIsSubmitting(false);
      }
    };

    try {
      const response = await fetch(withBasePath("/api/purchases"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          courseId: order.courseId,
          planId: order.planId,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        id?: unknown;
        error?: unknown;
      };

      if (response.status === 503 && result.error === "STATIC_MODE") {
        // Vercel without DATABASE_URL or static hosting: keep everything in the browser.
        openLocalCabinet();
        return;
      }

      if (!response.ok) {
        throw new Error(typeof result.error === "string" ? result.error : "Не вдалося оформити заявку.");
      }
      if (typeof result.id !== "string") {
        throw new Error("Заявку збережено, але посилання на кабінет не отримано. Спробуйте ще раз.");
      }

      router.push(`/cabinet/${result.id}`);
      router.refresh();
    } catch (error) {
      // Offline / static hosting fallback: no server, still open a demo cabinet.
      if (error instanceof TypeError) {
        openLocalCabinet();
        return;
      }
      setFormError(error instanceof Error ? error.message : "Сталася помилка. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeOrder = () => {
    if (!isSubmitting) setOrder(null);
  };

  return (
    <main className="page-frame">
      <header className="site-header" id="home">
        <div className="container header-inner">
          <Brand onClick={() => setMobileMenuOpen(false)} />

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
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Головна</a>
            <a href="#programs" onClick={() => setMobileMenuOpen(false)}>Програми</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>Про нас</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Тарифи</a>
            <a href="#contacts" onClick={() => setMobileMenuOpen(false)}>Контакти</a>
            <button className="button button-gold nav-mobile-cta" type="button" onClick={() => { setMobileMenuOpen(false); openOrder("mentorship"); }}>
              Записатися <Icon name="arrow" size={16} />
            </button>
          </nav>

          <button className="button button-gold header-cta" type="button" onClick={() => openOrder("mentorship")}>
            Записатися <Icon name="arrow" size={16} />
          </button>
        </div>
      </header>

      <section className="hero-section" aria-labelledby="hero-title">
        <Image
          className="hero-photo"
          src="/images/hero-mentor.jpg"
          alt="Ведучий Empire Business School у діловому костюмі"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> Онлайн-школа фінансової грамотності</p>
            <h1 id="hero-title">КЕРУЙ СВОЇМИ<br /><span>ГРОШИМА</span></h1>
            <p className="hero-description">
              Від першої гривні до фінансової незалежності. Три програми за віком, відеоуроки у власному темпі та живі зустрічі з кураторами.
            </p>
            <div className="hero-highlights">
              <div><Icon name="trend" size={24} /><span>Практичні<br />завдання</span></div>
              <div><Icon name="users" size={24} /><span>Живі зустрічі<br />з кураторами</span></div>
              <div><Icon name="shield" size={24} /><span>Навчання<br />у власному темпі</span></div>
              <div><Icon name="school" size={24} /><span>Підтримка<br />після навчання</span></div>
            </div>
            <button className="button button-gold hero-cta" type="button" onClick={() => chooseCourse(selectedCourseId)}>
              Обрати програму <Icon name="arrow" size={17} />
            </button>
          </div>
          <aside className="hero-quote">
            <Icon name="quote" size={26} />
            <p>Бізнес — це не про гроші. Це про свободу, можливості та вплив.</p>
            <span>Серафім Багратіонович</span>
            <small>Засновник Empire Business School</small>
          </aside>
          <div className="hero-index"><span>01</span><i /> 03 — РОЗУМІЙ ГРОШІ</div>
        </div>
      </section>

      <section className="stats-band" aria-label="Програми Empire Business School">
        <div className="container stats-grid">
          <div className="stat-item"><strong>3</strong><span>вікові програми</span></div>
          <div className="stat-item"><strong>1,5</strong><span>року курс для дітей до 16</span></div>
          <div className="stat-item"><strong>2</strong><span>роки програм для 16+</span></div>
          <div className="stat-item"><strong>2</strong><span>формати: відео або з куратором</span></div>
        </div>
      </section>

      <section className="programs-section section-dark" id="programs" aria-labelledby="programs-title">
        <div className="container">
          <div className="section-heading section-heading-dark">
            <div>
              <p className="eyebrow"><span className="eyebrow-line" /> Наші програми</p>
              <h2 id="programs-title">ОБЕРИ СВІЙ ШЛЯХ</h2>
            </div>
            <p className="section-heading-note">Обери свій вік —<br />ми підкажемо маршрут навчання.</p>
          </div>

          <div className="course-grid">
            {courses.map((course, index) => (
              <article className="course-card" key={course.id}>
                <div className="course-image-wrap">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 850px) 50vw, 25vw"
                  />
                  <span className="course-number">0{index + 1}</span>
                </div>
                <div className="course-card-content">
                  <p className="course-category">{course.category}</p>
                  <h3>{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span><Icon name="clock" size={15} /> {course.duration}</span>
                    <i />
                    <span>Онлайн</span>
                  </div>
                  <button className="round-arrow" type="button" aria-label={`Обрати програму «${course.title}»`} onClick={() => chooseCourse(course.id)}>
                    <Icon name="arrow" size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="programs-footer"><span>01 — 03</span><span className="programs-footer-line" /><span>ЗНАЙДИ СВІЙ НАПРЯМ</span></div>
        </div>
      </section>

      <section className="about-section" id="about" aria-labelledby="about-title">
        <div className="container about-grid">
          <div className="about-copy">
            <p className="eyebrow eyebrow-dark"><span className="eyebrow-line" /> Про нас</p>
            <h2 id="about-title">ОНЛАЙН-ШКОЛА<br /><span>ФІНАНСОВОЇ ГРАМОТНОСТІ</span></h2>
            <p>Ми — онлайн-платформа, яка вчить керувати грошима свідомо: від перших заощаджень і картки до інвестицій, кредитів, пенсії та фінансової незалежності. Програми поділені за віком, бо на кожному етапі життя свої завдання.</p>
            <p className="about-note"><Icon name="spark" size={18} /> Кожен модуль — маленький крок до великої мети.</p>
            <a className="button button-outline" href="#benefits">Дізнатися більше <Icon name="arrow" size={16} /></a>
          </div>
          <div className="about-photo-wrap">
            <Image
              src="/images/masterclass.jpg"
              alt="Заняття з фінансової грамотності"
              width={880}
              height={640}
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="about-photo-caption"><span className="caption-mark"><Icon name="landmark" size={22} /></span><span><strong>Практика в центрі.</strong><small>Люди, досвід, ваші наступні кроки.</small></span></div>
            <span className="about-photo-number">EBS / 2026</span>
          </div>
        </div>
      </section>

      <section className="benefits-section section-dark" id="benefits" aria-labelledby="benefits-title">
        <div className="container">
          <div className="section-heading section-heading-dark benefits-heading">
            <div>
              <p className="eyebrow"><span className="eyebrow-line" /> Переваги навчання</p>
              <h2 id="benefits-title">ЧОМУ ОБИРАЮТЬ НАС</h2>
            </div>
            <span className="section-count">01 / EMPIRE APPROACH</span>
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
              <p className="eyebrow"><span className="eyebrow-line" /> Інвестиція у себе</p>
              <h2 id="pricing-title">ОБЕРИ СВІЙ ФОРМАТ</h2>
              <p className="pricing-lead">Обери формат навчання: самостійно з відеоуроками<br className="desktop-break" /> або з живими зустрічами з куратором.</p>
            </div>
            <div className="pricing-program-select">
              <label htmlFor="course-picker">Програма навчання</label>
              <select
                id="course-picker"
                value={selectedCourseId}
                onChange={(event) => {
                  if (isCourseId(event.target.value)) setSelectedCourseId(event.target.value);
                }}
              >
                {courses.map((course) => <option value={course.id} key={course.id}>{course.title}</option>)}
              </select>
            </div>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => (
              <article className={`price-card${plan.featured ? " price-card-featured" : ""}`} key={plan.id}>
                {plan.featured && <div className="popular-ribbon"><Icon name="spark" size={14} /> НАЙЧАСТІШЕ ОБИРАЮТЬ</div>}
                <div className="price-card-top">
                  <span className="price-label">{plan.subtitle}</span>
                  <h3>{plan.name}</h3>
                  <p>{plan.description}</p>
                </div>
                <ul className="plan-benefits">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit}><span className="check-mark"><Icon name="check" size={13} /></span><span>{benefit}</span></li>
                  ))}
                </ul>
                <div className="price-card-bottom">
                  <div className="price-value"><strong>{new Intl.NumberFormat("uk-UA").format(plan.amount)} <small>₴</small></strong><del>{new Intl.NumberFormat("uk-UA").format(plan.compareAt)} ₴</del></div>
                  <span className="price-caption">разова вартість навчання</span>
                  <button className={`button ${plan.featured ? "button-gold" : "button-dark-outline"} price-button`} type="button" onClick={() => openOrder(plan.id)}>
                    Обрати тариф <Icon name="arrow" size={16} />
                  </button>
                  <span className="price-note">Демо-запис без оплати <span>·</span> кабінет одразу</span>
                </div>
                {plan.featured && <span className="price-discount">−29%</span>}
              </article>
            ))}
          </div>
          <div className="pricing-footnote"><Icon name="shield" size={17} /><span>Жодних списань: покупка демонстраційна, оплата на сайті не підключена.</span></div>
          <div className="demo-cabinets">
            <span className="demo-cabinets-label">Хочете одразу зазирнути всередину?</span>
            <div className="demo-cabinets-links">
              <a href={withBasePath("/cabinet/demo-start")}>Демо: Старт</a>
              <span>·</span>
              <a href={withBasePath("/cabinet/demo-mentorship")}>Демо: Менторство</a>
              <span>·</span>
              <a href={withBasePath("/cabinet/demo-vip")}>Демо: VIP</a>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section" aria-labelledby="faq-title">
        <div className="container faq-grid">
          <div className="faq-intro">
            <p className="eyebrow eyebrow-dark"><span className="eyebrow-line" /> Залишилися питання?</p>
            <h2 id="faq-title">ПОЧНИ З<br />ВПЕВНЕНОГО КРОКУ</h2>
            <p>Ми зібрали відповіді на найчастіші запитання про програми, формат і запис.</p>
            <button className="button button-outline" type="button" onClick={() => openOrder("mentorship")}>Порадитися з нами <Icon name="arrow" size={16} /></button>
          </div>
          <div className="faq-list">
            {questions.map((item, index) => (
              <details className="faq-item" key={item.question} open={index === 0}>
                <summary><span>{item.question}</span><span className="faq-toggle"><Icon name="chevron" size={17} /></span></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta" id="contacts">
        <Image
          src="/images/masterclass.jpg"
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="final-cta-shade" />
        <div className="container final-cta-inner">
          <div><p className="eyebrow"><span className="eyebrow-line" /> Твій наступний крок</p><h2>ТВОЯ ФІНАНСОВА СВОБОДА<br />ПОЧИНАЄТЬСЯ ТУТ</h2></div>
          <p>Залиш заявку — і обери програму,<br />що відповідає твоєму віку.</p>
          <button className="button button-gold" type="button" onClick={() => openOrder("mentorship")}>Записатися на програму <Icon name="arrow" size={16} /></button>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand-wrap"><Brand /><p>Освіта. Люди. Можливості.</p></div>
          <nav className="footer-nav" aria-label="Навігація внизу сторінки">
            <a href="#home">Головна</a><a href="#programs">Програми</a><a href="#about">Про нас</a><a href="#pricing">Тарифи</a><a href="#contacts">Контакти</a>
          </nav>
          <div className="footer-socials" aria-label="Соціальні мережі"><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">ig</a><a href="https://t.me" target="_blank" rel="noreferrer" aria-label="Telegram">tg</a><a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">▶</a></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 Empire Business School</span><span>Створено для тих, хто діє.</span><a href="#home">На початок ↑</a></div>
      </footer>

      {order && orderCourse && orderPlan && (
        <div className="modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget) closeOrder(); }}>
          <section className="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-title">
            <button className="modal-close" type="button" aria-label="Закрити форму" onClick={closeOrder} disabled={isSubmitting}><Icon name="close" size={20} /></button>
            <div className="modal-emblem"><Icon name="landmark" size={25} /></div>
            <p className="eyebrow eyebrow-dark"><span className="eyebrow-line" /> Демонстраційний запис</p>
            <h2 id="order-title">ТВІЙ НАСТУПНИЙ<br />КРОК — СЮДИ</h2>
            <div className="order-summary"><span>{orderCourse.title}<small>Тариф «{orderPlan.name}» · {new Intl.NumberFormat("uk-UA").format(orderPlan.amount)} ₴</small></span><span><Icon name="check" size={18} /></span></div>
            <p className="modal-note">Залиш контакти — ми створимо навчальний кабінет. Оплата на сайті не підключена.</p>
            <form className="order-form" onSubmit={handlePurchase}>
              <label htmlFor="buyer-name">Ваше ім’я</label>
              <input id="buyer-name" name="name" autoComplete="name" placeholder="Наприклад, Олександр" minLength={2} maxLength={100} required />
              <label htmlFor="buyer-email">Електронна пошта</label>
              <input id="buyer-email" name="email" type="email" autoComplete="email" placeholder="name@example.com" maxLength={180} required />
              {formError && <p className="form-error" role="alert">{formError}</p>}
              <button className="button button-gold modal-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Готуємо ваш кабінет…" : "Створити кабінет"}
                {!isSubmitting && <Icon name="arrow" size={16} />}
              </button>
              <span className="form-privacy"><Icon name="shield" size={14} /> Дані потрібні лише для створення демонстраційного кабінету.</span>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
