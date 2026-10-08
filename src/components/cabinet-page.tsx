import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { LearningProgress } from "@/components/learning-progress";
import { Logo } from "@/components/logo";
import { getAnyOfflinePurchase, type StoredPurchase } from "@/lib/demo-store";
import { getCourse, getPlan } from "@/lib/school";

function formatEnrolledOn(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Kyiv",
    }).format(new Date(isoDate));
  } catch {
    return new Date(isoDate).toLocaleDateString("uk-UA");
  }
}

export function CabinetPage({ purchaseId }: { purchaseId: string }) {
  const [purchase, setPurchase] = useState<StoredPurchase | null | undefined>(undefined);

  useEffect(() => {
    setPurchase(getAnyOfflinePurchase(purchaseId));
  }, [purchaseId]);

  if (purchase === undefined) {
    return (
      <main className="page-frame cabinet-page">
        <p className="cabinet-loading">Відкриваємо кабінет…</p>
      </main>
    );
  }

  if (!purchase) {
    return (
      <main className="page-frame cabinet-page">
        <section className="cabinet-missing">
          <Logo />
          <h1>Кабінет не знайдено</h1>
          <p>Це демо-посилання не збережене в цьому браузері. Обери програму на головній і створи кабінет ще раз.</p>
          <Link className="button button-gold" to="/">
            На головну <Icon name="arrow" size={16} />
          </Link>
        </section>
      </main>
    );
  }

  const course = getCourse(purchase.courseId);
  const plan = getPlan(purchase.planId);
  if (!course || !plan) return null;

  const firstName = purchase.buyerName.trim().split(/\s+/)[0] || "студенте";
  const contactLink = `mailto:hello@fined.school?subject=${encodeURIComponent(`Питання щодо програми ${course.title}`)}`;

  return (
    <main className="page-frame cabinet-page">
      <header className="cabinet-header">
        <div className="container cabinet-header-inner">
          <Link className="brand-plate" to="/" aria-label="FinEd — на головну">
            <Logo />
          </Link>
          <nav className="cabinet-nav" aria-label="Навігація кабінету">
            <a href="#learning">Навчання</a>
            <a href="#videos">Відеобібліотека</a>
            <a href="#support">Підтримка</a>
          </nav>
          <Link className="cabinet-home-link" to="/">
            На головну <Icon name="arrow" size={15} />
          </Link>
        </div>
      </header>

      <section className="cabinet-hero">
        <div className="container">
          <div className="cabinet-breadcrumb">
            <Link to="/">Головна</Link>
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
                Програма «{course.ageLabel}» уже відкрита. Іди семестрами у власному темпі й повертайся до тем, коли вони стануть у пригоді.
              </p>
              <div className="enrolled-program">
                <span className="enrolled-icon">
                  <Icon name="book" size={21} />
                </span>
                <span>
                  <small>ТВОЯ ПРОГРАМА</small>
                  <strong>{course.ageLabel}</strong>
                  <em>
                    {course.duration} <i /> Тариф «{plan.name}»
                  </em>
                </span>
              </div>
            </div>

            <aside className="cabinet-account-card">
              <span className="account-card-label">ОСОБИСТИЙ КАБІНЕТ</span>
              <div className="account-avatar">{firstName.slice(0, 1).toUpperCase()}</div>
              <h2>{purchase.buyerName}</h2>
              <p className="account-email">{purchase.buyerEmail}</p>
              <div className="account-divider" />
              <div className="account-detail">
                <span>Запис створено</span>
                <strong>{formatEnrolledOn(purchase.createdAt)}</strong>
              </div>
              <div className="account-detail">
                <span>Куратор</span>
                <strong>{course.mentor}</strong>
              </div>
              <a href="#learning" className="account-card-link">
                Перейти до навчання <Icon name="arrow" size={15} />
              </a>
            </aside>
          </div>
        </div>
      </section>

      <section className="cabinet-schedule-section" aria-labelledby="schedule-title">
        <div className="container">
          {plan.meetingAccess ? (
            <div className="live-meeting-card">
              <div className="meeting-icon">
                <Icon name="video" size={27} />
              </div>
              <div className="meeting-main">
                <div className="meeting-kicker">
                  <span className="status-dot" /> Живі зустрічі з куратором <span className="meeting-divider">/</span> ТАРИФ «{plan.name.toUpperCase()}»
                </div>
                <h2 id="schedule-title">Твоє місце за спільним столом.</h2>
                <p>Практична групова зустріч щосереди. Готуй запитання по поточному семестру — розберемо їх разом.</p>
                <div className="meeting-meta">
                  <span>
                    <Icon name="calendar" size={17} /> Щосереди
                  </span>
                  <span>
                    <Icon name="clock" size={17} /> 18:30 за Києвом
                  </span>
                  <span>
                    <Icon name="users" size={17} /> Група з куратором
                  </span>
                </div>
                {plan.id === "vip" && (
                  <div className="vip-session-note">
                    <Icon name="spark" size={16} /> VIP: чотири індивідуальні консультації узгоджуються окремо з куратором.
                  </div>
                )}
                <p className="meeting-demo-note">Демонстраційний кабінет: координатор надішле актуальне посилання перед заняттям.</p>
              </div>
              <div className="meeting-action">
                <span className="meeting-next-label">ОНЛАЙН-КІМНАТА</span>
                <a className="button button-gold" href="https://meet.google.com/abc-defg-hij" target="_blank" rel="noreferrer">
                  Відкрити демо-кімнату <Icon name="external" size={16} />
                </a>
                <span>Google Meet · демонстраційне посилання</span>
              </div>
            </div>
          ) : (
            <div className="no-meeting-card">
              <span className="no-meeting-icon">
                <Icon name="book" size={25} />
              </span>
              <div>
                <span className="no-meeting-label">ТАРИФ «СТАРТ»</span>
                <h2 id="schedule-title">Навчайся у власному темпі.</h2>
                <p>Живі зустрічі з куратором не входять до цього тарифу. Доступні відеоуроки, робочі матеріали та спільнота студентів.</p>
              </div>
              <Link className="button button-outline" to="/" hash="pricing">
                Переглянути формати <Icon name="arrow" size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="cabinet-content" id="learning">
        <div className="container cabinet-content-grid">
          <LearningProgress purchaseId={purchase.id} courseId={course.id} />
          <aside className="mentor-note-card">
            <div className="mentor-note-top">
              <span className="mentor-avatar">К</span>
              <span className="mentor-message-label">ВІД КУРАТОРА</span>
            </div>
            <Icon name="quote" size={25} />
            <h2>Один семестр за раз. Ясність приходить у процесі.</h2>
            <p>
              Програма «{course.ageLabel}» зібрана під твій етап життя. Не перестрибуй усе одразу — закрий першу тему і рухайся далі.
            </p>
            <span className="mentor-signature">
              {course.mentor}
              <small>програма {course.ageLabel}</small>
            </span>
          </aside>
        </div>
      </section>

      <section className="video-library-section" id="videos" aria-labelledby="videos-title">
        <div className="container">
          <div className="section-heading section-heading-light video-library-heading">
            <div>
              <p className="eyebrow eyebrow-dark">
                <span className="eyebrow-line" /> Відеобібліотека
              </p>
              <h2 id="videos-title">ЗАПИСИ УРОКІВ І ЗУСТРІЧЕЙ</h2>
            </div>
            <p className="video-library-intro">Записи відеоуроків і живих зустрічей з’являтимуться тут після занять.</p>
          </div>
          <div className="video-grid">
            <article className="curator-placeholder-card">
              <img src="/images/masterclass.jpg" alt="" />
              <div className="curator-placeholder-shade" />
              <div className="curator-placeholder-content">
                <span className="video-card-number">
                  01 <i /> {course.semesters[0]?.label.toUpperCase()}
                </span>
                <span className="placeholder-play">
                  <Icon name="play" size={22} />
                </span>
                <h3>{course.semesters[0]?.title}</h3>
                <p>Перший блок програми «{course.ageLabel}». Запис уроку з’явиться після зйомки.</p>
              </div>
            </article>
          </div>
          <p className="video-demo-caption">
            <Icon name="spark" size={16} /> Це демонстраційний кабінет: особисті записи школи додає координатор.
          </p>
        </div>
      </section>

      <section className="cabinet-support-section" id="support">
        <div className="container support-card">
          <span className="support-icon">
            <Icon name="headphones" size={25} />
          </span>
          <div>
            <p className="eyebrow eyebrow-dark">
              <span className="eyebrow-line" /> Ми поруч
            </p>
            <h2>Потрібна допомога?</h2>
            <p>Куратор підкаже, з якої теми програми «{course.ageLabel}» почати і як підготуватися до зустрічі.</p>
          </div>
          <a className="button button-outline" href={contactLink}>
            Написати куратору <Icon name="arrow" size={16} />
          </a>
        </div>
      </section>

      <footer className="site-footer cabinet-footer">
        <div className="container footer-main">
          <div className="footer-brand-wrap">
            <Link className="brand-plate" to="/">
              <Logo />
            </Link>
            <p>Фінансова освіта за віком.</p>
          </div>
          <div className="cabinet-footer-caption">
            Твій наступний рівень
            <br />
            <span>починається з дії.</span>
          </div>
          <Link className="cabinet-home-link" to="/">
            Повернутися на сайт <Icon name="arrow" size={15} />
          </Link>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 FinEd</span>
          <span>Твій навчальний простір</span>
          <a href="#learning">До навчання ↑</a>
        </div>
      </footer>
    </main>
  );
}
