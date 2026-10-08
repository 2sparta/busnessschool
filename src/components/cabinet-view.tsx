import Image from "next/image";
import { Icon } from "@/components/icon";
import { LearningProgress } from "@/components/learning-progress";
import { withBasePath } from "@/lib/base-path";
import type { CourseId } from "@/lib/school";

export type CabinetCourse = {
  id: CourseId;
  title: string;
  duration: string;
  mentor: string;
};

export type CabinetPlan = {
  id: string;
  name: string;
  meetingAccess: boolean;
};

type CabinetViewProps = {
  purchaseId: string;
  buyerName: string;
  buyerEmail: string;
  enrolledOn: string;
  course: CabinetCourse;
  plan: CabinetPlan;
  homeHref?: string;
};

// Записи уроків і зустрічей додає координатор після занять.
const curatorVideos: readonly { title: string; speaker: string; length: string; videoId: string }[] = [];

export function CabinetView({
  purchaseId,
  buyerName,
  buyerEmail,
  enrolledOn,
  course,
  plan,
  homeHref,
}: CabinetViewProps) {
  const home = homeHref ?? withBasePath("/");
  const pricingHref = `${home}#pricing`;
  const firstName = buyerName.trim().split(/\s+/)[0] || "студенте";
  const contactLink = `mailto:hello@fined.school?subject=${encodeURIComponent(`Питання щодо програми ${course.title}`)}`;

  return (
    <main className="page-frame cabinet-page">
      <header className="cabinet-header">
        <div className="container cabinet-header-inner">
          <a className="brand" href={home} aria-label="FinEd — Фінансова освіта, на головну">
            <img className="brand-logo" src={withBasePath("/images/fined-logo-light.svg")} alt="FinEd — Фінансова освіта" width={200} height={108} />
          </a>
          <nav className="cabinet-nav" aria-label="Навігація кабінету">
            <a href="#learning">Навчання</a>
            <a href="#videos">Відеобібліотека</a>
            <a href="#support">Підтримка</a>
          </nav>
          <a className="cabinet-home-link" href={home}>На головну <Icon name="arrow" size={15} /></a>
        </div>
      </header>

      <section className="cabinet-hero">
        <div className="container">
          <div className="cabinet-breadcrumb"><a href={home}>Головна</a><span>/</span><span>Мій кабінет</span></div>
          <div className="cabinet-hero-grid">
            <div className="cabinet-welcome">
              <p className="eyebrow"><span className="eyebrow-line" /> Твій простір для зростання</p>
              <div className="access-badge"><span className="status-dot" /> Програму активовано</div>
              <h1>Раді бачити,<br /><span>{firstName}.</span></h1>
              <p className="cabinet-welcome-copy">Твій наступний крок починається тут. Навчайся у власному темпі, відстежуй прогрес і повертайся до матеріалів у будь-який час.</p>
              <div className="enrolled-program">
                <span className="enrolled-icon"><Icon name="book" size={21} /></span>
                <span><small>ТВОЯ ПРОГРАМА</small><strong>{course.title}</strong><em>{course.duration} <i /> Тариф «{plan.name}»</em></span>
              </div>
            </div>

            <aside className="cabinet-account-card">
              <span className="account-card-label">ОСОБИСТИЙ КАБІНЕТ</span>
              <div className="account-avatar">{firstName.slice(0, 1).toUpperCase()}</div>
              <h2>{buyerName}</h2>
              <p className="account-email">{buyerEmail}</p>
              <div className="account-divider" />
              <div className="account-detail"><span>Запис створено</span><strong>{enrolledOn}</strong></div>
              <div className="account-detail"><span>Твій куратор</span><strong>{course.mentor}</strong></div>
              <a href="#learning" className="account-card-link">Перейти до навчання <Icon name="arrow" size={15} /></a>
            </aside>
          </div>
        </div>
      </section>

      <section className="cabinet-schedule-section" aria-labelledby="schedule-title">
        <div className="container">
          {plan.meetingAccess ? (
            <div className="live-meeting-card">
              <div className="meeting-icon"><Icon name="video" size={27} /></div>
              <div className="meeting-main">
                <div className="meeting-kicker"><span className="status-dot" /> Живі зустрічі з куратором <span className="meeting-divider">/</span> ТАРИФ «{plan.name.toUpperCase()}»</div>
                <h2 id="schedule-title">Твоє місце за спільним столом.</h2>
                <p>Практична групова зустріч щосереди. Готуй свої запитання — розберемо їх разом.</p>
                <div className="meeting-meta">
                  <span><Icon name="calendar" size={17} /> Щосереди</span>
                  <span><Icon name="clock" size={17} /> 18:30 за Києвом</span>
                  <span><Icon name="users" size={17} /> Група з куратором</span>
                </div>
                {plan.id === "vip" && <div className="vip-session-note"><Icon name="spark" size={16} /> VIP: чотири індивідуальні консультації узгоджуються окремо з куратором.</div>}
                <p className="meeting-demo-note">Це демонстраційний кабінет: координатор надішле актуальне посилання на зустріч перед заняттям.</p>
              </div>
              <div className="meeting-action">
                <span className="meeting-next-label">ОНЛАЙН-КІМНАТА</span>
                <a className="button button-gold" href="https://meet.google.com/abc-defg-hij" target="_blank" rel="noreferrer">Відкрити демо-кімнату <Icon name="external" size={16} /></a>
                <span>Google Meet · демонстраційне посилання</span>
              </div>
            </div>
          ) : (
            <div className="no-meeting-card">
              <span className="no-meeting-icon"><Icon name="book" size={25} /></span>
              <div><span className="no-meeting-label">ТАРИФ «СТАРТ»</span><h2 id="schedule-title">Навчайся у власному темпі.</h2><p>Живі зустрічі з куратором не входять до цього тарифу. Тобі доступні відеоуроки, робочі матеріали та спільнота студентів.</p></div>
              <a className="button button-outline" href={pricingHref}>Переглянути формати <Icon name="arrow" size={16} /></a>
            </div>
          )}
        </div>
      </section>

      <section className="cabinet-content" id="learning">
        <div className="container cabinet-content-grid">
          <LearningProgress purchaseId={purchaseId} courseId={course.id} />
          <aside className="mentor-note-card">
            <div className="mentor-note-top"><span className="mentor-avatar">{course.mentor.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><span className="mentor-message-label">ВІД ТВОГО КУРАТОРА</span></div>
            <Icon name="quote" size={25} />
            <h2>Починай з дії — ясність приходить у процесі.</h2>
            <p>Не чекай ідеального моменту. Обери один маленький крок і зроби його сьогодні. Я поруч, якщо потрібна підтримка.</p>
            <span className="mentor-signature">{course.mentor}<small>куратор програми</small></span>
          </aside>
        </div>
      </section>

      <section className="video-library-section" id="videos" aria-labelledby="videos-title">
        <div className="container">
          <div className="section-heading section-heading-light video-library-heading">
            <div><p className="eyebrow eyebrow-dark"><span className="eyebrow-line" /> Відеобібліотека</p><h2 id="videos-title">ЗАПИСИ УРОКІВ І ЗУСТРІЧЕЙ</h2></div>
            <p className="video-library-intro">Тут з’являтимуться записи відеоуроків і живих зустрічей з куратором після занять.</p>
          </div>
          <div className="video-grid">
            {curatorVideos.map((video, index) => (
              <article className="video-card" key={video.videoId}>
                <div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${video.videoId}?rel=0`} title={video.title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
                <div className="video-card-copy"><span className="video-card-number">0{index + 1} <i /> РЕКОМЕНДАЦІЯ КУРАТОРА</span><h3>{video.title}</h3><div><span>{video.speaker}</span><span>{video.length}</span></div></div>
              </article>
            ))}
            <article className="curator-placeholder-card">
              <Image
                src="/images/masterclass.jpg"
                alt="Онлайн-школа фінансової грамотності FinEd"
                fill
                sizes="(max-width: 850px) 100vw, 33vw"
              />
              <div className="curator-placeholder-shade" />
              <div className="curator-placeholder-content"><span className="video-card-number">03 <i /> ЗАПИС ЗУСТРІЧІ</span><span className="placeholder-play"><Icon name="play" size={22} /></span><h3>Наступна зустріч із куратором</h3><p>Запис з’явиться після завершення живого заняття.</p></div>
            </article>
          </div>
          <p className="video-demo-caption"><Icon name="spark" size={16} /> Відеоуроки в цьому кабінеті — приклад навчальної бібліотеки. Особисті записи школи додаються координатором.</p>
        </div>
      </section>

      <section className="cabinet-support-section" id="support">
        <div className="container support-card">
          <span className="support-icon"><Icon name="headphones" size={25} /></span>
          <div><p className="eyebrow eyebrow-dark"><span className="eyebrow-line" /> Ми поруч</p><h2>Потрібна допомога?</h2><p>Куратор підкаже, де знайти матеріали й як підготуватися до наступного заняття.</p></div>
          <a className="button button-outline" href={contactLink}>Написати куратору <Icon name="arrow" size={16} /></a>
        </div>
      </section>

      <footer className="site-footer cabinet-footer">
        <div className="container footer-main">
          <div className="footer-brand-wrap"><a className="brand" href={home}><img className="brand-logo" src={withBasePath("/images/fined-logo-light.svg")} alt="FinEd — Фінансова освіта" width={200} height={108} /></a><p>Освіта. Люди. Можливості.</p></div>
          <div className="cabinet-footer-caption">Твій наступний рівень<br /><span>починається з дії.</span></div>
          <a className="cabinet-home-link" href={home}>Повернутися на сайт <Icon name="arrow" size={15} /></a>
        </div>
        <div className="container footer-bottom"><span>© 2026 FinEd</span><span>Твій навчальний простір</span><a href="#learning">До навчання ↑</a></div>
      </footer>
    </main>
  );
}
