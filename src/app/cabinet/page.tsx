"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { LearningProgress } from "@/components/learning-progress";
import { getAssetPath } from "@/lib/assets";
import {
  courses,
  getCourse,
  getPlan,
  isCourseId,
  isPlanId,
  plans,
  type CourseId,
  type PlanId,
} from "@/lib/school";

const curatorVideos = [
  {
    title: "Почни з головного: надихай людей діяти",
    speaker: "Simon Sinek · відкрита лекція",
    length: "18 хв",
    videoId: "iCvmsMzlF7o",
  },
  {
    title: "Що насправді мотивує команду",
    speaker: "Dan Pink · відкрита лекція",
    length: "19 хв",
    videoId: "u6XAPnuFjJc",
  },
] as const;

function CabinetContent() {
  const searchParams = useSearchParams();

  // Try to read from query params
  const paramPlan = searchParams.get("plan");
  const paramCourse = searchParams.get("course");
  const paramName = searchParams.get("name");
  const paramEmail = searchParams.get("email");
  const paramId = searchParams.get("id");

  const [activePlanId, setActivePlanId] = useState<PlanId>(() => {
    if (isPlanId(paramPlan)) return paramPlan;
    return "mentorship";
  });

  const [activeCourseId, setActiveCourseId] = useState<CourseId>(() => {
    if (isCourseId(paramCourse)) return paramCourse;
    return "entrepreneurship";
  });

  const [studentName, setStudentName] = useState<string>(() => {
    if (paramName && paramName.trim().length > 0) return paramName.trim();
    return "Олександр";
  });

  const [studentEmail, setStudentEmail] = useState<string>(() => {
    if (paramEmail && paramEmail.trim().length > 0) return paramEmail.trim();
    return "student@empire.school";
  });

  const [purchaseId, setPurchaseId] = useState<string>(() => {
    if (paramId && paramId.trim().length > 0) return paramId.trim();
    return "demo-session";
  });

  // On mount, if params were empty, check localStorage for last purchase
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("empire_last_purchase");
      if (saved) {
        const parsed = JSON.parse(saved) as {
          id?: string;
          planId?: string;
          courseId?: string;
          buyerName?: string;
          buyerEmail?: string;
        };
        if (!paramPlan && isPlanId(parsed.planId)) setActivePlanId(parsed.planId);
        if (!paramCourse && isCourseId(parsed.courseId)) setActiveCourseId(parsed.courseId);
        if (!paramName && parsed.buyerName) setStudentName(parsed.buyerName);
        if (!paramEmail && parsed.buyerEmail) setStudentEmail(parsed.buyerEmail);
        if (!paramId && parsed.id) setPurchaseId(parsed.id);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [paramPlan, paramCourse, paramName, paramEmail, paramId]);

  const course = getCourse(activeCourseId) ?? courses[0];
  const plan = getPlan(activePlanId) ?? plans[1];

  const firstName = studentName.trim().split(/\s+/)[0] || "студенте";
  const contactLink = `mailto:hello@empire.school?subject=${encodeURIComponent(
    `Питання щодо програми ${course.title} (Тариф ${plan.name})`,
  )}`;

  return (
    <main className="page-frame cabinet-page">
      <header className="cabinet-header">
        <div className="container cabinet-header-inner">
          <Link className="brand" href="/" aria-label="Empire Business School — на головну">
            <span className="brand-mark">
              <Icon name="landmark" size={27} />
            </span>
            <span className="brand-wordmark">
              <strong>EMPIRE</strong>
              <span>BUSINESS SCHOOL</span>
            </span>
          </Link>
          <nav className="cabinet-nav" aria-label="Навігація кабінету">
            <a href="#learning">Навчання</a>
            <a href="#videos">Відеобібліотека</a>
            <a href="#support">Підтримка</a>
          </nav>
          <Link className="cabinet-home-link" href="/">
            На головну <Icon name="arrow" size={15} />
          </Link>
        </div>
      </header>

      {/* Interactive Tariff Switcher for demo/testing */}
      <section className="cabinet-demo-bar" aria-label="Перемикач тарифів для тестування">
        <div className="container cabinet-demo-bar-inner">
          <span className="demo-bar-label">
            <Icon name="spark" size={15} /> Перегляд тарифів у кабінеті:
          </span>
          <div className="demo-bar-buttons" role="group" aria-label="Вибір тарифу для демонстрації">
            {plans.map((p) => (
              <button
                type="button"
                key={p.id}
                className={`demo-plan-btn${activePlanId === p.id ? " is-active" : ""}`}
                onClick={() => setActivePlanId(p.id)}
              >
                {p.name}
                {p.meetingAccess ? " (із зустрічами)" : " (без зустрічей)"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="cabinet-hero">
        <div className="container">
          <div className="cabinet-breadcrumb">
            <Link href="/">Головна</Link>
            <span>/</span>
            <span>Мій кабінет</span>
          </div>
          <div className="cabinet-hero-grid">
            <div className="cabinet-welcome">
              <p className="eyebrow">
                <span className="eyebrow-line" /> Твій простір для зростання
              </p>
              <div className="access-badge">
                <span className="status-dot" /> Програму активовано
              </div>
              <h1>
                Раді бачити,
                <br />
                <span>{firstName}.</span>
              </h1>
              <p className="cabinet-welcome-copy">
                Твій навчальний маршрут відкрито. Працюй у зручному для тебе темпі, відзначай
                прогрес і повертайся до відеоуроків та матеріалів у будь-який час.
              </p>
              <div className="enrolled-program">
                <span className="enrolled-icon">
                  <Icon name="book" size={21} />
                </span>
                <span>
                  <small>ТВОЯ ПРОГРАМА</small>
                  <strong>{course.title}</strong>
                  <em>
                    {course.duration} <i /> Тариф «{plan.name}»
                  </em>
                </span>
              </div>
            </div>

            <aside className="cabinet-account-card">
              <span className="account-card-label">ОСОБИСТИЙ КАБІНЕТ</span>
              <div className="account-avatar">{firstName.slice(0, 1).toUpperCase()}</div>
              <h2>{studentName}</h2>
              <p className="account-email">{studentEmail}</p>
              <div className="account-divider" />
              <div className="account-detail">
                <span>Тариф програми</span>
                <strong>{plan.name}</strong>
              </div>
              <div className="account-detail">
                <span>Формат зустрічей</span>
                <strong>{plan.meetingAccess ? "Щотижня онлайн" : "Самостійно"}</strong>
              </div>
              <div className="account-detail">
                <span>Твій куратор</span>
                <strong>{course.mentor}</strong>
              </div>
              <a href="#learning" className="account-card-link">
                Перейти до навчання <Icon name="arrow" size={15} />
              </a>
            </aside>
          </div>
        </div>
      </section>

      {/* SCHEDULE & MEETING SECTION - Conditionally rendered based on Tariff */}
      <section className="cabinet-schedule-section" aria-labelledby="schedule-title">
        <div className="container">
          {plan.meetingAccess ? (
            <div className="live-meeting-card">
              <div className="meeting-icon">
                <Icon name="video" size={27} />
              </div>
              <div className="meeting-main">
                <div className="meeting-kicker">
                  <span className="status-dot" /> Живі зустрічі з ментором{" "}
                  <span className="meeting-divider">/</span> ТАРИФ «{plan.name.toUpperCase()}»
                </div>
                <h2 id="schedule-title">Твоє місце за спільним столом</h2>
                <p>
                  Практична групова зустріч щосереди. Готуй свої запитання, поточні показники та
                  кейси — розберемо їх разом із куратором.
                </p>
                <div className="meeting-meta">
                  <span>
                    <Icon name="calendar" size={17} /> Щосереди
                  </span>
                  <span>
                    <Icon name="clock" size={17} /> 18:30 за Києвом
                  </span>
                  <span>
                    <Icon name="users" size={17} /> Онлайн у Google Meet / Zoom
                  </span>
                </div>
                {plan.id === "vip" && (
                  <div className="vip-session-note">
                    <Icon name="spark" size={16} /> VIP: чотири персональні консультації з ментором
                    узгоджуються в індивідуальному графіку.
                  </div>
                )}
                <p className="meeting-demo-note">
                  Натисніть кнопку праворуч, щоб підключитися до онлайн-кімнати зустрічі.
                </p>
              </div>
              <div className="meeting-action">
                <span className="meeting-next-label">ОНЛАЙН-КІМНАТА</span>
                <a
                  className="button button-gold"
                  href="https://meet.google.com/abc-defg-hij"
                  target="_blank"
                  rel="noreferrer"
                >
                  Підключитися до зустрічі <Icon name="external" size={16} />
                </a>
                <span>Google Meet · активне посилання</span>
              </div>
            </div>
          ) : (
            <div className="no-meeting-card">
              <span className="no-meeting-icon">
                <Icon name="book" size={25} />
              </span>
              <div>
                <span className="no-meeting-label">ТАРИФ «СТАРТ»</span>
                <h2 id="schedule-title">Навчання у власному темпі</h2>
                <p>
                  Живі щотижневі зустрічі з ментором не входять до тарифу «Старт». Вам доступні всі
                  24 відеоуроки, практичні завдання, робочі матеріали та закрита спільнота. Якщо вам
                  потрібні живі розбори кейсів із ментором щотижня — ви можете обрати тариф
                  «Менторство» або «VIP».
                </p>
              </div>
              <Link className="button button-outline" href="/#pricing">
                Переглянути інші тарифи <Icon name="arrow" size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* LEARNING PROGRESS & MENTOR NOTE */}
      <section className="cabinet-content" id="learning">
        <div className="container cabinet-content-grid">
          <LearningProgress purchaseId={purchaseId} courseId={course.id} />
          <aside className="mentor-note-card">
            <div className="mentor-note-top">
              <span className="mentor-avatar">
                {course.mentor
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <span className="mentor-message-label">ВІД ТВОГО КУРАТОРА</span>
            </div>
            <Icon name="quote" size={25} />
            <h2>Починай з дії — ясність приходить у процесі.</h2>
            <p>
              Не чекай ідеального моменту. Обери один практичний модуль і виконай завдання вже
              сьогодні. Системний результат складається з щоденних невеликих кроків.
            </p>
            <span className="mentor-signature">
              {course.mentor}
              <small>головний ментор програми «{course.shortTitle}»</small>
            </span>
          </aside>
        </div>
      </section>

      {/* CURATOR VIDEO LIBRARY */}
      <section className="video-library-section" id="videos" aria-labelledby="videos-title">
        <div className="container">
          <div className="section-heading section-heading-light video-library-heading">
            <div>
              <p className="eyebrow eyebrow-dark">
                <span className="eyebrow-line" /> Відеобібліотека
              </p>
              <h2 id="videos-title">ВІДКРИТІ ЛЕКЦІЇ ТА РЕКОМЕНДАЦІЇ</h2>
            </div>
            <p className="video-library-intro">
              Кураторська добірка для натхнення й нових ідей. Записи всіх живих зустрічей
              додаватимуться сюди після завершення ефірів.
            </p>
          </div>
          <div className="video-grid">
            {curatorVideos.map((video, index) => (
              <article className="video-card" key={video.videoId}>
                <div className="video-frame">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.videoId}?rel=0`}
                    title={video.title}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="video-card-copy">
                  <span className="video-card-number">
                    0{index + 1} <i /> РЕКОМЕНДАЦІЯ КУРАТОРА
                  </span>
                  <h3>{video.title}</h3>
                  <div>
                    <span>{video.speaker}</span>
                    <span>{video.length}</span>
                  </div>
                </div>
              </article>
            ))}
            <article className="curator-placeholder-card">
              <img
                src={getAssetPath("/images/masterclass.jpg")}
                alt="Майстер-клас Empire Business School"
                loading="lazy"
              />
              <div className="curator-placeholder-shade" />
              <div className="curator-placeholder-content">
                <span className="video-card-number">
                  03 <i /> ЗАПИС ЗУСТРІЧІ
                </span>
                <span className="placeholder-play">
                  <Icon name="play" size={22} />
                </span>
                <h3>Наступна зустріч із куратором</h3>
                <p>
                  {plan.meetingAccess
                    ? "Відеозапис з’явиться тут через 2 години після щосередового ефіру."
                    : "Доступно для студентів тарифів «Менторство» та «VIP»."}
                </p>
              </div>
            </article>
          </div>
          <p className="video-demo-caption">
            <Icon name="spark" size={16} /> Навчальні відео та розбори доступні цілодобово в будь-якому
            місці.
          </p>
        </div>
      </section>

      {/* CURATOR SUPPORT */}
      <section className="cabinet-support-section" id="support">
        <div className="container support-card">
          <span className="support-icon">
            <Icon name="headphones" size={25} />
          </span>
          <div>
            <p className="eyebrow eyebrow-dark">
              <span className="eyebrow-line" /> Служба турботи
            </p>
            <h2>Потрібна підказка куратора?</h2>
            <p>
              Наша команда допоможе розібратися з домашнім завданням, підкаже графік або відповість
              на організаційні питання.
            </p>
          </div>
          <a className="button button-outline" href={contactLink}>
            Написати куратору <Icon name="arrow" size={16} />
          </a>
        </div>
      </section>

      <footer className="site-footer cabinet-footer">
        <div className="container footer-main">
          <div className="footer-brand-wrap">
            <Link className="brand" href="/">
              <span className="brand-mark">
                <Icon name="landmark" size={27} />
              </span>
              <span className="brand-wordmark">
                <strong>EMPIRE</strong>
                <span>BUSINESS SCHOOL</span>
              </span>
            </Link>
            <p>Освіта. Люди. Можливості.</p>
          </div>
          <div className="cabinet-footer-caption">
            Твій наступний рівень
            <br />
            <span>починається з дії.</span>
          </div>
          <Link className="cabinet-home-link" href="/">
            Повернутися на сайт <Icon name="arrow" size={15} />
          </Link>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 Empire Business School</span>
          <span>Твій персональний простір</span>
          <a href="#learning">До навчання ↑</a>
        </div>
      </footer>
    </main>
  );
}

export default function CabinetPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "#111311",
            color: "#f5f3ed",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ letterSpacing: "2px", textTransform: "uppercase", fontSize: "11px" }}>
              Empire Business School
            </p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", marginTop: "8px" }}>
              Завантаження кабінету…
            </h2>
          </div>
        </div>
      }
    >
      <CabinetContent />
    </Suspense>
  );
}
